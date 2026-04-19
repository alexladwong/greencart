import React, { useEffect, useState } from 'react'
import { useAppContext } from '../../context/AppContext'
import toast from 'react-hot-toast';
import { assets } from '../../assets/assets';

const SellerLogin = () => {
    const {isSeller, setIsSeller, navigate, axios} = useAppContext()
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const onSubmitHandler = async (event)=>{
        try {
            event.preventDefault();
            setIsLoading(true);
            const {data} = await axios.post('/api/seller/login', {email, password})
            if(data.success){
                setIsSeller(true)
                navigate('/authxseller')
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
        if(isSeller){
            navigate("/authxseller")
        }
    },[isSeller])

  return !isSeller && (
    <form onSubmit={onSubmitHandler} className='min-h-screen flex items-center text-sm text-gray-600'>

        <div className='flex flex-col gap-5 m-auto items-start p-8 py-12 min-w-80 sm:min-w-88 rounded-lg shadow-xl border border-gray-200'>
            <div className='m-auto cursor-pointer' onClick={() => navigate('/')}>
                <img src={assets.logo} alt="GreenCart Logo" className='w-24 md:w-32' />
            </div>
            <p className='text-2xl font-medium m-auto'><span className="text-primary">Seller</span> Login</p>
            <div className="w-full ">
                <p>Email</p>
                <input onChange={(e)=>setEmail(e.target.value)} value={email}
                 type="email" placeholder="enter you email" 
                className="border border-gray-200 rounded w-full p-2 mt-1 outline-primary" required/>
            </div>
            <div className="w-full ">
                <p>Password</p>
                <input onChange={(e)=>setPassword(e.target.value)} value={password}
                 type="password" placeholder="enter your password"
                className="border border-gray-200 rounded w-full p-2 mt-1 outline-primary" required/>
            </div>
            <button disabled={isLoading} className="bg-primary text-white w-full py-2 rounded-md cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                {isLoading ? (
                    <>
                        <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Logging in...
                    </>
                ) : (
                    'Login'
                )}
            </button>
        </div>

    </form>
  )
}

export default SellerLogin
