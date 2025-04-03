import React, { useContext } from "react";
import { AiFillHeart, AiFillEye } from "react-icons/ai";
import { FaShoppingCart } from "react-icons/fa";
import "./HorCard.css";
import Context from "./Context";
function ProductHorizontalCard({ id, name, price, img, cat, type, category }) {
  const { cart, setCart } = useContext(Context);
  return (
    <div className="card">
      <div className="image-container">
        <img src={img} alt="" />
      </div>
      <div className="other-info">
        <div className="name-container">
          <h3>{name}</h3>
        </div>

        <div className="price-container">
          <p>${price}</p>
        </div>
        <div className="icons-container">
          <div className="icon">
            <AiFillEye />
          </div>
          <div className="icon">
            <AiFillHeart />
          </div>

          <div
            className="icon"
            onClick={() => {
              if(cart.some(elem=>elem.id===id)){
                alert("item already added")
                }
              else{
                alert("item set to cart")
                setCart([...cart, { id, name, price, img, cat, type, category }]);
              }
            }}
          >
            <FaShoppingCart />
          </div>
        </div>
      </div>
    </div>
  );
}
export default ProductHorizontalCard;
