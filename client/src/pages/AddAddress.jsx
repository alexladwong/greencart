import React, { useEffect, useState } from 'react'
import { assets } from '../assets/assets'
import { useAppContext } from '../context/AppContext'
import toast from 'react-hot-toast'

// Input Field Component
const InputField = ({ type, placeholder, name, handleChange, address })=>(
    <input className='w-full px-2 py-2.5 border border-gray-500/30 rounded outline-none text-gray-500 focus:border-primary transition'
    type={type}
    placeholder={placeholder}
    onChange={handleChange}
    name={name}
    value={address[name]}
    required
     />
)

const AddAddress = () => {

    const {axios, user, navigate} = useAppContext();

    const [address, setAddress] = useState({
        firstName: '',
        lastName: '',
        email: '',
        street: '',
        city: '',
        state: '',
        zipcode: '',
        country: '',
        phone: '',
    })
    const [isLoading, setIsLoading] = useState(false)

    const handleChange = (e)=>{
        const { name, value } = e.target;

        setAddress((prevAddress)=>({
            ...prevAddress,
            [name]: value,
        }))
        console.log(address);
        
    }



    const onSubmitHandler = async (e)=>{
        e.preventDefault();
        setIsLoading(true);
        try {
            const {data} = await axios.post('/api/address/add', {address});

            if (data.success){
                toast.success(data.message)
                navigate('/cart')
            }else{
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(()=>{
        if(!user){
            navigate('/cart')
        }
    },[])

  return (
    <div className='mt-16 pb-16'>
      <p className='text-2xl md:text-3xl text-gray-500'>Add Shipping <span className='font-semibold text-primary'>Address</span></p>
      <div className='flex flex-col-reverse md:flex-row justify-between mt-10'>
            <div className='flex-1 max-w-md'>
             <form onSubmit={onSubmitHandler} className='space-y-3 mt-6 text-sm'>

                <div className='grid grid-cols-2 gap-4'>
                    <InputField handleChange={handleChange} address={address} name='firstName' type="text" placeholder="First Name"/>
                    <InputField handleChange={handleChange} address={address} name='lastName' type="text" placeholder="Last Name"/>
                </div>

                <InputField handleChange={handleChange} address={address} name='email' type="email" placeholder="Email address" />
                <InputField handleChange={handleChange} address={address} name='street' type="text" placeholder="Street" />

                <div className='grid grid-cols-2 gap-4'>
                    <InputField handleChange={handleChange} address={address} name='city' type="text" placeholder="City" />
                    <InputField handleChange={handleChange} address={address} name='state' type="text" placeholder="State" />
                </div>

                <div className='grid grid-cols-2 gap-4'>
                    <InputField handleChange={handleChange} address={address} name='zipcode' type="number" placeholder="Zip code" />
                    <InputField handleChange={handleChange} address={address} name='country' type="text" placeholder="Country" />
                </div>

                <InputField handleChange={handleChange} address={address} name='phone' type="text" placeholder="Phone" />

                <button disabled={isLoading} className='w-full mt-6 bg-primary text-white py-3 hover:bg-primary-dull transition cursor-pointer uppercase disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2'>
                    {isLoading ? (
                        <>
                            <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Saving...
                        </>
                    ) : (
                        'Save address'
                    )}
                </button>


             </form>
            </div>
            <img className='md:mr-16 mb-16 md:mt-0' src={assets.add_address_iamge} alt="Add Address" />
      </div>
    </div>
  )
}

export default AddAddress
