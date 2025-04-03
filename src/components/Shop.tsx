import React, { useState, useEffect } from "react";
import "./Shop.css";
import { ShopProducts } from "./products";

import ProductCard from "./ProductCard.tsx";
import NoItemFound from "./NoItemFound.tsx";

function Shop({ search }) {
  const [shopProducts, setShopProducts] = useState(ShopProducts);
  const [categoryName, setCategoryName] = useState("all");
  let listRendered=false;
  useEffect(() => {
    if (search !== "") setCategoryName("None");
    if (search == "") setCategoryName("all");
  }, [search]);

  return (
    <div className="shop">
      <div className="container">
        <div className="shop-header">
          <div className="head-box">
            <h3>#SHOP</h3>
            <p> Home .Shop</p>
          </div>
        </div>
        <div className="product-container">
          <div className="left-box">
            <div className="categories">
              <div className="heading">
                <h4>all categories</h4>
              </div>
              <div className="cat-list">
                <h3 onClick={() => setCategoryName("all")}># ALL</h3>
                <h3 onClick={() => setCategoryName("TV")}># TV</h3>
                <h3 onClick={() => setCategoryName("Watch")}># WATCH</h3>
                <h3 onClick={() => setCategoryName("Speaker")}># SPEAKER</h3>
                <h3 onClick={() => setCategoryName("Electronics")}>
                  # ELECTRONICS
                </h3>
                <h3 onClick={() => setCategoryName("Headphones")}>
                  # HEADPHONES
                </h3>
                <h3 onClick={() => setCategoryName("Phone")}># PHONE</h3>
              </div>
            </div>
            <div className="banner">
              <div className="image-container">
                <img
                  src="https://mir-s3-cdn-cf.behance.net/projects/404/a2aaf3151269387.Y3JvcCwxNTUyLDEyMTQsMCww.png"
                  alt=""
                />
              </div>
            </div>
          </div>
          <div className="right-box">
            <div className="right-box-banner">
              <div className="right-box-banner-container">
                <img
                  src="https://vrsdesign.com/cdn/shop/articles/FINALGIVEAWAYBANNER.jpg?v=1623868059"
                  alt=""
                />
              </div>
            </div>
            <div className="right-box-products-section">
              <div className="right-box-products-heading">
                <h3>PRODUCTS</h3>
              </div>
              <div className="products">
                {categoryName === "all"
                  ? shopProducts.map(({ id, name, price, img, cat, type }) => (
                      <ProductCard {...{ id, name, price, img, cat, type }} />
                    ))
                  : shopProducts.map(({ id, name, price, img, cat, type }) => {
                      return (
                        
                        categoryName === name && (
                          <ProductCard
                            {...{ id, name, price, img, cat, type }}
                          />
                        )
                      );
                    })}
                {search &&
                  shopProducts
                    .filter(({ name }) =>
                      name
                        ?.trim()
                        .toLowerCase()
                        .includes(search?.trim().toLowerCase())
                    ) // Filter based on the category
                    .map(({ id, name, price, img, cat, type }) => {
                      listRendered=true;
                     return <ProductCard {...{ id, name, price, img, cat, type }} />
})}
                    {
                      listRendered === false && search !== "" ? (
                        <NoItemFound />
                      ) : null
                    }
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Shop;
