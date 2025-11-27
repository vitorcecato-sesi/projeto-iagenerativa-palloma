import { BrowserRouter, Routes, Route } from 'react-router-dom'

import './App.css'


import AssistenteIA from './pages/AssistenteIA.jsx'

function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<AssistenteIA />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
