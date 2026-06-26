/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Match, Team, GroupStanding, PlayerScorer, NewsItem, MatchEvent } from '../types';

// Helper to calculate standings for all groups based on matches
export function calculateStandings(matches: Match[], teams: Record<string, Team>): Record<string, GroupStanding[]> {
  const standings: Record<string, Record<string, GroupStanding>> = {};

  // Initialize standings for all 48 teams
  Object.values(teams).forEach((team) => {
    if (!standings[team.group]) {
      standings[team.group] = {};
    }
    standings[team.group][team.id] = {
      teamId: team.id,
      teamName: team.name,
      teamCode: team.code,
      flag: team.flag,
      played: 0,
      won: 0,
      drawn: 0,
      lost: 0,
      goalsFor: 0,
      goalsAgainst: 0,
      goalDifference: 0,
      points: 0,
    };
  });

  // Accumulate match results (Completed and Live matches)
  matches.forEach((match) => {
    if (match.stage !== 'Group' || (match.status !== 'Completed' && match.status !== 'Live')) {
      return;
    }

    const groupName = match.group || teams[match.homeTeamId]?.group || teams[match.awayTeamId]?.group || '';
    const groupStandings = standings[groupName];
    if (!groupStandings) return;

    const homeStanding = groupStandings[match.homeTeamId];
    const awayStanding = groupStandings[match.awayTeamId];

    if (!homeStanding || !awayStanding) return;

    homeStanding.played += 1;
    awayStanding.played += 1;

    homeStanding.goalsFor += match.homeScore;
    homeStanding.goalsAgainst += match.awayScore;
    awayStanding.goalsFor += match.awayScore;
    awayStanding.goalsAgainst += match.homeScore;

    if (match.homeScore > match.awayScore) {
      homeStanding.won += 1;
      homeStanding.points += 3;
      awayStanding.lost += 1;
    } else if (match.homeScore < match.awayScore) {
      awayStanding.won += 1;
      awayStanding.points += 3;
      homeStanding.lost += 1;
    } else {
      homeStanding.drawn += 1;
      homeStanding.points += 1;
      awayStanding.drawn += 1;
      awayStanding.points += 1;
    }
  });

  // Format and sort standings
  const sortedStandings: Record<string, GroupStanding[]> = {};
  Object.keys(standings).forEach((groupKey) => {
    const groupTeams = Object.values(standings[groupKey]);
    
    // Sort rules: points desc, gd desc, gf desc, alphabetically
    groupTeams.forEach((team) => {
      team.goalDifference = team.goalsFor - team.goalsAgainst;
    });

    groupTeams.sort((a, b) => {
      if (b.points !== a.points) return b.points - a.points;
      if (b.goalDifference !== a.goalDifference) return b.goalDifference - a.goalDifference;
      if (b.goalsFor !== a.goalsFor) return b.goalsFor - a.goalsFor;
      return a.teamName.localeCompare(b.teamName);
    });

    sortedStandings[groupKey] = groupTeams;
  });

  return sortedStandings;
}

