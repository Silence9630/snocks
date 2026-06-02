import React, { useState } from "react";
import { Stock } from "../types";
import { Search, TrendingUp, TrendingDown } from "lucide-react";

interface StockListProps {
  stocks: Stock[];
  selectedStockSymbol: string;
  onSelectStock: (symbol: string) => void;
}

export default function StockList({ stocks, selectedStockSymbol, onSelectStock }: StockListProps) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredStocks = stocks.filter((s) => 
    s.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div id="stock-list" className="bg-white border-2 border-black rounded-none p-4 flex flex-col h-[520px] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] text-black">
      
      {/* Search Header */}
      <div className="relative mb-4">
        <Search className="w-4 h-4 text-black absolute left-3 top-3.5" />
        <input
          type="text"
          placeholder="FILTER TICKERS (SNOCK, AAPL...)"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-white border-2 border-black rounded-none py-2.5 pl-9 pr-4 text-xs font-mono font-bold text-black placeholder-zinc-500 focus:outline-none focus:bg-[#00FF00] transition-colors"
        />
      </div>

      {/* Stock Tickers Scroll List */}
      <div className="flex-1 overflow-y-auto space-y-2 pr-1 scrollbar-thin scrollbar-thumb-zinc-300">
        {filteredStocks.length === 0 ? (
          <div className="text-center py-10 text-xs font-mono text-zinc-500 font-bold border-2 border-dashed border-zinc-300">
            No matching tickers found
          </div>
        ) : (
          filteredStocks.map((stock) => {
            const isSelected = stock.symbol === selectedStockSymbol;
            const isPositive = stock.change >= 0;

            return (
              <button
                key={stock.symbol}
                type="button"
                onClick={() => onSelectStock(stock.symbol)}
                className={`w-full text-left p-3 rounded-none border-2 border-black transition-all flex items-center justify-between cursor-pointer select-none ${isSelected ? 'bg-[#00FF00] shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]' : 'bg-white hover:bg-zinc-100 shadow-[2px_2px_0px_0px_rgba(0,0,0,0.5)]'}`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-none border-2 border-black flex items-center justify-center font-black font-mono text-xs ${isSelected ? 'bg-black text-white' : 'bg-zinc-100 text-black'}`}>
                    {stock.symbol.slice(0, 3)}
                  </div>
                  <div>
                    <span className="font-mono font-bold text-black text-xs block">
                      {stock.symbol}
                    </span>
                    <span className="text-[10px] font-bold text-zinc-650 block truncate max-w-[140px] uppercase">
                      {stock.name}
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="font-mono text-xs font-black text-black block">
                    ${stock.price.toFixed(2)}
                  </span>
                  
                  <span className={`inline-flex items-center gap-0.5 text-[10px] font-mono font-black mt-0.5 px-1 ${isPositive ? 'bg-emerald-100 text-emerald-800 border border-emerald-400' : 'bg-rose-100 text-rose-800 border border-rose-400'}`}>
                    {isPositive ? <TrendingUp className="w-2.5 h-2.5" /> : <TrendingDown className="w-2.5 h-2.5" />}
                    <span>
                      {isPositive ? '+' : ''}{stock.changePercent.toFixed(2)}%
                    </span>
                  </span>
                </div>
              </button>
            );
          })
        )}
      </div>

      {/* Static Footer Statistics Context */}
      <div className="border-t-2 border-black pt-3 mt-3 text-[10px] font-mono font-black text-black flex justify-between uppercase">
        <span>FEED: LIVE TICK</span>
        <span>INTEGRITY: SECURE</span>
      </div>

    </div>
  );
}
