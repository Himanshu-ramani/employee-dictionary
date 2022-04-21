import './App.css';
import Header from './Component/Header/Header';
import Home from './Pages/Home'
import { Route, Routes} from 'react-router-dom';
import TablePage from './Pages/TablePage';
import AddForm from './Pages/AddForm'
import View from './Component/View/View';
import { useDispatch } from "react-redux";
import React,{useEffect,useState} from 'react';
import { collection, getDocs} from "firebase/firestore";
import {db} from './Firebase/Firebase'
export const DataLoading = React.createContext(false);
function App() {
  const userCollectionRef = collection(db, "employee");
  const dispatch =  useDispatch()
  const [loading, setLoading] = useState(false)
useEffect(() => {
  async function fetchData (){
    setLoading(true)
    const data = await getDocs(userCollectionRef);
    dispatch({type :"API_CALL", payload:data.docs.map((doc) => ({ ...doc.data(),id:doc.id})
    )})
    setLoading(false)
  }
  fetchData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
}, [])
  return (
    <>
      <Header />
        <Routes >
          <Route path='/' element={<Home />} />
          <Route path='/Add-employe' element={<AddForm />} />
          <Route path='/update/:id' element={<AddForm />} />
          <Route path='/Employee-list' element={<DataLoading.Provider value={loading}><TablePage /></DataLoading.Provider>} />
          <Route path='/View/:id' element={<View />} />
        </Routes>
        </>
 
  );
}

export default App;