// Famous goal scorers pool for teams if dynamic goals are scored
const TEAM_PLAYERS: Record<string, string[]> = {
  'USA': ['Pulisic', 'Balogun', 'Weah', 'McKennie', 'Reyna', 'Aaronson'],
  'COL': ['Luis Diaz', 'Duran', 'Sinisterra', 'James Rodriguez', 'Borre'],
  'MAR': ['En-Nesyri', 'Ziyech', 'Diaz (Brahim)', 'Hakimi', 'Amrabat'],
  'NZL': ['Wood', 'Garbett', 'Cacace', 'Singh'],
  'CAN': ['David', 'Davies', 'Larin', 'Buchanan', 'Eustaquio'],
  'POR': ['Ronaldo', 'Ramos', 'Leao', 'Bruno Fernandes', 'Bernardo Silva', 'Felix'],
  'KOR': ['Son Heung-min', 'Lee Kang-in', 'Hwang Hee-chan', 'Cho Gue-sung'],
  'MLI': ['Doucoure', 'Koita', 'Dorgeles', 'Haidara'],
  'MEX': ['Gimenez', 'Chavez', 'Lozano', 'Martin', 'Alvarez'],
  'GER': ['Musiala', 'Wirtz', 'Havertz', 'Fullkrug', 'Sane', 'Gundogan'],
  'JPN': ['Mitoma', 'Kubo', 'Minamino', 'Asano', 'Kamada', 'Doan'],
  'ECU': ['Valencia', 'Caicedo', 'Estupinan', 'Pezzolano', 'Porozo'],
  'ARG': ['Messi', 'Alvarez', 'Lautaro Martinez', 'Fernandez', 'Mac Allister', 'Di Maria'],
  'POL': ['Lewandowski', 'Zielinski', 'Szymanski', 'Buksa', 'Milik'],
  'EGY': ['Salah', 'Mostafa Mohamed', 'Trezeguet', 'Marmoush', 'Elneny'],
  'AUS': ['Duke', 'Boyle', 'Goodwin', 'Irvine', 'McGree'],
  'BRA': ['Vinicius Jr', 'Rodrygo', 'Endrick', 'Neymar', 'Martinelli', 'Richarlison'],
  'NED': ['Gakpo', 'Depay', 'Simons', 'Weghorst', 'Malen', 'Frimpong'],
  'KSA': ['Al-Dawsari', 'Al-Buraikan', 'Al-Shehri', 'Kanno'],
  'CMR': ['Aboubakar', 'Mbeumo', 'Anguissa', 'Toko Ekambi', 'Choupo-Moting'],
  'FRA': ['Mbappe', 'Griezmann', 'Thuram', 'Dembele', 'Giroud', 'Coman'],
  'SUI': ['Embolo', 'Amdouni', 'Xhaka', 'Shaqiri', 'Vargas'],
  'NGA': ['Osimhen', 'Lookman', 'Chukwueze', 'Iwobi', 'Iheanacho'],
  'PER': ['Lapadula', 'Guerrero', 'Carrillo', 'Flores'],
  'ENG': ['Kane', 'Saka', 'Bellingham', 'Foden', 'Palmer', 'Watkins', 'Rice'],
  'URU': ['Nunez', 'Valverde', 'De Arrascaeta', 'Pellistri', 'Suarez'],
  'IRN': ['Taremi', 'Azmoun', 'Jahanbakhsh', 'Gholizadeh'],
  'SEN': ['Mane', 'Jackson', 'Sarr', 'Diallo', 'Gueye'],
  'ESP': ['Yamal', 'Nico Williams', 'Morata', 'Pedri', 'Olmo', 'Gavi', 'Torres'],
  'CRO': ['Modric', 'Kramaric', 'Pasalic', 'Gvardiol', 'Perisic', 'Kovacic'],
  'CRC': ['Campbell', 'Ugalde', 'Bennette', 'Calvo'],
  'ALG': ['Mahrez', 'Bounedjah', 'Slimani', 'Chaibi', 'Aouar'],
  'ITA': ['Retegui', 'Barella', 'Chiesa', 'Scamacca', 'Pellegrini', 'Frattesi'],
  'DEN': ['Hojlund', 'Eriksen', 'Wind', 'Maehle', 'Hojbjerg'],
  'UKR': ['Dovbyk', 'Mudryk', 'Tsygankov', 'Yaremchuk', 'Malinovskyi'],
  'CHI': ['Sanchez', 'Vargas', 'Brereton', 'Valdes'],
  'BEL': ['Lukaku', 'Trossard', 'Openda', 'Doku', 'De Bruyne', 'Bakayoko'],
  'SWE': ['Isak', 'Gyokeres', 'Kulusevski', 'Elanga', 'Forsberg'],
  'SRB': ['Mitrovic', 'Vlahovic', 'Milinkovic-Savic', 'Tadic', 'Jovic'],
  'TUN': ['Msakni', 'Laidouni', 'Ben Slimane', 'Jaziri'],
  'AUT': ['Sabitzer', 'Gregoritsch', 'Laimer', 'Baumgartner', 'Arnautovic'],
  'TUR': ['Yilmaz', 'Calhanoglu', 'Guler', 'Kokcu', 'Akturkoglu'],
  'RSA': ['Tau', 'Foster', 'Mokoena', 'Modiba', 'Zwane'],
  'PAN': ['Fajardo', 'Murillo', 'Waterman', 'Rodriguez'],
  'NOR': ['Haaland', 'Odegaard', 'Sörloth', 'Nusa', 'Berge'],
  'WAL': ['James', 'Wilson', 'Johnson', 'Moore', 'Ramsey'],
  'IRQ': ['Hussein', 'Ali', 'Resan', 'Iqbal'],
  'CIV': ['Haller', 'Kessie', 'Adingra', 'Fofana', 'Zaha', 'Pepe'],
};

