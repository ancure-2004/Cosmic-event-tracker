import React, { useState } from 'react'
import { Filter as FilterIcon, X, Calendar, SortAsc, SortDesc, AlertTriangle } from 'lucide-react'

const Filter = ({ onFiltersChange, currentFilters = {} }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [localFilters, setLocalFilters] = useState({
    hazardousOnly: false,
    sortBy: '',
    startDate: '',
    endDate: '',
    ...currentFilters
  })

  const sortOptions = [
    { value: '', label: 'Default Order' },
    { value: 'approach_date_asc', label: 'Approach Date (Earliest)' },
    { value: 'approach_date_desc', label: 'Approach Date (Latest)' },
    { value: 'diameter_asc', label: 'Diameter (Smallest)' },
    { value: 'diameter_desc', label: 'Diameter (Largest)' },
    { value: 'distance_asc', label: 'Distance (Closest)' },
    { value: 'distance_desc', label: 'Distance (Farthest)' },
  ]

  const handleFilterChange = (key, value) => {
    const newFilters = { ...localFilters, [key]: value }
    setLocalFilters(newFilters)
    onFiltersChange(newFilters)
  }

  const clearFilters = () => {
    const clearedFilters = {
      hazardousOnly: false,
      sortBy: '',
      startDate: '',
      endDate: ''
    }
    setLocalFilters(clearedFilters)
    onFiltersChange(clearedFilters)
  }

  const hasActiveFilters = () => {
    return localFilters.hazardousOnly || 
           localFilters.sortBy || 
           localFilters.startDate || 
           localFilters.endDate
  }

  const getActiveFilterCount = () => {
    let count = 0
    if (localFilters.hazardousOnly) count++
    if (localFilters.sortBy) count++
    if (localFilters.startDate || localFilters.endDate) count++
    return count
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`btn-secondary flex items-center space-x-2 relative text-cosmic-gold ${
          hasActiveFilters() ? 'ring-2 ring-white' : ''
        }`}
      >
        <FilterIcon className="h-4 w-4" />
        <span className='text-cosmic-gold'>Filters</span>
        {hasActiveFilters() && (
          <span className="absolute -top-2 -right-2 bg-cosmic-purple text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
            {getActiveFilterCount()}
          </span>
        )}
      </button>

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute top-full left-0 mt-2 w-80 bg-gray-900 rounded-lg border border-white/20 shadow-xl z-20">
            <div className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-white">Filter Options</h3>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-gray-400 hover:text-white"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="space-y-4">
                {/* Hazardous Filter */}
                <div>
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={localFilters.hazardousOnly}
                      onChange={(e) => handleFilterChange('hazardousOnly', e.target.checked)}
                      className="h-4 w-4 text-cosmic-purple bg-white/10 border-white/30 rounded focus:ring-cosmic-purple"
                    />
                    <div className="flex items-center space-x-2">
                      <AlertTriangle className="h-4 w-4 text-red-400" />
                      <span className="text-white text-sm">Potentially Hazardous Only</span>
                    </div>
                  </label>
                </div>

                {/* Sort Options */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Sort By
                  </label>
                  <select
                    value={localFilters.sortBy}
                    onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                    className="w-full p-3 rounded-lg border-2 border-gray-200/50 dark:border-gray-700/50 bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm focus:border-blue-500 dark:focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all duration-300 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 text-sm group-hover:shadow-lg"
                  >
                    {sortOptions.map((option) => (
                      <option key={option.value} value={option.value} className="bg-gray-800">
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Date Range */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Date Range (Optional)
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-xs text-gray-400 mb-1">From</label>
                      <input
                        type="date"
                        value={localFilters.startDate}
                        onChange={(e) => handleFilterChange('startDate', e.target.value)}
										    className="w-full p-3 rounded-lg border-2 border-gray-200/50 dark:border-gray-700/50 bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm focus:border-blue-500 dark:focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all duration-300 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 text-sm group-hover:shadow-lg"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-400 mb-1">To</label>
                      <input
                        type="date"
                        value={localFilters.endDate}
                        onChange={(e) => handleFilterChange('endDate', e.target.value)}
                        className="w-full p-3 rounded-lg border-2 border-gray-200/50 dark:border-gray-700/50 bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm focus:border-blue-500 dark:focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all duration-300 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 text-sm group-hover:shadow-lg"
                      />
                    </div>
                  </div>
                </div>

                {/* Clear Filters */}
                {hasActiveFilters() && (
                  <div className="pt-2 border-t border-white/10">
                    <button
                      onClick={clearFilters}
                      className="w-full btn-secondary text-sm"
                    >
                      Clear All Filters
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default Filter