import { createContext , useEffect, useState} from "react";
// import { food_list } from "../assets/assets";
import axios from 'axios'

export const StoreContext = createContext(null)

const StoreContextProvider = (props) => {

    const [cartItems, setCartItems] = useState({});
    const url = "http://localhost:3000"
    const [token, setToken] = useState(localStorage.getItem("token") || "");
    const [food_list , setFoodList] = useState([])

    const addToCart = async (itemId) => {
        if (!cartItems[itemId]) {
            setCartItems((prev) => ({ ...prev, [itemId]: 1 }))
        } else {
            setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] + 1 }))
        } 
        if(token) {
                await axios.post(url+"/api/cart/add",{itemId},{headers:{token}})
        }
    }
    const fetchFoodList = async ()=>{
        const response = await axios.get(url+"/api/food/list")
        setFoodList(response.data.data)
    }
    const removeFromCart = async (itemId) => {
        setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] - 1 }));
        if(token){
            await axios.post(url+"/api/cart/remove",{itemId},{headers:{token}})
        }
    }
    const loadCartData = async (token)=>{
        const response = await axios.post(url+"/api/cart/get" , {},{headers:{token}});
        setCartItems(response.data.cartData);
    }

    const getTotalCartAmount = () => {
        let totalAmount = 0;
        for (const item in cartItems) {
            if (cartItems[item] > 0) {
                let itemInfo = food_list.find((product) => product._id === item);
                totalAmount += itemInfo.price * cartItems[item];
            }
        }
        return totalAmount;
    }
    useEffect(() => {
        async function loadData() {
            try {
                await fetchFoodList();
                const token = localStorage.getItem("token");
                if (token) {
                    setToken(token); 
                    await loadCartData(localStorage.getItem("token")); 
                }
            } catch (error) {
                console.error("Error loading data:", error);
            }
        }
        loadData();
    }, []);

    const contextValue = {
        food_list,
        cartItems,
        setCartItems,
        addToCart,
        removeFromCart,
        getTotalCartAmount,
        url,
        token,
        setToken
    }
    return (
        <StoreContext.Provider value={contextValue}>
            {props.children}
        </StoreContext.Provider>
    )
}

export default StoreContextProvider;