import React, { useEffect, useState } from 'react'
import { useAppContext } from '../context/AppContext'
import { dummyOrders } from '../assets/assets'
import Loader from '../components/Loader'
import { OrdersSkeleton } from '../components/Skeletons'

const MyOrders = () => {

    const [myOrders, setMyOrders] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const {formatCurrency, formatPrice, axios, user} = useAppContext()

    const fetchMyOrders = async ()=>{
        try {
            setIsLoading(true)
            const { data } = await axios.get('/api/order/user')
            if(data.success){
                setMyOrders(data.orders)
            }
        } catch (error) {
            console.log(error);
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(()=>{
        if(user){
            fetchMyOrders()
        }
    },[user])

    const getStatusColor = (status) => {
        switch (status) {
            case "Delivered":
                return "text-green-600"
            case "Out for Delivery":
                return "text-blue-600"
            case "Processing":
                return "text-amber-600"
            case "Cancelled":
                return "text-red-600"
            default:
                return "text-primary"
        }
    }

  return (
    <div className='mt-16 pb-16'>
        {isLoading ? <OrdersSkeleton /> : (
            <>
                <div className='flex flex-col items-end w-max mb-8'>
                    <p className='text-2xl font-medium uppercase'>My orders</p>
                    <div className='w-16 h-0.5 bg-primary rounded-full'></div>
                </div>
                {myOrders.length === 0 ? (
                    <p className='text-center text-gray-500 mt-10'>No orders yet</p>
                ) : (
                    myOrders.map((order, index)=>(
                        <div key={index} className='border border-gray-300 rounded-lg mb-10 p-4 py-5 max-w-4xl'>
                            <p className='flex justify-between md:items-center text-gray-400 md:font-medium max-md:flex-col'>
                                <span>OrderId : {order._id}</span>
                                <span>Payment : {order.paymentType}</span>
                                <span>Total Amount : {formatCurrency(order.amount, order.currency || "UGX")}</span>
                            </p>
                            {order.items.map((item, index)=>(
                                <div key={index}
                                    className={`relative bg-white text-gray-500/70 ${
                                    order.items.length !== index + 1 && "border-b"
                                } border-gray-300 flex flex-col md:flex-row md:items-center justify-between p-4 py-5 md:gap-16 w-full max-w-4xl`}>

                                    <div className='flex items-center mb-4 md:mb-0'>
                                        <div className='bg-primary/10 p-4 rounded-lg'>
                                            <img src={item.product.image[0]} alt="" className='w-16 h-16' />
                                        </div>
                                        <div className='ml-4'>
                                            <h2 className='text-xl font-medium text-gray-800'>{item.product.name}</h2>
                                            <p>Category: {item.product.category}</p>
                                        </div>
                                    </div>

                                    <div className='flex flex-col justify-center md:ml-8 mb-4 md:mb-0'>
                                        <p>Quantity: {item.quantity || "1"}</p>
                                        <p>
                                            Status: <span className={`font-medium ${getStatusColor(order.status)}`}>{order.status}</span>
                                        </p>
                                        <p>Date: {new Date(order.createdAt).toLocaleDateString()}</p>
                                    </div>
                                    <p className='text-primary text-lg font-medium'>
                                        Amount: {formatPrice(item.product.offerPrice * item.quantity, item.product.currency || "USD")}
                                    </p>

                                </div>
                            ))}
                        </div>
                    ))
                )}
            </>
        )}
    </div>
  )
}

export default MyOrders
