import React, { useEffect, useState,useContext } from "react";
import { db } from "../../Firebase/Firebase";
import { useSelector,useDispatch } from "react-redux";
import { deleteDoc, doc } from "firebase/firestore";
import { DataLoading } from "../../App";
import "./table.css";
import toast from "react-hot-toast";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash,faEye,faPencil } from '@fortawesome/free-solid-svg-icons'
import { Toaster } from "react-hot-toast";
import { Link } from "react-router-dom";
import Pagination from "../Pagination/Pagination";
import NoConnection from "../NoConection/NoConnection";
const Tables = () => {
  const [data , setData] = useState([])
  const [loading, setloading] = useState(false);
  const [result, setResult] = useState('')
  const [connection, setConnection] = useState(true)
  const dispatch = useDispatch()
  const dataLoading =useContext(DataLoading)
 useEffect(() => {
  setloading(dataLoading)
 }, [dataLoading])
 
    //AllData
 
  const state = useSelector((state) => state);
useEffect(() => {
  setData(state.gobalData)
}, [state.gobalData])


const deleteEmployee = async(id)=>{
  if (navigator.onLine) {
  if (window.confirm("Are you sure you want to delete")) {
        setloading(true);
        const employeDoc = doc(db, "employee", id);
        try {
        await deleteDoc(employeDoc);
        const newArray = state.gobalData.filter((ele) => {
          return ele.id !== id;
        });
        setloading(false);
        dispatch({type:'DELETE',payload:newArray})
        toast.success("Successfully delete!");
        } catch (error) {
          console.log(error);
        } 
      }
    }else{
      setConnection(navigator.onLine)
    }

  
}


  useEffect(() => {
    if (state.searchState !== "") {
      const searchData = state.gobalData.filter((employe) => {
        return Object.values(employe)
          .join("")
          .toLowerCase()
          .includes(state.searchState.toLowerCase());
      });
      setData(searchData)
      setResult(searchData.length !== 0 ? "" : "No result Found")
    } else {
      setData(state.gobalData)
      setResult('')
    }
     // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.searchState]);
  //spiner
  const spinner = <div className="spinner"></div>;
  //pagination

  const [currentPage, setCurrentPage] = useState(1);
  const [postPerPage, setPostPerPage] = useState(5);

  // Get Current posts
  const indexOfLastPosts = currentPage * postPerPage;
  const indexOfFirstPost = indexOfLastPosts - postPerPage;
  const currentEmployees = data.slice(indexOfFirstPost, indexOfLastPosts);

  //change Page
  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const perPage = (post) => {
    setPostPerPage(post);
  };
  return (
    <>
    {!connection &&<NoConnection />}
    {result !== '' && result}
     {connection && !!!result&& <table className="table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Father Name</th>
            <th>Post</th>
            <th>Number</th>
            <th>Update /Delete</th>
          </tr>
        </thead>
        <tbody>
          {!loading && currentEmployees.map((employe) => (
            <tr key={employe.id}>
              <td data-label="First Name" className="profile_row">
                <div className="name_conatiner">
                <img className="profile" alt={"photo"+employe.firstName} src={employe.photo} /> &nbsp;{" "}
                <span>{employe.firstName}</span>
                </div>
              </td>
              <td data-label="Father Name">{employe.fatherName}</td>
              <td data-label="Post">{employe.post}</td>
              <td data-label="Phone Number">{employe.tempPhoneNumber}</td>
              <td data-label="Delete/Update" >
                <div className="td_button_container">
                <button className="button-10"
                  onClick={() => {
                    deleteEmployee(employe.id);
                  }}
                >
            <FontAwesomeIcon icon={faTrash} />
                </button>
                <Link to={`/View/${employe.id}`}>
                  <button className="button-10"><FontAwesomeIcon icon={faEye} /></button>
                </Link>
                <Link to={`/update/${employe.id}`}>
                  <button className="button-10"><FontAwesomeIcon icon={faPencil} /></button>
                </Link>
                </div>
              </td>
            </tr>
          ))}
          {state.gobalData.length === 0 ? (
            <></>
          ) : (
            <Pagination
              postPerPage={postPerPage}
              totalPosts={state.gobalData.length}
              paginate={paginate}
              perPage={perPage}
              currentPage={currentPage}
              getCurrentPage={setCurrentPage}
            />
          )}
        </tbody>
      </table>}
      {loading && spinner}
      <Toaster position="top-center" reverseOrder={false} />
    </>
  );
};

export default Tables;
