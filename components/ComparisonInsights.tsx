'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { type Player, type SeasonAverage } from '@/lib/api'
import { TrendingUp, Award, Target } from 'lucide-react'

interface ComparisonInsightsProps {
  players: Player[]
  averages: SeasonAverage[]
}

export function ComparisonInsights({ players, averages }: ComparisonInsightsProps) {
  if (players.length === 0 || averages.length === 0) {
    return null
  }

  const getPlayerName = (playerId: number) => {
    const player = players.find(p => p.id === playerId)
    return player ? `${player.first_name} ${player.last_name}` : 'Unknown'
  }

  const getLeader = (stat: keyof SeasonAverage) => {
    let leader = averages[0]
    averages.forEach(avg => {
      if ((avg[stat] as number) > (leader[stat] as number)) {
        leader = avg
      }
    })
    return leader
  }

  const getLowest = (stat: keyof SeasonAverage) => {
    let lowest = averages[0]
    averages.forEach(avg => {
      if ((avg[stat] as number) < (lowest[stat] as number)) {
        lowest = avg
      }
    })
    return lowest
  }

  const ptsLeader = getLeader('pts')
  const astLeader = getLeader('ast')
  const rebLeader = getLeader('reb')
  const tovLowest = getLowest('turnover')

  const insights = [
    {
      icon: <Award className="w-5 h-5" />,
      text: `${getPlayerName(ptsLeader.player_id)} leads in scoring`,
      value: `${ptsLeader.pts.toFixed(1)} PPG`,
      color: 'from-orange-500 to-red-600'
    },
    {
      icon: <TrendingUp className="w-5 h-5" />,
      text: `${getPlayerName(astLeader.player_id)} tops in assists`,
      value: `${astLeader.ast.toFixed(1)} APG`,
      color: 'from-purple-500 to-pink-600'
    },
    {
      icon: <Target className="w-5 h-5" />,
      text: `${getPlayerName(rebLeader.player_id)} dominates rebounds`,
      value: `${rebLeader.reb.toFixed(1)} RPG`,
      color: 'from-blue-500 to-cyan-600'
    },
    {
      icon: <TrendingUp className="w-5 h-5" />,
      text: `${getPlayerName(tovLowest.player_id)} most careful with ball`,
      value: `${tovLowest.turnover.toFixed(1)} TOV`,
      color: 'from-green-500 to-emerald-600'
    }
  ]

  return (
    <Card className="bg-white/10 backdrop-blur-xl border-white/20 shadow-2xl">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Award className="w-6 h-6 text-orange-400" />
          Key Insights
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {insights.map((insight, index) => (
            <div
              key={index}
              className="flex items-center gap-3 p-4 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 transition-all"
            >
              <div className={`p-2 bg-gradient-to-br ${insight.color} rounded-lg`}>
                {insight.icon}
              </div>
              <div className="flex-1">
                <p className="text-white/90 text-sm font-medium">{insight.text}</p>
                <p className="text-white/60 text-xs">{insight.value}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

