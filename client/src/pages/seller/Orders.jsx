import React, { useEffect, useState } from 'react'
import { useAppContext } from '../../context/AppContext'
import { assets } from '../../assets/assets'
import toast from 'react-hot-toast'
import { OrdersSkeleton } from '../../components/Skeletons'

const Orders = () => {
    const {formatCurrency, getSellerRequestConfig, setIsSeller, setSellerAuthToken, navigate, axios} = useAppContext()
    const [orders, setOrders] = useState([])
    const [updatingOrderId, setUpdatingOrderId] = useState(null)
    const [confirmingPaymentId, setConfirmingPaymentId] = useState(null)
    const [isLoading, setIsLoading] = useState(false)

    const orderStatuses = [
        "Order Placed",
        "Processing",
        "Out for Delivery",
        "Delivered",
        "Cancelled",
    ]

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

    const fetchOrders = async () =>{
        try {
            setIsLoading(true)
            const { data } = await axios.get('/api/order/seller', getSellerRequestConfig());
            if(data.success){
                setOrders(data.orders)
            }else if (data.message === 'Not Authorized'){
                setSellerAuthToken(null)
                setIsSeller(false)
                navigate('/authxseller')
            }else{
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        } finally {
            setIsLoading(false)
        }
    };

    const updateStatus = async (orderId, status) => {
        try {
            setUpdatingOrderId(orderId)
            const { data } = await axios.post('/api/order/status', { orderId, status }, getSellerRequestConfig())

            if (data.success) {
                setOrders((prevOrders) =>
                    prevOrders.map((order) =>
                        order._id === orderId ? { ...order, status } : order
                    )
                )
                toast.success(data.message)
            } else if (data.message === 'Not Authorized') {
                setSellerAuthToken(null)
                setIsSeller(false)
                navigate('/authxseller')
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        } finally {
            setUpdatingOrderId(null)
        }
    }

    const confirmPayment = async (orderId) => {
        try {
            setConfirmingPaymentId(orderId)
            const { data } = await axios.post('/api/order/payment', { orderId }, getSellerRequestConfig())

            if (data.success) {
                setOrders((prevOrders) =>
                    prevOrders.map((order) =>
                        order._id === orderId ? { ...order, isPaid: true } : order
                    )
                )
                toast.success(data.message)
            } else if (data.message === 'Not Authorized') {
                setSellerAuthToken(null)
                setIsSeller(false)
                navigate('/authxseller')
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        } finally {
            setConfirmingPaymentId(null)
        }
    }


    useEffect(()=>{
        fetchOrders();
    },[])


  return (
    <div className='no-scrollbar flex-1 h-[95vh] overflow-y-scroll bg-slate-50/60'>
    <div className="md:p-10 p-4 space-y-5">
            <div className="flex flex-col gap-1">
                <h2 className="text-2xl font-semibold text-gray-900">Orders</h2>
                <p className="text-sm text-gray-500">Review payments, update delivery progress, and track recent customer orders.</p>
            </div>

            {isLoading ? (
                <OrdersSkeleton count={4} />
            ) : orders.length === 0 ? (
                <div className="rounded-3xl border border-dashed border-gray-300 bg-white px-6 py-16 text-center shadow-sm">
                    <img className="mx-auto mb-4 w-12 opacity-60" src={assets.order_icon} alt="Orders" />
                    <p className="text-xl font-semibold text-gray-800">No orders yet</p>
                    <p className="mt-2 text-sm text-gray-500">New customer purchases will appear here as soon as they are placed.</p>
                </div>
            ) : orders.map((order, index) => (
                <div key={index} className="max-w-5xl rounded-3xl border border-gray-200 bg-white p-5 shadow-sm md:p-6">
                    <div className="flex flex-col gap-3 border-b border-gray-100 pb-4 md:flex-row md:items-center md:justify-between">
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-primary">Order</p>
                            <p className="mt-2 text-sm text-gray-500">#{order._id}</p>
                        </div>
                        <div className="flex flex-wrap items-center gap-3">
                            <span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-medium text-gray-700">
                                {formatCurrency(order.amount, order.currency || "UGX")}
                            </span>
                            <span className={`rounded-full px-3 py-1 text-sm font-medium ${order.isPaid ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"}`}>
                                {order.isPaid ? "Payment confirmed" : "Payment pending"}
                            </span>
                            <span className={`rounded-full px-3 py-1 text-sm font-medium ${getStatusColor(order.status)} bg-current/10`}>
                                {order.status}
                            </span>
                        </div>
                    </div>

                    <div className="mt-5 grid gap-5 xl:grid-cols-[1.1fr_0.9fr_0.7fr_0.8fr]">
                        <div className="rounded-2xl bg-slate-50 p-4">
                            <div className="flex items-start gap-3">
                                <img className="mt-1 h-10 w-10 object-contain" src={assets.box_icon} alt="boxIcon" />
                                <div className="space-y-2">
                                    <p className="text-sm font-semibold uppercase tracking-wide text-gray-500">Items</p>
                                    {order.items.map((item, itemIndex) => (
                                        <div key={itemIndex} className="flex flex-col text-sm text-gray-600">
                                            <p className="font-medium text-gray-800">
                                                {item.product.name} <span className="text-primary">x {item.quantity}</span>
                                            </p>
                                            <p className="text-xs text-gray-500">{item.product.category}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="rounded-2xl bg-slate-50 p-4 text-sm text-gray-600">
                            <p className="text-sm font-semibold uppercase tracking-wide text-gray-500">Delivery Address</p>
                            <div className="mt-3 space-y-1">
                                <p className='font-medium text-gray-800'>
                                    {order.address.firstName} {order.address.lastName}
                                </p>
                                <p>{order.address.street}, {order.address.city}</p>
                                <p>{order.address.state}, {order.address.zipcode}, {order.address.country}</p>
                                <p>{order.address.phone}</p>
                            </div>
                        </div>

                        <div className="rounded-2xl bg-slate-50 p-4 text-sm text-gray-600">
                            <p className="text-sm font-semibold uppercase tracking-wide text-gray-500">Payment</p>
                            <div className="mt-3 space-y-2">
                                <p>Method: <span className="font-medium text-gray-800">{order.paymentType}</span></p>
                                <p>Date: <span className="font-medium text-gray-800">{new Date(order.createdAt).toLocaleDateString()}</span></p>
                                <p>
                                    Status: <span className={order.isPaid ? "text-green-600 font-medium" : "text-amber-600 font-medium"}>
                                        {order.isPaid ? "Paid" : "Pending"}
                                    </span>
                                </p>
                                {!order.isPaid && (
                                    <button
                                        onClick={() => confirmPayment(order._id)}
                                        disabled={confirmingPaymentId === order._id}
                                        className="mt-2 w-full rounded-xl bg-primary px-3 py-2.5 text-sm font-medium text-white transition hover:bg-primary-dull disabled:cursor-not-allowed disabled:opacity-70"
                                    >
                                        {confirmingPaymentId === order._id ? "Confirming..." : "Confirm Payment"}
                                    </button>
                                )}
                            </div>
                        </div>

                        <div className="rounded-2xl bg-slate-50 p-4">
                            <label className="text-sm font-semibold uppercase tracking-wide text-gray-500">Order Status</label>
                            <select
                                value={order.status}
                                onChange={(e) => updateStatus(order._id, e.target.value)}
                                disabled={updatingOrderId === order._id}
                                className={`mt-3 w-full rounded-xl border border-gray-300 bg-white px-3 py-2.5 text-sm font-medium outline-none ${getStatusColor(order.status)}`}
                            >
                                {orderStatuses.map((status) => (
                                    <option key={status} value={status}>
                                        {status}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>
            ))}
        </div>
        </div>
  )
}

export default Orders
