import { createStore} from "redux";



  const searchState =(state ='' ,action)=>{
    if (action.type === 'SEARCH') {
        return( state = action.payload)
    }
    return state
  }
  const store = createStore(searchState)

export default store