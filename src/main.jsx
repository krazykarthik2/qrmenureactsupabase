import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import './firebase.js'
import { BrowserRouter } from 'react-router-dom'
import { MenuProvider } from './hooks/useSupabaseMenu.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <MenuProvider>
        <App />
      </MenuProvider>
    </BrowserRouter>
  </React.StrictMode>,
)
