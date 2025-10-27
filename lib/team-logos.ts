// Team logo mapping - using team colors and initials
export function getTeamLogo(abbreviation: string): { bg: string; text: string } {
  const teamStyles: Record<string, { bg: string; text: string }> = {
    'ATL': { bg: 'bg-red-600', text: 'ATL' },
    'BOS': { bg: 'bg-green-600', text: 'BOS' },
    'BKN': { bg: 'bg-black', text: 'BKN' },
    'CHA': { bg: 'bg-teal-500', text: 'CHA' },
    'CHI': { bg: 'bg-red-700', text: 'CHI' },
    'CLE': { bg: 'bg-red-800', text: 'CLE' },
    'DAL': { bg: 'bg-blue-600', text: 'DAL' },
    'DEN': { bg: 'bg-blue-500', text: 'DEN' },
    'DET': { bg: 'bg-blue-700', text: 'DET' },
    'GSW': { bg: 'bg-yellow-500', text: 'GSW' },
    'GS': { bg: 'bg-yellow-500', text: 'GS' },
    'HOU': { bg: 'bg-red-600', text: 'HOU' },
    'IND': { bg: 'bg-blue-600', text: 'IND' },
    'LAC': { bg: 'bg-red-600', text: 'LAC' },
    'LAL': { bg: 'bg-purple-600', text: 'LAL' },
    'MEM': { bg: 'bg-blue-400', text: 'MEM' },
    'MIA': { bg: 'bg-red-600', text: 'MIA' },
    'MIL': { bg: 'bg-green-700', text: 'MIL' },
    'MIN': { bg: 'bg-blue-600', text: 'MIN' },
    'NOP': { bg: 'bg-blue-800', text: 'NOP' },
    'NYK': { bg: 'bg-blue-600', text: 'NYK' },
    'OKC': { bg: 'bg-blue-500', text: 'OKC' },
    'ORL': { bg: 'bg-blue-600', text: 'ORL' },
    'PHI': { bg: 'bg-blue-700', text: 'PHI' },
    'PHX': { bg: 'bg-purple-600', text: 'PHX' },
    'POR': { bg: 'bg-red-700', text: 'POR' },
    'SAC': { bg: 'bg-purple-700', text: 'SAC' },
    'SAS': { bg: 'bg-gray-700', text: 'SAS' },
    'TOR': { bg: 'bg-red-700', text: 'TOR' },
    'UTA': { bg: 'bg-blue-800', text: 'UTA' },
    'WAS': { bg: 'bg-blue-800', text: 'WAS' },
  }

  return teamStyles[abbreviation] || { bg: 'bg-gray-600', text: abbreviation }
}

