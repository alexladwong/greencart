import React from 'react'
import { categories } from '../assets/assets'
import { useAppContext } from '../context/AppContext'

const Categories = () => {

    const {navigate} = useAppContext()

  return (
    <div className='mt-12 md:mt-4'>
      <p className='text-2xl md:text-3xl font-medium'>Categories</p>
      <div className='grid grid-cols-2 max-w-8xl mx-auto max-h-2xl sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-4 xl:grid-cols-7 mt-4 md:mt-6 gap-2 md:gap-4'>

        {categories.map((category, index)=>(
            <div key={index} className='group cursor-pointer py-1 md:py-1 px-1.5 gap-2 rounded-tl-4xl rounded-tr-4xl flex flex-col justify-center items-center text-center max-h-27'
            style={{backgroundColor: category.bgColor}}
            onClick={()=>{
                navigate(`/products/${category.path.toLowerCase()}`);
                scrollTo(0,0)
            }}
            >
                <img src={category.image} alt={category.text} className='group-hover:scale-108 transition max-w-16 md:max-w-20'/>
                <p className='text-sm font-medium leading-5'>{category.text}</p>
            </div>
                    
        ))}

        
      </div>
    </div>
  )
}

export default Categories
