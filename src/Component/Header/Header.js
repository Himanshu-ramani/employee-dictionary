import React,{useRef,useState} from 'react'
import { NavLink,useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import './Header.css'
function Header() {
  const dispatch = useDispatch()
  const searchRef =useRef(null)
  const [sesarchToggle, setSesarchToggle] = useState(false)
  const navigate = useNavigate()
  const searchHandler=()=>{
    navigate("/Employee-list");
    setSesarchToggle(true)
  }
  const inputHandler =(e)=>{
    dispatch({type:'SEARCH',payload:searchRef.current.value})
  }

  return (
<nav className='nav'>
  <div className={sesarchToggle ? 'nav_content click_content' : 'nav_content'}>
  <ul className={sesarchToggle ? 'nav_button_container hide' : 'nav_button_container'}>
    <li><NavLink className={(navData)=>navData.isActive ? 'active_link' : "link" } to='/'>Home</NavLink></li>
    <li><NavLink className={(navData)=>navData.isActive ? 'active_link' : "link" } to='/Add-employe'>Add Employee</NavLink></li>
    <li><NavLink className={(navData)=>navData.isActive ? 'active_link' : "link" } to='/Employee-list'>Employee List</NavLink></li>
  </ul> 
  <div className={sesarchToggle ? 'search_container' : ''}>
 <input placeholder='Search'onChange={inputHandler} ref={searchRef} onClick={searchHandler} className={sesarchToggle ? 'search_input' : ''}/>
  {sesarchToggle &&<button onClick={()=>{setSesarchToggle(false)}}>X</button>}
  </div>
  </div>
</nav>
  )
}

export default Header