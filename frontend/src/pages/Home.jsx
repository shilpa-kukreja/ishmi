import React from 'react'
import Header from '../components/Header'
import Banner from '../components/Banner'
import Headers from '../components/Headers'
import BestSeller from '../components/BestSeller'
import Video from '../components/Video'
import Bannerss from '../components/Bannerss'
import Newcollection from '../components/Newcollection'
import Information from '../components/Information'
import BlogSection from '../components/BlogSection'
import Images from '../components/Images'
import Newsletter from '../components/Newsletter'
import Combosslider from '../components/Combosslider'



const Home = () => {
  return (
    <div className=' '>
     
  <Header  /> 
    {/**   <Banner/>*/}
      <Headers/>
      <Video/>
      <BestSeller/>
      <Bannerss/>
      <Newcollection/>
      <Information/>
      <Combosslider/>
      <BlogSection/>
      <Images/>
      <Newsletter/>
    </div>
  )
}

export default Home
