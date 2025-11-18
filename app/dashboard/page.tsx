"use client";

import { Icon } from "@iconify/react";
import { useState } from "react";
import NextLink from "next/link";
import { Button } from "@heroui/button";
import { GlowingEffect } from "@/components/ui/glowing-effect";

export default function DashboardPage() {
  return (
    <>
      {/* Header */}
      <header className="h-16 bg-white dark:bg-black border-b border-divider flex items-center justify-between px-6">
        <div>
          <h2 className="text-2xl font-bold">Welcome back, John!</h2>
          <p className="text-sm text-default-600">
            Here's your trading overview
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button isIconOnly variant="light">
            <Icon icon="mdi:bell" className="text-xl" />
          </Button>
          <Button isIconOnly variant="light">
            <Icon icon="mdi:help-circle" className="text-xl" />
          </Button>
        </div>
      </header>

      {/* Dashboard Content */}
      <div className="p-6 space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              icon: "mdi:currency-usd",
              label: "Total Profit",
              value: "$12,458",
              change: "+12.5%",
              positive: true,
            },
            {
              icon: "mdi:chart-line",
              label: "Win Rate",
              value: "68.5%",
              change: "+8.2%",
              positive: true,
            },
            {
              icon: "mdi:swap-horizontal",
              label: "Total Trades",
              value: "142",
              change: "This month",
              positive: null,
            },
            {
              icon: "mdi:trending-up",
              label: "Profit Factor",
              value: "2.8",
              change: "+5.1%",
              positive: true,
            },
          ].map((stat, index) => (
            <div key={index} className="min-h-[140px]">
              <div className="relative h-full rounded-2xl border p-2 md:rounded-3xl md:p-3">
                <GlowingEffect
                  spread={40}
                  glow={true}
                  disabled={false}
                  proximity={64}
                  inactiveZone={0.01}
                />
                <div className="relative flex h-full flex-col gap-4 overflow-hidden rounded-xl p-6 bg-white dark:bg-black border border-divider">
                  <div className="flex items-center justify-between">
                    <div className="w-fit rounded-lg border border-gray-600 p-2">
                      <Icon
                        icon={stat.icon}
                        className="text-xl text-black dark:text-neutral-400"
                      />
                    </div>
                    <span
                      className={`text-xs font-semibold ${
                        stat.positive === true
                          ? "text-success"
                          : stat.positive === false
                            ? "text-danger"
                            : "text-default-600"
                      }`}
                    >
                      {stat.change}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold mb-1">{stat.value}</h3>
                    <p className="text-sm text-default-600">{stat.label}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Recent Trades & Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Trades */}
          <div className="lg:col-span-2 min-h-[400px]">
            <div className="relative h-full rounded-2xl border p-2 md:rounded-3xl md:p-3">
              <GlowingEffect
                spread={40}
                glow={true}
                disabled={false}
                proximity={64}
                inactiveZone={0.01}
              />
              <div className="relative flex h-full flex-col gap-4 overflow-hidden rounded-xl p-6 bg-white dark:bg-black border border-divider">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xl font-bold">Recent Trades</h3>
                  <Button
                    as={NextLink}
                    href="/dashboard/trades"
                    variant="light"
                    size="sm"
                  >
                    View All
                  </Button>
                </div>
                <div className="space-y-4">
                  {[
                    {
                      pair: "EUR/USD",
                      type: "Long",
                      profit: "+$245.50",
                      positive: true,
                    },
                    {
                      pair: "GBP/JPY",
                      type: "Short",
                      profit: "-$82.30",
                      positive: false,
                    },
                    {
                      pair: "XAU/USD",
                      type: "Long",
                      profit: "+$512.00",
                      positive: true,
                    },
                    {
                      pair: "USD/CAD",
                      type: "Short",
                      profit: "+$128.75",
                      positive: true,
                    },
                  ].map((trade, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between p-4 rounded-lg border border-divider hover:bg-default-50 dark:hover:bg-default-800 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-lg bg-default-100 dark:bg-default-800 flex items-center justify-center">
                          <Icon
                            icon="mdi:chart-candlestick"
                            className="text-xl"
                          />
                        </div>
                        <div>
                          <p className="font-semibold">{trade.pair}</p>
                          <p className="text-sm text-default-600">
                            {trade.type}
                          </p>
                        </div>
                      </div>
                      <span
                        className={`font-semibold ${
                          trade.positive ? "text-success" : "text-danger"
                        }`}
                      >
                        {trade.profit}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="min-h-[400px]">
            <div className="relative h-full rounded-2xl border p-2 md:rounded-3xl md:p-3">
              <GlowingEffect
                spread={40}
                glow={true}
                disabled={false}
                proximity={64}
                inactiveZone={0.01}
              />
              <div className="relative flex h-full flex-col gap-4 overflow-hidden rounded-xl p-6 bg-white dark:bg-black border border-divider">
                <h3 className="text-xl font-bold mb-2">Quick Actions</h3>
                <div className="space-y-3">
                  <Button
                    as={NextLink}
                    href="/dashboard/trades/new"
                    className="w-full justify-start"
                    color="primary"
                  >
                    <Icon icon="mdi:plus" className="text-xl" />
                    Add New Trade
                  </Button>
                  <Button
                    as={NextLink}
                    href="/dashboard/brokers"
                    className="w-full justify-start"
                    variant="bordered"
                  >
                    <Icon icon="mdi:connection" className="text-xl" />
                    Connect Broker
                  </Button>
                  <Button
                    as={NextLink}
                    href="/dashboard/reports"
                    className="w-full justify-start"
                    variant="bordered"
                  >
                    <Icon icon="mdi:file-export" className="text-xl" />
                    Export Report
                  </Button>
                  <Button
                    as={NextLink}
                    href="/dashboard/analytics"
                    className="w-full justify-start"
                    variant="bordered"
                  >
                    <Icon icon="mdi:chart-bar" className="text-xl" />
                    View Analytics
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
