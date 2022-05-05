import './App.css';
import Header from './Component/Header/Header';
import Home from './Pages/Home'
import { Route, Routes} from 'react-router-dom';
import TablePage from './Pages/TablePage';
import AddForm from './Pages/AddForm'
import View from './Component/View/View';
import { useDispatch,useSelector } from "react-redux";
import React,{useEffect,useState} from 'react';
import { collection, getDocs} from "firebase/firestore";
import {db} from './Firebase/Firebase'
import LoginPage from './Pages/LoginPage';
import { useNavigate } from "react-router-dom";
import LoginVerification from './Pages/LoginVerification';
export const DataLoading = React.createContext(false);
function App() {
  const dispatch =  useDispatch()
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate();
  const state = useSelector((state) => state);

  const userCollectionRef = collection(db,state.userState ||'emplyee' );
  async function fetchData (){
    setLoading(true)
    const data = await getDocs(userCollectionRef);
    dispatch({type :"API_CALL", payload:data.docs.map((doc) => ({ ...doc.data(),id:doc.id})
    )})
    setLoading(false)
  }
  // useEffect(() => {
  //  if (state.userState === null) {
  //    navigate('/')
  //  }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [])
  
useEffect(() => {
if (state.userState !== null) {
  
  fetchData()
}
    // eslint-disable-next-line react-hooks/exhaustive-deps
}, [state.userState])
  return (
    <>
      <Header />
        <Routes >
          <Route path='/' element={<Home />} /> 
          <Route path='/Authentication/:userState' element={<LoginPage />} />
          <Route path='/logging' element={<LoginVerification />} />
        {state.userState &&<> <Route path='/Add-employe' element={<AddForm />} />
          <Route path='/update/:id' element={<AddForm />} />
          <Route path='/Employee-list' element={<DataLoading.Provider value={loading}><TablePage /></DataLoading.Provider>} />
          <Route path='/View/:id' element={<View />} /> </>  }
        </Routes>
        </>
 
  );
}

export default App;
