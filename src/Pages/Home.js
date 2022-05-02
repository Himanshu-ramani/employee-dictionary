import React from 'react'
import img from '../Assest/Core-HR-01.png'
import './Home.css'
import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();

  return (
   <>
   <section className='home_head'>
     <div className='home_info'>
   <h1>Welcome to your <br />
   Employee Data entry App
   </h1>
   <p>Get more done with Online Employee Entry. Now integrated with Online Employee Entry and have flexibility tu access your list anywhere.</p>
   <button className='home_button' onClick={()=>{navigate(`/Authentication/SignUp`);}}>Get Started</button>
   </div>
  <img src={img} alt='landing img' className='home_img' />
   </section>
   </>
  )
}

export default Home