"use client";

import { Button } from "@heroui/button";
import { Switch } from "@heroui/switch";
import NextLink from "next/link";
import { Icon } from "@iconify/react";
import { useState } from "react";

export default function PricingPage() {
  const [isYearly, setIsYearly] = useState(false);

  const monthlyPrice = 29;
  const yearlyPrice = 290; // 2 mois gratuits
  const yearlyMonthlyEquivalent = (yearlyPrice / 12).toFixed(2);

  return (
    <div className="flex flex-col gap-20 py-8 md:py-10">
      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center gap-8 text-center">
        <div className="max-w-6xl">
          <p className="text-lg md:text-xl text-default-600">
            One plan with everything you need to become a better trader. No
            hidden fees, cancel anytime.
          </p>
        </div>
      </section>

      {/* Pricing Toggle */}
      <section className="flex flex-col items-center gap-12">
        <div className="flex items-center gap-4 p-2 rounded-2xl border border-divider bg-default-50">
          <span
            className={`px-6 py-3 text-lg font-semibold transition-colors ${
              !isYearly ? "text-primary" : "text-default-600"
            }`}
          >
            Monthly
          </span>
          <Switch
            isSelected={isYearly}
            onValueChange={setIsYearly}
            size="lg"
            color="primary"
          />
          <span
            className={`px-6 py-3 text-lg font-semibold transition-colors ${
              isYearly ? "text-primary" : "text-default-600"
            }`}
          >
            Yearly
            <span className="ml-2 text-sm bg-primary/10 text-primary px-2 py-1 rounded-full">
              Save 17%
            </span>
          </span>
        </div>

        {/* Pricing Card */}
        <div className="w-full max-w-2xl">
          <div className="relative p-12 rounded-3xl border-2 border-primary bg-default-50">
            {/* Most Popular Badge */}
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
              <div className="px-6 py-2 rounded-full bg-primary text-white text-sm font-semibold">
                Most Popular
              </div>
            </div>

            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-4">Vizion Pro</h2>
              <div className="flex items-baseline justify-center gap-2 mb-4">
                <span className="text-6xl font-bold text-primary">
                  ${isYearly ? yearlyMonthlyEquivalent : monthlyPrice}
                </span>
                <span className="text-2xl text-default-600">/month</span>
              </div>
              {isYearly && (
                <p className="text-default-600">
                  Billed ${yearlyPrice} annually
                </p>
              )}
            </div>

            {/* Features List */}
            <div className="space-y-4 mb-8">
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
                    className="text-success text-xl mt-0.5 flex-shrink-0"
                  />
                  <span className="text-default-600">{feature}</span>
                </div>
              ))}
            </div>

            {/* CTA Button */}
            <Button
              as={NextLink}
              href="/signup"
              size="lg"
              color="primary"
              className="w-full font-semibold text-lg"
            >
              Start 14-Day Free Trial
            </Button>

            <p className="text-center text-sm text-default-500 mt-4">
              No credit card required • Cancel anytime
            </p>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="flex flex-col items-center gap-12">
        <div className="text-center max-w-6xl">
          <h2 className="text-2xl md:text-xl font-bold mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-xl text-default-600">
            Got questions? We've got answers.
          </p>
        </div>

        <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            {
              question: "Can I cancel anytime?",
              answer:
                "Yes! You can cancel your subscription at any time. No questions asked, no cancellation fees.",
            },
            {
              question: "Is the free trial really free?",
              answer:
                "Absolutely! 14 days, full access to all features. No credit card required to start.",
            },
            {
              question: "What payment methods do you accept?",
              answer:
                "We accept all major credit cards (Visa, MasterCard, Amex) and PayPal for your convenience.",
            },
            {
              question: "Can I switch between monthly and yearly?",
              answer:
                "Yes, you can upgrade or downgrade your plan at any time. Changes will be reflected in your next billing cycle.",
            },
            {
              question: "Do you offer refunds?",
              answer:
                "Yes! If you're not satisfied within the first 30 days, we'll give you a full refund, no questions asked.",
            },
            {
              question: "Is my data secure?",
              answer:
                "We use bank-level encryption to protect your data. Your trading information is stored securely and never shared.",
            },
          ].map((faq, index) => (
            <div
              key={index}
              className="p-6 rounded-xl border border-divider bg-default-50"
            >
              <h3 className="text-lg font-bold mb-3">{faq.question}</h3>
              <p className="text-default-600">{faq.answer}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="flex flex-col items-center gap-8 text-center p-16 rounded-3xl border border-divider bg-default-50 max-w-6xl mx-auto">
        <h2 className="text-2xl md:text-xl font-bold max-w-6xl">
          Ready to Transform Your Trading?
        </h2>
        <p className="text-xl text-default-600 max-w-2xl">
          Join thousands of traders who are using Vizion to track, analyze, and
          improve their performance.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
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
      </section>
    </div>
  );
}
