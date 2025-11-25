"use client";

import { Icon } from "@iconify/react";
import { Button } from "@heroui/button";
import { useState } from "react";

export default function UploadPage() {
  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState<File | null>(null);

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
      setFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4 flex items-center gap-2">
        <Icon icon="mdi:cloud-upload" className="text-xl" /> Upload Trading Data
      </h1>
      <div className="bg-white dark:bg-black rounded-xl border border-divider p-6 min-h-[300px] flex flex-col gap-6">
        <div className="max-w-2xl">
          <p className="text-default-600 mb-4">
            Import your trading history by uploading CSV files exported from your trading platform.
            We currently support: Topstep, NinjaTrader, Tradovate.
          </p>

          <div
            className={`relative border-2 border-dashed rounded-xl p-10 flex flex-col items-center justify-center text-center transition-colors ${
              dragActive
                ? "border-primary bg-primary/5"
                : "border-default-300 hover:border-default-400"
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
            
            <div className="flex flex-col items-center gap-2 pointer-events-none">
              <div className="w-12 h-12 rounded-full bg-default-100 flex items-center justify-center mb-2">
                <Icon icon="mdi:file-upload-outline" className="text-2xl text-default-500" />
              </div>
              {file ? (
                <>
                  <p className="font-semibold text-default-900">{file.name}</p>
                  <p className="text-sm text-default-500">
                    {(file.size / 1024).toFixed(2)} KB
                  </p>
                </>
              ) : (
                <>
                  <p className="font-semibold text-default-900">
                    Click to upload or drag and drop
                  </p>
                  <p className="text-sm text-default-500">
                    CSV files only (max 10MB)
                  </p>
                </>
              )}
            </div>
          </div>

          <div className="mt-6 flex justify-end">
            <Button color="primary" isDisabled={!file}>
              Import Data
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
