import { BrowserRouter, Routes, Route } from 'react-router-dom'

import './App.css'

import Home from "./pages/Home.jsx"
import Login from './pages/Login.jsx'
import AssistenteIA from './pages/AssistenteIA.jsx'
import Expectativas from './pages/Expectativas.jsx'

function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Home/>} />
          <Route path='/login' element={<Login />} />
          <Route path='/assistente' element={<AssistenteIA />} />
          <Route path='/expectativas' element={<Expectativas />} />
          <Route path='/sobrenos' element={<SobreNos />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
