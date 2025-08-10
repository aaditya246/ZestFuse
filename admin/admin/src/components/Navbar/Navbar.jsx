import React from 'react'
import './Navbar.css'
import { assets } from './../../assets/assets';

const Navbar = () => {
  return (
    <div className='navbar'>
        <h1 style={{ color: 'orange', margin: 0 }}>Zestfuse</h1>
        <img src={assets.profile_image} alt="" className="profile" />
    </div>
  )
}

export default Navbar   