import React, { useEffect, useState } from 'react'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Login from './components/Login';
import Navbar from './components/Navbar';
import Add from './pages/Add';
import List from './pages/List';
import Orders from './pages/orders';
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
  const [token,setToken]=useState(localStorage.getItem('token')?localStorage.getItem('token'):'')
useEffect(()=>{
localStorage.setItem('token',token)
},[token])
  return (

    <div className='bg-gray-50 min-h-screen'>
        <ToastContainer/>
        {token===""?
      <Login setToken={setToken}/>:
      <>
      <Navbar setToken={setToken}/>
      <hr />
      <div className='flex w-full'>
        <Sidebar/>
        <div className='w-[90%] mx-auto ml-[max(5vw,20px)] my-8 text-gray-600 text-base'>
          <Routes>
            <Route path='/' element={<Home token={token}/>}/>
            <Route path='/add' element={<Add token={token}/>}/>
            <Route path="/add/:id" element={<Add token={token}/>}/>
            <Route path='/list' element={<List token={token}/>}/>
            <Route path='/orders' element={<Orders token={token}/>}/>
            <Route path='/users' element={<Users token={token}/>}/>
            <Route path='/contacts' element={<Contact token={token}/>}/>
            <Route path='/subscriptions' element={<Subscription token={token}/>}/>
            <Route path='/dashboard' element={<Dashboard token={token}/>}/>
            <Route path='/addblog' element={<Addblog token={token}/>}/>
            <Route path='/listblog' element={<Listblog token={token}/>}/>
            <Route path='/addcoupan' element={<AdminAddCoupon token={token}/>}/>
            <Route path='/listcoupan' element={<AdminCouponList token={token}/>}/>
            <Route path='/addcombos' element={<AddCombo token={token}/>}/>
            <Route path='/addcombos/:id' element={<AddCombo token={token}/>}/>
            <Route path='/listcombos' element={<ListCombos token={token}/>}/>
          </Routes>

        </div>

      </div>
      </>
      }
    </div>
  )
}

export default App
