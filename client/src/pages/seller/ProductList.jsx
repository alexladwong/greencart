import React, { useMemo, useState } from 'react'
import { useAppContext } from '../../context/AppContext'
import toast from 'react-hot-toast'
import { OrdersSkeleton } from '../../components/Skeletons'
import { categories } from '../../assets/assets'
import { assets } from '../../assets/assets'

const ProductList = () => {
    const {products, formatNativePrice, formatPrice, axios, fetchProducts, isLoading, supportedCurrencies, getSellerRequestConfig} = useAppContext()
    const [togglingStockId, setTogglingStockId] = useState(null)
    const [editingProduct, setEditingProduct] = useState(null)
    const [isSaving, setIsSaving] = useState(false)

    const initialFormState = useMemo(() => ({
        id: '',
        name: '',
        description: '',
        category: '',
        price: '',
        offerPrice: '',
        currency: 'USD',
        inStock: true,
        imagePreviews: [],
        imageFiles: [],
    }), [])
    const [formState, setFormState] = useState(initialFormState)

    const openEditModal = (product) => {
        setEditingProduct(product)
        setFormState({
            id: product._id,
            name: product.name || '',
            description: Array.isArray(product.description) ? product.description.join('\n') : '',
            category: product.category || '',
            price: product.price ?? '',
            offerPrice: product.offerPrice ?? '',
            currency: product.currency || 'USD',
            inStock: Boolean(product.inStock),
            imagePreviews: product.image || [],
            imageFiles: [],
        })
    }

    const closeEditModal = () => {
        setEditingProduct(null)
        setFormState(initialFormState)
    }

    const toggleStock = async (id, inStock)=>{
        try {
            setTogglingStockId(id)
            const { data } = await axios.post('/api/product/stock', {id, inStock}, getSellerRequestConfig());
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

    const onFieldChange = (event) => {
        const { name, value, type, checked } = event.target
        setFormState((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }))
    }

    const onImageChange = (index, file) => {
        if (!file) {
            return
        }

        setFormState((prev) => {
            const nextFiles = [...prev.imageFiles]
            const nextPreviews = [...prev.imagePreviews]
            nextFiles[index] = file
            nextPreviews[index] = URL.createObjectURL(file)

            return {
                ...prev,
                imageFiles: nextFiles,
                imagePreviews: nextPreviews,
            }
        })
    }

    const saveProduct = async (event) => {
        event.preventDefault()

        try {
            setIsSaving(true)
            const payload = {
                ...formState,
                imagePreviews: undefined,
                imageFiles: undefined,
                price: Number(formState.price),
                offerPrice: Number(formState.offerPrice),
                description: formState.description,
            }
            const formData = new FormData()
            formData.append('productData', JSON.stringify(payload))

            formState.imageFiles.forEach((file, index) => {
                if (file) {
                    formData.append(`image${index}`, file)
                }
            })

            const { data } = await axios.post('/api/product/update', formData, getSellerRequestConfig())
            if (data.success) {
                toast.success(data.message)
                await fetchProducts()
                closeEditModal()
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        } finally {
            setIsSaving(false)
        }
    }
  return (
    <div className="no-scrollbar relative flex-1 h-[95vh] overflow-y-scroll flex flex-col justify-between">
            <div className="w-full md:p-10 p-4">
                <div className="flex flex-col gap-2 pb-4 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <h2 className="text-lg font-medium">All Products</h2>
                        <p className="text-sm text-gray-500">Edit pricing, category details, and stock visibility from one place.</p>
                    </div>
                </div>
                {isLoading ? (
                    <OrdersSkeleton count={4} />
                ) : (
                <div className="flex flex-col items-center max-w-5xl w-full overflow-hidden rounded-2xl bg-white border border-gray-500/20 shadow-sm">
                    <div className="hidden md:block w-full">
                    <table className="table-auto w-full overflow-hidden">
                        <thead className="text-gray-900 text-sm text-left">
                            <tr>
                                <th className="px-4 py-3 font-semibold truncate">Product</th>
                                <th className="px-4 py-3 font-semibold truncate">Category</th>
                                <th className="px-4 py-3 font-semibold truncate">Currency</th>
                                <th className="px-4 py-3 font-semibold truncate">Selling Price</th>
                                <th className="px-4 py-3 font-semibold truncate">In Stock</th>
                                <th className="px-4 py-3 font-semibold truncate text-right">Action</th>
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
                                    <td className="px-4 py-3">{product.currency || "USD"}</td>
                                    <td className="px-4 py-3">
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
                                                readOnly
                                            />
                                            <div className={`w-12 h-7 rounded-full peer transition-colors duration-200 ${togglingStockId === product._id ? 'bg-gray-400' : 'bg-slate-300 peer-checked:bg-blue-600'}`}></div>
                                            <span className={`dot absolute left-1 top-1 w-5 h-5 bg-white rounded-full transition-transform duration-200 ease-in-out peer-checked:translate-x-5 ${togglingStockId === product._id ? 'opacity-50' : ''}`}></span>
                                        </label>
                                    </td>
                                    <td className="px-4 py-3 text-right">
                                        <button
                                            type="button"
                                            onClick={() => openEditModal(product)}
                                            className="rounded-lg border border-primary/20 px-4 py-2 font-medium text-primary transition hover:bg-primary/5"
                                        >
                                            Edit
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    </div>
                    <div className="grid w-full gap-4 p-4 md:hidden">
                        {products.map((product) => (
                            <article key={product._id} className="rounded-2xl border border-gray-200 p-4 shadow-sm">
                                <div className="flex gap-3">
                                    <div className="h-20 w-20 shrink-0 overflow-hidden rounded-xl border border-gray-200 bg-white p-1">
                                        <img src={product.image[0]} alt={product.name} className="h-full w-full object-cover" />
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <p className="truncate text-base font-semibold text-gray-800">{product.name}</p>
                                        <p className="text-sm text-gray-500">{product.category}</p>
                                        <div className="mt-2">
                                            <p className="text-sm font-medium text-gray-700">{formatNativePrice(product.offerPrice, product.currency || "USD")}</p>
                                            <p className="text-xs text-gray-500">{formatPrice(product.offerPrice, product.currency || "USD")} display</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="mt-4 flex items-center justify-between gap-3 rounded-xl bg-gray-50 px-3 py-2">
                                    <div>
                                        <p className="text-xs uppercase tracking-wide text-gray-500">Currency</p>
                                        <p className="font-medium text-gray-700">{product.currency || "USD"}</p>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer text-gray-900 gap-3">
                                        <input
                                            onClick={() => toggleStock(product._id, !product.inStock)}
                                            checked={product.inStock}
                                            type="checkbox"
                                            className="sr-only peer"
                                            disabled={togglingStockId === product._id}
                                            readOnly
                                        />
                                        <div className={`w-12 h-7 rounded-full peer transition-colors duration-200 ${togglingStockId === product._id ? 'bg-gray-400' : 'bg-slate-300 peer-checked:bg-blue-600'}`}></div>
                                        <span className={`dot absolute left-1 top-1 w-5 h-5 bg-white rounded-full transition-transform duration-200 ease-in-out peer-checked:translate-x-5 ${togglingStockId === product._id ? 'opacity-50' : ''}`}></span>
                                    </label>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => openEditModal(product)}
                                    className="mt-4 w-full rounded-xl border border-primary/20 px-4 py-3 font-medium text-primary transition hover:bg-primary/5"
                                >
                                    Edit Product
                                </button>
                            </article>
                        ))}
                    </div>
                </div>
                )}
            </div>
            {editingProduct && (
                <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/45 p-0 sm:items-center sm:p-4">
                    <div className="w-full max-w-2xl rounded-t-3xl bg-white shadow-2xl sm:rounded-3xl">
                        <div className="flex items-start justify-between gap-4 border-b border-gray-200 px-5 py-4 sm:px-6">
                            <div>
                                <h3 className="text-xl font-semibold text-gray-900">Edit Product</h3>
                                <p className="text-sm text-gray-500">Update the catalog details and save changes for the storefront.</p>
                            </div>
                            <button type="button" onClick={closeEditModal} className="rounded-full border border-gray-200 px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-50">
                                Close
                            </button>
                        </div>

                        <form onSubmit={saveProduct} className="max-h-[85vh] overflow-y-auto px-5 py-5 sm:px-6">
                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="sm:col-span-2">
                                    <label className="mb-2 block text-sm font-medium text-gray-700">Product Images</label>
                                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                                        {Array.from({ length: 4 }).map((_, index) => (
                                            <label key={index} htmlFor={`edit-image-${index}`} className="cursor-pointer">
                                                <input
                                                    id={`edit-image-${index}`}
                                                    type="file"
                                                    accept="image/*"
                                                    hidden
                                                    onChange={(event) => onImageChange(index, event.target.files?.[0])}
                                                />
                                                <div className="overflow-hidden rounded-2xl border border-dashed border-gray-300 bg-gray-50">
                                                    <img
                                                        src={formState.imagePreviews[index] || assets.upload_area}
                                                        alt={`Product slot ${index + 1}`}
                                                        className="h-28 w-full object-cover"
                                                    />
                                                </div>
                                                <p className="mt-2 text-center text-xs text-gray-500">Tap to replace image {index + 1}</p>
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                <div className="sm:col-span-2">
                                    <label className="mb-1 block text-sm font-medium text-gray-700" htmlFor="edit-product-name">Product Name</label>
                                    <input
                                        id="edit-product-name"
                                        name="name"
                                        value={formState.name}
                                        onChange={onFieldChange}
                                        className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-primary"
                                        placeholder="Type product name"
                                        required
                                    />
                                </div>

                                <div className="sm:col-span-2">
                                    <label className="mb-1 block text-sm font-medium text-gray-700" htmlFor="edit-product-description">Description</label>
                                    <textarea
                                        id="edit-product-description"
                                        name="description"
                                        value={formState.description}
                                        onChange={onFieldChange}
                                        rows={5}
                                        className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-primary"
                                        placeholder="Use one line per product detail"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="mb-1 block text-sm font-medium text-gray-700" htmlFor="edit-category">Category</label>
                                    <select
                                        id="edit-category"
                                        name="category"
                                        value={formState.category}
                                        onChange={onFieldChange}
                                        className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-primary"
                                        required
                                    >
                                        <option value="">Select Category</option>
                                        {categories.map((item, index) => (
                                            <option key={index} value={item.path}>{item.path}</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="mb-1 block text-sm font-medium text-gray-700" htmlFor="edit-currency">Currency</label>
                                    <select
                                        id="edit-currency"
                                        name="currency"
                                        value={formState.currency}
                                        onChange={onFieldChange}
                                        className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-primary"
                                    >
                                        {supportedCurrencies.map((item) => (
                                            <option key={item} value={item}>{item}</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="mb-1 block text-sm font-medium text-gray-700" htmlFor="edit-price">Product Price</label>
                                    <input
                                        id="edit-price"
                                        name="price"
                                        type="number"
                                        min="0"
                                        value={formState.price}
                                        onChange={onFieldChange}
                                        className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-primary"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="mb-1 block text-sm font-medium text-gray-700" htmlFor="edit-offer-price">Offer Price</label>
                                    <input
                                        id="edit-offer-price"
                                        name="offerPrice"
                                        type="number"
                                        min="0"
                                        value={formState.offerPrice}
                                        onChange={onFieldChange}
                                        className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-primary"
                                        required
                                    />
                                </div>

                                <label className="sm:col-span-2 flex items-center justify-between rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3">
                                    <div>
                                        <p className="font-medium text-gray-800">Show as in stock</p>
                                        <p className="text-sm text-gray-500">This also updates the storefront buying state.</p>
                                    </div>
                                    <input
                                        name="inStock"
                                        type="checkbox"
                                        checked={formState.inStock}
                                        onChange={onFieldChange}
                                        className="h-5 w-5 rounded border-gray-300 text-primary focus:ring-primary"
                                    />
                                </label>
                            </div>

                            <div className="mt-6 flex flex-col-reverse gap-3 border-t border-gray-200 pt-4 sm:flex-row sm:justify-end">
                                <button
                                    type="button"
                                    onClick={closeEditModal}
                                    className="rounded-xl border border-gray-300 px-5 py-3 font-medium text-gray-700 hover:bg-gray-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSaving}
                                    className="rounded-xl bg-primary px-5 py-3 font-medium text-white transition disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                    {isSaving ? 'Saving...' : 'Save Changes'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
  )
}

export default ProductList
