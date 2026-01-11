"use client";

import { Icon } from "@iconify/react";
import { GlowingEffect } from "@/components/ui/glowing-effect";
import { Button } from "@heroui/button";
import { useState } from "react";
import { analyzeMacro, analyzeChart } from "@/app/actions/mistral";
import { FuturCard } from "@/components/ui/FuturCard";
import { FuturisticCard } from "@/components/ui/FuturisticCard";

export default function InsightsPage() {
  const [activeTab, setActiveTab] = useState<"macro" | "chart">("macro");
  
  // Macro Analysis State
  const [selectedInstrument, setSelectedInstrument] = useState("NASDAQ");
  const [macroAnalysis, setMacroAnalysis] = useState<any>(null);
  const [macroLoading, setMacroLoading] = useState(false);
  
  // Chart Analysis State
  const [chartImage, setChartImage] = useState<string | null>(null);
  const [chartQuestion, setChartQuestion] = useState("");
  const [chartAnalysis, setChartAnalysis] = useState<any>(null);
  const [chartLoading, setChartLoading] = useState(false);

  const instruments = [
    { value: "NASDAQ", label: "NASDAQ", icon: "mdi:chart-line" },
    { value: "EUR/USD", label: "EUR/USD", icon: "mdi:currency-eur" },
    { value: "GBP/USD", label: "GBP/USD", icon: "mdi:currency-gbp" },
    { value: "GOLD", label: "GOLD (XAU/USD)", icon: "mdi:gold" },
    { value: "BTC/USD", label: "Bitcoin", icon: "mdi:bitcoin" },
    { value: "SPX", label: "S&P 500", icon: "mdi:chart-areaspline" },
  ];

  const handleMacroAnalysis = async () => {
    setMacroLoading(true);
    const result = await analyzeMacro(selectedInstrument);
    
    if (result.success) {
      setMacroAnalysis(result.data);
    } else {
      alert(result.error);
    }
    
    setMacroLoading(false);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Verify it's an image
    if (!file.type.startsWith("image/")) {
      alert("Veuillez uploader une image");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setChartImage(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleChartAnalysis = async () => {
    if (!chartImage) {
      alert("Veuillez uploader un graphique");
      return;
    }

    setChartLoading(true);
    
    // Extract base64 from data URL
    const base64 = chartImage.split(",")[1];
    const result = await analyzeChart(base64, chartQuestion || undefined);
    
    if (result.success) {
      setChartAnalysis(result.data);
    } else {
      alert(result.error);
    }
    
    setChartLoading(false);
  };

  const getBiasColor = (bias: string) => {
    if (bias === "BULLISH") return "text-success";
    if (bias === "BEARISH") return "text-danger";
    return "text-warning";
  };

  const getBiasIcon = (bias: string) => {
    if (bias === "BULLISH") return "mdi:trending-up";
    if (bias === "BEARISH") return "mdi:trending-down";
    return "mdi:minus";
  };

  return (
    <div className="flex flex-col gap-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">IA Insights</h1>
          <p className="text-default-600">
            Analyse macro et graphiques avec Mistral AI
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 p-1 rounded-lg border border-gray-800/50 bg-white dark:bg-black w-fit">
        <Button
          size="sm"
          variant={activeTab === "macro" ? "solid" : "light"}
          color={activeTab === "macro" ? "primary" : "default"}
          onPress={() => setActiveTab("macro")}
        >
          <Icon icon="mdi:earth" className="text-lg" />
          Analyse Macro
        </Button>
        <Button
          size="sm"
          variant={activeTab === "chart" ? "solid" : "light"}
          color={activeTab === "chart" ? "primary" : "default"}
          onPress={() => setActiveTab("chart")}
        >
          <Icon icon="mdi:chart-candlestick" className="text-lg" />
          Analyse Graphique
        </Button>
      </div>

      {/* Macro Analysis Tab */}
      {activeTab === "macro" && (
        <div className="grid grid-cols-1 gap-6">
          {/* Instrument Selection */}
          <FuturCard className="relative rounded-2xl p-2 md:rounded-3xl md:p-3">
           
            <div className="relative flex flex-col gap-4 overflow-hidden rounded-xl p-2 bg-white dark:bg-black border-divider">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold mb-1">
                    Sélectionner un instrument
                  </h3>
                  <p className="text-sm text-default-600">
                    Obtenez une analyse macro complète en temps réel
                  </p>
                </div>
                <Button
                  color="primary"
                  onPress={handleMacroAnalysis}
                  isLoading={macroLoading}
                  isDisabled={macroLoading}
                >
                  <Icon icon="mdi:brain" className="text-xl" />
                  Analyser
                </Button>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                {instruments.map((instrument) => (
                  <div
                    key={instrument.value}
                    onClick={() => setSelectedInstrument(instrument.value)}
                    className="cursor-pointer"
                  >
                    <FuturisticCard
                      title={instrument.label}
                      value=""
                      icon={instrument.icon}
                      isPositive={selectedInstrument === instrument.value}
                    />
                  </div>
                ))}
              </div>
            </div>
          </FuturCard>

          {/* Analysis Result */}
          {macroAnalysis && (
            <div className="relative rounded-2xl border p-2 md:rounded-3xl md:p-3">
              <GlowingEffect
                spread={40}
                glow={true}
                disabled={false}
                proximity={64}
                inactiveZone={0.01}
              />
              <div className="relative flex flex-col gap-4 overflow-hidden rounded-xl p-6 bg-white dark:bg-black border border-divider">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-bold">
                      Analyse: {macroAnalysis.instrument}
                    </h3>
                    <p className="text-sm text-default-600">
                      {new Date(macroAnalysis.timestamp).toLocaleString(
                        "fr-FR"
                      )}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <p className="text-sm text-default-600">Bias</p>
                      <p
                        className={`text-xl font-bold ${getBiasColor(
                          macroAnalysis.bias
                        )}`}
                      >
                        <Icon
                          icon={getBiasIcon(macroAnalysis.bias)}
                          className="inline mr-1"
                        />
                        {macroAnalysis.bias}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-default-600">Confiance</p>
                      <p className="text-xl font-bold text-primary">
                        {macroAnalysis.confidence}%
                      </p>
                    </div>
                  </div>
                </div>

                <div className="prose prose-sm max-w-none dark:prose-invert">
                  <div
                    dangerouslySetInnerHTML={{
                      __html: macroAnalysis.analysis
                        .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
                        .replace(/\n/g, "<br />"),
                    }}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Chart Analysis Tab */}
      {activeTab === "chart" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Upload Section */}
          <div className="relative rounded-2xl  p-2 md:rounded-3xl md:p-3">
            <GlowingEffect
              spread={40}
              glow={true}
              disabled={false}
              proximity={64}
              inactiveZone={0.01}
            />
            <div className="relative flex flex-col gap-4 overflow-hidden rounded-xl p-6 bg-white dark:bg-black ">
              <div>
                <h3 className="text-xl font-bold mb-1">
                  Uploader un graphique
                </h3>
                <p className="text-sm text-default-600">
                  L'IA analysera votre graphique et vous donnera son avis
                </p>
              </div>

              {/* Image Upload */}
              <div className="border-2 border-dashed border-divider rounded-lg p-8 text-center hover:border-primary transition-colors cursor-pointer">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="chart-upload"
                />
                <label htmlFor="chart-upload" className="cursor-pointer">
                  {chartImage ? (
                    <div className="space-y-3">
                      <img
                        src={chartImage}
                        alt="Chart preview"
                        className="max-h-64 mx-auto rounded-lg"
                      />
                      <p className="text-sm text-success">
                        <Icon
                          icon="mdi:check-circle"
                          className="inline mr-1"
                        />
                        Image chargée
                      </p>
                      <Button size="sm" variant="light" color="primary">
                        Changer l'image
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <Icon
                        icon="mdi:cloud-upload"
                        className="text-5xl text-default-400 mx-auto"
                      />
                      <div>
                        <p className="text-default-700 font-medium">
                          Cliquez pour uploader
                        </p>
                        <p className="text-sm text-default-500">
                          PNG, JPG jusqu'à 10MB
                        </p>
                      </div>
                    </div>
                  )}
                </label>
              </div>

              {/* Question Input */}
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Question (optionnel)
                </label>
                <textarea
                  value={chartQuestion}
                  onChange={(e) => setChartQuestion(e.target.value)}
                  placeholder="Ex: Dois-je entrer en position maintenant ? Quel est le meilleur niveau d'entrée ?"
                  className="w-full p-3 rounded-lg border border-divider bg-transparent resize-none focus:outline-none focus:ring-2 focus:ring-primary"
                  rows={3}
                />
              </div>

              <Button
                color="primary"
                size="lg"
                onPress={handleChartAnalysis}
                isLoading={chartLoading}
                isDisabled={!chartImage || chartLoading}
                className="w-full"
              >
                <Icon icon="mdi:brain" className="text-xl" />
                Analyser le graphique
              </Button>
            </div>
          </div>

          {/* Analysis Result */}
          <div className="relative rounded-2xl border p-2 md:rounded-3xl md:p-3">
            <GlowingEffect
              spread={40}
              glow={true}
              disabled={false}
              proximity={64}
              inactiveZone={0.01}
            />
            <div className="relative flex flex-col gap-4 overflow-hidden rounded-xl p-6 bg-white dark:bg-black border border-divider">
              {chartAnalysis ? (
                <>
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-xl font-bold">Résultat d'analyse</h3>
                      <p className="text-sm text-default-600">
                        {new Date(chartAnalysis.timestamp).toLocaleString(
                          "fr-FR"
                        )}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-default-600">Recommandation</p>
                      <p
                        className={`text-xl font-bold ${
                          chartAnalysis.recommendation === "ACHAT"
                            ? "text-success"
                            : chartAnalysis.recommendation === "VENTE"
                            ? "text-danger"
                            : "text-warning"
                        }`}
                      >
                        {chartAnalysis.recommendation}
                      </p>
                      <p className="text-sm text-primary">
                        Confiance: {chartAnalysis.confidence}%
                      </p>
                    </div>
                  </div>

                  <div className="prose prose-sm max-w-none dark:prose-invert overflow-auto max-h-96">
                    <div
                      dangerouslySetInnerHTML={{
                        __html: chartAnalysis.analysis
                          .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
                          .replace(/\n/g, "<br />"),
                      }}
                    />
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-center py-12">
                  <Icon
                    icon="mdi:chart-timeline-variant"
                    className="text-5xl text-default-400 mb-3"
                  />
                  <p className="text-default-600 mb-2">
                    Aucune analyse disponible
                  </p>
                  <p className="text-sm text-default-500">
                    Uploadez un graphique pour commencer
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
