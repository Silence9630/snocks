import React from "react";
import { Transaction } from "../types";
import { History, Calendar, DollarSign, Activity } from "lucide-react";

interface TransactionHistoryProps {
  transactions: Transaction[];
}

export default function TransactionHistory({ transactions }: TransactionHistoryProps) {
  return (
    <div id="transaction-history" className="bg-white border-2 border-black rounded-none p-5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] text-black">
      <div className="flex items-center justify-between mb-4 pb-2 border-b-2 border-black">
        <div className="flex items-center gap-2">
          <History className="w-4 h-4 text-black stroke-[2.5px]" />
          <h4 className="font-sans font-black text-sm uppercase">
            Simulated Trade Audit Logs
          </h4>
        </div>
        <span className="text-[10px] font-mono font-black text-white bg-black px-1.5 py-0.5 rounded-none uppercase">
          {transactions.length} Order{transactions.length !== 1 ? 's' : ''} Record
        </span>
      </div>

      {transactions.length === 0 ? (
        <div className="py-12 border-2 border-dashed border-black bg-zinc-50 text-center text-xs font-mono font-black text-zinc-600 uppercase">
          No transactions registered in this trading session. Combine order tickers above to execute a trade!
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono border-collapse text-black font-semibold">
            <thead>
              <tr className="border-b-2 border-dashed border-black text-black uppercase tracking-widest text-[10px] pb-2 font-black">
                <th className="py-2.5 font-black">Timestamp</th>
                <th className="py-2.5 font-black">Ticker</th>
                <th className="py-2.5 font-black">Execute</th>
                <th className="py-2.5 font-black text-right">Shares</th>
                <th className="py-2.5 font-black text-right">Price</th>
                <th className="py-2.5 font-black text-right">Total Outlay</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200">
              {[...transactions].reverse().map((tx) => {
                const total = tx.shares * tx.price;
                const isBuy = tx.type === "BUY";

                return (
                  <tr key={tx.id} className="text-black hover:bg-zinc-50 transition-colors uppercase font-bold">
                    <td className="py-3 text-zinc-600 font-bold">{tx.timestamp}</td>
                    <td className="py-3 font-black text-black">{tx.symbol}</td>
                    <td className="py-3">
                      <span className={`inline-block px-1.5 py-0.5 rounded-none text-[9px] font-black border border-black shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] ${isBuy ? 'bg-[#00FF00] text-black' : 'bg-rose-500 text-white'}`}>
                        {tx.type}
                      </span>
                    </td>
                    <td className="py-3 text-right text-black font-black">{tx.shares}</td>
                    <td className="py-3 text-right text-zinc-800">${tx.price.toFixed(2)}</td>
                    <td className="py-3 text-right font-black text-black">${total.toFixed(2)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
