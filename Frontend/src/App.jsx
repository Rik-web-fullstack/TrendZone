import React from 'react'
import AdminPanel from './components/AdminPanel'
import Home from './components/home'
import Cart from './components/Cart'
import { BrowserRouter,Routes,Route } from 'react-router-dom'
import Register from './components/Register'
import Login from './components/Login'
import Wishlist from './components/Wishlist'
import ProductPage from "./components/ProductPage";
import Payment from './components/Payment'
import Orders from './components/Orders'
import ProductDetails from './components/ProductDetails'
import AboutUS from './components/AboutUS'
const App = () => {
  return (
      <BrowserRouter>
      <Routes>
        <Route path='/register' element={<Register />}></Route>
        <Route path='/' element={<Home />}></Route>
        <Route path='/adminPanel' element={<AdminPanel />}></Route>
        <Route path='/login' element={<Login />}></Route>
        <Route path='/cart' element={<Cart />}></Route>
        <Route path='/wishlist' element={<Wishlist />}></Route>
        <Route path="/category/:category" element={<ProductPage />} />
        <Route path="/category/:category/:subcategory" element={<ProductPage />} />
        <Route path='/payment' element={<Payment/>}></Route>
        <Route path='/orders' element={<Orders/>}></Route>
        <Route path='/product/:id' element={<ProductDetails/>}></Route>
        <Route path='/about' element={<AboutUS/>}></Route>
      </Routes>
      </BrowserRouter>
  )
}

export default App