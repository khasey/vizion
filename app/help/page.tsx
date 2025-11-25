"use client";

import { Icon } from "@iconify/react";
import { Button } from "@heroui/button";
import NextLink from "next/link";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { GlowingEffect } from "@/components/ui/glowing-effect";

export default function HelpPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const helpCategories = [
    {
      icon: "mdi:rocket-launch",
      title: "Getting Started",
      description: "Learn the basics of Vizion",
      articles: [
        "How to create your account",
        "Connecting your first broker",
        "Understanding the dashboard",
        "Importing your first trades",
      ],
    },
    {
      icon: "mdi:connection",
      title: "Broker Integration",
      description: "Connect your trading accounts",
      articles: [
        "Connecting FTMO account",
        "Linking MetaTrader 4/5",
        "Auto-sync setup guide",
        "Manual trade import",
      ],
    },
    {
      icon: "mdi:chart-line",
      title: "Analytics & Reports",
      description: "Understanding your data",
      articles: [
        "Reading your equity curve",
        "Understanding win rate",
        "Profit factor explained",
        "Custom report generation",
      ],
    },
    {
      icon: "mdi:account-cog",
      title: "Account Management",
      description: "Manage your subscription",
      articles: [
        "Upgrading your plan",
        "Billing and payments",
        "Canceling subscription",
        "Data export and backup",
      ],
    },
  ];

  const faqs = [
    {
      question: "How do I connect my prop firm account?",
      answer:
        "Go to Settings > Integrations, select your prop firm from the list, and follow the authentication process. Most connections take less than 2 minutes to set up.",
    },
    {
      question: "Can I import historical trades?",
      answer:
        "Yes! You can import your entire trading history using our CSV import tool or by connecting your broker account. Historical data helps provide better analytics.",
    },
    {
      question: "Is my trading data secure?",
      answer:
        "Absolutely. We use bank-level 256-bit encryption for all data. Your information is stored securely and never shared with third parties. We're also GDPR compliant.",
    },
    {
      question: "How often do trades sync automatically?",
      answer:
        "Trades sync in real-time for supported brokers. Most trades appear in your journal within 1-2 minutes of execution.",
    },
    {
      question: "Can I track multiple prop firm accounts?",
      answer:
        "Yes! You can connect unlimited prop firm and broker accounts. Each account's performance is tracked separately and can be viewed individually or combined.",
    },
    {
      question: "What if I need help during my trial?",
      answer:
        "We offer priority email support for all trial users. Most questions are answered within 2-4 hours during business hours.",
    },
    {
      question: "How do I export my data?",
      answer:
        "Go to Settings > Data Export. You can export all your data in CSV, Excel, or PDF format. Your data is always yours to keep.",
    },
    {
      question: "Can I use Vizion on mobile?",
      answer:
        "Yes! Vizion is fully responsive and works great on mobile browsers. We're also developing native iOS and Android apps.",
    },
  ];

  const contactOptions = [
    {
      icon: "mdi:email",
      title: "Email Support",
      description: "Get help via email",
      contact: "support@vizion.trading",
      actionText: "Send Email",
      href: "mailto:support@vizion.trading",
    },
    {
      icon: "mdi:chat",
      title: "Live Chat",
      description: "Chat with our team",
      contact: "Available 9 AM - 6 PM EST",
      actionText: "Start Chat",
      href: "#",
    },
    {
      icon: "mdi:book-open",
      title: "Documentation",
      description: "Browse our guides",
      contact: "Detailed tutorials & guides",
      actionText: "View Docs",
      href: "/docs",
    },
    {
      icon: "mdi:account-group",
      title: "Community",
      description: "Join our Discord",
      contact: "Connect with traders",
      actionText: "Join Now",
      href: "#",
    },
  ];

  return (
    <div className="flex flex-col gap-12 py-4 md:py-6 px-4">
      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center gap-4 text-center max-w-4xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold">
          How Can We <span className="text-primary">Help You?</span>
        </h1>
        <p className="text-base md:text-lg text-default-600">
          Search our knowledge base or browse categories below
        </p>
        <div className="w-full max-w-2xl">
          <div className="relative">
            <Icon
              icon="mdi:magnify"
              className="absolute left-4 top-1/2 transform -translate-y-1/2 text-default-400 text-xl"
            />
            <Input
              type="text"
              placeholder="Search for help articles..."
              className="pl-12 h-14 text-lg"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </section>

      {/* Help Categories */}
      <section className="w-full max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Browse by Category
          </h2>
          <p className="text-lg text-default-600">
            Find answers organized by topic
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {helpCategories.map((category, index) => (
            <div key={index} className="min-h-[280px]">
              <div className="relative h-full rounded-2xl border p-2 md:rounded-3xl md:p-3 cursor-pointer">
                <GlowingEffect
                  spread={40}
                  glow={true}
                  disabled={false}
                  proximity={64}
                  inactiveZone={0.01}
                />
                <div className="relative flex h-full flex-col gap-4 overflow-hidden rounded-xl p-6 bg-white dark:bg-black border border-divider">
                  <div className="w-fit rounded-lg bg-secondary p-2">
                    <Icon
                      icon={category.icon}
                      className="text-2xl text-primary"
                    />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2 text-black dark:text-white">
                      {category.title}
                    </h3>
                    <p className="text-sm text-default-600 dark:text-neutral-400 mb-3">
                      {category.description}
                    </p>
                  </div>
                  <ul className="space-y-2">
                    {category.articles.map((article, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-2 text-sm text-default-600 dark:text-neutral-400 hover:text-primary transition-colors cursor-pointer"
                      >
                        <Icon
                          icon="mdi:chevron-right"
                          className="text-lg mt-0.5 flex-shrink-0"
                        />
                        {article}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ Section */}
      <section className="w-full max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-lg text-default-600">
            Quick answers to common questions
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {faqs.map((faq, index) => (
            <Card
              key={index}
              className="hover:shadow-md transition-shadow cursor-pointer"
            >
              <CardHeader>
                <div className="flex items-start gap-3">
                  <Icon
                    icon="mdi:help-circle"
                    className="text-primary text-2xl mt-1 flex-shrink-0"
                  />
                  <CardTitle className="text-lg">{faq.question}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-default-600 pl-8">{faq.answer}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Contact Options */}
      <section className="w-full max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Still Need Help?
          </h2>
          <p className="text-lg text-default-600">
            Choose the best way to reach us
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {contactOptions.map((option, index) => (
            <div key={index} className="relative min-h-[300px]">
              <div className="relative h-full rounded-2xl border p-2 md:rounded-3xl md:p-3">
                <GlowingEffect
                  spread={40}
                  glow={true}
                  disabled={false}
                  proximity={64}
                  inactiveZone={0.01}
                />
                <div className="relative flex h-full flex-col gap-4 overflow-hidden rounded-xl p-6 bg-white dark:bg-black border border-divider">
                  <div className="w-fit rounded-lg bg-secondary p-2">
                    <Icon
                      icon={option.icon}
                      className="text-2xl text-primary"
                    />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">
                      {option.title}
                    </h3>
                    <p className="text-sm text-default-600">
                      {option.description}
                    </p>
                  </div>
                  <div className="mt-auto space-y-4">
                    <p className="text-sm text-default-600">{option.contact}</p>
                    <Button
                      as={NextLink}
                      href={option.href}
                      variant="bordered"
                      className="w-full"
                    >
                      {option.actionText}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Video Tutorials Section */}
      <section className="w-full max-w-5xl mx-auto">
        <div className="relative min-h-[400px]">
          <div className="relative h-full rounded-2xl border p-2 md:rounded-3xl md:p-3">
            <GlowingEffect
              spread={40}
              glow={true}
              disabled={false}
              proximity={64}
              inactiveZone={0.01}
            />
            <div className="relative flex h-full flex-col gap-6 overflow-hidden rounded-xl p-8 bg-secondary border border-divider">
              <div className="text-center">
                <h2 className="text-3xl font-bold mb-2">Video Tutorials</h2>
                <p className="text-lg text-default-600">
                  Watch step-by-step guides to get the most out of Vizion
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  {
                    title: "Quick Start Guide",
                    duration: "5:30",
                    icon: "mdi:play-circle",
                  },
                  {
                    title: "Connect Your Prop Firm",
                    duration: "8:15",
                    icon: "mdi:play-circle",
                  },
                  {
                    title: "Advanced Analytics",
                    duration: "12:45",
                    icon: "mdi:play-circle",
                  },
                ].map((video, i) => (
                  <div
                    key={i}
                    className="flex flex-col items-center gap-3 p-6 rounded-xl border border-divider hover:border-primary hover:shadow-lg transition-all cursor-pointer group bg-white/50 dark:bg-black/50 backdrop-blur-sm"
                  >
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Icon icon={video.icon} className="text-4xl text-white" />
                    </div>
                    <h3 className="font-bold text-center">{video.title}</h3>
                    <p className="text-sm text-default-600">{video.duration}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full max-w-4xl mx-auto">
        <Card className="bg-secondary border border-divider">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl md:text-4xl text-foreground">
              Ready to Get Started?
            </CardTitle>
            <CardDescription className="text-default-600 text-lg mt-2">
              Start your free trial today and experience the difference
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
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
              href="/docs"
              size="lg"
              variant="bordered"
              className="font-semibold"
            >
              View Documentation
            </Button>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
