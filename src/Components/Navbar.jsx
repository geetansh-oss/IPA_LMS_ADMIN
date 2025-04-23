import React from 'react'
import Avatar from '@mui/material/Avatar';
import { Heart, ShoppingCart } from 'lucide-react';
import Logo from '../assets/logo.png'
import { Link } from 'react-router-dom';

const Navbar = () => {

const logOut = () =>{
  return;
}

  return (
    <div className='w-full px-5 xl:px-10 py-2 flex justify-center mb-2 fixed top-0 left-0 z-10 bg-white' id='Navbar'>
      <div className='w-full flex flex-col gap-10 justify-between items-center lg:flex-row  lg:justify-center xl:gap-7'>
        <Link className='flex flex-1 w-full items-center gap-3' to={'/'}>
          <img src={Logo} alt="" className='h-20' />
          <h1 className='text-2xl font-semibold'>IPA EDUCATION ACADEMY</h1>
        </Link>
        <div className='hidden flex-1 gap-5 xl:flex  lg:justify-end lg:items-center'>
          <Link className='font-SubHeading text-lg' to={'/demo'}>Demo</Link>
          <Link className='font-SubHeading text-lg' to={'/courses'}>Courses</Link>
          <Link className='font-SubHeading text-lg' to={'/contactUs'}>Contact Us</Link>
          <Heart />
          <Link className='font-SubHeading text-lg' to={'/cart'}><ShoppingCart/></Link>
          <div className='hidden lg:flex gap-3'>
            <Avatar alt="Remy Sharp" src="/static/images/avatar/1.jpg" /> 
            <Link to={"/login"} className='bg-black py-1 px-4 rounded-md text-white' onClick={logOut()} >Login</Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Navbar