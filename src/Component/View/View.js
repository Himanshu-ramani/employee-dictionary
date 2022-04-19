import React,{useEffect,useState} from 'react'
import {useParams} from 'react-router-dom'
import { db } from '../../Firebase/Firebase';
import './View.css'
import {getDoc,doc, } from 'firebase/firestore'
import ModalWindow from '../ModalWindow/ModalWindow';
import NoConnection from '../NoConection/NoConnection';
function View() {
const {id} = useParams()
const [objectData, setObjectData] = useState({})
const [loading, setLoading] = useState(false)
const [connection, setConnection] = useState(true)

const getData =()=>{
  setLoading(true)
  const localStorageData = JSON.parse(localStorage.getItem('firebaseEmployee')) || []
  const [data]= localStorageData.filter(obj => {
    return obj.id == id
  })
  setObjectData(data)
  setLoading(false)
}
// const getData = async()=>{
//   if (navigator.onLine) {
//     try {
//       setLoading(true)
//       const userDoc = doc(db,'employee', id)
//       const docm = await getDoc(userDoc)
//       setObjectData(docm.data())
//       setLoading(false)
//     } catch (error) {
//       console.log(error);
//     }
//   }else{
//     setConnection(navigator.onLine)
//   }
// }
useEffect(() => {
getData()
     // eslint-disable-next-line react-hooks/exhaustive-deps
}, [])
const spinner = <div className="spinner"></div>

//img modal
const [imageHanlder, setImageHanlder] = useState(null)
const viewAdharHandler =()=>{
  setImageHanlder(objectData.adharCard)
}
const viewPanHandler =()=>{
  setImageHanlder(objectData.panCard)
  
}
  return (
    <>
    {!connection && <NoConnection />}
    {loading && spinner}
   {connection && <section className='view_continer'>
    <div className='Address_Conatiner'>
      <div><img src={objectData.photo} alt={'img'+objectData.firstName} className='photo_view' /></div>
      <div className='Name_Container'>
        <h1 className='view_name'>{objectData.firstName} {objectData.fatherName}</h1>
        <p className='view_post'>POST: {objectData.post}</p>
      </div>
      <div>
      <h4>Contact Number</h4>
        <p>Personal Number : {objectData.tempPhoneNumber}</p>
        <p>Home Number: {objectData.permanentPhoneNumber}</p>
        <p>Native Number: {objectData.nativePhoneNumber}</p>
      </div>
      </div>
      <div className='Address_Conatiner'>
<div>
  <h4>Temporary Address</h4>
  <p>Suite/Apartment : {objectData.tempSuite}</p>
  <p>City : {objectData.tempCity}</p>
  <p>State : {objectData.tempState}</p>
  <p>Pin Code : {objectData.tempPinCode}</p>
</div>
<div>
  <h4>Permenet Address</h4>
  <p>Suite/Apartment : {objectData.permanentSuite}</p>
  <p>City : {objectData.permanentCity}</p>
  <p>State : {objectData.permanentState}</p>
  <p>Pin Code : {objectData.permanentPinCode}</p>
</div>
<div>
  <h4>Native Address</h4>
  <p>Suite/Apartment : {objectData.nativeSuite}</p>
  <p>City : {objectData.nativeCity}</p>
  <p>State : {objectData.nativeState}</p>
  <p>Pin Code : {objectData.nativePinCode}</p>
</div>
</div>
<div> <h1>Document</h1>
{imageHanlder&& <ModalWindow img={imageHanlder} setImageHanlder={setImageHanlder} />}
<button onClick={viewAdharHandler}>Adhar View</button>
<button onClick={viewPanHandler}>Pan View</button>

</div>
    </section>}
    </>
  )
}

export default View