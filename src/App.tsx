/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useMemo } from 'react';
import Header from './components/Header';
import StandingsTab from './components/StandingsTab';
import ScheduleTab from './components/ScheduleTab';
import ScorersTab from './components/ScorersTab';
import BracketTab from './components/BracketTab';
import NewsTab from './components/NewsTab';

import { Match, PlayerScorer, NewsItem } from './types';
import { TEAMS, INITIAL_MATCHES, INITIAL_SCORERS, INITIAL_NEWS } from './data/mockData';
import { calculateStandings } from './utils/simulator';

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

  // Invoke AI Web Crawler to scrape latest real-world 2026 World Cup data
  const handleScrapeData = async () => {
    setIsScraping(true);
    setScrapeStatus('📡 正在建立网络爬虫通道...');
    setSimulationEvent('📡 正在建立网络爬虫通道...');

    const statuses = [
      '🔍 正在通过 Google 搜索引擎检索 2026 世界杯最新战况...',
      '🤖 正在解析网页，过滤、清洗多源赛事信息...',
      '📈 正在统计 12 个小组的最新比分与排名积分变化...',
      '⚽ 正在同步最新射手榜进球与助攻数据...',
      '📰 正在提炼赛场大新闻并翻译成中文资讯...',
      '💾 正在将最新的结构化数据同步写入云端存储...'
    ];

    let statusIndex = 0;
    const interval = setInterval(() => {
      if (statusIndex < statuses.length) {
        setScrapeStatus(statuses[statusIndex]);
        setSimulationEvent(statuses[statusIndex]);
        statusIndex++;
      }
    }, 1500);

    try {
      const res = await fetch('/api/scrape-data', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      clearInterval(interval);

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || errorData.details || '服务器爬取失败');
      }

      const result = await res.json();
      if (result.success && result.data) {
        if (result.data.matches) setMatches(result.data.matches);
        if (result.data.scorers) setScorers(result.data.scorers);
        if (result.data.news) setNews(result.data.news);
        setSimulationEvent('🎉 智能爬虫同步成功！已成功载入最新实时数据。');
      } else {
        throw new Error('未获取到有效的更新数据');
      }
    } catch (err: any) {
      clearInterval(interval);
      console.error(err);
      setSimulationEvent(`❌ 爬虫同步失败: ${err.message || err}`);
    } finally {
      setIsScraping(false);
      setScrapeStatus('');
    }
  };

  // Automatic Data Fetching via Cloudflare CDN Endpoint
  const handleAutoRefresh = async (silent = false) => {
    try {
      const res = await fetch(`/api/worldcup.json?t=${Date.now()}`);
      if (!res.ok) {
        throw new Error(`HTTP 异常，状态码: ${res.status}`);
      }
      const data = await res.json();
      if (data.matches) setMatches(data.matches);
      if (data.scorers) setScorers(data.scorers);
      if (data.news) setNews(data.news);

      // Gently advance minute or events of Live matches to simulate dynamic tick-by-tick changes
      if (data.matches && data.matches.length > 0) {
        setMatches((prev) =>
          prev.map((m) => {
            if (m.status === 'Live' && m.minute) {
              const nextMin = m.minute + (Math.random() > 0.65 ? 1 : 0);
              return { ...m, minute: nextMin > 90 ? 90 : nextMin };
            }
            return m;
          })
        );
      }

      if (!silent) {
        setSimulationEvent('☁️ 数据已通过 Cloudflare 全球 CDN 毫秒级智能刷新完成！');
      }
    } catch (err: any) {
      console.warn('Auto refresh fetch failed', err);
    }
  };

  // Background Auto-Refresh effect (loads on mount and polls every 6 seconds)
  useEffect(() => {
    // Initial fetch
    handleAutoRefresh(true);

    const timer = setInterval(() => {
      handleAutoRefresh(true);
    }, 6000);

    return () => clearInterval(timer);
  }, []);

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
