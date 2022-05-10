import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { signOut } from "firebase/auth";
import { auth } from "../../Firebase/Firebase";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faClose } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import "./Header.css";
function Header() {
  const dispatch = useDispatch();
  const state = useSelector((state) => state);
  const navigate = useNavigate();
  const logOutHandler = async () => {
    await signOut(auth);
    document.cookie = null;
    navigate("/");
    dispatch({ type: "LOGOUT", payload: null });
  };
  const [menuToggle, setMenuToggle] = useState(true);

  return (
    <nav className="nav">
      <h3>Employee Entry App</h3>
      {state.userState === null ? (
        <>
          <ul
            className={!menuToggle ? "nav_auth_button" : "nav_auth_button hide"}
          >
            <li
              onClick={() => {
                setMenuToggle((pre) => !pre);
              }}
            >
              <NavLink
                className={(navData) =>
                  navData.isActive ? "active_link" : "link"
                }
                to="/Authentication/login"
              >
                Sign In
              </NavLink>
            </li>
            <li
              onClick={() => {
                setMenuToggle((pre) => !pre);
              }}
            >
              <NavLink
                className={(navData) =>
                  navData.isActive ? "active_link" : "link"
                }
                to="/Authentication/SignUp"
              >
                Create Account
              </NavLink>
            </li>
          </ul>
        </>
      ) : (
        <div
          className={!menuToggle ? "nav_auth_button" : "nav_auth_button hide"}
        >
          <ul className="nav_button_container">
            <li
              onClick={() => {
                setMenuToggle((pre) => !pre);
              }}
            >
              <NavLink
                className={(navData) =>
                  navData.isActive ? "active_link" : "link"
                }
                to="/Employee-list"
              >
                Employee List
              </NavLink>
            </li>
            <li
              onClick={() => {
                setMenuToggle((pre) => !pre);
              }}
            >
              <span className="link" onClick={logOutHandler}>
                Log Out
              </span>
            </li>
            <li className="user_name">{state.userName}</li>
          </ul>
        </div>
      )}
      {menuToggle ? (
        <FontAwesomeIcon
          icon={faBars}
          className="HemburgBars"
          onClick={() => {
            setMenuToggle((pre) => !pre);
          }}
        />
      ) : (
        <FontAwesomeIcon
          icon={faClose}
          className="HemburgBars"
          onClick={() => {
            setMenuToggle((pre) => !pre);
          }}
        />
      )}
    </nav>
  );
}

export default Header;
