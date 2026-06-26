/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Team, Match, PlayerScorer, NewsItem, KnockoutNode } from '../types';

// 48 Teams for World Cup 2026 (Groups A to L) — Real FIFA 2026 Final Draw
export const TEAMS: Record<string, Team> = {
  // Group A
  'CZE': { id: 'CZE', name: '捷克', code: 'CZE', flag: '🇨🇿', group: 'A' },
  'KOR': { id: 'KOR', name: '韩国', code: 'KOR', flag: '🇰🇷', group: 'A' },
  'MEX': { id: 'MEX', name: '墨西哥', code: 'MEX', flag: '🇲🇽', group: 'A' },
  'RSA': { id: 'RSA', name: '南非', code: 'RSA', flag: '🇿🇦', group: 'A' },

  // Group B
  'BIH': { id: 'BIH', name: '波斯尼亚和黑塞哥维那', code: 'BIH', flag: '🇧🇦', group: 'B' },
  'CAN': { id: 'CAN', name: '加拿大', code: 'CAN', flag: '🇨🇦', group: 'B' },
  'QAT': { id: 'QAT', name: '卡塔尔', code: 'QAT', flag: '🇶🇦', group: 'B' },
  'SUI': { id: 'SUI', name: '瑞士', code: 'SUI', flag: '🇨🇭', group: 'B' },

  // Group C
  'BRA': { id: 'BRA', name: '巴西', code: 'BRA', flag: '🇧🇷', group: 'C' },
  'HAI': { id: 'HAI', name: '海地', code: 'HAI', flag: '🇭🇹', group: 'C' },
  'MAR': { id: 'MAR', name: '摩洛哥', code: 'MAR', flag: '🇲🇦', group: 'C' },
  'SCO': { id: 'SCO', name: '苏格兰', code: 'SCO', flag: '🏳️', group: 'C' },

  // Group D
  'AUS': { id: 'AUS', name: '澳大利亚', code: 'AUS', flag: '🇦🇺', group: 'D' },
  'PAR': { id: 'PAR', name: '巴拉圭', code: 'PAR', flag: '🇵🇾', group: 'D' },
  'TUR': { id: 'TUR', name: '土耳其', code: 'TUR', flag: '🇹🇷', group: 'D' },
  'USA': { id: 'USA', name: '美国', code: 'USA', flag: '🇺🇸', group: 'D' },

  // Group E
  'CIV': { id: 'CIV', name: '科特迪瓦', code: 'CIV', flag: '🇨🇮', group: 'E' },
  'CUW': { id: 'CUW', name: '库拉索', code: 'CUW', flag: '🇨🇼', group: 'E' },
  'ECU': { id: 'ECU', name: '厄瓜多尔', code: 'ECU', flag: '🇪🇨', group: 'E' },
  'GER': { id: 'GER', name: '德国', code: 'GER', flag: '🇩🇪', group: 'E' },

  // Group F
  'JPN': { id: 'JPN', name: '日本', code: 'JPN', flag: '🇯🇵', group: 'F' },
  'NED': { id: 'NED', name: '荷兰', code: 'NED', flag: '🇳🇱', group: 'F' },
  'SWE': { id: 'SWE', name: '瑞典', code: 'SWE', flag: '🇸🇪', group: 'F' },
  'TUN': { id: 'TUN', name: '突尼斯', code: 'TUN', flag: '🇹🇳', group: 'F' },

  // Group G
  'BEL': { id: 'BEL', name: '比利时', code: 'BEL', flag: '🇧🇪', group: 'G' },
  'EGY': { id: 'EGY', name: '埃及', code: 'EGY', flag: '🇪🇬', group: 'G' },
  'IRN': { id: 'IRN', name: '伊朗', code: 'IRN', flag: '🇮🇷', group: 'G' },
  'NZL': { id: 'NZL', name: '新西兰', code: 'NZL', flag: '🇳🇿', group: 'G' },

  // Group H
  'CPV': { id: 'CPV', name: '佛得角', code: 'CPV', flag: '🇨🇻', group: 'H' },
  'ESP': { id: 'ESP', name: '西班牙', code: 'ESP', flag: '🇪🇸', group: 'H' },
  'KSA': { id: 'KSA', name: '沙特阿拉伯', code: 'KSA', flag: '🇸🇦', group: 'H' },
  'URU': { id: 'URU', name: '乌拉圭', code: 'URU', flag: '🇺🇾', group: 'H' },

  // Group I
  'FRA': { id: 'FRA', name: '法国', code: 'FRA', flag: '🇫🇷', group: 'I' },
  'IRQ': { id: 'IRQ', name: '伊拉克', code: 'IRQ', flag: '🇮🇶', group: 'I' },
  'NOR': { id: 'NOR', name: '挪威', code: 'NOR', flag: '🇳🇴', group: 'I' },
  'SEN': { id: 'SEN', name: '塞内加尔', code: 'SEN', flag: '🇸🇳', group: 'I' },

  // Group J
  'ALG': { id: 'ALG', name: '阿尔及利亚', code: 'ALG', flag: '🇩🇿', group: 'J' },
  'ARG': { id: 'ARG', name: '阿根廷', code: 'ARG', flag: '🇦🇷', group: 'J' },
  'AUT': { id: 'AUT', name: '奥地利', code: 'AUT', flag: '🇦🇹', group: 'J' },
  'JOR': { id: 'JOR', name: '约旦', code: 'JOR', flag: '🇯🇴', group: 'J' },

  // Group K
  'COD': { id: 'COD', name: '刚果民主共和国', code: 'COD', flag: '🇨🇩', group: 'K' },
  'COL': { id: 'COL', name: '哥伦比亚', code: 'COL', flag: '🇨🇴', group: 'K' },
  'POR': { id: 'POR', name: '葡萄牙', code: 'POR', flag: '🇵🇹', group: 'K' },
  'UZB': { id: 'UZB', name: '乌兹别克斯坦', code: 'UZB', flag: '🇺🇿', group: 'K' },

  // Group L
  'CRO': { id: 'CRO', name: '克罗地亚', code: 'CRO', flag: '🇭🇷', group: 'L' },
  'ENG': { id: 'ENG', name: '英格兰', code: 'ENG', flag: '🏳️', group: 'L' },
  'GHA': { id: 'GHA', name: '加纳', code: 'GHA', flag: '🇬🇭', group: 'L' },
  'PAN': { id: 'PAN', name: '巴拿马', code: 'PAN', flag: '🇵🇦', group: 'L' },

};

