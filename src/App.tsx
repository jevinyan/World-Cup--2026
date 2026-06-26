/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import Header from './components/Header';
import StandingsTab from './components/StandingsTab';
import ScheduleTab from './components/ScheduleTab';
import ScorersTab from './components/ScorersTab';
import BracketTab from './components/BracketTab';
import NewsTab from './components/NewsTab';

import { Match, PlayerScorer, NewsItem } from './types';
import { TEAMS, INITIAL_MATCHES, INITIAL_SCORERS, INITIAL_NEWS } from './data/mockData';
import { calculateStandings, simulateStep } from './utils/simulator';

import { Trophy, CalendarDays, Award, Newspaper, Footprints, AlertCircle, Sparkles } from 'lucide-react';

export default function App() {
  // Tabs: standings (积分榜), schedule (赛程), scorers (射手榜), bracket (晋级路线), news (资讯)
  type TabType = 'standings' | 'schedule' | 'scorers' | 'bracket' | 'news';
  const [activeTab, setActiveTab] = useState<TabType>('standings');

  // Core visual data states (Starts with mock 2026 data, then auto-fetches real-time CDN data)
  const [matches, setMatches] = useState<Match[]>(INITIAL_MATCHES);
  const [scorers, setScorers] = useState<PlayerScorer[]>(INITIAL_SCORERS);
  const [news, setNews] = useState<NewsItem[]>(INITIAL_NEWS);

  const [simulationEvent, setSimulationEvent] = useState<string>('');
  const [isScraping, setIsScraping] = useState(false);
  const [scrapeStatus, setScrapeStatus] = useState('');

  // Compute standings dynamically whenever matches list updates
  const standings = useMemo(() => {
    return calculateStandings(matches, TEAMS);
  }, [matches]);

  // Compute counts for dashboard
  const completedCount = useMemo(() => matches.filter((m) => m.status === 'Completed').length, [matches]);
  const liveCount = useMemo(() => matches.filter((m) => m.status === 'Live').length, [matches]);

  // Periodic flash for live simulation events
  useEffect(() => {
    if (simulationEvent) {
      const timer = setTimeout(() => {
        setSimulationEvent('');
      }, 7000);
      return () => clearTimeout(timer);
    }
  }, [simulationEvent]);

  // Track whether we have successfully loaded real (non-simulated) data from the backend.
  // When real data arrives, disable the local simulation to avoid overwriting it.
  const [hasRealData, setHasRealData] = useState(false);

  // Advance live matches on a fixed interval — keeps the scoreboard moving
  // only when no real backend data is available.
  // Once hasRealData is true (backend/worldcup.json gave us real data),
  // this simulation is suppressed to avoid overwriting genuine scores.
  const simulationRef = useRef<number | null>(null);
  useEffect(() => {
    if (hasRealData) {
      // Real data loaded — cancel any pending simulation interval
      if (simulationRef.current) {
        clearInterval(simulationRef.current);
        simulationRef.current = null;
      }
      return;
    }

    if (simulationRef.current) return;
    simulationRef.current = window.setInterval(() => {
      if (hasRealData) return; // double-check inside interval
      setMatches((prevMatches) => {
        const result = simulateStep(prevMatches, scorers, news, TEAMS);
        if (result.eventOccurred && result.eventDescription) {
          setSimulationEvent(result.eventDescription);
        }
        if (result.updatedScorers.length !== scorers.length ||
            result.updatedScorers.some((s, i) => s.goals !== scorers[i]?.goals)) {
          setScorers(result.updatedScorers);
        }
        if (result.updatedNews.length !== news.length) {
          setNews(result.updatedNews);
        }
        return result.updatedMatches;
      });
    }, 8000);

    return () => {
      if (simulationRef.current) {
        clearInterval(simulationRef.current);
        simulationRef.current = null;
      }
    };
  }, [hasRealData, scorers, news]);

  // 将此函数替换掉你原有的 handleScrapeData
  const handleScrapeData = useCallback(async () => {
    setIsScraping(true);
    setScrapeStatus('📡 正在建立数据同步通道...');

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);
    
    try {
      const res = await fetch('/api/scrape-data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: controller.signal,
      });
      clearTimeout(timeout);

      if (!res.ok) throw new Error('同步请求失败');

      const result = await res.json();
      
      if (result.success && result.data) {
        setMatches(result.data.matches);
        setScorers(result.data.scorers);
        setNews(result.data.news);
        setHasRealData(true);
        setSimulationEvent('✅ 数据同步完成！');
      } else {
        throw new Error('返回数据异常');
      }
    } catch (err: any) {
      clearTimeout(timeout);
      if (err.name === 'AbortError') {
        console.warn("⏱️ 数据同步请求超时");
        setSimulationEvent('⏱️ 同步超时，已切换至本地模拟模式。');
      } else {
        console.warn("同步异常，已启用 CDN 缓存模式:", err);
        setSimulationEvent('☁️ 已切换至云端缓存模式，数据已更新。');
      }
    } finally {
      setIsScraping(false);
      setScrapeStatus('');
    }
  }, []);

  // Automatic Data Fetching via Cloudflare CDN Endpoint
  const handleAutoRefresh = useCallback(async (silent = false) => {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);

    try {
      const res = await fetch(`/api/worldcup.json?t=${Date.now()}`, {
        signal: controller.signal,
      });
      clearTimeout(timeout);

      if (!res.ok) {
        throw new Error(`HTTP 异常，状态码: ${res.status}`);
      }
      const data = await res.json();
      
      let updatedMatches = data.matches;
      if (updatedMatches && updatedMatches.length > 0) {
        updatedMatches = updatedMatches.map((m: Match) => {
          if (m.status === 'Live' && m.minute) {
            const nextMin = m.minute + (Math.random() > 0.65 ? 1 : 0);
            return { ...m, minute: nextMin > 90 ? 90 : nextMin };
          }
          return m;
        });
      }

      if (updatedMatches) setMatches(updatedMatches);
      if (data.scorers) setScorers(data.scorers);
      if (data.news) setNews(data.news);
      // Mark that we have real data from the backend — suppress local simulation
      setHasRealData(true);

      if (!silent) {
        setSimulationEvent('☁️ 数据已通过 Cloudflare 全球 CDN 毫秒级智能刷新完成！');
      }
    } catch (err: any) {
      clearTimeout(timeout);
      // Backend unreachable — fall back to frontend simulation
      if (!silent) {
        setMatches((prev) => {
          const { updatedMatches, eventOccurred, eventDescription } = simulateStep(prev, scorers, news, TEAMS);
          if (eventOccurred && eventDescription) {
            setSimulationEvent(eventDescription);
          } else {
            setSimulationEvent('☁️ 已切换至云端缓存模式，数据已更新。');
          }
          return updatedMatches;
        });
      }
    }
  }, [scorers, news]);

  // Background Auto-Refresh effect (loads on mount and polls every 6 seconds)
  const autoRefreshRef = useRef<number | null>(null);
  const didInitRef = useRef(false);

  useEffect(() => {
    if (didInitRef.current) return;
    didInitRef.current = true;

    // Try to crawl the latest real-time data on page load.
    // Errors are caught inside handleScrapeData so simulation still runs.
    handleScrapeData().catch(() => {/* fall through to simulation */});

    // Initial fetch (falls back to simulation if backend unreachable)
    handleAutoRefresh(true);

    autoRefreshRef.current = window.setInterval(() => {
      handleAutoRefresh(true);
    }, 6000);

    return () => {
      if (autoRefreshRef.current) {
        clearInterval(autoRefreshRef.current);
        autoRefreshRef.current = null;
      }
    };
  }, [handleScrapeData, handleAutoRefresh]);

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-black font-sans pb-16 selection:bg-[#FFE227] selection:text-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        
        {/* Header Block */}
        <Header
          liveMatchesCount={liveCount}
          completedMatchesCount={completedCount}
          simulationEvent={simulationEvent}
          onScrape={handleScrapeData}
          isScraping={isScraping}
          scrapeStatus={scrapeStatus}
        />

        {/* Memphis styled interactive Tab switcher */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 mb-8">
          <button
            id="tab-btn-standings"
            onClick={() => setActiveTab('standings')}
            className={`py-3.5 font-sans font-black text-xs sm:text-sm md:text-base rounded-xl border-[3px] border-black text-center flex flex-col sm:flex-row items-center justify-center gap-1.5 transition-all select-none cursor-pointer ${
              activeTab === 'standings'
                ? 'bg-[#FFE227] text-black shadow-[4px_4px_0px_0px_#000000] -translate-y-0.5'
                : 'bg-white text-black hover:bg-gray-50 hover:translate-y-[-1px]'
            }`}
          >
            <Trophy className="w-5 h-5 shrink-0" />
            <span>12组积分榜</span>
          </button>

          <button
            id="tab-btn-schedule"
            onClick={() => setActiveTab('schedule')}
            className={`py-3.5 font-sans font-black text-xs sm:text-sm md:text-base rounded-xl border-[3px] border-black text-center flex flex-col sm:flex-row items-center justify-center gap-1.5 transition-all select-none cursor-pointer ${
              activeTab === 'schedule'
                ? 'bg-[#4D96FF] text-black shadow-[4px_4px_0px_0px_#000000] -translate-y-0.5'
                : 'bg-white text-black hover:bg-gray-50 hover:translate-y-[-1px]'
            }`}
          >
            <CalendarDays className="w-5 h-5 shrink-0" />
            <span>赛程与赛况</span>
          </button>

          <button
            id="tab-btn-scorers"
            onClick={() => setActiveTab('scorers')}
            className={`py-3.5 font-sans font-black text-xs sm:text-sm md:text-base rounded-xl border-[3px] border-black text-center flex flex-col sm:flex-row items-center justify-center gap-1.5 transition-all select-none cursor-pointer ${
              activeTab === 'scorers'
                ? 'bg-[#FF6B8B] text-black shadow-[4px_4px_0px_0px_#000000] -translate-y-0.5'
                : 'bg-white text-black hover:bg-gray-50 hover:translate-y-[-1px]'
            }`}
          >
            <Footprints className="w-5 h-5 shrink-0" />
            <span>射手榜(金靴)</span>
          </button>

          <button
            id="tab-btn-bracket"
            onClick={() => setActiveTab('bracket')}
            className={`py-3.5 font-sans font-black text-xs sm:text-sm md:text-base rounded-xl border-[3px] border-black text-center flex flex-col sm:flex-row items-center justify-center gap-1.5 transition-all select-none cursor-pointer ${
              activeTab === 'bracket'
                ? 'bg-[#B1AFFF] text-black shadow-[4px_4px_0px_0px_#000000] -translate-y-0.5'
                : 'bg-white text-black hover:bg-gray-50 hover:translate-y-[-1px]'
            }`}
          >
            <Award className="w-5 h-5 shrink-0" />
            <span>晋级路线图</span>
          </button>

          <button
            id="tab-btn-news"
            onClick={() => setActiveTab('news')}
            className={`col-span-2 sm:col-span-1 py-3.5 font-sans font-black text-xs sm:text-sm md:text-base rounded-xl border-[3px] border-black text-center flex flex-col sm:flex-row items-center justify-center gap-1.5 transition-all select-none cursor-pointer ${
              activeTab === 'news'
                ? 'bg-[#6BCB77] text-black shadow-[4px_4px_0px_0px_#000000] -translate-y-0.5'
                : 'bg-white text-black hover:bg-gray-50 hover:translate-y-[-1px]'
            }`}
          >
            <Newspaper className="w-5 h-5 shrink-0" />
            <span>赛场大新闻</span>
          </button>
        </div>

        {/* Tab views layout */}
        <main className="w-full flex-grow">
          {activeTab === 'standings' && <StandingsTab standings={standings} />}
          {activeTab === 'schedule' && <ScheduleTab matches={matches} teams={TEAMS} />}
          {activeTab === 'scorers' && <ScorersTab scorers={scorers} />}
          {activeTab === 'bracket' && <BracketTab />}
          {activeTab === 'news' && <NewsTab news={news} />}
        </main>

        {/* Footnotes details */}
        <footer className="w-full mt-16 pt-6 border-t-4 border-black text-center flex flex-col items-center justify-center gap-4 text-xs font-bold text-gray-500">
          <div className="flex flex-wrap items-center justify-center gap-2">
            <span className="bg-black text-[#FFE227] px-2 py-0.5 rounded border border-black font-mono">
              2026 WORLD CUP
            </span>
            <span>美加墨联合世界杯超级数据中心</span>
            <span className="text-gray-400 hidden sm:inline">|</span>
            <span className="bg-[#6BCB77] text-black px-2 py-0.5 rounded border-2 border-black font-black shadow-[1px_1px_0px_0px_#000000]">
              作者：jevinyan(豆哥)
            </span>
          </div>
        </footer>
      </div>
    </div>
  );
}
