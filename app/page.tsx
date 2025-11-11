"use client";

import { Button } from "@heroui/button";
import { WordRotate } from "@/components/ui/word-rotate";
import { motion } from "motion/react";
import NextLink from "next/link";
import Image from "next/image";
import { BentoDemo } from "@/components/bentoG";

export default function Home() {
  return (
    <div className="flex flex-col gap-20 py-8 md:py-10 px-4">
      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center gap-8 text-center">
        <div className="max-w-3xl">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Master Your Trading
            <span className="flex items-center justify-center gap-3 mt-2">
              <span className="text-primary">With</span>
              <WordRotate
                words={["Precision", "Insight", "Confidence"]}
                className="text-4xl md:text-6xl font-bold"
              />
            </span>
          </h1>
          <p className="text-lg md:text-xl text-default-600 mb-8">
            Vizion is your professional trading journal. Track, analyze, and
            improve your trading performance with advanced analytics and
            insights.
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
              href="/features"
              size="lg"
              variant="bordered"
              className="font-semibold text-lg px-8"
            >
              Explore Features
            </Button>
          </div>
        </div>
      </section>

      {/* Trusted By Section - Prop Firms & Brokers */}
      <section className="flex flex-col items-center gap-8">
        <h2 className="text-2xl md:text-xl font-bold text-center">
          Trusted by Traders Using
        </h2>

        {/* Carrousel infini avec fondu sur les côtés */}
        <div className="relative max-w-6xl overflow-hidden border rounded-3xl border-divider py-8">
          {/* Gradient de gauche */}
          <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />

          {/* Gradient de droite */}
          <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />

          <motion.div
            className="flex gap-16 whitespace-nowrap"
            animate={{
              x: [0, -1920], // Déplacement total
            }}
            transition={{
              x: {
                repeat: Infinity,
                repeatType: "loop",
                duration: 100,
                ease: "linear",
              },
            }}
          >
            {/* Premier set de logos */}
            {[
              { name: "FTMO", file: "FTMO.svg" },
              { name: "TopstepTrader", file: "FTMO.svg" },
              { name: "The5ers", file: "FTMO.svg" },
              { name: "MyForexFunds", file: "FTMO.svg" },
              { name: "Interactive Brokers", file: "FTMO.svg" },
              { name: "TD Ameritrade", file: "FTMO.svg" },
              { name: "MetaTrader", file: "FTMO.svg" },
              { name: "NinjaTrader", file: "FTMO.svg" },
            ].map((broker, index) => (
              <div
                key={`first-${index}`}
                className="flex items-center justify-center min-w-[200px] h-6"
              >
                <Image
                  src={`/propFirm/${broker.file}`}
                  alt={broker.name}
                  width={120}
                  height={40}
                  className="object-contain dark:invert"
                />
              </div>
            ))}

            {/* Duplication pour loop infini */}
            {[
              { name: "FTMO", file: "FTMO.svg" },
              { name: "TopstepTrader", file: "FTMO.svg" },
              { name: "The5ers", file: "FTMO.svg" },
              { name: "MyForexFunds", file: "FTMO.svg" },
              { name: "Interactive Brokers", file: "FTMO.svg" },
              { name: "TD Ameritrade", file: "FTMO.svg" },
              { name: "MetaTrader", file: "FTMO.svg" },
              { name: "NinjaTrader", file: "FTMO.svg" },
            ].map((broker, index) => (
              <div
                key={`second-${index}`}
                className="flex items-center justify-center min-w-[200px] h-6"
              >
                <Image
                  src={`/propFirm/${broker.file}`}
                  alt={broker.name}
                  width={120}
                  height={40}
                  className="object-contain dark:invert"
                />
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Key Features Section */}
      <section className="flex flex-col items-center gap-12">
        <div className="text-center max-w-3xl">
          <h2 className="text-2xl md:text-xl font-bold">
            Everything You Need to Succeed
          </h2>
          <p className="text-xl text-default-600">
            Powerful features designed to help you become a better trader
          </p>
        </div>
        <div className="w-full max-w-6xl">
          <BentoDemo />
        </div>
      </section>

      {/* How It Works Section */}
      <section className="flex flex-col items-center gap-12">
        <div className="text-center max-w-3xl">
          <h2 className="text-2xl md:text-xl font-bold mb-4">
            Simple, Yet Powerful
          </h2>
          <p className="text-xl text-default-600">
            Start tracking your trades in minutes
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-6xl">
          <div className="flex flex-col items-center text-center gap-4 p-8 rounded-xl border border-divider bg-default-50">
            <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center text-2xl font-bold text-white">
              1
            </div>
            <h3 className="text-xl font-bold">Connect Your Account</h3>
            <p className="text-default-600">
              Link your broker or prop firm account to automatically import your
              trades.
            </p>
          </div>
          <div className="flex flex-col items-center text-center gap-4 p-8 rounded-xl border border-divider bg-default-50">
            <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center text-2xl font-bold text-white">
              2
            </div>
            <h3 className="text-xl font-bold">Review & Analyze</h3>
            <p className="text-default-600">
              Add notes, tags, and context to your trades. Review your
              performance metrics.
            </p>
          </div>
          <div className="flex flex-col items-center text-center gap-4 p-8 rounded-xl border border-divider bg-default-50">
            <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center text-2xl font-bold text-white">
              3
            </div>
            <h3 className="text-xl font-bold">Improve & Grow</h3>
            <p className="text-default-600">
              Use insights to refine your strategy and become a consistently
              profitable trader.
            </p>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="flex flex-col items-center gap-12">
        <div className="text-center max-w-3xl">
          <h2 className="text-2xl md:text-xl font-bold mb-4">
            Loved by Traders Worldwide
          </h2>
          <p className="text-xl text-default-600">
            See what our users are saying about Vizion
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-6xl">
          <div className="p-8 rounded-xl border border-divider bg-default-50">
            <p className="text-default-600 mb-6">
              "Vizion transformed my trading. The analytics helped me identify
              my mistakes and improve my win rate by 25%."
            </p>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-bold">
                JD
              </div>
              <div>
                <p className="font-bold">John Doe</p>
                <p className="text-sm text-default-600">Day Trader</p>
              </div>
            </div>
          </div>

          <div className="p-8 rounded-xl border border-divider bg-default-50">
            <p className="text-default-600 mb-6">
              "The auto-import feature saves me hours every week. I can focus on
              trading instead of manual data entry."
            </p>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-bold">
                SM
              </div>
              <div>
                <p className="font-bold">Sarah Miller</p>
                <p className="text-sm text-default-600">Forex Trader</p>
              </div>
            </div>
          </div>

          <div className="p-8 rounded-xl border border-divider bg-default-50">
            <p className="text-default-600 mb-6">
              "Best trading journal I've used. Clean interface, powerful
              analytics, and excellent support team."
            </p>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-bold">
                MJ
              </div>
              <div>
                <p className="font-bold">Michael Johnson</p>
                <p className="text-sm text-default-600">Prop Trader</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="flex flex-col items-center gap-8 text-center p-16 rounded-3xl border border-divider bg-default-50">
        <h2 className="text-2xl md:text-xl font-bold max-w-3xl">
          Ready to Take Your Trading to the Next Level?
        </h2>
        <p className="text-xl text-default-600 max-w-2xl">
          Join thousands of traders who are already using Vizion to improve
          their performance.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <Button
            as={NextLink}
            href="/signup"
            size="lg"
            color="primary"
            className="font-semibold text-lg px-8"
          >
            Start Your Free Trial
          </Button>
          <Button
            as={NextLink}
            href="/pricing"
            size="lg"
            variant="bordered"
            className="font-semibold text-lg px-8"
          >
            View Pricing
          </Button>
        </div>
        <p className="text-sm text-default-500">
          No credit card required • 14-day free trial • Cancel anytime
        </p>
      </section>
    </div>
  );
}
