import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const search = searchParams.get('search')

  if (!search) {
    return NextResponse.json({ data: [] }, { status: 200 })
  }

  try {
    // Try the official balldontlie API first
    const apiKey = process.env.BALLDONTLIE_API_KEY
    const headers: Record<string, string> = {
      'Accept': 'application/json',
    }
    
    // Add API key if available
    if (apiKey) {
      headers['Authorization'] = apiKey
    }
    
    // Try search endpoint
    let response = await fetch(
      `https://api.balldontlie.io/v1/players?search=${encodeURIComponent(search)}`,
      { headers }
    )

    let data
    
    // Try to parse JSON, handle non-JSON responses
    try {
      const text = await response.text()
      data = text ? JSON.parse(text) : null
    } catch (parseError) {
      console.log('❌ API returned non-JSON response, using mock data')
      // Return mock data when API doesn't work
      return NextResponse.json({
        data: getMockPlayers(search),
      }, { status: 200 })
    }
    
    if (!response.ok || !data || !data.data) {
      console.log('❌ API returned error, using mock data')
      return NextResponse.json({
        data: getMockPlayers(search),
      }, { status: 200 })
    }

    console.log('✅ REAL API DATA: Fetched', data.data?.length || 0, 'players from balldontlie.io')
    return NextResponse.json(data, { status: 200 })
  } catch (error) {
    console.error('❌ Error fetching players:', error)
    console.log('Using mock data as fallback')
    // Return mock data on any error
    return NextResponse.json({
      data: getMockPlayers(search),
    }, { status: 200 })
  }
}

function getMockPlayers(searchQuery: string) {
  const query = searchQuery.toLowerCase()
  
  // Comprehensive list of popular NBA players
  const allPlayers: any[] = [
    { id: 115, first: 'Stephen', last: 'Curry', pos: 'G', abbrev: 'GSW', team: 'Golden State Warriors' },
    { id: 237, first: 'LeBron', last: 'James', pos: 'F', abbrev: 'LAL', team: 'Los Angeles Lakers' },
    { id: 140, first: 'Kevin', last: 'Durant', pos: 'F', abbrev: 'PHX', team: 'Phoenix Suns' },
    { id: 199, first: 'Devin', last: 'Booker', pos: 'G', abbrev: 'PHX', team: 'Phoenix Suns' },
    { id: 226, first: 'Kawhi', last: 'Leonard', pos: 'F', abbrev: 'LAC', team: 'Los Angeles Clippers' },
    { id: 307, first: 'Damian', last: 'Lillard', pos: 'G', abbrev: 'MIL', team: 'Milwaukee Bucks' },
    { id: 278, first: 'Russell', last: 'Westbrook', pos: 'G', abbrev: 'LAC', team: 'Los Angeles Clippers' },
    { id: 98, first: 'Jimmy', last: 'Butler', pos: 'F', abbrev: 'MIA', team: 'Miami Heat' },
    { id: 339, first: 'Joel', last: 'Embiid', pos: 'C', abbrev: 'PHI', team: 'Philadelphia 76ers' },
    { id: 173, first: 'Anthony', last: 'Davis', pos: 'C', abbrev: 'LAL', team: 'Los Angeles Lakers' },
    { id: 252, first: 'Jayson', last: 'Tatum', pos: 'F', abbrev: 'BOS', team: 'Boston Celtics' },
    { id: 212, first: 'Kyrie', last: 'Irving', pos: 'G', abbrev: 'DAL', team: 'Dallas Mavericks' },
    { id: 172, first: 'Giannis', last: 'Antetokounmpo', pos: 'F', abbrev: 'MIL', team: 'Milwaukee Bucks' },
    { id: 135, first: 'Luka', last: 'Doncic', pos: 'G', abbrev: 'DAL', team: 'Dallas Mavericks' },
    { id: 234, first: 'Trae', last: 'Young', pos: 'G', abbrev: 'ATL', team: 'Atlanta Hawks' },
    { id: 41, first: 'James', last: 'Harden', pos: 'G', abbrev: 'LAC', team: 'Los Angeles Clippers' },
    { id: 314, first: 'Ja', last: 'Morant', pos: 'G', abbrev: 'MEM', team: 'Memphis Grizzlies' },
    { id: 85, first: 'Paul', last: 'George', pos: 'F', abbrev: 'LAC', team: 'Los Angeles Clippers' },
    { id: 318, first: 'De\'Aaron', last: 'Fox', pos: 'G', abbrev: 'SAC', team: 'Sacramento Kings' },
    { id: 324, first: 'Dejounte', last: 'Murray', pos: 'G', abbrev: 'ATL', team: 'Atlanta Hawks' },
    { id: 145, first: 'Seth', last: 'Curry', pos: 'G', abbrev: 'CHA', team: 'Charlotte Hornets' },
  ]
  
  // Filter players based on search query
  const matchedPlayers = allPlayers.filter(player => {
    const fullName = `${player.first} ${player.last}`.toLowerCase()
    const firstName = player.first.toLowerCase()
    const lastName = player.last.toLowerCase()
    
    return fullName.includes(query) || 
           firstName.includes(query) || 
           lastName.includes(query)
  })
  
  // Convert to the format expected by the app
  return matchedPlayers.map(player => ({
    id: player.id,
    first_name: player.first,
    last_name: player.last,
    position: player.pos,
    team: {
      id: Math.floor(Math.random() * 30) + 1,
      abbreviation: player.abbrev,
      city: player.team.split(' ')[0] + ' ' + player.team.split(' ')[1],
      conference: ['GSW', 'LAL', 'LAC', 'PHX', 'SAC', 'POR', 'DEN', 'MIA', 'ATL', 'NYK'].includes(player.abbrev) ? 'West' : 'East',
      division: getDivision(player.abbrev),
      full_name: player.team,
      name: player.team.split(' ').slice(2).join(' ') || player.team.split(' ').slice(1).join(' '),
    },
  }))
}

function getDivision(abbrev: string): string {
  const divisions: Record<string, string> = {
    'GSW': 'Pacific', 'LAL': 'Pacific', 'LAC': 'Pacific', 'PHX': 'Pacific', 'SAC': 'Pacific',
    'MIL': 'Central', 'CHI': 'Central', 'CLE': 'Central', 'IND': 'Central', 'DET': 'Central',
    'BOS': 'Atlantic', 'NYK': 'Atlantic', 'PHI': 'Atlantic', 'BKN': 'Atlantic', 'TOR': 'Atlantic',
    'DEN': 'Northwest', 'UTA': 'Northwest', 'POR': 'Northwest', 'OKC': 'Northwest', 'MIN': 'Northwest',
    'MIA': 'Southeast', 'ORL': 'Southeast', 'ATL': 'Southeast', 'CHA': 'Southeast', 'WAS': 'Southeast',
    'DAL': 'Southwest', 'MEM': 'Southwest', 'HOU': 'Southwest', 'NOP': 'Southwest', 'SAS': 'Southwest',
  }
  return divisions[abbrev] || 'Central'
}

