import React, { createContext, useContext, useState, useCallback } from 'react'
import { fetchNEOData, fetchNEODetails } from '../services/nasaAPI'

const NEOContext = createContext()

export const useNEO = () => {
  const context = useContext(NEOContext)
  if (!context) {
    throw new Error('useNEO must be used within a NEOProvider')
  }
  return context
}

export const NEOProvider = ({ children }) => {
  const [neoData, setNeoData] = useState({})
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [selectedNEOs, setSelectedNEOs] = useState([])
  const [selectedNEODetails, setSelectedNEODetails] = useState(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [dateRange, setDateRange] = useState({
    start: new Date().toISOString().split('T')[0],
    end: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  })

  const loadNEOData = useCallback(async (startDate, endDate, append = false) => {
    setLoading(true)
    setError(null)

    try {
      const data = await fetchNEOData(startDate, endDate)
      
      if (append) {
        setNeoData(prev => ({
          ...prev,
          ...data.near_earth_objects
        }))
      } else {
        setNeoData(data.near_earth_objects || {})
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch NEO data')
      console.error('Error fetching NEO data:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  const loadMoreData = useCallback(async () => {
    const currentEndDate = new Date(dateRange.end)
    const newStartDate = new Date(currentEndDate.getTime() + 24 * 60 * 60 * 1000)
    const newEndDate = new Date(newStartDate.getTime() + 7 * 24 * 60 * 60 * 1000)

    const newStartDateStr = newStartDate.toISOString().split('T')[0]
    const newEndDateStr = newEndDate.toISOString().split('T')[0]

    await loadNEOData(newStartDateStr, newEndDateStr, true)
    
    setDateRange(prev => ({
      ...prev,
      end: newEndDateStr
    }))
  }, [dateRange.end, loadNEOData])

  const toggleNEOSelection = useCallback((neo) => {
    setSelectedNEOs(prev => {
      const isSelected = prev.some(selected => selected.id === neo.id)
      if (isSelected) {
        return prev.filter(selected => selected.id !== neo.id)
      } else {
        return [...prev, neo]
      }
    })
  }, [])

  const clearSelectedNEOs = useCallback(() => {
    setSelectedNEOs([])
  }, [])

  const openNEODetails = useCallback(async (neo) => {
    setLoading(true)
    try {
      // For detailed view, we can fetch additional data if needed
      // const details = await fetchNEODetails(neo.neo_reference_id)
      setSelectedNEODetails(neo) // For now, just use the existing data
      setModalOpen(true)
    } catch (err) {
      setError(err.message || 'Failed to fetch NEO details')
    } finally {
      setLoading(false)
    }
  }, [])

  const closeNEODetails = useCallback(() => {
    setModalOpen(false)
    setSelectedNEODetails(null)
  }, [])

  const getAllNEOs = useCallback(() => {
    const allNEOs = []
    Object.keys(neoData).forEach(date => {
      neoData[date].forEach(neo => {
        allNEOs.push({
          ...neo,
          approach_date: date
        })
      })
    })
    return allNEOs
  }, [neoData])

  const getFilteredNEOs = useCallback((filters = {}) => {
    let neos = getAllNEOs()

    if (filters.hazardousOnly) {
      neos = neos.filter(neo => neo.is_potentially_hazardous_asteroid)
    }

    if (filters.sortBy) {
      neos.sort((a, b) => {
        switch (filters.sortBy) {
          case 'approach_date_asc':
            return new Date(a.close_approach_data[0].close_approach_date) - new Date(b.close_approach_data[0].close_approach_date)
          case 'approach_date_desc':
            return new Date(b.close_approach_data[0].close_approach_date) - new Date(a.close_approach_data[0].close_approach_date)
          case 'diameter_asc':
            return a.estimated_diameter.kilometers.estimated_diameter_max - b.estimated_diameter.kilometers.estimated_diameter_max
          case 'diameter_desc':
            return b.estimated_diameter.kilometers.estimated_diameter_max - a.estimated_diameter.kilometers.estimated_diameter_max
          case 'distance_asc':
            return parseFloat(a.close_approach_data[0].miss_distance.kilometers) - parseFloat(b.close_approach_data[0].miss_distance.kilometers)
          case 'distance_desc':
            return parseFloat(b.close_approach_data[0].miss_distance.kilometers) - parseFloat(a.close_approach_data[0].miss_distance.kilometers)
          default:
            return 0
        }
      })
    }

    return neos
  }, [getAllNEOs])

  const value = {
    neoData,
    loading,
    error,
    selectedNEOs,
    selectedNEODetails,
    modalOpen,
    dateRange,
    loadNEOData,
    loadMoreData,
    toggleNEOSelection,
    clearSelectedNEOs,
    openNEODetails,
    closeNEODetails,
    getAllNEOs,
    getFilteredNEOs,
    setDateRange
  }

  return (
    <NEOContext.Provider value={value}>
      {children}
    </NEOContext.Provider>
  )
}