/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Team, Match, PlayerScorer, NewsItem, KnockoutNode } from '../types';

// 48 Teams for World Cup 2026 (Groups A to L)
export const TEAMS: Record<string, Team> = {
  // Group A
  'USA': { id: 'USA', name: '美国', code: 'USA', flag: '🇺🇸', group: 'A' },
  'COL': { id: 'COL', name: '哥伦比亚', code: 'COL', flag: '🇨🇴', group: 'A' },
  'MAR': { id: 'MAR', name: '摩洛哥', code: 'MAR', flag: '🇲🇦', group: 'A' },
  'NZL': { id: 'NZL', name: '新西兰', code: 'NZL', flag: '🇳🇿', group: 'A' },

  // Group B
  'CAN': { id: 'CAN', name: '加拿大', code: 'CAN', flag: '🇨🇦', group: 'B' },
  'POR': { id: 'POR', name: '葡萄牙', code: 'POR', flag: '🇵🇹', group: 'B' },
  'KOR': { id: 'KOR', name: '韩国', code: 'KOR', flag: '🇰🇷', group: 'B' },
  'MLI': { id: 'MLI', name: '马里', code: 'MLI', flag: '🇲🇱', group: 'B' },

  // Group C
  'MEX': { id: 'MEX', name: '墨西哥', code: 'MEX', flag: '🇲🇽', group: 'C' },
  'GER': { id: 'GER', name: '德国', code: 'GER', flag: '🇩🇪', group: 'C' },
  'JPN': { id: 'JPN', name: '日本', code: 'JPN', flag: '🇯🇵', group: 'C' },
  'ECU': { id: 'ECU', name: '厄瓜多尔', code: 'ECU', flag: '🇪🇨', group: 'C' },

  // Group D
  'ARG': { id: 'ARG', name: '阿根廷', code: 'ARG', flag: '🇦🇷', group: 'D' },
  'POL': { id: 'POL', name: '波兰', code: 'POL', flag: '🇵🇱', group: 'D' },
  'EGY': { id: 'EGY', name: '埃及', code: 'EGY', flag: '🇪🇬', group: 'D' },
  'AUS': { id: 'AUS', name: '澳大利亚', code: 'AUS', flag: '🇦🇺', group: 'D' },

  // Group E
  'BRA': { id: 'BRA', name: '巴西', code: 'BRA', flag: '🇧🇷', group: 'E' },
  'NED': { id: 'NED', name: '荷兰', code: 'NED', flag: '🇳🇱', group: 'E' },
  'KSA': { id: 'KSA', name: '沙特阿拉伯', code: 'KSA', flag: '🇸🇦', group: 'E' },
  'CMR': { id: 'CMR', name: '喀麦隆', code: 'CMR', flag: '🇨🇲', group: 'E' },

  // Group F
  'FRA': { id: 'FRA', name: '法国', code: 'FRA', flag: '🇫🇷', group: 'F' },
  'SUI': { id: 'SUI', name: '瑞士', code: 'SUI', flag: '🇨🇭', group: 'F' },
  'NGA': { id: 'NGA', name: '尼日利亚', code: 'NGA', flag: '🇳🇬', group: 'F' },
  'PER': { id: 'PER', name: '秘鲁', code: 'PER', flag: '🇵🇪', group: 'F' },

  // Group G
  'ENG': { id: 'ENG', name: '英格兰', code: 'ENG', flag: '🇬🇧', group: 'G' },
  'URU': { id: 'URU', name: '乌拉圭', code: 'URU', flag: '🇺🇾', group: 'G' },
  'IRN': { id: 'IRN', name: '伊朗', code: 'IRN', flag: '🇮🇷', group: 'G' },
  'SEN': { id: 'SEN', name: '塞内加尔', code: 'SEN', flag: '🇸🇳', group: 'G' },

  // Group H
  'ESP': { id: 'ESP', name: '西班牙', code: 'ESP', flag: '🇪🇸', group: 'H' },
  'CRO': { id: 'CRO', name: '克罗地亚', code: 'CRO', flag: '🇭🇷', group: 'H' },
  'CRC': { id: 'CRC', name: '哥斯达黎加', code: 'CRC', flag: '🇨🇷', group: 'H' },
  'ALG': { id: 'ALG', name: '阿尔及利亚', code: 'ALG', flag: '🇩🇿', group: 'H' },

  // Group I
  'ITA': { id: 'ITA', name: '意大利', code: 'ITA', flag: '🇮🇹', group: 'I' },
  'DEN': { id: 'DEN', name: '丹麦', code: 'DEN', flag: '🇩🇰', group: 'I' },
  'UKR': { id: 'UKR', name: '乌克兰', code: 'UKR', flag: '🇺🇦', group: 'I' },
  'CHI': { id: 'CHI', name: '智利', code: 'CHI', flag: '🇨🇱', group: 'I' },

  // Group J
  'BEL': { id: 'BEL', name: '比利时', code: 'BEL', flag: '🇧🇪', group: 'J' },
  'SWE': { id: 'SWE', name: '瑞典', code: 'SWE', flag: '🇸🇪', group: 'J' },
  'SRB': { id: 'SRB', name: '塞尔维亚', code: 'SRB', flag: '🇷🇸', group: 'J' },
  'TUN': { id: 'TUN', name: '突尼斯', code: 'TUN', flag: '🇹🇳', group: 'J' },

  // Group K
  'AUT': { id: 'AUT', name: '奥地利', code: 'AUT', flag: '🇦🇹', group: 'K' },
  'TUR': { id: 'TUR', name: '土耳其', code: 'TUR', flag: '🇹🇷', group: 'K' },
  'RSA': { id: 'RSA', name: '南非', code: 'RSA', flag: '🇿🇦', group: 'K' },
  'PAN': { id: 'PAN', name: '巴拿马', code: 'PAN', flag: '🇵🇦', group: 'K' },

  // Group L
  'NOR': { id: 'NOR', name: '挪威', code: 'NOR', flag: '🇳🇴', group: 'L' },
  'WAL': { id: 'WAL', name: '威尔士', code: 'WAL', flag: '🏴󠁧󠁢󠁷󠁬󠁳󠁿', group: 'L' },
  'IRQ': { id: 'IRQ', name: '伊拉克', code: 'IRQ', flag: '🇮🇶', group: 'L' },
  'CIV': { id: 'CIV', name: '科特迪瓦', code: 'CIV', flag: '🇨🇮', group: 'L' },
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

// Matches list (A-H complete, I-L in progress/scheduled for June 25, 2026)
export const INITIAL_MATCHES: Match[] = [
  // --- GROUP A ---
  {
    id: 'MA-1', stage: 'Group', group: 'A', homeTeamId: 'USA', awayTeamId: 'NZL',
    homeScore: 3, awayScore: 0, status: 'Completed', date: '2026-06-11', time: '17:00',
    stadium: 'Azteca Stadium', city: 'Mexico City', events: [
      { id: 'ev-1', minute: 14, type: 'goal', teamId: 'USA', playerName: 'Pulisic', detail: '点球' },
      { id: 'ev-2', minute: 42, type: 'goal', teamId: 'USA', playerName: 'Balogun', detail: 'Weah 助攻' },
      { id: 'ev-3', minute: 78, type: 'goal', teamId: 'USA', playerName: 'Reyna' }
    ], stats: { possession: [62, 38], shots: [17, 5], shotsOnTarget: [8, 1], fouls: [8, 14], corners: [7, 2], yellowCards: [1, 3], redCards: [0, 0] }
  },
  {
    id: 'MA-2', stage: 'Group', group: 'A', homeTeamId: 'COL', awayTeamId: 'MAR',
    homeScore: 1, awayScore: 1, status: 'Completed', date: '2026-06-12', time: '14:00',
    stadium: 'SoFi Stadium', city: 'Los Angeles', events: [
      { id: 'ev-4', minute: 29, type: 'goal', teamId: 'MAR', playerName: 'En-Nesyri' },
      { id: 'ev-5', minute: 67, type: 'goal', teamId: 'COL', playerName: 'Luis Diaz' }
    ], stats: { possession: [48, 52], shots: [12, 11], shotsOnTarget: [4, 4], fouls: [15, 13], corners: [4, 6], yellowCards: [2, 2], redCards: [0, 0] }
  },
  {
    id: 'MA-3', stage: 'Group', group: 'A', homeTeamId: 'USA', awayTeamId: 'COL',
    homeScore: 2, awayScore: 1, status: 'Completed', date: '2026-06-16', time: '20:00',
    stadium: 'MetLife Stadium', city: 'East Rutherford', events: [
      { id: 'ev-6', minute: 34, type: 'goal', teamId: 'USA', playerName: 'Pulisic' },
      { id: 'ev-7', minute: 55, type: 'goal', teamId: 'COL', playerName: 'Durán' },
      { id: 'ev-8', minute: 89, type: 'goal', teamId: 'USA', playerName: 'McKennie' }
    ], stats: { possession: [45, 55], shots: [11, 14], shotsOnTarget: [5, 6], fouls: [14, 11], corners: [3, 8], yellowCards: [3, 2], redCards: [0, 0] }
  },
  {
    id: 'MA-4', stage: 'Group', group: 'A', homeTeamId: 'MAR', awayTeamId: 'NZL',
    homeScore: 2, awayScore: 0, status: 'Completed', date: '2026-06-17', time: '13:00',
    stadium: 'Lumen Field', city: 'Seattle', events: [
      { id: 'ev-9', minute: 41, type: 'goal', teamId: 'MAR', playerName: 'Ziyech' },
      { id: 'ev-10', minute: 82, type: 'goal', teamId: 'MAR', playerName: 'Diaz (Brahim)' }
    ], stats: { possession: [58, 42], shots: [15, 6], shotsOnTarget: [6, 2], fouls: [10, 11], corners: [6, 3], yellowCards: [1, 2], redCards: [0, 0] }
  },
  {
    id: 'MA-5', stage: 'Group', group: 'A', homeTeamId: 'MAR', awayTeamId: 'USA',
    homeScore: 1, awayScore: 2, status: 'Completed', date: '2026-06-21', time: '18:00',
    stadium: 'Hard Rock Stadium', city: 'Miami', events: [
      { id: 'ev-11', minute: 19, type: 'goal', teamId: 'USA', playerName: 'Aaronson' },
      { id: 'ev-12', minute: 45, type: 'goal', teamId: 'MAR', playerName: 'Hakimi' },
      { id: 'ev-13', minute: 73, type: 'goal', teamId: 'USA', playerName: 'Pulisic' }
    ], stats: { possession: [51, 49], shots: [13, 11], shotsOnTarget: [5, 6], fouls: [12, 10], corners: [5, 4], yellowCards: [2, 1], redCards: [0, 0] }
  },
  {
    id: 'MA-6', stage: 'Group', group: 'A', homeTeamId: 'NZL', awayTeamId: 'COL',
    homeScore: 0, awayScore: 4, status: 'Completed', date: '2026-06-21', time: '18:00',
    stadium: 'Mercedes-Benz Stadium', city: 'Atlanta', events: [
      { id: 'ev-14', minute: 8, type: 'goal', teamId: 'COL', playerName: 'Luis Diaz' },
      { id: 'ev-15', minute: 31, type: 'goal', teamId: 'COL', playerName: 'James Rodriguez' },
      { id: 'ev-16', minute: 64, type: 'goal', teamId: 'COL', playerName: 'Sinisterra' },
      { id: 'ev-17', minute: 85, type: 'goal', teamId: 'COL', playerName: 'Duran' }
    ], stats: { possession: [32, 68], shots: [4, 22], shotsOnTarget: [1, 12], fouls: [11, 8], corners: [1, 10], yellowCards: [2, 0], redCards: [0, 0] }
  },

  // --- GROUP B ---
  {
    id: 'MB-1', stage: 'Group', group: 'B', homeTeamId: 'CAN', awayTeamId: 'MLI',
    homeScore: 2, awayScore: 1, status: 'Completed', date: '2026-06-12', time: '17:00',
    stadium: 'BC Place', city: 'Vancouver', events: [
      { id: 'ev-18', minute: 38, type: 'goal', teamId: 'CAN', playerName: 'David' },
      { id: 'ev-19', minute: 61, type: 'goal', teamId: 'MLI', playerName: 'Doucoure' },
      { id: 'ev-20', minute: 88, type: 'goal', teamId: 'CAN', playerName: 'Davies' }
    ], stats: { possession: [55, 45], shots: [12, 9], shotsOnTarget: [6, 3], fouls: [12, 14], corners: [5, 4], yellowCards: [1, 3], redCards: [0, 0] }
  },
  {
    id: 'MB-2', stage: 'Group', group: 'B', homeTeamId: 'POR', awayTeamId: 'KOR',
    homeScore: 2, awayScore: 1, status: 'Completed', date: '2026-06-13', time: '15:00',
    stadium: 'Gillette Stadium', city: 'Boston', events: [
      { id: 'ev-21', minute: 15, type: 'goal', teamId: 'POR', playerName: 'Leao' },
      { id: 'ev-22', minute: 49, type: 'goal', teamId: 'KOR', playerName: 'Son Heung-min' },
      { id: 'ev-23', minute: 75, type: 'goal', teamId: 'POR', playerName: 'Bruno Fernandes' }
    ], stats: { possession: [59, 41], shots: [16, 10], shotsOnTarget: [7, 4], fouls: [9, 11], corners: [8, 3], yellowCards: [1, 1], redCards: [0, 0] }
  },
  {
    id: 'MB-3', stage: 'Group', group: 'B', homeTeamId: 'CAN', awayTeamId: 'POR',
    homeScore: 1, awayScore: 3, status: 'Completed', date: '2026-06-17', time: '19:00',
    stadium: 'BMO Field', city: 'Toronto', events: [
      { id: 'ev-24', minute: 22, type: 'goal', teamId: 'POR', playerName: 'Ramos' },
      { id: 'ev-25', minute: 44, type: 'goal', teamId: 'POR', playerName: 'Bernardo Silva' },
      { id: 'ev-26', minute: 68, type: 'goal', teamId: 'CAN', playerName: 'Larin' },
      { id: 'ev-27', minute: 81, type: 'goal', teamId: 'POR', playerName: 'Ronaldo' }
    ], stats: { possession: [44, 56], shots: [8, 18], shotsOnTarget: [3, 9], fouls: [13, 10], corners: [4, 7], yellowCards: [2, 1], redCards: [0, 0] }
  },
  {
    id: 'MB-4', stage: 'Group', group: 'B', homeTeamId: 'KOR', awayTeamId: 'MLI',
    homeScore: 1, awayScore: 0, status: 'Completed', date: '2026-06-18', time: '14:00',
    stadium: 'Levi Stadium', city: 'Santa Clara', events: [
      { id: 'ev-28', minute: 58, type: 'goal', teamId: 'KOR', playerName: 'Lee Kang-in' }
    ], stats: { possession: [52, 48], shots: [11, 8], shotsOnTarget: [4, 2], fouls: [11, 15], corners: [6, 4], yellowCards: [1, 4], redCards: [0, 0] }
  },
  {
    id: 'MB-5', stage: 'Group', group: 'B', homeTeamId: 'KOR', awayTeamId: 'CAN',
    homeScore: 2, awayScore: 2, status: 'Completed', date: '2026-06-22', time: '15:00',
    stadium: 'AT&T Stadium', city: 'Dallas', events: [
      { id: 'ev-29', minute: 12, type: 'goal', teamId: 'KOR', playerName: 'Hwang Hee-chan' },
      { id: 'ev-30', minute: 35, type: 'goal', teamId: 'CAN', playerName: 'David' },
      { id: 'ev-31', minute: 71, type: 'goal', teamId: 'CAN', playerName: 'Buchanan' },
      { id: 'ev-32', minute: 87, type: 'goal', teamId: 'KOR', playerName: 'Son Heung-min' }
    ], stats: { possession: [49, 51], shots: [13, 14], shotsOnTarget: [6, 5], fouls: [10, 12], corners: [5, 5], yellowCards: [1, 2], redCards: [0, 0] }
  },
  {
    id: 'MB-6', stage: 'Group', group: 'B', homeTeamId: 'MLI', awayTeamId: 'POR',
    homeScore: 0, awayScore: 4, status: 'Completed', date: '2026-06-22', time: '15:00',
    stadium: 'NRG Stadium', city: 'Houston', events: [
      { id: 'ev-33', minute: 9, type: 'goal', teamId: 'POR', playerName: 'Ramos' },
      { id: 'ev-34', minute: 28, type: 'goal', teamId: 'POR', playerName: 'Joao Felix' },
      { id: 'ev-35', minute: 61, type: 'goal', teamId: 'POR', playerName: 'Ronaldo' },
      { id: 'ev-36', minute: 79, type: 'goal', teamId: 'POR', playerName: 'Jota' }
    ], stats: { possession: [35, 65], shots: [5, 20], shotsOnTarget: [1, 11], fouls: [13, 8], corners: [2, 9], yellowCards: [3, 0], redCards: [0, 0] }
  },

  // --- GROUP C ---
  {
    id: 'MC-1', stage: 'Group', group: 'C', homeTeamId: 'MEX', awayTeamId: 'ECU',
    homeScore: 2, awayScore: 1, status: 'Completed', date: '2026-06-11', time: '20:00',
    stadium: 'Estadio BBVA', city: 'Monterrey', events: [
      { id: 'ev-37', minute: 31, type: 'goal', teamId: 'MEX', playerName: 'Gimenez' },
      { id: 'ev-38', minute: 52, type: 'goal', teamId: 'ECU', playerName: 'Valencia' },
      { id: 'ev-39', minute: 84, type: 'goal', teamId: 'MEX', playerName: 'Chavez' }
    ], stats: { possession: [54, 46], shots: [14, 10], shotsOnTarget: [5, 3], fouls: [11, 14], corners: [6, 4], yellowCards: [2, 3], redCards: [0, 0] }
  },
  {
    id: 'MC-2', stage: 'Group', group: 'C', homeTeamId: 'GER', awayTeamId: 'JPN',
    homeScore: 2, awayScore: 2, status: 'Completed', date: '2026-06-13', time: '18:00',
    stadium: 'Lincoln Financial Field', city: 'Philadelphia', events: [
      { id: 'ev-40', minute: 22, type: 'goal', teamId: 'GER', playerName: 'Musiala' },
      { id: 'ev-41', minute: 40, type: 'goal', teamId: 'JPN', playerName: 'Mitoma' },
      { id: 'ev-42', minute: 68, type: 'goal', teamId: 'GER', playerName: 'Fullkrug' },
      { id: 'ev-43', minute: 85, type: 'goal', teamId: 'JPN', playerName: 'Kubo' }
    ], stats: { possession: [57, 43], shots: [15, 12], shotsOnTarget: [6, 5], fouls: [10, 11], corners: [7, 4], yellowCards: [1, 2], redCards: [0, 0] }
  },
  {
    id: 'MC-3', stage: 'Group', group: 'C', homeTeamId: 'MEX', awayTeamId: 'GER',
    homeScore: 1, awayScore: 3, status: 'Completed', date: '2026-06-18', time: '17:00',
    stadium: 'Estadio Akron', city: 'Guadalajara', events: [
      { id: 'ev-44', minute: 18, type: 'goal', teamId: 'GER', playerName: 'Havertz' },
      { id: 'ev-45', minute: 42, type: 'goal', teamId: 'GER', playerName: 'Wirtz' },
      { id: 'ev-46', minute: 59, type: 'goal', teamId: 'MEX', playerName: 'Lozano' },
      { id: 'ev-47', minute: 76, type: 'goal', teamId: 'GER', playerName: 'Musiala' }
    ], stats: { possession: [46, 54], shots: [10, 16], shotsOnTarget: [4, 7], fouls: [12, 9], corners: [3, 6], yellowCards: [2, 1], redCards: [0, 0] }
  },
  {
    id: 'MC-4', stage: 'Group', group: 'C', homeTeamId: 'JPN', awayTeamId: 'ECU',
    homeScore: 2, awayScore: 0, status: 'Completed', date: '2026-06-18', time: '20:00',
    stadium: 'Arrowhead Stadium', city: 'Kansas City', events: [
      { id: 'ev-48', minute: 34, type: 'goal', teamId: 'JPN', playerName: 'Asano' },
      { id: 'ev-49', minute: 71, type: 'goal', teamId: 'JPN', playerName: 'Kamada' }
    ], stats: { possession: [51, 49], shots: [12, 10], shotsOnTarget: [5, 3], fouls: [9, 13], corners: [5, 5], yellowCards: [1, 2], redCards: [0, 0] }
  },
  {
    id: 'MC-5', stage: 'Group', group: 'C', homeTeamId: 'JPN', awayTeamId: 'MEX',
    homeScore: 1, awayScore: 1, status: 'Completed', date: '2026-06-23', time: '20:00',
    stadium: 'MetLife Stadium', city: 'East Rutherford', events: [
      { id: 'ev-50', minute: 26, type: 'goal', teamId: 'JPN', playerName: 'Minamino' },
      { id: 'ev-51', minute: 80, type: 'goal', teamId: 'MEX', playerName: 'Martin' }
    ], stats: { possession: [48, 52], shots: [11, 13], shotsOnTarget: [4, 5], fouls: [14, 11], corners: [4, 7], yellowCards: [3, 2], redCards: [0, 0] }
  },
  {
    id: 'MC-6', stage: 'Group', group: 'C', homeTeamId: 'ECU', awayTeamId: 'GER',
    homeScore: 0, awayScore: 2, status: 'Completed', date: '2026-06-23', time: '20:00',
    stadium: 'Lincoln Financial Field', city: 'Philadelphia', events: [
      { id: 'ev-52', minute: 15, type: 'goal', teamId: 'GER', playerName: 'Wirtz' },
      { id: 'ev-53', minute: 62, type: 'goal', teamId: 'GER', playerName: 'Sane' }
    ], stats: { possession: [41, 59], shots: [7, 15], shotsOnTarget: [2, 6], fouls: [11, 8], corners: [2, 7], yellowCards: [1, 1], redCards: [0, 0] }
  },

  // --- GROUP D ---
  {
    id: 'MD-1', stage: 'Group', group: 'D', homeTeamId: 'ARG', awayTeamId: 'AUS',
    homeScore: 2, awayScore: 0, status: 'Completed', date: '2026-06-13', time: '12:00',
    stadium: 'Hard Rock Stadium', city: 'Miami', events: [
      { id: 'ev-54', minute: 32, type: 'goal', teamId: 'ARG', playerName: 'Messi', detail: '任意球' },
      { id: 'ev-55', minute: 67, type: 'goal', teamId: 'ARG', playerName: 'Alvarez', detail: 'Mac Allister 助攻' }
    ], stats: { possession: [64, 36], shots: [15, 6], shotsOnTarget: [7, 1], fouls: [10, 14], corners: [8, 3], yellowCards: [1, 3], redCards: [0, 0] }
  },
  {
    id: 'MD-2', stage: 'Group', group: 'D', homeTeamId: 'POL', awayTeamId: 'EGY',
    homeScore: 2, awayScore: 2, status: 'Completed', date: '2026-06-14', time: '14:00',
    stadium: 'Mercedes-Benz Stadium', city: 'Atlanta', events: [
      { id: 'ev-56', minute: 19, type: 'goal', teamId: 'EGY', playerName: 'Salah' },
      { id: 'ev-57', minute: 42, type: 'goal', teamId: 'POL', playerName: 'Lewandowski' },
      { id: 'ev-58', minute: 61, type: 'goal', teamId: 'POL', playerName: 'Zielinski' },
      { id: 'ev-59', minute: 88, type: 'goal', teamId: 'EGY', playerName: 'Mostafa Mohamed' }
    ], stats: { possession: [51, 49], shots: [13, 12], shotsOnTarget: [5, 5], fouls: [12, 11], corners: [5, 6], yellowCards: [2, 1], redCards: [0, 0] }
  },
  {
    id: 'MD-3', stage: 'Group', group: 'D', homeTeamId: 'ARG', awayTeamId: 'POL',
    homeScore: 3, awayScore: 1, status: 'Completed', date: '2026-06-19', time: '18:00',
    stadium: 'SoFi Stadium', city: 'Los Angeles', events: [
      { id: 'ev-60', minute: 28, type: 'goal', teamId: 'ARG', playerName: 'Lautaro Martinez' },
      { id: 'ev-61', minute: 51, type: 'goal', teamId: 'POL', playerName: 'Lewandowski' },
      { id: 'ev-62', minute: 74, type: 'goal', teamId: 'ARG', playerName: 'Messi' },
      { id: 'ev-63', minute: 85, type: 'goal', teamId: 'ARG', playerName: 'Fernandez' }
    ], stats: { possession: [60, 40], shots: [18, 9], shotsOnTarget: [8, 3], fouls: [9, 13], corners: [9, 3], yellowCards: [1, 2], redCards: [0, 0] }
  },
  {
    id: 'MD-4', stage: 'Group', group: 'D', homeTeamId: 'EGY', awayTeamId: 'AUS',
    homeScore: 1, awayScore: 1, status: 'Completed', date: '2026-06-19', time: '21:00',
    stadium: 'Levi Stadium', city: 'Santa Clara', events: [
      { id: 'ev-64', minute: 45, type: 'goal', teamId: 'EGY', playerName: 'Salah' },
      { id: 'ev-65', minute: 79, type: 'goal', teamId: 'AUS', playerName: 'Duke' }
    ], stats: { possession: [53, 47], shots: [11, 10], shotsOnTarget: [4, 4], fouls: [10, 12], corners: [6, 4], yellowCards: [1, 2], redCards: [0, 0] }
  },
  {
    id: 'MD-5', stage: 'Group', group: 'D', homeTeamId: 'EGY', awayTeamId: 'ARG',
    homeScore: 0, awayScore: 2, status: 'Completed', date: '2026-06-23', time: '16:00',
    stadium: 'AT&T Stadium', city: 'Dallas', events: [
      { id: 'ev-66', minute: 24, type: 'goal', teamId: 'ARG', playerName: 'Alvarez' },
      { id: 'ev-67', minute: 69, type: 'goal', teamId: 'ARG', playerName: 'Messi' }
    ], stats: { possession: [42, 58], shots: [8, 16], shotsOnTarget: [2, 6], fouls: [13, 9], corners: [3, 8], yellowCards: [2, 1], redCards: [0, 0] }
  },
  {
    id: 'MD-6', stage: 'Group', group: 'D', homeTeamId: 'AUS', awayTeamId: 'POL',
    homeScore: 1, awayScore: 2, status: 'Completed', date: '2026-06-23', time: '16:00',
    stadium: 'NRG Stadium', city: 'Houston', events: [
      { id: 'ev-68', minute: 31, type: 'goal', teamId: 'POL', playerName: 'Szymanski' },
      { id: 'ev-69', minute: 56, type: 'goal', teamId: 'AUS', playerName: 'Boyle' },
      { id: 'ev-70', minute: 82, type: 'goal', teamId: 'POL', playerName: 'Lewandowski' }
    ], stats: { possession: [46, 54], shots: [10, 14], shotsOnTarget: [4, 6], fouls: [12, 11], corners: [4, 6], yellowCards: [2, 1], redCards: [0, 0] }
  },

  // --- GROUP E ---
  {
    id: 'ME-1', stage: 'Group', group: 'E', homeTeamId: 'BRA', awayTeamId: 'CMR',
    homeScore: 3, awayScore: 1, status: 'Completed', date: '2026-06-14', time: '17:00',
    stadium: 'Hard Rock Stadium', city: 'Miami', events: [
      { id: 'ev-71', minute: 15, type: 'goal', teamId: 'BRA', playerName: 'Vinicius Jr' },
      { id: 'ev-72', minute: 42, type: 'goal', teamId: 'CMR', playerName: 'Aboubakar' },
      { id: 'ev-73', minute: 58, type: 'goal', teamId: 'BRA', playerName: 'Rodrygo' },
      { id: 'ev-74', minute: 83, type: 'goal', teamId: 'BRA', playerName: 'Endrick' }
    ], stats: { possession: [61, 39], shots: [19, 8], shotsOnTarget: [9, 3], fouls: [10, 15], corners: [8, 2], yellowCards: [1, 3], redCards: [0, 0] }
  },
  {
    id: 'ME-2', stage: 'Group', group: 'E', homeTeamId: 'NED', awayTeamId: 'KSA',
    homeScore: 2, awayScore: 0, status: 'Completed', date: '2026-06-15', time: '14:00',
    stadium: 'MetLife Stadium', city: 'East Rutherford', events: [
      { id: 'ev-75', minute: 29, type: 'goal', teamId: 'NED', playerName: 'Gakpo' },
      { id: 'ev-76', minute: 76, type: 'goal', teamId: 'NED', playerName: 'Depay' }
    ], stats: { possession: [58, 42], shots: [14, 7], shotsOnTarget: [6, 2], fouls: [11, 10], corners: [7, 3], yellowCards: [1, 2], redCards: [0, 0] }
  },
  {
    id: 'ME-3', stage: 'Group', group: 'E', homeTeamId: 'BRA', awayTeamId: 'NED',
    homeScore: 2, awayScore: 2, status: 'Completed', date: '2026-06-20', time: '20:00',
    stadium: 'SoFi Stadium', city: 'Los Angeles', events: [
      { id: 'ev-77', minute: 21, type: 'goal', teamId: 'NED', playerName: 'Simons' },
      { id: 'ev-78', minute: 44, type: 'goal', teamId: 'BRA', playerName: 'Vinicius Jr' },
      { id: 'ev-79', minute: 68, type: 'goal', teamId: 'BRA', playerName: 'Neymar' },
      { id: 'ev-80', minute: 88, type: 'goal', teamId: 'NED', playerName: 'Weghorst' }
    ], stats: { possession: [52, 48], shots: [15, 13], shotsOnTarget: [6, 5], fouls: [13, 14], corners: [5, 6], yellowCards: [2, 3], redCards: [0, 0] }
  },
  {
    id: 'ME-4', stage: 'Group', group: 'E', homeTeamId: 'KSA', awayTeamId: 'CMR',
    homeScore: 1, awayScore: 2, status: 'Completed', date: '2026-06-20', time: '13:00',
    stadium: 'Mercedes-Benz Stadium', city: 'Atlanta', events: [
      { id: 'ev-81', minute: 30, type: 'goal', teamId: 'CMR', playerName: 'Anguissa' },
      { id: 'ev-82', minute: 61, type: 'goal', teamId: 'KSA', playerName: 'Al-Dawsari' },
      { id: 'ev-83', minute: 81, type: 'goal', teamId: 'CMR', playerName: 'Mbeumo' }
    ], stats: { possession: [50, 50], shots: [10, 14], shotsOnTarget: [4, 6], fouls: [12, 13], corners: [4, 7], yellowCards: [2, 2], redCards: [0, 0] }
  },
  {
    id: 'ME-5', stage: 'Group', group: 'E', homeTeamId: 'KSA', awayTeamId: 'BRA',
    homeScore: 0, awayScore: 3, status: 'Completed', date: '2026-06-24', time: '18:00',
    stadium: 'Lumen Field', city: 'Seattle', events: [
      { id: 'ev-84', minute: 18, type: 'goal', teamId: 'BRA', playerName: 'Rodrygo' },
      { id: 'ev-85', minute: 40, type: 'goal', teamId: 'BRA', playerName: 'Martinelli' },
      { id: 'ev-86', minute: 75, type: 'goal', teamId: 'BRA', playerName: 'Endrick' }
    ], stats: { possession: [38, 62], shots: [6, 18], shotsOnTarget: [1, 9], fouls: [11, 8], corners: [3, 8], yellowCards: [2, 0], redCards: [0, 0] }
  },
  {
    id: 'ME-6', stage: 'Group', group: 'E', homeTeamId: 'CMR', awayTeamId: 'NED',
    homeScore: 0, awayScore: 2, status: 'Completed', date: '2026-06-24', time: '18:00',
    stadium: 'Gillette Stadium', city: 'Boston', events: [
      { id: 'ev-87', minute: 34, type: 'goal', teamId: 'NED', playerName: 'Gakpo' },
      { id: 'ev-88', minute: 70, type: 'goal', teamId: 'NED', playerName: 'Malen' }
    ], stats: { possession: [42, 58], shots: [8, 15], shotsOnTarget: [3, 7], fouls: [14, 11], corners: [2, 6], yellowCards: [3, 1], redCards: [0, 0] }
  },

  // --- GROUP F ---
  {
    id: 'MF-1', stage: 'Group', group: 'F', homeTeamId: 'FRA', awayTeamId: 'PER',
    homeScore: 3, awayScore: 0, status: 'Completed', date: '2026-06-14', time: '20:00',
    stadium: 'Arrowhead Stadium', city: 'Kansas City', events: [
      { id: 'ev-89', minute: 22, type: 'goal', teamId: 'FRA', playerName: 'Mbappe' },
      { id: 'ev-90', minute: 48, type: 'goal', teamId: 'FRA', playerName: 'Griezmann' },
      { id: 'ev-91', minute: 75, type: 'goal', teamId: 'FRA', playerName: 'Mbappe' }
    ], stats: { possession: [60, 40], shots: [16, 5], shotsOnTarget: [8, 1], fouls: [9, 12], corners: [7, 2], yellowCards: [1, 2], redCards: [0, 0] }
  },
  {
    id: 'MF-2', stage: 'Group', group: 'F', homeTeamId: 'SUI', awayTeamId: 'NGA',
    homeScore: 1, awayScore: 1, status: 'Completed', date: '2026-06-15', time: '17:00',
    stadium: 'Lincoln Financial Field', city: 'Philadelphia', events: [
      { id: 'ev-92', minute: 28, type: 'goal', teamId: 'NGA', playerName: 'Osimhen' },
      { id: 'ev-93', minute: 63, type: 'goal', teamId: 'SUI', playerName: 'Embolo' }
    ], stats: { possession: [51, 49], shots: [12, 11], shotsOnTarget: [4, 4], fouls: [12, 14], corners: [5, 5], yellowCards: [1, 2], redCards: [0, 0] }
  },
  {
    id: 'MF-3', stage: 'Group', group: 'F', homeTeamId: 'FRA', awayTeamId: 'SUI',
    homeScore: 2, awayScore: 0, status: 'Completed', date: '2026-06-20', time: '16:00',
    stadium: 'MetLife Stadium', city: 'East Rutherford', events: [
      { id: 'ev-94', minute: 40, type: 'goal', teamId: 'FRA', playerName: 'Mbappe' },
      { id: 'ev-95', minute: 82, type: 'goal', teamId: 'FRA', playerName: 'Thuram' }
    ], stats: { possession: [56, 44], shots: [14, 8], shotsOnTarget: [6, 2], fouls: [10, 11], corners: [6, 3], yellowCards: [1, 1], redCards: [0, 0] }
  },
  {
    id: 'MF-4', stage: 'Group', group: 'F', homeTeamId: 'NGA', awayTeamId: 'PER',
    homeScore: 2, awayScore: 1, status: 'Completed', date: '2026-06-20', time: '19:00',
    stadium: 'Levi Stadium', city: 'Santa Clara', events: [
      { id: 'ev-96', minute: 15, type: 'goal', teamId: 'NGA', playerName: 'Lookman' },
      { id: 'ev-97', minute: 54, type: 'goal', teamId: 'PER', playerName: 'Lapadula' },
      { id: 'ev-98', minute: 77, type: 'goal', teamId: 'NGA', playerName: 'Osimhen' }
    ], stats: { possession: [48, 52], shots: [13, 10], shotsOnTarget: [6, 3], fouls: [15, 13], corners: [4, 5], yellowCards: [3, 2], redCards: [0, 0] }
  },
  {
    id: 'MF-5', stage: 'Group', group: 'F', homeTeamId: 'NGA', awayTeamId: 'FRA',
    homeScore: 1, awayScore: 2, status: 'Completed', date: '2026-06-24', time: '21:00',
    stadium: 'AT&T Stadium', city: 'Dallas', events: [
      { id: 'ev-99', minute: 14, type: 'goal', teamId: 'NGA', playerName: 'Osimhen' },
      { id: 'ev-100', minute: 42, type: 'goal', teamId: 'FRA', playerName: 'Mbappe' },
      { id: 'ev-101', minute: 68, type: 'goal', teamId: 'FRA', playerName: 'Dembele' }
    ], stats: { possession: [44, 56], shots: [11, 16], shotsOnTarget: [4, 7], fouls: [13, 10], corners: [4, 8], yellowCards: [2, 1], redCards: [0, 0] }
  },
  {
    id: 'MF-6', stage: 'Group', group: 'F', homeTeamId: 'PER', awayTeamId: 'SUI',
    homeScore: 1, awayScore: 2, status: 'Completed', date: '2026-06-24', time: '21:00',
    stadium: 'NRG Stadium', city: 'Houston', events: [
      { id: 'ev-102', minute: 35, type: 'goal', teamId: 'SUI', playerName: 'Amdouni' },
      { id: 'ev-103', minute: 60, type: 'goal', teamId: 'PER', playerName: 'Guerrero' },
      { id: 'ev-104', minute: 81, type: 'goal', teamId: 'SUI', playerName: 'Xhaka' }
    ], stats: { possession: [47, 53], shots: [9, 13], shotsOnTarget: [3, 5], fouls: [12, 11], corners: [3, 5], yellowCards: [2, 1], redCards: [0, 0] }
  },

  // --- GROUP G ---
  {
    id: 'MG-1', stage: 'Group', group: 'G', homeTeamId: 'ENG', awayTeamId: 'SEN',
    homeScore: 2, awayScore: 1, status: 'Completed', date: '2026-06-15', time: '20:00',
    stadium: 'Gillette Stadium', city: 'Boston', events: [
      { id: 'ev-105', minute: 31, type: 'goal', teamId: 'ENG', playerName: 'Kane' },
      { id: 'ev-106', minute: 55, type: 'goal', teamId: 'SEN', playerName: 'Jackson' },
      { id: 'ev-107', minute: 78, type: 'goal', teamId: 'ENG', playerName: 'Saka' }
    ], stats: { possession: [56, 44], shots: [12, 10], shotsOnTarget: [5, 4], fouls: [11, 13], corners: [6, 4], yellowCards: [1, 2], redCards: [0, 0] }
  },
  {
    id: 'MG-2', stage: 'Group', group: 'G', homeTeamId: 'URU', awayTeamId: 'IRN',
    homeScore: 2, awayScore: 0, status: 'Completed', date: '2026-06-16', time: '17:00',
    stadium: 'Hard Rock Stadium', city: 'Miami', events: [
      { id: 'ev-108', minute: 18, type: 'goal', teamId: 'URU', playerName: 'Nunez' },
      { id: 'ev-109', minute: 65, type: 'goal', teamId: 'URU', playerName: 'Valverde' }
    ], stats: { possession: [62, 38], shots: [15, 6], shotsOnTarget: [7, 2], fouls: [10, 12], corners: [8, 2], yellowCards: [1, 2], redCards: [0, 0] }
  },
  {
    id: 'MG-3', stage: 'Group', group: 'G', homeTeamId: 'ENG', awayTeamId: 'URU',
    homeScore: 1, awayScore: 1, status: 'Completed', date: '2026-06-21', time: '14:00',
    stadium: 'MetLife Stadium', city: 'East Rutherford', events: [
      { id: 'ev-110', minute: 44, type: 'goal', teamId: 'URU', playerName: 'Nunez' },
      { id: 'ev-111', minute: 71, type: 'goal', teamId: 'ENG', playerName: 'Bellingham' }
    ], stats: { possession: [50, 50], shots: [11, 12], shotsOnTarget: [4, 5], fouls: [14, 15], corners: [5, 6], yellowCards: [2, 2], redCards: [0, 0] }
  },
  {
    id: 'MG-4', stage: 'Group', group: 'G', homeTeamId: 'IRN', awayTeamId: 'SEN',
    homeScore: 1, awayScore: 2, status: 'Completed', date: '2026-06-21', time: '21:00',
    stadium: 'SoFi Stadium', city: 'Los Angeles', events: [
      { id: 'ev-112', minute: 25, type: 'goal', teamId: 'SEN', playerName: 'Sarr' },
      { id: 'ev-113', minute: 58, type: 'goal', teamId: 'IRN', playerName: 'Taremi' },
      { id: 'ev-114', minute: 80, type: 'goal', teamId: 'SEN', playerName: 'Diallo' }
    ], stats: { possession: [46, 54], shots: [9, 14], shotsOnTarget: [3, 6], fouls: [12, 11], corners: [4, 7], yellowCards: [2, 1], redCards: [0, 0] }
  },
  {
    id: 'MG-5', stage: 'Group', group: 'G', homeTeamId: 'IRN', awayTeamId: 'ENG',
    homeScore: 0, awayScore: 4, status: 'Completed', date: '2026-06-25', time: '13:00',
    stadium: 'Mercedes-Benz Stadium', city: 'Atlanta', events: [
      { id: 'ev-115', minute: 12, type: 'goal', teamId: 'ENG', playerName: 'Foden' },
      { id: 'ev-116', minute: 34, type: 'goal', teamId: 'ENG', playerName: 'Kane' },
      { id: 'ev-117', minute: 59, type: 'goal', teamId: 'ENG', playerName: 'Saka' },
      { id: 'ev-118', minute: 81, type: 'goal', teamId: 'ENG', playerName: 'Palmer' }
    ], stats: { possession: [31, 69], shots: [3, 21], shotsOnTarget: [0, 11], fouls: [10, 6], corners: [1, 9], yellowCards: [1, 0], redCards: [0, 0] }
  },
  {
    id: 'MG-6', stage: 'Group', group: 'G', homeTeamId: 'SEN', awayTeamId: 'URU',
    homeScore: 1, awayScore: 2, status: 'Completed', date: '2026-06-25', time: '13:00',
    stadium: 'Lumen Field', city: 'Seattle', events: [
      { id: 'ev-119', minute: 26, type: 'goal', teamId: 'URU', playerName: 'Nunez' },
      { id: 'ev-120', minute: 53, type: 'goal', teamId: 'SEN', playerName: 'Mane' },
      { id: 'ev-121', minute: 75, type: 'goal', teamId: 'URU', playerName: 'De Arrascaeta' }
    ], stats: { possession: [45, 55], shots: [10, 15], shotsOnTarget: [4, 6], fouls: [13, 11], corners: [4, 7], yellowCards: [2, 1], redCards: [0, 0] }
  },

  // --- GROUP H ---
  {
    id: 'MH-1', stage: 'Group', group: 'H', homeTeamId: 'ESP', awayTeamId: 'ALG',
    homeScore: 3, awayScore: 0, status: 'Completed', date: '2026-06-16', time: '12:00',
    stadium: 'Arrowhead Stadium', city: 'Kansas City', events: [
      { id: 'ev-122', minute: 18, type: 'goal', teamId: 'ESP', playerName: 'Nico Williams' },
      { id: 'ev-123', minute: 45, type: 'goal', teamId: 'ESP', playerName: 'Morata' },
      { id: 'ev-124', minute: 73, type: 'goal', teamId: 'ESP', playerName: 'Yamal' }
    ], stats: { possession: [68, 32], shots: [18, 5], shotsOnTarget: [8, 1], fouls: [8, 12], corners: [9, 2], yellowCards: [0, 3], redCards: [0, 0] }
  },
  {
    id: 'MH-2', stage: 'Group', group: 'H', homeTeamId: 'CRO', awayTeamId: 'CRC',
    homeScore: 2, awayScore: 0, status: 'Completed', date: '2026-06-16', time: '15:00',
    stadium: 'Lincoln Financial Field', city: 'Philadelphia', events: [
      { id: 'ev-125', minute: 34, type: 'goal', teamId: 'CRO', playerName: 'Kramaric' },
      { id: 'ev-126', minute: 71, type: 'goal', teamId: 'CRO', playerName: 'Pasalic' }
    ], stats: { possession: [57, 43], shots: [13, 8], shotsOnTarget: [6, 2], fouls: [11, 10], corners: [6, 3], yellowCards: [1, 1], redCards: [0, 0] }
  },
  {
    id: 'MH-3', stage: 'Group', group: 'H', homeTeamId: 'ESP', awayTeamId: 'CRO',
    homeScore: 2, awayScore: 1, status: 'Completed', date: '2026-06-21', time: '17:00',
    stadium: 'MetLife Stadium', city: 'East Rutherford', events: [
      { id: 'ev-127', minute: 23, type: 'goal', teamId: 'CRO', playerName: 'Modric', detail: '点球' },
      { id: 'ev-128', minute: 54, type: 'goal', teamId: 'ESP', playerName: 'Pedri' },
      { id: 'ev-129', minute: 82, type: 'goal', teamId: 'ESP', playerName: 'Olmo' }
    ], stats: { possession: [59, 41], shots: [15, 10], shotsOnTarget: [6, 4], fouls: [9, 13], corners: [8, 4], yellowCards: [1, 2], redCards: [0, 0] }
  },
  {
    id: 'MH-4', stage: 'Group', group: 'H', homeTeamId: 'CRC', awayTeamId: 'ALG',
    homeScore: 1, awayScore: 1, status: 'Completed', date: '2026-06-22', time: '13:00',
    stadium: 'BMO Field', city: 'Toronto', events: [
      { id: 'ev-130', minute: 40, type: 'goal', teamId: 'ALG', playerName: 'Mahrez' },
      { id: 'ev-131', minute: 69, type: 'goal', teamId: 'CRC', playerName: 'Campbell' }
    ], stats: { possession: [48, 52], shots: [10, 11], shotsOnTarget: [3, 4], fouls: [12, 14], corners: [5, 5], yellowCards: [2, 2], redCards: [0, 0] }
  },
  {
    id: 'MH-5', stage: 'Group', group: 'H', homeTeamId: 'CRC', awayTeamId: 'ESP',
    homeScore: 0, awayScore: 4, status: 'Completed', date: '2026-06-25', time: '16:00',
    stadium: 'AT&T Stadium', city: 'Dallas', events: [
      { id: 'ev-132', minute: 15, type: 'goal', teamId: 'ESP', playerName: 'Yamal' },
      { id: 'ev-133', minute: 38, type: 'goal', teamId: 'ESP', playerName: 'Nico Williams' },
      { id: 'ev-134', minute: 62, type: 'goal', teamId: 'ESP', playerName: 'Morata' },
      { id: 'ev-135', minute: 80, type: 'goal', teamId: 'ESP', playerName: 'Gavi' }
    ], stats: { possession: [29, 71], shots: [2, 22], shotsOnTarget: [0, 12], fouls: [14, 7], corners: [0, 10], yellowCards: [3, 0], redCards: [0, 0] }
  },
  {
    id: 'MH-6', stage: 'Group', group: 'H', homeTeamId: 'ALG', awayTeamId: 'CRO',
    homeScore: 1, awayScore: 2, status: 'Completed', date: '2026-06-25', time: '16:00',
    stadium: 'NRG Stadium', city: 'Houston', events: [
      { id: 'ev-136', minute: 19, type: 'goal', teamId: 'CRO', playerName: 'Modric' },
      { id: 'ev-137', minute: 52, type: 'goal', teamId: 'ALG', playerName: 'Bounedjah' },
      { id: 'ev-138', minute: 77, type: 'goal', teamId: 'CRO', playerName: 'Gvardiol' }
    ], stats: { possession: [43, 57], shots: [8, 14], shotsOnTarget: [3, 6], fouls: [12, 11], corners: [3, 6], yellowCards: [2, 1], redCards: [0, 0] }
  },

  // --- GROUP I (Round 1 & 2 Complete) ---
  {
    id: 'MI-1', stage: 'Group', group: 'I', homeTeamId: 'ITA', awayTeamId: 'CHI',
    homeScore: 2, awayScore: 0, status: 'Completed', date: '2026-06-17', time: '12:00',
    stadium: 'Gillette Stadium', city: 'Boston', events: [
      { id: 'ev-139', minute: 28, type: 'goal', teamId: 'ITA', playerName: 'Retegui' },
      { id: 'ev-140', minute: 67, type: 'goal', teamId: 'ITA', playerName: 'Barella' }
    ], stats: { possession: [54, 46], shots: [12, 8], shotsOnTarget: [5, 2], fouls: [11, 13], corners: [5, 4], yellowCards: [2, 2], redCards: [0, 0] }
  },
  {
    id: 'MI-2', stage: 'Group', group: 'I', homeTeamId: 'DEN', awayTeamId: 'UKR',
    homeScore: 1, awayScore: 1, status: 'Completed', date: '2026-06-17', time: '15:00',
    stadium: 'BMO Field', city: 'Toronto', events: [
      { id: 'ev-141', minute: 42, type: 'goal', teamId: 'DEN', playerName: 'Hojlund' },
      { id: 'ev-142', minute: 59, type: 'goal', teamId: 'UKR', playerName: 'Dovbyk' }
    ], stats: { possession: [49, 51], shots: [10, 11], shotsOnTarget: [4, 4], fouls: [12, 11], corners: [4, 5], yellowCards: [1, 1], redCards: [0, 0] }
  },
  {
    id: 'MI-3', stage: 'Group', group: 'I', homeTeamId: 'ITA', awayTeamId: 'DEN',
    homeScore: 1, awayScore: 0, status: 'Completed', date: '2026-06-22', time: '17:00',
    stadium: 'MetLife Stadium', city: 'East Rutherford', events: [
      { id: 'ev-143', minute: 73, type: 'goal', teamId: 'ITA', playerName: 'Chiesa' }
    ], stats: { possession: [52, 48], shots: [13, 9], shotsOnTarget: [5, 3], fouls: [10, 12], corners: [6, 4], yellowCards: [1, 2], redCards: [0, 0] }
  },
  {
    id: 'MI-4', stage: 'Group', group: 'I', homeTeamId: 'UKR', awayTeamId: 'CHI',
    homeScore: 2, awayScore: 1, status: 'Completed', date: '2026-06-22', time: '20:00',
    stadium: 'Levi Stadium', city: 'Santa Clara', events: [
      { id: 'ev-144', minute: 15, type: 'goal', teamId: 'UKR', playerName: 'Mudryk' },
      { id: 'ev-145', minute: 51, type: 'goal', teamId: 'CHI', playerName: 'Sanchez' },
      { id: 'ev-146', minute: 78, type: 'goal', teamId: 'UKR', playerName: 'Tsygankov' }
    ], stats: { possession: [50, 50], shots: [11, 10], shotsOnTarget: [5, 4], fouls: [11, 13], corners: [4, 5], yellowCards: [1, 2], redCards: [0, 0] }
  },
  // Round 3 - Scheduled for tonight!
  {
    id: 'MI-5', stage: 'Group', group: 'I', homeTeamId: 'UKR', awayTeamId: 'ITA',
    homeScore: 0, awayScore: 0, status: 'Scheduled', date: '2026-06-25', time: '20:00',
    stadium: 'Hard Rock Stadium', city: 'Miami', events: [], stats: createDefaultStats()
  },
  {
    id: 'MI-6', stage: 'Group', group: 'I', homeTeamId: 'CHI', awayTeamId: 'DEN',
    homeScore: 0, awayScore: 0, status: 'Scheduled', date: '2026-06-25', time: '20:00',
    stadium: 'SoFi Stadium', city: 'Los Angeles', events: [], stats: createDefaultStats()
  },

  // --- GROUP J (Round 1 & 2 Complete) ---
  {
    id: 'MJ-1', stage: 'Group', group: 'J', homeTeamId: 'BEL', awayTeamId: 'TUN',
    homeScore: 3, awayScore: 1, status: 'Completed', date: '2026-06-18', time: '12:00',
    stadium: 'Arrowhead Stadium', city: 'Kansas City', events: [
      { id: 'ev-147', minute: 22, type: 'goal', teamId: 'BEL', playerName: 'Lukaku' },
      { id: 'ev-148', minute: 44, type: 'goal', teamId: 'BEL', playerName: 'Trossard' },
      { id: 'ev-149', minute: 61, type: 'goal', teamId: 'TUN', playerName: 'Msakni' },
      { id: 'ev-150', minute: 85, type: 'goal', teamId: 'BEL', playerName: 'Openda' }
    ], stats: { possession: [61, 39], shots: [17, 7], shotsOnTarget: [8, 2], fouls: [9, 13], corners: [7, 3], yellowCards: [1, 2], redCards: [0, 0] }
  },
  {
    id: 'MJ-2', stage: 'Group', group: 'J', homeTeamId: 'SWE', awayTeamId: 'SRB',
    homeScore: 1, awayScore: 2, status: 'Completed', date: '2026-06-18', time: '15:00',
    stadium: 'Lincoln Financial Field', city: 'Philadelphia', events: [
      { id: 'ev-151', minute: 31, type: 'goal', teamId: 'SWE', playerName: 'Isak' },
      { id: 'ev-152', minute: 58, type: 'goal', teamId: 'SRB', playerName: 'Mitrovic' },
      { id: 'ev-153', minute: 81, type: 'goal', teamId: 'SRB', playerName: 'Vlahovic' }
    ], stats: { possession: [48, 52], shots: [11, 13], shotsOnTarget: [4, 6], fouls: [12, 11], corners: [5, 5], yellowCards: [2, 1], redCards: [0, 0] }
  },
  {
    id: 'MJ-3', stage: 'Group', group: 'J', homeTeamId: 'BEL', awayTeamId: 'SWE',
    homeScore: 2, awayScore: 0, status: 'Completed', date: '2026-06-23', time: '17:00',
    stadium: 'MetLife Stadium', city: 'East Rutherford', events: [
      { id: 'ev-154', minute: 40, type: 'goal', teamId: 'BEL', playerName: 'Lukaku' },
      { id: 'ev-155', minute: 75, type: 'goal', teamId: 'BEL', playerName: 'Doku' }
    ], stats: { possession: [55, 45], shots: [14, 9], shotsOnTarget: [6, 3], fouls: [10, 12], corners: [8, 4], yellowCards: [1, 2], redCards: [0, 0] }
  },
  {
    id: 'MJ-4', stage: 'Group', group: 'J', homeTeamId: 'SRB', awayTeamId: 'TUN',
    homeScore: 1, awayScore: 1, status: 'Completed', date: '2026-06-23', time: '20:00',
    stadium: 'Levi Stadium', city: 'Santa Clara', events: [
      { id: 'ev-156', minute: 29, type: 'goal', teamId: 'SRB', playerName: 'Milinkovic-Savic' },
      { id: 'ev-157', minute: 68, type: 'goal', teamId: 'TUN', playerName: 'Laidouni' }
    ], stats: { possession: [53, 47], shots: [12, 10], shotsOnTarget: [5, 4], fouls: [13, 15], corners: [6, 4], yellowCards: [2, 3], redCards: [0, 0] }
  },
  // Round 3 - Scheduled for tomorrow!
  {
    id: 'MJ-5', stage: 'Group', group: 'J', homeTeamId: 'SRB', awayTeamId: 'BEL',
    homeScore: 0, awayScore: 0, status: 'Scheduled', date: '2026-06-26', time: '17:00',
    stadium: 'AT&T Stadium', city: 'Dallas', events: [], stats: createDefaultStats()
  },
  {
    id: 'MJ-6', stage: 'Group', group: 'J', homeTeamId: 'TUN', awayTeamId: 'SWE',
    homeScore: 0, awayScore: 0, status: 'Scheduled', date: '2026-06-26', time: '17:00',
    stadium: 'NRG Stadium', city: 'Houston', events: [], stats: createDefaultStats()
  },

  // --- GROUP K (Round 1 & 2 Complete, Round 3 is LIVE right now on June 25, 2026!) ---
  {
    id: 'MK-1', stage: 'Group', group: 'K', homeTeamId: 'AUT', awayTeamId: 'PAN',
    homeScore: 2, awayScore: 1, status: 'Completed', date: '2026-06-19', time: '12:00',
    stadium: 'Arrowhead Stadium', city: 'Kansas City', events: [
      { id: 'ev-158', minute: 15, type: 'goal', teamId: 'AUT', playerName: 'Sabitzer' },
      { id: 'ev-159', minute: 48, type: 'goal', teamId: 'PAN', playerName: 'Fajardo' },
      { id: 'ev-160', minute: 73, type: 'goal', teamId: 'AUT', playerName: 'Gregoritsch' }
    ], stats: { possession: [56, 44], shots: [13, 9], shotsOnTarget: [6, 3], fouls: [10, 12], corners: [6, 4], yellowCards: [1, 2], redCards: [0, 0] }
  },
  {
    id: 'MK-2', stage: 'Group', group: 'K', homeTeamId: 'TUR', awayTeamId: 'RSA',
    homeScore: 1, awayScore: 1, status: 'Completed', date: '2026-06-19', time: '15:00',
    stadium: 'Lincoln Financial Field', city: 'Philadelphia', events: [
      { id: 'ev-161', minute: 36, type: 'goal', teamId: 'TUR', playerName: 'Yilmaz' },
      { id: 'ev-162', minute: 58, type: 'goal', teamId: 'RSA', playerName: 'Tau' }
    ], stats: { possession: [52, 48], shots: [11, 10], shotsOnTarget: [4, 4], fouls: [11, 12], corners: [5, 4], yellowCards: [2, 1], redCards: [0, 0] }
  },
  {
    id: 'MK-3', stage: 'Group', group: 'K', homeTeamId: 'AUT', awayTeamId: 'TUR',
    homeScore: 1, awayScore: 2, status: 'Completed', date: '2026-06-23', time: '17:00',
    stadium: 'MetLife Stadium', city: 'East Rutherford', events: [
      { id: 'ev-163', minute: 22, type: 'goal', teamId: 'TUR', playerName: 'Calhanoglu' },
      { id: 'ev-164', minute: 45, type: 'goal', teamId: 'AUT', playerName: 'Laimer' },
      { id: 'ev-165', minute: 78, type: 'goal', teamId: 'TUR', playerName: 'Guler' }
    ], stats: { possession: [49, 51], shots: [12, 14], shotsOnTarget: [5, 6], fouls: [13, 11], corners: [4, 6], yellowCards: [2, 1], redCards: [0, 0] }
  },
  {
    id: 'MK-4', stage: 'Group', group: 'K', homeTeamId: 'RSA', awayTeamId: 'PAN',
    homeScore: 1, awayScore: 0, status: 'Completed', date: '2026-06-23', time: '20:00',
    stadium: 'Levi Stadium', city: 'Santa Clara', events: [
      { id: 'ev-166', minute: 64, type: 'goal', teamId: 'RSA', playerName: 'Foster' }
    ], stats: { possession: [50, 50], shots: [10, 8], shotsOnTarget: [4, 2], fouls: [12, 13], corners: [5, 3], yellowCards: [1, 2], redCards: [0, 0] }
  },
  // LIVE MATCH 1 (Group K, Day 3)
  {
    id: 'MK-5', stage: 'Group', group: 'K', homeTeamId: 'RSA', awayTeamId: 'AUT',
    homeScore: 1, awayScore: 1, status: 'Live', minute: 65, date: '2026-06-25', time: '17:00',
    stadium: 'Mercedes-Benz Stadium', city: 'Atlanta', events: [
      { id: 'ev-167', minute: 18, type: 'goal', teamId: 'AUT', playerName: 'Baumgartner', detail: 'Arnautovic 助攻' },
      { id: 'ev-168', minute: 41, type: 'goal', teamId: 'RSA', playerName: 'Mokoena', detail: '点球' },
      { id: 'ev-169', minute: 55, type: 'yellow_card', teamId: 'RSA', playerName: 'Modiba' }
    ], stats: { possession: [46, 54], shots: [8, 12], shotsOnTarget: [3, 5], fouls: [10, 8], corners: [3, 6], yellowCards: [1, 0], redCards: [0, 0] }
  },
  // LIVE MATCH 2 (Group K, Day 3)
  {
    id: 'MK-6', stage: 'Group', group: 'K', homeTeamId: 'PAN', awayTeamId: 'TUR',
    homeScore: 0, awayScore: 2, status: 'Live', minute: 65, date: '2026-06-25', time: '17:00',
    stadium: 'Lumen Field', city: 'Seattle', events: [
      { id: 'ev-170', minute: 28, type: 'goal', teamId: 'TUR', playerName: 'Yilmaz' },
      { id: 'ev-171', minute: 52, type: 'goal', teamId: 'TUR', playerName: 'Kokcu' },
      { id: 'ev-172', minute: 60, type: 'yellow_card', teamId: 'PAN', playerName: 'Murillo' }
    ], stats: { possession: [39, 61], shots: [4, 15], shotsOnTarget: [1, 7], fouls: [9, 7], corners: [2, 8], yellowCards: [1, 0], redCards: [0, 0] }
  },

  // --- GROUP L (Round 1 & 2 Complete, Round 3 is LIVE right now on June 25, 2026!) ---
  {
    id: 'ML-1', stage: 'Group', group: 'L', homeTeamId: 'NOR', awayTeamId: 'CIV',
    homeScore: 3, awayScore: 2, status: 'Completed', date: '2026-06-19', time: '17:00',
    stadium: 'Hard Rock Stadium', city: 'Miami', events: [
      { id: 'ev-173', minute: 11, type: 'goal', teamId: 'NOR', playerName: 'Haaland' },
      { id: 'ev-174', minute: 29, type: 'goal', teamId: 'CIV', playerName: 'Haller' },
      { id: 'ev-175', minute: 43, type: 'goal', teamId: 'NOR', playerName: 'Odegaard' },
      { id: 'ev-176', minute: 68, type: 'goal', teamId: 'NOR', playerName: 'Haaland' },
      { id: 'ev-177', minute: 81, type: 'goal', teamId: 'CIV', playerName: 'Kessie' }
    ], stats: { possession: [51, 49], shots: [14, 12], shotsOnTarget: [6, 5], fouls: [10, 11], corners: [5, 4], yellowCards: [1, 2], redCards: [0, 0] }
  },
  {
    id: 'ML-2', stage: 'Group', group: 'L', homeTeamId: 'WAL', awayTeamId: 'IRQ',
    homeScore: 2, awayScore: 0, status: 'Completed', date: '2026-06-19', time: '20:00',
    stadium: 'SoFi Stadium', city: 'Los Angeles', events: [
      { id: 'ev-178', minute: 33, type: 'goal', teamId: 'WAL', playerName: 'James' },
      { id: 'ev-179', minute: 76, type: 'goal', teamId: 'WAL', playerName: 'Wilson' }
    ], stats: { possession: [58, 42], shots: [12, 7], shotsOnTarget: [5, 2], fouls: [11, 12], corners: [6, 3], yellowCards: [1, 2], redCards: [0, 0] }
  },
  {
    id: 'ML-3', stage: 'Group', group: 'L', homeTeamId: 'NOR', awayTeamId: 'WAL',
    homeScore: 2, awayScore: 1, status: 'Completed', date: '2026-06-24', time: '13:00',
    stadium: 'Mercedes-Benz Stadium', city: 'Atlanta', events: [
      { id: 'ev-180', minute: 18, type: 'goal', teamId: 'WAL', playerName: 'Johnson' },
      { id: 'ev-181', minute: 55, type: 'goal', teamId: 'NOR', playerName: 'Haaland' },
      { id: 'ev-182', minute: 88, type: 'goal', teamId: 'NOR', playerName: 'Sörloth' }
    ], stats: { possession: [53, 47], shots: [15, 11], shotsOnTarget: [7, 4], fouls: [12, 13], corners: [6, 5], yellowCards: [1, 2], redCards: [0, 0] }
  },
  {
    id: 'ML-4', stage: 'Group', group: 'L', homeTeamId: 'IRQ', awayTeamId: 'CIV',
    homeScore: 0, awayScore: 2, status: 'Completed', date: '2026-06-24', time: '16:00',
    stadium: 'Lumen Field', city: 'Seattle', events: [
      { id: 'ev-183', minute: 25, type: 'goal', teamId: 'CIV', playerName: 'Adingra' },
      { id: 'ev-184', minute: 70, type: 'goal', teamId: 'CIV', playerName: 'Fofana' }
    ], stats: { possession: [40, 60], shots: [6, 16], shotsOnTarget: [2, 7], fouls: [14, 11], corners: [3, 8], yellowCards: [3, 1], redCards: [0, 0] }
  },
  // LIVE MATCH 1 (Group L, Day 3)
  {
    id: 'ML-5', stage: 'Group', group: 'L', homeTeamId: 'IRQ', awayTeamId: 'NOR',
    homeScore: 0, awayScore: 2, status: 'Live', minute: 65, date: '2026-06-25', time: '17:00',
    stadium: 'Gillette Stadium', city: 'Boston', events: [
      { id: 'ev-185', minute: 14, type: 'goal', teamId: 'NOR', playerName: 'Haaland', detail: 'Odegaard 助攻' },
      { id: 'ev-186', minute: 44, type: 'goal', teamId: 'NOR', playerName: 'Haaland', detail: 'Nusa 助攻' },
      { id: 'ev-187', minute: 58, type: 'yellow_card', teamId: 'IRQ', playerName: 'Ali' }
    ], stats: { possession: [33, 67], shots: [3, 16], shotsOnTarget: [1, 8], fouls: [11, 6], corners: [2, 9], yellowCards: [1, 0], redCards: [0, 0] }
  },
  // LIVE MATCH 2 (Group L, Day 3)
  {
    id: 'ML-6', stage: 'Group', group: 'L', homeTeamId: 'CIV', awayTeamId: 'WAL',
    homeScore: 1, awayScore: 1, status: 'Live', minute: 65, date: '2026-06-25', time: '17:00',
    stadium: 'BMO Field', city: 'Toronto', events: [
      { id: 'ev-188', minute: 31, type: 'goal', teamId: 'CIV', playerName: 'Kessie' },
      { id: 'ev-189', minute: 58, type: 'goal', teamId: 'WAL', playerName: 'James' }
    ], stats: { possession: [52, 48], shots: [9, 10], shotsOnTarget: [4, 4], fouls: [10, 11], corners: [5, 4], yellowCards: [1, 1], redCards: [0, 0] }
  },
];

// Initial Scorers List
export const INITIAL_SCORERS: PlayerScorer[] = [
  { id: 'p1', name: '埃尔林·哈兰德', teamId: 'NOR', teamName: '挪威', flag: '🇳🇴', goals: 5, assists: 0, penalties: 0, matchesPlayed: 3 },
  { id: 'p2', name: '基利安·姆巴佩', teamId: 'FRA', teamName: '法国', flag: '🇫🇷', goals: 4, assists: 1, penalties: 0, matchesPlayed: 3 },
  { id: 'p3', name: '克里斯蒂安·普利西奇', teamId: 'USA', teamName: '美国', flag: '🇺🇸', goals: 3, assists: 2, penalties: 1, matchesPlayed: 3 },
  { id: 'p4', name: '莱昂内尔·梅西', teamId: 'ARG', teamName: '阿根廷', flag: '🇦🇷', goals: 3, assists: 1, penalties: 0, matchesPlayed: 3 },
  { id: 'p5', name: '达尔文·努涅斯', teamId: 'URU', teamName: '乌拉圭', flag: '🇺🇾', goals: 3, assists: 1, penalties: 0, matchesPlayed: 3 },
  { id: 'p6', name: '维尼修斯·儒尼奥尔', teamId: 'BRA', teamName: '巴西', flag: '🇧🇷', goals: 2, assists: 2, penalties: 0, matchesPlayed: 3 },
  { id: 'p7', name: '维克托·奥斯梅恩', teamId: 'NGA', teamName: '尼日利亚', flag: '🇳🇬', goals: 3, assists: 0, penalties: 0, matchesPlayed: 3 },
  { id: 'p8', name: '罗伯特·莱万多夫斯基', teamId: 'POL', teamName: '波兰', flag: '🇵🇱', goals: 3, assists: 0, penalties: 0, matchesPlayed: 3 },
  { id: 'p9', name: '拉明·雅马尔', teamId: 'ESP', teamName: '西班牙', flag: '🇪🇸', goals: 2, assists: 3, penalties: 0, matchesPlayed: 3 },
  { id: 'p10', name: '哈里·凯恩', teamId: 'ENG', teamName: '英格兰', flag: '🇬🇧', goals: 2, assists: 1, penalties: 0, matchesPlayed: 3 },
  { id: 'p11', name: '贾马尔·穆西亚拉', teamId: 'GER', teamName: '德国', flag: '🇩🇪', goals: 2, assists: 1, penalties: 0, matchesPlayed: 3 },
  { id: 'p12', name: '朱德·贝林厄姆', teamId: 'ENG', teamName: '英格兰', flag: '🇬🇧', goals: 1, assists: 2, penalties: 0, matchesPlayed: 3 }
];

// Initial News List
export const INITIAL_NEWS: NewsItem[] = [
  {
    id: 'news-1',
    title: '魔人降临！哈兰德梅开二度，挪威大胜率先晋级32强！',
    summary: '2026美加墨世界杯小组赛L组末轮，挪威凭借哈兰德的出色发挥锁定胜局，昂首挺进淘汰赛。',
    content: '在刚刚结束的世界杯小组赛L组末轮比赛中，挪威队以高效的进攻彻底压制了对手。锋线尖刀哈兰德再次展现恐怖的门前嗅觉，在上半场第14分钟和第44分钟各入一球，目前他以5粒进球强势领跑世界杯射手榜！挪威队三战全胜积9分，以L组第一的身份高调晋级美加墨世界杯32强淘汰赛。',
    time: '5分钟前',
    source: '国际足联中文官网',
    tag: '战报'
  },
  {
    id: 'news-2',
    title: '突发：东道主美国队核心普利西奇在训练中轻微拉伤，或缺席32强首战',
    summary: '美国国家队主帅透露，普利西奇在昨日的闭门合练中感觉肌肉不适，为稳妥起见可能在淘汰赛首轮替补登场。',
    content: '根据前方记者报道，美国国家队队长兼核心克里斯蒂安·普利西奇在昨日进行的战术训练中突感大腿后侧肌肉不适，提前退出了合练。美国队主教练在新闻发布会上坦言：“克里斯蒂安的拉伤并不严重，但考虑到淘汰赛的残酷性，我们不会冒险让他百分之百首发，他可能会在32强战的第一场比赛中替补待命。”这对力争创造历史的东道主而言无疑是一个隐忧。',
    time: '20分钟前',
    source: 'ESPN体育网',
    tag: '突发'
  },
  {
    id: 'news-3',
    title: '【战术深度解析】梅西新角色！阿根廷新铁三角成形，卫冕冠军攻防无懈可击',
    summary: '随着小组赛波折过关，阿根廷主帅斯卡洛尼再次调整阵型，梅西坐镇前腰，阿尔瓦雷斯与麦卡利斯特形成强力接应。',
    content: '本届世界杯阿根廷以D组第一稳健晋级。通过对小组赛三场比赛的数据分析可以发现，39岁的梅西在场上的跑动范围有所缩减，但他传威胁球的成功率和致命一击的效率不降反升。斯卡洛尼将战术核心后撤，梅西转型为中场调度大师，配合锋线上勤勉奔跑的阿尔瓦雷斯，以及中场强力插上的麦卡利斯特，阿根廷形成了全新的“黄金铁三角”，这将是他们卫冕之路上最强大的底牌。',
    time: '1小时前',
    source: '体坛周报',
    tag: '分析'
  },
  {
    id: 'news-4',
    title: '现场播报：美加墨三合一球场气氛狂热！墨西哥球迷组百米“人浪”震撼世界',
    summary: '作为联合承办国之一，墨西哥的阿兹台克球场与阿克伦球场上空回荡着震耳欲聋的欢呼声，桑巴与拉丁风情点燃北美。',
    content: '2026年美加墨世界杯迎来了史无前例的48支球队扩军规模。除了激烈的竞技对抗，三大东道主的赛场文化也令人叹为观止。在墨西哥城、洛杉矶以及多伦多的球场外，数万名无票球迷齐聚广场狂欢。在昨晚墨西哥对阵德国的比赛中，现场两队球迷合力完成了一次环绕球场长达3分钟的超级“墨西哥人浪”，场面极为壮观，向全世界展示了足球运动的无国界魅力。',
    time: '3小时前',
    source: '新华社体育',
    tag: '爆料'
  }
];

// World Cup 2026 Knockout Bracket Nodes
// 2026 World Cup has 48 teams.
// The top 2 teams of each of the 12 groups (A-L) = 24 teams.
// Plus the 8 best 3rd placed teams = 8 teams.
// Total 32 teams make the Round of 32!
// Let's model a simplified version of the Knockout Tree starting from the Round of 32 or Round of 16 for better screen display space.
// Since a Round of 32 is a massive 16-match layout (hard to fit nicely on a single screen), we can design a beautiful interactive selector:
// Users can toggle between "Round of 32" list, and a beautiful tree layout starting from the "Round of 16" (1/8决赛), which is perfectly optimized for both mobile and desktop bento-grid layouts!
// Let's define the Round of 16 bracket structure.
export const BRACKET_NODES: KnockoutNode[] = [
  // --- Round of 16 (8 Matches) ---
  { id: 'R16-1', stage: 'Round of 16', nextMatchId: 'QF-1', label: '1/8 决赛 1', placeholderHome: '1A (美国)', placeholderAway: '3C/D/E (厄瓜多尔)' },
  { id: 'R16-2', stage: 'Round of 16', nextMatchId: 'QF-1', label: '1/8 决赛 2', placeholderHome: '1B (葡萄牙)', placeholderAway: '2C (德国)' },
  { id: 'R16-3', stage: 'Round of 16', nextMatchId: 'QF-2', label: '1/8 决赛 3', placeholderHome: '1E (巴西)', placeholderAway: '3A/B/F (摩洛哥)' },
  { id: 'R16-4', stage: 'Round of 16', nextMatchId: 'QF-2', label: '1/8 决赛 4', placeholderHome: '1F (法国)', placeholderAway: '2E (荷兰)' },
  { id: 'R16-5', stage: 'Round of 16', nextMatchId: 'QF-3', label: '1/8 决赛 5', placeholderHome: '1G (英格兰)', placeholderAway: '3H/I/J (克罗地亚)' },
  { id: 'R16-6', stage: 'Round of 16', nextMatchId: 'QF-3', label: '1/8 决赛 6', placeholderHome: '1H (西班牙)', placeholderAway: '2G (乌拉圭)' },
  { id: 'R16-7', stage: 'Round of 16', nextMatchId: 'QF-4', label: '1/8 决赛 7', placeholderHome: '1I (意大利)', placeholderAway: '2J (塞尔维亚)' },
  { id: 'R16-8', stage: 'Round of 16', nextMatchId: 'QF-4', label: '1/8 决赛 8', placeholderHome: '1L (挪威)', placeholderAway: '2K (土耳其)' },

  // --- Quarterfinals (4 Matches) ---
  { id: 'QF-1', stage: 'Quarterfinals', nextMatchId: 'SF-1', label: '四分之一决赛 1', placeholderHome: 'R16-1 胜者', placeholderAway: 'R16-2 胜者' },
  { id: 'QF-2', stage: 'Quarterfinals', nextMatchId: 'SF-1', label: '四分之一决赛 2', placeholderHome: 'R16-3 胜者', placeholderAway: 'R16-4 胜者' },
  { id: 'QF-3', stage: 'Quarterfinals', nextMatchId: 'SF-2', label: '四分之一决赛 3', placeholderHome: 'R16-5 胜者', placeholderAway: 'R16-6 胜者' },
  { id: 'QF-4', stage: 'Quarterfinals', nextMatchId: 'SF-2', label: '四分之一决赛 4', placeholderHome: 'R16-7 胜者', placeholderAway: 'R16-8 胜者' },

  // --- Semifinals (2 Matches) ---
  { id: 'SF-1', stage: 'Semifinals', nextMatchId: 'F', label: '半决赛 1', placeholderHome: 'QF-1 胜者', placeholderAway: 'QF-2 胜者' },
  { id: 'SF-2', stage: 'Semifinals', nextMatchId: 'F', label: '半决赛 2', placeholderHome: 'QF-3 胜者', placeholderAway: 'QF-4 胜者' },

  // --- Final (1 Match) ---
  { id: 'F', stage: 'Final', label: '冠军决赛', placeholderHome: 'SF-1 胜者', placeholderAway: 'SF-2 胜者' },
];

// We can map mock match outputs for the knockout tree if the group stage is simulated to be completely finished.
// This will allow us to display an interactive, gorgeous bracket!
export const MOCK_KNOCKOUT_MATCHES: Record<string, { home: string; away: string; homeScore: number; awayScore: number; status: 'Completed' | 'Scheduled' }> = {
  'R16-1': { home: '美国 🇺🇸', away: '厄瓜多尔 🇪🇨', homeScore: 2, awayScore: 1, status: 'Completed' },
  'R16-2': { home: '葡萄牙 🇵🇹', away: '德国 🇩🇪', homeScore: 3, awayScore: 2, status: 'Completed' },
  'R16-3': { home: '巴西 🇧🇷', away: '摩洛哥 🇲🇦', homeScore: 1, awayScore: 0, status: 'Completed' },
  'R16-4': { home: '法国 🇫🇷', away: '荷兰 🇳🇱', homeScore: 2, awayScore: 0, status: 'Completed' },
  'R16-5': { home: '英格兰 🇬🇧', away: '克罗地亚 🇭🇷', homeScore: 2, awayScore: 1, status: 'Completed' },
  'R16-6': { home: '西班牙 🇪🇸', away: '乌拉圭 🇺🇾', homeScore: 1, awayScore: 2, status: 'Completed' },
  'R16-7': { home: '意大利 🇮🇹', away: '塞尔维亚 🇷🇸', homeScore: 1, awayScore: 0, status: 'Completed' },
  'R16-8': { home: '挪威 🇳🇴', away: '土耳其 🇹🇷', homeScore: 2, awayScore: 3, status: 'Completed' },

  'QF-1': { home: '美国 🇺🇸', away: '葡萄牙 🇵🇹', homeScore: 1, awayScore: 2, status: 'Completed' },
  'QF-2': { home: '巴西 🇧🇷', away: '法国 🇫🇷', homeScore: 0, awayScore: 1, status: 'Completed' },
  'QF-3': { home: '英格兰 🇬🇧', away: '乌拉圭 🇺🇾', homeScore: 3, awayScore: 1, status: 'Completed' },
  'QF-4': { home: '意大利 🇮🇹', away: '土耳其 🇹🇷', homeScore: 2, awayScore: 0, status: 'Completed' },

  'SF-1': { home: '葡萄牙 🇵🇹', away: '法国 🇫🇷', homeScore: 1, awayScore: 2, status: 'Completed' },
  'SF-2': { home: '英格兰 🇬🇧', away: '意大利 🇮🇹', homeScore: 1, awayScore: 0, status: 'Completed' },

  'F': { home: '法国 🇫🇷', away: '英格兰 🇬🇧', homeScore: 0, awayScore: 0, status: 'Scheduled' },
};
