import { createStore,combineReducers} from "redux";

const gobalData =(state= [],action) =>{
  if (action.type === 'API_CALL') {
    return(state = action.payload)
  }
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
  
  const userState = (state =JSON.parse(window.localStorage.getItem('user')) ,action)=>{
    if (action.type === 'SIGNUP') {
      return( state = action.payload)
  }
  if (action.type === 'LOGIN') {
    return( state = action.payload)
}
if (action.type === 'LOGOUT') {
  return( state = action.payload)
}
  
  return state
  }

  const store = createStore(combineReducers({gobalData,searchState,userState}))

export default store