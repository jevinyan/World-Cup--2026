/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useMemo } from 'react';
import { GroupStanding } from '../types';
import { Shield, Sparkles, CheckCircle, XCircle } from 'lucide-react';

interface StandingsTabProps {
  standings: Record<string, GroupStanding[]>;
}

// Rotate bright Memphis background colors for groups
const GROUP_COLORS: Record<string, { bg: string; border: string; accent: string }> = {
  A: { bg: 'bg-[#FFE227]', border: 'border-black', accent: 'bg-[#FF517A]' },
  B: { bg: 'bg-[#4D96FF]', border: 'border-black', accent: 'bg-[#FFE227]' },
  C: { bg: 'bg-[#6BCB77]', border: 'border-black', accent: 'bg-[#FF6B8B]' },
  D: { bg: 'bg-[#FF6B8B]', border: 'border-black', accent: 'bg-[#38BDF8]' },
  E: { bg: 'bg-[#FF9F29]', border: 'border-black', accent: 'bg-[#6BCB77]' },
  F: { bg: 'bg-[#B1AFFF]', border: 'border-black', accent: 'bg-[#FFDE4D]' },
  G: { bg: 'bg-[#38BDF8]', border: 'border-black', accent: 'bg-[#FB923C]' },
  H: { bg: 'bg-[#F472B6]', border: 'border-black', accent: 'bg-[#4ADE80]' },
  I: { bg: 'bg-[#4ADE80]', border: 'border-black', accent: 'bg-[#C084FC]' },
  J: { bg: 'bg-[#FB7185]', border: 'border-black', accent: 'bg-[#FFDE4D]' },
  K: { bg: 'bg-[#FBBF24]', border: 'border-black', accent: 'bg-[#38BDF8]' },
  L: { bg: 'bg-[#A78BFA]', border: 'border-black', accent: 'bg-[#6BCB77]' },
};

