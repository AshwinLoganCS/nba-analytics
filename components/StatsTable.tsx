'use client'

import { useState } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Card } from '@/components/ui/card'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react'
import { type Player, type SeasonAverage } from '@/lib/api'

interface StatsTableProps {
  players: Player[]
  averages: SeasonAverage[]
}

export function StatsTable({ players, averages }: StatsTableProps) {
  const [sortColumn, setSortColumn] = useState<string | null>(null)
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc')

  if (players.length === 0 || averages.length === 0) {
    return null
  }

  const stats = [
    { label: 'Points', key: 'pts' as const, tooltip: 'Points Per Game' },
    { label: 'Rebounds', key: 'reb' as const, tooltip: 'Rebounds Per Game' },
    { label: 'Assists', key: 'ast' as const, tooltip: 'Assists Per Game' },
    { label: 'Steals', key: 'stl' as const, tooltip: 'Steals Per Game' },
    { label: 'Blocks', key: 'blk' as const, tooltip: 'Blocks Per Game' },
    { label: 'Turnovers', key: 'turnover' as const, tooltip: 'Turnovers Per Game' },
    { label: 'FG%', key: 'fg_pct' as const, format: (v: number) => `${(v * 100).toFixed(1)}%`, tooltip: 'Field Goal Percentage' },
    { label: '3PT%', key: 'fg3_pct' as const, format: (v: number) => `${(v * 100).toFixed(1)}%`, tooltip: '3-Point Percentage' },
    { label: 'FT%', key: 'ft_pct' as const, format: (v: number) => `${(v * 100).toFixed(1)}%`, tooltip: 'Free Throw Percentage' },
  ]

  const getAverage = (playerId: number) => {
    return averages.find((avg) => avg.player_id === playerId)
  }

  const handleSort = (key: string) => {
    if (sortColumn === key) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortColumn(key)
      setSortDirection('desc')
    }
  }

  // Sort players based on the selected column
  let sortedPlayers = [...players]
  if (sortColumn) {
    sortedPlayers.sort((a, b) => {
      const avgA = getAverage(a.id)
      const avgB = getAverage(b.id)
      const valueA = (avgA?.[sortColumn as keyof SeasonAverage] as number) ?? 0
      const valueB = (avgB?.[sortColumn as keyof SeasonAverage] as number) ?? 0
      
      if (sortDirection === 'asc') {
        return valueA - valueB
      }
      return valueB - valueA
    })
  }

  const formatValue = (
    value: number,
    formatter?: (v: number) => string
  ): string => {
    if (formatter) {
      return formatter(value)
    }
    return value.toFixed(1)
  }

  return (
    <TooltipProvider>
      <Card className="overflow-hidden bg-white/10 backdrop-blur-xl border-white/20 shadow-2xl">
        <Table>
          <TableHeader>
            <TableRow className="border-white/10">
              <TableHead className="w-32 text-white/90 font-semibold">Stat</TableHead>
              {sortedPlayers.map((player) => (
                <TableHead key={player.id} className="text-center text-white/90 font-semibold">
                  {player.first_name} {player.last_name}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {stats.map((stat) => (
              <TableRow key={stat.key} className="border-white/5 hover:bg-white/5 transition-colors">
                <TableCell className="font-medium text-white/80">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        onClick={() => handleSort(stat.key)}
                        className="flex items-center gap-2 hover:text-white transition-colors cursor-pointer"
                      >
                        {stat.label}
                        {sortColumn === stat.key ? (
                          sortDirection === 'asc' ? (
                            <ArrowUp className="w-4 h-4" />
                          ) : (
                            <ArrowDown className="w-4 h-4" />
                          )
                        ) : (
                          <ArrowUpDown className="w-4 h-4 opacity-40" />
                        )}
                      </button>
                    </TooltipTrigger>
                    <TooltipContent className="bg-slate-800 border-slate-700 text-white">
                      <p>{stat.tooltip}</p>
                    </TooltipContent>
                  </Tooltip>
                </TableCell>
                {sortedPlayers.map((player) => {
                  const avg = getAverage(player.id)
                  const value = avg?.[stat.key] ?? 0
                  return (
                    <TableCell key={player.id} className="text-center text-white">
                      {value !== null && value !== undefined
                        ? formatValue(value, stat.format)
                        : 'N/A'}
                    </TableCell>
                  )
                })}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </TooltipProvider>
  )
}