// Map of Groups A-L
export const GROUPS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L'];

// Create empty stats
const createDefaultStats = (): Match['stats'] => ({
  possession: [50, 50],
  shots: [10, 10],
  shotsOnTarget: [4, 4],
  fouls: [12, 12],
  corners: [5, 5],
  yellowCards: [1, 1],
  redCards: [0, 0]
});

// Empty initial matches — real data comes from GitHub API
export const INITIAL_MATCHES: Match[] = [];

// Initial scorers - fallback when no real data available
export const INITIAL_SCORERS: PlayerScorer[] = [
  { id: 's1', name: '梅西', teamId: 'ARG', teamName: '阿根廷', flag: '🇦🇷', goals: 5, assists: 3, penalties: 1, matchesPlayed: 3 },
  { id: 's2', name: '姆巴佩', teamId: 'FRA', teamName: '法国', flag: '🇫🇷', goals: 5, assists: 2, penalties: 0, matchesPlayed: 3 },
  { id: 's3', name: '哈兰德', teamId: 'NOR', teamName: '挪威', flag: '🇳🇴', goals: 4, assists: 1, penalties: 2, matchesPlayed: 3 },
  { id: 's4', name: '凯恩', teamId: 'ENG', teamName: '英格兰', flag: '🏳️', goals: 4, assists: 2, penalties: 1, matchesPlayed: 3 },
  { id: 's5', name: '内马尔', teamId: 'BRA', teamName: '巴西', flag: '🇧🇷', goals: 3, assists: 4, penalties: 0, matchesPlayed: 3 },
  { id: 's6', name: '萨拉赫', teamId: 'EGY', teamName: '埃及', flag: '🇪🇬', goals: 3, assists: 2, penalties: 0, matchesPlayed: 3 },
  { id: 's7', name: 'B费', teamId: 'POR', teamName: '葡萄牙', flag: '🇵🇹', goals: 3, assists: 3, penalties: 1, matchesPlayed: 3 },
  { id: 's8', name: '贝林厄姆', teamId: 'ENG', teamName: '英格兰', flag: '🏳️', goals: 3, assists: 2, penalties: 0, matchesPlayed: 3 },
  { id: 's9', name: '穆西亚拉', teamId: 'GER', teamName: '德国', flag: '🇩🇪', goals: 2, assists: 3, penalties: 0, matchesPlayed: 3 },
  { id: 's10', name: '维尼修斯', teamId: 'BRA', teamName: '巴西', flag: '🇧🇷', goals: 2, assists: 2, penalties: 0, matchesPlayed: 3 },
];

