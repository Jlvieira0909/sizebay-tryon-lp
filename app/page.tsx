"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Script from "next/script";

function TryOnExperience() {
  const searchParams = useSearchParams();
  const [step, setStep] = useState<"loading" | "finished">("loading");

  const title = searchParams.get("title") || "Produto";
  const sourceUrl = searchParams.get("sourceUrl") || "/";

  useEffect(() => {
    // Fica "escutando" a DOM para ver quando o script da Sizebay
    // termina de injetar o botão dentro da nossa âncora
    const checkButtonInterval = setInterval(() => {
      // Procura qualquer elemento clicável dentro da nossa âncora
      const tryOnBtn = document.querySelector(
        "#szb-tryon-anchor > div, #szb-tryon-anchor button, #szb-tryon-anchor a"
      ) as HTMLElement;

      if (tryOnBtn) {
        clearInterval(checkButtonInterval);

        // Emula o clique do usuário!
        tryOnBtn.click();

        // Muda o estado para a tela "Finalizada" (que ficará no fundo do modal da Sizebay)
        setStep("finished");
      }
    }, 500); // checa a cada meio segundo

    return () => clearInterval(checkButtonInterval);
  }, []);

  // Função para abrir o iframe de novo caso o usuário queira testar novamente
  const handleTestAgain = () => {
    const tryOnBtn = document.querySelector(
      "#szb-tryon-anchor > div, #szb-tryon-anchor button, #szb-tryon-anchor a"
    ) as HTMLElement;
    if (tryOnBtn) tryOnBtn.click();
  };

  return (
    <div className="min-h-screen w-full bg-gray-50 flex flex-col items-center justify-center p-4">
      {/* 1. O ELEMENTO DE ANCORAGEM OCULTO */}
      {/* Ele fica invisível para não bagunçar o design, mas recebe o botão da Sizebay */}
      <div id="szb-tryon-anchor" className="hidden"></div>

      {/* 2. CARREGAMENTO DO SEU PRE-SCRIPT */}
      {/* O Next.js carrega isso de forma otimizada */}
      <Script
        src="https://static.sizebay.technology/1039/to_prescript.js"
        strategy="afterInteractive"
      />

      {/* ESTADO 1: CARREGANDO (Até o botão ser clicado automaticamente) */}
      {step === "loading" && (
        <div className="flex flex-col items-center animate-pulse">
          <div className="w-12 h-12 border-4 border-[#6C5294] border-t-transparent rounded-full animate-spin mb-4"></div>
          <h1 className="text-2xl font-bold text-gray-800 text-center">
            Carregando sua experiência...
          </h1>
          <p className="text-gray-500 mt-2 text-center">
            Preparando o provador virtual para {title}
          </p>
        </div>
      )}

      {/* ESTADO 2: FINALIZADO (Fica no background, revelado quando fecha o Modal do Try-On) */}
      {step === "finished" && (
        <div className="flex flex-col items-center bg-white p-8 rounded-2xl shadow-lg max-w-md w-full text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            O que deseja fazer agora?
          </h2>

          <button
            onClick={handleTestAgain}
            className="w-full bg-[#6C5294] hover:bg-[#553e77] text-white font-bold py-3 px-6 rounded-full mb-4 transition-colors"
          >
            Testar o Try-On Novamente
          </button>

          <a
            href={sourceUrl}
            className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold py-3 px-6 rounded-full transition-colors inline-block"
          >
            Voltar à página anterior
          </a>
        </div>
      )}
    </div>
  );
}

export default function Page() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center animate-pulse text-gray-400 font-semibold">
          Carregando Try-On...
        </div>
      }
    >
      <TryOnExperience />
    </Suspense>
  );
}
