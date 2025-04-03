import React, { useContext } from "react";
import "./ProductCard.css";
import { Link } from "react-router-dom";
import { AiFillEye, AiFillHeart } from "react-icons/ai";
import Context from "./Context";
function ProductCard({ id, name, price, img, cat, type, category }) {
  const { cart, setCart } = useContext(Context);
  const currentProduct={ id, name, price, img, cat, type, category }
  return (
    <div className="box">
      <div className="img_box">
        <img src={img} alt="" />
      </div>
      <div className="icon">
        <div className="icon_box">
          <AiFillEye />
        </div>
        <div className="icon_box">
          <AiFillHeart />
        </div>
      </div>
      <div className="info">
        <h3>{name}</h3>
        <p>${price}</p>
        <Link
          to="/cart"
          className="addToCartBtn"
          onClick={() => {
            if(cart.some(elem=>elem.id===id)){
            alert("item already added")
            }
          else{
            alert("item set to cart")
            setCart([...cart, { id, name, price, img, cat, type, category }]);
          }}}
        >
          Add to Cart
        </Link>
      </div>
    </div>
  );
}
export default ProductCard;
