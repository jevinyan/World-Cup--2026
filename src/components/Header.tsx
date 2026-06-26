import { useState, useEffect } from 'react';
import { RefreshCw, Radio, Server, Calendar, Trophy, AlertCircle, Sparkles } from 'lucide-react';

interface HeaderProps {
  liveMatchesCount: number;
  completedMatchesCount: number;
  simulationEvent?: string;
  onScrape: () => void;
  isScraping: boolean;
  scrapeStatus: string;
}

export default function Header({
  liveMatchesCount,
  completedMatchesCount,
  simulationEvent,
  onScrape,
  isScraping,
  scrapeStatus,
}: HeaderProps) {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date) => {
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    const hh = String(date.getHours()).padStart(2, '0');
    const min = String(date.getMinutes()).padStart(2, '0');
    const ss = String(date.getSeconds()).padStart(2, '0');
    return `${yyyy}年${mm}月${dd}日 ${hh}:${min}:${ss}`;
  };

  return (
    <header className="w-full flex flex-col gap-4 mb-6">
      {/* Top Banner: Memphis style title and controls */}
      <div className="w-full bg-[#FFE227] border-[4px] border-black rounded-2xl p-6 shadow-[6px_6px_0px_0px_#000000] flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 transition-transform hover:-translate-y-0.5">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
          <img 
            src="/logo.png" 
            referrerPolicy="no-referrer" 
            className="w-16 h-16 md:w-20 md:h-20 object-contain rounded-2xl border-[3px] border-black bg-white p-1.5 shadow-[4px_4px_0px_0px_#000000] select-none" 
            alt="YIYELINK Logo" 
          />
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <span className="bg-black text-[#FFE227] text-xs font-bold font-mono px-2.5 py-1 rounded-md border-2 border-black uppercase tracking-wider animate-bounce">
                LIVE 2026
              </span>
              <div className="flex items-center gap-1.5 text-black font-semibold text-xs">
                <Calendar className="w-3.5 h-3.5" />
                <span>世界杯进行中 · {formatTime(currentTime)}</span>
              </div>
            </div>
            <h1 id="app-title" className="text-2xl md:text-3xl font-extrabold tracking-tight text-black font-sans leading-none mt-2">
              2026 美加墨世界杯<br className="sm:hidden" />数据可视化系统
            </h1>
            <p className="text-black/80 text-sm font-medium mt-0.5">
              48国超级扩军 · 12个小组纵览 · 1/16决赛终极对抗
            </p>
          </div>
        </div>

        {/* Control and Indicator Panel */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full lg:w-auto mt-2 lg:mt-0">
          {isScraping && (
            <div className="flex items-center justify-center gap-2 bg-[#6BCB77] text-black font-black px-4 py-3 rounded-xl border-[3px] border-black text-sm tracking-wide shadow-[4px_4px_0px_0px_#000000] select-none animate-pulse">
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span>数据自动同步爬取中...</span>
            </div>
          )}

          <div className="flex items-center justify-center gap-2.5 bg-black text-[#FFE227] font-black px-4 py-3 rounded-xl border-[3px] border-black shadow-[4px_4px_0px_0px_#000000] select-none text-sm tracking-wide">
            <span>创作者：jevinyan(豆哥）</span>
          </div>
        </div>
      </div>

      {/* Triple Insurance Data Engine Badges */}
      <div className="bg-white border-[3px] border-black rounded-xl p-3 shadow-[4px_4px_0px_0px_#000000] flex flex-wrap items-center justify-between gap-3 text-xs font-bold text-black select-none">
        <div className="flex items-center gap-1.5 font-sans">
          <Sparkles className="w-4 h-4 text-[#FF9F29] animate-spin-slow" />
          <span>怡烨智联 · 三重实时数据保障系统</span>
        </div>
        <div className="flex flex-wrap items-center gap-2 font-mono">
          <span className="flex items-center gap-1 bg-[#E8F9FD] text-[#0aa1dd] border-2 border-[#0aa1dd] px-2 py-0.5 rounded-md text-[10px]">
            <span className="h-2 w-2 rounded-full bg-[#0aa1dd] animate-pulse"></span>
            Zafronix FIFA API: ACTIVE
          </span>
          <span className="flex items-center gap-1 bg-[#EEF2E6] text-[#3D8361] border-2 border-[#3D8361] px-2 py-0.5 rounded-md text-[10px]">
            <span className="h-2 w-2 rounded-full bg-[#3D8361] animate-pulse"></span>
            ESPN Scoreboard: ACTIVE
          </span>
          <span className="flex items-center gap-1 bg-[#F9F5EB] text-[#A77979] border-2 border-[#A77979] px-2 py-0.5 rounded-md text-[10px]">
            <span className="h-2 w-2 rounded-full bg-[#A77979] animate-pulse"></span>
            Gemini Search Scraper: ONLINE
          </span>
        </div>
      </div>

      {/* Quick stats grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-[#4D96FF] border-[3px] border-black rounded-xl p-3 shadow-[4px_4px_0px_0px_#000000] text-black">
          <div className="text-xs font-bold font-mono opacity-80 uppercase">小组组别</div>
          <div className="text-2xl font-black font-mono">12 个小组</div>
          <div className="text-xs font-semibold mt-0.5">A组 至 L组 共48队</div>
        </div>

        <div className="bg-[#6BCB77] border-[3px] border-black rounded-xl p-3 shadow-[4px_4px_0px_0px_#000000] text-black">
          <div className="text-xs font-bold font-mono opacity-80 uppercase">已完赛场次</div>
          <div className="text-2xl font-black font-mono">{completedMatchesCount} 场</div>
          <div className="text-xs font-semibold mt-0.5">小组赛接近尾声</div>
        </div>

        <div className="bg-[#FF9F29] border-[3px] border-black rounded-xl p-3 shadow-[4px_4px_0px_0px_#000000] text-black relative overflow-hidden">
          <div className="text-xs font-bold font-mono opacity-80 uppercase">今日LIVE比赛</div>
          <div className="text-2xl font-black font-mono flex items-center gap-2">
            {liveMatchesCount} 场
            {liveMatchesCount > 0 && (
              <span className="flex h-2.5 w-2.5 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-600 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-600"></span>
              </span>
            )}
          </div>
          <div className="text-xs font-semibold mt-0.5">
            {liveMatchesCount > 0 ? '末轮激战正酣！' : '今日比赛已结束'}
          </div>
        </div>

        <div className="bg-[#B1AFFF] border-[3px] border-black rounded-xl p-3 shadow-[4px_4px_0px_0px_#000000] text-black">
          <div className="text-xs font-bold font-mono opacity-80 uppercase">晋级32强名额</div>
          <div className="text-2xl font-black font-mono flex items-center gap-1">
            <Trophy className="w-5 h-5 text-yellow-300 fill-yellow-300 inline" />
            <span>20 / 32</span>
          </div>
          <div className="text-xs font-semibold mt-0.5">12组第一、二名 + 8个最佳第三名</div>
        </div>
      </div>

      {/* Break Events Live ticker bar */}
      {simulationEvent && (
        <div className="bg-[#FF8A08] text-white border-[3px] border-black rounded-xl p-3 shadow-[3px_3px_0px_0px_#000000] flex items-center gap-3 animate-pulse">
          <AlertCircle className="w-5 h-5 shrink-0 animate-bounce text-yellow-300" />
          <p className="font-extrabold text-sm sm:text-base tracking-wide line-clamp-1">
            【实时速递】{simulationEvent}
          </p>
        </div>
      )}
    </header>
  );
}
