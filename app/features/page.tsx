"use client";

import { Button } from "@heroui/button";
import NextLink from "next/link";
import { Icon } from "@iconify/react";

export default function FeaturesPage() {
  return (
    <div className="flex flex-col gap-20 py-8 md:py-10">
      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center gap-8 text-center">
        <div className="max-w-6xl">
          <p className="text-lg md:text-xl text-default-600">
            Vizion combines cutting-edge technology with intuitive design to
            give you the ultimate trading journal experience.
          </p>
        </div>
      </section>

      {/* Main Features - Bento Grid */}
      <section className="flex flex-col items-center gap-12">
        <div className="text-center max-w-6xl">
          <h2 className="text-2xl md:text-xl font-bold mb-4">
            Our Most Innovative Features
          </h2>
          <p className="text-xl text-default-600">
            Powerful tools that set Vizion apart from traditional trading
            journals
          </p>
        </div>

        <div className="w-full max-w-6xl grid auto-rows-[22rem] grid-cols-3 gap-4">
          {/* Feature 1 - Equity Curve Analysis */}
          <div className="col-span-3 lg:col-span-2 rounded-xl border border-divider bg-default-50 p-8 flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <Icon icon="mdi:chart-line" className="text-primary text-2xl" />
              </div>
              <h3 className="text-2xl font-bold mb-3">Advanced Equity Curve</h3>
              <p className="text-default-600 text-lg mb-4">
                Visualize your trading performance over time with our
                interactive equity curve. Track drawdowns, identify winning
                streaks, and understand your risk-adjusted returns with
                precision.
              </p>
            </div>
            <div className="flex items-center gap-2 text-sm text-default-500">
              <Icon icon="mdi:check-circle" className="text-success" />
              <span>
                Real-time updates • Multiple timeframes • Customizable
              </span>
            </div>
          </div>

          {/* Feature 2 - AI Direction Predictor */}
          <div className="col-span-3 lg:col-span-1 rounded-xl border border-divider bg-default-50 p-8 flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <Icon icon="mdi:brain" className="text-primary text-2xl" />
              </div>
              <h3 className="text-xl font-bold mb-3">AI Market Predictor</h3>
              <p className="text-default-600 mb-4">
                Get AI-powered daily market direction predictions based on
                historical patterns and market conditions.
              </p>
            </div>
            <div className="flex items-center gap-2 text-sm text-default-500">
              <Icon icon="mdi:check-circle" className="text-success" />
              <span>Machine Learning</span>
            </div>
          </div>

          {/* Feature 3 - Strategy Ratio Tracking */}
          <div className="col-span-3 lg:col-span-1 rounded-xl border border-divider bg-default-50 p-8 flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <Icon icon="mdi:target" className="text-primary text-2xl" />
              </div>
              <h3 className="text-xl font-bold mb-3">Strategy Performance</h3>
              <p className="text-default-600 mb-4">
                Track win/loss ratios and performance metrics for each trading
                strategy. Identify which approaches work best.
              </p>
            </div>
            <div className="flex items-center gap-2 text-sm text-default-500">
              <Icon icon="mdi:check-circle" className="text-success" />
              <span>Multi-strategy</span>
            </div>
          </div>

          {/* Feature 4 - Risk Management Dashboard */}
          <div className="col-span-3 lg:col-span-2 rounded-xl border border-divider bg-default-50 p-8 flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <Icon
                  icon="mdi:shield-check"
                  className="text-primary text-2xl"
                />
              </div>
              <h3 className="text-2xl font-bold mb-3">Risk Management Suite</h3>
              <p className="text-default-600 text-lg mb-4">
                Monitor your risk metrics in real-time. Set daily loss limits,
                track position sizing, and ensure you stay within your risk
                parameters with automatic alerts.
              </p>
            </div>
            <div className="flex items-center gap-2 text-sm text-default-500">
              <Icon icon="mdi:check-circle" className="text-success" />
              <span>
                Automated alerts • Position sizing calculator • Daily limits
              </span>
            </div>
          </div>

          {/* Feature 5 - Trade Psychology Insights */}
          <div className="col-span-3 rounded-xl border border-divider bg-default-50 p-8 flex flex-col lg:flex-row gap-8 justify-between">
            <div className="flex-1">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <Icon
                  icon="mdi:head-lightbulb"
                  className="text-primary text-2xl"
                />
              </div>
              <h3 className="text-2xl font-bold mb-3">
                Trading Psychology Tracker
              </h3>
              <p className="text-default-600 text-lg mb-4">
                Journal your emotions and mental state for each trade. Identify
                psychological patterns that impact your performance and develop
                better trading discipline.
              </p>
            </div>
            <div className="flex items-center gap-2 text-sm text-default-500 lg:items-end">
              <Icon icon="mdi:check-circle" className="text-success" />
              <span>Emotion tracking • Pattern recognition • Mental game</span>
            </div>
          </div>
        </div>
      </section>

      {/* Additional Features Section */}
      <section className="flex flex-col items-center gap-12">
        <div className="text-center max-w-6xl">
          <h2 className="text-2xl md:text-xl font-bold mb-4">
            And So Much More...
          </h2>
          <p className="text-xl text-default-600">
            We're constantly developing new features to help you succeed
          </p>
        </div>

        <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            {
              icon: "mdi:upload",
              title: "Auto Trade Import",
              description:
                "Connect your broker and automatically import all your trades",
            },
            {
              icon: "mdi:tag-multiple",
              title: "Smart Tagging System",
              description:
                "Organize trades with custom tags and categories for easy filtering",
            },
            {
              icon: "mdi:calendar-month",
              title: "Session Analysis",
              description:
                "Track performance by trading session (London, New York, Asia)",
            },
            {
              icon: "mdi:image-multiple",
              title: "Chart Screenshots",
              description:
                "Attach chart screenshots to trades for better review and analysis",
            },
            {
              icon: "mdi:file-chart",
              title: "Custom Reports",
              description:
                "Generate detailed performance reports with exportable data",
            },
            {
              icon: "mdi:webhook",
              title: "API Integration",
              description:
                "Connect with your favorite tools via our robust API",
            },
            {
              icon: "mdi:calendar-check",
              title: "Economic Calendar",
              description:
                "Stay informed with integrated economic events and news",
            },
            {
              icon: "mdi:forum",
              title: "Community Features",
              description:
                "Share insights and learn from other successful traders",
            },
            {
              icon: "mdi:trophy",
              title: "Goals & Milestones",
              description:
                "Set trading goals and track your progress towards them",
            },
          ].map((feature, index) => (
            <div
              key={index}
              className="p-6 rounded-xl border border-divider bg-default-50 hover:border-primary/50 transition-colors"
            >
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-3">
                <Icon icon={feature.icon} className="text-primary text-xl" />
              </div>
              <h3 className="text-lg font-bold mb-2">{feature.title}</h3>
              <p className="text-sm text-default-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Coming Soon Section */}
      <section className="flex flex-col items-center gap-8 p-16 rounded-3xl border border-divider bg-default-50 max-w-6xl mx-auto">
        <div className="text-center max-w-6xl">
          <div className="inline-block px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-4">
            Coming Soon
          </div>
          <h2 className="text-2xl md:text-xl font-bold mb-4">
            The Future of Trading Journals
          </h2>
          <p className="text-xl text-default-600 mb-8">
            We're constantly innovating and adding new features based on trader
            feedback. Join our community to help shape the future of Vizion.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              as={NextLink}
              href="/signup"
              size="lg"
              color="primary"
              className="font-semibold text-lg px-8"
            >
              Start Free Trial
            </Button>
            <Button
              as={NextLink}
              href="/roadmap"
              size="lg"
              variant="bordered"
              className="font-semibold text-lg px-8"
            >
              View Roadmap
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
