import React from "react";
import "./ModalWindow.css";
const ModalWindow = ({ img, setImageHanlder }) => {
  const closeModal = () => {
    setImageHanlder(null);
  };
  return (
    <>
      <div className="Overlay"></div>
      <div className="View_modal">
        <button className="close_button_modal" onClick={closeModal}>
          X
        </button>
        <img src={img} alt="document" className="View_image" />
      </div>
    </>
  );
};

export default ModalWindow;
