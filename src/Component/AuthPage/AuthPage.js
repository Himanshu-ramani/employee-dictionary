import React,{useState} from 'react'
import {createUserWithEmailAndPassword} from 'firebase/auth'
import {auth} from '../../Firebase/Firebase'
function AuthPage() {
    const [dataInput , setDataInput] = useState({email: "", passWord :""})
    const [userData , setUserData] = useState(null)
    const inputChangeHandler =(e)=>{
        const {name , value} = e.target
        setDataInput(pre =>({...pre , [name]:value}))
    }
    const AuthSubmitHandler =(e) =>{
        e.preventDefault()
        try {
            const user = createUserWithEmailAndPassword(auth,dataInput.email , dataInput.passWord).then((userCredential) => {
                // Signed in 
                setUserData(userCredential)
                console.log(userCredential);
              })
         
        } catch (error) {
            
            console.log(error);
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