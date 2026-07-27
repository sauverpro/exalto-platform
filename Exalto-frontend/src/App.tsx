import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'

function App() {
  return (
    <div className="min-h-screen bg-green-50 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-5xl font-bold text-green-700 mb-4">
          Exalto Platform
        </h1>

        <p className="text-gray-600 text-lg">
          Smart Juice and Wine Processing Management System
        </p>

        <button className="mt-6 px-6 py-3 bg-green-700 text-white rounded-lg hover:bg-green-800 transition">
          Explore Products
        </button>
      </div>
    </div>
  );
}

export default App;