// pages/Home.jsx
import React from 'react'
import AdminAnalytics from '../components/AdminAnalytics'


const Home = ({ atoken }) => {
  return (
    <div>
      <div className='mb-8'>
        <h1 className='text-3xl font-bold text-gray-900'>Dashboard Overview</h1>
        <p className='text-gray-600 mt-2'>Monitor your store's performance and key metrics</p>
      </div>
      <AdminAnalytics atoken={atoken} />
    </div>
  )
}

export default Home