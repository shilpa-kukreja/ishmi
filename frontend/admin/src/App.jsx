import React, { useEffect, useState } from 'react'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Login from './components/Login';
import Navbar from './components/Navbar';
import Add from './pages/Add';
import List from './pages/List';
import Orders from './pages/Orders';
import Sidebar from './components/Sidebar';
import { Route, Routes } from 'react-router-dom';
import Users from './pages/Users';
import Contact from './pages/Contact';
import Subscription from './pages/Subscription';
import Dashboard from './pages/Dashboard';
import Addblog from './pages/Addblog';
import Listblog from './pages/Listblog';
import Home from './pages/Home';
import AdminAddCoupon from './pages/AdminAddCoupon';
import AdminCouponList from './pages/AdminCouponList';
import AddCombo from './pages/AddCombos';
import ListCombos from './pages/ListCombos';




export const backendUrl=import.meta.env.VITE_BACKEND_URL

const App = () => {
  const [atoken,setAToken]=useState(localStorage.getItem('atoken')?localStorage.getItem('atoken'):'')
useEffect(()=>{
localStorage.setItem('atoken',atoken)
},[atoken])
  return (

    <div className='bg-gray-50 min-h-screen'>
        <ToastContainer/>
        {atoken===""?
      <Login setAToken={setAToken}/>:
      <>
      <Navbar setAToken={setAToken}/>
      <hr />
      <div className='flex w-full'>
        <Sidebar/>
        <div className='w-[90%] mx-auto ml-[max(5vw,20px)] my-8 text-gray-600 text-base'>
          <Routes>
            <Route path='/' element={<Home atoken={atoken}/>}/>
            <Route path='/add' element={<Add atoken={atoken}/>}/>
            <Route path="/add/:id" element={<Add atoken={atoken}/>}/>
            <Route path='/list' element={<List atoken={atoken}/>}/>
            <Route path='/orders' element={<Orders atoken={atoken}/>}/>
            <Route path='/users' element={<Users atoken={atoken}/>}/>
            <Route path='/contacts' element={<Contact atoken={atoken}/>}/>
            <Route path='/subscriptions' element={<Subscription atoken={atoken}/>}/>
            <Route path='/dashboard' element={<Dashboard atoken={atoken}/>}/>
            <Route path='/addblog' element={<Addblog atoken={atoken}/>}/>
            <Route path='/listblog' element={<Listblog atoken={atoken}/>}/>
            <Route path='/addcoupan' element={<AdminAddCoupon atoken={atoken}/>}/>
            <Route path='/listcoupan' element={<AdminCouponList atoken={atoken}/>}/>
            <Route path='/addcombos' element={<AddCombo atoken={atoken}/>}/>
            <Route path='/addcombos/:id' element={<AddCombo atoken={atoken}/>}/>
            <Route path='/listcombos' element={<ListCombos atoken={atoken}/>}/>
          </Routes>

        </div>

      </div>
      </>
      }
    </div>
  )
}

export default App
