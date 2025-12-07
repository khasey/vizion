'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import type { Trade } from '@/types/trades'

export async function uploadTrades(trades: Trade[]) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Non authentifié' }
  }

  // Insert trades into database
  const { data, error } = await supabase
    .from('trades')
    .insert(trades)
    .select()

  if (error) {
    console.error('Error uploading trades:', error)
    return { error: error.message }
  }

  revalidatePath('/dashboard/trades')
  return { data, success: true }
}

export async function getTrades(limit?: number) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Non authentifié' }
  }

  let query = supabase
    .from('trades')
    .select('*')
    .eq('user_id', user.id)
    .order('trade_date', { ascending: false })

  if (limit) {
    query = query.limit(limit)
  }

  const { data, error } = await query

  if (error) {
    console.error('Error fetching trades:', error)
    return { error: error.message }
  }

  return { data }
}

export async function deleteTrade(id: string) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Non authentifié' }
  }

  const { error } = await supabase
    .from('trades')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) {
    console.error('Error deleting trade:', error)
    return { error: error.message }
  }

  revalidatePath('/dashboard/trades')
  return { success: true }
}

export async function updateTradeStrategy(tradeId: string, strategyId: string | null) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Non authentifié' }
  }

  const { data, error } = await supabase
    .from('trades')
    .update({ strategy_id: strategyId })
    .eq('id', tradeId)
    .eq('user_id', user.id)
    .select()
    .single()

  if (error) {
    console.error('Error updating trade strategy:', error)
    return { error: error.message }
  }

  // Update strategy stats if a strategy was assigned
  if (strategyId) {
    await updateStrategyStatsForStrategy(strategyId)
  }

  revalidatePath('/dashboard/trades')
  return { data, success: true }
}

async function updateStrategyStatsForStrategy(strategyId: string) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return

  // Get all trades for this strategy
  const { data: trades, error: tradesError } = await supabase
    .from('trades')
    .select('profit_loss')
    .eq('user_id', user.id)
    .eq('strategy_id', strategyId)

  if (tradesError || !trades) return

  // Calculate stats
  const totalTrades = trades.length
  const winningTrades = trades.filter((t) => t.profit_loss > 0).length
  const losingTrades = trades.filter((t) => t.profit_loss < 0).length
  const totalPnl = trades.reduce((sum, t) => sum + t.profit_loss, 0)
  const winRate = totalTrades > 0 ? (winningTrades / totalTrades) * 100 : 0

  // Update strategy with calculated stats
  await supabase
    .from('strategies')
    .update({
      total_trades: totalTrades,
      winning_trades: winningTrades,
      losing_trades: losingTrades,
      total_pnl: totalPnl,
      win_rate: winRate,
    })
    .eq('id', strategyId)
    .eq('user_id', user.id)
}
