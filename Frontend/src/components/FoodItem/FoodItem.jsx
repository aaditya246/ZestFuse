import React, { useContext } from "react";
import "./FoodItem.css";
import { assets } from "../../assets/assets";
import { StoreContext } from "../../context/StoreContext";
// 
const fileId = '1yIS2g6XPbbLzgpA3v44NvF7pQQciOocF';
const urlm = `https://lh3.googleusercontent.com/d/${fileId}`;

const getDriveImageUrl = (link) => {
  const match = link.match(/\/d\/(.*?)\//);
  if (match && match[1]) {
    return `https://drive.google.com/uc?export=view&id=${match[1]}`;
  }
  return link; // fallback
};



const FoodItem = ({ id, name, price, description, image }) => {
  const { cartItems, addToCart, removeFromCart, url } = useContext(StoreContext);

  console.log("Image URL for item:", name, "->", image);
  const imageUrl = "https://drive.google.com/uc?export=view&id=1-x7UeBV8ZjuXQk929E_sZHPlYkkZi_sq";

  return (
    <div className="food-item">
      <div className="food-item-img-container">
        <img className="food-item-image" src="https://drive.google.com/uc?export=view&id=1-x7UeBV8ZjuXQk929E_sZHPlYkkZi_sq" alt="" />
        {!cartItems[id] ? (
          <img
            className="add"
            onClick={() => addToCart(id)}
            src={assets.add_icon_white}
            alt=""
          />
        ) : (
          <div className="food-item-counter">
            <img
              onClick={() => removeFromCart(id)}
              src={assets.remove_icon_red}
              alt=""
            />
            <p>{cartItems[id]}</p>
            <img
              onClick={() => addToCart(id)}
              src={assets.add_icon_green}
              alt=""
            />
          </div>
        )}
      </div>
      <div className="food-item-info">
        <div className="food-item-name-rating">
          <p>{name}</p>
          <img src="https://drive.google.com/uc?export=view&id=1-x7UeBV8ZjuXQk929E_sZHPlYkkZi_sq" alt="food" />

          
           
        </div>
        <p className="food-item-desc">{description}</p>
        <p className="food-item-price">${price}</p>
      </div>
    </div>
  );
};

export default FoodItem;
