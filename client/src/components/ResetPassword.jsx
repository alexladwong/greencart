import React from 'react'
import { useAppContext } from '../context/AppContext';
import toast from 'react-hot-toast';
import { useParams, useNavigate } from 'react-router-dom';

const ResetPassword = () => {

    const {axios, setUser, setAuthToken} = useAppContext()
    const {token} = useParams()
    const navigate = useNavigate()
    const [password, setPassword] = React.useState("");
    const [confirmPassword, setConfirmPassword] = React.useState("");
    const [showPassword, setShowPassword] = React.useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);
    const [isLoading, setIsLoading] = React.useState(false);

    const onSubmitHandler = async (event)=>{
        try {
            event.preventDefault();

            if (password !== confirmPassword) {
                toast.error("Passwords do not match");
                return;
            }

            if (password.length < 6) {
                toast.error("Password must be at least 6 characters");
                return;
            }

            setIsLoading(true);
            const {data} = await axios.post(`/api/user/reset-password`,{
                token,
                password
            });
            if (data.success){
                toast.success(data.message)
                if (data.token) {
                    setAuthToken(data.token)
                }
                setUser(data.user)
                setTimeout(() => {
                    navigate('/profile')
                }, 1500);
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
    <div className='min-h-screen flex items-center justify-center bg-gray-50 px-4'>

      <form onSubmit={onSubmitHandler} className="flex flex-col gap-4 p-8 py-12 w-full max-w-[352px] rounded-lg shadow-xl border border-gray-200 bg-white">
            <p className="text-2xl font-medium text-center">
                <span className="text-primary">Reset</span> Password
            </p>
            
            <p className="text-gray-500 text-center text-sm">
                Enter your new password below.
            </p>
            
            <div className="w-full">
                <p>New Password</p>
                <div className="relative">
                    <input onChange={(e) => setPassword(e.target.value)} value={password} placeholder="Enter new password" className="border border-gray-200 rounded w-full p-2 mt-1 outline-primary pr-10" type={showPassword ? "text" : "password"} required />
                    <button 
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-500 hover:text-gray-700"
                    >
                        {showPassword ? (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" clipRule="evenodd" />
                                <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z" />
                            </svg>
                        ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                                <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                            </svg>
                        )}
                    </button>
                </div>
            </div>
            
            <div className="w-full">
                <p>Confirm Password</p>
                <div className="relative">
                    <input onChange={(e) => setConfirmPassword(e.target.value)} value={confirmPassword} placeholder="Confirm new password" className="border border-gray-200 rounded w-full p-2 mt-1 outline-primary pr-10" type={showConfirmPassword ? "text" : "password"} required />
                    <button 
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-500 hover:text-gray-700"
                    >
                        {showConfirmPassword ? (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" clipRule="evenodd" />
                                <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z" />
                            </svg>
                        ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                                <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                            </svg>
                        )}
                    </button>
                </div>
            </div>
            
            <button disabled={isLoading} className="bg-primary hover:bg-primary-dull transition-all text-white w-full py-2 rounded-md cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                {isLoading ? (
                    <>
                        <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Resetting...
                    </>
                ) : (
                    'Reset Password'
                )}
            </button>
            
            <p className="text-center text-sm mt-4">
                Remember your password? <span onClick={() => navigate('/')} className="text-primary cursor-pointer">Back to Login</span>
            </p>
        </form>
    </div>
  )
}

export default ResetPassword
