import React, { useState, useEffect } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { sendEmailVerification ,updateProfile} from "firebase/auth";
import { db } from "../../Firebase/Firebase";
import { collection, addDoc,  } from "firebase/firestore";
import { auth } from "../../Firebase/Firebase";
import { useDispatch } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import toast from "react-hot-toast";
import "./AuthPage.css";
function AuthPage() {
  const [dataInput, setDataInput] = useState({ email: "", password: "" ,firstName:"",lastName:""});
  const [isValid, setIsValid] = useState({ email: false, password: false });
  const [error, setError] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [content , setContent] =useState(false)
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { userState } = useParams();
  const inputChangeHandler = (e) => {
    const { name, value } = e.target;
    setDataInput((pre) => ({ ...pre, [name]: value }));
  };
  useEffect(() => {
    setDataInput({ email: "", password: "" });
    setError({ email: "", password: "" });
  }, [userState]);

  const inputBlurHanlder = (e) => {
    const { name, value } = e.target;
    if (value.trim() === "") {
      setIsValid((pre) => ({ ...pre, [name]: false }));
      setError((pre) => ({ ...pre, [name]: `Invalid ${name} ` }));
    } else {
      setIsValid((pre) => ({ ...pre, [name]: true }));
      setError((pre) => ({ ...pre, [name]: `` }));
    }
  };
  const validation = () => {
    for (const key in dataInput) {
      if (dataInput[key].trim() === "") {
        setIsValid((pre) => ({ ...pre, [key]: false }));
        setError((pre) => ({ ...pre, [key]: `Invalid ${key} ` }));
      }
    }
  };

  const AuthSubmitHandler = async (e) => {
    e.preventDefault();
    validation();
   
    if (Object.values(isValid).includes(false)) {
      return;
    }
    if (userState === "SignUp") {
      try {
        setLoading(true);
  const userCollectionRef = collection(db, 'usersList');
      await addDoc(userCollectionRef,dataInput );
        const user = await createUserWithEmailAndPassword(
          auth,
          dataInput.email,
          dataInput.password
        );
        toast.success('Account Created Succesfully')
        console.log(user);
        setContent(true)
        await updateProfile (auth.currentUser,{
          displayName: dataInput.firstName +' '+ dataInput.lastName
        })
      await  sendEmailVerification(auth.currentUser)
        .then(() => {
       
        });
        setLoading(false);
        console.log(user);
        setContent(false)

        setTimeout(() => {

          navigate("/Authentication/login");
        }, 1000);
      } catch (error) {
        if (error.message === "Firebase: Error (auth/email-already-in-use).") {
          setError((pre) => ({ ...pre, email: "Email is already in use" }));
        } else {
          setError((pre) => ({ ...pre, email: "" }));
          toast.error(error.message);
        }
        console.log(error);
        setLoading(false);
      }
    }
    if (userState === "login") {
      try {
        setLoading(true);
     const user =   await signInWithEmailAndPassword(
          auth,
          dataInput.email,
          dataInput.password
        )
        if (user.emailVerified) {
          toast.error('verify your email')
            return
        }
             dispatch({
            type: "SIGNUP",
            payload: user._tokenResponse.localId,
          });
          localStorage.setItem(
            "user",
            JSON.stringify(user._tokenResponse.localId)
          );
          setLoading(false)
            setTimeout(() => {
            navigate("/Employee-list");
          }, 1000);

      } catch (error) {
        if (error.message === "Firebase: Error (auth/wrong-password).") {
          setError((pre) => ({ ...pre, passWord: "Wrong Password" }));
        } else {
          setError((pre) => ({ ...pre, passWord: "" }));
          toast.error(error.message);
        }
        setLoading(false);
      }
    }
  };

  return (
    <>
      <div className="form_container">
        <Toaster position="top-center" reverseOrder={false} />

      { content === false ? <form onSubmit={AuthSubmitHandler} className="auth_form">
          <h2>{userState === "SignUp" ? "Create Account" : "Login"}</h2>
          {userState === "SignUp" && (
            <>
              <input
                type="text"
                placeholder="First Name"
                name="firstName"
                onChange={inputChangeHandler}
                onBlur={inputBlurHanlder}
                value={dataInput.firstName}
              />
              <input
                type="text"
                name="lastName"
                placeholder="Last Name"
                onChange={inputChangeHandler}
                onBlur={inputBlurHanlder}
                value={dataInput.lastName}
              />
            </>
          )}
          <input
            type="email"
            placeholder="Email"
            name="email"
            required
            onChange={inputChangeHandler}
            onBlur={inputBlurHanlder}
            value={dataInput.email}
          />
          {error.error !== "" && (
            <div className="auth_error">{error.email}</div>
          )}
          <input
            type="password"
            placeholder="Password"
            name="password"
            onChange={inputChangeHandler}
            onBlur={inputBlurHanlder}
            value={dataInput.password}
          />
          {error.error !== "" && (
            <div className="auth_error">{error.password}</div>
          )}
          <button type="submit">
            {loading ? (
              "Loading..."
            ) : (
              <>
                {userState === "SignUp" && "Sign up"}
                {userState === "login" && "Log In"}{" "}
              </>
            )}
          </button>
          {userState === "login" && (
            <p>
              Don't have Account{" "}
              {<Link to="/Authentication/login"> Sign up</Link>}{" "}
            </p>
          )}
          {userState === "SignUp" && (
            <p>
              Already have Account{" "}
              {<Link to="/Authentication/SignUp"> Log in</Link>}{" "}
            </p>
          )}
        </form> : <h1 className="note">Verify your Email!</h1>}
      </div>
    </>
  );
}

export default AuthPage;
