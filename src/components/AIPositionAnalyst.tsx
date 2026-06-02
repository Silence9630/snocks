import React, { useState } from "react";
import { Stock, AIAnalysis } from "../types";
import { Sparkles, TrendingUp, AlertTriangle, AlertCircle, RefreshCw, BarChart } from "lucide-react";

interface AIPositionAnalystProps {
  selectedStock: Stock;
}

const LOADING_PHRASES = [
  "Auditing asset sheets and earnings metrics...",
  "Consulting market sentiment databases...",
  "Running Monte Carlo scenario evaluations...",
  "Running technical analysis on ticker trends...",
  "Formulating strategic investment review...",
];

export default function AIPositionAnalyst({ selectedStock }: AIPositionAnalystProps) {
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<AIAnalysis | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loadingPhraseIndex, setLoadingPhraseIndex] = useState(0);

  const fetchAnalysis = async () => {
    setLoading(true);
    setError(null);
    setAnalysis(null);

    // Dynamic loader phrases switcher interval
    const phraseInterval = setInterval(() => {
      setLoadingPhraseIndex((prev) => (prev + 1) % LOADING_PHRASES.length);
    }, 1800);

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          symbol: selectedStock.symbol,
          name: selectedStock.name,
          price: selectedStock.price,
          change: selectedStock.change,
          changePercent: selectedStock.changePercent,
          sector: selectedStock.sector,
          high: selectedStock.high,
          low: selectedStock.low,
        }),
      });

      if (!response.ok) {
        throw new Error(`Server returned error status ${response.status}`);
      }

      const data = await response.json();
      setAnalysis(data);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "An unhandled error occurred while analyzing.");
    } finally {
      clearInterval(phraseInterval);
      setLoading(false);
    }
  };

  const getRecommendationColor = (rec: 'BUY' | 'HOLD' | 'SELL' | string) => {
    switch (rec?.toUpperCase()) {
      case "BUY":
        return "bg-[#00FF00] text-black border-2 border-black";
      case "SELL":
        return "bg-rose-500 text-white border-2 border-black font-black";
      default:
        return "bg-amber-400 text-black border-2 border-black";
    }
  };

  const getSentimentText = (sentiment: string) => {
    switch (sentiment?.toLowerCase()) {
      case "bullish":
        return "text-emerald-800 font-extrabold uppercase bg-emerald-100 px-2 py-1 border-2 border-black inline-block mt-1";
      case "bearish":
        return "text-rose-800 font-extrabold uppercase bg-rose-100 px-2 py-1 border-2 border-black inline-block mt-1";
      default:
        return "text-amber-800 font-extrabold uppercase bg-amber-100 px-2 py-1 border-2 border-black inline-block mt-1";
    }
  };

  return (
    <div id="ai-position-analyst" className="bg-white border-2 border-black rounded-none p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] relative overflow-hidden text-black">
      {/* Background radial highlight - subtle brutalist element */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-black/5 blur-[120px] rounded-full pointer-events-none" />

      {/* Title block */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b-2 border-black">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-black rounded-none text-white border-2 border-black">
            <Sparkles className="w-5 h-5 text-[#00FF00]" />
          </div>
          <div>
            <h3 className="font-sans font-black text-xl text-black uppercase tracking-tight">
              Gemini AI Stock Advisor
            </h3>
            <p className="text-xs font-mono font-bold text-zinc-700 uppercase">
              Deep research insight engine for <span className="bg-[#00FF00] px-1 text-black font-black">{selectedStock.symbol}</span>
            </p>
          </div>
        </div>

        <button
          onClick={fetchAnalysis}
          disabled={loading}
          className="flex items-center justify-center gap-2 px-5 py-3 bg-black hover:bg-zinc-800 disabled:bg-zinc-300 disabled:text-zinc-600 text-white font-black text-xs uppercase tracking-wider rounded-none border-2 border-black cursor-pointer transition select-none shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]"
        >
          {loading ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin text-zinc-300" />
              <span>Analyzing Ticker...</span>
            </>
          ) : (
            <>
              <BarChart className="w-4 h-4 text-[#00FF00]" />
              <span>Generate AI Analysis</span>
            </>
          )}
        </button>
      </div>

      {/* Loading Canvas */}
      {loading && (
        <div className="py-12 flex flex-col items-center justify-center text-center bg-zinc-50 border-2 border-black">
          <div className="relative mb-6">
            <div className="w-16 h-16 rounded-full border-4 border-black border-t-[#00FF00] animate-spin" />
            <Sparkles className="w-6 h-6 text-black absolute inset-0 m-auto animate-pulse" />
          </div>
          <span className="text-xs font-mono font-black text-black uppercase block animate-pulse">
            {LOADING_PHRASES[loadingPhraseIndex]}
          </span>
          <span className="text-[10px] font-mono text-zinc-600 mt-2 block uppercase font-bold">
            Powered by gemini-3.5-flash
          </span>
        </div>
      )}

      {/* Initial Screen */}
      {!loading && !analysis && !error && (
        <div className="py-10 text-center border-2 border-dashed border-black bg-zinc-50">
          <Sparkles className="w-8 h-8 text-black mx-auto mb-3" />
          <p className="text-sm text-black font-sans font-bold max-w-md mx-auto uppercase">
            Click &quot;Generate AI Analysis&quot; to fetch an instant hedge-fund evaluation compiled by Google Gemini.
          </p>
          <span className="text-[10px] font-mono text-zinc-600 mt-2 block uppercase tracking-widest font-black">
            Aggregating macro conditions + ticker metrics
          </span>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="p-4 bg-rose-50 border-2 border-black rounded-none text-rose-900 flex items-start gap-3 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
          <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="font-sans font-black uppercase text-sm">Analysis Fetch Failed</h4>
            <p className="text-xs font-mono text-zinc-800 mt-1">{error}</p>
            <p className="text-xs font-sans font-bold text-rose-700 mt-2 uppercase">
              Please ensure your Google Gemini API key is configured correctly in the **Settings &gt; Secrets** panel.
            </p>
          </div>
        </div>
      )}

      {/* Render AI Result */}
      {analysis && !loading && (
        <div className="space-y-6">
          {/* Bento summary strip */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Rating Score */}
            <div className="bg-[#F2F2F2] border-2 border-black p-4 rounded-none flex flex-col justify-between shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
              <span className="text-xs font-mono font-black uppercase text-zinc-700">Equity Score</span>
              <div className="flex items-baseline gap-2 mt-2">
                <span className="text-4xl font-black text-black font-sans">
                  {analysis.score}
                </span>
                <span className="text-xs font-mono font-black text-zinc-600">/100</span>
              </div>
              <div className="w-full bg-white border border-black h-3 rounded-none mt-3 overflow-hidden">
                <div
                  className="bg-[#00FF00] h-full rounded-none transition-all duration-1000 border-r border-black"
                  style={{ width: `${analysis.score}%` }}
                />
              </div>
            </div>

            {/* Recommendation badge */}
            <div className="bg-[#F2F2F2] border-2 border-black p-4 rounded-none flex flex-col justify-between shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
              <span className="text-xs font-mono font-black uppercase text-zinc-700">Target Recommendation</span>
              <div className="mt-2">
                <span className={`inline-block px-3 py-1.5 font-mono text-xs font-black rounded-none border-2 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] ${getRecommendationColor(analysis.recommendation)}`}>
                  {analysis.recommendation}
                </span>
              </div>
              <span className="text-[10px] font-mono font-bold text-zinc-700 mt-3 block leading-tight uppercase">
                Tactical short-term bias.
              </span>
            </div>

            {/* Overall Sentiment */}
            <div className="bg-[#F2F2F2] border-2 border-black p-4 rounded-none flex flex-col justify-between shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
              <span className="text-xs font-mono font-black uppercase text-zinc-700">Consensus Attitude</span>
              <div className="mt-1">
                {getSentimentText(analysis.sentiment)}
              </div>
              <p className="text-[10px] font-mono text-zinc-700 mt-2 line-clamp-2 leading-snug uppercase font-bold">
                {analysis.outlook}
              </p>
            </div>
          </div>

          {/* Deep Macro Analysis Essay */}
          <div className="bg-white border-2 border-black p-5 rounded-none shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
            <h4 className="text-xs font-mono font-black text-zinc-655 uppercase tracking-wider mb-2">
              Macro Outlook Summary
            </h4>
            <p className="text-sm font-sans font-medium text-black leading-relaxed whitespace-pre-line text-justify">
              {analysis.analysisText}
            </p>
          </div>

          {/* Business Strengths & Business Risks Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Strengths */}
            <div className="border-2 border-black bg-[#E6FEE6] p-4 rounded-none shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
              <div className="flex items-center gap-2 mb-3 text-black">
                <TrendingUp className="w-4 h-4 stroke-[3px]" />
                <h5 className="font-sans font-black text-sm uppercase">Core Strengths / Tailwinds</h5>
              </div>
              <ul className="space-y-2">
                {analysis.strengths.map((str, idx) => (
                  <li key={idx} className="text-xs font-sans text-black flex items-start gap-2 leading-relaxed font-bold">
                    <span className="bg-[#00FF00] text-black text-[10px] px-1 border border-black font-black leading-none">✓</span>
                    <span>{str}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Risks */}
            <div className="border-2 border-black bg-[#FEE6E6] p-4 rounded-none shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
              <div className="flex items-center gap-2 mb-3 text-black">
                <AlertTriangle className="w-4 h-4 stroke-[3px]" />
                <h5 className="font-sans font-black text-sm uppercase">Core Headwinds / Risks</h5>
              </div>
              <ul className="space-y-2">
                {analysis.risks.map((risk, idx) => (
                  <li key={idx} className="text-xs font-sans text-black flex items-start gap-2 leading-relaxed font-bold">
                    <span className="bg-rose-500 text-white text-[10px] px-1 border border-black font-black leading-none">!</span>
                    <span>{risk}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
