"use client";

import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { usePorcupine } from "@picovoice/porcupine-react";

/**
 * Porcupine wake word test page for Next.js (App Router).
 *
 * How to use (see chat for details):
 * 1) npm i @picovoice/porcupine-react @picovoice/web-voice-processor
 * 2) Put your files under /public/porcupine/
 *    - /public/porcupine/keyword.ppn
 *    - /public/porcupine/porcupine_params.pv  (or a locale-specific model)
 * 3) Set NEXT_PUBLIC_PICOVOICE_ACCESS_KEY in .env.local (optional; can also paste at runtime)
 * 4) Start the dev server over HTTPS or localhost and visit /porcupine
 */

export default function PorcupineTestPage() {
  const [accessKey, setAccessKey] = useState<string>(
    process.env.NEXT_PUBLIC_PICOVOICE_ACCESS_KEY ?? "",
  );
  const [keywordPath, setKeywordPath] = useState<string>(
    "/porcupine/keyword.ppn",
  );
  const [modelPath, setModelPath] = useState<string>(
    "/porcupine/porcupine_params.pv",
  );
  const [label, setLabel] = useState<string>("keyword");

  const {
    keywordDetection,
    isLoaded,
    isListening,
    error,
    init,
    start,
    stop,
    release,
  } = usePorcupine();

  const [log, setLog] = useState<string[]>([]);
  const [permission, setPermission] = useState<PermissionState | "unsupported">(
    "unsupported",
  );

  // Track detections in a simple log
  useEffect(() => {
    if (keywordDetection !== null) {
      const detectedLabel =
        (keywordDetection as any)?.label ?? String(keywordDetection);
      setLog((prev) => [
        `${new Date().toLocaleTimeString()} · detected: ${detectedLabel}`,
        ...prev,
      ]);
    }
  }, [keywordDetection]);

  // Check mic permission if supported (Chrome/Edge/Opera)
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        // @ts-ignore - webkit vendor prefix not typed everywhere
        const perm = navigator?.permissions?.query
          ? await navigator.permissions.query({
              name: "microphone" as PermissionName,
            })
          : null;
        if (!cancelled) setPermission(perm?.state ?? "unsupported");
        perm?.addEventListener?.("change", () => setPermission(perm.state));
      } catch {
        if (!cancelled) setPermission("unsupported");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const handleInit = useCallback(async () => {
    setLog((p) => ["Initializing…", ...p]);
    await release(); // ensure clean state if re-initializing

    // Use publicPath mode (files served from /public). Base64 also supported if you prefer.
    const porcupineKeyword = {
      publicPath: keywordPath,
      label: label || "keyword",
    } as any;

    const porcupineModel = {
      publicPath: modelPath,
    } as any;

    try {
      await init(accessKey.trim(), porcupineKeyword, porcupineModel);
      setLog((p) => ["Initialized ✓", ...p]);
    } catch (e: any) {
      setLog((p) => [`Init failed: ${e?.message ?? e}`, ...p]);
    }
  }, [accessKey, keywordPath, modelPath, label, init, release]);

  const handleStart = useCallback(async () => {
    try {
      await start();
      setLog((p) => ["Listening… (say your wake word)", ...p]);
    } catch (e: any) {
      setLog((p) => [`Start failed: ${e?.message ?? e}`, ...p]);
    }
  }, [start]);

  const handleStop = useCallback(async () => {
    try {
      await stop();
      setLog((p) => ["Stopped.", ...p]);
    } catch (e: any) {
      setLog((p) => [`Stop failed: ${e?.message ?? e}`, ...p]);
    }
  }, [stop]);

  const handleRelease = useCallback(async () => {
    try {
      await release();
      setLog((p) => ["Released resources.", ...p]);
    } catch (e: any) {
      setLog((p) => [`Release failed: ${e?.message ?? e}`, ...p]);
    }
  }, [release]);

  return (
    <main className="min-h-screen p-6 flex flex-col items-center gap-6">
      <div className="w-full max-w-2xl">
        <h1 className="text-2xl font-bold">Porcupine Wake Word · Test</h1>
        <p className="mt-2 text-sm opacity-80">
          Works on modern browsers. Use over HTTPS or <code>localhost</code> so
          the mic can be accessed.
        </p>

        <div className="mt-6 grid gap-4">
          <label className="grid gap-1">
            <span className="text-sm font-medium">Access Key</span>
            <input
              type="password"
              placeholder="Picovoice AccessKey"
              className="border rounded px-3 py-2"
              value={accessKey}
              onChange={(e) => setAccessKey(e.target.value)}
            />
          </label>

          <label className="grid gap-1">
            <span className="text-sm font-medium">
              Keyword .ppn (public path)
            </span>
            <input
              type="text"
              placeholder="/porcupine/keyword.ppn"
              className="border rounded px-3 py-2"
              value={keywordPath}
              onChange={(e) => setKeywordPath(e.target.value)}
            />
          </label>

          <label className="grid gap-1">
            <span className="text-sm font-medium">Keyword label</span>
            <input
              type="text"
              placeholder="keyword"
              className="border rounded px-3 py-2"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
            />
          </label>

          <label className="grid gap-1">
            <span className="text-sm font-medium">
              Model .pv (public path; set locale-specific model if needed)
            </span>
            <input
              type="text"
              placeholder="/porcupine/porcupine_params.pv"
              className="border rounded px-3 py-2"
              value={modelPath}
              onChange={(e) => setModelPath(e.target.value)}
            />
          </label>

          <div className="flex flex-wrap gap-2 mt-2">
            <button
              onClick={handleInit}
              className="px-4 py-2 rounded bg-black text-white disabled:opacity-50"
            >
              Init
            </button>
            <button
              onClick={handleStart}
              className="px-4 py-2 rounded border"
              disabled={!isLoaded}
            >
              Start
            </button>
            <button
              onClick={handleStop}
              className="px-4 py-2 rounded border"
              disabled={!isLoaded || !isListening}
            >
              Stop
            </button>
            <button
              onClick={handleRelease}
              className="px-4 py-2 rounded border"
            >
              Release
            </button>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
            <StatusItem label="Loaded" value={String(isLoaded)} />
            <StatusItem label="Listening" value={String(isListening)} />
            <StatusItem label="Mic permission" value={String(permission)} />
            <StatusItem label="Error" value={error ? String(error) : "-"} />
          </div>

          <div className="mt-6">
            <h2 className="font-semibold">Detections / Log</h2>
            <ul className="mt-2 space-y-1 max-h-64 overflow-auto border rounded p-3 text-sm bg-white">
              {log.length === 0 ? (
                <li className="opacity-70">No events yet.</li>
              ) : (
                log.map((l, i) => (
                  <li key={i} className="font-mono">
                    {l}
                  </li>
                ))
              )}
            </ul>
          </div>
        </div>
      </div>
    </main>
  );
}

function StatusItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid">
      <span className="opacity-70 text-xs">{label}</span>
      <span className="font-mono">{value}</span>
    </div>
  );
}
