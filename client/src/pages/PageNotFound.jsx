import React from 'react'
import { Link } from 'react-router-dom'
import { useAppContext } from '../context/AppContext'

const PageNotFound = () => {
    const { navigate } = useAppContext();

    return (
        <div className="flex flex-col items-center justify-center min-h-screen px-4">
            <div className="text-center">
                <h1 className="text-9xl font-bold text-primary mb-4">404</h1>
                <h2 className="text-3xl font-semibold text-gray-800 mb-4">Page Not Found</h2>
                <p className="text-gray-600 mb-8 max-w-md">
                    Oops! The page you're looking for doesn't exist or has been moved.
                </p>
                <div className="flex gap-4 justify-center">
                    <button
                        onClick={() => navigate('/')}
                        className="bg-primary hover:bg-primary-dull text-white px-6 py-3 rounded-lg transition-all"
                    >
                        Go to Home
                    </button>
                    <Link
                        to="/products"
                        className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-6 py-3 rounded-lg transition-all"
                    >
                        Browse Products
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default PageNotFound;
