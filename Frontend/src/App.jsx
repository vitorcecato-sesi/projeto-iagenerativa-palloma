import { BrowserRouter, Routes, Route } from 'react-router-dom'

import './App.css'

import Expectativas from './pages/Expectativas.jsx'

function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Expectativas />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
