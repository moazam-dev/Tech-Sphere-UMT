import { Routes, Route } from "react-router";
import Home from "./Home.tsx";
import Shop from "./Shop.tsx";
import Cart from "./Cart.tsx";
import About from "./About.tsx";
import Contact from "./Contact.tsx";
import React from "react";
function RouteSetter({ search}) {
  return (
    <Routes>
      <Route path="/" element={<Home {...{ search }} />}/>
      <Route path="/Home" element={<Home {...{ search }} />} />
      <Route path="/Shop" element={<Shop {...{ search }} />} />
      <Route path="/Cart" element={<Cart/>} />
      <Route path="/About" element={<About/>} />
      <Route path="/Contact" element={<Contact/>} />
    </Routes>
  );
}

export default RouteSetter;
