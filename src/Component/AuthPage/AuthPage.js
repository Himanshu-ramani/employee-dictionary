import React, { useState, useEffect } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import google from "../../Assest/google.jpg";
import { sendEmailVerification, updateProfile } from "firebase/auth";
import { db } from "../../Firebase/Firebase";
import { collection, addDoc } from "firebase/firestore";
import { auth } from "../../Firebase/Firebase";
import { useDispatch } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import toast from "react-hot-toast";
import "./AuthPage.css";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";

function AuthPage() {
  const { userState } = useParams();
  const [dataInput, setDataInput] = useState({
    email: "",
    password: "",
    firstName: "",
    lastName: "",
  });
  const [isValid, setIsValid] = useState({
    email: false,
    password: false,
    lastName: false,
    firstName: false,
  });
  const [emailError, setEmailError] = useState(false);
  useEffect(() => {
    if (userState === "SignUp") {
      setDataInput({ email: "", password: "", firstName: "", lastName: "" });
      setIsValid({
        email: false,
        password: false,
        lastName: false,
        firstName: false,
      });
    } else {
      setDataInput({ email: "", password: "" });
      setIsValid({ email: false, password: false });
    }
  }, [userState]);
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState(false);
  const [customeEmailError, setCustomeEmailError] = useState("");
  const [customePasswordError, setCustomePasswordError] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const inputChangeHandler = (e) => {
    const { name, value } = e.target;
    setDataInput((pre) => ({ ...pre, [name]: value }));
  };

  const inputBlurHanlder = (e) => {
    const { name, value } = e.target;
    if (value.trim() === "") {
      setIsValid((pre) => ({ ...pre, [name]: true }));
    } else {
      setIsValid((pre) => ({ ...pre, [name]: false }));
    }
    if (name === "email") {
      var pattern = new RegExp(
        /^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i
      );

      if (!pattern.test(value)) {
        setEmailError(true);
      } else {
        setEmailError(false);
      }
    }
  };
  const validation = () => {
    for (const key in dataInput) {
      if (dataInput[key].trim() === "") {
        setIsValid((pre) => ({ ...pre, [key]: true }));
      } else {
        setIsValid((pre) => ({ ...pre, [key]: false }));
      }
    }
  };
  const provider = new GoogleAuthProvider();
  const signWithGoogle = async () => {
    const result = await signInWithPopup(auth, provider);
    dispatch({
      type: "SIGNUP",
      payload: result._tokenResponse.localId,
    });
    document.cookie = result._tokenResponse.localId;
    dispatch({
      type: "GET_USER",
      payload: result.user.displayName,
    });
    setTimeout(() => {
      navigate("/Employee-list");
    }, 1000);
  };

  const AuthSubmitHandler = async (e) => {
    e.preventDefault();
    validation();

    for (const key in dataInput) {
      if (dataInput[key].trim() === "") {
        setIsValid((pre) => ({ ...pre, [key]: true }));
        return;
      }
    }
    if (userState === "SignUp") {
      try {
        setLoading(true);
        const userCollectionRef = collection(db, "usersList");
        await addDoc(userCollectionRef, dataInput);
        await createUserWithEmailAndPassword(
          auth,
          dataInput.email,
          dataInput.password
        );

        toast.success("Account Created Succesfully");

        setContent(true);
        await updateProfile(auth.currentUser, {
          displayName: dataInput.firstName + " " + dataInput.lastName,
        });
        console.log(auth.currentUser);
        await sendEmailVerification(auth.currentUser).then(() => {});
        setLoading(false);

        setContent(false);

        setTimeout(() => {
          navigate("/Authentication/login");
        }, 1000);
      } catch (error) {
        if (error.message === "Firebase: Error (auth/email-already-in-use).") {
          setCustomeEmailError("Eamil already exist");
        }
        if (
          error.message ===
          "Firebase: Password should be at least 6 characters (auth/weak-password)."
        ) {
          setCustomePasswordError(
            "Weak password (Password should be at least 6 characters)"
          );
        } else {
          //
          setCustomePasswordError("");
          setCustomeEmailError("");
          toast.error(error.message);
        }
        setLoading(false);
      }
    }
    if (userState === "login") {
      try {
        setLoading(true);
        const user = await signInWithEmailAndPassword(
          auth,
          dataInput.email,
          dataInput.password
        );
        console.log(user.user.displayName);

        if (!user.user.emailVerified) {
          toast.error("verify your email");
          return;
        }
        dispatch({
          type: "SIGNUP",
          payload: user._tokenResponse.localId,
        });
        dispatch({
          type: "GET_USER",
          payload: user.user.displayName,
        });
        document.cookie = user._tokenResponse.localId;
        setLoading(false);
        setTimeout(() => {
          navigate("/Employee-list");
        }, 1000);
      } catch (error) {
        if (error.message === "Firebase: Error (auth/wrong-password).") {
          setCustomePasswordError("Wrong Password");
        } else {
          //
          toast.error(error.message);
          setCustomePasswordError("");
        }
        setLoading(false);
      }
    }
  };

  return (
    <>
      <div className="form_container">
        <Toaster position="top-center" reverseOrder={false} />

        {content === false ? (
          <form onSubmit={AuthSubmitHandler} className="auth_form">
            <h2>{userState === "SignUp" ? "Create Account" : "Login"}</h2>
            {userState === "SignUp" && (
              <>
                <input
                  type="text"
                  placeholder="First Name"
                  name="firstName"
                  onChange={inputChangeHandler}
                  onBlur={inputBlurHanlder}
                  value={dataInput.firstName || ""}
                />
                {isValid.firstName && (
                  <div className="auth_error">Please enter First Name</div>
                )}
                <input
                  type="text"
                  name="lastName"
                  placeholder="Last Name"
                  onChange={inputChangeHandler}
                  onBlur={inputBlurHanlder}
                  value={dataInput.lastName || ""}
                />
                {isValid.lastName && (
                  <div className="auth_error">Please enter Last Name</div>
                )}
              </>
            )}
            <input
              type="email"
              placeholder="Email"
              name="email"
              onChange={inputChangeHandler}
              onBlur={inputBlurHanlder}
              value={dataInput.email}
            />
            {customeEmailError !== "" ? (
              <div className="auth_error">{customeEmailError}</div>
            ) : isValid.email ? (
              <div className="auth_error">Please enter Email</div>
            ) : (
              emailError && (
                <div className="auth_error">
                  Enter an email address in the correct format, like
                  name@example.com
                </div>
              )
            )}
            <input
              type="password"
              placeholder="Password"
              name="password"
              onChange={inputChangeHandler}
              onBlur={inputBlurHanlder}
              value={dataInput.password}
            />
            {customePasswordError !== "" ? (
              <div className="auth_error">{customePasswordError}</div>
            ) : (
              isValid.password && (
                <div className="auth_error">Please enter Password</div>
              )
            )}
            <button type="submit" className="auth_button">
              {loading ? (
                "Loading..."
              ) : (
                <>
                  {userState === "SignUp" && "Sign up"}
                  {userState === "login" && "Log In"}{" "}
                </>
              )}
            </button>
            <button
              onClick={signWithGoogle}
              className="auth_button_google"
              type="Button"
            >
              Sigin with google{" "}
              <img src={google} alt="" className="google_icon" />{" "}
            </button>
            {userState === "login" && (
              <p>
                Don't have Account{" "}
                {<Link to="/Authentication/SignUp"> Sign up</Link>}{" "}
              </p>
            )}
            {userState === "SignUp" && (
              <p>
                Already have Account{" "}
                {<Link to="/Authentication/login"> Log in</Link>}{" "}
              </p>
            )}
          </form>
        ) : (
          <h1 className="note">Verify your Email!</h1>
        )}
      </div>
    </>
  );
}

export default AuthPage;
