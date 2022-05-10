import React from "react";
import Overlay from "../Overlay/Overlay";
import "./ConfirmModal.css";
const ConfirmModal = ({ setConfirmWindow, setDeleteConfirm }) => {
  const confirm = () => {
    setDeleteConfirm(true);
    setConfirmWindow(false);
  };
  return (
    <>
      <Overlay />
      <div className="confirm_modal">
        <p className="modal_message">Are you sure you waat to delete </p>
        <div className="modal_button_container">
          <button
            className="cancel"
            onClick={() => {
              setConfirmWindow(false);
            }}
          >
            Cancel
          </button>
          <button className="ok" onClick={confirm}>
            Ok
          </button>
        </div>
      </div>
    </>
  );
};

export default ConfirmModal;
