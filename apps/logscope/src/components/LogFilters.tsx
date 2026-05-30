import { useState } from 'react'
import { LogLevel, LogFilter } from '../types/log'
import { cn } from '@repo/utils'

const LEVELS: LogLevel[] = ['debug', 'info', 'warn', 'error', 'fatal']
const SERVICES = ['api', 'worker', 'web', 'auth', 'billing']

type LogFiltersProps = {
  filter: LogFilter
  onChange: (filter: LogFilter) => void
  logCount: number
}

export function LogFilters({ filter, onChange, logCount }: LogFiltersProps) {
  const toggleLevel = (level: LogLevel) => {
    const levels = filter.level || []
    const newLevels = levels.includes(level)
    ? levels.filter(l => l!== level)
      : [...levels, level]
    onChange({...filter, level: newLevels.length? newLevels : undefined })
  }

  const toggleService = (service: string) => {
    const services = filter.service || []
    const newServices = services.includes(service)
    ? services.filter(s => s!== service)
      : [...services, service]
    onChange({...filter, service: newServices.length? newServices : undefined })
  }

  return (
    <div className="bg-white border rounded-lg p-4 mb-4">
      <div className="flex items-center justify-between mb-4">
        <input
          type="text"
          placeholder="Search logs... (supports regex)"
          value={filter.search || ''}
          onChange={e => onChange({...filter, search: e.target.value || undefined })}
          className="flex-1 px-3 py-2 border rounded text-sm"
        />
        <span className="ml-4 text-sm text-gray-600">
          {logCount.toLocaleString()} logs
        </span>
      </div>

      <div className="flex gap-6">
        <div>
          <p className="text-xs font-medium text-gray-700 mb-2">Level</p>
          <div className="flex gap-1">
            {LEVELS.map(level => (
              <button
                key={level}
                onClick={() => toggleLevel(level)}
                className={cn(
                  'px-2 py-1 text-xs rounded uppercase',
                  filter.level?.includes(level)
                ? 'bg-gray-900 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                )}
              >
                {level}
              </button>
            ))}
          </div>
        </div>

        <div>
          <p className="text-xs font-medium text-gray-700 mb-2">Service</p>
          <div className="flex gap-1">
            {SERVICES.map(service => (
              <button
                key={service}
                onClick={() => toggleService(service)}
                className={cn(
                  'px-2 py-1 text-xs rounded',
                  filter.service?.includes(service)
                ? 'bg-purple-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                )}
              >
                {service}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}