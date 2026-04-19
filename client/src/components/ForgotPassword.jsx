import React from 'react'
import { useAppContext } from '../context/AppContext';
import toast from 'react-hot-toast';

const ForgotPassword = () => {

    const {setShowForgotPassword, axios} = useAppContext()
    const [email, setEmail] = React.useState("");
    const [isSubmitted, setIsSubmitted] = React.useState(false);
    const [isLoading, setIsLoading] = React.useState(false);

    const onSubmitHandler = async (event)=>{
        try {
            event.preventDefault();
            setIsLoading(true);

            const {data} = await axios.post(`/api/user/forgot-password`,{
                email
            });
            if (data.success){
                setIsSubmitted(true);
                toast.success(data.message)
            }else{
                toast.error(data.message)
            }

        } catch (error) {
            toast.error(error.message)
        } finally {
            setIsLoading(false);
        }
    }

  return (
    <div onClick={()=> setShowForgotPassword(false)} className='fixed top-0 bottom-0 left-0 right-0 z-30 flex items-center text-sm text-gray-600 bg-black/50'>

      <form onSubmit={onSubmitHandler} onClick={(e)=>e.stopPropagation()} className="flex flex-col gap-4 m-auto items-start p-8 py-12 w-80 sm:w-[352px] rounded-lg shadow-xl border border-gray-200 bg-white">
            <p className="text-2xl font-medium m-auto">
                <span className="text-primary">Forgot</span> Password
            </p>
            
            {!isSubmitted ? (
                <>
                    <p className="text-gray-500 text-center w-full">
                        Enter your email address and we'll send you a link to reset your password.
                    </p>
                    <div className="w-full">
                        <p>Email</p>
                        <input onChange={(e) => setEmail(e.target.value)} value={email} placeholder="type here" className="border border-gray-200 rounded w-full p-2 mt-1 outline-primary" type="email" required />
                    </div>
                    <button disabled={isLoading} className="bg-primary hover:bg-primary-dull transition-all text-white w-full py-2 rounded-md cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                        {isLoading ? (
                            <>
                                <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Sending...
                            </>
                        ) : (
                            'Send Reset Link'
                        )}
                    </button>
                </>
            ) : (
                <div className="text-center w-full">
                    <p className="text-green-600 font-medium mb-4">
                        ✓ Password reset email sent!
                    </p>
                    <p className="text-gray-500 text-sm">
                        Check your email inbox for the reset link. The link will expire in 30 minutes.
                    </p>
                </div>
            )}
            
            <p className="text-center w-full mt-4">
                Remember your password? <span onClick={() => setShowForgotPassword(false)} className="text-primary cursor-pointer">Back to Login</span>
            </p>
        </form>
    </div>
  )
}

export default ForgotPassword
