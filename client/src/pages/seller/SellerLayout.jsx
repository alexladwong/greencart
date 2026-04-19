import { Link, NavLink, Outlet } from "react-router-dom";
import { assets } from "../../assets/assets";
import { useAppContext } from "../../context/AppContext";
import toast from "react-hot-toast";
import { useState } from "react";

const SellerLayout = () => {

    const { axios, navigate, setIsSeller, setSellerAuthToken } = useAppContext();
    const [mobileNavOpen, setMobileNavOpen] = useState(false);


    const sidebarLinks = [
        { name: "Add Product", path: "/authxseller", icon: assets.add_icon },
        { name: "Product List", path: "/authxseller/product-list", icon: assets.product_list_icon },
        { name: "Orders", path: "/authxseller/orders", icon: assets.order_icon },
    ];

    const logout = async ()=>{
        try {
            const { data } = await axios.get('/api/seller/logout');
            if(data.success){
                setSellerAuthToken(null)
                setIsSeller(false)
                toast.success(data.message)
                navigate('/')
            }else{
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    return (
        <>
            <div className="sticky top-0 z-50 flex items-center justify-between px-4 md:px-8 border-b border-gray-300 py-3 bg-white">
                <Link to='/'>
                    <img src={assets.logo} alt="log" className="cursor-pointer w-34 md:w-38" />
                </Link>
                <div className="flex items-center gap-5 text-gray-500">
                    <p className="hidden sm:block">Hi! Admin</p>
                    <button
                        onClick={() => setMobileNavOpen((prev) => !prev)}
                        className="md:hidden rounded-md border border-gray-300 px-3 py-1 text-sm"
                    >
                        Menu
                    </button>
                    <button onClick={logout} className='border rounded-full text-sm px-4 py-1'>Logout</button>
                </div>
            </div>
            <div className="flex flex-col md:flex-row">
               <div className={`${mobileNavOpen ? "flex" : "hidden"} md:flex w-full md:w-64 border-b md:border-b-0 md:border-r text-base border-gray-300 md:min-h-[calc(100vh-73px)] flex-col md:pt-4 bg-white`}>
                {sidebarLinks.map((item) => (
                    <NavLink to={item.path} key={item.name} end={item.path === "/authxseller"}
                        onClick={() => setMobileNavOpen(false)}
                        className={({isActive})=>`flex items-center py-3 px-4 gap-3 
                            ${isActive ? "md:border-r-[6px] bg-primary/10 border-primary text-primary"
                                : "hover:bg-gray-100/90 border-white"
                            }`
                        }
                    >
                        <img src={item.icon} alt="" className="w-7 h-7" />
                        <p className="block text-center">{item.name}</p>
                    </NavLink>
                ))}
            </div> 
                <Outlet/>
            </div>
             
        </>
    );
};

export default SellerLayout;