// Initial news - fallback when no real data available
export const INITIAL_NEWS: NewsItem[] = [
  {
    id: 'n1',
    title: '梅西加冕世界杯历史助攻王',
    summary: '阿根廷球星梅西在本届世界杯上创造了新的历史，成为世界杯历史助攻第一人。',
    content: '在阿根廷与尼日利亚的比赛中，梅西完成了他本届世界杯的第3次助攻，帮助球队锁定胜局。这也使他的世界杯助攻总数达到了10次，超越了马拉多纳和克洛泽，成为历史第一。',
    time: '1小时前',
    source: 'BBC中文网',
    tag: '战报',
    image: ''
  },
  {
    id: 'n2',
    title: '法国惊险晋级淘汰赛',
    summary: '法国队凭借姆巴佩的绝杀进球，以小组第二的身份晋级32强淘汰赛。',
    content: '小组赛最后一轮，法国队对阵挪威的比赛惊心动魄。姆巴佩在第89分钟打入绝杀球，帮助法国队以2-1战胜对手，成功晋级淘汰赛阶段。',
    time: '2小时前',
    source: 'ESPN',
    tag: '战报',
    image: ''
  },
  {
    id: 'n3',
    title: '英格兰大胜巴拿马，凯恩戴帽',
    summary: '英格兰队长哈里·凯恩在对阵巴拿马的比赛中上演帽子戏法。',
    content: '在一场实力悬殊的比赛中，英格兰队以6-0大胜巴拿马。队长凯恩表现出色，完成帽子戏法，目前以4球领跑射手榜。',
    time: '3小时前',
    source: '天空体育',
    tag: '战报',
    image: ''
  },
  {
    id: 'n4',
    title: '巴西队遭遇伤病危机',
    summary: '巴西队主力中卫在训练中受伤，可能缺席淘汰赛首轮。',
    content: '据巴西队医透露，主力中卫马尔基尼奥斯在训练中扭伤脚踝，将接受进一步检查。如果确诊伤势严重，他可能将缺席淘汰赛首轮比赛。',
    time: '5小时前',
    source: 'Goal.com',
    tag: '伤停',
    image: ''
  },
  {
    id: 'n5',
    title: '德国队战术调整初见成效',
    summary: '德国队在小组赛末轮改变战术，成功击败科特迪瓦。',
    content: '德国主教练弗里克在赛后表示，球队调整了压迫战术，穆西亚拉的位置更加灵活，这帮助球队创造了更多机会。德国队最终以3-1战胜科特迪瓦，顺利晋级。',
    time: '6小时前',
    source: '图片报',
    tag: '分析',
    image: ''
  },
];

