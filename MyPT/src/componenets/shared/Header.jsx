import React from 'react'
import '/src/style/globals.css'
import { Link } from 'react-router-dom'


export default function Header() {
  return (
    <header className='container-fluid'>
        <nav className='nav-bar'>
            <Link to="/"><button>Home</button></Link>
            <Link to="/diet"><button>Diet</button></Link>
            <Link to="/workout"><button>Workout</button></Link>
            <Link to="/progress"><button>Progress</button></Link>
        </nav>
    </header>
    
  )
}
