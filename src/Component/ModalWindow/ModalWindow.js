import React from 'react'
import './ModalWindow.css'
const ModalWindow = ({img,setImageHanlder}) => {
    const closeModal =()=>{
        setImageHanlder(null)
    }
  return (
      <>
    <div className='Overlay' ></div>
    <div className='modal_contanier'>
        <img src={img} className='Modal_img' />
        <button className='modal_close' onClick={closeModal}>close</button>
    </div>
    </>
  )
}

export default ModalWindow