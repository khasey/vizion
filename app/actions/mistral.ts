"use server";

import { Mistral } from "@mistralai/mistralai";

const mistral = new Mistral({
  apiKey: process.env.API_MISTRAL,
});

export async function analyzeMacro(instrument: string) {
  try {
    // Map instrument names to full descriptions
    const instrumentMap: Record<string, string> = {
      "NASDAQ": "NASDAQ 100 (NQ futures ou QQQ ETF) - Indice des 100 plus grandes entreprises technologiques américaines",
      "EUR/USD": "EUR/USD - Paire de devises Euro/Dollar américain",
      "GBP/USD": "GBP/USD (Cable) - Paire de devises Livre Sterling/Dollar américain",
      "GOLD": "GOLD (XAU/USD) - Or spot contre Dollar américain",
      "BTC/USD": "Bitcoin/USD - Cryptomonnaie Bitcoin contre Dollar américain",
      "SPX": "S&P 500 (SPX ou ES futures) - Indice des 500 plus grandes entreprises américaines",
    };

    const fullInstrumentName = instrumentMap[instrument] || instrument;

    const prompt = `Tu es un analyste financier expert spécialisé en day trading et swing trading. Analyse la situation actuelle pour ${fullInstrumentName}.

**RÈGLES STRICTES**: 
- Fournis UNIQUEMENT des prix réels et vérifiables en DOLLARS ($) pour tous les niveaux
- JAMAIS de prix approximatifs ou estimés - si tu ne connais pas le prix exact, indique "Consulter le prix actuel sur votre plateforme"
- Horizon de trading: COURT TERME (aujourd'hui à maximum 1 semaine)
- Focus sur l'action de prix basée sur les dernières données disponibles

Fournis une analyse structurée incluant:
1. **Avertissement**: "⚠️ Vérifiez toujours les prix en temps réel sur votre plateforme de trading avant toute décision"
2. **Contexte Macro**: Événements et données économiques affectant l'instrument AUJOURD'HUI ou cette semaine
3. **Analyse Technique**: Structure de prix court terme (4H/1H), indicateurs immédiats, patterns identifiés
4. **Bias**: BULLISH, BEARISH ou NEUTRAL pour les prochaines 24h à 7 jours avec niveau de confiance (0-100%)
5. **Recommandation**: Stratégie de trading avec conditions d'entrée claires
6. **Niveaux Clés** (en dollars $ si disponibles, sinon indique de vérifier):
   - Support immédiat: $XXX (ou "À vérifier sur votre plateforme")
   - Résistance immédiate: $XXX (ou "À vérifier sur votre plateforme")
   - Objectif court terme: $XXX (ou "À calculer selon votre R:R")
   - Stop loss suggéré: "XX points en dessous/au-dessus de [niveau]"
7. **Catalyseurs à surveiller**: Événements/annonces économiques prévus dans les prochains jours
8. **Disclaimer**: "Cette analyse est à titre éducatif uniquement. Tradez à vos propres risques."

Sois PRÉCIS, RESPONSABLE et actionnable. N'invente JAMAIS de prix. Utilise le format Markdown.`;

    const response = await mistral.chat.complete({
      model: "mistral-large-latest",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    const content = response.choices?.[0]?.message?.content || "";
    const contentStr = typeof content === 'string' ? content : JSON.stringify(content);
    
    // Extract bias and confidence from the response
    let bias = "NEUTRAL";
    let confidence = 50;
    
    if (contentStr.toLowerCase().includes("bullish") || contentStr.toLowerCase().includes("haussier")) {
      bias = "BULLISH";
      confidence = 70;
    } else if (contentStr.toLowerCase().includes("bearish") || contentStr.toLowerCase().includes("baissier")) {
      bias = "BEARISH";
      confidence = 70;
    }

    return {
      success: true,
      data: {
        analysis: contentStr,
        bias,
        confidence,
        instrument,
        timestamp: new Date().toISOString(),
      },
    };
  } catch (error) {
    console.error("Mistral API error:", error);
    return {
      success: false,
      error: "Erreur lors de l'analyse. Veuillez réessayer.",
    };
  }
}

export async function analyzeChart(imageBase64: string, userQuestion?: string) {
  try {
    const prompt = userQuestion 
      ? `Tu es un analyste technique expert. L'utilisateur te montre un graphique de trading et demande: "${userQuestion}"\n\nAnalyse le graphique et réponds à sa question de manière claire et actionnable. Fournis:\n1. Ce que tu vois sur le graphique\n2. Ton analyse technique\n3. Ta recommandation (ACHAT/VENTE/ATTENDRE)\n4. Les niveaux d'entrée, stop loss et take profit suggérés\n5. Le ratio risque/rendement\n\nSois direct et précis.`
      : `Tu es un analyste technique expert. Analyse ce graphique de trading et fournis:\n1. **Structure du marché**: Tendance, pattern, niveaux clés\n2. **Analyse technique**: Indicateurs, supports/résistances\n3. **Recommandation**: ACHAT, VENTE ou ATTENDRE avec justification\n4. **Setup de trading**: Entrée, stop loss, take profit\n5. **Ratio risque/rendement**: Évaluation\n6. **Niveau de confiance**: 0-100%\n\nSois concis et actionnable. Utilise le format Markdown.`;

    const response = await mistral.chat.complete({
      model: "pixtral-large-latest", // Modèle avec vision
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: prompt,
            },
            {
              type: "image_url",
              imageUrl: `data:image/jpeg;base64,${imageBase64}`,
            },
          ],
        },
      ],
    });

    const content = response.choices?.[0]?.message?.content || "";
    const contentStr = typeof content === 'string' ? content : JSON.stringify(content);
    
    // Extract recommendation from response
    let recommendation = "ATTENDRE";
    let confidence = 50;
    
    if (contentStr.toLowerCase().includes("achat") || contentStr.toLowerCase().includes("buy") || contentStr.toLowerCase().includes("long")) {
      recommendation = "ACHAT";
      confidence = 65;
    } else if (contentStr.toLowerCase().includes("vente") || contentStr.toLowerCase().includes("sell") || contentStr.toLowerCase().includes("short")) {
      recommendation = "VENTE";
      confidence = 65;
    }

    return {
      success: true,
      data: {
        analysis: contentStr,
        recommendation,
        confidence,
        timestamp: new Date().toISOString(),
      },
    };
  } catch (error) {
    console.error("Mistral Vision API error:", error);
    return {
      success: false,
      error: "Erreur lors de l'analyse de l'image. Veuillez réessayer.",
    };
  }
}
