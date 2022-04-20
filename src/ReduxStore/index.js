import { createStore,combineReducers} from "redux";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { db } from "../Firebase/Firebase";

const userCollectionRef = collection(db, "employee");

let dataArray =[]
const dataFunction  = async() =>{
  const data = await getDocs(userCollectionRef);
  dataArray= data.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
}
dataFunction()

     
const localStorageData = JSON.parse(localStorage.getItem('firebaseEmployee')) || []
const gobalData =(state=dataArray ,action) =>{
  if(action.type === 'ADD'){
    return(state = action.payload)
  }
  if(action.type === 'DELETE'){
    return(state = action.payload)
  }
  if(action.type === 'UPDATE'){
    return(state = action.payload)
  }
  return state;
}
  const searchState =(state ='' ,action)=>{
    if (action.type === 'SEARCH') {
        return( state = action.payload)
    }
    
    return state
  }

  const store = createStore(combineReducers({gobalData,searchState}))

export default store