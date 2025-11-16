import React from 'react'
import Navbar from './Navbar'
import Banner from './Banner'
import NewArrivals from './NewArrivals'
import Categories from './Categories'
import About from './About'
import Footer from './Footer'



const home = () => {
  return (
    <div>
      <Navbar />
      <Banner />
      <Categories />
      <NewArrivals />
      <About />
      <Footer />
    </div>
  )
}

export default home