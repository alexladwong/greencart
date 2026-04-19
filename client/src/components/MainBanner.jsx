import React from 'react'
import { assets } from '../assets/assets'
import { Link } from 'react-router-dom'

const MainBanner = () => {
  return (
    <div className='relative overflow-hidden rounded-3xl bg-primary/5 mt-2 md:mt-4'>
      <img src={assets.main_banner_bg} alt="banner" className='hidden w-full md:block max-h-[280px] object-cover object-center'/>
      <img src={assets.main_banner_bg_sm} alt="banner" className='h-[250px] w-full object-cover object-center md:hidden'/>

      <div className='absolute inset-0 flex flex-col items-center md:items-start justify-end md:justify-center pb-12 md:pb-0 px-5 md:pl-18 lg:pl-24'>
        <h1 className='text-3xl md:text-4xl lg:text-5xl font-bold text-center md:text-left max-w-[290px] md:max-w-80 lg:max-w-105 leading-tight lg:leading-15 text-slate-800'
        >Freshness You Can Trust, Savings You will Love! </h1>
      

      <div className='flex items-center mt-6 font-medium'>
        <Link to={"/products"} className='group flex items-center gap-2 px-6 md:px-9 py-3 bg-primary hover:bg-primary-dull transition rounded-xl text-white cursor-pointer shadow-sm'>
        Shop now
        <img className='md:hidden transition group-focus:translate-x-1' src={assets.white_arrow_icon} alt="arrow" />
        </Link>

        <Link to={"/products"} className='group hidden md:flex items-center gap-2 px-9 py-3 cursor-pointer'>
        Explore deals
        <img className='transition group-hover:translate-x-1' src={assets.black_arrow_icon} alt="arrow" />
        </Link>
      </div>
      </div>
    </div>
  )
}

export default MainBanner
