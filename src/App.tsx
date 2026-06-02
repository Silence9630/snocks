import React, { useState, useEffect } from "react";
import { Stock, Portfolio, Transaction } from "./types";
import { INITIAL_STOCKS, INITIAL_NEWS } from "./mockData";
import StockList from "./components/StockList";
import StockChart from "./components/StockChart";
import AIPositionAnalyst from "./components/AIPositionAnalyst";
import PortfolioSummary from "./components/PortfolioSummary";
import TrendingNews from "./components/TrendingNews";
import TransactionHistory from "./components/TransactionHistory";
import { Activity, Sparkles, TrendingUp, DollarSign, Wallet, RefreshCcw } from "lucide-react";

export default function App() {
  const [stocks, setStocks] = useState<Stock[]>(INITIAL_STOCKS);
  const [selectedStockSymbol, setSelectedStockSymbol] = useState<string>("SNOCK");
  const [news, setNews] = useState(INITIAL_NEWS);
  const [activeTab, setActiveTab] = useState<'news' | 'ledger'>('news');
  const [chartTimeframe, setChartTimeframe] = useState<string>("1D");

  // Portfolio local state
  const [portfolio, setPortfolio] = useState<Portfolio>({
    cash: 50000.00, // $50,000 starting mock money
    holdings: {
      "SNOCK": {
        symbol: "SNOCK",
        shares: 10,
        avgBuyPrice: 32.00
      }
    },
    netWorthHistory: []
  });

  // Transaction history state
  const [transactions, setTransactions] = useState<Transaction[]>([
    {
      id: "tx-init",
      timestamp: new Date(Date.now() - 36 * 60 * 60 * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      symbol: "SNOCK",
      type: "BUY",
      shares: 10,
      price: 32.00
    }
  ]);

  const selectedStock = stocks.find((s) => s.symbol === selectedStockSymbol) || stocks[0];

  // Active Simulated Ticker Engine (Every 3 seconds)
  useEffect(() => {
    const ticker = setInterval(() => {
      setStocks((prevStocks) => {
        return prevStocks.map((stock) => {
          // Add a subtle fluctuation
          const randomFactor = (Math.random() - 0.49); // subtle positive bias
          const volatility = stock.symbol === "SNOCK" ? 0.022 : 0.006; // SNOCK is highly volatile meme!
          const deltaPercent = randomFactor * volatility;
          
          const priceShift = stock.price * deltaPercent;
          const newPrice = Math.max(1.0, stock.price + priceShift);
          const change = stock.change + priceShift;
          const changePercent = (change / (stock.price - change)) * 100;
          
          // Generate a new 1D history point
          const nowLabel = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
          const updated1D = [...stock.history["1D"]];
          
          // Append new ticker point
          updated1D.push({
            time: nowLabel,
            price: parseFloat(newPrice.toFixed(2))
          });

          // Prevent history from blowing up, keep sliding window of max 15 entries
          if (updated1D.length > 15) {
            updated1D.shift();
          }

          const updatedHistory = {
            ...stock.history,
            "1D": updated1D
          };

          return {
            ...stock,
            price: parseFloat(newPrice.toFixed(2)),
            change: parseFloat(change.toFixed(2)),
            changePercent: parseFloat(changePercent.toFixed(2)),
            high: parseFloat(Math.max(stock.high, newPrice).toFixed(2)),
            low: parseFloat(Math.min(stock.low, newPrice).toFixed(2)),
            history: updatedHistory
          };
        });
      });
    }, 3000);

    return () => clearInterval(ticker);
  }, []);

  // Handle buying and selling simulations
  const handleExecuteTrade = (symbol: string, type: 'BUY' | 'SELL', sharesCount: number, currentPrice: number) => {
    const cost = sharesCount * currentPrice;
    
    setPortfolio((prevPortfolio) => {
      const updatedHoldings = { ...prevPortfolio.holdings };
      const currentHolding = updatedHoldings[symbol];

      let newCash = prevPortfolio.cash;

      if (type === 'BUY') {
        newCash -= cost;
        if (currentHolding) {
          // Recalculate average purchase price weighting
          const totalShares = currentHolding.shares + sharesCount;
          const weightedCost = ((currentHolding.shares * currentHolding.avgBuyPrice) + cost) / totalShares;
          
          updatedHoldings[symbol] = {
            symbol,
            shares: totalShares,
            avgBuyPrice: parseFloat(weightedCost.toFixed(2))
          };
        } else {
          updatedHoldings[symbol] = {
            symbol,
            shares: sharesCount,
            avgBuyPrice: currentPrice
          };
        }
      } else { // SELL
        newCash += cost;
        if (currentHolding) {
          const matchingShares = currentHolding.shares - sharesCount;
          if (matchingShares <= 0) {
            delete updatedHoldings[symbol];
          } else {
            updatedHoldings[symbol] = {
              ...currentHolding,
              shares: matchingShares
            };
          }
        }
      }

      return {
        ...prevPortfolio,
        cash: parseFloat(newCash.toFixed(2)),
        holdings: updatedHoldings
      };
    });

    // Record transaction
    const newTx: Transaction = {
      id: `tx-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      symbol,
      type,
      shares: sharesCount,
      price: currentPrice
    };

    setTransactions((prev) => [...prev, newTx]);
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-black flex flex-col font-sans select-none antialiased">
      {/* Top Banner Branding Header */}
      <header className="border-b-4 border-black bg-white sticky top-0 z-40 px-4 py-4 sm:px-8 flex justify-between items-center shadow-[0_4px_0px_0px_rgba(0,0,0,1)]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-none bg-black flex items-center justify-center text-white border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
            <Activity className="w-6 h-6 text-[#00FF00] animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-sans font-black text-xl tracking-tighter text-black uppercase">
                Snocks Board
              </span>
              <span className="bg-[#00FF00] text-black font-mono text-[9px] font-black tracking-widest px-1.5 py-0.5 rounded-none border border-black uppercase shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]">
                AI Beta
              </span>
            </div>
            <p className="text-[10px] text-zinc-700 font-mono font-bold uppercase">
              Simulated Market Console
            </p>
          </div>
        </div>

        {/* Global stats info line */}
        <div className="hidden md:flex items-center gap-6 text-xs font-mono">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#00FF00] border border-black animate-ping" />
            <span className="text-black font-black uppercase">Real-Time Market Feeds Active</span>
          </div>
          <div className="text-black font-semibold border-2 border-black bg-[#F2F2F2] px-3 py-1.5 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
            Cash Liquidity Pool: <span className="text-black font-black bg-[#00FF00] px-1 border border-black">${portfolio.cash.toLocaleString("en-US", { minimumFractionDigits: 2 })}</span>
          </div>
        </div>
      </header>

      {/* Main Dynamic Layout Body */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 py-8 sm:px-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Ticker Pipeline Layout (Grid colspan 4) */}
        <div className="lg:col-span-4 space-y-6">
          <div className="sticky top-28">
            <h2 className="text-xs font-mono text-black uppercase tracking-widest mb-3 flex items-center gap-1.5 font-black bg-[#F2F2F2] py-2 px-3 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
              <span className="text-[#00FF00] stroke-black" style={{ WebkitTextStroke: "1px black" }}>●</span> Market Securities Ticker List
            </h2>
            <StockList
              stocks={stocks}
              selectedStockSymbol={selectedStockSymbol}
              onSelectStock={(sym) => {
                setSelectedStockSymbol(sym);
                setChartTimeframe("1D"); // reset frame
              }}
            />
          </div>
        </div>

        {/* Right Active Trading and Chart Section Layout (Grid colspan 8) */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* Active Security Header Detail */}
          <div className="bg-white border-2 border-black rounded-none p-5 flex flex-wrap items-center justify-between gap-4 text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <div className="flex items-center gap-4">
              <div className="p-3.5 bg-black rounded-none text-white border-2 border-black font-mono font-black text-center text-lg tracking-wider">
                {selectedStock.symbol}
              </div>
              <div>
                <h2 className="font-black font-sans text-2xl text-black tracking-tight uppercase">
                  {selectedStock.name}
                </h2>
                <span className="text-xs font-mono font-black text-zinc-700 block mt-0.5 uppercase">
                  Sector Indicator: <span className="bg-zinc-100 px-1 border border-black text-black font-black">{selectedStock.sector}</span>
                </span>
              </div>
            </div>

            {/* Price change badge details */}
            <div className="text-right">
              <span className="text-3xl font-mono font-black text-black block">
                ${selectedStock.price.toFixed(2)}
              </span>
              <span className={`inline-flex items-center gap-1 font-mono font-black text-xs mt-1 px-1.5 py-0.5 border border-black shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] ${selectedStock.change >= 0 ? 'bg-[#00FF00] text-black' : 'bg-rose-500 text-white'}`}>
                {selectedStock.change >= 0 ? '+' : ''}{selectedStock.changePercent.toFixed(2)}% ({selectedStock.change >= 0 ? '+' : ''}{selectedStock.change.toFixed(2)})
              </span>
            </div>
          </div>

          {/* Large Chart Canvas Frame with Frame Tabs */}
          <div className="bg-white border-2 border-black rounded-none p-4 space-y-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <div className="flex items-center justify-between border-b border-black pb-3">
              <span className="text-xs font-mono font-black text-black uppercase tracking-widest">
                Interactive Ticker Canvas
              </span>

              {/* Timeframe selector tabs */}
              <div className="flex gap-1 bg-[#F2F2F2] border-2 border-black p-0.5 rounded-none">
                {["1D", "1W", "1M", "1Y"].map((tf) => (
                  <button
                    key={tf}
                    type="button"
                    onClick={() => setChartTimeframe(tf)}
                    className={`px-3 py-1 text-[10px] font-mono font-black border transition-all cursor-pointer ${chartTimeframe === tf ? "bg-black text-white border-black" : "text-black bg-white hover:bg-zinc-100 border-white"}`}
                  >
                    {tf}
                  </button>
                ))}
              </div>
            </div>

            {/* Graphic Polyline Plot */}
            <StockChart
              data={selectedStock.history[chartTimeframe] || []}
              color={selectedStock.changePercent >= 0 ? "green" : "red"}
              symbol={selectedStock.symbol}
            />

            {/* Session Extra Statistics Details Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-[#F2F2F2] border-2 border-black rounded-none text-center text-xs font-mono text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] uppercase">
              <div>
                <span className="text-zinc-650 block text-[10px] font-black">Session High</span>
                <span className="text-black font-black mt-0.5 block text-sm">${selectedStock.high.toFixed(2)}</span>
              </div>
              <div>
                <span className="text-zinc-650 block text-[10px] font-black">Session Low</span>
                <span className="text-black font-black mt-0.5 block text-sm">${selectedStock.low.toFixed(2)}</span>
              </div>
              <div>
                <span className="text-zinc-650 block text-[10px] font-black">Market Capital</span>
                <span className="text-black font-black mt-0.5 block text-sm">{selectedStock.marketCap}</span>
              </div>
              <div>
                <span className="text-zinc-650 block text-[10px] font-black">PE Ratio (LTM)</span>
                <span className="text-black font-black mt-0.5 block text-sm">{selectedStock.peRatio}x</span>
              </div>
            </div>
          </div>

          {/* Quick Trade Executions Panel */}
          <PortfolioSummary
            portfolio={portfolio}
            selectedStock={selectedStock}
            transactions={transactions}
            onExecuteTrade={handleExecuteTrade}
          />

          {/* Gemini AI Analyst position review */}
          <AIPositionAnalyst selectedStock={selectedStock} />

          {/* Tabbed News and Ledger bottom panel */}
          <div className="space-y-4">
            <div className="flex border-b-2 border-black gap-2">
              <button
                onClick={() => setActiveTab('news')}
                className={`px-4 py-2 text-xs font-mono font-black border-2 border-black border-b-0 transition-all cursor-pointer select-none uppercase ${activeTab === 'news' ? 'bg-black text-white' : 'bg-white text-black hover:bg-zinc-100'}`}
              >
                Market News Room
              </button>
              <button
                onClick={() => setActiveTab('ledger')}
                className={`px-4 py-2 text-xs font-mono font-black border-2 border-black border-b-0 transition-all cursor-pointer select-none uppercase ${activeTab === 'ledger' ? 'bg-black text-white' : 'bg-white text-black hover:bg-zinc-100'}`}
              >
                Order Audit Ledger
              </button>
            </div>

            {activeTab === 'news' ? (
              <TrendingNews news={news} selectedSymbol={selectedStockSymbol} />
            ) : (
              <TransactionHistory transactions={transactions} />
            )}
          </div>

        </div>

      </main>

      {/* Footer credit strip */}
      <footer className="border-t-4 border-black bg-white py-6 mt-12 text-center text-[10px] font-mono font-black text-black uppercase tracking-widest px-4">
        Snocks Stock Market Simulator &bull; Protected Sandbox Trade execution &bull; AI generated reviews powered by Google Gemini-3.5-flash
      </footer>
    </div>
  );
}
