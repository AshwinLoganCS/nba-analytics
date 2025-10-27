'use client'

import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Legend,
} from 'recharts'
import { Card } from '@/components/ui/card'
import { type Player, type SeasonAverage } from '@/lib/api'

interface RadarChartComparisonProps {
  players: Player[]
  averages: SeasonAverage[]
}

export function RadarChartComparison({
  players,
  averages,
}: RadarChartComparisonProps) {
  if (players.length === 0 || averages.length === 0) {
    return null
  }

  // Create data for radar chart
  const getAverage = (playerId: number): SeasonAverage | undefined => {
    return averages.find((avg) => avg.player_id === playerId)
  }

  const keys = ['pts', 'reb', 'ast', 'stl', 'blk']
  const maxValues = keys.reduce(
    (acc, key) => {
      const max = Math.max(
        ...averages.map((avg) => avg[key as keyof SeasonAverage] as number)
      )
      acc[key] = max
      return acc
    },
    {} as Record<string, number>
  )

  const data = keys.map((key) => {
    const entry: Record<string, string | number> = {
      stat: key.toUpperCase(),
    }

    players.forEach((player) => {
      const avg = getAverage(player.id)
      const value = (avg?.[key as keyof SeasonAverage] as number) ?? 0
      entry[`player-${player.id}`] = value
    })

    return entry
  })

  // Colors for up to 5 players
  const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#ffa07a', '#98d8c8']

  return (
    <Card className="bg-white/10 backdrop-blur-xl border-white/20 shadow-2xl">
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-6 text-white">Statistical Comparison</h2>
        <ResponsiveContainer width="100%" height={players.length > 3 ? 500 : 400}>
          <RadarChart data={data}>
            <PolarGrid stroke="#ffffff20" />
            <PolarAngleAxis 
              dataKey="stat" 
              tick={{ fill: '#ffffff80', fontSize: 12, fontWeight: 600 }}
            />
            <PolarRadiusAxis 
              angle={90} 
              domain={[0, 'auto']}
              tick={{ fill: '#ffffff60', fontSize: 10 }}
            />
            {players.map((player, index) => (
              <Radar
                key={player.id}
                name={`${player.first_name} ${player.last_name}`}
                dataKey={`player-${player.id}`}
                stroke={colors[index % colors.length]}
                fill={colors[index % colors.length]}
                fillOpacity={players.length > 3 ? 0.25 : 0.4}
                strokeWidth={2}
              />
            ))}
            <Legend 
              wrapperStyle={{ 
                color: '#ffffff90', 
                fontWeight: 500,
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'center',
                gap: '1rem'
              }}
              iconType="circle"
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  )
}

