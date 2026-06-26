import { NewsItem } from '../types';

const RSS_FEEDS = [
  // 中文新闻源
  { name: '网易新闻', url: 'https://news.163.com/rss/news.xml', source: '网易体育' },
  { name: '搜狐体育', url: 'http://rss.sohu.com/feed.jsp?col=89&spec=0', source: '搜狐体育' },
  // 英文足球新闻源
  { name: 'BBC Sport Football', url: 'https://feeds.bbci.co.uk/sport/football/rss.xml', source: 'BBC Sport' },
  { name: 'ESPN FC', url: 'https://www.espn.com/espn/rss/soccer/news', source: 'ESPN FC' },
  { name: 'Sky Sports', url: 'https://www.skysports.com/rss/0,20514,11095,00.xml', source: 'Sky Sports' },
];

const CORS_PROXIES = [
  (url: string) => `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`,
  (url: string) => `https://corsproxy.io/?${encodeURIComponent(url)}`,
  (url: string) => `https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(url)}`,
];

const getNewsTags = (title: string): NewsItem['tag'] => {
  const lowerTitle = title.toLowerCase();
  if (lowerTitle.includes('goal') || lowerTitle.includes('score') || lowerTitle.includes('win') || lowerTitle.includes('beat') || lowerTitle.includes('defeat')) return '战报';
  if (lowerTitle.includes('transfer') || lowerTitle.includes('sign') || lowerTitle.includes('deal') || lowerTitle.includes('move')) return '爆料';
  if (lowerTitle.includes('breaking') || lowerTitle.includes('latest') || lowerTitle.includes('now')) return '突发';
  if (lowerTitle.includes('injury') || lowerTitle.includes('injured') || lowerTitle.includes('suspended')) return '伤停';
  if (lowerTitle.includes('analysis') || lowerTitle.includes('preview') || lowerTitle.includes('tactics') || lowerTitle.includes('review')) return '分析';
  return '分析';
};

const formatTimeAgo = (dateStr: string): string => {
  try {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return '刚刚';
    if (diffMins < 60) return `${diffMins}分钟前`;
    if (diffHours < 24) return `${diffHours}小时前`;
    if (diffDays < 7) return `${diffDays}天前`;
    return date.toLocaleDateString('zh-CN');
  } catch {
    return '未知时间';
  }
};

const stripHtml = (html: string): string => {
  const tmp = document.createElement('div');
  tmp.innerHTML = html;
  return (tmp.textContent || tmp.innerText || '').replace(/\s+/g, ' ').trim();
};

const fetchRSSFeed = async (feedUrl: string, sourceName: string, feedName: string): Promise<NewsItem[]> => {
  for (const proxy of CORS_PROXIES) {
    try {
      const proxyUrl = proxy(feedUrl);
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 8000);

      const response = await fetch(proxyUrl, { signal: controller.signal });
      clearTimeout(timeoutId);

      if (!response.ok) continue;

      const text = await response.text();
      const parser = new DOMParser();
      const xml = parser.parseFromString(text, 'text/xml');

      // 检查是否是有效的 RSS XML
      const parseError = xml.querySelector('parsererror');
      if (parseError) {
        console.warn(`⚠️ ${feedName} RSS 格式无效，尝试下一个代理...`);
        continue;
      }

      // 尝试多种选择器来兼容不同格式的 RSS
      let items = xml.querySelectorAll('item');
      if (items.length === 0) {
        items = xml.querySelectorAll('entry');
      }
      if (items.length === 0) {
        items = xml.querySelectorAll('news');
      }

      const newsList: NewsItem[] = [];

      items.forEach((item, index) => {
        if (index >= 8) return; // 限制每源最多 8 条

        // 尝试多种选择器来获取标题
        const title = 
          item.querySelector('title')?.textContent?.replace(/<!\[CDATA\[|\]\]>/g, '').trim() ||
          item.querySelector('description')?.textContent?.slice(0, 50) ||
          '';

        // 尝试获取链接
        const link = 
          item.querySelector('link')?.textContent ||
          item.querySelector('link')?.getAttribute('href') ||
          '';

        // 尝试获取描述
        const description = 
          item.querySelector('description')?.textContent ||
          item.querySelector('summary')?.textContent ||
          item.querySelector('content')?.textContent ||
          '';

        // 尝试获取发布时间
        const pubDate = 
          item.querySelector('pubDate')?.textContent ||
          item.querySelector('published')?.textContent ||
          item.querySelector('dc\\:date')?.textContent ||
          '';

        // 尝试获取唯一标识
        const guid = 
          item.querySelector('guid')?.textContent ||
          item.querySelector('id')?.textContent ||
          link.split('/').pop() ||
          String(Date.now() + index);

        // 尝试获取图片
        let image = '';
        const enclosure = item.querySelector('enclosure');
        if (enclosure?.getAttribute('url') && enclosure.getAttribute('type')?.startsWith('image')) {
          image = enclosure.getAttribute('url') || '';
        }
        const mediaContent = item.querySelector('media\\:content, media\\:thumbnail, content, thumbnail');
        if (mediaContent?.getAttribute('url')) {
          image = mediaContent.getAttribute('url') || '';
        }
        // 尝试从描述中提取图片
        const imgMatch = description.match(/<img[^>]+src=["']([^"']+)["']/i);
        if (imgMatch && !image) {
          image = imgMatch[1];
        }

        const cleanSummary = stripHtml(description);
        const id = `news-${feedName}-${guid}-${index}`.replace(/[^a-zA-Z0-9-]/g, '');

        // 过滤掉没有标题的新闻
        if (!title || title.length < 5) return;

        newsList.push({
          id,
          title: title.slice(0, 200),
          summary: cleanSummary.slice(0, 150) || title.slice(0, 100),
          content: cleanSummary.slice(0, 500) || title,
          time: formatTimeAgo(pubDate),
          source: sourceName,
          tag: getNewsTags(title),
          image: image.replace(/^http:/, 'https:'),
        });
      });

      if (newsList.length > 0) {
        console.log(`✅ ${feedName}: ${newsList.length} 条新闻`);
        return newsList;
      }
    } catch (err: any) {
      console.warn(`⚠️ ${feedName} 通过代理获取失败，尝试下一个...`);
    }
  }
  return [];
};

export const fetchNewsFromRSS = async (): Promise<NewsItem[]> => {
  console.log('🔄 正在从 RSS 源获取最新体育新闻...');
  const allNews: NewsItem[] = [];

  const results = await Promise.allSettled(
    RSS_FEEDS.map(feed => fetchRSSFeed(feed.url, feed.source, feed.name))
  );

  results.forEach(result => {
    if (result.status === 'fulfilled' && result.value.length > 0) {
      allNews.push(...result.value);
    }
  });

  allNews.sort((a, b) => {
    const parseTime = (t: string): number => {
      if (t === '刚刚') return 0;
      if (t.includes('分钟前')) return parseInt(t) || 999;
      if (t.includes('小时前')) return (parseInt(t) || 999) * 60;
      if (t.includes('天前')) return (parseInt(t) || 999) * 60 * 24;
      return 99999;
    };
    return parseTime(a.time) - parseTime(b.time);
  });

  console.log(`📰 共获取 ${allNews.length} 条体育新闻`);
  return allNews.slice(0, 15);
};
