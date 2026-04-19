import React, { useState } from 'react'
import { useAppContext } from '../../context/AppContext'
import toast from 'react-hot-toast'
import { OrdersSkeleton } from '../../components/Skeletons'

const ProductList = () => {
    const {products, formatNativePrice, formatPrice, axios, fetchProducts, isLoading} = useAppContext()
    const [togglingStockId, setTogglingStockId] = useState(null)

    const toggleStock = async (id, inStock)=>{
        try {
            setTogglingStockId(id)
            const { data } = await axios.post('/api/product/stock', {id, inStock});
            if (data.success){
                fetchProducts();
                toast.success(data.message)
            }else{
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        } finally {
            setTogglingStockId(null)
        }
    }
  return (
    <div className="no-scrollbar flex-1 h-[95vh] overflow-y-scroll flex flex-col justify-between">
            <div className="w-full md:p-10 p-4">
                <h2 className="pb-4 text-lg font-medium">All Products</h2>
                {isLoading ? (
                    <OrdersSkeleton count={4} />
                ) : (
                <div className="flex flex-col items-center max-w-4xl w-full overflow-hidden rounded-md bg-white border border-gray-500/20">
                    <table className="md:table-auto table-fixed w-full overflow-hidden">
                        <thead className="text-gray-900 text-sm text-left">
                            <tr>
                                <th className="px-4 py-3 font-semibold truncate">Product</th>
                                <th className="px-4 py-3 font-semibold truncate">Category</th>
                                <th className="px-4 py-3 font-semibold truncate hidden md:block">Currency</th>
                                <th className="px-4 py-3 font-semibold truncate hidden md:block">Selling Price</th>
                                <th className="px-4 py-3 font-semibold truncate">In Stock</th>
                            </tr>
                        </thead>
                        <tbody className="text-sm text-gray-500">
                            {products.map((product) => (
                                <tr key={product._id} className="border-t border-gray-500/20">
                                    <td className="md:px-4 pl-2 md:pl-4 py-3 flex items-center space-x-3 truncate">
                                        <div className="border border-gray-300 rounded p-2">
                                            <img src={product.image[0]} alt="Product" className="w-16" />
                                        </div>
                                        <span className="truncate max-sm:hidden w-full">{product.name}</span>
                                    </td>
                                    <td className="px-4 py-3">{product.category}</td>
                                    <td className="px-4 py-3 max-sm:hidden">{product.currency || "USD"}</td>
                                    <td className="px-4 py-3 max-sm:hidden">
                                        <div className="font-medium text-gray-700">{formatNativePrice(product.offerPrice, product.currency || "USD")}</div>
                                        <div className="text-xs text-gray-500">{formatPrice(product.offerPrice, product.currency || "USD")} display</div>
                                    </td>
                                    <td className="px-4 py-3">
                                        <label className="relative inline-flex items-center cursor-pointer text-gray-900 gap-3">
                                            <input 
                                                onClick={()=> toggleStock(product._id, !product.inStock)} 
                                                checked={product.inStock} 
                                                type="checkbox" 
                                                className="sr-only peer"
                                                disabled={togglingStockId === product._id}
                                            />
                                            <div className={`w-12 h-7 rounded-full peer transition-colors duration-200 ${togglingStockId === product._id ? 'bg-gray-400' : 'bg-slate-300 peer-checked:bg-blue-600'}`}></div>
                                            <span className={`dot absolute left-1 top-1 w-5 h-5 bg-white rounded-full transition-transform duration-200 ease-in-out peer-checked:translate-x-5 ${togglingStockId === product._id ? 'opacity-50' : ''}`}></span>
                                        </label>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                )}
            </div>
        </div>
  )
}

export default ProductList
