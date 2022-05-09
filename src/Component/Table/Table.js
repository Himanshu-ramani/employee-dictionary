import React, { useEffect, useState, useContext } from "react";
import { db } from "../../Firebase/Firebase";
import { useSelector, useDispatch } from "react-redux";
import { deleteDoc, doc } from "firebase/firestore";
import { DataLoading } from "../../App";
import "./table.css";
import toast from "react-hot-toast";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTrash,
  faEye,
  faPencil,
  faSearch,
  faAdd,
  faClose,
  faArrowDown,
  faArrowUp
} from "@fortawesome/free-solid-svg-icons";
import { Toaster } from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import Pagination from "../Pagination/Pagination";
import NoConnection from "../NoConection/NoConnection";
const Tables = () => {
  const [data, setData] = useState([]);
  const [loading, setloading] = useState(false);
  const [result, setResult] = useState("");
  const [connection, setConnection] = useState(true);
  const [toggleSearch, setToggleSerach] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const dataLoading = useContext(DataLoading);
  useEffect(() => {
    setloading(dataLoading);
  }, [dataLoading]);

  //AllData

  const state = useSelector((state) => state);
  useEffect(() => {
    setData(state.gobalData);
  }, [state.gobalData]);

  const deleteEmployee = async (id) => {
    if (navigator.onLine) {
      if (window.confirm("Are you sure you want to delete")) {
        setloading(true);
        const employeDoc = doc(db, state.userState, id);
        try {
          await deleteDoc(employeDoc);
          const newArray = state.gobalData.filter((ele) => {
            return ele.id !== id;
          });
          setloading(false);
          dispatch({ type: "DELETE", payload: newArray });
          toast.success("Successfully delete!");
        } catch (error) {
          console.log(error);
        }
      }
    } else {
      setConnection(navigator.onLine);
    }
  };

  const searchHandler = (e) => {
    if (e.target.value !== "") {
      const searchData = state.gobalData.filter((employe) => {
        return Object.values(employe)
          .join("")
          .toLowerCase()
          .includes(e.target.value.toLowerCase());
      });
      setData(searchData);
      setResult(searchData.length !== 0 ? "" : "No result Found");
    } else {
      setData(state.gobalData);
      setResult("");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  };
  //spiner
  const spinner = <div className="spinnerB"></div>;
    //sorting
    const [icon, setIcon] = useState(false);
    const [order, setOreder] = useState("ASC");
    const sorting = (col) => {
      setIcon((preState) => !preState);
      if (order === "ASC") {
        const sorted = [...state.gobalData].sort((a, b) =>
          a[col].toLowerCase() > b[col].toLowerCase() ? 1 : -1
        );
        setData(sorted)
        setOreder("DSC");
      }
      if (order === "DSC") {
        const sorted = [...state.gobalData].sort((a, b) =>
          a[col].toLowerCase() < b[col].toLowerCase() ? 1 : -1
        );
        setData(sorted)
        setOreder("ASC");
      }
    };
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
      {!connection && <NoConnection />}
      {result !== "" && result}
      {connection && !!!result && (
        <table className="table">
          <thead>
            <tr colSpan="5" className="table_nav">
              <td colSpan="5">
                <nav className="table_nav">
                  {!toggleSearch ? (
                    <h3>Employee List</h3>
                  ) : (
                    <>
                      <FontAwesomeIcon icon={faSearch} />{" "}
                      <input
                        type="text"
                        onChange={searchHandler}
                      />
                    </>
                  )}
                  <ul>
                    <li
                      onClick={() => {
                        setToggleSerach((pre) => !pre);
                      }}
                    >
                      {" "}
                      {!toggleSearch ? (
                        <FontAwesomeIcon icon={faSearch} className="icon" />
                      ) : (
                        <FontAwesomeIcon icon={faClose} className="icon" />
                      )}
                    </li>
                    <li>
                      {" "}
                      <FontAwesomeIcon
                        icon={faAdd}
                        className="icon"
                        onClick={() => {
                          navigate("/Add-employe");
                        }}
                      />
                    </li>
                  </ul>
                </nav>
              </td>
            </tr>
            <tr className="thead">
              <th onClick={() => sorting("firstName")}>Name  {icon === true ? (
                <FontAwesomeIcon icon={faArrowDown} />
              ) : (
                <FontAwesomeIcon icon={faArrowUp} />
              )}</th>
              <th>Father Name</th>
              <th>Post</th>
              <th>Number</th>
              <th>Update /Delete</th>
            </tr>
          </thead>
          <tbody>
            {!loading &&
              currentEmployees.map((employe) => (
                <tr key={employe.id}>
                  <td data-label="First Name" className="profile_row">
                    <div className="name_conatiner">
                      <span>{employe.firstName}</span>
                    </div>
                  </td>
                  <td data-label="Father Name">{employe.fatherName}</td>
                  <td data-label="Post">{employe.post}</td>
                  <td data-label="Phone Number">{employe.tempPhoneNumber}</td>
                  <td data-label="Delete/Update">
                    <div className="td_button_container">
                      <button
                        className="button-38"
                        onClick={() => {
                          deleteEmployee(employe.id);
                        }}
                      >
                        <FontAwesomeIcon icon={faTrash} />
                      </button>
                      <Link to={`/View/${employe.id}`}>
                        <button className="button-38">
                          <FontAwesomeIcon icon={faEye} />
                        </button>
                      </Link>
                      <Link to={`/update/${employe.id}`}>
                        <button className="button-38">
                          <FontAwesomeIcon icon={faPencil} />
                        </button>
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
        </table>
      )}
      {loading && spinner}
      <Toaster position="top-center" reverseOrder={false} />
    </>
  );
};

export default Tables;
