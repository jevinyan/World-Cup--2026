import { NewsItem } from '../types';

const RSS_FEEDS = [
  // Google News 中文世界杯新闻（优先，内容最新最全）
  { name: 'Google News 中文世界杯', url: 'https://news.google.com/rss/search?q=2026%E4%B8%96%E7%95%8C%E6%9D%AF%E8%B6%B3%E7%90%83&hl=zh-CN&gl=CN&ceid=CN:zh-Hans', source: 'Google News' },
  { name: 'Google News 英文世界杯', url: 'https://news.google.com/rss/search?q=fifa%20world%20cup%202026&hl=en&gl=US&ceid=US:en', source: 'Google News' },
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

const parseFeedItems = (xml: Document, feedName: string, sourceName: string): NewsItem[] => {
  let items = xml.querySelectorAll('item');
  if (items.length === 0) {
    items = xml.querySelectorAll('entry');
  }
  if (items.length === 0) {
    items = xml.querySelectorAll('news');
  }

  const newsList: NewsItem[] = [];
  const nsResolver = (prefix: string) => {
    const ns: Record<string, string> = {
      'media': 'http://search.yahoo.com/mrss/',
      'dc': 'http://purl.org/dc/elements/1.1/',
      'atom': 'http://www.w3.org/2005/Atom',
      'content': 'http://purl.org/rss/1.0/modules/content/',
    };
    return ns[prefix] || null;
  };

  items.forEach((item, index) => {
    if (index >= 10) return;

    const title = 
      item.querySelector('title')?.textContent?.replace(/<!\[CDATA\[|\]\]>/g, '').trim() ||
      '';

    let link = '';
    const linkEl = item.querySelector('link');
    if (linkEl) {
      link = linkEl.textContent || linkEl.getAttribute('href') || '';
    }
    if (!link) {
      const altLinks = item.querySelectorAll('link');
      altLinks.forEach(l => {
        if (l.getAttribute('rel') === 'alternate' || !link) {
          link = l.getAttribute('href') || '';
        }
      });
    }

    let description = '';
    const descEl = item.querySelector('description');
    if (descEl) description = descEl.textContent || '';
    if (!description) {
      const summaryEl = item.querySelector('summary');
      if (summaryEl) description = summaryEl.textContent || '';
    }
    if (!description) {
      const contentEl = item.querySelector('content');
      if (contentEl) description = contentEl.textContent || '';
    }

    let pubDate = '';
    const pubDateEl = item.querySelector('pubDate');
    if (pubDateEl) pubDate = pubDateEl.textContent || '';
    if (!pubDate) {
      const publishedEl = item.querySelector('published');
      if (publishedEl) pubDate = publishedEl.textContent || '';
    }
    if (!pubDate) {
      const updatedEl = item.querySelector('updated');
      if (updatedEl) pubDate = updatedEl.textContent || '';
    }
    if (!pubDate) {
      const dcDateEl = item.querySelector('dc\\:date');
      if (dcDateEl) pubDate = dcDateEl.textContent || '';
    }

    let guid = '';
    const guidEl = item.querySelector('guid');
    if (guidEl) guid = guidEl.textContent || '';
    if (!guid) {
      const idEl = item.querySelector('id');
      if (idEl) guid = idEl.textContent || '';
    }
    if (!guid && link) {
      guid = link.split('/').pop() || link;
    }
    if (!guid) {
      guid = String(Date.now() + index);
    }

    let image = '';
    const enclosure = item.querySelector('enclosure');
    if (enclosure?.getAttribute('url') && enclosure.getAttribute('type')?.startsWith('image')) {
      image = enclosure.getAttribute('url') || '';
    }
    if (!image) {
      const mediaThumbnails = item.getElementsByTagNameNS('http://search.yahoo.com/mrss/', 'thumbnail');
      if (mediaThumbnails.length > 0) {
        image = mediaThumbnails[0].getAttribute('url') || '';
      }
    }
    if (!image) {
      const mediaContents = item.getElementsByTagNameNS('http://search.yahoo.com/mrss/', 'content');
      for (let i = 0; i < mediaContents.length; i++) {
        const type = mediaContents[i].getAttribute('type') || '';
        if (type.startsWith('image')) {
          image = mediaContents[i].getAttribute('url') || '';
          break;
        }
      }
    }
    const imgMatch = description.match(/<img[^>]+src=["']([^"']+)["']/i);
    if (imgMatch && !image) {
      image = imgMatch[1];
    }

    const cleanSummary = stripHtml(description);
    const id = `news-${feedName}-${guid}-${index}`.replace(/[^a-zA-Z0-9-]/g, '');

    if (!title || title.length < 5) return;

    const actualSource = sourceName === 'Google News' 
      ? (extractSourceFromTitle(title) || sourceName)
      : sourceName;

    newsList.push({
      id,
      title: title.slice(0, 200),
      summary: cleanSummary.slice(0, 150) || title.slice(0, 100),
      content: cleanSummary.slice(0, 500) || title,
      time: formatTimeAgo(pubDate),
      source: actualSource,
      tag: getNewsTags(title),
      image: image.replace(/^http:/, 'https:'),
    });
  });

  return newsList;
};

const extractSourceFromTitle = (title: string): string => {
  const patterns = [
    /[\-–—]\s*([^-–—]+?)\s*$/,
    /\|\s*([^|]+?)\s*$/,
    /\[([^\]]+)\]\s*$/,
  ];
  for (const pattern of patterns) {
    const match = title.match(pattern);
    if (match && match[1] && match[1].trim().length < 30) {
      return match[1].trim();
    }
  }
  return '';
};

const fetchRSSFeed = async (feedUrl: string, sourceName: string, feedName: string): Promise<NewsItem[]> => {
  const isGoogleNews = feedUrl.includes('news.google.com');
  const urlsToTry = isGoogleNews
    ? [feedUrl, ...CORS_PROXIES.map(p => p(feedUrl))]
    : CORS_PROXIES.map(p => p(feedUrl));

  for (const url of urlsToTry) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);

      const response = await fetch(url, { signal: controller.signal });
      clearTimeout(timeoutId);

      if (!response.ok) continue;

      const text = await response.text();
      const parser = new DOMParser();
      const xml = parser.parseFromString(text, 'text/xml');

      const parseError = xml.querySelector('parsererror');
      if (parseError) {
        console.warn(`⚠️ ${feedName} RSS 格式无效，尝试下一个...`);
        continue;
      }

      const newsList = parseFeedItems(xml, feedName, sourceName);

      if (newsList.length > 0) {
        console.log(`✅ ${feedName}: ${newsList.length} 条新闻`);
        return newsList;
      }
    } catch (err: any) {
      console.warn(`⚠️ ${feedName} 获取失败，尝试下一个...`);
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
