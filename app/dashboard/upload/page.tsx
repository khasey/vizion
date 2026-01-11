"use client";

import { Icon } from "@iconify/react";
import { Button } from "@heroui/button";
import { useState } from "react";
import { GlowingEffect } from "@/components/ui/glowing-effect";
import NextLink from "next/link";
import { processCSVFile } from "@/lib/parsers/csvParser";
import { uploadTrades } from "@/app/actions/trades";
import { getUser } from "@/app/actions/auth";
import type { Trade } from "@/types/trades";
import { FuturCard } from "@/components/ui/FuturCard";

export default function UploadPage() {
  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [selectedBroker, setSelectedBroker] = useState("auto");
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [parsedTrades, setParsedTrades] = useState<Trade[] | null>(null);
  const [csvPreview, setCsvPreview] = useState<string[][] | null>(null);

  const brokers = [
    { value: "auto", label: "Détection automatique", icon: "mdi:auto-fix" },
    { value: "metatrader", label: "MetaTrader 4/5", icon: "mdi:chart-line" },
    { value: "tradingview", label: "TradingView", icon: "mdi:chart-areaspline" },
    { value: "ninjatrader", label: "NinjaTrader", icon: "mdi:ninja" },
    { value: "tradovate", label: "Tradovate", icon: "mdi:chart-box" },
    { value: "topstep", label: "TopstepTrader", icon: "mdi:stairs-up" },
    { value: "interactive", label: "Interactive Brokers", icon: "mdi:bank" },
  ];

  const uploadHistory = [
    { date: "2025-11-24", broker: "MetaTrader 5", trades: 45, status: "success" },
    { date: "2025-11-20", broker: "TradingView", trades: 32, status: "success" },
    { date: "2025-11-15", broker: "NinjaTrader", trades: 28, status: "success" },
  ];

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile.name.endsWith('.csv')) {
        setFile(droppedFile);
        previewCSV(droppedFile);
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      previewCSV(selectedFile);
    }
  };

  const previewCSV = async (file: File) => {
    setUploadError(null);
    setParsedTrades(null);
    
    const reader = new FileReader();
    reader.onload = async (e) => {
      const text = e.target?.result as string;
      const lines = text.split('\n').slice(0, 8); // First 8 lines
      const preview = lines.map(line => line.split(','));
      setCsvPreview(preview);

      // Parse trades
      try {
        const user = await getUser();
        if (!user) {
          setUploadError("Vous devez être connecté pour uploader des trades");
          return;
        }

        const trades = await processCSVFile(file, user.id);
        setParsedTrades(trades);
        
        if (trades.length === 0) {
          setUploadError("Aucun trade complet trouvé dans le fichier. Assurez-vous d'avoir des ordres 'Filled' avec des paires buy/sell.");
        }
      } catch (error) {
        console.error('Error parsing CSV:', error);
        setUploadError("Erreur lors de l'analyse du fichier CSV");
      }
    };
    reader.readAsText(file);
  };

  const handleUpload = async () => {
    if (!parsedTrades || parsedTrades.length === 0) {
      setUploadError("Aucun trade à uploader");
      return;
    }

    setUploading(true);
    setUploadError(null);

    try {
      const result = await uploadTrades(parsedTrades);
      
      if (result.error) {
        setUploadError(result.error);
      } else {
        setUploadSuccess(true);
        setTimeout(() => {
          setUploadSuccess(false);
          setFile(null);
          setCsvPreview(null);
          setParsedTrades(null);
        }, 3000);
      }
    } catch (error) {
      console.error('Upload error:', error);
      setUploadError("Erreur lors de l'upload des trades");
    } finally {
      setUploading(false);
    }
  };

  return (
    <>
      {/* Header */}
      <header className="h-16 bg-white dark:bg-black border-b border-gray-800/50 flex items-center justify-between px-6">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Icon icon="mdi:cloud-upload" className="text-2xl" />
            Import Trading Data
          </h2>
          <p className="text-sm text-default-600">
            Upload CSV files from your broker
          </p>
        </div>
      </header>

      {/* Main Content */}
      <div className="p-6 space-y-6">
        {/* Upload Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Upload Area */}
          <div className="lg:col-span-2 space-y-6">

            {/* Drop Zone */}
            <FuturCard className="relative rounded-2xl  p-2 md:rounded-3xl md:p-3">
             
              <div className="relative flex flex-col gap-4 overflow-hidden rounded-xl p-2 bg-white dark:bg-black">
                <h3 className="text-lg font-bold flex items-center gap-2">
                  <Icon icon="mdi:file-upload" className="text-xl" />
                  Upload fichier CSV
                </h3>

                <div
                  className={`relative border-2 border-dashed rounded-xl p-12 flex flex-col items-center justify-center text-center transition-all ${
                    dragActive
                      ? "border-primary bg-primary/10 scale-[1.02]"
                      : "border-default-300 hover:border-primary/50 hover:bg-default-50 dark:hover:bg-default-100"
                  }`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                >
                  <input
                    type="file"
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    onChange={handleChange}
                    accept=".csv"
                  />
                  
                  <div className="flex flex-col items-center gap-4 pointer-events-none">
                    <div className={`w-20 h-20 rounded-full flex items-center justify-center transition-colors ${
                      dragActive ? "bg-primary/20" : "bg-default-100 dark:bg-default-800"
                    }`}>
                      <Icon 
                        icon={dragActive ? "mdi:download" : "mdi:cloud-upload-outline"} 
                        className={`text-4xl ${dragActive ? "text-primary" : "text-default-500"}`} 
                      />
                    </div>
                    {file ? (
                      <>
                        <div className="flex items-center gap-3 bg-success/10 px-4 py-2 rounded-lg border border-success/20">
                          <Icon icon="mdi:file-check" className="text-2xl text-success" />
                          <div className="text-left">
                            <p className="font-semibold text-success">{file.name}</p>
                            <p className="text-xs text-default-600">
                              {(file.size / 1024).toFixed(2)} KB
                            </p>
                          </div>
                        </div>
                        <Button
                          size="sm"
                          variant="light"
                          color="danger"
                          onClick={(e) => {
                            e.stopPropagation();
                            setFile(null);
                            setCsvPreview(null);
                          }}
                        >
                          <Icon icon="mdi:close" />
                          Supprimer
                        </Button>
                      </>
                    ) : (
                      <>
                        <div>
                          <p className="text-lg font-semibold mb-1">
                            Glissez-déposez votre fichier CSV ici
                          </p>
                          <p className="text-sm text-default-600 mb-3">
                            ou cliquez pour parcourir
                          </p>
                          <p className="text-xs text-default-500">
                            Fichiers CSV uniquement • Max 10MB
                          </p>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {parsedTrades && parsedTrades.length > 0 && (
                  <div className="flex items-center gap-3 p-4 bg-primary/10 border border-primary/20 rounded-lg">
                    <Icon icon="mdi:information" className="text-2xl text-primary" />
                    <div>
                      <p className="font-semibold text-primary">{parsedTrades.length} trades détectés</p>
                      <p className="text-sm text-default-600">Prêt à être importé</p>
                    </div>
                  </div>
                )}

                {uploadError && (
                  <div className="flex items-center gap-3 p-4 bg-danger/10 border border-danger/20 rounded-lg">
                    <Icon icon="mdi:alert-circle" className="text-2xl text-danger" />
                    <div>
                      <p className="font-semibold text-danger">Erreur</p>
                      <p className="text-sm text-default-600">{uploadError}</p>
                    </div>
                  </div>
                )}

                {uploadSuccess && (
                  <div className="flex items-center gap-3 p-4 bg-success/10 border border-success/20 rounded-lg">
                    <Icon icon="mdi:check-circle" className="text-2xl text-success" />
                    <div>
                      <p className="font-semibold text-success">Import réussi!</p>
                      <p className="text-sm text-default-600">{parsedTrades?.length || 0} trades ont été importés avec succès</p>
                    </div>
                  </div>
                )}

                <div className="flex justify-end gap-3">
                  <Button
                    variant="bordered"
                    isDisabled={!file}
                    onClick={() => {
                      setFile(null);
                      setCsvPreview(null);
                    }}
                  >
                    Annuler
                  </Button>
                  <Button
                    color="primary"
                    isDisabled={!file || uploading}
                    isLoading={uploading}
                    onClick={handleUpload}
                  >
                    <Icon icon="mdi:upload" className="text-lg" />
                    {uploading ? "Import en cours..." : "Importer les données"}
                  </Button>
                </div>
              </div>
            </FuturCard>

            {/* Parsed Trades Preview */}
            {parsedTrades && parsedTrades.length > 0 && (
              <FuturCard className="relative rounded-2xl p-2 md:rounded-3xl md:p-3">
              
                <div className="relative flex flex-col gap-4 overflow-hidden rounded-xl p-6 bg-white dark:bg-black">
                  <h3 className="text-lg font-bold flex items-center gap-2">
                    <Icon icon="mdi:table-eye" className="text-xl" />
                    Trades détectés ({parsedTrades.length})
                  </h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="font-semibold">
                          <th className="px-3 py-2 border border-divider text-left">Symbol</th>
                          <th className="px-3 py-2 border border-divider text-left">Side</th>
                          <th className="px-3 py-2 border border-divider text-right">Entry</th>
                          <th className="px-3 py-2 border border-divider text-right">Exit</th>
                          <th className="px-3 py-2 border border-divider text-right">Qty</th>
                          <th className="px-3 py-2 border border-divider text-right">P&L</th>
                          <th className="px-3 py-2 border border-divider text-right">Duration</th>
                        </tr>
                      </thead>
                      <tbody>
                        {parsedTrades.slice(0, 10).map((trade, i) => (
                          <tr key={i} className="">
                            <td className="px-3 py-2 border border-divider font-mono">{trade.symbol}</td>
                            <td className="px-3 py-2 border border-divider">
                              <span className={`px-2 py-1 rounded text-xs font-semibold ${
                                trade.side === 'long' || trade.side === 'buy' 
                                  ? 'bg-success/20 text-success' 
                                  : 'bg-danger/20 text-danger'
                              }`}>
                                {trade.side.toUpperCase()}
                              </span>
                            </td>
                            <td className="px-3 py-2 border border-divider text-right font-mono">
                              {trade.entry_price.toFixed(2)}
                            </td>
                            <td className="px-3 py-2 border border-divider text-right font-mono">
                              {trade.exit_price.toFixed(2)}
                            </td>
                            <td className="px-3 py-2 border border-divider text-right">
                              {trade.quantity}
                            </td>
                            <td className={`px-3 py-2 border border-divider text-right font-semibold ${
                              trade.profit_loss >= 0 ? 'text-success' : 'text-danger'
                            }`}>
                              {trade.profit_loss >= 0 ? '+' : ''}{trade.profit_loss.toFixed(2)}
                            </td>
                            <td className="px-3 py-2 border border-divider text-right text-xs">
                              {trade.duration_minutes ? `${trade.duration_minutes}m` : '-'}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <p className="text-xs text-default-600">
                    Affichage des {Math.min(10, parsedTrades.length)} premiers trades sur {parsedTrades.length} détectés
                  </p>
                </div>
              </FuturCard>
            )}          
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Upload History */}
            

            {/* Requirements */}
            <FuturCard className="relative rounded-2xl  p-2 md:rounded-3xl md:p-3">
              
              <div className="relative flex flex-col gap-4 overflow-hidden rounded-xl p-2 bg-white dark:bg-black ">
                <h3 className="text-lg font-bold flex items-center gap-2">
                  <Icon icon="mdi:information" className="text-xl" />
                  Format requis
                </h3>
                <div className="space-y-2 text-sm text-default-600">
                  <p>✓ Format: CSV (.csv)</p>
                  <p>✓ Encodage: UTF-8</p>
                  <p>✓ Séparateur: virgule (,)</p>
                  <p>✓ Taille max: 10 MB</p>
                </div>
                <div className="pt-3 border-t border-divider">
                  <p className="text-xs font-semibold mb-2">Colonnes requises:</p>
                  <div className="space-y-1 text-xs text-default-600">
                    <p>• Date/Time</p>
                    <p>• Symbol/Pair</p>
                    <p>• Type (Buy/Sell)</p>
                    <p>• Entry Price</p>
                    <p>• Exit Price</p>
                    <p>• P&L</p>
                  </div>
                </div>
              </div>
            </FuturCard>
          </div>
        </div>
      </div>
    </>
  );
}
