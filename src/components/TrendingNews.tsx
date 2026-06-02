import React from "react";
import { NewsArticle } from "../types";
import { AlertCircle, ArrowUpRight, ArrowDownRight, Newspaper } from "lucide-react";

interface TrendingNewsProps {
  news: NewsArticle[];
  selectedSymbol: string;
}

export default function TrendingNews({ news, selectedSymbol }: TrendingNewsProps) {
  // Let's filter news related to selected stock or show general news
  const prioritizedNews = [...news].sort((a, b) => {
    if (a.symbol === selectedSymbol && b.symbol !== selectedSymbol) return -1;
    if (a.symbol !== selectedSymbol && b.symbol === selectedSymbol) return 1;
    return 0;
  });

  const getSentimentBadge = (sentiment: 'BULLISH' | 'BEARISH' | 'NEUTRAL') => {
    switch (sentiment) {
      case 'BULLISH':
        return (
          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-none text-[9px] font-mono font-black bg-[#E6FEE6] text-emerald-950 border border-black">
            <ArrowUpRight className="w-2.5 h-2.5 stroke-[3px]" /> BULLISH
          </span>
        );
      case 'BEARISH':
        return (
          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-none text-[9px] font-mono font-black bg-[#FEE6E6] text-rose-950 border border-black">
            <ArrowDownRight className="w-2.5 h-2.5 stroke-[3px]" /> BEARISH
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-none text-[9px] font-mono font-black bg-zinc-100 text-black border border-black">
            NEUTRAL
          </span>
        );
    }
  };

  return (
    <div id="trending-news" className="bg-white border-2 border-black rounded-none p-5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] text-black">
      <div className="flex items-center gap-2 mb-4">
        <Newspaper className="w-4 h-4 text-black stroke-[2.5px]" />
        <h4 className="font-sans font-black text-sm uppercase">
          Global Marketplace & Ticker Headlines
        </h4>
      </div>

      <div className="space-y-4">
        {prioritizedNews.map((article) => {
          const isRelated = article.symbol === selectedSymbol;

          return (
            <div
              key={article.id}
              className={`p-3.5 rounded-none border-2 border-black transition-all shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:bg-[#FDFDFD] ${isRelated ? 'bg-zinc-50 border-[#00FF00]' : 'bg-white border-black'}`}
            >
              <div className="flex flex-wrap items-center gap-2 mb-1.5">
                <span className="text-[10px] font-mono font-black text-white bg-black px-1.5 py-0.5 rounded-none border border-black">
                  {article.symbol}
                </span>

                {getSentimentBadge(article.sentiment)}

                <span className="text-[10px] font-mono font-black text-zinc-500 ml-auto uppercase">
                  {article.timestamp}
                </span>
              </div>

              <h5 className="font-sans font-black text-xs text-black leading-snug hover:underline cursor-pointer uppercase">
                {article.title}
              </h5>

              <p className="text-[10.5px] font-sans font-medium text-zinc-700 mt-1 lines-clamp-2 leading-relaxed">
                {article.summary}
              </p>

              <span className="text-[9px] font-mono font-black text-zinc-600 block mt-2 text-right uppercase">
                via {article.source}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
