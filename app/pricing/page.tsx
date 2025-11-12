"use client";

import { Button } from "@heroui/button";
import { Switch } from "@heroui/switch";
import NextLink from "next/link";
import { Icon } from "@iconify/react";
import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { GlowingEffect } from "@/components/ui/glowing-effect";

export default function PricingPage() {
  const [isYearly, setIsYearly] = useState(false);

  const monthlyPrice = 29;
  const yearlyPrice = 290; // 2 mois gratuits
  const yearlyMonthlyEquivalent = (yearlyPrice / 12).toFixed(2);

  return (
    <div className="flex flex-col gap-12 py-4 md:py-6 px-4">
      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center gap-3 text-center">
        <div className="max-w-6xl">
          <p className="text-sm md:text-base text-default-600">
            One plan with everything you need to become a better trader. No
            hidden fees, cancel anytime.
          </p>
        </div>
      </section>

      {/* Pricing Toggle */}
      <section className="flex flex-col items-center gap-8">
        <div className="flex items-center gap-3 p-1.5 rounded-xl border border-divider bg-default-50">
          <span
            className={`px-4 py-2 text-sm font-semibold transition-colors ${
              !isYearly ? "text-primary" : "text-default-600"
            }`}
          >
            Monthly
          </span>
          <Switch
            isSelected={isYearly}
            onValueChange={setIsYearly}
            size="md"
            color="primary"
          />
          <span
            className={`px-4 py-2 text-sm font-semibold transition-colors ${
              isYearly ? "text-primary" : "text-default-600"
            }`}
          >
            Yearly
            <span className="ml-2 text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
              Save 17%
            </span>
          </span>
        </div>

        {/* Pricing Card */}
        <div className="w-full max-w-3xl">
          <Card className="relative border-2 border-primary shadow-lg">
            {/* Most Popular Badge */}
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
              <div className="px-4 py-1 rounded-full bg-primary text-white text-xs font-semibold">
                Most Popular
              </div>
            </div>

            <CardHeader className="text-center pb-4">
              <CardTitle className="text-2xl">Vizion Pro</CardTitle>
              <div className="flex items-baseline justify-center gap-2 mt-4">
                <span className="text-5xl font-bold text-primary">
                  ${isYearly ? yearlyMonthlyEquivalent : monthlyPrice}
                </span>
                <span className="text-xl text-default-600">/month</span>
              </div>
              {isYearly && (
                <CardDescription className="mt-2">
                  Billed ${yearlyPrice} annually
                </CardDescription>
              )}
            </CardHeader>

            <CardContent className="space-y-3">
              {[
                "Advanced Equity Curve Analysis",
                "AI Market Direction Predictor",
                "Strategy Performance Tracking",
                "Risk Management Dashboard",
                "Trading Psychology Insights",
                "Auto Trade Import",
                "Unlimited Trade History",
                "Chart Screenshots & Notes",
                "Custom Reports & Analytics",
                "Economic Calendar Integration",
                "Mobile App Access",
                "Priority Email Support",
                "API Access",
                "Community Features",
              ].map((feature, index) => (
                <div key={index} className="flex items-start gap-3">
                  <Icon
                    icon="mdi:check-circle"
                    className="text-success text-lg mt-0.5 flex-shrink-0"
                  />
                  <span className="text-sm text-default-700">{feature}</span>
                </div>
              ))}
            </CardContent>

            <CardFooter className="flex flex-col gap-3 pt-6">
              <Button
                as={NextLink}
                href="/signup"
                size="lg"
                color="primary"
                className="w-full font-semibold"
              >
                Start 14-Day Free Trial
              </Button>
              <p className="text-center text-xs text-default-500">
                No credit card required • Cancel anytime
              </p>
            </CardFooter>
          </Card>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="flex flex-col items-center gap-8">
        <div className="text-center max-w-6xl">
          <h2 className="text-3xl font-bold mb-2">
            Frequently Asked Questions
          </h2>
          <p className="text-lg text-default-600">
            Got questions? We've got answers.
          </p>
        </div>

        <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            {
              question: "Can I cancel anytime?",
              answer:
                "Yes! You can cancel your subscription at any time. No questions asked, no cancellation fees.",
              icon: "mdi:check-circle",
            },
            {
              question: "Is the free trial really free?",
              answer:
                "Absolutely! 14 days, full access to all features. No credit card required to start.",
              icon: "mdi:gift",
            },
            {
              question: "What payment methods do you accept?",
              answer:
                "We accept all major credit cards (Visa, MasterCard, Amex) and PayPal for your convenience.",
              icon: "mdi:credit-card",
            },
            {
              question: "Can I switch between monthly and yearly?",
              answer:
                "Yes, you can upgrade or downgrade your plan at any time. Changes will be reflected in your next billing cycle.",
              icon: "mdi:sync",
            },
            {
              question: "Do you offer refunds?",
              answer:
                "Yes! If you're not satisfied within the first 30 days, we'll give you a full refund, no questions asked.",
              icon: "mdi:cash-refund",
            },
            {
              question: "Is my data secure?",
              answer:
                "We use bank-level encryption to protect your data. Your trading information is stored securely and never shared.",
              icon: "mdi:shield-lock",
            },
          ].map((faq, index) => (
            <div key={index} className="min-h-[180px]">
              <div className="relative h-full rounded-2xl border p-2 md:rounded-3xl md:p-3">
                <GlowingEffect
                  spread={40}
                  glow={true}
                  disabled={false}
                  proximity={64}
                  inactiveZone={0.01}
                />
                <div className="relative flex h-full flex-col gap-4 overflow-hidden rounded-xl p-6 bg-white dark:bg-black border border-divider">
                  <div className="flex items-start gap-3">
                    <div className="w-fit rounded-lg border border-gray-600 p-2 flex-shrink-0">
                      <Icon icon={faq.icon} className="text-xl text-black dark:text-neutral-400" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold mb-2 text-black dark:text-white">
                        {faq.question}
                      </h3>
                      <p className="text-sm text-default-600 dark:text-neutral-400">
                        {faq.answer}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-6xl mx-auto w-full">
        <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl">
              Ready to Transform Your Trading?
            </CardTitle>
            <CardDescription className="text-lg mt-2">
              Join thousands of traders who are using Vizion to track, analyze,
              and improve their performance.
            </CardDescription>
          </CardHeader>
          <CardFooter className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              as={NextLink}
              href="/signup"
              size="lg"
              color="primary"
              className="font-semibold"
            >
              Start Free Trial
            </Button>
            <Button
              as={NextLink}
              href="/features"
              size="lg"
              variant="bordered"
              className="font-semibold"
            >
              Explore Features
            </Button>
          </CardFooter>
        </Card>
      </section>
    </div>
  );
}
