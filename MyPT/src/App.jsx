import { useState } from 'react'
import './style/globals.css'
import { BrowserRouter, Routes, Route} from 'react-router-dom'
import Header from './componenets/shared/Header'
import Footer from './componenets/shared/Footer'


function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <BrowserRouter>
      <Header />
        <Routes>
          {/* <Route path='/' element={<HomePage />} />
          <Route path='/diet' element={<Diet />} />
          <Route path='/workout' element={<Workout />} />
          <Route path='/progress' element={<Progress />} /> */}
        </Routes>
        <Footer />
      </BrowserRouter>
    </>
  )
}

export default App
