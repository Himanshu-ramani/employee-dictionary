import React from 'react'
import img from '../Assest/Core-HR-01.png'
import './Home.css'
function Home() {
  return (
   <>
   <section className='home_head'>
     <div className='home_info'>
   <h1>Welcome to your <br />
   Employee Data entry App
   </h1>
   <p>Get more done with Online Employee Entry. Now integrated with Online Employee Entry and have flexibility tu access your list anywhere.</p>
   <button className='home_button'>Get Started</button>
   </div>
  <img src={img} className='home_img' />
   </section>
   </>
  )
}

export default Home