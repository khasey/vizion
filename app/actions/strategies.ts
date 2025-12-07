"use server";

import { createClient } from "@/lib/supabase/server";
import type { Strategy } from "@/types/strategies";

export async function getStrategies() {
  const supabase = await createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    return { error: "Not authenticated" };
  }

  const { data, error } = await supabase
    .from("strategies")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching strategies:", error);
    return { error: error.message };
  }

  return { data };
}

export async function createStrategy(strategy: Omit<Strategy, "id" | "user_id" | "created_at" | "updated_at">) {
  const supabase = await createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    return { error: "Not authenticated" };
  }

  const { data, error } = await supabase
    .from("strategies")
    .insert({
      user_id: user.id,
      name: strategy.name,
      description: strategy.description,
      color: strategy.color || "#3b82f6",
      rules: strategy.rules,
      is_active: strategy.is_active ?? true,
    })
    .select()
    .single();

  if (error) {
    console.error("Error creating strategy:", error);
    return { error: error.message };
  }

  return { data };
}

export async function updateStrategy(id: string, updates: Partial<Strategy>) {
  const supabase = await createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    return { error: "Not authenticated" };
  }

  const { data, error } = await supabase
    .from("strategies")
    .update({
      name: updates.name,
      description: updates.description,
      color: updates.color,
      rules: updates.rules,
      is_active: updates.is_active,
    })
    .eq("id", id)
    .eq("user_id", user.id)
    .select()
    .single();

  if (error) {
    console.error("Error updating strategy:", error);
    return { error: error.message };
  }

  return { data };
}

export async function deleteStrategy(id: string) {
  const supabase = await createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    return { error: "Not authenticated" };
  }

  const { error } = await supabase
    .from("strategies")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) {
    console.error("Error deleting strategy:", error);
    return { error: error.message };
  }

  return { success: true };
}

export async function getStrategyStats() {
  const supabase = await createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    return { error: "Not authenticated" };
  }

  // Get strategies with their stats
  const { data: strategies, error: strategiesError } = await supabase
    .from("strategies")
    .select("*")
    .eq("user_id", user.id)
    .order("total_pnl", { ascending: false, nullsFirst: false });

  if (strategiesError) {
    console.error("Error fetching strategy stats:", strategiesError);
    return { error: strategiesError.message };
  }

  // Get trades to calculate additional stats
  const { data: trades, error: tradesError } = await supabase
    .from("trades")
    .select("strategy_id, profit_loss, entry_price, exit_price")
    .eq("user_id", user.id)
    .not("strategy_id", "is", null);

  if (tradesError) {
    console.error("Error fetching trades for stats:", tradesError);
    return { error: tradesError.message };
  }

  // Calculate avg R/R for each strategy
  const strategyStats = strategies.map((strategy) => {
    const strategyTrades = trades?.filter((t) => t.strategy_id === strategy.id) || [];
    
    // Calculate average R/R (simplified: abs(profit_loss) / abs(entry_price - exit_price))
    let avgRR = 0;
    if (strategyTrades.length > 0) {
      const rrSum = strategyTrades.reduce((sum, trade) => {
        const priceDiff = Math.abs((trade.entry_price || 0) - (trade.exit_price || 0));
        if (priceDiff > 0) {
          return sum + Math.abs(trade.profit_loss) / priceDiff;
        }
        return sum;
      }, 0);
      avgRR = rrSum / strategyTrades.length;
    }

    return {
      id: strategy.id,
      name: strategy.name,
      color: strategy.color || "#3b82f6",
      description: strategy.description,
      total_trades: strategy.total_trades || 0,
      winning_trades: strategy.winning_trades || 0,
      losing_trades: strategy.losing_trades || 0,
      total_pnl: Number(strategy.total_pnl) || 0,
      win_rate: Number(strategy.win_rate) || 0,
      avg_rr: Number(avgRR.toFixed(2)),
      is_active: strategy.is_active ?? true,
    };
  });

  return { data: strategyStats };
}

export async function updateStrategyStats(strategyId: string) {
  const supabase = await createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    return { error: "Not authenticated" };
  }

  // Get all trades for this strategy
  const { data: trades, error: tradesError } = await supabase
    .from("trades")
    .select("profit_loss")
    .eq("user_id", user.id)
    .eq("strategy_id", strategyId);

  if (tradesError) {
    console.error("Error fetching trades:", tradesError);
    return { error: tradesError.message };
  }

  if (!trades || trades.length === 0) {
    // Update to zero stats
    const { error } = await supabase
      .from("strategies")
      .update({
        total_trades: 0,
        winning_trades: 0,
        losing_trades: 0,
        total_pnl: 0,
        win_rate: 0,
      })
      .eq("id", strategyId)
      .eq("user_id", user.id);

    if (error) {
      return { error: error.message };
    }

    return { success: true };
  }

  // Calculate stats
  const totalTrades = trades.length;
  const winningTrades = trades.filter((t) => t.profit_loss > 0).length;
  const losingTrades = trades.filter((t) => t.profit_loss < 0).length;
  const totalPnl = trades.reduce((sum, t) => sum + t.profit_loss, 0);
  const winRate = totalTrades > 0 ? (winningTrades / totalTrades) * 100 : 0;

  // Update strategy with calculated stats
  const { error } = await supabase
    .from("strategies")
    .update({
      total_trades: totalTrades,
      winning_trades: winningTrades,
      losing_trades: losingTrades,
      total_pnl: totalPnl,
      win_rate: winRate,
    })
    .eq("id", strategyId)
    .eq("user_id", user.id);

  if (error) {
    console.error("Error updating strategy stats:", error);
    return { error: error.message };
  }

  return { success: true };
}
