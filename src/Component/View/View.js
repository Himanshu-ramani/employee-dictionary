import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { db } from "../../Firebase/Firebase";
import "./View.css";
import { useSelector } from "react-redux";
import { getDoc, doc } from "firebase/firestore";
import ModalWindow from "../ModalWindow/ModalWindow";
import NoConnection from "../NoConection/NoConnection";
import toast, { Toaster } from "react-hot-toast";
function View() {
  const { id } = useParams();
  const state = useSelector((state) => state);
  const [objectData, setObjectData] = useState({});
  const [loading, setLoading] = useState(false);
  const [connection, setConnection] = useState(true);
  const [docExists, setDocExists] = useState(true);
  const getData = async () => {
    setLoading(true);
    if (navigator.onLine) {
      try {
        setLoading(true);
        const userDoc = doc(db, state.userState, id);
        const docm = await getDoc(userDoc);
        if (docm.exists()) {
          setObjectData(docm.data());
        } else {
          setDocExists(false);
        }
        setObjectData(docm.data());
        setLoading(false);
      } catch (error) {
        toast.error(error);
      }
    } else {
      setConnection(navigator.onLine);
    }

    setLoading(false);
  };

  useEffect(() => {
    getData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const spinner = <div className="spinner"></div>;

  //img modal
  const [imageHanlder, setImageHanlder] = useState(null);
  const viewAdharHandler = () => {
    setImageHanlder(objectData.adharCard);
  };
  const viewPanHandler = () => {
    setImageHanlder(objectData.panCard);
  };
  return (
    <>
      {!connection && <NoConnection />}
      {loading && spinner}
      <Toaster position="top-center" reverseOrder={false} />
      {connection && docExists && (
        <section className="view_continer">
          <div className="Name_Container">
            <img
              src={objectData.photo}
              alt={"img" + objectData.firstName}
              className="photo_view"
            />

            <div className="name_post">
              <h1>
                {objectData.firstName} {objectData.fatherName}
              </h1>
              <p className="view_post"> {objectData.post}</p>
            </div>
          </div>

          <div>
            <h4>Contact Number</h4>
            <p>Personal Number : {objectData.tempPhoneNumber}</p>
            <p>Home Number: {objectData.permanentPhoneNumber}</p>
            <p>Native Number: {objectData.nativePhoneNumber}</p>
          </div>
          <div className="Address_container">
            <div>
              <h4>Temporary Address</h4>
              <p>Suite/Apartment : {objectData.tempSuite}</p>
              <p>City : {objectData.tempCity}</p>
              <p>State : {objectData.tempState}</p>
              <p>Pin Code : {objectData.tempPinCode}</p>
            </div>
            <div>
              <h4>Permanent Address</h4>
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
          <h4>Document</h4>
          {imageHanlder && (
            <ModalWindow img={imageHanlder} setImageHanlder={setImageHanlder} />
          )}
          <div className="view_button_container">
            <button onClick={viewAdharHandler} className="button-38">
              Adhar View
            </button>
            <button onClick={viewPanHandler} className="button-38">
              Pan View
            </button>
          </div>
        </section>
      )}
      {!docExists && (
        <div className="error_page">
          <p>Page not found</p>
          <h1>404</h1>
        </div>
      )}
    </>
  );
}

export default View;
