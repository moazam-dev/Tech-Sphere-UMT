import React, { useContext } from "react";
import Context from "./Context";
import "./Cart.css";
import CartItem from "./CartItem.tsx";
import EmptyCart from "./EmptyCart.tsx";
function Cart() {
  const { cart } = useContext(Context);
  return (
    <div className="cart">
      <div className="container">
        <div className="cart-header">
          <div className="head-box">
            <h3>#Cart</h3>
            <p> Home .Cart</p>
          </div>
        </div>
        {cart.length === 0 ? (
          <EmptyCart />
        ) : (
          <div className="cart-items-container">
            {cart.map(({ id, img, name, price, cat, category }) => {
              return <CartItem {...{ id, img, name, price, cat, category }} />;
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default Cart;
