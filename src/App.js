import './App.css';
import Header from './Component/Header/Header';
import Home from './Pages/Home'
import { Route, Routes,Navigate} from 'react-router-dom';
import TablePage from './Pages/TablePage';
import AddForm from './Pages/AddForm'
import View from './Component/View/View';
function App() {
  return (
    <>
      <Header />
        <Routes >
          <Route path='/' element={<Home />} />
          <Route path='/Add-employe' element={<AddForm />} />
          <Route path='/update/:id' element={<AddForm />} />
          <Route path='/Employee-list' element={<TablePage />} />
          <Route path='/View/:id' element={<View />} />
        </Routes>
        </>
 
  );
}

export default App;
