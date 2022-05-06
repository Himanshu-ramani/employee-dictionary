import React,{useState,useEffect} from "react";
import { auth } from "../Firebase/Firebase";
import { useParams } from "react-router-dom";
import { isSignInWithEmailLink, signInWithEmailLink } from "firebase/auth";
const LoginVerification = () => {
  const params = useParams();
 console.log(params);
 const [email, setEmail] = useState(window.localStorage.getItem("emailForSignIn"))
 console.log(email,window.location);
  useEffect(async() => {
    console.log(isSignInWithEmailLink(auth, window.location.href));
    try {
      if (!email) {
        // User opened the link on a different device. To prevent session fixation
        // attacks, ask the user to provide the associated email again. For example:
        setEmail(window.prompt("Please provide your email for confirmation"));
      }
   const user = await  signInWithEmailLink(auth, email, window.location.href)
 console.log(user);

    } catch (error) {
      console.log(error);
    }
 
  }, [])
 
  return (
    <>
      <div>LoginVerification</div>
     
    </>
  );
};

export default LoginVerification;
