/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

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
  return (
    <header className="w-full flex flex-col gap-4 mb-6">
      {/* Top Banner: Memphis style title and controls */}
      <div className="w-full bg-[#FFE227] border-[4px] border-black rounded-2xl p-6 shadow-[6px_6px_0px_0px_#000000] flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 transition-transform hover:-translate-y-0.5">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <span className="bg-black text-[#FFE227] text-xs font-bold font-mono px-2.5 py-1 rounded-md border-2 border-black uppercase tracking-wider animate-bounce">
              LIVE 2026
            </span>
            <div className="flex items-center gap-1.5 text-black font-semibold text-xs">
              <Calendar className="w-3.5 h-3.5" />
              <span>世界杯进行中 · 2026年6月25日</span>
            </div>
          </div>
          <h1 id="app-title" className="text-3xl md:text-4xl font-extrabold tracking-tight text-black font-sans leading-none mt-2">
            2026 美加墨世界杯<br className="sm:hidden" />数据可视化系统
          </h1>
          <p className="text-black/80 text-sm font-medium mt-1">
            48国超级扩军 · 12个小组纵览 · 1/16决赛终极对抗
          </p>
        </div>

        {/* Control and Indicator Panel */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full lg:w-auto mt-2 lg:mt-0">
          <div className="flex items-center justify-center gap-2.5 bg-black text-[#FFE227] font-black px-5 py-3.5 rounded-xl border-[3px] border-black shadow-[4px_4px_0px_0px_#000000] select-none text-sm tracking-wide">
            <span>创作者：jevinyan(豆哥）</span>
          </div>
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
