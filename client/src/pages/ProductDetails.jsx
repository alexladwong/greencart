import { useEffect, useState } from "react";
import { useAppContext } from "../context/AppContext";
import { Link, useParams } from "react-router-dom";
import { assets } from "../assets/assets";
import ProductCard from "../components/ProductCard";
import { ProductDetailsSkeleton, ProductsGridSkeleton } from "../components/Skeletons";

const ProductDetails = () => {

    const {products, cartItems, navigate, formatPrice, addToCart, removeFromCart, isLoading} = useAppContext()
    const {id} = useParams()
    const [relatedProducts, setRelatedProducts] = useState([]);
    const [thumbnail, setThumbnail] = useState(null);
    const [isAddingToCart, setIsAddingToCart] = useState(false);
    const [isBuying, setIsBuying] = useState(false);

    const product = products.find((item)=> item._id === id);

    useEffect(()=>{
        if(products.length > 0 && product){
            let productsCopy = products.slice();
            productsCopy = productsCopy.filter((item)=> product.category === item.category && item._id !== product._id)
            setRelatedProducts(productsCopy.slice(0,5))
        }
    },[products, product])

    useEffect(()=>{
        setThumbnail(product?.image[0] ? product.image[0] : null)
    },[product])

    const handleAddToCart = async () => {
        setIsAddingToCart(true);
        await addToCart(product._id);
        setIsAddingToCart(false);
    };

    const handleBuyNow = async () => {
        setIsBuying(true);
        const added = await addToCart(product._id);
        if (added) {
            navigate("/cart");
        }
        setIsBuying(false);
    };

    if (isLoading || (!product && products.length === 0)) {
        return <ProductDetailsSkeleton />;
    }

    if (!product) {
        return (
            <div className="flex min-h-[50vh] flex-col items-center justify-center text-center">
                <p className="text-2xl font-semibold text-gray-800">Product not found</p>
                <button
                    onClick={() => navigate("/products")}
                    className="mt-5 rounded-xl bg-primary px-6 py-3 font-medium text-white"
                >
                    Back to products
                </button>
            </div>
        );
    }

    return (
        <div className="mt-8 md:mt-12">
            <p className="text-sm text-gray-500">
                <Link to={"/"}>Home</Link> /
                <Link to={"/products"}> Products</Link> /
                <Link to={`/products/${product.category.toLowerCase()}`}> {product.category}</Link> /
                <span className="text-primary"> {product.name}</span>
            </p>

            <div className="mt-6 grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
                <div className="flex flex-col-reverse gap-4 md:flex-row">
                    <div className="grid grid-cols-4 gap-3 md:flex md:w-24 md:flex-col">
                        {product.image.map((image, index) => (
                            <button key={index} onClick={() => setThumbnail(image)} className={`overflow-hidden rounded-2xl border cursor-pointer ${thumbnail === image ? "border-primary ring-2 ring-primary/20" : "border-gray-200"}`} >
                                <img src={image} alt={`Thumbnail ${index + 1}`} className="aspect-square h-full w-full object-cover" />
                            </button>
                        ))}
                    </div>

                    <div className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm">
                        <img src={thumbnail} alt="Selected product" className="h-full min-h-[320px] w-full object-cover md:min-h-[480px]" />
                    </div>
                </div>

                <div className="rounded-3xl border border-gray-200 bg-white p-5 shadow-sm md:p-6">
                    <div className="inline-flex rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold tracking-wide text-primary">
                        {product.category}
                    </div>
                    <h1 className="mt-4 text-3xl font-semibold leading-tight text-gray-900">{product.name}</h1>

                    <div className="mt-3 flex flex-wrap items-center gap-3">
                        <div className="flex items-center gap-0.5">
                            {Array(5).fill('').map((_, i) => (
                              <img key={i} src={i<4 ? assets.star_icon : assets.star_dull_icon} alt="" className="w-4"/>
                            ))}
                        </div>
                        <p className="text-sm text-gray-500">(4 reviews)</p>
                        <span className={`rounded-full px-3 py-1 text-xs font-medium ${product.inStock ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                            {product.inStock ? "In stock" : "Out of stock"}
                        </span>
                    </div>

                    <div className="mt-6 rounded-2xl bg-gray-50 p-4">
                        <p className="text-sm uppercase tracking-wide text-gray-500">Price</p>
                        <div className="mt-2 flex items-end gap-3">
                            <p className="text-3xl font-semibold text-gray-900">{formatPrice(product.offerPrice, product.currency || "USD")}</p>
                            <p className="text-base text-gray-400 line-through">{formatPrice(product.price, product.currency || "USD")}</p>
                        </div>
                        <span className="mt-2 block text-sm text-gray-500">(inclusive of all taxes)</span>
                    </div>

                    <p className="mt-6 text-base font-semibold text-gray-900">About Product</p>
                    <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-6 text-gray-500">
                        {product.description.map((desc, index) => (
                            <li key={index}>{desc}</li>
                        ))}
                    </ul>

                    {cartItems[product._id] ? (
                        <div className="mt-8 flex items-center justify-between rounded-2xl border border-primary/20 bg-primary/10 px-4 py-3">
                            <div>
                                <p className="font-medium text-gray-900">Already in cart</p>
                                <p className="text-sm text-gray-500">Adjust quantity or continue to checkout.</p>
                            </div>
                            <div className="flex items-center gap-3 rounded-full bg-white px-3 py-2 shadow-sm">
                                <button onClick={() => removeFromCart(product._id)} className="px-2 text-lg text-primary">-</button>
                                <span className="min-w-5 text-center font-medium">{cartItems[product._id]}</span>
                                <button onClick={handleAddToCart} className="px-2 text-lg text-primary">+</button>
                            </div>
                        </div>
                    ) : null}

                    <div className="mt-8 grid gap-3 sm:grid-cols-2">
                        <button onClick={handleAddToCart} disabled={isAddingToCart || isBuying || !product.inStock} className="w-full rounded-2xl py-3.5 cursor-pointer font-medium bg-gray-100 text-gray-800/80 hover:bg-gray-200 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2" >
                            {isAddingToCart ? (
                                <>
                                    <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Adding...
                                </>
                            ) : (
                                'Add to Cart'
                            )}
                        </button>
                        <button onClick={handleBuyNow} disabled={isAddingToCart || isBuying || !product.inStock} className="w-full rounded-2xl py-3.5 cursor-pointer font-medium bg-primary text-white hover:bg-primary-dull transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2" >
                            {isBuying ? (
                                <>
                                    <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Processing...
                                </>
                            ) : (
                                'Buy now'
                            )}
                        </button>
                    </div>

                    <div className="mt-6 rounded-2xl bg-slate-50 p-4 text-sm text-gray-500">
                        <p>Delivery address can be selected at checkout.</p>
                        <p className="mt-2">Cash on Delivery is available for confirmed orders.</p>
                    </div>
                </div>
            </div>
            <div className="flex flex-col items-center mt-16 md:mt-20">
                <div className="flex flex-col items-center w-max">
                    <p className="text-2xl md:text-3xl font-medium">Related Products</p>
                    <div className="w-20 h-0.5 bg-primary rounded-full mt-2"></div>
                </div>
                {isLoading ? (
                    <ProductsGridSkeleton count={5} />
                ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 md:gap-6 lg:grid-cols-5 mt-6 w-full">
                        {relatedProducts.filter((product)=>product.inStock).map((product, index)=>(
                            <ProductCard key={index} product={product}/>
                        ))}
                    </div>
                )}
                <button onClick={()=> {navigate('/products'); scrollTo(0,0)}} className="mx-auto cursor-pointer px-10 my-12 md:my-16 py-2.5 border rounded-xl text-primary hover:bg-primary/10 transition">See more</button>
            </div>
        </div>
    );
};


export default ProductDetails
