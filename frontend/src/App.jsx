import React from 'react'
import { Route, Routes,  } from 'react-router-dom'
import Home from './pages/Home'
import Navbar from './components/Navbar'
import Benners from './components/Benners'
import Footer from './components/Footer'
import Shop from './pages/Shop'
import Bestseller from './pages/Bestseller'
import Blogs from './pages/Blogs'
import Contact from './pages/Contact'
import About from './pages/About'
import Login from './pages/Login'
import Product from './pages/Product'
import CategoryPage from './pages/CategoryPage'
import Cart from './pages/Cart'
import Placeorder from './pages/Placeorder'
import Orders from './pages/Orders'
import BlogDetails from './pages/BlogDetails'
import Wishlist from './pages/Wishlist'
import { ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import FAQs from './pages/FAQs'
import ResetPassword from './pages/ResetPassword'
import WhatsAppChatButton from './components/WhatsAppChatButton'
import Terms from './pages/Terms'
import Privacy from './pages/Privacy'
import Return from './pages/Return'
import Shipping from './pages/Shipping'
import CouponPopup from './pages/CouponPopup'
import Combos from './pages/Combos'
import CombosDetail from './pages/CombosDetail'
import ScrollToTop from './components/ScrollToTop'




const App = () => {
  return (
    <div>
      <ScrollToTop/>
      <ToastContainer/>
      
      <Navbar/>
      {/* <CouponPopup/> */}
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/shop' element={<Shop/>}/>
        <Route path='/bestseller' element={<Bestseller/>}/>
        <Route path='/blogs' element={<Blogs/>}/>
        <Route path='/contact-us' element={<Contact/>}/>
        <Route path='/about-us' element={<About/>} />
        <Route path='/faqs' element={<FAQs/>} />
        <Route path='/cart' element={<Cart/>} />
        <Route path='/product/:productId' element={<Product/>}/>
        <Route path="/category/:categoryName" element={<CategoryPage />} />
        <Route path='/loginsignup' element={<Login/>}/>
        <Route path='/place-order' element={<Placeorder/>}/>
        <Route path='/orders' element={<Orders/>}/>
        <Route path="/reset-password/:token" element={<ResetPassword/>} />
        <Route path="/blog/:id" element={<BlogDetails/>} />
        <Route path='/whichlist' element={<Wishlist/>}/>
        <Route path='/terms-&-conditions' element={<Terms/>}/>
        <Route path='/privacy-policy' element={<Privacy/>}/>
        <Route path='/return-&-refund-policy' element={<Return/>}/>
        <Route path='/shipping-policy' element={<Shipping/>}/>
        <Route path='/gift' element={<Combos/>}/>
        <Route path='/combos/:combosId' element={<CombosDetail/>}/>
        
      </Routes>
     
       <Footer/> 
       {/* <WhatsAppChatButton/> */}

    </div>
  )
}

export default App
