import React,{useRef} from 'react'
import { NavLink } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import './Header.css'
function Header() {
  const dispatch = useDispatch()
  const searchRef =useRef(null)
  const onClickHandler =(e)=>{
    
  }
  const inputHandler =(e)=>{
    dispatch({type:'SEARCH',payload:searchRef.current.value})
  }

  return (
<nav className='nav'>
  <div></div>
  <div className='nav_content'>
  <ul className='nav_button_container'>
    <li><NavLink className={(navData)=>navData.isActive ? 'active_link' : "link" } to='/'>Home</NavLink></li>
    <li><NavLink className={(navData)=>navData.isActive ? 'active_link' : "link" } to='/Add-employe'>Add Employee</NavLink></li>
    <li><NavLink className={(navData)=>navData.isActive ? 'active_link' : "link" } to='/Employee-list'>Employee List</NavLink></li>
  </ul> 
  <NavLink className='' to='/Employee-list'><input placeholder='Search'onChange={inputHandler} ref={searchRef} onClick={onClickHandler}/></NavLink>
  
  </div>
</nav>
  )
}

export default Header