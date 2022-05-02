import React,{useState} from 'react'
import {createUserWithEmailAndPassword , signInWithEmailAndPassword} from 'firebase/auth'
import {auth} from '../../Firebase/Firebase'
import { useDispatch } from "react-redux";
import {useParams,useNavigate} from 'react-router-dom'

function AuthPage() {
    const [dataInput , setDataInput] = useState({email: "", passWord :""})
    const [userData , setUserData] = useState(null)
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
            const user =await createUserWithEmailAndPassword(auth,dataInput.email , dataInput.passWord).then((userCredential) => {
                // Signed in 
                setUserData(userCredential)
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
            const user =await signInWithEmailAndPassword(auth,dataInput.email , dataInput.passWord).then((userCredential) => {
                // Signed in 
                setUserData(userCredential)
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
    <div>
        <form onSubmit={AuthSubmitHandler}>
            <input type='email' placeholder='Email' name='email' onChange={inputChangeHandler} value={dataInput.email} /> 
            <input type='password' placeholder='Password' name='passWord' onChange={inputChangeHandler} value={dataInput.passWord} />
            <button type='submit'>{'Regsiter'}</button>
        </form>
    </div>
    </>
  )
}

export default AuthPage