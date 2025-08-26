import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { NEOProvider } from './contexts/NeoContext'
import Header from './components/Header'
import Footer from './components/Footer'
import AuthModal from './components/AuthModal'
import EventDetailModal from './components/EventDetailModal'
import HomePage from './pages/HomePage'
import Compare from './pages/Compare'
import NotFound from './pages/NotFound'
import './index.css' // Assuming you have Tailwind CSS setup

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <NEOProvider>
          <div className="min-h-screen bg-cosmic-black flex flex-col">

            {/* Main Layout */}
            <Header />
            
            <main className="flex-1 relative z-10">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/compare" element={<Compare />} />
                <Route path="/event/:id" element={<EventDetailPage />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>

            <Footer />

            {/* Modals */}
            <AuthModal />
            <EventDetailModal />
          </div>
        </NEOProvider>
      </AuthProvider>
    </Router>
  )
}

// Simple Event Detail Page component (alternative to modal)
const EventDetailPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { getAllNEOs } = useNEO()
  
  const neo = getAllNEOs().find(n => n.id === id)
  
  if (!neo) {
    return <NotFound />
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-cosmic-gold hover:text-white transition-colors mb-6"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Back to Events
        </button>
        
        <div className="card p-8">
          <h1 className="text-3xl font-bold text-white mb-6">{neo.name}</h1>
          
          {/* Detailed content would go here */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left column - Basic info */}
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-white mb-3">Basic Information</h3>
                {/* Add detailed NEO information */}
              </div>
            </div>
            
            {/* Right column - Approach data */}
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-white mb-3">Approach Data</h3>
                {/* Add approach information */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App