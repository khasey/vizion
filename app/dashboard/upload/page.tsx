"use client";

import { Icon } from "@iconify/react";
import { Button } from "@heroui/button";
import { useState } from "react";
import { GlowingEffect } from "@/components/ui/glowing-effect";
import NextLink from "next/link";

export default function UploadPage() {
  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [selectedBroker, setSelectedBroker] = useState("auto");
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
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

  const previewCSV = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      const lines = text.split('\n').slice(0, 6); // First 6 lines
      const preview = lines.map(line => line.split(','));
      setCsvPreview(preview);
    };
    reader.readAsText(file);
  };

  const handleUpload = () => {
    setUploading(true);
    // Simulate upload
    setTimeout(() => {
      setUploading(false);
      setUploadSuccess(true);
      setTimeout(() => {
        setUploadSuccess(false);
        setFile(null);
        setCsvPreview(null);
      }, 3000);
    }, 2000);
  };

  return (
    <>
      {/* Header */}
      <header className="h-16 bg-white dark:bg-black border-b border-divider flex items-center justify-between px-6">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Icon icon="mdi:cloud-upload" className="text-2xl" />
            Import Trading Data
          </h2>
          <p className="text-sm text-default-600">
            Upload CSV files from your broker
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
        {/* Upload Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Upload Area */}
          <div className="lg:col-span-2 space-y-6">
            {/* Broker Selection */}
            <div className="relative rounded-2xl border p-2 md:rounded-3xl md:p-3">
              <GlowingEffect
                spread={40}
                glow={true}
                disabled={false}
                proximity={64}
                inactiveZone={0.01}
              />
              <div className="relative flex flex-col gap-4 overflow-hidden rounded-xl p-6 bg-white dark:bg-black border border-divider">
                <h3 className="text-lg font-bold flex items-center gap-2">
                  <Icon icon="mdi:source-branch" className="text-xl" />
                  Sélectionner votre broker
                </h3>
                <select
                  value={selectedBroker}
                  onChange={(e) => setSelectedBroker(e.target.value)}
                  className="px-4 py-3 rounded-lg border border-divider bg-white dark:bg-black text-sm font-semibold cursor-pointer hover:bg-default-50 dark:hover:bg-default-900 transition-colors"
                >
                  {brokers.map((broker) => (
                    <option key={broker.value} value={broker.value}>
                      {broker.label}
                    </option>
                  ))}
                </select>
                <p className="text-xs text-default-600">
                  La détection automatique analysera le format de votre fichier CSV
                </p>
              </div>
            </div>

            {/* Drop Zone */}
            <div className="relative rounded-2xl border p-2 md:rounded-3xl md:p-3">
              <GlowingEffect
                spread={40}
                glow={true}
                disabled={false}
                proximity={64}
                inactiveZone={0.01}
              />
              <div className="relative flex flex-col gap-4 overflow-hidden rounded-xl p-6 bg-white dark:bg-black border border-divider">
                <h3 className="text-lg font-bold flex items-center gap-2">
                  <Icon icon="mdi:file-upload" className="text-xl" />
                  Upload fichier CSV
                </h3>

                <div
                  className={`relative border-2 border-dashed rounded-xl p-12 flex flex-col items-center justify-center text-center transition-all ${
                    dragActive
                      ? "border-primary bg-primary/10 scale-[1.02]"
                      : "border-default-300 hover:border-primary/50 hover:bg-default-50 dark:hover:bg-default-900"
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

                {uploadSuccess && (
                  <div className="flex items-center gap-3 p-4 bg-success/10 border border-success/20 rounded-lg">
                    <Icon icon="mdi:check-circle" className="text-2xl text-success" />
                    <div>
                      <p className="font-semibold text-success">Import réussi!</p>
                      <p className="text-sm text-default-600">Vos trades ont été importés avec succès</p>
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
            </div>

            {/* CSV Preview */}
            {csvPreview && (
              <div className="relative rounded-2xl border p-2 md:rounded-3xl md:p-3">
                <GlowingEffect
                  spread={40}
                  glow={true}
                  disabled={false}
                  proximity={64}
                  inactiveZone={0.01}
                />
                <div className="relative flex flex-col gap-4 overflow-hidden rounded-xl p-6 bg-white dark:bg-black border border-divider">
                  <h3 className="text-lg font-bold flex items-center gap-2">
                    <Icon icon="mdi:table-eye" className="text-xl" />
                    Aperçu du fichier
                  </h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <tbody>
                        {csvPreview.map((row, i) => (
                          <tr key={i} className={i === 0 ? "font-semibold bg-default-100 dark:bg-default-800" : "hover:bg-default-50 dark:hover:bg-default-900"}>
                            {row.map((cell, j) => (
                              <td key={j} className="px-3 py-2 border border-divider">
                                {cell}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <p className="text-xs text-default-600">
                    Affichage des 5 premières lignes • {csvPreview.length - 1} lignes détectées
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Upload History */}
            <div className="relative rounded-2xl border p-2 md:rounded-3xl md:p-3">
              <GlowingEffect
                spread={40}
                glow={true}
                disabled={false}
                proximity={64}
                inactiveZone={0.01}
              />
              <div className="relative flex flex-col gap-4 overflow-hidden rounded-xl p-6 bg-white dark:bg-black border border-divider">
                <h3 className="text-lg font-bold flex items-center gap-2">
                  <Icon icon="mdi:history" className="text-xl" />
                  Historique
                </h3>
                <div className="space-y-3">
                  {uploadHistory.map((upload, idx) => (
                    <div key={idx} className="p-3 rounded-lg border border-divider hover:bg-default-50 dark:hover:bg-default-900 transition-colors">
                      <div className="flex items-center justify-between mb-1">
                        <p className="text-sm font-semibold">{upload.broker}</p>
                        <Icon icon="mdi:check-circle" className="text-success" />
                      </div>
                      <p className="text-xs text-default-600">{upload.trades} trades</p>
                      <p className="text-xs text-default-500">{upload.date}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Supported Brokers */}
            <div className="relative rounded-2xl border p-2 md:rounded-3xl md:p-3">
              <GlowingEffect
                spread={40}
                glow={true}
                disabled={false}
                proximity={64}
                inactiveZone={0.01}
              />
              <div className="relative flex flex-col gap-4 overflow-hidden rounded-xl p-6 bg-white dark:bg-black border border-divider">
                <h3 className="text-lg font-bold flex items-center gap-2">
                  <Icon icon="mdi:check-decagram" className="text-xl" />
                  Brokers supportés
                </h3>
                <div className="space-y-2">
                  {brokers.slice(1).map((broker) => (
                    <div key={broker.value} className="flex items-center gap-2 text-sm">
                      <Icon icon={broker.icon} className="text-primary" />
                      <span>{broker.label}</span>
                    </div>
                  ))}
                </div>
                <Button size="sm" variant="bordered" className="w-full">
                  <Icon icon="mdi:download" />
                  Télécharger templates
                </Button>
              </div>
            </div>

            {/* Requirements */}
            <div className="relative rounded-2xl border p-2 md:rounded-3xl md:p-3">
              <GlowingEffect
                spread={40}
                glow={true}
                disabled={false}
                proximity={64}
                inactiveZone={0.01}
              />
              <div className="relative flex flex-col gap-4 overflow-hidden rounded-xl p-6 bg-white dark:bg-black border border-divider">
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
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
