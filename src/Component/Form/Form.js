import React, { useState, useEffect } from "react";
import "./Form.css";
import { db, storage } from "../../Firebase/Firebase";
import toast from "react-hot-toast";
import { Toaster } from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import { collection, addDoc, updateDoc, getDoc, doc } from "firebase/firestore";
import UplaodModal from "../UploadModal/UplaodModal";
import NoConnection from "../NoConection/NoConnection";
import { useSelector, useDispatch } from "react-redux";
import { deleteObject } from "firebase/storage";
import { ref } from "firebase/storage";
// local storage

const Form = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [state] = useState({
    firstName: "",
    fatherName: "",
    post: "",
    tempSuite: "",
    tempCity: "",
    tempState: "",
    tempPinCode: "",
    tempPhoneNumber: "",
    permanentSuite: "",
    permanentCity: "",
    permanentState: "",
    permanentPinCode: "",
    permanentPhoneNumber: "",
    nativeSuite: "",
    nativeCity: "",
    nativeState: "",
    nativePinCode: "",
    nativePhoneNumber: "",
    adharCard: "",
    panCard: "",
    photo: "",
  });
  const [loading, setloading] = useState(false);
  const [connection, setConnection] = useState(true);
  const dispatch = useDispatch();
  useEffect(() => {
    if (id) {
      const getData = async () => {
        setloading(true);
        const userDoc = doc(db, gState.userState, id);
        const docm = await getDoc(userDoc);
        setFormValue({ ...docm.data() });
        setloading(false);
      };
      getData();
    }
    if (!id) {
      setFormValue({ ...state });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state, id]);

  const [formValue, setFormValue] = useState(state);
  //validation
  const [isValid, setIsValid] = useState({
    firstName: false,
    fatherName: false,
    post: false,
    tempSuite: false,
    tempCity: false,
    tempState: false,
    tempPinCode: false,
    tempPhoneNumber: false,
    permanentSuite: false,
    permanentCity: false,
    permanentState: false,
    permanentPinCode: false,
    permanentPhoneNumber: false,
    nativeSuite: false,
    nativeCity: false,
    nativeState: false,
    nativePinCode: false,
    nativePhoneNumber: false,
    adharCard: false,
    panCard: false,
    photo: false,
  });
  const [repeatNumber, setRepeatNumber] = useState({
    tempPhoneNumber: false,
    permanentPhoneNumber: false,
    nativePhoneNumber: false,
  });
  const onBlurHandler = (e) => {
    const { name, value } = e.target;
    if (value.trim() === "") {
      setIsValid({ ...isValid, [name]: true });
    } else {
      setIsValid({ ...isValid, [name]: false });
    }
    if (name === "tempPhoneNumber") {
      if (value.length !== 10) {
        setIsValid({ ...isValid, [name]: true });
      }
    }
    if (name === "permanentPhoneNumber") {
      if (value.length !== 10) {
        setIsValid({ ...isValid, [name]: true });
      }
    }
    if (name === "nativePhoneNumber") {
      if (value.length !== 10) {
        setIsValid({ ...isValid, [name]: true });
      }
    }
  };

  //

  //validation
  const validation = () => {
    for (const key in isValid) {
      if (formValue[key].trim() === "") {
        setIsValid((pre) => ({ ...pre, [key]: true }));
      } else {
        setIsValid((pre) => ({ ...pre, [key]: false }));
      }
    }
  };
  const gState = useSelector((state) => state);
  const preNumberArray = [].concat(
    ...gState.gobalData.map((obj) => [
      obj.tempPhoneNumber,
      obj.permanentPhoneNumber,
      obj.nativePhoneNumber,
    ])
  );
  const inputChangeHandler = (e) => {
    const { name, value } = e.target;
    setFormValue((pre) => ({ ...pre, [name]: value }));
    if (value.trim() === "") {
    } else {
      setIsValid({ ...isValid, [name]: false });
    }
    if (
      name === "tempPhoneNumber" ||
      "permanentPhoneNumber" ||
      "nativePhoneNumber"
    ) {
      if (value.length === 10) {
        if (preNumberArray.includes(value)) {
          setRepeatNumber((pre) => ({ ...pre, [name]: true }));
          setIsValid({ ...isValid, [name]: true });
        } else {
          setRepeatNumber((pre) => ({ ...pre, [name]: false }));
          setIsValid({ ...isValid, [name]: false });
        }
      }
    }
  };

  const update = async (e) => {
    const userDoc = doc(db, gState.userState, id);
    if (navigator.onLine) {
      setConnection(navigator.onLine);
      try {
        setloading(true);
        await updateDoc(userDoc, formValue);
        const updatedData = gState.gobalData.map((x) =>
          x.id === id ? { ...formValue, id: id } : x
        );
        dispatch({ type: "UPDATE", payload: updatedData });
        setloading(false);
        toast.success("updated Succesfully");
        setTimeout(() => {
          navigate("/Employee-list");
        }, 2000);
      } catch (error) {
        toast.error(error);
      }
    } else {
      setConnection(navigator.onLine);
    }
  };

  const upload = async () => {
    try {
      setloading(true);
      const doc = await addDoc(userCollectionRef, formValue);
      dispatch({
        type: "ADD",
        payload: [...gState.gobalData, { ...formValue, id: doc.id }],
      });
      toast.success("Uploaded Sucessfully!");
      setTimeout(() => {
        navigate("/Employee-list");
      }, 2000);
      setloading(false);
    } catch (error) {
      toast.error(error);
    }
  };

  //submit
  const userCollectionRef = collection(db, gState.userState);
  const formSubmitHandler = (e) => {
    e.preventDefault();
    validation();
    ////

    ///
    setConnection(navigator.onLine);
    if (Object.values(repeatNumber).includes(true)) {
      return;
    }
    for (const key in isValid) {
      if (formValue[key].trim() === "") {
        return;
      }
    }
    if (id) {
      update();
    } else {
      upload();
    }
  };

  //view modal
  const [viewModal, setviewModal] = useState(false);
  const [modalDetail, setModalDetail] = useState("");
  // onclick
  const photoModalHandler = () => {
    setviewModal(true);
    setModalDetail("photo");
  };
  const adharModalHandler = () => {
    setviewModal(true);
    setModalDetail("adharCard");
  };
  const panModalHandler = () => {
    setviewModal(true);
    setModalDetail("panCard");
  };
  //spiner

  const spinner = <div className="spinner"></div>;

  return (
    <>
      {!connection && <NoConnection />}
      {loading && spinner}
      <form onSubmit={formSubmitHandler} className="Form">
        <h3>Personal Info</h3>

        <div className="name-Conatiner">
          <div className="personal">
            <div className="input">
              <input
                className={isValid.firstName ? "Name invalid" : "Name"}
                placeholder="Name"
                onChange={inputChangeHandler}
                onBlur={onBlurHandler}
                value={formValue.firstName}
                name="firstName"
              />
              {isValid.firstName && <p>Enter your Name</p>}
            </div>
            <div>
              <input
                className={isValid.fatherName ? "invalid" : ""}
                placeholder="Father Name"
                onChange={inputChangeHandler}
                onBlur={onBlurHandler}
                value={formValue.fatherName}
                name="fatherName"
              />
              {isValid.fatherName && <p>Enter your father's name</p>}
            </div>
          </div>
          <div>
            <input
              className={isValid.post ? "post invalid" : "post"}
              placeholder="Employee Post"
              onBlur={onBlurHandler}
              onChange={inputChangeHandler}
              value={formValue.post}
              name="post"
            />
            {isValid.post && <p>Enter your post</p>}
          </div>
        </div>
        <h3>Contact</h3>
        <div className="contact">
          <div>
            <input
              className={isValid.tempPhoneNumber ? " invalid" : ""}
              placeholder="Personal Number"
              onBlur={onBlurHandler}
              onChange={inputChangeHandler}
              value={formValue.tempPhoneNumber}
              name="tempPhoneNumber"
              type="number"
            />
            {repeatNumber.tempPhoneNumber === true ? (
              <p>The number is exists</p>
            ) : (
              isValid.tempPhoneNumber && <p>Entered number must be 10 digit</p>
            )}
          </div>
          <div>
            <input
              className={isValid.permanentPhoneNumber ? " invalid" : ""}
              placeholder="Home Number"
              onBlur={onBlurHandler}
              onChange={inputChangeHandler}
              name="permanentPhoneNumber"
              type="number"
              value={formValue.permanentPhoneNumber}
            />
            {repeatNumber.permanentPhoneNumber === true ? (
              <p>The number is exists</p>
            ) : (
              isValid.permanentPhoneNumber && (
                <p>Entered number must be 10 digit</p>
              )
            )}
          </div>
          <div>
            <input
              className={isValid.nativePhoneNumber ? " invalid" : ""}
              placeholder="Temporary Number"
              onBlur={onBlurHandler}
              onChange={inputChangeHandler}
              value={formValue.nativePhoneNumber}
              type="number"
              name="nativePhoneNumber"
            />
            {repeatNumber.nativePhoneNumber === true ? (
              <p>The number is exists</p>
            ) : (
              isValid.nativePhoneNumber && (
                <p>Entered number must be 10 digit</p>
              )
            )}
          </div>
        </div>
        <h3>Temporary Address</h3>
        <div className="address">
          <div>
            <input
              className={isValid.tempSuite ? "suite invalid" : "suite"}
              placeholder="Apartment,suite.etc."
              onBlur={onBlurHandler}
              onChange={inputChangeHandler}
              value={formValue.tempSuite}
              name="tempSuite"
            />
            {isValid.tempSuite && (
              <p>Enter your Address's Apartment,suite.etc.</p>
            )}
          </div>
          <div className="address_content">
            <div>
              <input
                className={isValid.tempCity ? " invalid" : ""}
                placeholder="City"
                onBlur={onBlurHandler}
                onChange={inputChangeHandler}
                value={formValue.tempCity}
                name="tempCity"
              />
              {isValid.tempCity && <p>Enter City</p>}
            </div>
            <div>
              <input
                className={isValid.tempState ? " invalid" : ""}
                placeholder="State/Province"
                onBlur={onBlurHandler}
                onChange={inputChangeHandler}
                value={formValue.tempState}
                name="tempState"
              />
              {isValid.tempState && <p>Enter State</p>}
            </div>
            <div>
              {" "}
              <input
                className={isValid.tempPinCode ? " invalid" : ""}
                placeholder="Pin Code"
                onBlur={onBlurHandler}
                onChange={inputChangeHandler}
                value={formValue.tempPinCode}
                name="tempPinCode"
                type="number"
              />
              {isValid.tempPinCode && <p>Enter PinCode</p>}
            </div>
          </div>
          <h3>Permanent Address</h3>

          <div>
            <input
              className={isValid.permanentSuite ? "suite invalid" : "suite"}
              placeholder="Apartment,suite.etc."
              onBlur={onBlurHandler}
              onChange={inputChangeHandler}
              value={formValue.permanentSuite}
              name="permanentSuite"
            />
            {isValid.permanentSuite && (
              <p>Enter your Address's Apartment,suite.etc.</p>
            )}
          </div>
          <div className="address_content">
            <div>
              <input
                className={isValid.permanentCity ? " invalid" : ""}
                placeholder="City"
                onBlur={onBlurHandler}
                onChange={inputChangeHandler}
                value={formValue.permanentCity}
                name="permanentCity"
              />
              {isValid.permanentCity && <p>Enter City</p>}
            </div>
            <div>
              <input
                className={isValid.permanentState ? " invalid" : ""}
                placeholder="State/Province"
                onBlur={onBlurHandler}
                onChange={inputChangeHandler}
                value={formValue.permanentState}
                name="permanentState"
              />
              {isValid.permanentState && <p>Enter State</p>}
            </div>
            <div>
              <input
                className={isValid.permanentPinCode ? " invalid" : ""}
                placeholder="Pin Code"
                onBlur={onBlurHandler}
                onChange={inputChangeHandler}
                value={formValue.permanentPinCode}
                name="permanentPinCode"
                type="number"
              />
              {isValid.permanentPinCode && <p>Enter PinCode</p>}
            </div>
          </div>
          <h3>Native Address</h3>
          <div>
            <input
              className={isValid.nativeSuite ? "suite invalid" : "suite"}
              placeholder="Apartment,suite.etc."
              onBlur={onBlurHandler}
              onChange={inputChangeHandler}
              value={formValue.nativeSuite}
              name="nativeSuite"
            />
            {isValid.nativeSuite && (
              <p>Enter your Address's Apartment,suite.etc.</p>
            )}
          </div>
          <div className="address_content">
            <div>
              <input
                className={isValid.nativeCity ? " invalid" : ""}
                placeholder="City"
                onBlur={onBlurHandler}
                onChange={inputChangeHandler}
                value={formValue.nativeCity}
                name="nativeCity"
              />
              {isValid.nativeCity && <p>Enter City</p>}
            </div>
            <div>
              <input
                className={isValid.nativeState ? " invalid" : ""}
                placeholder="State/Province"
                onBlur={onBlurHandler}
                onChange={inputChangeHandler}
                value={formValue.nativeState}
                name="nativeState"
              />
              {isValid.nativeState && <p>Enter State</p>}
            </div>
            <div>
              <input
                className={isValid.nativePinCode ? " invalid" : ""}
                placeholder="Pin Code"
                onBlur={onBlurHandler}
                onChange={inputChangeHandler}
                value={formValue.nativePinCode}
                name="nativePinCode"
                type="number"
              />
              {isValid.nativePinCode && <p>Enter PinCode</p>}
            </div>
          </div>
        </div>
        <h3>Document</h3>
        <div className="upload_button_container">
          <div>
            <button
              type="button"
              className="button-16"
              onClick={photoModalHandler}
            >
              Upload Photo
            </button>
            {isValid.photo && formValue.photo === "" ? (
              <p>Upload your Photo</p>
            ) : (
              <></>
            )}
          </div>
          <div>
            <button
              type="button"
              className="button-16"
              onClick={adharModalHandler}
            >
              Upload Adhar Card{" "}
            </button>
            {isValid.adharCard && formValue.adharCard === "" ? (
              <p>Upload your adharCard</p>
            ) : (
              <></>
            )}
          </div>
          <div>
            <button
              type="button"
              className="button-16"
              onClick={panModalHandler}
            >
              Upload Pan Card
            </button>
            {isValid.panCard && formValue.panCard === "" ? (
              <p>Upload your PanCard</p>
            ) : (
              <></>
            )}
          </div>
        </div>
        {viewModal && (
          <UplaodModal
            setviewModal={setviewModal}
            modalDetail={modalDetail}
            setFormValue={setFormValue}
            formValue={formValue}
          />
        )}
        {
          <button type="submit" disabled={loading}>
            {loading ? "Loading" : <>{id ? "Update" : "Submit"}</>}
          </button>
        }
      </form>
      <Toaster position="top-center" />
    </>
  );
};

export default Form;
