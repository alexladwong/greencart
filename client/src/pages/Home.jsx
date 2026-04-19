import React from 'react'
import MainBanner from '../components/MainBanner'
import Categories from '../components/Categories'
import BestSeller from '../components/BestSeller'
import BottomBanner from '../components/BottomBanner'
import NewsLetter from '../components/NewsLetter'
import { HeroSkeleton, ProductsGridSkeleton } from '../components/Skeletons'
import { useAppContext } from '../context/AppContext'

const Home = () => {
  const { isLoading } = useAppContext()

  return (
    <div className='mt-6 md:mt-10'>
      {isLoading ? (
        <>
          <HeroSkeleton />
          <Categories />
          <div className='mt-12 md:mt-16'>
            <p className='text-2xl md:text-3xl font-medium'>Best Sellers</p>
            <ProductsGridSkeleton count={5} />
          </div>
        </>
      ) : (
        <>
          <MainBanner />
          <Categories />
          <BestSeller />
          <BottomBanner/>
          <NewsLetter />
        </>
      )}
    </div>
  )
}

export default Home
