import React, { useState ,useEffect} from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { auth } from "../../Firebase/Firebase";
import { useDispatch } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import toast from "react-hot-toast";
import "./AuthPage.css";
function AuthPage() {
  const [dataInput, setDataInput] = useState({ email: "", password: "" });
  const [isValid , setIsValid] = useState({email :false , password :false})
  const [error , setError] = useState({email:'' , password:""})
  const [loading, setLoading] = useState(false)
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { userState } = useParams();
  const inputChangeHandler = (e) => {
    const { name, value } = e.target;
    setDataInput((pre) => ({ ...pre, [name]: value }));
  };
  useEffect(() => {
    setDataInput({ email: "", password: "" })
  }, [userState])
  

  const inputBlurHanlder =(e)=>{
    const { name, value } = e.target;
    if (value.trim() === '') {
        setIsValid(pre=>({...pre,[name]:false}))
        setError(pre =>({...pre ,[name]: `Invalid ${name} `}))
    }else{
        setIsValid(pre=>({...pre,[name]:true}))
    }
  }
const validation =()=>{
    for (const key in dataInput ) {
        if (dataInput[key].trim() ==='') {
            setIsValid(pre=>({...pre,[key]:false}))
            setError(pre =>({...pre ,[key]: `Invalid ${key} `}))
        }
    }
}
    
  const AuthSubmitHandler = async (e) => {
    e.preventDefault();
    validation()
    if (Object.values(isValid).includes(false)) {
        return
    }
    if (userState === "SignUp") {
      try {
          setLoading(true)
        await createUserWithEmailAndPassword(
          auth,
          dataInput.email,
          dataInput.passWord
        ).then((userCredential) => {
          // Signed in

          console.log(userCredential._tokenResponse.localId);
          dispatch({
            type: "SIGNUP",
            payload: userCredential._tokenResponse.localId,
          });
          setLoading(false)

          setTimeout(() => {
            navigate("/Employee-list");
          }, 2000);
        });
      } catch (error) {
          if (error.message === 'Firebase: Error (auth/email-already-in-use).') {
              setError(pre=>({...pre , email: 'Email is already in use'}))
          }else{
            setError(pre=>({...pre , email: ''}))
            toast.error(error.message)
          }
        console.log(error);
      }
    }
    if (userState === "login") {
      try {
        setLoading(false)
        await signInWithEmailAndPassword(
          auth,
          dataInput.email,
          dataInput.passWord
        ).then((userCredential) => {
          // Signed in
          console.log(userCredential._tokenResponse.localId);
          dispatch({
            type: "SIGNUP",
            payload: userCredential._tokenResponse.localId,
          });
          setLoading(false)
          setTimeout(() => {
            navigate("/Employee-list");
          }, 2000);
        });
      } catch (error) {
        if (error.message === 'Firebase: Error (auth/wrong-password).') {
            setError(pre=>({...pre , passWord: 'Wrong Password'}))
        }else{
            setError(pre=>({...pre , passWord: ''}))
            toast.error(error.message)
          }
        
      }
    }
  };

  return (
    <>
      <div className="form_container">
      <Toaster position="top-center" reverseOrder={false} />

        <form onSubmit={AuthSubmitHandler} className="auth_form">
          <h2>{userState === "SignUp" ? "Create Account" : "Login"}</h2>
          <input
            type="email"
            placeholder="Email"
            name="email"
            onChange={inputChangeHandler}
            onBlur={inputBlurHanlder}
            value={dataInput.email}
          />
          {error.error !== '' &&<div className="auth_error">{error.email}</div>}
          <input
            type="password"
            placeholder="Password"
            name="password"
            onChange={inputChangeHandler}
            onBlur={inputBlurHanlder}
            value={dataInput.password}
          />
          {error.error !== '' &&<div className="auth_error">{error.password}</div>}
          <button type="submit" disabled={loading}>
            {userState === "SignUp" && "Sign In"}{" "}
            {userState === "login" && "Log In"}
          </button>
          {userState === "SignUp" && (
            <p>
              Dont't have Account{" "}
              {<Link to="/Authentication/login"> Log In</Link>}{" "}
            </p>
          )}
          {userState === "login" && (
            <p>
              Already have Account{" "}
              {<Link to="/Authentication/SignUp"> Sign In</Link>}{" "}
            </p>
          )}
        </form>
      </div>
    </>
  );
}

export default AuthPage;
