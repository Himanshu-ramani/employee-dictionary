import React, { useEffect, useState } from "react";
import { db } from "../../Firebase/Firebase";
import { useSelector } from "react-redux";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import "./table.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash,faEye,faPencil } from '@fortawesome/free-solid-svg-icons'
import toast from "react-hot-toast";
import { Toaster } from "react-hot-toast";
import { Link } from "react-router-dom";
import Pagination from "../Pagination/Pagination";
import NoConnection from "../NoConection/NoConnection";
const Tables = () => {
  const [employees, setEmployees] = useState([]);
  const userCollectionRef = collection(db, "employee");
  const [loading, setloading] = useState(false);
  const [result, setResult] = useState('')
  const [connection, setConnection] = useState(true)
    //AllData
    const [allData, setallData] = useState([]);
  const state = useSelector((state) => state);
  const getEmployee = async () => {
      if (navigator.onLine) {
        try {
          setloading(true);
        const data = await getDocs(userCollectionRef);
        setEmployees(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
        setallData(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
        setloading(false);
        console.log(data);
      /*mh {_firestore: gc, _userDataWriter: Qh, _snapshot: Ea, metadata: dh, query: ac}metadata: dhfromCache: truehasPendingWrites: false[[Prototype]]: Objectquery: ac {converter: null, _query: ve, type: 'collection', firestore: gc, _path: _t}_firestore: gc {_authCredentials: J, _appCheckCredentials: tt, type: 'firestore', _persistenceKey: '[DEFAULT]', _settings: nc, …}_snapshot: Ea {query: ve, docs: Ia, oldDocs: Ia, docChanges: Array(0), mutatedKeys: kn, …}_userDataWriter: Qh {firestore: gc}docs: (...)empty: (...)size: (...)[[Prototype]]: Object
 */
          if (!data.docs) {
            setResult('Please Check Your Connection Reload the Page')
          }
        } catch (e) {
          console.log(e);
        }
        setConnection(navigator.onLine)
      }else{
        setConnection(navigator.onLine)
      }
  
  };

  // delete user
  const deleteEmployee = async (id) => {
    if (window.confirm("Are you sure you want to delete")) {
      setloading(true);
      const employeDoc = doc(db, "employee", id);
      try {
      await deleteDoc(employeDoc);
      getEmployee();
      setloading(false);
      toast.success("Successfully toasted!");
      } catch (error) {
        console.log(error);
      } 
    }
  };
  

  useEffect(() => {
    getEmployee();
     // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    if (state !== "") {
      const newData = employees.filter((employe) => {
        return Object.values(employe)
          .join("")
          .toLowerCase()
          .includes(state.toLowerCase());
      });
      setEmployees(newData);
      setResult(newData.length !== 0 ? "" : "No result Found")
    } else {
      setEmployees(allData);
      setResult('')
    }
     // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);
  //spiner
  const spinner = <div className="spinner"></div>;
  //pagination

  const [currentPage, setCurrentPage] = useState(1);
  const [postPerPage, setPostPerPage] = useState(5);

  // Get Current posts
  const indexOfLastPosts = currentPage * postPerPage;
  const indexOfFirstPost = indexOfLastPosts - postPerPage;
  const currentEmployees = employees.slice(indexOfFirstPost, indexOfLastPosts);

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
              <td data-label="Phone Number">{employe.nativePhoneNumber}</td>
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
          {allData.length === 0 ? (
            <></>
          ) : (
            <Pagination
              postPerPage={postPerPage}
              totalPosts={allData.length}
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
