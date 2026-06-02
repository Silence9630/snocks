import React, { useState } from "react";
import { Stock, Portfolio, Transaction } from "../types";
import { Wallet, Briefcase, TrendingUp, DollarSign, History, AlertCircle, ArrowUpRight, ArrowDownRight } from "lucide-react";

interface PortfolioSummaryProps {
  portfolio: Portfolio;
  selectedStock: Stock;
  transactions: Transaction[];
  onExecuteTrade: (symbol: string, type: 'BUY' | 'SELL', sharesCount: number, currentPrice: number) => void;
}

export default function PortfolioSummary({
  portfolio,
  selectedStock,
  transactions,
  onExecuteTrade,
}: PortfolioSummaryProps) {
  const [sharesInput, setSharesInput] = useState<number>(5);
  const [tradeType, setTradeType] = useState<'BUY' | 'SELL'>('BUY');
  const [feedback, setFeedback] = useState<{ status: 'success' | 'error'; msg: string } | null>(null);

  // Derive valuation
  const holding = portfolio.holdings[selectedStock.symbol];
  const sharesOwned = holding ? holding.shares : 0;
  const avgCost = holding ? holding.avgBuyPrice : 0;
  
  const selectedHoldingsValuation = sharesOwned * selectedStock.price;
  const originalInvestment = sharesOwned * avgCost;
  const selectedGainLoss = selectedHoldingsValuation - originalInvestment;
  const selectedGainPercent = originalInvestment > 0 ? (selectedGainLoss / originalInvestment) * 100 : 0;

  // Global totals
  const totalAssetsValuation = Object.values(portfolio.holdings).reduce((acc, h) => {
    // Note: We'll evaluate holdings values using dynamic price mapping passed globally,
    // but evaluating currently selected stock specifically is always up-to-date!
    return acc + (h.shares * h.avgBuyPrice); // simplified fallback or asset cost values
  }, 0);

  const totalPortfolioValue = portfolio.cash + selectedHoldingsValuation; 

  const estimatedCost = sharesInput * selectedStock.price;

  const handleTradeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFeedback(null);

    if (sharesInput <= 0 || isNaN(sharesInput)) {
      setFeedback({ status: 'error', msg: "Input must be a positive number of shares." });
      return;
    }

    if (tradeType === 'BUY') {
      if (estimatedCost > portfolio.cash) {
        setFeedback({ status: 'error', msg: `Insufficient liquid cash. Est cost: $${estimatedCost.toFixed(2)} vs Cash: $${portfolio.cash.toFixed(2)}` });
        return;
      }
    } else {
      if (sharesInput > sharesOwned) {
        setFeedback({ status: 'error', msg: `Insufficient shares held. You own ${sharesOwned} shares of ${selectedStock.symbol}.` });
        return;
      }
    }

    // Execute through parent state handler
    onExecuteTrade(selectedStock.symbol, tradeType, sharesInput, selectedStock.price);
    
    setFeedback({
      status: 'success',
      msg: `Successfully ordered: ${tradeType} ${sharesInput} shares of ${selectedStock.symbol} at $${selectedStock.price.toFixed(2)}!`
    });

    // Clear feedback message after delay
    setTimeout(() => {
      setFeedback(null);
    }, 4000);
  };

  const formattedPortfolioValue = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD"
  }).format(totalPortfolioValue);

  const formattedCash = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD"
  }).format(portfolio.cash);

  return (
    <div id="portfolio-summary" className="grid grid-cols-1 md:grid-cols-3 gap-6 text-black">
      
      {/* Dynamic Net Worth Bento Card */}
      <div className="bg-white border-2 border-black rounded-none p-6 relative overflow-hidden flex flex-col justify-between shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
        <div className="absolute top-0 right-0 p-4 opacity-5">
          <Briefcase className="w-24 h-24 text-black" />
        </div>
        
        <div>
          <span className="text-xs font-mono text-zinc-700 uppercase tracking-widest block font-black">
            NET VALUE (CONTEXTUAL)
          </span>
          <h4 className="text-3xl font-black text-black mt-2 tracking-tight uppercase">
            {formattedPortfolioValue}
          </h4>
          <span className="text-[10px] font-mono font-bold text-zinc-600 block mt-1 leading-normal uppercase">
            Reflecting Cash + active ({selectedStock.symbol}) values.
          </span>
        </div>

        <div className="border-t-2 border-black mt-6 pt-4 space-y-3">
          <div className="flex justify-between items-center text-xs">
            <span className="text-zinc-700 font-mono flex items-center gap-1.5 font-bold uppercase">
              <Wallet className="w-3.5 h-3.5 text-black" /> Liquid Cash
            </span>
            <span className="font-mono text-black font-black bg-[#00FF00] px-1 border border-black">{formattedCash}</span>
          </div>

          <div className="flex justify-between items-center text-xs">
            <span className="text-zinc-700 font-mono flex items-center gap-1.5 font-bold uppercase">
              <Briefcase className="w-3.5 h-3.5 text-black" /> Position Cost
            </span>
            <span className="font-mono text-black font-bold">
              {sharesOwned} units @ avg ${avgCost.toFixed(2)}
            </span>
          </div>
        </div>
      </div>

      {/* Position Performance Bento Card */}
      <div className="bg-white border-2 border-black rounded-none p-6 flex flex-col justify-between shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
        <div>
          <span className="text-xs font-mono text-zinc-700 uppercase tracking-widest block font-black">
            ACTIVE ASSET PERFORMANCE
          </span>
          <h4 className="text-2xl font-black text-black mt-2 uppercase">
            {selectedStock.symbol} Position
          </h4>
          
          <div className="mt-4 grid grid-cols-2 gap-2 text-xs font-mono font-bold uppercase">
            <div>
              <span className="text-zinc-600 block">Total Shares Owned</span>
              <span className="text-base font-black text-black">{sharesOwned} Units</span>
            </div>
            <div>
              <span className="text-zinc-600 block">Current Value</span>
              <span className="text-base font-black text-black">${selectedHoldingsValuation.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {sharesOwned > 0 ? (
          <div className={`mt-4 p-3 rounded-none border-2 border-black flex items-center justify-between ${selectedGainLoss >= 0 ? "bg-[#E6FEE6] text-emerald-900" : "bg-[#FEE6E6] text-rose-900"}`}>
            <span className="text-xs font-mono font-black uppercase">Profit/Loss</span>
            <div className="text-right font-mono text-xs font-black flex items-center gap-1">
              {selectedGainLoss >= 0 ? <ArrowUpRight className="w-4 h-4 stroke-[3px]" /> : <ArrowDownRight className="w-4 h-4 stroke-[3px]" />}
              <span>
                {selectedGainLoss >= 0 ? '+' : ''}{selectedGainLoss.toFixed(2)} ({selectedGainPercent.toFixed(2)}%)
              </span>
            </div>
          </div>
        ) : (
          <div className="mt-4 p-3 rounded-none bg-zinc-100 border-2 border-dashed border-black text-zinc-600 text-xs font-mono font-bold text-center uppercase">
            No holdings in {selectedStock.symbol} yet.
          </div>
        )}
      </div>

      {/* Speed Order Transaction Ticket Panel */}
      <div className="bg-white border-2 border-black rounded-none p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
        <h4 className="text-xs font-mono text-zinc-700 uppercase tracking-widest mb-3 font-black">
          SIMULATED TRADING TICKET
        </h4>

        {/* Buy/Sell Side Toggle */}
        <div className="grid grid-cols-2 bg-[#F2F2F2] p-1 rounded-none border-2 border-black mb-4 gap-1">
          <button
            type="button"
            onClick={() => setTradeType('BUY')}
            className={`py-1.5 text-xs font-mono font-black transition-all cursor-pointer select-none border-2 border-black ${tradeType === 'BUY' ? 'bg-[#00FF00] text-black shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]' : 'bg-white text-black hover:bg-zinc-100'}`}
          >
            ORDER BUY
          </button>
          <button
            type="button"
            onClick={() => setTradeType('SELL')}
            className={`py-1.5 text-xs font-mono font-black transition-all cursor-pointer select-none border-2 border-black ${tradeType === 'SELL' ? 'bg-rose-500 text-white shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]' : 'bg-white text-black hover:bg-zinc-100'}`}
          >
            ORDER SELL
          </button>
        </div>

        <form onSubmit={handleTradeSubmit} className="space-y-4">
          <div>
            <div className="flex justify-between items-center text-xs font-mono font-bold uppercase mb-1">
              <span className="text-zinc-700">Order Quantity</span>
              <span className="text-zinc-600 font-extrabold">Held: {sharesOwned}</span>
            </div>
            <div className="relative">
              <input
                type="number"
                min="0.01"
                step="any"
                value={sharesInput}
                onChange={(e) => setSharesInput(Math.max(0, parseFloat(e.target.value) || 0))}
                className="w-full bg-white border-2 border-black rounded-none py-2 px-3 text-sm text-black focus:outline-none focus:bg-[#00FF00] transition-colors text-center font-mono font-black"
              />
              <span className="absolute right-3 top-2 text-xs font-mono font-black text-black">Shares</span>
            </div>
          </div>

          <div className="bg-[#F2F2F2] p-3 rounded-none border-2 border-black space-y-1.5 text-xs font-mono font-bold uppercase">
            <div className="flex justify-between text-zinc-700">
              <span>Execution Price</span>
              <span className="text-black font-black">${selectedStock.price.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-zinc-700">
              <span>Estimated Cost</span>
              <span className={`font-black px-1 border border-black ${tradeType === 'BUY' ? 'bg-[#00FF00] text-black' : 'bg-rose-100 text-rose-800'}`}>
                ${estimatedCost.toFixed(2)}
              </span>
            </div>
          </div>

          <button
            type="submit"
            className={`w-full py-2.5 rounded-none border-2 border-black text-xs font-mono font-black tracking-widest cursor-pointer transition select-none shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] ${tradeType === 'BUY' ? 'bg-[#00FF00] text-black hover:bg-emerald-400' : 'bg-rose-500 text-white hover:bg-rose-400'}`}
          >
            SUBMIT {tradeType} EXECUTION
          </button>
        </form>

        {/* Feedback notices */}
        {feedback && (
          <div className={`mt-3 p-2.5 rounded-none border-2 border-black text-xs font-bold leading-relaxed flex items-start gap-1.5 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] ${feedback.status === 'success' ? 'bg-[#E6FEE6] text-emerald-900' : 'bg-[#FEE6E6] text-rose-900'}`}>
            <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5 stroke-[3px]" />
            <span>{feedback.msg}</span>
          </div>
        )}
      </div>

    </div>
  );
}
