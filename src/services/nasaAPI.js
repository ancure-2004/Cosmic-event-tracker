import axios from 'axios'

const NASA_API_KEY = import.meta.env.VITE_NASA_API_KEY

const NASA_BASE_URL = 'https://api.nasa.gov'

const api = axios.create({
  baseURL: NASA_BASE_URL,
  timeout: 10000,
})

// Add request interceptor to include API key
api.interceptors.request.use((config) => {
  config.params = {
    ...config.params,
    api_key: NASA_API_KEY
  }
  return config
})

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('NASA API Error:', error.response?.data || error.message)
    
    if (error.response?.status === 403) {
      throw new Error('API key is invalid or rate limit exceeded. Please check your NASA API key.')
    }
    
    if (error.response?.status === 429) {
      throw new Error('API rate limit exceeded. Please try again later.')
    }
    
    throw new Error(error.response?.data?.error?.message || error.message || 'Failed to fetch data from NASA API')
  }
)

export const fetchNEOData = async (startDate, endDate) => {
  try {
    const response = await api.get('/neo/rest/v1/feed', {
      params: {
        start_date: startDate,
        end_date: endDate
      }
    })
    
    return response.data
  } catch (error) {
    console.error('Error fetching NEO data:', error)
    throw error
  }
}

export const fetchNEODetails = async (neoId) => {
  try {
    const response = await api.get(`/neo/rest/v1/neo/${neoId}`)
    return response.data
  } catch (error) {
    console.error('Error fetching NEO details:', error)
    throw error
  }
}

export const formatNEOData = (neo) => {
  const closeApproach = neo.close_approach_data?.[0] || {}
  const diameter = neo.estimated_diameter?.kilometers || {}
  
  return {
    id: neo.id,
    name: neo.name,
    neo_reference_id: neo.neo_reference_id,
    nasa_jpl_url: neo.nasa_jpl_url,
    is_potentially_hazardous_asteroid: neo.is_potentially_hazardous_asteroid,
    estimated_diameter_min: diameter.estimated_diameter_min || 0,
    estimated_diameter_max: diameter.estimated_diameter_max || 0,
    estimated_diameter_avg: ((diameter.estimated_diameter_min || 0) + (diameter.estimated_diameter_max || 0)) / 2,
    close_approach_date: closeApproach.close_approach_date,
    close_approach_date_full: closeApproach.close_approach_date_full,
    relative_velocity_kmh: parseFloat(closeApproach.relative_velocity?.kilometers_per_hour || 0),
    relative_velocity_kms: parseFloat(closeApproach.relative_velocity?.kilometers_per_second || 0),
    miss_distance_km: parseFloat(closeApproach.miss_distance?.kilometers || 0),
    miss_distance_au: parseFloat(closeApproach.miss_distance?.astronomical || 0),
    miss_distance_lunar: parseFloat(closeApproach.miss_distance?.lunar || 0),
    orbiting_body: closeApproach.orbiting_body || 'Earth'
  }
}

export const formatDistance = (kilometers) => {
  const km = parseFloat(kilometers)
  
  if (km > 1000000) {
    return `${(km / 1000000).toFixed(2)} million km`
  } else if (km > 1000) {
    return `${(km / 1000).toFixed(0)} thousand km`
  } else {
    return `${km.toFixed(0)} km`
  }
}

export const formatVelocity = (kmh) => {
  const velocity = parseFloat(kmh)
  return `${velocity.toLocaleString()} km/h`
}

export const formatDiameter = (km) => {
  const diameter = parseFloat(km)
  
  if (diameter >= 1) {
    return `${diameter.toFixed(2)} km`
  } else {
    return `${(diameter * 1000).toFixed(0)} m`
  }
}