export default function StandingsTab({ standings }: StandingsTabProps) {
  const [filterRegion, setFilterRegion] = useState<'all' | 'A-D' | 'E-H' | 'I-L' | 'third-placed'>('all');

  // Dynamic calculation of the 12 third-placed teams to compare them
  const thirdPlacedStandings = useMemo(() => {
    const thirds: (GroupStanding & { group: string })[] = [];
    Object.entries(standings).forEach(([groupName, list]) => {
      if (list.length >= 3) {
        // Find the 3rd placed team
        const thirdTeam = list[2];
        if (thirdTeam) {
          thirds.push({ ...thirdTeam, group: groupName });
        }
      }
    });

    // Sort according to FIFA rules: Points, GD, Goals For, Played (desc)
    return thirds.sort((a, b) => {
      if (b.points !== a.points) return b.points - a.points;
      if (b.goalDifference !== a.goalDifference) return b.goalDifference - a.goalDifference;
      if (b.goalsFor !== a.goalsFor) return b.goalsFor - a.goalsFor;
      return a.teamName.localeCompare(b.teamName);
    });
  }, [standings]);

  // Filter groups according to tabs
  const groupKeys = useMemo(() => {
    const allKeys = Object.keys(standings).sort();
    if (filterRegion === 'all' || filterRegion === 'third-placed') return allKeys;
    if (filterRegion === 'A-D') return allKeys.filter((k) => ['A', 'B', 'C', 'D'].includes(k));
    if (filterRegion === 'E-H') return allKeys.filter((k) => ['E', 'F', 'G', 'H'].includes(k));
    if (filterRegion === 'I-L') return allKeys.filter((k) => ['I', 'J', 'K', 'L'].includes(k));
    return allKeys;
  }, [standings, filterRegion]);

  return (
    <div className="flex flex-col gap-6">
      {/* Filtering Selector */}
      <div className="flex flex-wrap gap-2.5 bg-[#F5F3ED] border-[3px] border-black p-2 rounded-xl shadow-[4px_4px_0px_0px_#000000]">
        <button
          onClick={() => setFilterRegion('all')}
          className={`px-4 py-2 font-bold text-xs sm:text-sm rounded-lg border-2 border-black transition-all ${
            filterRegion === 'all'
              ? 'bg-[#FFDE4D] text-black shadow-[2px_2px_0px_0px_#000000] -translate-y-0.5'
              : 'bg-white hover:bg-gray-100 text-black'
          }`}
        >
          全部小组 (A-L)
        </button>
        <button
          onClick={() => setFilterRegion('A-D')}
          className={`px-4 py-2 font-bold text-xs sm:text-sm rounded-lg border-2 border-black transition-all ${
            filterRegion === 'A-D'
              ? 'bg-[#4D96FF] text-black shadow-[2px_2px_0px_0px_#000000] -translate-y-0.5'
              : 'bg-white hover:bg-gray-100 text-black'
          }`}
        >
          A - D 组
        </button>
        <button
          onClick={() => setFilterRegion('E-H')}
          className={`px-4 py-2 font-bold text-xs sm:text-sm rounded-lg border-2 border-black transition-all ${
            filterRegion === 'E-H'
              ? 'bg-[#FF6B8B] text-black shadow-[2px_2px_0px_0px_#000000] -translate-y-0.5'
              : 'bg-white hover:bg-gray-100 text-black'
          }`}
        >
          E - H 组
        </button>
        <button
          onClick={() => setFilterRegion('I-L')}
          className={`px-4 py-2 font-bold text-xs sm:text-sm rounded-lg border-2 border-black transition-all ${
            filterRegion === 'I-L'
              ? 'bg-[#B1AFFF] text-black shadow-[2px_2px_0px_0px_#000000] -translate-y-0.5'
              : 'bg-white hover:bg-gray-100 text-black'
          }`}
        >
          I - L 组
        </button>
        <button
          onClick={() => setFilterRegion('third-placed')}
          className={`px-4 py-2 font-bold text-xs sm:text-sm rounded-lg border-2 border-black transition-all flex items-center gap-1.5 ${
            filterRegion === 'third-placed'
              ? 'bg-[#6BCB77] text-black shadow-[2px_2px_0px_0px_#000000] -translate-y-0.5'
              : 'bg-white hover:bg-gray-100 text-black'
          }`}
        >
          <Sparkles className="w-4 h-4 text-emerald-700" />
          <span>最佳小组第三 (12选8)</span>
        </button>
      </div>

      {filterRegion !== 'third-placed' ? (
        /* Groups Bento Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {groupKeys.map((groupName) => {
            const list = standings[groupName] || [];
            const config = GROUP_COLORS[groupName] || { bg: 'bg-white', border: 'border-black', accent: 'bg-gray-200' };

            return (
              <div
                key={groupName}
                className="bg-white border-[3px] border-black rounded-2xl shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] overflow-hidden transition-transform hover:-translate-y-0.5"
              >
                {/* Header card */}
                <div className={`${config.bg} p-4 border-b-[3px] border-black flex justify-between items-center`}>
                  <div className="flex items-center gap-2">
                    <span className="w-8 h-8 rounded-full bg-black text-white font-black flex items-center justify-center text-lg border-2 border-black font-mono">
                      {groupName}
                    </span>
                    <span className="text-black font-black text-lg">组 积分榜</span>
                  </div>
                  <span className={`${config.accent} text-black font-black text-xs px-2.5 py-1 rounded-md border-2 border-black uppercase tracking-wider`}>
                    1/16 阶段
                  </span>
                </div>

                {/* Table Content */}
                <div className="p-3 overflow-x-auto">
                  <table className="w-full text-left border-collapse font-mono text-xs sm:text-sm">
                    <thead>
                      <tr className="border-b-[2px] border-black text-gray-500 font-bold uppercase tracking-wider">
                        <th className="py-2 px-1 text-center w-8">#</th>
                        <th className="py-2 px-2">球队</th>
                        <th className="py-2 px-1 text-center">赛</th>
                        <th className="py-2 px-1 text-center">胜</th>
                        <th className="py-2 px-1 text-center">平</th>
                        <th className="py-2 px-1 text-center">负</th>
                        <th className="py-2 px-1 text-center hidden sm:table-cell">进/失</th>
                        <th className="py-2 px-1 text-center">净</th>
                        <th className="py-2 px-2 text-center bg-gray-50 font-black text-black">积分</th>
                      </tr>
                    </thead>
                    <tbody>
                      {list.map((standing, index) => {
                        const isTop2 = index < 2;
                        const is3rd = index === 2;
                        const isEliminated = index === 3;

                        let rowClass = 'hover:bg-gray-50';
                        if (isTop2) rowClass = 'bg-[#EBF7EE]/40 hover:bg-[#EBF7EE]/60';
                        if (is3rd) rowClass = 'bg-[#FFFBEB]/40 hover:bg-[#FFFBEB]/60';
                        if (isEliminated) rowClass = 'bg-[#FEF2F2]/40 hover:bg-[#FEF2F2]/60';

                        return (
                          <tr
                            key={standing.teamId}
                            className={`border-b border-black/10 last:border-0 font-medium ${rowClass}`}
                          >
                            {/* Rank */}
                            <td className="py-2.5 px-1 text-center">
                              <span
                                className={`w-5 h-5 rounded-full inline-flex items-center justify-center text-xs font-black border border-black ${
                                  isTop2
                                    ? 'bg-[#4ADE80] text-black shadow-[1px_1px_0px_rgba(0,0,0,1)]'
                                    : is3rd
                                    ? 'bg-[#FBBF24] text-black shadow-[1px_1px_0px_rgba(0,0,0,1)]'
                                    : 'bg-[#F87171] text-white shadow-[1px_1px_0px_rgba(0,0,0,1)]'
                                }`}
                              >
                                {index + 1}
                              </span>
                            </td>
                            {/* Team Flag & Name */}
                            <td className="py-2.5 px-2 font-sans font-bold flex items-center gap-1.5 whitespace-nowrap">
                              <span className="text-lg leading-none" role="img" aria-label={standing.teamName}>
                                {standing.flag}
                              </span>
                              <span className="text-black text-sm">{standing.teamName}</span>
                              <span className="text-[10px] text-gray-400 font-mono font-medium">
                                {standing.teamCode}
                              </span>
                            </td>
                            {/* Stats */}
                            <td className="py-2.5 px-1 text-center font-bold text-black">{standing.played}</td>
                            <td className="py-2.5 px-1 text-center text-green-600 font-bold">{standing.won}</td>
                            <td className="py-2.5 px-1 text-center text-gray-500 font-bold">{standing.drawn}</td>
                            <td className="py-2.5 px-1 text-center text-red-500 font-bold">{standing.lost}</td>
                            <td className="py-2.5 px-1 text-center text-gray-400 hidden sm:table-cell">
                              {standing.goalsFor}/{standing.goalsAgainst}
                            </td>
                            {/* Goal Diff */}
                            <td className="py-2.5 px-1 text-center font-bold">
                              {standing.goalDifference > 0 ? `+${standing.goalDifference}` : standing.goalDifference}
                            </td>
                            {/* Points */}
                            <td className="py-2.5 px-2 text-center bg-gray-50 font-black text-black text-sm">
                              {standing.points}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {/* Legend footer */}
                <div className="bg-gray-50 border-t border-black/10 px-4 py-2.5 flex justify-between text-[11px] font-sans font-bold text-gray-600">
                  <span className="flex items-center gap-1">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#4ADE80] border border-black inline-block"></span>
                    <span>1-2名: 直晋 Round 32</span>
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#FBBF24] border border-black inline-block"></span>
                    <span>3名: 争8个最佳名额</span>
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Best 3rd Placed Standings Comparison Table */
        <div className="bg-white border-[3px] border-black rounded-2xl shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] overflow-hidden">
          <div className="bg-[#6BCB77] p-5 border-b-[3px] border-black flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div className="flex items-center gap-2">
              <Shield className="w-6 h-6 text-black fill-emerald-100" />
              <div>
                <h3 className="text-black font-black text-xl leading-none">最佳小组第三名横向积分榜</h3>
                <p className="text-black/80 text-xs font-semibold mt-1">
                  12个小组第三名中成绩最好的前 8 支球队将晋级 32 强淘汰赛
                </p>
              </div>
            </div>
            <span className="bg-black text-[#6BCB77] font-mono font-black text-xs px-3 py-1 rounded-md border-2 border-black uppercase">
              12 选 8 争夺战
            </span>
          </div>

          <div className="p-4 overflow-x-auto">
            <table className="w-full text-left border-collapse font-mono text-xs sm:text-sm">
              <thead>
                <tr className="border-b-[2px] border-black text-gray-500 font-bold uppercase tracking-wider">
                  <th className="py-2 px-2 text-center w-12">排序</th>
                  <th className="py-2 px-2 text-center w-12">小组</th>
                  <th className="py-2 px-2">球队</th>
                  <th className="py-2 px-1 text-center">赛</th>
                  <th className="py-2 px-1 text-center">胜</th>
                  <th className="py-2 px-1 text-center">平</th>
                  <th className="py-2 px-1 text-center">负</th>
                  <th className="py-2 px-1 text-center">进/失</th>
                  <th className="py-2 px-1 text-center">净胜球</th>
                  <th className="py-2 px-2 text-center bg-gray-50 font-black text-black">积分</th>
                  <th className="py-2 px-3 text-center">当前状态</th>
                </tr>
              </thead>
              <tbody>
                {thirdPlacedStandings.map((standing, index) => {
                  const isQualified = index < 8; // top 8 qualify

                  return (
                    <tr
                      key={standing.teamId}
                      className={`border-b border-black/10 last:border-0 font-medium ${
                        isQualified ? 'bg-[#EBF7EE]/40 hover:bg-[#EBF7EE]/60' : 'bg-[#FEF2F2]/40 hover:bg-[#FEF2F2]/60'
                      }`}
                    >
                      {/* Rank Index */}
                      <td className="py-3 px-2 text-center">
                        <span
                          className={`w-6 h-6 rounded-full inline-flex items-center justify-center text-xs font-black border border-black ${
                            isQualified ? 'bg-[#4ADE80] text-black' : 'bg-[#F87171] text-white'
                          }`}
                        >
                          {index + 1}
                        </span>
                      </td>
                      {/* Group tag */}
                      <td className="py-3 px-2 text-center font-bold">
                        <span className="bg-black text-white px-2 py-0.5 rounded text-[11px] font-mono border border-black">
                          {standing.group}组
                        </span>
                      </td>
                      {/* Team details */}
                      <td className="py-3 px-2 font-sans font-bold flex items-center gap-1.5 whitespace-nowrap">
                        <span className="text-lg leading-none" role="img" aria-label={standing.teamName}>
                          {standing.flag}
                        </span>
                        <span className="text-black text-sm">{standing.teamName}</span>
                        <span className="text-[10px] text-gray-400 font-mono font-medium">{standing.teamCode}</span>
                      </td>
                      {/* Stats */}
                      <td className="py-3 px-1 text-center font-bold text-black">{standing.played}</td>
                      <td className="py-3 px-1 text-center text-green-600 font-bold">{standing.won}</td>
                      <td className="py-3 px-1 text-center text-gray-500 font-bold">{standing.drawn}</td>
                      <td className="py-3 px-1 text-center text-red-500 font-bold">{standing.lost}</td>
                      <td className="py-3 px-1 text-center text-gray-400">
                        {standing.goalsFor}/{standing.goalsAgainst}
                      </td>
                      {/* Goal diff */}
                      <td className="py-3 px-1 text-center font-black">
                        {standing.goalDifference > 0 ? `+${standing.goalDifference}` : standing.goalDifference}
                      </td>
                      {/* Points */}
                      <td className="py-3 px-2 text-center bg-gray-50 font-black text-black text-sm">
                        {standing.points}
                      </td>
                      {/* Status Tag */}
                      <td className="py-3 px-3 text-center">
                        {isQualified ? (
                          <span className="bg-[#4ADE80] text-black text-[11px] font-bold px-2.5 py-1 rounded-full border border-black shadow-[1px_1px_0px_rgba(0,0,0,1)] inline-flex items-center gap-1">
                            <CheckCircle className="w-3 h-3 text-black fill-black" />
                            <span>晋级 32强</span>
                          </span>
                        ) : (
                          <span className="bg-[#F87171] text-white text-[11px] font-bold px-2.5 py-1 rounded-full border border-black shadow-[1px_1px_0px_rgba(0,0,0,1)] inline-flex items-center gap-1">
                            <XCircle className="w-3 h-3 text-white fill-white" />
                            <span>淘汰边缘</span>
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
