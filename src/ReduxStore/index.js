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

  const store = createStore(combineReducers({gobalData,searchState}))

export default store