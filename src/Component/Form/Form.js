import React, { useState, useEffect } from "react";
import "./Form.css";
import { db } from "../../Firebase/Firebase";
import toast from "react-hot-toast";
import { Toaster } from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import { collection, addDoc, updateDoc, getDoc, doc } from "firebase/firestore";
import UplaodModal from "../UploadModal/UplaodModal";
import NoConnection from "../NoConection/NoConnection";
import { useSelector,useDispatch } from "react-redux";
// local storage

const Form = () => {
  const { id } = useParams();
  const [formSubmit, setFormSubmit] = useState({
    firstName:true,
    fatherName: true,
    post: true,
    tempSuite: true,
    tempCity: true,
    tempState: true,
    tempPinCode: true,
    tempPhoneNumber: true,
    permanentSuite: true,
    permanentCity: true,
    permanentState: true,
    permanentPinCode: true,
    permanentPhoneNumber: true,
    nativeSuite: true,
    nativeCity: true,
    nativeState: true,
    nativePinCode: true,
    nativePhoneNumber: true,
    adharCard: true,
    panCard: true,
    photo: true,
  })
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
  const [connection, setConnection] = useState(true)
  const dispatch = useDispatch()
  useEffect(() => {
    if (id) {
      const getData = async () => {
        setloading(true);
        const localStorageData = JSON.parse(localStorage.getItem('firebaseEmployee')) || []
        const [data]= localStorageData.filter(obj => {
          return obj.id == id
        })
            setFormValue(data);
        // const userDoc = doc(db, "employee", id);
        // const docm = await getDoc(userDoc);
        // setFormValue({ ...docm.data() });
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
  const onBlurHandler = (e) => {
    const { name, value } = e.target;
    if (value.trim() === "") {
      setIsValid({ ...isValid, [name]: true });
      setFormSubmit((pre) => ({ ...pre, [name]: true }));
    } else {
      setIsValid({ ...isValid, [name]: false });
      setFormSubmit((pre) => ({ ...pre, [name]: false }));
    }
  };
    //validation
    const validation = () => {
      for (const key in isValid) {
        if (formValue[key].trim() === "") {
          setFormSubmit((pre) => ({ ...pre, [key]: true }));
          setIsValid((pre) => ({ ...pre, [key]: true }));
        } else {
          setIsValid((pre) => ({ ...pre, [key]: false }));
          setFormSubmit((pre) => ({ ...pre, [key]: false }));
        }
      }
    };

    // uploadData();  
  const inputChangeHandler = (e) => {
    const { name, value } = e.target;
    setFormValue({ ...formValue, [name]: value });
    if (value.trim() === "") {
      setIsValid({ ...isValid, [name]: true });
      setFormSubmit((pre) => ({ ...pre, [name]: true }));
    } else {
      setIsValid({ ...isValid, [name]: false });
      setFormSubmit((pre) => ({ ...pre, [name]: false }));
    }
  };
  const gState = useSelector((state) => state);
  const update =() =>{
    setloading(true)
    const newDataArray = gState.gobalData.map(
      (obj) => [formValue].find((o) => o.id === id) || obj
    );
    localStorage.setItem("firebaseEmployee", JSON.stringify(newDataArray));
    dispatch({ type: "UPDATE", payload: newDataArray });
    setloading(false)
    toast.success("Updated Sucessfully!");
    setTimeout(() => {
      navigate("/Employee-list");
    }, 2000);

  }

  const upload = async() =>{
    console.log(formValue);
    setloading(true)

    localStorage.setItem('firebaseEmployee',JSON.stringify([...gState.gobalData,{...formValue,id:Math.random()}]))

          await addDoc(userCollectionRef, {...formValue,id:Math.random()});

          toast.success("cloud upload!");
    dispatch({type:'ADD',payload:[...gState.gobalData,{...formValue,id:Math.random()}]})
    toast.success("Uploaded Sucessfully!");
    setloading(false)
          // setTimeout(() => {
          //   navigate("/Employee-list");
          // }, 2000);
    console.log("hai");
  }
    
  let navigate = useNavigate();

  // const uploadData = async () => {
  //   if (navigator.onLine) {
  //     setConnection(navigator.onLine)
  //     try {
  //       setloading(true);
  //       await addDoc(userCollectionRef, formValue);
  //       setloading(false);
  //       toast.success("Uploaded Sucessfully!");
  //       setTimeout(() => {
  //         navigate("/Employee-list");
  //       }, 5000);
  //     } catch (err) {
  //       console.log(err);
  //       toast.error(err);
  //     }
  //   }else{
  //     setConnection(navigator.onLine)
  //   }
  
  // };


  //submit
  const userCollectionRef = collection(db, "employee");
  const formSubmitHandler = (event) => {
    event.preventDefault();
    validation();
  setConnection(navigator.onLine)
    let submitValid = true;
  if (Object.values(formSubmit).includes(true)) {
    submitValid = false;
  }
    if (!submitValid) {
      return;
    }
    upload()
  };


  ////////

  // const update = async (e) => {
  //   e.preventDefault();
  //   const userDoc = doc(db, "employee", id);
  //   if (navigator.onLine) {
  //     setConnection(navigator.onLine)
  //     try {
  //       setloading(true)
  //     await updateDoc(userDoc, formValue);
  //       setloading(false)
  //       toast.success("updated Succesfully")
  //       setTimeout(() => {
  //         navigate("/Employee-list");
  //       }, 5000);
  //     } catch (error) {
  //       toast.error(error)
  //     }
  //   }else{
  //     setConnection(navigator.onLine)
  //   }
    
  // };

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
       <form onSubmit={formSubmitHandler} className="Form">
        {loading && spinner}

        <div>
          <Toaster position="top-center" reverseOrder={false} />
        </div>
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
            />
            {isValid.tempPhoneNumber && <p>Entered number must be 10 digit</p>}
          </div>
          <div>
            <input
              className={isValid.permanentPhoneNumber ? " invalid" : ""}
              placeholder="Home Number"
              onBlur={onBlurHandler}
              onChange={inputChangeHandler}
              name="permanentPhoneNumber"
              value={formValue.permanentPhoneNumber}
            />
            {isValid.permanentPhoneNumber && (
              <p>Entered number must be 10 digit</p>
            )}
          </div>
          <div>
            <input
              className={isValid.nativePhoneNumber ? " invalid" : ""}
              placeholder="Temporary Number"
              onBlur={onBlurHandler}
              onChange={inputChangeHandler}
              value={formValue.nativePhoneNumber}
              name="nativePhoneNumber"
            />
            {isValid.nativePhoneNumber && (
              <p>Entered number must be 10 digit</p>
            )}
          </div>
        </div>
        <h3>Temp Address</h3>
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
              />
              {isValid.tempPinCode && <p>Enter PinCode</p>}
            </div>
          </div>
          <h3>Permenet Address</h3>

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
            {isValid.photo && formValue.photo === '' ? <p>Upload your Photo</p> :<></>}
           
          </div>
          <div>
            <button
              type="button"
              className="button-16"
              onClick={adharModalHandler}
            >
              Upload Adhar Card{" "}
            </button>
            {isValid.adharCard && formValue.adharCard === '' ? <p>Upload your adharCard</p> :<></>}
          </div>
          <div>
            <button
              type="button"
              className="button-16"
              onClick={panModalHandler}
            >
              Upload Pan Card
            </button>
            {isValid.panCard &&formValue.panCard === '' ? <p>Upload your PanCard</p> :<></>}
          </div>
          {viewModal && (
            <UplaodModal
              setviewModal={setviewModal}
              modalDetail={modalDetail}
              setFormValue={setFormValue}
              formValue={formValue}
            />
          )}
        </div>

        {!id && (
          <button type="Submit" disabled={false}>
            Submit
          </button>
        )}
        {id && (
          <button type="button" onClick={update}>
            Update
          </button>
        )}
      </form>
    </>
  );
};

export default Form;
