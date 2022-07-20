import React, { useState, useEffect } from "react";
import "./UplaodModal.css";
import Webcam from "react-webcam";
import profile from "../../Assest/profile.png";
import idProfile from "../../Assest/id profile.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCameraAlt } from "@fortawesome/free-solid-svg-icons";
import { faFileImage } from "@fortawesome/free-solid-svg-icons";
import { storage } from "../../Firebase/Firebase";
import { getDownloadURL, ref, uploadString } from "firebase/storage";
import toast from "react-hot-toast";

const videoConstraints = {
  width: 200,
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
  const [loading, setLoading] = useState(false);
  const webcamRef = React.useRef(null);
  const num = 8;
  const randomNameGenerator = (num) => {
    let res = "";
    for (let i = 0; i < num; i++) {
      const random = Math.floor(Math.random() * 27);
      res += String.fromCharCode(97 + random);
    }
    return res;
  };
  // console.log(randomNameGenerator(num));
  const capture = async () => {
    const imageSrc = webcamRef.current.getScreenshot();
    setLoading(true);
    // store image in firebase storage
    const imageRef = ref(storage, `${randomNameGenerator(num)}`);
    await uploadString(imageRef, imageSrc, "data_url").then((snapshot) => {});
    await getDownloadURL(imageRef)
      .then((url) => {
        setFormValue((pre) => ({ ...pre, [modalDetail]: url }));
        setImage(url);
        toast.success("image uploaded Succesfully");
      })
      .catch((error) => {
        toast.error(error.message);
      });
    setLoading(false);
    // setImage(imageSrc);
  };
  const [viewInput, setviewInput] = useState(false);
  const [profileImg, setProfileImg] = useState(null);
  const [take, setTake] = useState(false);
  const [hideOption, setHideOption] = useState(false);
  const [heading, setHeading] = useState("");
  useEffect(() => {
    if (modalDetail === "photo") {
      setHeading("Your Photo");
      setProfileImg(profile);
    }
    if (modalDetail === "panCard") {
      setHeading("Your Pan Card");
      setProfileImg(idProfile);
    }
    if (modalDetail === "adharCard") {
      setHeading("Your Adhar Card");
      setProfileImg(idProfile);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [modalDetail]);
  useEffect(() => {
    setFormValue({ ...formValue, [modalDetail]: image });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [image]);

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

    const base64 = await toBase64(files[0]);
    setLoading(true);
    // upload data url to storage
    const imageRef = ref(storage, `${randomNameGenerator(num)}`);
    await uploadString(imageRef, base64, "data_url").then((snapshot) => {});
    await getDownloadURL(imageRef)
      .then((url) => {
        console.log(url);
        setFormValue((pre) => ({ ...pre, [modalDetail]: url }));
        toast.success("image uploaded Succesfully");
      })
      .catch((error) => {
        toast.error(error.message);
      });
    setLoading(false);
  };

  return (
    <>
      <div>
        <div className="Overlay"></div>
        <section className="upload_modal_container">
          {loading ? (
            <div className="spinnerB"></div>
          ) : (
            <>
              <button
                type="button"
                className="modal_Cancel"
                onClick={(e) => {
                  setviewModal(false);
                }}
              >
                X
              </button>
              <h1>Upload {heading}</h1>
              {!hideOption && (
                <div className="Select_container">
                  <div>
                    <FontAwesomeIcon icon={faFileImage} />
                    <p className="heading_icon">Chose from Gallery</p>
                    <button
                      type="button"
                      className="button-16"
                      onClick={viewGallary}
                    >
                      Chose
                    </button>
                  </div>
                  <div>
                    <FontAwesomeIcon icon={faCameraAlt} />
                    <p className="heading_icon">Take from Camera</p>
                    <button
                      type="button"
                      className="button-16"
                      onClick={viewCapute}
                    >
                      Take
                    </button>
                  </div>
                </div>
              )}
              {viewInput && (
                <div>
                  <div className="gallary_conatiner">
                    <img
                      className="modal_profile_img"
                      alt="upload_image"
                      src={
                        formValue[modalDetail] === ""
                          ? profileImg
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

                  <input
                    type="file"
                    id="profile_Add"
                    onChange={photoUploadHandler}
                    accept="image/*"
                  />

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
                    <img src={image} alt="capture img" />
                  )}
                  {image !== "" ? (
                    <div>
                      <button
                        className="button-16"
                        onClick={(e) => {
                          e.preventDefault();
                          setImage("");
                        }}
                      >
                        Retake Image
                      </button>
                    </div>
                  ) : (
                    <div className="cam_button_container">
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          capture();
                        }}
                        className="button-16"
                      >
                        Capture
                      </button>{" "}
                      <button
                        type="button"
                        className="button-16"
                        onClick={back}
                      >
                        back
                      </button>
                    </div>
                  )}
                </div>
              )}{" "}
            </>
          )}
        </section>
      </div>
    </>
  );
};

export default UplaodModal;
