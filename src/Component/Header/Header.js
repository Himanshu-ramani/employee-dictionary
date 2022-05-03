import React, { useRef, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch,useSelector } from "react-redux";
import { signOut } from "firebase/auth";
import { auth } from "../../Firebase/Firebase";
import "./Header.css";
function Header() {
  const dispatch = useDispatch();
  const state = useSelector((state) => state);
  const searchRef = useRef(null);
  const [sesarchToggle, setSesarchToggle] = useState(false);
  const navigate = useNavigate();
  const searchHandler = () => {
    navigate("/Employee-list");
    setSesarchToggle(true);
  };
  const inputHandler = (e) => {
    dispatch({ type: "SEARCH", payload: searchRef.current.value });
  };
  const logOutHandler = async()=>{
  await signOut (auth)
  localStorage.setItem('user', JSON.stringify(null));
  navigate('/')
  dispatch({ type: "LOGOUT", payload:null });
  }

  return (
    <nav className="nav">
     {state.userState === null ?<><ul className="nav_auth_button">
       <li>
       <NavLink
              className={(navData) =>
                navData.isActive ? "active_link" : "link"
              }
              to="/Authentication/login"
            >
         Sign In
            </NavLink>
       </li>
       <li>
       <NavLink
              className={(navData) =>
                navData.isActive ? "active_link" : "link"
              }
              to="/Authentication/SignUp"
            >
         Create Account
            </NavLink>
       </li>
       </ul></> : <div
        className={sesarchToggle ? "nav_content click_content" : "nav_content"}
      >
        <ul
          className={
            sesarchToggle ? "nav_button_container hide" : "nav_button_container"
          }
        >
          <li>
            <NavLink
              className={(navData) =>
                navData.isActive ? "active_link" : "link"
              }
              to="/Add-employe"
            >
              Add Employee
            </NavLink>
          </li>
          <li>
            <NavLink
              className={(navData) =>
                navData.isActive ? "active_link" : "link"
              }
              to="/Employee-list"
            >
              Employee List
            </NavLink>
          </li>
          <li>
            <span className="link" onClick={logOutHandler}>Log Out</span>
            
          </li>
        </ul>
        <div className={sesarchToggle ? "search_container" : ""}>
          <input
            placeholder="Search"
            onChange={inputHandler}
            ref={searchRef}
            onClick={searchHandler}
            className={sesarchToggle ? "search_input" : ""}
          />
          {sesarchToggle && (
            <button
              onClick={() => {
                setSesarchToggle(false);
              }}
            >
              X
            </button>
          )}
        </div>
      </div>}
    </nav>
  );
}

export default Header;
