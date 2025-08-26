import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Home, ArrowLeft, Telescope, AlertCircle } from 'lucide-react'

const NotFound = () => {
  const navigate = useNavigate()

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-2xl mx-auto text-center space-y-8">
        {/* Icon */}
        <div className="relative">
          <div className="inline-flex items-center justify-center w-32 h-32 bg-gradient-to-r from-cosmic-blue to-cosmic-purple rounded-full mb-8">
            <Telescope className="h-16 w-16 text-white" />
          </div>
          <div className="absolute -top-2 -right-2">
            <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
              <AlertCircle className="h-5 w-5 text-white" />
            </div>
          </div>
        </div>

        {/* Error Message */}
        <div className="space-y-4">
          <h1 className="text-6xl font-bold text-white">404</h1>
          <h2 className="text-3xl font-bold text-white">Lost in Space</h2>
          <p className="text-xl text-gray-300 max-w-lg mx-auto">
            The cosmic object you're looking for seems to have drifted into a black hole. 
            Let's navigate you back to familiar territory.
          </p>
        </div>

        {/* Fun Facts */}
        <div className="card p-6 bg-white/5 backdrop-blur-sm">
          <h3 className="text-lg font-semibold text-white mb-3">Did you know?</h3>
          <p className="text-gray-300 text-sm">
            There are over 28,000 known Near-Earth Objects being tracked by NASA. 
            The chances of finding a specific page in the vastness of space are about the same as finding a specific asteroid!
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <button
            onClick={() => navigate('/')}
            className="btn-primary flex items-center space-x-2 min-w-[160px]"
          >
            <Home className="h-5 w-5" />
            <span>Return Home</span>
          </button>
          
          <button
            onClick={() => navigate(-1)}
            className="btn-secondary flex items-center space-x-2 min-w-[160px]"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Go Back</span>
          </button>
        </div>

        {/* Additional Help */}
        <div className="pt-8 border-t border-white/10">
          <p className="text-gray-400 text-sm mb-4">
            If you believe this is an error, try these options:
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-sm">
            <button 
              onClick={() => window.location.reload()} 
              className="text-cosmic-gold hover:text-white transition-colors"
            >
              Refresh the page
            </button>
            <span className="text-gray-600">•</span>
            <button 
              onClick={() => navigate('/')} 
              className="text-cosmic-gold hover:text-white transition-colors"
            >
              Start over
            </button>
            <span className="text-gray-600">•</span>
            <span className="text-gray-500">Check the URL</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default NotFound