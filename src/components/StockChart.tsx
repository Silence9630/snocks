import React, { useState, useRef, useEffect } from "react";
import { HistoricDataPoint } from "../types";

interface StockChartProps {
  data: HistoricDataPoint[];
  color: string; // 'green' or 'red'
  symbol: string;
}

export default function StockChart({ data, color, symbol }: StockChartProps) {
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const [containerWidth, setContainerWidth] = useState(500);
  const containerRef = useRef<HTMLDivElement>(null);

  // Responsive resizing fallback
  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new ResizeObserver((entries) => {
      for (let entry of entries) {
        setContainerWidth(entry.contentRect.width);
      }
    });
    observer.observe(containerRef.current);
    setContainerWidth(containerRef.current.getBoundingClientRect().width);
    return () => observer.disconnect();
  }, []);

  if (!data || data.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-zinc-500 font-mono text-sm">
        No chart data available
      </div>
    );
  }

  const prices = data.map((d) => d.price);
  const maxPrice = Math.max(...prices) * 1.02; // Add 2% padding
  const minPrice = Math.max(0, Math.min(...prices) * 0.98); // Add 2% padding
  const priceRange = maxPrice - minPrice || 1;

  const height = 240;
  const paddingLeft = 10;
  const paddingRight = 10;
  const paddingTop = 15;
  const paddingBottom = 20;

  const chartWidth = containerWidth;
  const chartHeight = height;

  // Generate SVG Points
  const points = data.map((d, index) => {
    const x = paddingLeft + (index / (data.length - 1)) * (chartWidth - paddingLeft - paddingRight);
    // Invert Y coordinate because SVG matches 0,0 to top-left
    const y = chartHeight - paddingBottom - ((d.price - minPrice) / priceRange) * (chartHeight - paddingTop - paddingBottom);
    return { x, y, ...d, originalIndex: index };
  });

  const pathD = points.length > 0 
    ? `M ${points[0].x} ${points[0].y} ` + points.slice(1).map((p) => `L ${p.x} ${p.y}`).join(" ")
    : "";

  const areaD = points.length > 0 
    ? `${pathD} L ${points[points.length - 1].x} ${chartHeight - paddingBottom} L ${points[0].x} ${chartHeight - paddingBottom} Z`
    : "";

  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!containerRef.current) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;

    // Find closest index based on X coordinate
    let closestIndex = 0;
    let minDistance = Infinity;

    points.forEach((p, idx) => {
      const dist = Math.abs(p.x - mouseX);
      if (dist < minDistance) {
        minDistance = dist;
        closestIndex = idx;
      }
    });

    setHoverIndex(closestIndex);
  };

  const handleMouseLeave = () => {
    setHoverIndex(null);
  };

  const isGreen = color === "green";
  const strokeColor = isGreen ? "#22c55e" : "#ef4444"; // emerald-500 or red-500
  const fillColorId = `grad-${symbol}-${isGreen ? "green" : "red"}`;

  const hoveredPoint = hoverIndex !== null ? points[hoverIndex] : null;

  // Format tick price nicely
  const formatPrice = (p: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    }).format(p);
  };

  return (
    <div id="snocks-stock-chart" ref={containerRef} className="relative w-full bg-white rounded-none border-2 border-black p-4 select-none text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
      {/* Dynamic Header on Hover */}
      <div className="flex justify-between items-start mb-2">
        <div>
          <span className="text-xs font-mono text-zinc-600 uppercase tracking-widest block font-black">
            {hoveredPoint ? `Ticked @ ${hoveredPoint.time}` : "Interactive Timeline"}
          </span>
          <span className="text-3xl font-black tracking-tighter font-sans text-black block transition-all uppercase">
            {hoveredPoint ? formatPrice(hoveredPoint.price) : formatPrice(prices[prices.length - 1])}
          </span>
        </div>
        
        {hoveredPoint && (
          <div className="text-right text-xs font-mono font-black">
            <span className="text-zinc-650 block uppercase">Variance</span>
            <span className={`font-black block px-1.5 py-0.5 border border-black mt-1 ${hoveredPoint.price >= prices[0] ? "bg-[#00FF00] text-black" : "bg-rose-100 text-rose-800"}`}>
              {hoveredPoint.price >= prices[0] ? "+" : ""}
              {(((hoveredPoint.price - prices[0]) / prices[0]) * 100).toFixed(2)}%
            </span>
          </div>
        )}
      </div>

      {/* SVG Canvas */}
      <svg
        className="w-full h-[240px] cursor-crosshair overflow-visible touch-none bg-[#FDFDFD] border border-black"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        <defs>
          <linearGradient id={fillColorId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={strokeColor} stopOpacity={0.15} />
            <stop offset="100%" stopColor={strokeColor} stopOpacity={0.0} />
          </linearGradient>
        </defs>

        {/* Horizontal background gridlines */}
        {[0, 0.25, 0.5, 0.75, 1].map((ratio, idx) => {
          const y = paddingTop + ratio * (chartHeight - paddingTop - paddingBottom);
          const value = maxPrice - ratio * priceRange;
          return (
            <g key={idx} className="opacity-70">
              <line
                x1={paddingLeft}
                y1={y}
                x2={chartWidth - paddingRight}
                y2={y}
                stroke="#ccc"
                strokeWidth={1}
                strokeDasharray="2 2"
              />
              <text
                x={chartWidth - paddingRight - 8}
                y={y - 4}
                fill="#333"
                fontSize="9"
                fontFamily="Courier, monospace"
                fontWeight="bold"
                textAnchor="end"
              >
                {formatPrice(value)}
              </text>
            </g>
          );
        })}

        {/* Dynamic Gradient Area Fill */}
        {areaD && (
          <path
            d={areaD}
            fill={`url(#${fillColorId})`}
            className="transition-all duration-300"
          />
        )}

        {/* The Colored Trend Polyline */}
        {pathD && (
          <path
            d={pathD}
            fill="none"
            stroke="#000000"
            strokeWidth={3}
            strokeLinecap="round"
            strokeLinejoin="round"
            className="transition-all duration-300"
          />
        )}

        {/* Hover Crosshair guides */}
        {hoveredPoint && (
          <g>
            {/* Vertical slider line */}
            <line
              x1={hoveredPoint.x}
              y1={paddingTop}
              x2={hoveredPoint.x}
              y2={chartHeight - paddingBottom}
              stroke="#000"
              strokeWidth={1.5}
              strokeDasharray="3 3"
            />
            {/* Horizontal price guide */}
            <line
              x1={paddingLeft}
              y1={hoveredPoint.y}
              x2={chartWidth - paddingRight}
              y2={hoveredPoint.y}
              stroke="#000"
              strokeWidth={1}
              strokeDasharray="3 3"
            />
            {/* Tracking circle node */}
            <circle
              cx={hoveredPoint.x}
              cy={hoveredPoint.y}
              r={6}
              fill="#000"
              stroke={strokeColor}
              strokeWidth={3}
            />
            <circle
              cx={hoveredPoint.x}
              cy={hoveredPoint.y}
              r={12}
              fill={strokeColor}
              fillOpacity={0.25}
              className="animate-ping"
            />
          </g>
        )}
      </svg>

      {/* X Axis labels */}
      <div className="flex justify-between text-[10px] font-mono font-bold text-black mt-2 px-2 uppercase">
        <span>Start: {data[0]?.time}</span>
        <span>Midpoint: {data[Math.floor(data.length / 2)]?.time}</span>
        <span>Latest: {data[data.length - 1]?.time}</span>
      </div>
    </div>
  );
}
