import { Stock, NewsArticle } from "./types";

// Dynamic simulation curve generator for Stock histories
export function generateHistory(basePrice: number, swingPercent: number, pointsCount: number, trend: 'up' | 'down' | 'volatile'): { time: string; price: number }[] {
  const points = [];
  let currentPrice = basePrice * (1 - swingPercent * 0.5); // Start lower/higher for nice slopes
  
  const now = new Date();
  
  for (let i = 0; i < pointsCount; i++) {
    const dataDate = new Date(now.getTime() - (pointsCount - i) * 60 * 60 * 1000); // Hourly segments
    const timeLabel = dataDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    // Calculate movement
    let changePercent = (Math.random() - 0.5) * swingPercent; 
    if (trend === 'up') changePercent += swingPercent * 0.15; // upward bias
    if (trend === 'down') changePercent -= swingPercent * 0.15; // downward bias
    
    currentPrice = Math.max(1, currentPrice * (1 + changePercent));
    
    points.push({
      time: timeLabel,
      price: parseFloat(currentPrice.toFixed(2))
    });
  }
  return points;
}

export const INITIAL_STOCKS: Stock[] = [
  {
    symbol: "SNOCK",
    name: "Snocks AI & Memes Inc.",
    price: 42.06,
    change: 4.89,
    changePercent: 13.15,
    sector: "Technology / Internet Culture",
    marketCap: "4.20B",
    volume: "12,940,110",
    high: 44.50,
    low: 36.10,
    peRatio: 69.4,
    history: {
      "1D": [
        { time: "09:30 AM", price: 36.10 },
        { time: "10:30 AM", price: 38.50 },
        { time: "11:30 AM", price: 37.20 },
        { time: "12:30 PM", price: 41.00 },
        { time: "01:30 PM", price: 39.80 },
        { time: "02:30 PM", price: 43.10 },
        { time: "03:30 PM", price: 42.06 }
      ],
      "1W": [
        { time: "Mon", price: 29.50 },
        { time: "Tue", price: 33.10 },
        { time: "Wed", price: 32.80 },
        { time: "Thu", price: 38.90 },
        { time: "Fri", price: 42.06 }
      ],
      "1M": [
        { time: "Wk 1", price: 18.20 },
        { time: "Wk 2", price: 24.50 },
        { time: "Wk 3", price: 31.00 },
        { time: "Wk 4", price: 42.06 }
      ],
      "1Y": [
        { time: "Q1", price: 5.40 },
        { time: "Q2", price: 12.10 },
        { time: "Q3", price: 28.50 },
        { time: "Q4", price: 42.06 }
      ]
    }
  },
  {
    symbol: "NVDA",
    name: "NVIDIA Corporation",
    price: 127.40,
    change: 3.12,
    changePercent: 2.51,
    sector: "Semiconductors",
    marketCap: "3.13T",
    volume: "42,890,300",
    high: 129.10,
    low: 123.50,
    peRatio: 66.8,
    history: {
      "1D": [
        { time: "09:30 AM", price: 123.50 },
        { time: "10:30 AM", price: 124.90 },
        { time: "11:30 AM", price: 125.80 },
        { time: "12:30 PM", price: 127.10 },
        { time: "01:30 PM", price: 126.40 },
        { time: "02:30 PM", price: 128.20 },
        { time: "03:30 PM", price: 127.40 }
      ],
      "1W": [
        { time: "Mon", price: 121.20 },
        { time: "Tue", price: 122.90 },
        { time: "Wed", price: 125.30 },
        { time: "Thu", price: 126.80 },
        { time: "Fri", price: 127.40 }
      ],
      "1M": [
        { time: "Wk 1", price: 112.50 },
        { time: "Wk 2", price: 118.90 },
        { time: "Wk 3", price: 122.40 },
        { time: "Wk 4", price: 127.40 }
      ],
      "1Y": [
        { time: "Q1", price: 46.50 },
        { time: "Q2", price: 78.20 },
        { time: "Q3", price: 101.40 },
        { time: "Q4", price: 127.40 }
      ]
    }
  },
  {
    symbol: "AAPL",
    name: "Apple Inc.",
    price: 185.24,
    change: -1.45,
    changePercent: -0.78,
    sector: "Consumer Electronics",
    marketCap: "2.89T",
    volume: "51,120,400",
    high: 187.60,
    low: 184.20,
    peRatio: 30.1,
    history: {
      "1D": [
        { time: "09:30 AM", price: 187.10 },
        { time: "10:30 AM", price: 186.20 },
        { time: "11:30 AM", price: 185.00 },
        { time: "12:30 PM", price: 185.80 },
        { time: "01:30 PM", price: 184.95 },
        { time: "02:30 PM", price: 184.40 },
        { time: "03:30 PM", price: 185.24 }
      ],
      "1W": [
        { time: "Mon", price: 189.40 },
        { time: "Tue", price: 188.10 },
        { time: "Wed", price: 186.50 },
        { time: "Thu", price: 184.80 },
        { time: "Fri", price: 185.24 }
      ],
      "1M": [
        { time: "Wk 1", price: 181.20 },
        { time: "Wk 2", price: 183.90 },
        { time: "Wk 3", price: 187.60 },
        { time: "Wk 4", price: 185.24 }
      ],
      "1Y": [
        { time: "Q1", price: 165.00 },
        { time: "Q2", price: 173.40 },
        { time: "Q3", price: 180.20 },
        { time: "Q4", price: 185.24 }
      ]
    }
  },
  {
    symbol: "TSLA",
    name: "Tesla Inc.",
    price: 179.80,
    change: -8.10,
    changePercent: -4.31,
    sector: "Automotive / Energy",
    marketCap: "568.10B",
    volume: "88,230,000",
    high: 188.50,
    low: 177.10,
    peRatio: 45.3,
    history: {
      "1D": [
        { time: "09:30 AM", price: 188.10 },
        { time: "10:30 AM", price: 185.40 },
        { time: "11:30 AM", price: 183.00 },
        { time: "12:30 PM", price: 180.25 },
        { time: "01:30 PM", price: 178.60 },
        { time: "02:30 PM", price: 177.30 },
        { time: "03:30 PM", price: 179.80 }
      ],
      "1W": [
        { time: "Mon", price: 195.40 },
        { time: "Tue", price: 192.10 },
        { time: "Wed", price: 188.00 },
        { time: "Thu", price: 183.50 },
        { time: "Fri", price: 179.80 }
      ],
      "1M": [
        { time: "Wk 1", price: 215.30 },
        { time: "Wk 2", price: 198.50 },
        { time: "Wk 3", price: 186.20 },
        { time: "Wk 4", price: 179.80 }
      ],
      "1Y": [
        { time: "Q1", price: 248.00 },
        { time: "Q2", price: 212.40 },
        { time: "Q3", price: 190.50 },
        { time: "Q4", price: 179.80 }
      ]
    }
  },
  {
    symbol: "MSFT",
    name: "Microsoft Corporation",
    price: 415.50,
    change: 1.25,
    changePercent: 0.30,
    sector: "Enterprise Software",
    marketCap: "3.08T",
    volume: "22,450,100",
    high: 418.00,
    low: 413.50,
    peRatio: 35.6,
    history: {
      "1D": [
        { time: "09:30 AM", price: 413.50 },
        { time: "10:30 AM", price: 414.20 },
        { time: "11:30 AM", price: 415.60 },
        { time: "12:30 PM", price: 416.80 },
        { time: "01:30 PM", price: 415.10 },
        { time: "02:30 PM", price: 414.80 },
        { time: "03:30 PM", price: 415.50 }
      ],
      "1W": [
        { time: "Mon", price: 410.20 },
        { time: "Tue", price: 412.90 },
        { time: "Wed", price: 414.00 },
        { time: "Thu", price: 416.10 },
        { time: "Fri", price: 415.50 }
      ],
      "1M": [
        { time: "Wk 1", price: 398.50 },
        { time: "Wk 2", price: 405.20 },
        { time: "Wk 3", price: 412.30 },
        { time: "Wk 4", price: 415.50 }
      ],
      "1Y": [
        { time: "Q1", price: 340.00 },
        { time: "Q2", price: 368.50 },
        { time: "Q3", price: 395.20 },
        { time: "Q4", price: 415.50 }
      ]
    }
  }
];

