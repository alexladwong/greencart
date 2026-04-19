import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { dummyProducts } from "../assets/assets";
import toast from "react-hot-toast";
import axios from "axios";

axios.defaults.withCredentials = true;
axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL;

const storedToken = localStorage.getItem("token");
if (storedToken) {
    axios.defaults.headers.common["Authorization"] = `Bearer ${storedToken}`;
}

export const AppContext = createContext();

export const AppContextProvider = ({children})=>{
    const displayCurrency = (import.meta.env.VITE_CURRENCY || "UGX").trim();
    const currency = `${displayCurrency} `;
    const currencyRatesToUGX = {
        USD: Number(import.meta.env.VITE_USD_TO_UGX_RATE) || 3695.2,
        KES: Number(import.meta.env.VITE_KES_TO_UGX_RATE) || 28.6,
        UGX: 1,
    };
    const supportedCurrencies = ["USD", "UGX", "KES"];

    const navigate = useNavigate();
    const [user, setUser] = useState(null)
    const [isSeller, setIsSeller] = useState(false)
    const [showUserLogin, setShowUserLogin] = useState(false)
    const [showForgotPassword, setShowForgotPassword] = useState(false)
    const [products, setProducts] = useState([])
    const [isLoading, setIsLoading] = useState(false)

    const [cartItems, setCartItems] = useState({})
    const [searchQuery, setSearchQuery] = useState("")

  // Fetch Seller Status
  const fetchSeller = async ()=>{
    try {
        const {data} = await axios.get('/api/seller/is-auth');
        if(data.success){
            setIsSeller(true)
        }else{
            setIsSeller(false)
        }
    } catch (error) {
        setIsSeller(false)
    }
  }

    // Fetch User Auth Status , User Data and Cart Items
const fetchUser = async ()=>{
    try {
        const {data} = await axios.get('api/user/is-auth');
        if (data.success){
            setUser(data.user)
            setCartItems(data.user.cartItems)
        } else {
            setUser(null)
        }
    } catch (error) {
        setUser(null)
    }
}



    // Fetch All Products
    const fetchProducts = async ()=>{
        try {
            setIsLoading(true)
            const { data } = await axios.get('/api/product/list')
            if(data.success){
                setProducts(data.products)
            }else{
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        } finally {
            setIsLoading(false)
        }
    }

// Add Product to Cart
const addToCart = async (itemId)=>{
    const product = products.find((item) => item._id === itemId);

    if (!product?.inStock) {
        toast.error("This product is currently out of stock");
        return false;
    }

    let cartData = structuredClone(cartItems);

    if(cartData[itemId]){
        cartData[itemId] += 1;
    }else{
        cartData[itemId] = 1;
    }
    setCartItems(cartData);
    toast.success("Added to Cart")
    return true;
}

  // Update Cart Item Quantity
  const updateCartItem = (itemId, quantity)=>{
    let cartData = structuredClone(cartItems);
    cartData[itemId] = quantity;
    setCartItems(cartData)
    toast.success("Cart Updated")
  }

// Remove Product from Cart
const removeFromCart = (itemId)=>{
    let cartData = structuredClone(cartItems);
    if(cartData[itemId]){
        cartData[itemId] -= 1;
        if(cartData[itemId] === 0){
            delete cartData[itemId];
        }
    }
    toast.success("Removed from Cart")
    setCartItems(cartData)
}

  // Get Cart Item Count
  const getCartCount = ()=>{
    let totalCount = 0;
    for(const item in cartItems){
        totalCount += cartItems[item];
    }
    return totalCount;
  }

// Get Cart Total Amount
const getCartAmount = () =>{
    let totalAmount = 0;
    for (const items in cartItems){
        let itemInfo = products.find((product)=> product._id === items);
        if(itemInfo && cartItems[items] > 0){
            totalAmount += convertCurrency(itemInfo.offerPrice, itemInfo.currency || "USD", displayCurrency) * cartItems[items]
        }
    }
    return Math.round(totalAmount);
}

const getCurrencyLabel = (currencyCode) => {
    switch (currencyCode) {
        case "USD":
            return "$";
        case "KES":
            return "KSh ";
        case "UGX":
        default:
            return "UGX ";
    }
}

const convertCurrency = (amount, fromCurrency = "USD", toCurrency = displayCurrency) => {
    const normalizedAmount = Number(amount || 0);
    if (fromCurrency === toCurrency) {
        return normalizedAmount;
    }

    const amountInUGX = normalizedAmount * (currencyRatesToUGX[fromCurrency] || currencyRatesToUGX.USD);

    if (toCurrency === "UGX") {
        return amountInUGX;
    }

    return amountInUGX / (currencyRatesToUGX[toCurrency] || 1);
}

const formatCurrency = (amount, currencyCode = displayCurrency) => {
    return `${getCurrencyLabel(currencyCode)}${Math.round(Number(amount || 0)).toLocaleString()}`
}

const formatPrice = (amount, sourceCurrency = "USD") => {
    const convertedAmount = convertCurrency(amount, sourceCurrency, displayCurrency);
    return formatCurrency(convertedAmount, displayCurrency)
}

const formatNativePrice = (amount, currencyCode = "USD") => {
    return formatCurrency(amount, currencyCode)
}


    useEffect(()=>{
        fetchUser()
        fetchSeller()
        fetchProducts()
    },[])

    // Update Database Cart Items
    useEffect(()=>{
        const updateCart = async ()=>{
            try {
                const { data } = await axios.post('/api/cart/update', {cartItems})
                if (!data.success){
                    toast.error(data.message)
                }
            } catch (error) {
                toast.error(error.message)
            }
        }

        if(user){
            updateCart()
        }
    },[cartItems])

    const setAuthToken = (token) => {
        if (token) {
            localStorage.setItem("token", token);
            axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        } else {
            localStorage.removeItem("token");
            delete axios.defaults.headers.common["Authorization"];
        }
    }

    const value = {navigate, user, setUser, setAuthToken, setIsSeller, isSeller,
        showUserLogin, setShowUserLogin, showForgotPassword, setShowForgotPassword, products, currency, displayCurrency, supportedCurrencies, formatCurrency, formatPrice, formatNativePrice, addToCart, updateCartItem, removeFromCart, cartItems, searchQuery, setSearchQuery, getCartAmount, getCartCount, axios, fetchProducts, setCartItems, isLoading, setIsLoading
    }

    return <AppContext.Provider value={value}>
        {children}
    </AppContext.Provider>
}

export const useAppContext = ()=>{
    return useContext(AppContext)
}
