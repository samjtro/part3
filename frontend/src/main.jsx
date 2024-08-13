import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'

const persons = [
  { 
    id: 1,
    name: 'Arto Hellas',
    phone: 310
  }
]

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App persons={persons}/>
  </React.StrictMode>,
)
