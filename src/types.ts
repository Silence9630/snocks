export interface HistoricDataPoint {
  time: string;
  price: number;
}

export interface Stock {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  sector: string;
  marketCap: string;
  volume: string;
  high: number;
  low: number;
  peRatio: number;
  history: Record<string, HistoricDataPoint[]>; // Timeframes: '1D', '1W', '1M', '1Y'
}

export interface Holding {
  symbol: string;
  shares: number;
  avgBuyPrice: number;
}

export interface Portfolio {
  cash: number;
  holdings: Record<string, Holding>;
  netWorthHistory: HistoricDataPoint[];
}

export interface Transaction {
  id: string;
  timestamp: string;
  symbol: string;
  type: 'BUY' | 'SELL';
  shares: number;
  price: number;
}

export interface NewsArticle {
  id: string;
  title: string;
  source: string;
  summary: string;
  sentiment: 'BULLISH' | 'BEARISH' | 'NEUTRAL';
  timestamp: string;
  symbol: string;
}

export interface AIAnalysis {
  symbol: string;
  name: string;
  sentiment: 'Bullish' | 'Bearish' | 'Neutral';
  recommendation: 'BUY' | 'HOLD' | 'SELL';
  score: number; // 0 - 100
  analysisText: string;
  strengths: string[];
  risks: string[];
  outlook: string;
}
