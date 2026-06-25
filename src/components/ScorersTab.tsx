/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { PlayerScorer } from '../types';
import { Crown, Sparkles, Footprints, Target, ShieldCheck } from 'lucide-react';

interface ScorersTabProps {
  scorers: PlayerScorer[];
}

export default function ScorersTab({ scorers }: ScorersTabProps) {
  // Take top 3 for special cards
  const topScorers = scorers.slice(0, 3);
  const remainingScorers = scorers.slice(3, 12);

  // Maximum goals in list to scale bars
  const maxGoals = scorers[0]?.goals || 5;

  return (
    <div className="flex flex-col gap-6">
      {/* Top 3 Podium bento-grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* 1st Place */}
        {topScorers[0] && (
          <div className="bg-[#FFE227] border-[4px] border-black rounded-2xl p-5 shadow-[6px_6px_0px_0px_#000000] relative flex flex-col justify-between overflow-hidden md:order-2 md:translate-y-[-10px]">
            {/* Crown tag */}
            <div className="absolute top-3 right-3 bg-black text-[#FFE227] border-2 border-black rounded-full p-1.5 shadow-[2px_2px_0px_0px_#FFE227] animate-bounce">
              <Crown className="w-5 h-5 fill-[#FFE227]" />
            </div>

            <div>
              <span className="bg-black text-white font-mono font-black text-xs px-2.5 py-1 rounded-md border-2 border-black tracking-widest uppercase">
                金靴奖第一名
              </span>
              <h3 className="text-black font-black text-2xl sm:text-3xl font-sans mt-3.5 leading-tight">
                {topScorers[0].name}
              </h3>
              <p className="text-black/80 font-bold text-sm flex items-center gap-1.5 mt-1 font-sans">
                <span className="text-xl leading-none">{topScorers[0].flag}</span>
                <span>{topScorers[0].teamName} ({topScorers[0].teamId})</span>
              </p>
            </div>

            <div className="mt-6 flex items-end justify-between border-t-2 border-black/20 pt-4">
              <div className="flex flex-col">
                <span className="text-black font-black text-5xl font-mono leading-none">
                  {topScorers[0].goals}
                </span>
                <span className="text-black font-extrabold text-xs uppercase tracking-wide mt-1">
                  总进球 Goals
                </span>
              </div>

              <div className="text-right text-xs font-bold text-black flex flex-col gap-0.5 font-mono">
                <div>助攻 Assists: <span className="font-black">{topScorers[0].assists}</span></div>
                <div>点球 Penalties: <span className="font-black">{topScorers[0].penalties}</span></div>
                <div>出场 Matches: <span className="font-black">{topScorers[0].matchesPlayed}</span></div>
              </div>
            </div>
          </div>
        )}

        {/* 2nd Place */}
        {topScorers[1] && (
          <div className="bg-[#FF6B8B] border-[3px] border-black rounded-2xl p-5 shadow-[5px_5px_0px_0px_#000000] relative flex flex-col justify-between md:order-1">
            <div className="absolute top-3 right-3 bg-white text-black border-2 border-black rounded-full p-1.5 shadow-[2px_2px_0px_0px_#000000]">
              <Sparkles className="w-4 h-4 text-pink-600 fill-pink-100" />
            </div>

            <div>
              <span className="bg-white text-black font-mono font-black text-xs px-2 py-0.5 rounded-md border-2 border-black tracking-widest uppercase">
                射手榜第二名
              </span>
              <h3 className="text-white font-black text-xl sm:text-2xl font-sans mt-3.5 leading-tight">
                {topScorers[1].name}
              </h3>
              <p className="text-white/90 font-bold text-sm flex items-center gap-1.5 mt-1 font-sans">
                <span className="text-xl leading-none">{topScorers[1].flag}</span>
                <span>{topScorers[1].teamName} ({topScorers[1].teamId})</span>
              </p>
            </div>

            <div className="mt-6 flex items-end justify-between border-t-2 border-white/20 pt-4">
              <div className="flex flex-col">
                <span className="text-white font-black text-4xl font-mono leading-none">
                  {topScorers[1].goals}
                </span>
                <span className="text-white font-extrabold text-xs uppercase tracking-wide mt-1">
                  总进球 Goals
                </span>
              </div>

              <div className="text-right text-xs font-bold text-white flex flex-col gap-0.5 font-mono">
                <div>助攻 Assists: <span className="font-black">{topScorers[1].assists}</span></div>
                <div>点球 Penalties: <span className="font-black">{topScorers[1].penalties}</span></div>
                <div>出场 Matches: <span className="font-black">{topScorers[1].matchesPlayed}</span></div>
              </div>
            </div>
          </div>
        )}

        {/* 3rd Place */}
        {topScorers[2] && (
          <div className="bg-[#38BDF8] border-[3px] border-black rounded-2xl p-5 shadow-[5px_5px_0px_0px_#000000] relative flex flex-col justify-between md:order-3">
            <div className="absolute top-3 right-3 bg-white text-black border-2 border-black rounded-full p-1.5 shadow-[2px_2px_0px_0px_#000000]">
              <Target className="w-4 h-4 text-sky-600" />
            </div>

            <div>
              <span className="bg-white text-black font-mono font-black text-xs px-2 py-0.5 rounded-md border-2 border-black tracking-widest uppercase">
                射手榜第三名
              </span>
              <h3 className="text-black font-black text-xl sm:text-2xl font-sans mt-3.5 leading-tight">
                {topScorers[2].name}
              </h3>
              <p className="text-black/80 font-bold text-sm flex items-center gap-1.5 mt-1 font-sans">
                <span className="text-xl leading-none">{topScorers[2].flag}</span>
                <span>{topScorers[2].teamName} ({topScorers[2].teamId})</span>
              </p>
            </div>

            <div className="mt-6 flex items-end justify-between border-t-2 border-black/20 pt-4">
              <div className="flex flex-col">
                <span className="text-black font-black text-4xl font-mono leading-none">
                  {topScorers[2].goals}
                </span>
                <span className="text-black font-extrabold text-xs uppercase tracking-wide mt-1">
                  总进球 Goals
                </span>
              </div>

              <div className="text-right text-xs font-bold text-black flex flex-col gap-0.5 font-mono">
                <div>助攻 Assists: <span className="font-black">{topScorers[2].assists}</span></div>
                <div>点球 Penalties: <span className="font-black">{topScorers[2].penalties}</span></div>
                <div>出场 Matches: <span className="font-black">{topScorers[2].matchesPlayed}</span></div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Scorers List Grid */}
      <div className="bg-white border-[3px] border-black rounded-2xl shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] overflow-hidden">
        <div className="bg-black p-4 text-white flex justify-between items-center">
          <span className="font-extrabold text-sm sm:text-base flex items-center gap-1.5">
            <Footprints className="w-5 h-5 text-[#FFE227]" />
            <span>射手榜次席及候选名单 (4 - 12名)</span>
          </span>
          <span className="text-xs font-mono bg-white text-black font-black border-2 border-white rounded px-2 py-0.5">
            G - 进球数排名
          </span>
        </div>

        <div className="p-4 flex flex-col gap-3">
          {remainingScorers.length === 0 ? (
            <p className="text-gray-400 text-center py-4 text-xs italic">没有更多射手数据。</p>
          ) : (
            remainingScorers.map((scorer, index) => {
              // Percentage width of progress bar
              const percent = (scorer.goals / maxGoals) * 100;

              return (
                <div
                  key={scorer.id}
                  className="bg-white border-2 border-black rounded-xl p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-[2px_2px_0px_0px_#000000] hover:-translate-y-0.5 transition-transform"
                >
                  {/* Left part: rank, player name, flag */}
                  <div className="flex items-center gap-3 sm:w-5/12">
                    <span className="w-7 h-7 font-mono font-black text-sm bg-gray-100 border-2 border-black rounded-lg flex items-center justify-center text-black shrink-0">
                      {index + 4}
                    </span>
                    <div className="flex flex-col">
                      <span className="text-black font-extrabold text-base leading-tight font-sans">
                        {scorer.name}
                      </span>
                      <div className="flex items-center gap-1.5 text-xs text-gray-500 font-sans mt-0.5">
                        <span>{scorer.flag}</span>
                        <span>{scorer.teamName}</span>
                        <span className="font-mono bg-gray-100 px-1.5 py-0.5 border border-black/5 rounded text-[10px]">
                          {scorer.teamId}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Mid part: Goals Visual Block Bar */}
                  <div className="flex flex-col gap-1 sm:w-4/12">
                    <div className="flex justify-between items-center text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                      <span>进球柱状图</span>
                      <span className="font-mono text-black font-extrabold">
                        {scorer.goals} 个进球 / {scorer.assists} 助攻
                      </span>
                    </div>
                    <div className="w-full h-3 bg-gray-100 border border-black rounded-md overflow-hidden relative">
                      <div
                        style={{ width: `${percent}%` }}
                        className="bg-[#FFE227] h-full border-r border-black flex"
                      >
                        {/* Render goal vertical dividers to make it look like separate block sections */}
                        {Array.from({ length: scorer.goals }).map((_, i) => (
                          <div key={i} className="flex-1 border-r border-black/10 last:border-0 h-full"></div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Right part: detailed numerical stats */}
                  <div className="flex items-center justify-between sm:justify-end gap-6 sm:w-3/12 font-mono text-xs font-bold border-t border-black/5 sm:border-t-0 pt-2.5 sm:pt-0">
                    <div className="flex flex-col items-center">
                      <span className="text-black font-black text-sm">{scorer.assists}</span>
                      <span className="text-gray-400 text-[10px] uppercase font-sans">助攻</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <span className="text-black font-black text-sm">{scorer.penalties}</span>
                      <span className="text-gray-400 text-[10px] uppercase font-sans">点球</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <span className="text-black font-black text-sm">{scorer.matchesPlayed}</span>
                      <span className="text-gray-400 text-[10px] uppercase font-sans">出场</span>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
