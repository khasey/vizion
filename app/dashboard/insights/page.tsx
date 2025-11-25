"use client";

import { Icon } from "@iconify/react";
import { GlowingEffect } from "@/components/ui/glowing-effect";
import { Button } from "@heroui/button";
import NextLink from "next/link";
import { useState, useMemo } from "react";

// Mock function to simulate AI analysis
function generateDailyAnalysis(instrument: string) {
  const hour = new Date().getHours();
  const dayOfWeek = new Date().getDay();
  
  // Different analysis based on instrument
  const instrumentAnalysis: Record<string, any> = {
    "NASDAQ": {
      bias: "BULLISH",
      confidence: 75,
      recommendation: "Chercher des opportunités d'ACHAT sur les pullbacks",
      reason: "Tendance haussière confirmée sur les indices tech américains",
      color: "success",
      detailedAnalysis: `**Contexte Macro:**
L'indice NASDAQ montre une forte dynamique haussière portée par le secteur technologique. Les résultats trimestriels des grandes tech (FAANG) ont dépassé les attentes, renforçant la confiance des investisseurs. La Fed a maintenu sa position dovish, ce qui favorise les actifs à risque.

**Analyse Technique:**
Le NASDAQ a cassé sa résistance majeure à 16,200 points avec un volume significatif. Le RSI sur 4H est à 62, indiquant encore de la marge avant la zone de surachat. Les moyennes mobiles 20 et 50 périodes sont alignées haussièrement.

**Niveaux Clés:**
• Support immédiat: 16,150 (ancien résistance devenu support)
• Support majeur: 15,900 (EMA 50)
• Résistance: 16,400 (prochain objectif)
• Résistance majeure: 16,650 (plus haut historique)

**Stratégie Recommandée:**
Privilégier les positions LONG sur les replis vers 16,150-16,200. Attendre une confirmation avec un chandelier haussier avant d'entrer. Viser 16,400 comme premier objectif, puis 16,650. Stop loss sous 16,050.`,
      keyLevels: {
        support: "16,150",
        resistance: "16,400",
        target: "16,650"
      },
      pairs: ["NQ1!", "QQQ", "TQQQ"]
    },
    "EUR/USD": {
      bias: "BEARISH",
      confidence: 68,
      recommendation: "Privilégier les VENTES sur les rebonds",
      reason: "Dollar fort suite aux données économiques US solides",
      color: "danger",
      detailedAnalysis: `**Contexte Macro:**
Le dollar américain se renforce suite à la publication de données économiques robustes (NFP +250K vs 180K attendu). La divergence de politique monétaire entre la Fed (hawkish) et la BCE (dovish) continue de peser sur l'euro. Les tensions géopolitiques en Europe ajoutent une pression supplémentaire.

**Analyse Technique:**
EUR/USD a cassé le support clé de 1.0850 et forme maintenant une structure baissière claire. Le prix évolue sous toutes les moyennes mobiles majeures. Le MACD est négatif avec un momentum baissier croissant.

**Niveaux Clés:**
• Résistance immédiate: 1.0850 (ancien support)
• Résistance majeure: 1.0920 (EMA 200)
• Support: 1.0780 (prochain objectif)
• Support majeur: 1.0720 (plus bas de septembre)

**Stratégie Recommandée:**
Chercher des opportunités de VENTE sur les rebonds vers 1.0850-1.0870. Attendre un rejet clair (pin bar, engulfing baissier) avant d'entrer. Objectif 1.0780 puis 1.0720. Stop loss au-dessus de 1.0900.`,
      keyLevels: {
        support: "1.0780",
        resistance: "1.0850",
        target: "1.0720"
      },
      pairs: ["EUR/USD", "DXY"]
    },
    "GBP/USD": {
      bias: "NEUTRAL",
      confidence: 45,
      recommendation: "Rester PRUDENT - Attendre une direction claire",
      reason: "Consolidation entre supports et résistances clés",
      color: "warning",
      detailedAnalysis: `**Contexte Macro:**
La livre sterling est coincée dans un range étroit alors que les marchés attendent des clarifications sur la politique de la Banque d'Angleterre. Les données économiques britanniques sont mitigées, avec une inflation qui reste élevée mais une croissance qui ralentit. Le marché hésite entre scénario de hausse et de baisse des taux.

**Analyse Technique:**
GBP/USD évolue dans un range de consolidation entre 1.2650 et 1.2750 depuis 2 semaines. Le prix rebondit entre ces niveaux sans direction claire. Les indicateurs techniques sont neutres - RSI à 50, MACD plat.

**Niveaux Clés:**
• Support de range: 1.2650
• Résistance de range: 1.2750
• Support majeur: 1.2580 (si cassure baissière)
• Résistance majeure: 1.2820 (si cassure haussière)

**Stratégie Recommandée:**
ATTENDRE une cassure confirmée du range avant de prendre position. Si cassure au-dessus de 1.2750 avec volume → ACHAT vers 1.2820. Si cassure sous 1.2650 → VENTE vers 1.2580. Éviter de trader à l'intérieur du range sauf si vous êtes expérimenté en range trading.`,
      keyLevels: {
        support: "1.2650",
        resistance: "1.2750",
        target: "Range"
      },
      pairs: ["GBP/USD", "GBP/JPY"]
    },
    "GOLD": {
      bias: "BULLISH",
      confidence: 82,
      recommendation: "Chercher des opportunités d'ACHAT - Tendance forte",
      reason: "Valeur refuge recherchée, tensions géopolitiques croissantes",
      color: "success",
      detailedAnalysis: `**Contexte Macro:**
L'or bénéficie d'un contexte favorable avec des tensions géopolitiques accrues au Moyen-Orient et en Europe de l'Est. Les banques centrales continuent leurs achats d'or, et la demande physique en Asie reste forte. L'incertitude économique mondiale pousse les investisseurs vers les valeurs refuges.

**Analyse Technique:**
XAU/USD a franchi la résistance psychologique des 2,050$ avec conviction. La tendance haussière est intacte depuis plusieurs semaines. Le prix forme des plus hauts et plus bas croissants. Les moyennes mobiles sont parfaitement alignées en configuration haussière.

**Niveaux Clés:**
• Support immédiat: 2,045$ (pullback attendu)
• Support majeur: 2,020$ (EMA 20)
• Résistance: 2,075$ (objectif court terme)
• Résistance majeure: 2,100$ (niveau psychologique)

**Stratégie Recommandée:**
Privilégier les positions LONG sur les replis vers 2,040-2,045$. La tendance est votre amie - ne pas shorter contre cette tendance forte. Objectif 2,075$ puis 2,100$. Stop loss sous 2,030$. Ratio R/R favorable de 1:2.`,
      keyLevels: {
        support: "2,045$",
        resistance: "2,075$",
        target: "2,100$"
      },
      pairs: ["XAU/USD", "GLD"]
    },
    "BTC/USD": {
      bias: "BULLISH",
      confidence: 71,
      recommendation: "Opportunités d'ACHAT sur corrections",
      reason: "Adoption institutionnelle croissante, ETF Bitcoin approuvés",
      color: "success",
      detailedAnalysis: `**Contexte Macro:**
Bitcoin maintient sa dynamique haussière suite à l'approbation des ETF spot aux États-Unis. Les flux entrants institutionnels sont massifs (+2.5 milliards $ la semaine dernière). Le halving approche (avril 2024), historiquement un catalyseur haussier. L'adoption par les entreprises (MicroStrategy, Tesla) continue.

**Analyse Technique:**
BTC/USD a cassé la résistance des 42,000$ et consolide maintenant au-dessus. Le volume est sain, pas de signes de distribution. Le RSI hebdomadaire est à 65, indiquant encore de la marge. La structure reste haussière avec des corrections saines.

**Niveaux Clés:**
• Support immédiat: 42,500$ (zone d'achat)
• Support majeur: 40,000$ (support psychologique)
• Résistance: 45,000$ (prochain objectif)
• Résistance majeure: 48,000$ (plus haut de 2023)

**Stratégie Recommandée:**
Acheter les dips vers 42,000-42,500$ avec un horizon moyen terme. Le marché crypto est volatil - utiliser seulement 50% de votre taille de position habituelle. Objectif 45,000$ puis 48,000$. Stop loss sous 41,000$. Considérer prendre des profits partiels à chaque niveau.`,
      keyLevels: {
        support: "42,500$",
        resistance: "45,000$",
        target: "48,000$"
      },
      pairs: ["BTC/USD", "ETH/USD"]
    },
    "S&P 500": {
      bias: "BULLISH",
      confidence: 73,
      recommendation: "Chercher des opportunités d'ACHAT",
      reason: "Momentum haussier soutenu par les résultats d'entreprises",
      color: "success",
      detailedAnalysis: `**Contexte Macro:**
Le S&P 500 poursuit sa progression haussière portée par d'excellents résultats trimestriels. 78% des entreprises du S&P 500 ont battu les attentes de bénéfices. La Fed a signalé une pause dans les hausses de taux, ce qui soutient les valorisations. Le sentiment des investisseurs est positif mais pas euphorique.

**Analyse Technique:**
L'indice a franchi les 4,600 points et teste maintenant les 4,650. La tendance haussière est claire avec un canal ascendant bien défini. Les volumes d'achat sont supérieurs aux volumes de vente. Tous les secteurs participent à la hausse, signe de force du marché.

**Niveaux Clés:**
• Support immédiat: 4,600 (ancien résistance)
• Support majeur: 4,550 (EMA 20)
• Résistance: 4,680 (prochain objectif)
• Résistance majeure: 4,750 (extension Fibonacci)

**Stratégie Recommandée:**
Privilégier les positions LONG sur les replis vers 4,600-4,620. Utiliser les ETF (SPY, VOO) pour une exposition diversifiée. Objectif 4,680 puis 4,750. Stop loss sous 4,570. Surveiller le VIX - une hausse au-dessus de 18 serait un signal d'alerte.`,
      keyLevels: {
        support: "4,600",
        resistance: "4,680",
        target: "4,750"
      },
      pairs: ["SPX", "SPY", "ES1!"]
    }
  };

  return instrumentAnalysis[instrument] || instrumentAnalysis["NASDAQ"];
}

