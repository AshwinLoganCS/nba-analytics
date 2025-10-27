'use client'

import { useState, useEffect, useCallback } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { type Player, searchPlayers } from '@/lib/api'
import { getTeamLogo } from '@/lib/team-logos'
import { X } from 'lucide-react'

interface PlayerSearchProps {
  selectedPlayers: Player[]
  onSelect: (player: Player) => void
  onRemove: (playerId: number) => void
}

export function PlayerSearch({
  selectedPlayers,
  onSelect,
  onRemove,
}: PlayerSearchProps) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<Player[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [positionFilter, setPositionFilter] = useState<string>('All')

  // Debounced search
  useEffect(() => {
    const timeoutId = setTimeout(async () => {
      if (query.trim().length < 2) {
        setResults([])
        return
      }

      setIsLoading(true)
      setError(null)
      try {
        const players = await searchPlayers(query)
        // Filter out already selected players and by position
        let filtered = players.filter(
          (player) =>
            !selectedPlayers.some((selected) => selected.id === player.id)
        )
        
        // Apply position filter
        if (positionFilter !== 'All') {
          filtered = filtered.filter(player => player.position.startsWith(positionFilter))
        }
        
        setResults(filtered)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to search players')
        setResults([])
      } finally {
        setIsLoading(false)
      }
    }, 300)

    return () => clearTimeout(timeoutId)
  }, [query, selectedPlayers, positionFilter])

  const handleSelect = useCallback(
    (player: Player) => {
      if (selectedPlayers.length >= 5) {
        return
      }
      onSelect(player)
      setQuery('')
      setResults([])
    },
    [selectedPlayers.length, onSelect]
  )

  const isMaxSelected = selectedPlayers.length >= 5

  const positions = ['All', 'G', 'F', 'C']

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-orange-500/20 to-red-500/20 blur-xl rounded-lg"></div>
          <Input
            type="text"
            placeholder={
              isMaxSelected
                ? 'Maximum 5 players selected'
                : 'Search for NBA players...'
            }
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            disabled={isMaxSelected}
            className="flex-1 relative bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-orange-500 focus:ring-orange-500"
          />
        </div>
        
        {/* Position Filter */}
        <div className="flex gap-2">
          {positions.map((pos) => (
            <Button
              key={pos}
              size="sm"
              variant={positionFilter === pos ? "default" : "outline"}
              onClick={() => setPositionFilter(pos)}
              className={
                positionFilter === pos
                  ? "bg-gradient-to-r from-orange-500 to-red-600 text-white border-0"
                  : "bg-white/5 border-white/20 text-white/70 hover:bg-white/10 hover:text-white"
              }
            >
              {pos === 'All' ? 'All Positions' : pos === 'G' ? 'Guards' : pos === 'F' ? 'Forwards' : 'Centers'}
            </Button>
          ))}
        </div>
      </div>

      {/* Search Results */}
      {isLoading && (
        <div className="flex items-center gap-2 text-white/70">
          <div className="animate-spin h-4 w-4 border-2 border-white/20 border-t-orange-500 rounded-full"></div>
          <p className="text-sm">Loading...</p>
        </div>
      )}
      {error && (
        <div className="p-3 bg-red-500/20 border border-red-500/30 rounded-lg">
          <p className="text-sm text-red-300">{error}</p>
        </div>
      )}
      {results.length > 0 && (
        <Card className="bg-white/5 border-white/10 p-4 shadow-xl">
          <div className="space-y-2">
            {results.map((player) => (
              <div
                key={player.id}
                className="flex items-center justify-between p-3 bg-white/5 hover:bg-white/10 rounded-lg cursor-pointer transition-all border border-white/10 hover:border-orange-500/30 group"
                onClick={() => handleSelect(player)}
              >
                <div className="flex items-center gap-3">
                  <div className={`${getTeamLogo(player.team.abbreviation).bg} w-10 h-10 rounded-full flex items-center justify-center shadow-lg`}>
                    <span className="text-white text-xs font-bold">
                      {getTeamLogo(player.team.abbreviation).text}
                    </span>
                  </div>
                  <div>
                    <p className="font-semibold text-white">
                      {player.first_name} {player.last_name}
                    </p>
                    <p className="text-sm text-white/60">
                      {player.position} • {player.team.full_name}
                    </p>
                  </div>
                </div>
                <Button
                  size="sm"
                  className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white border-0 shadow-lg"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleSelect(player)
                  }}
                >
                  Add
                </Button>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Selected Players */}
      {selectedPlayers.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold mb-3 text-white/80">Selected Players:</h3>
          <div className="flex flex-wrap gap-3">
            {selectedPlayers.map((player, index) => {
              const colors = [
                'from-orange-500 to-red-600',
                'from-purple-500 to-pink-600',
                'from-blue-500 to-cyan-600',
                'from-green-500 to-emerald-600',
                'from-yellow-500 to-orange-500'
              ][index % 5]
              
              return (
                <Card key={player.id} className="p-4 bg-white/10 border-white/20 group hover:scale-105 transition-transform shadow-lg">
                  <div className="flex items-center gap-3">
                    <div className={`${getTeamLogo(player.team.abbreviation).bg} w-12 h-12 rounded-full flex items-center justify-center shadow-lg`}>
                      <span className="text-white text-xs font-bold">
                        {getTeamLogo(player.team.abbreviation).text}
                      </span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className="font-semibold text-sm text-white">
                          {player.first_name} {player.last_name}
                        </p>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold bg-gradient-to-br ${colors}`}>
                          {player.position}
                        </span>
                      </div>
                      <p className="text-xs text-white/60">
                        {player.team.abbreviation}
                      </p>
                    </div>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-6 w-6 ml-auto hover:bg-red-500/20 hover:text-red-300 text-white/60"
                      onClick={() => onRemove(player.id)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </Card>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

