import { BrowserRouter, Routes, Route } from 'react-router-dom'

import './App.css'

import Login from './pages/Login.jsx'
import AssistenteIA from './pages/AssistenteIA.jsx'
import Expectativas from './pages/Expectativas.jsx'

function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Login />} />
          <Route path='/home' element={<AssistenteIA />} />
          <Route path='/expectativas' element={<Expectativas />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
