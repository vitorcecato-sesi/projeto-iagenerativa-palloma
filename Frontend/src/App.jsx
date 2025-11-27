import { BrowserRouter, Routes, Route } from 'react-router-dom'

import './App.css'
import SobreNosPage from './pages/SobreoGrupo.jsx'

function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<SobreNosPage />} />

        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
