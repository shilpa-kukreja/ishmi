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
      <Login setToken={setAToken}/>:
      <>
      <Navbar setToken={setAToken}/>
      <hr />
      <div className='flex w-full'>
        <Sidebar/>
        <div className='w-[90%] mx-auto ml-[max(5vw,20px)] my-8 text-gray-600 text-base'>
          <Routes>
            <Route path='/' element={<Home token={atoken}/>}/>
            <Route path='/add' element={<Add token={atoken}/>}/>
            <Route path="/add/:id" element={<Add token={atoken}/>}/>
            <Route path='/list' element={<List token={atoken}/>}/>
            <Route path='/orders' element={<Orders token={atoken}/>}/>
            <Route path='/users' element={<Users token={atoken}/>}/>
            <Route path='/contacts' element={<Contact token={atoken}/>}/>
            <Route path='/subscriptions' element={<Subscription token={atoken}/>}/>
            <Route path='/dashboard' element={<Dashboard token={atoken}/>}/>
            <Route path='/addblog' element={<Addblog token={atoken}/>}/>
            <Route path='/listblog' element={<Listblog token={atoken}/>}/>
            <Route path='/addcoupan' element={<AdminAddCoupon token={atoken}/>}/>
            <Route path='/listcoupan' element={<AdminCouponList token={atoken}/>}/>
            <Route path='/addcombos' element={<AddCombo token={atoken}/>}/>
            <Route path='/addcombos/:id' element={<AddCombo token={atoken}/>}/>
            <Route path='/listcombos' element={<ListCombos token={atoken}/>}/>
          </Routes>

        </div>

      </div>
      </>
      }
    </div>
  )
}

export default App
