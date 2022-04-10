import React, { useState, useEffect } from "react";
import "./UplaodModal.css";
import Webcam from "react-webcam";
import profile from "../../Assest/profile.png";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCameraAlt } from '@fortawesome/free-solid-svg-icons'
import { faFileImage } from '@fortawesome/free-solid-svg-icons'

const videoConstraints = {
  width: 220,
  height: 200,
  facingMode: "user",
};

const UplaodModal = ({
  setviewModal,
  modalDetail,
  setFormValue,
  formValue,
}) => {
  const [image, setImage] = useState("");
  const webcamRef = React.useRef(null);

  const capture = React.useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot();
    setImage(imageSrc);
  });
  const [viewInput, setviewInput] = useState(false);
  const [take, setTake] = useState(false);
  const [hideOption, setHideOption] = useState(false);
  const [heading, setHeading] = useState("");
  useEffect(() => {
    if (modalDetail === "photo") {
      setHeading("Your Photo");
    }
    if (modalDetail === "panCard") {
      setHeading("Your Pan Card");
    }
    if (modalDetail === "adharCard") {
      setHeading("Your Adhar Card");
    }
  }, [modalDetail]);
useEffect(() => {
setFormValue(pre =>({...pre,[modalDetail]:image }))
console.log(image);
}, [image])

  const viewGallary = () => {
    setviewInput(true);
    setHideOption(true);
  };
  const viewCapute = () => {
    setTake(true);
    setHideOption(true);
  };
  const back = () => {
    setviewInput(false);
    setTake(false);

    setHideOption(false);
  };

  // convert photo
  const toBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        resolve(reader.result);
      };
      reader.onerror = (error) => {
        reject(error);
      };
    });
  };
  const photoUploadHandler = async (e) => {
    const { files } = e.target;
    console.log(files[0]);
    const base64 = await toBase64(files[0]);
    // console.log(base64);
    setFormValue(pre =>({...pre ,[modalDetail]:base64}))
  };
 
  return (
    <div>
      <div className="Overlay"></div>{" "}
      <section className="upload_modal_container">
        <h1>Upload {heading}</h1>
        <button
          type="button"
          className="modal_Cancel"
          onClick={(e) => {
            setviewModal(false);
          }}
        >
          X
        </button>
        {!hideOption && (
          <div className="Select_container">
            <div>
            <FontAwesomeIcon icon={faFileImage} />
              <p className="heading_icon">Chose from Gallary</p>
              <button type="button" className="button-16" onClick={viewGallary}>
                Chose
              </button>
            </div>
            <div>
            <FontAwesomeIcon icon={faCameraAlt} />
              <p className="heading_icon">Take from camrea</p>
              <button type="button" className="button-16" onClick={viewCapute}>
                Take
              </button>
            </div>
          </div>
        )}
        {viewInput && (
          <div>
            <div>
              <img
                className="modal_profile_img"
                src={
                  formValue[modalDetail] === ""
                    ? profile
                    : formValue[modalDetail]
                }
              />{" "}
            </div>
            <div>
              {" "}
              <button type="button" className="button-16">
                {" "}
                <label htmlFor="profile_Add">Add</label>
              </button>
            </div>

            <input type="file" id="profile_Add" onChange={photoUploadHandler} accept='image/*' />

            <div>
              <button type="button" className="button-16" onClick={back}>
                Back
              </button>{" "}
            </div>
          </div>
        )}
        {take && (
          <div className="video">
            {" "}
            {image === "" ? (
              <Webcam
                audio={false}
                height={200}
                ref={webcamRef}
                screenshotFormat="image/jpeg"
                width={220}
                videoConstraints={videoConstraints}
              />
            ) : (
              <img src={image} alt='capture img'/>
            )}
            {image !== "" ? (
              <div>
                <button className="button-16"
                  onClick={(e) => {
                    e.preventDefault();
                    setImage("");
                  }}
                 
                >
                  Retake Image
                </button>
              </div>
            ) : (
              <div>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    capture();
                  }}
                  className="button-16"
                >
                  Capture
                </button>
                <div>
                  {" "}
                  <button type="button" className="button-16" onClick={back}>
                    back
                  </button>{" "}
                </div>
              </div>
            )}
          </div>
        )}
      </section>
    </div>
  );
};

export default UplaodModal;