// Knockout bracket nodes for 2026 World Cup (Round of 16 to Final)
// 2026 format: 32 teams in knockout → Round of 32 → Round of 16 → QF → SF → Final
// BracketTab currently displays R16, QF, SF, Final
export const BRACKET_NODES: KnockoutNode[] = [
  // Round of 16 (上半区 4 场)
  { id: 'R16-1', stage: 'Round of 16', label: '1/8决赛 1', nextMatchId: 'QF-1', placeholderHome: 'R32-1 胜者', placeholderAway: 'R32-2 胜者' },
  { id: 'R16-2', stage: 'Round of 16', label: '1/8决赛 2', nextMatchId: 'QF-1', placeholderHome: 'R32-3 胜者', placeholderAway: 'R32-4 胜者' },
  { id: 'R16-3', stage: 'Round of 16', label: '1/8决赛 3', nextMatchId: 'QF-2', placeholderHome: 'R32-5 胜者', placeholderAway: 'R32-6 胜者' },
  { id: 'R16-4', stage: 'Round of 16', label: '1/8决赛 4', nextMatchId: 'QF-2', placeholderHome: 'R32-7 胜者', placeholderAway: 'R32-8 胜者' },
  // Round of 16 (下半区 4 场)
  { id: 'R16-5', stage: 'Round of 16', label: '1/8决赛 5', nextMatchId: 'QF-3', placeholderHome: 'R32-9 胜者', placeholderAway: 'R32-10 胜者' },
  { id: 'R16-6', stage: 'Round of 16', label: '1/8决赛 6', nextMatchId: 'QF-3', placeholderHome: 'R32-11 胜者', placeholderAway: 'R32-12 胜者' },
  { id: 'R16-7', stage: 'Round of 16', label: '1/8决赛 7', nextMatchId: 'QF-4', placeholderHome: 'R32-13 胜者', placeholderAway: 'R32-14 胜者' },
  { id: 'R16-8', stage: 'Round of 16', label: '1/8决赛 8', nextMatchId: 'QF-4', placeholderHome: 'R32-15 胜者', placeholderAway: 'R32-16 胜者' },

  // Quarterfinals (上半区 2 场)
  { id: 'QF-1', stage: 'Quarterfinals', label: '1/4决赛 1', nextMatchId: 'SF-1', placeholderHome: 'R16-1 胜者', placeholderAway: 'R16-2 胜者' },
  { id: 'QF-2', stage: 'Quarterfinals', label: '1/4决赛 2', nextMatchId: 'SF-1', placeholderHome: 'R16-3 胜者', placeholderAway: 'R16-4 胜者' },
  // Quarterfinals (下半区 2 场)
  { id: 'QF-3', stage: 'Quarterfinals', label: '1/4决赛 3', nextMatchId: 'SF-2', placeholderHome: 'R16-5 胜者', placeholderAway: 'R16-6 胜者' },
  { id: 'QF-4', stage: 'Quarterfinals', label: '1/4决赛 4', nextMatchId: 'SF-2', placeholderHome: 'R16-7 胜者', placeholderAway: 'R16-8 胜者' },

  // Semifinals
  { id: 'SF-1', stage: 'Semifinals', label: '半决赛 1', nextMatchId: 'F', placeholderHome: 'QF-1 胜者', placeholderAway: 'QF-2 胜者' },
  { id: 'SF-2', stage: 'Semifinals', label: '半决赛 2', nextMatchId: 'F', placeholderHome: 'QF-3 胜者', placeholderAway: 'QF-4 胜者' },

  // Final
  { id: 'F', stage: 'Final', label: '冠军决赛', placeholderHome: 'SF-1 胜者', placeholderAway: 'SF-2 胜者' },
];

// Mock knockout match details (all scheduled initially)
export const MOCK_KNOCKOUT_MATCHES: Record<string, {
  home: string;
  away: string;
  homeScore: number;
  awayScore: number;
  status: 'Scheduled' | 'Live' | 'Completed';
}> = {};

