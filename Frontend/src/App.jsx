import { BrowserRouter, Routes, Route } from 'react-router-dom'

import './App.css'

import Login from './pages/Login.jsx'
import AssistenteIA from './pages/AssistenteIA.jsx'

function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Login />} />
          <Route path='/assistente' element={<AssistenteIA />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
