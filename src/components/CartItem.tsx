import React from "react";
import { useState, useContext } from "react";
import { MdCancel } from "react-icons/md";
import "./CartItem.css";
import Context from "./Context";

function CartItem({ id, img, name, price, cat, category }) {
  console.log({ id, img, name, price, cat, category });

  const [quantity, setQuantity] = useState(1);
  const { cart, setCart } = useContext(Context);
  function removeCartItem(removeID) {
    const filterdCart = cart.filter((cartItem) => {
      console.log(`product id ${cartItem.id} remove id${removeID}`);
      
      if (cartItem.id === removeID) return false;
      else return true;
    });
    setCart(filterdCart);
  }
  return (
    <div className="cart-item">
      <div className="image-container">
        <img src={img} alt="" />
      </div>
      <div className="item-info">
        <div className="box1">
          <h3>{name}</h3>
          <h2>{cat || category}</h2>
          <p>${price}</p>
        </div>
        <div className="box2">
          <input
            type="number"
            value={quantity}
            onChange={() => setQuantity(quantity + 1)}
          />
        </div>
        <div
          className="box3"
          onClick={() => {
            console.log(id);
            
            removeCartItem(id);
          }}
        >
          <MdCancel />
        </div>
      </div>
    </div>
  );
}
export default CartItem;
