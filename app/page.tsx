'use client'

import { useState, useEffect } from 'react'
import { PlayerSearch } from '@/components/PlayerSearch'
import { StatsTable } from '@/components/StatsTable'
import { RadarChartComparison } from '@/components/RadarChartComparison'
import { ComparisonInsights } from '@/components/ComparisonInsights'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { type Player, type SeasonAverage, getSeasonAverages } from '@/lib/api'

export default function Home() {
  const [selectedPlayers, setSelectedPlayers] = useState<Player[]>([])
  const [averages, setAverages] = useState<SeasonAverage[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Fetch season averages when selected players change
  useEffect(() => {
    if (selectedPlayers.length === 0) {
      setAverages([])
      return
    }

    const fetchAverages = async () => {
      setIsLoading(true)
      setError(null)
      try {
        const playerIds = selectedPlayers.map((p) => p.id)
        const averagesData = await getSeasonAverages(playerIds)
        setAverages(averagesData)
      } catch (err) {
        setError('Failed to fetch player statistics')
        setAverages([])
      } finally {
        setIsLoading(false)
      }
    }

    fetchAverages()
  }, [selectedPlayers])

  const handleSelectPlayer = (player: Player) => {
    if (selectedPlayers.length < 5) {
      setSelectedPlayers([...selectedPlayers, player])
    }
  }

  const handleRemovePlayer = (playerId: number) => {
    setSelectedPlayers(selectedPlayers.filter((p) => p.id !== playerId))
  }

  const handleClearAll = () => {
    setSelectedPlayers([])
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Navigation */}
      <nav className="border-b border-white/10 bg-white/5 backdrop-blur-xl">
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg shadow-lg">
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-400 via-red-500 to-pink-500 bg-clip-text text-transparent">
                  NBA Analytics
                </h1>
                <p className="text-sm text-white/70">
                  Compare NBA Player Statistics
                </p>
              </div>
            </div>
            {selectedPlayers.length > 0 && (
              <Button 
                variant="outline" 
                onClick={handleClearAll}
                className="bg-white/10 border-white/20 text-white hover:bg-white/20 backdrop-blur-sm"
              >
                Clear All
              </Button>
            )}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-10">
        <div className="max-w-6xl mx-auto space-y-10">
          {/* Search Section */}
          <Card className="bg-white/10 backdrop-blur-xl border-white/20 shadow-2xl">
            <CardHeader className="border-b border-white/10">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-white text-2xl mb-2">Player Search</CardTitle>
                  <p className="text-sm text-white/70">
                    Search and select up to 5 NBA players to compare
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <PlayerSearch
                selectedPlayers={selectedPlayers}
                onSelect={handleSelectPlayer}
                onRemove={handleRemovePlayer}
              />
            </CardContent>
          </Card>

          {/* Loading State */}
          {isLoading && (
            <Card className="bg-white/10 backdrop-blur-xl border-white/20 shadow-2xl">
              <CardContent className="py-12">
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-10 w-10 border-4 border-white/20 border-t-orange-500"></div>
                  <p className="ml-4 text-white/80 text-lg">
                    Loading player statistics...
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Error State */}
          {error && (
            <Card className="border-destructive">
              <CardContent className="py-8">
                <p className="text-destructive text-center">{error}</p>
              </CardContent>
            </Card>
          )}

          {/* Comparison Insights */}
          {!isLoading && !error && selectedPlayers.length > 0 && averages.length > 0 && (
            <ComparisonInsights players={selectedPlayers} averages={averages} />
          )}

          {/* Stats Table */}
          {!isLoading && !error && selectedPlayers.length > 0 && averages.length > 0 && (
            <StatsTable players={selectedPlayers} averages={averages} />
          )}

          {/* Radar Chart */}
          {!isLoading && !error && selectedPlayers.length > 0 && averages.length > 0 && (
            <RadarChartComparison players={selectedPlayers} averages={averages} />
          )}

          {/* Empty State */}
          {selectedPlayers.length === 0 && !isLoading && (
            <Card className="bg-white/10 backdrop-blur-xl border-white/20 shadow-2xl">
              <CardContent className="py-20 text-center">
                <div className="mb-6 mx-auto w-20 h-20 bg-gradient-to-br from-orange-500 to-red-600 rounded-full flex items-center justify-center">
                  <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 00.394-1.84l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-4.765l.408.175a5 5 0 003.426.8l5.768-2.472a11.125 11.125 0 00.518 2.3l-.98.514a5 5 0 01-3.426.8L7 16.99l-.408.175A1 1 0 016 18z" />
                  </svg>
                </div>
                <p className="text-2xl text-white/90 font-semibold mb-2">
                  Start Comparing Players
                </p>
                <p className="text-lg text-white/60">
                  Search for NBA players above to begin your analysis
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 bg-white/5 backdrop-blur-xl mt-20">
        <div className="container mx-auto px-6 py-8 text-center">
          <p className="text-sm text-white/60">
            Data provided by{' '}
            <a
              href="https://www.balldontlie.io"
              target="_blank"
              rel="noopener noreferrer"
              className="text-orange-400 hover:text-orange-300 transition-colors font-semibold"
            >
              balldontlie.io
            </a>
          </p>
        </div>
      </footer>
    </div>
  )
}

