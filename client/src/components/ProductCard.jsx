import React from "react";
import { assets } from "../assets/assets";
import { useAppContext } from "../context/AppContext";


const ProductCard = ({product}) => {
    const {formatPrice, addToCart, removeFromCart, cartItems, navigate} = useAppContext()

    return product && (
        <div onClick={()=> {navigate(`/products/${product.category.toLowerCase()}/${product._id}`); scrollTo(0,0)}} className="flex h-full flex-col rounded-3xl border border-gray-200 bg-white p-3 shadow-sm transition hover:shadow-md md:p-4">
            <div className="group flex aspect-[4/3] items-center justify-center overflow-hidden rounded-2xl bg-slate-50 px-2">
                <img className="group-hover:scale-105 transition h-full w-full object-contain" src={product.image[0]} alt={product.name} />
            </div>

            <div className="mt-4 flex flex-1 flex-col text-sm text-gray-500/60">
                <p className="truncate">{product.category}</p>
                <p className="mt-1 min-h-[48px] text-gray-800 font-semibold text-base leading-6 md:text-lg">
                    {product.name}
                </p>

                <div className="mt-2 flex items-center gap-0.5">
                    {Array(5).fill('').map((_, i) => (
                           <img key={i} className="w-4 md:w-3.5" src={i < 4 ? assets.star_icon : assets.star_dull_icon} alt=""/>
                    ))}
                    <p className="ml-1 text-sm">(4)</p>
                </div>

                <div className="mt-4 space-y-3">
                    <div className="flex flex-col">
                        <p className="text-xl font-semibold leading-none text-primary md:text-2xl">
                            {formatPrice(product.offerPrice, product.currency || "USD")}
                        </p>
                        <span className="mt-2 text-xs text-gray-400 line-through md:text-sm">
                            {formatPrice(product.price, product.currency || "USD")}
                        </span>
                    </div>

                    <div onClick={(e) => { e.stopPropagation(); }} className="text-primary">
                        {!cartItems[product._id] ? (
                            <button className="flex h-10 w-full items-center justify-center gap-2 rounded-xl border border-primary/30 bg-primary/10 px-3 font-medium cursor-pointer whitespace-nowrap" onClick={() => addToCart(product._id)} >
                                <img src={assets.cart_icon} alt="cart_icon" className="h-4 w-4" />
                                Add
                            </button>
                        ) : (
                            <div className="flex h-10 w-full items-center justify-between rounded-xl bg-primary/15 px-2 select-none">
                                <button onClick={() => {removeFromCart(product._id)}} className="flex h-8 w-8 items-center justify-center rounded-lg cursor-pointer text-lg" >
                                    -
                                </button>
                                <span className="min-w-6 text-center font-medium">{cartItems[product._id]}</span>
                                <button onClick={() => {addToCart(product._id)}} className="flex h-8 w-8 items-center justify-center rounded-lg cursor-pointer text-lg" >
                                    +
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;
