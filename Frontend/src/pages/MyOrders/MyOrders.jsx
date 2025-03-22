import React, { useContext, useEffect, useState } from 'react';
import './MyOrders.css';
import { StoreContext } from '../../context/StoreContext';
import axios from 'axios';
import { assets } from './../../assets/assets';

const MyOrders = () => {
    const { url, token } = useContext(StoreContext);
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch user orders from API
    const fetchOrders = async () => {
        try {
            if (!token) {
                console.warn("Token is missing! User might not be authenticated.");
                return;
            }
            console.log("Fetching orders with token:", token); // Debugging
            setLoading(true);
            setError(null);

            const response = await axios.post(
                `${url}/api/order/userorders`, 
                {}, 
                { headers: { token } }
            );

            console.log("API Response:", response.data); // Debugging

            if (response.data && response.data.data) {
                setData(response.data.data);
            } else {
                console.warn("Unexpected API response format:", response);
                setData([]);
            }
        } catch (error) {
            console.error("Error fetching orders:", error);
            setError("Failed to load orders. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        console.log("Token before fetching orders:", token);
        if (token) {
            fetchOrders();
        }
    }, [token]);

    return (
        <div className='my-orders'>
            <h2>My Orders</h2>

            {loading && <p>Loading orders...</p>}
            {error && <p className="error">{error}</p>}
            
            {!loading && data.length === 0 && !error && (
                <p className="no-orders">No orders found.</p>
            )}

            <div className="container">
                {data.map((order, index) => (
                    <div key={index} className="my-orders-order">
                        <img src={assets.parcel_icon} alt="Order Parcel" />
                        <p>
                            {order.items.map((item, idx) => (
                                <span key={idx}>
                                    {item.name} x {item.quantity}
                                    {idx !== order.items.length - 1 ? ", " : ""}
                                </span>
                            ))}
                        </p>
                        <p>${order.amount}.00</p>
                        <p>Items: {order.items.length}</p>
                        <p><span>&#x25cf;</span><b>{order.status}</b></p>
                        <button onClick={fetchOrders}>Track Order</button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MyOrders;
