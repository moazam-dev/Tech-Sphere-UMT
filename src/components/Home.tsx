import { Link } from "react-router-dom";
import React, { useState, useEffect, useContext } from "react";
import "./Home.css";
import { HomeProducts } from "./products";
import ProductCard from "./ProductCard.tsx";
import ProductHorizontalCard from "./productHorizontalCard.tsx";

import {
  FaFacebook,
  FaInstagram,
  FaLinkedinIn,
  FaTwitter,
} from "react-icons/fa";
import NoItemFound from "./NoItemFound.tsx";

function Home({ search }) {
  useEffect(() => {
    if (search !== "") setCategory("None");
    if (search == "") setCategory("all");
  }, [search]);
  let listRendered = false;
  const [trendingProducts, setTrendingProducts] = useState(HomeProducts);
  const [category, setCategory] = useState("initial");
  return (
    <div className="home">
      <div className="top_banner">
        <div className="banner-content">
          <h3>Silver Aluminium</h3>
          <h4>Apple Watch</h4>
          <h6>40% off on first order</h6>
          <Link to="/Shop" className="shopNOwBtn">
            Shop now
          </Link>
        </div>
      </div>
      <div className="trending">
        <div className="container">
          <div className="left-box">
            <div className="head">
              <div className="heading">
                <h2>trending products</h2>
              </div>
              <div className="cate">
                <h3
                  onClick={() => {
                    listRendered=true
                    setCategory("all");
                  }}
                >
                  All
                </h3>
                <h3
                  onClick={() => {
                    listRendered=true
                    setCategory("new");
                  }}
                >
                  new
                </h3>
                <h3
                  onClick={() => {
                    listRendered=true
                    setCategory("featured");
                  }}
                >
                  featured
                </h3>
                <h3
                  onClick={() => {
                     listRendered=true
                    setCategory("topselling");
                  }}
                >
                  topselling
                </h3>
              </div>
            </div>
            <div className="products">
              <div className="container">
                {category === "all"
                  ? trendingProducts.map(
                      ({ id, name, price, img, cat, type }) => (
                        <ProductCard {...{ id, name, price, img, cat, type }} />
                      )
                    )
                  : trendingProducts
                      .filter(({ type }) => type === category) // Filter based on the category
                      .map(({ id, name, price, img, cat, type }) => (
                        <ProductCard {...{ id, name, price, img, cat, type }} />
                      ))}
                {/* code for implementing search feature it filters products based on search then uses map to renders it */}
                {search &&
                  trendingProducts
                    .filter(({ name }) =>
                      name
                        ?.trim()
                        .toLowerCase()
                        .includes(search?.trim().toLowerCase())
                    ) // Filter based on the category
                    .map(
                      (
                        { id, name, price, img, cat, type },
                        index,
                        filteredArray
                      ) => {
                        listRendered = true;
                        return (
                          <ProductCard
                            {...{ id, name, price, img, cat, type }}
                          />
                        );
                      }
                    )}
                {(listRendered === false && search !== "") && (category==="None" )? (
                  <NoItemFound />
                ) : null}
              </div>
              <button className="showMoreBtn">Show More</button>
            </div>
          </div>
          <div className="right-box">
            <div className="container">
              <div className="testimonial">
                <div className="head">
                  <h3>Testimonial</h3>
                </div>
                <div className="details">
                  <div className="image_box">
                    <img
                      src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQlWnvoOOuMP4xjL3qvKMUXw5V67oZDcn9lbg&s"
                      alt="testimonial"
                    />
                  </div>
                  <div className="info">
                    <h3>Sara J</h3>
                    <h4>Web Designer</h4>
                    <p>
                      Lorem ipsum dolor sit amet consectetur, adipisicing elit.
                      Obcaecati, saepe.
                    </p>
                  </div>
                </div>
                <div className="news-letter">
                  <div className="head">
                    <h3>News Letter</h3>
                  </div>
                  <div className="form">
                    <p>Join Our Mailing List</p>
                    <div className="email">
                      <input type="email" placeholder="Enter your email" />
                    </div>
                    <a href="#">Submit</a>
                  </div>
                  <div className="social">
                    <div className="container">
                      <FaFacebook className="links" />
                      <FaInstagram className="links" />
                      <FaLinkedinIn className="links" />
                      <FaTwitter className="links" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="banners">
          <div className="container">
            <div className="left_box">
              <div className="box" id="box-1">
                <img
                  src="https://i.pinimg.com/736x/34/32/b1/3432b14cfdb2ec4f5fd99009ea8c11ca.jpg"
                  alt="banner-1"
                />
              </div>
              <div className="box" id="box-2">
                <img
                  src="https://i.pinimg.com/736x/f0/f5/a6/f0f5a6cc6bff547d2c7d5cbcb00bea85.jpg"
                  alt="banner-1"
                />
              </div>
              <div className="box" id="box-3">
                <img
                  src="https://templates.simplified.co/thumb/9d69b617-cfb9-44c0-85c1-533e54672b42.jpg"
                  alt="banner-1"
                />
              </div>
              <div className="box" id="box-4">
                <img
                  src="https://www.shutterstock.com/image-photo/lahore-pakistan-may-13th-2021-600nw-1973343692.jpg"
                  alt="banner-1"
                />
              </div>
            </div>
          </div>
        </div>
        <div className="category-products">
          <div className="container">
            <div className="new-products">
              <div className="head">
                <h3>NEW PRODUCTS</h3>
              </div>
              {trendingProducts.map(({ id, name, img, price, type }) => {
                if (type === "new")
                  return (
                    <ProductHorizontalCard {...{ id, name, img, price }} />
                  );
              })}
            </div>
            <div className="top-products">
              <div className="head">
                <h3>TOP PRODUCTS</h3>
              </div>
              {trendingProducts.map(({ id, name, img, price, type }) => {
                if (type === "topselling")
                  return (
                    <ProductHorizontalCard {...{ id, name, img, price }} />
                  );
              })}
            </div>
            <div className="featured-products">
              <div className="head">
                <h3>FEATURED PRODUCTS</h3>
              </div>
              {trendingProducts.map(({ id, name, img, price, type }) => {
                if (type === "featured")
                  return (
                    <ProductHorizontalCard {...{ id, name, img, price }} />
                  );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