export const INITIAL_NEWS: NewsArticle[] = [
  {
    id: "news-1",
    title: "Snocks AI Launches Revolutionary Meme Engine Powered by Neuromorphic Chips",
    source: "Alpha Street Journal",
    summary: "Snocks CEO announced a breakthrough AI architecture that optimizes humor patterns and internet culture, sending SNOCK shares surging by over 13% today.",
    sentiment: "BULLISH",
    timestamp: "2 hours ago",
    symbol: "SNOCK"
  },
  {
    id: "news-2",
    title: "NVIDIA Chip Orders Increase 25% Amid Unprecedented Enterprise Demand Coinciding with Tech Rally",
    source: "Silicon Valley Chronicle",
    summary: "Hyperscalers continue to snap up NVDA's ultra-advanced Blackwell architectures, cementing its trillions-large market capitalization.",
    sentiment: "BULLISH",
    timestamp: "4 hours ago",
    symbol: "NVDA"
  },
  {
    id: "news-3",
    title: "Tesla Encounters Production Slowdown: Cybertruck Deliveries Temporarily Suspended",
    source: "EV Inside",
    summary: "Supplier delays for high-density batteries trigger short-term manufacturing friction, putting temporary negative pressure on the TSLA stock ticker.",
    sentiment: "BEARISH",
    timestamp: "6 hours ago",
    symbol: "TSLA"
  },
  {
    id: "news-4",
    title: "Apple Explores Multi-Million Dollar Smart Glasses Venture In Secret Lab Testing",
    source: "Mac rumors",
    summary: "Leak from Cupertino details advanced Augmented Reality specs leveraging next-generation neural engines, although some analysts remain skeptical.",
    sentiment: "NEUTRAL",
    timestamp: "8 hours ago",
    symbol: "AAPL"
  }
];
