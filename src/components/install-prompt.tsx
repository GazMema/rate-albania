"use client";

import { useEffect, useState } from "react";
import { Download, X } from "lucide-react";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

export function InstallPrompt() {
  const [prompt, setPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(() => undefined);
    }

    const onPrompt = (event: Event) => {
      event.preventDefault();
      setPrompt(event as BeforeInstallPromptEvent);
    };

    window.addEventListener("beforeinstallprompt", onPrompt);
    return () => window.removeEventListener("beforeinstallprompt", onPrompt);
  }, []);

  if (!prompt || hidden) return null;

  return (
    <div className="fixed inset-x-4 bottom-4 z-40 mx-auto max-w-xl rounded-lg border border-stone-200 bg-white p-3 shadow-xl">
      <div className="flex items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-md bg-stone-950 text-white">
          <Download size={18} />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold">Instalo Vlereso në telefon</p>
          <p className="text-xs text-stone-600">
            Përdore si aplikacion, pa App Store.
          </p>
        </div>
        <button
          className="focus-ring rounded-md bg-[#c91f37] px-3 py-2 text-xs font-semibold text-white"
          onClick={async () => {
            await prompt.prompt();
            await prompt.userChoice;
            setHidden(true);
          }}
        >
          Instalo
        </button>
        <button
          className="focus-ring rounded-md p-2 text-stone-500 hover:bg-stone-100"
          onClick={() => setHidden(true)}
          aria-label="Mbyll"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
}
