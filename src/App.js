
import React ,{useState} from 'react';
import Navbar from './components/Navbar.tsx';
import {  BrowserRouter as RouterWrapper } from 'react-router-dom';
import RouteSetter from './components/Route.tsx';
import Footer from './components/Footer.tsx';
import Context from './components/Context.js';
function App() {
  const [search,setSearch]=useState("");
  const[cart,setCart]=useState([]);
  return (

    <div className="App">
      <RouterWrapper>
          <Navbar {...{setSearch}}/>
              <Context.Provider value={{cart,setCart}}>
              <RouteSetter {...{search,cart,setCart}} />
              </Context.Provider>
          <Footer/>
      </RouterWrapper>
    </div>
    
  );
}

export default App;