// Advanced simulation iteration when user clicks "Refresh"
export function simulateStep(
  matches: Match[],
  scorers: PlayerScorer[],
  news: NewsItem[],
  teams: Record<string, Team>
): {
  updatedMatches: Match[];
  updatedScorers: PlayerScorer[];
  updatedNews: NewsItem[];
  eventOccurred: boolean;
  eventDescription?: string;
} {
  let eventOccurred = false;
  let eventDescription = '';
  const updatedMatches = [...matches];
  const updatedScorers = [...scorers];
  const updatedNews = [...news];

  // Find live matches
  const liveMatches = updatedMatches.filter((m) => m.status === 'Live');

  if (liveMatches.length === 0) {
    return { updatedMatches, updatedScorers, updatedNews, eventOccurred: false };
  }

  // Pick a random live match to receive a major event
  const targetMatch = liveMatches[Math.floor(Math.random() * liveMatches.length)];
  const homeTeam = teams[targetMatch.homeTeamId];
  const awayTeam = teams[targetMatch.awayTeamId];

  if (!targetMatch.minute) targetMatch.minute = 65;

  // Progress all live matches in time
  updatedMatches.forEach((match) => {
    if (match.status === 'Live') {
      const step = Math.floor(Math.random() * 5) + 3; // advance 3-7 mins
      match.minute = (match.minute || 65) + step;

      // Update basic live stats randomly
      match.stats.possession[0] = Math.min(75, Math.max(25, match.stats.possession[0] + (Math.random() * 4 - 2)));
      match.stats.possession[1] = 100 - match.stats.possession[0];

      if (Math.random() > 0.4) {
        match.stats.shots[0] += Math.random() > 0.5 ? 1 : 0;
        match.stats.shots[1] += Math.random() > 0.5 ? 1 : 0;
      }
      if (Math.random() > 0.5) {
        match.stats.shotsOnTarget[0] += Math.random() > 0.6 ? 1 : 0;
        match.stats.shotsOnTarget[1] += Math.random() > 0.6 ? 1 : 0;
      }
      if (Math.random() > 0.3) {
        match.stats.fouls[0] += Math.random() > 0.5 ? 1 : 0;
        match.stats.fouls[1] += Math.random() > 0.5 ? 1 : 0;
      }

      // If matches reach 90+ mins, complete them
      if (match.minute >= 90) {
        match.minute = 90;
        match.status = 'Completed';
        
        // Add final news item
        const winnerName = match.homeScore > match.awayScore ? teams[match.homeTeamId].name : 
                           match.homeScore < match.awayScore ? teams[match.awayTeamId].name : '双方';
        const isDraw = match.homeScore === match.awayScore;
        
        const endNews: NewsItem = {
          id: `news-end-${match.id}-${Date.now()}`,
          title: `【终场哨响】小组赛末轮：${teams[match.homeTeamId].name} ${match.homeScore}-${match.awayScore} ${teams[match.awayTeamId].name}`,
          summary: isDraw ? `两支球队拼尽全力，最终战平，积分榜形势愈发微妙。` : `在一场惊心动魄的对决中，${winnerName}成功带走三分，晋级希望大增！`,
          content: `2026世界杯小组赛${match.group}组关键之战刚刚落下帷幕。在${match.stadium}，主场作战的${teams[match.homeTeamId].name}与${teams[match.awayTeamId].name}上演了激烈的进球大战。终场比分为 ${match.homeScore} 比 ${match.awayScore}。本场结果使${match.group}组的积分排名发生了关键重组。`,
          time: '刚刚',
          source: '世界杯前方快讯',
          tag: '战报'
        };
        updatedNews.unshift(endNews);

        eventOccurred = true;
        eventDescription = `全场哨响！${teams[match.homeTeamId].flag}${teams[match.homeTeamId].name} ${match.homeScore}-${match.awayScore} ${teams[match.awayTeamId].flag}${teams[match.awayTeamId].name} 比赛结束！`;
      }
    }
  });

  // Only simulate active events on the target match if it remains live
  if (targetMatch.status === 'Live') {
    const rand = Math.random();
    const eventMinute = targetMatch.minute;

    if (rand < 0.25) {
      // GOAL EVENT!
      const isHomeGoal = Math.random() > 0.45; // slightly favor home or random
      const scoringTeamId = isHomeGoal ? targetMatch.homeTeamId : targetMatch.awayTeamId;
      const scoringTeam = isHomeGoal ? homeTeam : awayTeam;
      const concedingTeam = isHomeGoal ? awayTeam : homeTeam;

      if (isHomeGoal) {
        targetMatch.homeScore += 1;
      } else {
        targetMatch.awayScore += 1;
      }

      // Pick a player
      const players = TEAM_PLAYERS[scoringTeamId] || ['前锋'];
      const scorerName = players[Math.floor(Math.random() * players.length)];

      // Record goal in match events
      const newEvent: MatchEvent = {
        id: `ev-sim-${Date.now()}`,
        minute: eventMinute,
        type: 'goal',
        teamId: scoringTeamId,
        playerName: scorerName,
        detail: Math.random() > 0.7 ? '漂亮世界波' : Math.random() > 0.85 ? '点球' : undefined
      };
      targetMatch.events.push(newEvent);

      // Increment stats
      if (isHomeGoal) {
        targetMatch.stats.shots[0] += 1;
        targetMatch.stats.shotsOnTarget[0] += 1;
      } else {
        targetMatch.stats.shots[1] += 1;
        targetMatch.stats.shotsOnTarget[1] += 1;
      }

      // Update Scorers List
      const scorerIndex = updatedScorers.findIndex((s) => s.name === scorerName && s.teamId === scoringTeamId);
      if (scorerIndex !== -1) {
        updatedScorers[scorerIndex] = {
          ...updatedScorers[scorerIndex],
          goals: updatedScorers[scorerIndex].goals + 1
        };
      } else {
        // Add new scorer to list if they aren't already there
        updatedScorers.push({
          id: `scorer-${scoringTeamId}-${scorerName}`,
          name: scorerName,
          teamId: scoringTeamId,
          teamName: scoringTeam.name,
          flag: scoringTeam.flag,
          goals: 1,
          assists: 0,
          penalties: 0,
          matchesPlayed: 3
        });
      }

      // Re-sort scorers
      updatedScorers.sort((a, b) => b.goals - a.goals || b.assists - a.assists || a.name.localeCompare(b.name));

      // Create goal news item
      const goalNews: NewsItem = {
        id: `news-goal-${Date.now()}`,
        title: `实时进球！${scorerName}闪耀球场，为${scoringTeam.name}建功！`,
        summary: `正在进行的${targetMatch.group}组第3轮比赛中，${scoringTeam.name}的${scorerName}在第${eventMinute}分钟攻入关键一球。`,
        content: `太精彩了！在美加墨世界杯${targetMatch.group}组，${scoringTeam.name}对阵${concedingTeam.name}的比赛第${eventMinute}分钟，${scorerName}接队友巧妙传球，停球过人一气呵成，面对门将冷静推射死角破门！场上比分变为 ${targetMatch.homeScore}-${targetMatch.awayScore}。看台上的${scoringTeam.name}球迷已经陷入了疯狂！`,
        time: '刚刚',
        source: '世界杯赛场直播',
        tag: '突发'
      };
      updatedNews.unshift(goalNews);

      eventOccurred = true;
      eventDescription = `⚽️ 进球！第 ${eventMinute} 分钟，${scoringTeam.flag}${scorerName} 破门得分！场上比分 ${targetMatch.homeScore}-${targetMatch.awayScore}`;

    } else if (rand < 0.45) {
      // YELLOW CARD EVENT
      const isHomeCard = Math.random() > 0.5;
      const cardTeamId = isHomeCard ? targetMatch.homeTeamId : targetMatch.awayTeamId;
      const cardTeam = isHomeCard ? homeTeam : awayTeam;

      const players = TEAM_PLAYERS[cardTeamId] || ['防守球员'];
      const playerName = players[Math.floor(Math.random() * players.length)];

      const newEvent: MatchEvent = {
        id: `ev-card-${Date.now()}`,
        minute: eventMinute,
        type: 'yellow_card',
        teamId: cardTeamId,
        playerName: playerName,
        detail: '战术犯规'
      };
      targetMatch.events.push(newEvent);

      if (isHomeCard) {
        targetMatch.stats.yellowCards[0] += 1;
      } else {
        targetMatch.stats.yellowCards[1] += 1;
      }

      eventOccurred = true;
      eventDescription = `🟨 黄牌！第 ${eventMinute} 分钟，${cardTeam.flag}${playerName} 因为战术犯规被主裁判出示黄牌警告。`;
    }
  }

  // Trim news list to maximum 20 items to keep memory clean
  if (updatedNews.length > 20) {
    updatedNews.splice(20);
  }

  return { updatedMatches, updatedScorers, updatedNews, eventOccurred, eventDescription };
}
