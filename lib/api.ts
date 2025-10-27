// API helpers for balldontlie.io

export interface Player {
  id: number
  first_name: string
  last_name: string
  position: string
  team: {
    id: number
    abbreviation: string
    city: string
    conference: string
    division: string
    full_name: string
    name: string
  }
}

export interface PlayerResponse {
  data: Player[]
}

export interface SeasonAverage {
  player_id: number
  pts: number
  reb: number
  ast: number
  stl: number
  blk: number
  turnover: number
  fg_pct: number
  fg3_pct: number
  ft_pct: number
  season: number
}

export interface SeasonAverageResponse {
  data: SeasonAverage[]
}

/**
 * Search for NBA players by name
 * Uses Next.js API route to avoid CORS issues
 */
export async function searchPlayers(query: string): Promise<Player[]> {
  if (!query.trim()) {
    return []
  }

  const response = await fetch(
    `/api/players?search=${encodeURIComponent(query)}`,
  )

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || 'Failed to fetch players')
  }

  const data: PlayerResponse = await response.json()
  return data.data
}

/**
 * Get season averages for specific player IDs
 * Uses Next.js API route to avoid CORS issues
 */
export async function getSeasonAverages(
  playerIds: number[],
  season: number = 2024,
): Promise<SeasonAverage[]> {
  if (playerIds.length === 0) {
    return []
  }

  const idsParam = playerIds.map((id) => `player_ids[]=${id}`).join('&')
  const response = await fetch(
    `/api/season-averages?season=${season}&${idsParam}`,
  )

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || 'Failed to fetch season averages')
  }

  const data: SeasonAverageResponse = await response.json()
  return data.data
}

