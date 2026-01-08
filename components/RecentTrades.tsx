import { Icon } from "@iconify/react";
import { GlowingEffect } from "@/components/ui/glowing-effect";
import { Button } from "@heroui/button";
import NextLink from "next/link";
import type { Trade } from "@/types/trades";

interface RecentTradesProps {
  recentTrades: Trade[];
  loading: boolean;
}

export default function RecentTrades({ recentTrades, loading }: RecentTradesProps) {
  return (
    <div className="min-h-[400px]">
      <div className="relative h-full rounded-2xl border p-2 md:rounded-3xl md:p-3">
        <GlowingEffect
          spread={40}
          glow={true}
          disabled={false}
          proximity={64}
          inactiveZone={0.01}
        />
        <div className="relative flex h-full flex-col gap-4 overflow-hidden rounded-xl p-6 bg-white dark:bg-black">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xl font-bold">Recent Trades</h3>
            <Button as={NextLink} href="/dashboard/trades" variant="light" size="sm">
              View All
            </Button>
          </div>
          <div className="space-y-3">
            {loading ? (
              <div className="text-center py-8 text-default-600">
                <Icon icon="mdi:loading" className="text-3xl animate-spin mx-auto mb-2" />
                <p className="text-sm">Chargement des trades...</p>
              </div>
            ) : recentTrades.length === 0 ? (
              <div className="text-center py-8 text-default-600">
                <Icon icon="mdi:information-outline" className="text-3xl mx-auto mb-2" />
                <p className="text-sm mb-3">Aucun trade trouvé</p>
                <Button as={NextLink} href="/dashboard/upload" color="primary" size="sm">
                  Importer des trades
                </Button>
              </div>
            ) : (
              recentTrades.map((trade, i) => (
                <div
                  key={trade.id || i}
                  className="flex items-center justify-between p-4 rounded-lg border border-divider hover:bg-blue-50 dark:hover:bg-gray-900 transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-4 flex-1">
                    <div
                      className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        trade.profit_loss >= 0 ? 'bg-success/20' : 'bg-danger/20'
                      }`}
                    >
                      <Icon
                        icon={
                          trade.side === 'long' || trade.side === 'buy'
                            ? 'mdi:arrow-up-bold'
                            : 'mdi:arrow-down-bold'
                        }
                        className={`text-xl ${trade.profit_loss >= 0 ? 'text-success' : 'text-danger'}`}
                      />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className="font-semibold font-mono">{trade.symbol}</p>
                        <span
                          className={`text-xs px-2 py-0.5 rounded-full ${
                            trade.side === 'long' || trade.side === 'buy'
                              ? 'bg-success/20 text-success'
                              : 'bg-danger/20 text-danger'
                          }`}
                        >
                          {trade.side.toUpperCase()}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-default-600 mt-1">
                        <span>Entry: {trade.entry_price.toFixed(2)}</span>
                        <span>•</span>
                        <span>Exit: {trade.exit_price.toFixed(2)}</span>
                        <span>•</span>
                        <span className="text-default-500">
                          {new Date(trade.trade_date).toLocaleDateString('fr-FR', {
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`font-semibold text-lg ${trade.profit_loss >= 0 ? 'text-success' : 'text-danger'}`}>
                      {trade.profit_loss >= 0 ? '+' : ''}
                      {trade.profit_loss.toFixed(2)}$
                    </span>
                    <p className="text-xs text-default-600 mt-1">{trade.quantity}x</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}