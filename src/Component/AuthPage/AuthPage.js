import React,{useState} from 'react'
import {createUserWithEmailAndPassword , signInWithEmailAndPassword} from 'firebase/auth'
import {auth} from '../../Firebase/Firebase'
import { useDispatch } from "react-redux";
import {useParams,useNavigate} from 'react-router-dom'
import { Link } from 'react-router-dom';
import './AuthPage.css'
function AuthPage() {
    const [dataInput , setDataInput] = useState({email: "", passWord :""})
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {userState} = useParams()
    const inputChangeHandler =(e)=>{
        const {name , value} = e.target
        setDataInput(pre =>({...pre , [name]:value}))
    }
    const AuthSubmitHandler = async(e) =>{
        e.preventDefault()
        if (userState === 'SignUp') {
             try {
            await createUserWithEmailAndPassword(auth,dataInput.email , dataInput.passWord).then((userCredential) => {
                // Signed in 
               
                console.log(userCredential._tokenResponse.localId);
                dispatch({ type: "SIGNUP", payload: userCredential._tokenResponse.localId });
                setTimeout(() => {
                    navigate("/Employee-list");
                  }, 2000);
              })
         
        } catch (error) {
            
            console.log(error);
        }
        }
       if (userState === 'login') {
        try {
            await signInWithEmailAndPassword(auth,dataInput.email , dataInput.passWord).then((userCredential) => {
                // Signed in 
                console.log(userCredential._tokenResponse.localId);
                dispatch({ type: "SIGNUP", payload: userCredential._tokenResponse.localId });
                setTimeout(() => {
                    navigate("/Employee-list");
                  }, 2000);
              })
         
        } catch (error) {
            
            console.log(error);
        }
    }
       }
       
  return (
    <>
    <div className='form_container' >
        <form onSubmit={AuthSubmitHandler} className='auth_form'>
            <h2>{userState ==='SignUp' ? 'Create Account' : 'Login'}</h2>
            <input type='email' placeholder='Email' name='email' onChange={inputChangeHandler} value={dataInput.email} /> 
            <input type='password' placeholder='Password' name='passWord' onChange={inputChangeHandler} value={dataInput.passWord} />
            <button type='submit'>{userState === 'SignUp'&& 'Sign In'} {userState === 'login'&& 'Log In'}</button>
            {userState === 'SignUp' && <p>Dont't have Account  {<Link 
              to="/Authentication/login"
            > Log In</Link>} </p>}
             {userState === 'login' && <p>Already have Account {<Link
              to="/Authentication/SignUp"
            > Sign In</Link>} </p>}
        </form>
    </div>
    </>
  )
}

export default AuthPage