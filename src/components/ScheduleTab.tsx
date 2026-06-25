/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useMemo } from 'react';
import { Match, Team } from '../types';
import { Play, Check, Clock, MapPin, ChevronDown, ChevronUp, Star, Award, Zap } from 'lucide-react';

interface ScheduleTabProps {
  matches: Match[];
  teams: Record<string, Team>;
}

export default function ScheduleTab({ matches, teams }: ScheduleTabProps) {
  const [selectedStatus, setSelectedStatus] = useState<'all' | 'Live' | 'Completed' | 'Scheduled'>('all');
  const [selectedGroup, setSelectedGroup] = useState<string>('all');
  const [expandedMatchId, setExpandedMatchId] = useState<string | null>(null);

  // Group filter list
  const groupFilters = useMemo(() => {
    return ['all', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L'];
  }, []);

  // Filtered Matches list
  const filteredMatches = useMemo(() => {
    return matches.filter((match) => {
      const matchStatusMatch = selectedStatus === 'all' || match.status === selectedStatus;
      const matchGroupMatch = selectedGroup === 'all' || match.group === selectedGroup;
      return matchStatusMatch && matchGroupMatch;
    }).sort((a, b) => {
      // Live matches first, then Completed/Scheduled sorted by date desc, then time
      if (a.status === 'Live' && b.status !== 'Live') return -1;
      if (a.status !== 'Live' && b.status === 'Live') return 1;
      return b.date.localeCompare(a.date) || a.time.localeCompare(b.time);
    });
  }, [matches, selectedStatus, selectedGroup]);

  const toggleExpandMatch = (id: string) => {
    if (expandedMatchId === id) {
      setExpandedMatchId(null);
    } else {
      setExpandedMatchId(id);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Filtering Filters */}
      <div className="flex flex-col gap-4 bg-[#F5F3ED] border-[3px] border-black p-4 rounded-xl shadow-[4px_4px_0px_0px_#000000]">
        {/* Status filters */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-black font-extrabold text-sm mr-2 whitespace-nowrap">比赛状态:</span>
          <button
            onClick={() => setSelectedStatus('all')}
            className={`px-3 py-1.5 font-bold text-xs sm:text-sm rounded-lg border-2 border-black transition-all ${
              selectedStatus === 'all'
                ? 'bg-black text-[#FFE227]'
                : 'bg-white text-black hover:bg-gray-100'
            }`}
          >
            全部比赛 ({matches.length})
          </button>
          <button
            onClick={() => setSelectedStatus('Live')}
            className={`px-3 py-1.5 font-bold text-xs sm:text-sm rounded-lg border-2 border-black transition-all flex items-center gap-1.5 ${
              selectedStatus === 'Live'
                ? 'bg-red-500 text-white shadow-[2px_2px_0px_0px_#000000]'
                : 'bg-white text-black hover:bg-gray-100'
            }`}
          >
            <span className="h-2 w-2 rounded-full bg-red-600 animate-ping inline-block"></span>
            <span>进行中 ({matches.filter((m) => m.status === 'Live').length})</span>
          </button>
          <button
            onClick={() => setSelectedStatus('Completed')}
            className={`px-3 py-1.5 font-bold text-xs sm:text-sm rounded-lg border-2 border-black transition-all ${
              selectedStatus === 'Completed'
                ? 'bg-[#6BCB77] text-black shadow-[2px_2px_0px_0px_#000000]'
                : 'bg-white text-black hover:bg-gray-100'
            }`}
          >
            已完赛 ({matches.filter((m) => m.status === 'Completed').length})
          </button>
          <button
            onClick={() => setSelectedStatus('Scheduled')}
            className={`px-3 py-1.5 font-bold text-xs sm:text-sm rounded-lg border-2 border-black transition-all ${
              selectedStatus === 'Scheduled'
                ? 'bg-[#B1AFFF] text-black shadow-[2px_2px_0px_0px_#000000]'
                : 'bg-white text-black hover:bg-gray-100'
            }`}
          >
            未开赛 ({matches.filter((m) => m.status === 'Scheduled').length})
          </button>
        </div>

        {/* Group filters */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-black font-extrabold text-sm mr-2 whitespace-nowrap font-sans">筛选小组:</span>
          {groupFilters.map((grp) => (
            <button
              key={grp}
              onClick={() => setSelectedGroup(grp)}
              className={`w-10 h-8 font-mono font-black text-xs sm:text-sm rounded-lg border-2 border-black transition-all flex items-center justify-center ${
                selectedGroup === grp
                  ? 'bg-[#FF9F29] text-black shadow-[2px_2px_0px_0px_#000000] -translate-y-0.5'
                  : 'bg-white text-black hover:bg-gray-100'
              }`}
            >
              {grp === 'all' ? '全' : grp}
            </button>
          ))}
        </div>
      </div>

      {/* Matches List */}
      <div className="flex flex-col gap-4">
        {filteredMatches.length === 0 ? (
          <div className="bg-white border-[3px] border-black rounded-2xl p-8 text-center shadow-[4px_4px_0px_0px_#000000]">
            <Zap className="w-10 h-10 text-gray-400 mx-auto mb-2 animate-bounce" />
            <p className="text-gray-600 font-extrabold">没有符合当前筛选条件的比赛</p>
            <p className="text-gray-400 text-xs mt-1">请尝试切换其他状态或小组别</p>
          </div>
        ) : (
          filteredMatches.map((match) => {
            const home = teams[match.homeTeamId] || { name: match.homeTeamId, flag: '⚽️', code: 'HM' };
            const away = teams[match.awayTeamId] || { name: match.awayTeamId, flag: '⚽️', code: 'AW' };
            const isExpanded = expandedMatchId === match.id;

            // Highlight color based on status
            let statusBadgeColor = 'bg-gray-200 text-black';
            if (match.status === 'Live') statusBadgeColor = 'bg-red-500 text-white animate-pulse';
            if (match.status === 'Completed') statusBadgeColor = 'bg-black text-white';
            if (match.status === 'Scheduled') statusBadgeColor = 'bg-[#B1AFFF] text-black';

            return (
              <div
                key={match.id}
                className={`bg-white border-[3px] border-black rounded-2xl shadow-[4px_4px_0px_0px_#000000] overflow-hidden transition-all ${
                  match.status === 'Live' ? 'border-red-500 ring-2 ring-red-500/20' : ''
                }`}
              >
                {/* Match Row header */}
                <div className="bg-gray-50 border-b-2 border-black p-3.5 flex flex-wrap justify-between items-center gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-sans font-black text-xs px-2.5 py-0.5 rounded bg-[#FFE227] border-2 border-black text-black">
                      {match.stage === 'Group' ? `小组赛 ${match.group}组` : match.stage}
                    </span>
                    <span className="text-gray-500 font-mono font-bold text-xs flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {match.date} {match.time}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-gray-500 font-mono font-bold text-xs flex items-center gap-1 hidden md:flex">
                      <MapPin className="w-3.5 h-3.5 text-gray-400" />
                      {match.stadium} ({match.city})
                    </span>
                    <span className={`${statusBadgeColor} font-bold text-xs px-2.5 py-1 rounded-md border-2 border-black font-sans uppercase`}>
                      {match.status === 'Live' ? `LIVE ${match.minute}'` : match.status === 'Completed' ? '已完赛' : '未开赛'}
                    </span>
                  </div>
                </div>

                {/* Match score row */}
                <div className="p-5 flex items-center justify-between gap-2 sm:gap-4 md:px-12">
                  {/* Home Team */}
                  <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3.5 w-5/12 text-center sm:text-left justify-end">
                    <span className="text-black font-extrabold text-sm sm:text-base md:text-lg order-2 sm:order-1 font-sans">
                      {home.name}
                    </span>
                    <span className="text-3xl sm:text-4xl leading-none order-1 sm:order-2" role="img" aria-label={home.name}>
                      {home.flag}
                    </span>
                  </div>

                  {/* Score block */}
                  <div className="w-2/12 flex flex-col items-center justify-center">
                    {match.status === 'Scheduled' ? (
                      <span className="text-gray-400 font-mono font-black text-lg sm:text-2xl tracking-widest border-2 border-dashed border-gray-300 px-3 py-1 rounded-xl">
                        VS
                      </span>
                    ) : (
                      <div className="flex items-center gap-1.5 sm:gap-2.5 bg-[#F4F2EC] border-[3px] border-black rounded-2xl px-4 py-1.5 shadow-[2px_2px_0px_0px_#000000]">
                        <span className={`text-xl sm:text-3xl font-black font-mono leading-none ${match.status === 'Live' ? 'text-red-600 animate-pulse' : 'text-black'}`}>
                          {match.homeScore}
                        </span>
                        <span className="text-black font-black text-lg leading-none">-</span>
                        <span className={`text-xl sm:text-3xl font-black font-mono leading-none ${match.status === 'Live' ? 'text-red-600 animate-pulse' : 'text-black'}`}>
                          {match.awayScore}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Away Team */}
                  <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3.5 w-5/12 text-center sm:text-right justify-start">
                    <span className="text-3xl sm:text-4xl leading-none" role="img" aria-label={away.name}>
                      {away.flag}
                    </span>
                    <span className="text-black font-extrabold text-sm sm:text-base md:text-lg font-sans">
                      {away.name}
                    </span>
                  </div>
                </div>

                {/* Match Goal Scorers List (Collapses inside row) */}
                {match.events.filter((e) => e.type === 'goal').length > 0 && (
                  <div className="px-5 sm:px-12 py-2 border-t border-black/5 bg-[#FAFAF8] text-xs font-sans text-gray-500 flex justify-between gap-4">
                    <div className="w-1/2 text-right border-r border-black/10 pr-4">
                      {match.events
                        .filter((e) => e.type === 'goal' && e.teamId === match.homeTeamId)
                        .map((e) => (
                          <div key={e.id} className="flex items-center justify-end gap-1 font-semibold text-black">
                            <span>{e.playerName} {e.minute}'</span>
                            <span className="text-[10px] text-gray-400 font-mono">⚽️</span>
                          </div>
                        ))}
                    </div>
                    <div className="w-1/2 text-left pl-4">
                      {match.events
                        .filter((e) => e.type === 'goal' && e.teamId === match.awayTeamId)
                        .map((e) => (
                          <div key={e.id} className="flex items-center justify-start gap-1 font-semibold text-black">
                            <span className="text-[10px] text-gray-400 font-mono">⚽️</span>
                            <span>{e.playerName} {e.minute}'</span>
                          </div>
                        ))}
                    </div>
                  </div>
                )}

                {/* Toggle details drawer */}
                {match.status !== 'Scheduled' && (
                  <button
                    onClick={() => toggleExpandMatch(match.id)}
                    className="w-full bg-[#FAFAF8] border-t-2 border-black py-2 text-xs font-bold text-gray-600 hover:bg-gray-100 flex items-center justify-center gap-1 transition-all cursor-pointer"
                  >
                    <span>{isExpanded ? '收起比赛细节' : '展开比赛细节、现场动态与统计'}</span>
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>
                )}

                {/* Match Details & Stats Drawer */}
                {isExpanded && match.status !== 'Scheduled' && (
                  <div className="p-4 sm:p-6 bg-[#FCFBF8] border-t-2 border-black flex flex-col md:flex-row gap-6">
                    {/* Events list */}
                    <div className="w-full md:w-5/12 flex flex-col gap-3">
                      <h4 className="text-black font-extrabold text-sm border-b-2 border-black pb-1.5 flex items-center gap-1.5">
                        <Award className="w-4 h-4 text-purple-600" />
                        <span>赛场动态 timeline</span>
                      </h4>

                      {match.events.length === 0 ? (
                        <p className="text-gray-400 text-xs italic py-4">本场比赛尚未记录重大动态事件。</p>
                      ) : (
                        <div className="flex flex-col gap-2.5">
                          {match.events
                            .sort((a, b) => b.minute - a.minute)
                            .map((event) => {
                              const eventTeam = teams[event.teamId] || { flag: '⚽️', name: '' };
                              return (
                                <div
                                  key={event.id}
                                  className="flex items-start gap-2.5 text-xs bg-white border border-black/10 rounded-lg p-2 shadow-[2px_2px_0px_rgba(0,0,0,0.05)]"
                                >
                                  <span className="bg-black text-[#FFE227] font-mono font-black rounded px-1.5 py-0.5 border border-black shrink-0 text-[10px]">
                                    {event.minute}'
                                  </span>
                                  <div className="flex flex-col gap-0.5">
                                    <div className="font-extrabold text-black flex items-center gap-1 flex-wrap">
                                      <span>{eventTeam.flag}</span>
                                      <span>{event.playerName}</span>
                                      {event.type === 'goal' && (
                                        <span className="bg-green-100 text-green-800 font-bold px-1.5 rounded border border-green-200 text-[9px] uppercase">
                                          进球 ⚽️
                                        </span>
                                      )}
                                      {event.type === 'yellow_card' && (
                                        <span className="bg-yellow-100 text-yellow-800 font-bold px-1.5 rounded border border-yellow-200 text-[9px] flex items-center gap-0.5">
                                          <span className="w-2 h-2.5 bg-yellow-500 inline-block rounded"></span>
                                          黄牌
                                        </span>
                                      )}
                                      {event.type === 'red_card' && (
                                        <span className="bg-red-100 text-red-800 font-bold px-1.5 rounded border border-red-200 text-[9px] flex items-center gap-0.5">
                                          <span className="w-2 h-2.5 bg-red-500 inline-block rounded"></span>
                                          红牌
                                        </span>
                                      )}
                                    </div>
                                    {event.detail && (
                                      <span className="text-[11px] text-gray-500 font-medium">
                                        ({event.detail})
                                      </span>
                                    )}
                                  </div>
                                </div>
                              );
                            })}
                        </div>
                      )}
                    </div>

                    {/* Stats Progress Bars */}
                    <div className="w-full md:w-7/12 flex flex-col gap-4">
                      <h4 className="text-black font-extrabold text-sm border-b-2 border-black pb-1.5 flex items-center gap-1.5">
                        <Star className="w-4 h-4 text-amber-500" />
                        <span>技术统计 stats</span>
                      </h4>

                      <div className="flex flex-col gap-3 font-mono text-xs font-bold text-black">
                        {/* Possession bar */}
                        <div>
                          <div className="flex justify-between text-[11px] mb-1">
                            <span>{home.name} {Math.round(match.stats.possession[0])}%</span>
                            <span className="font-sans uppercase">控球率</span>
                            <span>{Math.round(match.stats.possession[1])}% {away.name}</span>
                          </div>
                          <div className="w-full h-4 bg-gray-100 border-2 border-black rounded-lg overflow-hidden flex">
                            <div
                              style={{ width: `${match.stats.possession[0]}%` }}
                              className="bg-[#4D96FF] border-r-2 border-black h-full"
                            ></div>
                            <div
                              style={{ width: `${match.stats.possession[1]}%` }}
                              className="bg-[#FF9F29] h-full"
                            ></div>
                          </div>
                        </div>

                        {/* Shots */}
                        <div>
                          <div className="flex justify-between text-[11px] mb-1">
                            <span>{match.stats.shots[0]} 次</span>
                            <span className="font-sans uppercase">总射门</span>
                            <span>{match.stats.shots[1]} 次</span>
                          </div>
                          <div className="w-full h-4 bg-gray-100 border-2 border-black rounded-lg overflow-hidden flex">
                            {match.stats.shots[0] + match.stats.shots[1] > 0 ? (
                              <>
                                <div
                                  style={{
                                    width: `${
                                      (match.stats.shots[0] /
                                        (match.stats.shots[0] + match.stats.shots[1])) *
                                      100
                                    }%`,
                                  }}
                                  className="bg-[#4D96FF] border-r-2 border-black h-full"
                                ></div>
                                <div
                                  style={{
                                    width: `${
                                      (match.stats.shots[1] /
                                        (match.stats.shots[0] + match.stats.shots[1])) *
                                      100
                                    }%`,
                                  }}
                                  className="bg-[#FF9F29] h-full"
                                ></div>
                              </>
                            ) : (
                              <div className="w-full bg-gray-200"></div>
                            )}
                          </div>
                        </div>

                        {/* Shots on target */}
                        <div>
                          <div className="flex justify-between text-[11px] mb-1">
                            <span>{match.stats.shotsOnTarget[0]} 次</span>
                            <span className="font-sans uppercase">射正次数</span>
                            <span>{match.stats.shotsOnTarget[1]} 次</span>
                          </div>
                          <div className="w-full h-4 bg-gray-100 border-2 border-black rounded-lg overflow-hidden flex">
                            {match.stats.shotsOnTarget[0] + match.stats.shotsOnTarget[1] > 0 ? (
                              <>
                                <div
                                  style={{
                                    width: `${
                                      (match.stats.shotsOnTarget[0] /
                                        (match.stats.shotsOnTarget[0] +
                                          match.stats.shotsOnTarget[1])) *
                                      100
                                    }%`,
                                  }}
                                  className="bg-[#4D96FF] border-r-2 border-black h-full"
                                ></div>
                                <div
                                  style={{
                                    width: `${
                                      (match.stats.shotsOnTarget[1] /
                                        (match.stats.shotsOnTarget[0] +
                                          match.stats.shotsOnTarget[1])) *
                                      100
                                    }%`,
                                  }}
                                  className="bg-[#FF9F29] h-full"
                                ></div>
                              </>
                            ) : (
                              <div className="w-full bg-gray-200"></div>
                            )}
                          </div>
                        </div>

                        {/* Corners */}
                        <div>
                          <div className="flex justify-between text-[11px] mb-1">
                            <span>{match.stats.corners[0]} 个</span>
                            <span className="font-sans uppercase">角球次数</span>
                            <span>{match.stats.corners[1]} 个</span>
                          </div>
                          <div className="w-full h-4 bg-gray-100 border-2 border-black rounded-lg overflow-hidden flex">
                            {match.stats.corners[0] + match.stats.corners[1] > 0 ? (
                              <>
                                <div
                                  style={{
                                    width: `${
                                      (match.stats.corners[0] /
                                        (match.stats.corners[0] + match.stats.corners[1])) *
                                      100
                                    }%`,
                                  }}
                                  className="bg-[#4D96FF] border-r-2 border-black h-full"
                                ></div>
                                <div
                                  style={{
                                    width: `${
                                      (match.stats.corners[1] /
                                        (match.stats.corners[0] + match.stats.corners[1])) *
                                      100
                                    }%`,
                                  }}
                                  className="bg-[#FF9F29] h-full"
                                ></div>
                              </>
                            ) : (
                              <div className="w-full bg-gray-200"></div>
                            )}
                          </div>
                        </div>

                        {/* Fouls */}
                        <div>
                          <div className="flex justify-between text-[11px] mb-1">
                            <span>{match.stats.fouls[0]} 次</span>
                            <span className="font-sans uppercase">犯规次数</span>
                            <span>{match.stats.fouls[1]} 次</span>
                          </div>
                          <div className="w-full h-4 bg-gray-100 border-2 border-black rounded-lg overflow-hidden flex">
                            {match.stats.fouls[0] + match.stats.fouls[1] > 0 ? (
                              <>
                                <div
                                  style={{
                                    width: `${
                                      (match.stats.fouls[0] /
                                        (match.stats.fouls[0] + match.stats.fouls[1])) *
                                      100
                                    }%`,
                                  }}
                                  className="bg-[#4D96FF] border-r-2 border-black h-full"
                                ></div>
                                <div
                                  style={{
                                    width: `${
                                      (match.stats.fouls[1] /
                                        (match.stats.fouls[0] + match.stats.fouls[1])) *
                                      100
                                    }%`,
                                  }}
                                  className="bg-[#FF9F29] h-full"
                                ></div>
                              </>
                            ) : (
                              <div className="w-full bg-gray-200"></div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
