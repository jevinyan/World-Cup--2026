/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, MouseEvent } from 'react';
import { NewsItem } from '../types';
import { Radio, Calendar, ChevronRight, User, Globe, MessageSquare, X } from 'lucide-react';

interface NewsTabProps {
  news: NewsItem[];
}

export default function NewsTab({ news }: NewsTabProps) {
  const [selectedNewsId, setSelectedNewsId] = useState<string | null>(null);
  const [modalNews, setModalNews] = useState<NewsItem | null>(null);

  const getTagColor = (tag: NewsItem['tag']) => {
    switch (tag) {
      case '战报':
        return 'bg-[#FFE227] text-black';
      case '突发':
        return 'bg-[#FF517A] text-white';
      case '分析':
        return 'bg-[#38BDF8] text-black';
      case '爆料':
        return 'bg-[#6BCB77] text-black';
      case '伤停':
        return 'bg-purple-500 text-white';
      default:
        return 'bg-black text-white';
    }
  };

  const activeNews = news.find((n) => n.id === selectedNewsId) || news[0];

  const openNewsModal = (item: NewsItem, e: MouseEvent) => {
    e.stopPropagation();
    setModalNews(item);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Left side: News List */}
      <div className="lg:col-span-7 flex flex-col gap-4">
        <h3 className="text-black font-black text-lg border-b-2 border-black pb-2 flex items-center gap-2">
          <Radio className="w-5 h-5 text-[#FF517A] animate-pulse" />
          <span>最新世界杯滚动资讯 live news</span>
        </h3>

        <div className="flex flex-col gap-4 max-h-[600px] overflow-y-auto pr-1">
          {news.map((item) => {
            const isSelected = item.id === selectedNewsId;
            return (
              <div
                key={item.id}
                onClick={() => setSelectedNewsId(item.id)}
                className={`bg-white border-2 border-black rounded-xl p-4 shadow-[3px_3px_0px_0px_#000000] cursor-pointer hover:-translate-y-0.5 hover:shadow-[4px_4px_0px_0px_#000000] transition-all flex flex-col gap-2 ${
                  isSelected ? 'bg-yellow-50/10 border-[#FF517A] ring-1 ring-[#FF517A]/20' : ''
                }`}
              >
                <div className="flex justify-between items-center gap-2">
                  <span className={`${getTagColor(item.tag)} font-sans font-black text-[10px] px-2.5 py-0.5 rounded border border-black uppercase tracking-wider`}>
                    {item.tag}
                  </span>
                  <span className="text-gray-400 font-mono font-bold text-[10px] flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {item.time}
                  </span>
                </div>

                <h4 className="text-black font-extrabold text-sm sm:text-base line-clamp-2 hover:text-[#FF517A] transition-colors leading-snug">
                  {item.title}
                </h4>

                <p className="text-gray-500 text-xs line-clamp-2 font-sans font-medium">
                  {item.summary}
                </p>

                <div className="flex justify-between items-center text-[10px] text-gray-400 font-bold border-t border-black/5 pt-2 mt-1">
                  <span className="flex items-center gap-1">
                    <Globe className="w-3 h-3 text-gray-300" />
                    {item.source}
                  </span>
                  <button 
                    onClick={(e) => openNewsModal(item, e)}
                    className="text-black font-black flex items-center gap-0.5 hover:underline bg-transparent border-none p-0 cursor-pointer"
                  >
                    查看详情 <ChevronRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Right side: Selected News Reader */}
      <div className="lg:col-span-5">
        <h3 className="text-black font-black text-lg border-b-2 border-black pb-2 mb-4 flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-purple-600" />
          <span>新闻阅读面板 details reader</span>
        </h3>

        {activeNews ? (
          <div className="bg-white border-[3px] border-black rounded-2xl p-5 shadow-[5px_5px_0px_0px_#000000] flex flex-col gap-4 animate-fadeIn">
            {/* Header tags */}
            <div className="flex justify-between items-center">
              <span className={`${getTagColor(activeNews.tag)} font-sans font-black text-xs px-3 py-1 rounded border-2 border-black uppercase tracking-widest`}>
                {activeNews.tag}
              </span>
              <span className="text-gray-400 font-mono font-extrabold text-xs">
                {activeNews.time}
              </span>
            </div>

            {/* Title */}
            <h2 className="text-black font-black text-lg sm:text-xl font-sans leading-tight">
              {activeNews.title}
            </h2>

            {/* Meta */}
            <div className="flex items-center gap-3 text-xs text-gray-500 font-bold border-y-2 border-black/10 py-2">
              <span className="flex items-center gap-1">
                <User className="w-4 h-4 text-gray-400" />
                记者: 世界杯前方报道组
              </span>
              <span>•</span>
              <span>来源: {activeNews.source}</span>
            </div>

            {/* Content body */}
            <div className="text-xs sm:text-sm text-gray-600 font-medium font-sans leading-relaxed space-y-3 whitespace-pre-wrap max-h-[300px] overflow-y-auto pr-1">
              <p className="font-extrabold text-black bg-[#F5F3ED] p-3 rounded-lg border border-black/10 shadow-[2px_2px_0px_rgba(0,0,0,0.05)]">
                “ {activeNews.summary} ”
              </p>
              <p>{activeNews.content}</p>
            </div>

            {/* Footer stamp */}
            <div className="border-t-2 border-dashed border-gray-200 pt-4 text-center">
              <span className="font-mono text-[10px] text-gray-400 font-extrabold uppercase tracking-widest">
                ⚽️ 2026 美加墨世界杯特稿 · 实时同步中 ⚽️
              </span>
            </div>
          </div>
        ) : (
          <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-2xl p-8 text-center text-gray-400 text-xs font-bold">
            请在左侧点击任何资讯卡片来在此处阅读完整报道
          </div>
        )}
      </div>

      {/* Modern Memphis Styled Article Modal */}
      {modalNews && (
        <div 
          className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
          onClick={() => setModalNews(null)}
        >
          <div 
            className="bg-white border-[4px] border-black rounded-2xl p-6 shadow-[8px_8px_0px_0px_#000000] max-w-2xl w-full relative max-h-[85vh] overflow-y-auto flex flex-col gap-4 animate-in fade-in zoom-in duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={() => setModalNews(null)}
              className="absolute top-4 right-4 bg-[#FF517A] text-white p-2 rounded-lg border-2 border-black shadow-[2px_2px_0px_0px_#000000] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_0px_#000000] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all cursor-pointer"
              aria-label="关闭窗口"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Category / Time */}
            <div className="flex items-center gap-3 mt-2">
              <span className={`${getTagColor(modalNews.tag)} font-sans font-black text-xs px-3 py-1 rounded border-2 border-black uppercase tracking-widest`}>
                {modalNews.tag}
              </span>
              <span className="text-gray-400 font-mono font-extrabold text-xs flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                {modalNews.time}
              </span>
            </div>

            {/* Title */}
            <h2 className="text-black font-black text-xl sm:text-2xl font-sans leading-tight pr-10">
              {modalNews.title}
            </h2>

            {/* Author details */}
            <div className="flex items-center gap-3 text-xs text-gray-500 font-bold border-y-2 border-black/10 py-2.5">
              <span className="flex items-center gap-1">
                <User className="w-4 h-4 text-gray-400" />
                记者: 世界杯前方报道特派组
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Globe className="w-3.5 h-3.5 text-gray-400" />
                来源: {modalNews.source}
              </span>
            </div>

            {/* Summary Box */}
            <div className="font-extrabold text-black bg-[#F5F3ED] p-4 rounded-xl border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
              “ {modalNews.summary} ”
            </div>

            {/* Article Content */}
            <div className="text-sm sm:text-base text-gray-700 font-medium font-sans leading-relaxed space-y-4 whitespace-pre-wrap pt-2">
              {modalNews.content}
            </div>

            {/* Bottom stamp */}
            <div className="border-t-2 border-dashed border-gray-200 pt-5 mt-4 text-center">
              <span className="font-mono text-xs text-gray-400 font-extrabold uppercase tracking-widest block">
                ⚽️ 2026 FIFA WORLD CUP OFFICIAL NEWS ⚽️
              </span>
              <span className="text-[10px] text-gray-400 block mt-1">
                数据云端实时刷新 · 真实战况同步
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
