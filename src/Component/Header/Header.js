import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { signOut } from "firebase/auth";
import { auth } from "../../Firebase/Firebase";
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
const hemburgHanlder =(e)=>{
  e.target.classList.toggle("change");
}
  return (
    <nav className="nav">
      <h3>Employee Entry App</h3>
      {state.userState === null ? (
        <>
          <ul className="nav_auth_button" id="myLinks">
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
          </ul>
        </>
      ) : (
        <div className="nav_content ">
          <ul className="nav_button_container">
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
              <span className="link" onClick={logOutHandler}>
                Log Out
              </span>
            </li>
         <li className="user_name">{state.userName}</li>
          </ul>
        </div>
      )}
      <div className="container" onClick={hemburgHanlder}>
  <div className="bar1"></div>
  <div className="bar2"></div>
  <div className="bar3"></div>
</div>
    </nav>
  );
}

export default Header;
