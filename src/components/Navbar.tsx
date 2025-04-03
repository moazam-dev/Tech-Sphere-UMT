import { MdCancel, MdLocalShipping } from "react-icons/md";
import { AiOutlineSearch } from "react-icons/ai";
import { FiLogIn } from "react-icons/fi";
import { CiLogout } from "react-icons/ci";
import React,{useState} from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { Link } from "react-router-dom";
import { IoMenu } from "react-icons/io5";

import { FaCross, FaUser } from "react-icons/fa";
import "./Navbar.css"
import RouteSetter from "./Route.tsx";
function Navbar({setSearch}) {
  const [hamber,setHamburger]=useState(true)
  const { loginWithRedirect, logout, user, isAuthenticated } = useAuth0();
  return (
    <div className="header">
      <div className="top_header">
        <div className="icon">
          <MdLocalShipping />
        </div>
        <div className="info">
          <p>free shipping shopping upto 50%</p>
        </div>
      </div>
      <div className="mid_header">
        <div className="logo">
          <a href="" className="logo">
            UBTECH
          </a>
        </div>
        <div className="search_box">
          <input type="text" placeholder="search" onChange={(e)=>setSearch(e.target.value)} />
          <button>
            <AiOutlineSearch />
          </button>
        </div>
        {isAuthenticated ? (
          <div className="user">
            <div className="icon">
              <CiLogout />
            </div>
            <div className="btn">
              <button
                onClick={() =>
                  logout({ logoutParams: { returnTo: window.location.origin } })
                }
              >
                Logout
              </button>
            </div>
          </div>
        ) : (
          <div className="user">
            <div className="icon">
              <FiLogIn />
            </div>
            <div className="btn">
              <button onClick={() => loginWithRedirect()}>Login</button>
            </div>
          </div>
        )}
      </div>
      <div className="last_header">
        {isAuthenticated? (
          <div className="user-profile">
            <>
            <FaUser />
            <p>{user?.email}</p>
            </>
            
          </div>
        ):
        <div className="user-profile">
            <>
            <FaUser />
            <p>{user?.email}</p>
            </>
            
          </div>

        }
        <div className="nav">
          <ul>
            
            <li>
              <Link to={"/Home"} className="link">
                Home
              </Link>
            </li>
            <li>
              <Link to={"/Shop"} className="link">
                Shop
              </Link>
            </li>
            <li>
              <Link to={"/Cart"} className="link">
                Cart
              </Link>
            </li>
            <li>
              <Link to={"/About"} className="link">
                About
              </Link>
            </li>
            <li>
              <Link to={"/Contact"} className="link">
                Contact
              </Link>
            </li>
          </ul>
        </div>
        <div className="offers">
            <p>flat 20% off on all iphones</p>
        </div>
        {
          (hamber)?
          <div className="hamburger-menu" onClick={()=>{
            const nav= document.querySelector(".nav")
            nav?.classList.toggle("show")
            setHamburger(false)
           }}>
           <IoMenu className="menu-btn" />
           </div>:
           <div className="cross-btn" onClick={()=>{
            const nav= document.querySelector(".nav")
            nav?.classList.toggle("show")
            setHamburger(true)
           }}>
            <MdCancel/>
           </div>
        }
       
      </div>
    </div>
  );
}
export default Navbar;
