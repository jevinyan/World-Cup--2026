/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Team {
  id: string;
  name: string; // e.g. "Argentina"
  code: string; // e.g. "ARG"
  flag: string; // emoji flag e.g. "🇦🇷"
  group: string; // e.g. "A"
}

export interface GroupStanding {
  teamId: string;
  teamName: string;
  teamCode: string;
  flag: string;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
  points: number;
}

export interface MatchEvent {
  id: string;
  minute: number;
  type: 'goal' | 'yellow_card' | 'red_card' | 'substitution' | 'injury';
  teamId: string;
  playerName: string;
  detail?: string; // e.g., assist name, or card detail
}

export interface MatchStats {
  possession: [number, number]; // [home%, away%]
  shots: [number, number];
  shotsOnTarget: [number, number];
  fouls: [number, number];
  corners: [number, number];
  yellowCards: [number, number];
  redCards: [number, number];
}

export interface Match {
  id: string;
  stage: 'Group' | 'Round of 32' | 'Round of 16' | 'Quarterfinal' | 'Semifinal' | 'Third Place' | 'Final';
  group?: string; // e.g., "A"
  homeTeamId: string;
  awayTeamId: string;
  homeScore: number;
  awayScore: number;
  status: 'Scheduled' | 'Live' | 'Completed';
  minute?: number; // current minute if live
  date: string; // e.g., "2026-06-25"
  time: string; // e.g., "15:00"
  stadium: string;
  city: string;
  events: MatchEvent[];
  stats: MatchStats;
}

export interface PlayerScorer {
  id: string;
  name: string;
  teamId: string;
  teamName: string;
  flag: string;
  goals: number;
  assists: number;
  penalties: number;
  matchesPlayed: number;
}

export interface NewsItem {
  id: string;
  title: string;
  summary: string;
  content: string;
  time: string; // e.g., "10分钟前" (10 mins ago) or "2026-06-25 10:15"
  source: string;
  tag: '战报' | '爆料' | '突发' | '伤停' | '分析';
  image?: string;
}

export interface KnockoutNode {
  id: string; // e.g., "R32-1", "R16-1", "QF-1", "SF-1", "F"
  stage: 'Round of 32' | 'Round of 16' | 'Quarterfinals' | 'Semifinals' | 'Final';
  nextMatchId?: string; // ID of the match this winner progresses to
  matchId?: string; // Reference to the actual Match ID, if matches are determined
  label: string; // e.g. "1/16 决赛 1"
  placeholderHome?: string; // e.g. "Group A 1st"
  placeholderAway?: string; // e.g. "Group B 2nd"
}