function generateNewsImpact() {
  return [
    {
      title: "Décision de taux de la FED",
      impact: "HIGH",
      sentiment: "Hawkish",
      time: "14:00",
      description: "La FED pourrait maintenir les taux élevés plus longtemps que prévu",
      tradingAdvice: "Volatilité attendue - Réduire la taille des positions avant l'annonce",
    },
    {
      title: "NFP (Non-Farm Payrolls)",
      impact: "HIGH",
      sentiment: "Neutral",
      time: "14:30",
      description: "Publication des chiffres de l'emploi américain",
      tradingAdvice: "Attendre la publication avant de prendre position",
    },
    {
      title: "PMI Manufacturing",
      impact: "MEDIUM",
      sentiment: "Dovish",
      time: "10:00",
      description: "Indice PMI manufacturier en zone euro",
      tradingAdvice: "Impact modéré - Surveiller les paires EUR",
    },
  ];
}

export default function InsightsPage() {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [chartAnalysis, setChartAnalysis] = useState<string | null>(null);
  const [selectedInstrument, setSelectedInstrument] = useState("NASDAQ");

  const dailyAnalysis = useMemo(() => generateDailyAnalysis(selectedInstrument), [selectedInstrument]);
  const newsImpact = useMemo(() => generateNewsImpact(), []);

  const instruments = [
    { value: "NASDAQ", label: "NASDAQ 100", icon: "mdi:chart-line" },
    { value: "EUR/USD", label: "EUR/USD", icon: "mdi:currency-eur" },
    { value: "GBP/USD", label: "GBP/USD", icon: "mdi:currency-gbp" },
    { value: "GOLD", label: "Gold (XAU/USD)", icon: "mdi:gold" },
    { value: "BTC/USD", label: "Bitcoin", icon: "mdi:bitcoin" },
    { value: "S&P 500", label: "S&P 500", icon: "mdi:chart-areaspline" },
  ];

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadedImage(reader.result as string);
        // Simulate AI analysis
        setAnalyzing(true);
        setTimeout(() => {
          setChartAnalysis(
            "📊 **Analyse Technique:**\n\n" +
            "• **Tendance:** Haussière sur le court terme\n" +
            "• **Support clé:** 1.0850 (niveau important à surveiller)\n" +
            "• **Résistance:** 1.0920 (zone de prise de profit)\n" +
            "• **RSI:** 62 (zone neutre, pas de surachat)\n" +
            "• **MACD:** Signal haussier confirmé\n\n" +
            "**Recommandation:** Position LONG possible\n" +
            "**Entry:** 1.0870-1.0880\n" +
            "**Stop Loss:** 1.0840 (-30 pips)\n" +
            "**Take Profit:** 1.0920 (+40 pips)\n" +
            "**Risk/Reward:** 1:1.33\n\n" +
            "⚠️ Attendre un pullback vers le support avant d'entrer"
          );
          setAnalyzing(false);
        }, 2000);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <>
      {/* Header */}
      <header className="h-16 bg-white dark:bg-black border-b border-divider flex items-center justify-between px-6">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Icon icon="mdi:robot-excited" className="text-2xl" />
            AI Trading Insights
          </h2>
          <p className="text-sm text-default-600">
            Analyse macro et recommandations IA pour débutants
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            as={NextLink}
            href="/dashboard"
            variant="light"
            size="sm"
          >
            <Icon icon="mdi:arrow-left" className="text-lg" />
            Back to Dashboard
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <div className="p-6 space-y-6">
        {/* Daily Market Analysis */}
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
              <h3 className="text-xl font-bold flex items-center gap-2">
                <Icon icon="mdi:chart-timeline-variant" className="text-2xl" />
                Analyse Macro du Jour
              </h3>
              <div className="flex items-center gap-3">
                {/* Instrument Selector */}
                <select
                  value={selectedInstrument}
                  onChange={(e) => setSelectedInstrument(e.target.value)}
                  className="px-4 py-2 rounded-lg border border-divider bg-white dark:bg-black text-sm font-semibold cursor-pointer hover:bg-default-50 dark:hover:bg-default-900 transition-colors"
                >
                  {instruments.map((inst) => (
                    <option key={inst.value} value={inst.value}>
                      {inst.label}
                    </option>
                  ))}
                </select>
                <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-default-100 dark:bg-default-200">
                  <div className="w-2 h-2 rounded-full bg-success animate-pulse"></div>
                  <span className="text-xs font-semibold">Live</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-4">
              {/* Market Bias */}
              <div className="lg:col-span-2 space-y-4">
                <div className={`rounded-xl p-6 border-2 ${
                  dailyAnalysis.color === 'success' 
                    ? 'bg-success/10 border-success' 
                    : dailyAnalysis.color === 'danger'
                      ? 'bg-danger/10 border-danger'
                      : 'bg-warning/10 border-warning'
                }`}>
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <p className="text-sm text-default-600 mb-1">Biais de marché</p>
                      <h4 className={`text-3xl font-bold ${
                        dailyAnalysis.color === 'success'
                          ? 'text-success'
                          : dailyAnalysis.color === 'danger'
                            ? 'text-danger'
                            : 'text-warning'
                      }`}>
                        {dailyAnalysis.bias}
                      </h4>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-default-600 mb-1">Confiance IA</p>
                      <p className="text-2xl font-bold">{dailyAnalysis.confidence}%</p>
                    </div>
                  </div>
                  
                  <div className={`bg-white dark:bg-black rounded-lg p-4 border ${
                    dailyAnalysis.color === 'success'
                      ? 'border-success/20'
                      : dailyAnalysis.color === 'danger'
                        ? 'border-danger/20'
                        : 'border-warning/20'
                  }`}>
                    <p className="text-lg font-semibold mb-2">
                      🎯 {dailyAnalysis.recommendation}
                    </p>
                    <p className="text-sm text-default-600">
                      {dailyAnalysis.reason}
                    </p>
                  </div>

                  <div className="mt-4 grid grid-cols-3 gap-3">
                    <div className="bg-white dark:bg-black rounded-lg p-3 border border-divider">
                      <p className="text-xs text-default-600 mb-1">Support</p>
                      <p className="font-semibold">{dailyAnalysis.keyLevels.support}</p>
                    </div>
                    <div className="bg-white dark:bg-black rounded-lg p-3 border border-divider">
                      <p className="text-xs text-default-600 mb-1">Résistance</p>
                      <p className="font-semibold">{dailyAnalysis.keyLevels.resistance}</p>
                    </div>
                    <div className="bg-white dark:bg-black rounded-lg p-3 border border-divider">
                      <p className="text-xs text-default-600 mb-1">Objectif</p>
                      <p className="font-semibold">{dailyAnalysis.keyLevels.target}</p>
                    </div>
                  </div>
                </div>

                {/* Detailed Analysis */}
                <div className=" rounded-xl p-6 border border-divider ">
                  <h4 className="text-lg font-bold mb-4 flex items-center gap-2">
                    <Icon icon="mdi:file-document-outline" className="text-xl" />
                    Analyse Détaillée
                  </h4>
                  <div className="prose prose-sm dark:prose-invert max-w-none">
                    <div className="text-sm text-default-800 dark:text-default-200 whitespace-pre-line leading-relaxed">
                      {dailyAnalysis.detailedAnalysis}
                    </div>
                  </div>
                  
                  {/* Related Pairs */}
                  <div className="mt-4 pt-4 border-t border-divider">
                    <p className="text-xs text-default-600 mb-2">Instruments liés:</p>
                    <div className="flex flex-wrap gap-2">
                      {dailyAnalysis.pairs.map((pair: string, idx: number) => (
                        <span
                          key={idx}
                          className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold"
                        >
                          {pair}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Tips */}
              <div className="space-y-3">
                <div className="rounded-lg p-4 bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800">
                  <div className="flex items-start gap-3">
                    <Icon icon="mdi:lightbulb" className="text-2xl text-blue-600 flex-shrink-0 mt-1" />
                    <div>
                      <p className="font-semibold text-sm mb-1">Conseil du jour</p>
                      <p className="text-xs text-default-600">
                        Toujours placer un stop loss avant d'entrer en position. Risque max: 1-2% du capital.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="rounded-lg p-4 bg-purple-50 dark:bg-purple-950 border border-purple-200 dark:border-purple-800">
                  <div className="flex items-start gap-3">
                    <Icon icon="mdi:shield-check" className="text-2xl text-purple-600 flex-shrink-0 mt-1" />
                    <div>
                      <p className="font-semibold text-sm mb-1">Gestion du risque</p>
                      <p className="text-xs text-default-600">
                        Évitez de trader pendant les annonces majeures si vous êtes débutant.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="rounded-lg p-4 bg-orange-50 dark:bg-orange-950 border border-orange-200 dark:border-orange-800">
                  <div className="flex items-start gap-3">
                    <Icon icon="mdi:clock-alert" className="text-2xl text-orange-600 flex-shrink-0 mt-1" />
                    <div>
                      <p className="font-semibold text-sm mb-1">Timing</p>
                      <p className="text-xs text-default-600">
                        Les meilleures opportunités sont souvent à l'ouverture de Londres et New York.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* News Impact & Chart Analysis */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Economic News */}
          <div className="relative rounded-2xl border p-2 md:rounded-3xl md:p-3">
            <GlowingEffect
              spread={40}
              glow={true}
              disabled={false}
              proximity={64}
              inactiveZone={0.01}
            />
            <div className="relative flex flex-col gap-4 overflow-hidden rounded-xl p-6 bg-white dark:bg-black border border-divider">
              <h3 className="text-xl font-bold flex items-center gap-2">
                <Icon icon="mdi:newspaper-variant" className="text-2xl" />
                News Économiques
              </h3>

              <div className="space-y-3">
                {newsImpact.map((news, index) => (
                  <div
                    key={index}
                    className="rounded-lg border border-divider p-4 hover:bg-default-50 dark:hover:bg-default-900 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span
                          className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                            news.impact === "HIGH"
                              ? "bg-danger/20 text-danger"
                              : "bg-warning/20 text-warning"
                          }`}
                        >
                          {news.impact}
                        </span>
                        <span className="text-xs text-default-600">{news.time}</span>
                      </div>
                      <span
                        className={`text-xs font-semibold ${
                          news.sentiment === "Hawkish"
                            ? "text-danger"
                            : news.sentiment === "Dovish"
                              ? "text-success"
                              : "text-default-600"
                        }`}
                      >
                        {news.sentiment}
                      </span>
                    </div>
                    <h4 className="font-semibold mb-1">{news.title}</h4>
                    <p className="text-sm text-default-600 mb-2">
                      {news.description}
                    </p>
                    <div className="bg-blue-50 dark:bg-blue-950 rounded-lg p-2 border border-blue-200 dark:border-blue-800">
                      <p className="text-xs font-semibold text-blue-700 dark:text-blue-300">
                        💡 {news.tradingAdvice}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Chart Analysis */}
          <div className="relative rounded-2xl border p-2 md:rounded-3xl md:p-3">
            <GlowingEffect
              spread={40}
              glow={true}
              disabled={false}
              proximity={64}
              inactiveZone={0.01}
            />
            <div className="relative flex flex-col gap-4 overflow-hidden rounded-xl p-6 bg-white dark:bg-black border border-divider">
              <h3 className="text-xl font-bold flex items-center gap-2">
                <Icon icon="mdi:image-search" className="text-2xl" />
                Analyse de Graphique
              </h3>

              <div className="space-y-4">
                <div className="border-2 border-dashed border-divider rounded-lg p-6 text-center">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    id="chart-upload"
                  />
                  <label
                    htmlFor="chart-upload"
                    className="cursor-pointer flex flex-col items-center gap-3"
                  >
                    <Icon
                      icon="mdi:cloud-upload"
                      className="text-5xl text-default-400"
                    />
                    <div>
                      <p className="font-semibold mb-1">
                        Upload une capture d'écran
                      </p>
                      <p className="text-sm text-default-600">
                        PNG, JPG jusqu'à 10MB
                      </p>
                    </div>
                    <Button color="primary" size="sm">
                      Choisir un fichier
                    </Button>
                  </label>
                </div>

                {uploadedImage && (
                  <div className="space-y-3">
                    <div className="rounded-lg border border-divider overflow-hidden">
                      <img
                        src={uploadedImage}
                        alt="Uploaded chart"
                        className="w-full h-48 object-cover"
                      />
                    </div>

                    {analyzing && (
                      <div className="flex items-center justify-center gap-3 p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
                        <div className="animate-spin">
                          <Icon icon="mdi:loading" className="text-2xl text-primary" />
                        </div>
                        <p className="font-semibold">Analyse en cours...</p>
                      </div>
                    )}

                    {chartAnalysis && !analyzing && (
                      <div className="bg-default-100 dark:bg-default-800 rounded-lg p-4">
                        <div className="flex items-start gap-2 mb-3">
                          <Icon
                            icon="mdi:robot"
                            className="text-2xl text-primary flex-shrink-0"
                          />
                          <div>
                            <p className="font-semibold mb-2">Analyse IA</p>
                            <div className="text-sm text-default-700 dark:text-default-300 whitespace-pre-line">
                              {chartAnalysis}
                            </div>
                          </div>
                        </div>
                        <Button
                          size="sm"
                          variant="bordered"
                          className="w-full"
                          onClick={() => {
                            setUploadedImage(null);
                            setChartAnalysis(null);
                          }}
                        >
                          Analyser un autre graphique
                        </Button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Trading Recommendations for Beginners */}
        <div className="relative rounded-2xl border p-2 md:rounded-3xl md:p-3">
          <GlowingEffect
            spread={40}
            glow={true}
            disabled={false}
            proximity={64}
            inactiveZone={0.01}
          />
          <div className="relative flex flex-col gap-4 overflow-hidden rounded-xl p-6 bg-white dark:bg-black border border-divider">
            <h3 className="text-xl font-bold flex items-center gap-2">
              <Icon icon="mdi:school" className="text-2xl" />
              Guide pour Débutants
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="rounded-lg border border-divider p-4">
                <div className="w-12 h-12 rounded-lg bg-success/20 flex items-center justify-center mb-3">
                  <Icon icon="mdi:check-circle" className="text-2xl text-success" />
                </div>
                <h4 className="font-semibold mb-2">À FAIRE</h4>
                <ul className="text-sm text-default-600 space-y-1">
                  <li>✓ Toujours utiliser un stop loss</li>
                  <li>✓ Risquer max 1-2% par trade</li>
                  <li>✓ Tenir un journal de trading</li>
                  <li>✓ Suivre votre plan de trading</li>
                  <li>✓ Trader avec la tendance</li>
                </ul>
              </div>

              <div className="rounded-lg border border-divider p-4">
                <div className="w-12 h-12 rounded-lg bg-danger/20 flex items-center justify-center mb-3">
                  <Icon icon="mdi:close-circle" className="text-2xl text-danger" />
                </div>
                <h4 className="font-semibold mb-2">À ÉVITER</h4>
                <ul className="text-sm text-default-600 space-y-1">
                  <li>✗ Trader sans stop loss</li>
                  <li>✗ Revenge trading après une perte</li>
                  <li>✗ Sur-trader (trop de positions)</li>
                  <li>✗ Ignorer la gestion du risque</li>
                  <li>✗ Trader pendant les news majeures</li>
                </ul>
              </div>

              <div className="rounded-lg border border-divider p-4">
                <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center mb-3">
                  <Icon icon="mdi:star" className="text-2xl text-primary" />
                </div>
                <h4 className="font-semibold mb-2">CONSEILS PRO</h4>
                <ul className="text-sm text-default-600 space-y-1">
                  <li>→ Commencer avec un compte démo</li>
                  <li>→ Se concentrer sur 1-2 paires</li>
                  <li>→ Apprendre l'analyse technique</li>
                  <li>→ Être patient et discipliné</li>
                  <li>→ Continuer à se former</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
