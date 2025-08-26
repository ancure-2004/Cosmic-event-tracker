import React from 'react'
import { Telescope, Github, ExternalLink, LinkedinIcon } from 'lucide-react'

const Footer = () => {
  return (
    <footer className="bg-gray-900/80 backdrop-blur-sm border-t border-white/10 mt-auto">
      <div className="mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-gradient-to-r from-cosmic-blue to-cosmic-purple rounded-lg">
                <Telescope className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white">Cosmic Tracker</span>
            </div>
            <p className="text-gray-400 text-sm">
              Track Near-Earth Objects and monitor cosmic events with real-time NASA data. 
              Explore the universe from your browser.
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">About</h3>
            <div className="space-y-2">
              <p className="text-gray-400 text-sm">
                Built with React, NASA APIs, and modern web technologies for exploring our cosmic neighborhood.
              </p>
              <div className="flex items-center space-x-2 text-cosmic-gold">
                <Github className="h-4 w-4" />
                <span className="text-lg font-medium">Developed by @Ankur Tyagi</span>
              </div>
            </div>
          </div>

          <div>
            <ul>
              <a href='https://www.linkedin.com/in/ankur-tyagi-/' target="_blank" rel="noopener noreferrer">
                <li>
                  <LinkedinIcon className="inline h-5 w-5 text-cosmic-blue mr-2" />
                  <span className="text-gray-400 hover:text-white text-sm">Connect on LinkedIn</span>
                </li>
              </a>
              <a href='https://github.com/ancure-2004' target="_blank" rel="noopener noreferrer">
                <li>
                  <Github className="inline h-5 w-5 text-cosmic-blue mr-2" />
                  <span className="text-gray-400 hover:text-white text-sm">Connect on GitHub</span>
                </li>
              </a>
              <a href='https://ankurtyagi.vercel.app/' target="_blank" rel="noopener noreferrer">
                <li>
                  <ExternalLink className="inline h-5 w-5 text-cosmic-blue mr-2" />
                  <span className="text-gray-400 hover:text-white text-sm">My Portfolio</span>
                </li>
              </a>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-6 border-t border-white/10">
          <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
            <p className="text-gray-500 text-xs">
              © {new Date().getFullYear()} Cosmic Event Tracker. Data provided by NASA Open Data API.
            </p>
            <div className="flex items-center space-x-4 text-xs text-gray-500">
              <span>Last updated: {new Date().toLocaleDateString()}</span>
              <span>•</span>
              <span>React Take-Home Assignment</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer