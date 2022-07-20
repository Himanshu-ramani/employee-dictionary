import React, { useEffect, useState, useContext, useRef } from "react";
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
  faArrowUp,
} from "@fortawesome/free-solid-svg-icons";
import { Toaster } from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import Pagination from "../Pagination/Pagination";
import NoConnection from "../NoConection/NoConnection";
import ConfirmModal from "../ConfirmModal/ConfirmModal";
import { deleteObject, ref } from "firebase/storage";
import { storage } from "../../Firebase/Firebase";
const Tables = () => {
  const [data, setData] = useState([]);
  const [loading, setloading] = useState(false);
  const [result, setResult] = useState("");
  const [connection, setConnection] = useState(true);
  const [toggleSearch, setToggleSerach] = useState(false);
  const [confirmWindow, setConfirmWindow] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [deleteObjId, setDeleteObjId] = useState(null);
  const [search, setSearch] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const dataLoading = useContext(DataLoading);
  useEffect(() => {
    setloading(dataLoading);
  }, [dataLoading]);

  //AllData
  const serachRef = useRef();
  const state = useSelector((state) => state);
  useEffect(() => {
    setData(state.gobalData);
  }, [state.gobalData]);

  const deleteEmployee = (id) => {
    setDeleteObjId(id);
    setConfirmWindow(true);
  };
  useEffect(async () => {
    if (deleteConfirm) {
      setloading(true);
      const employeDoc = doc(db, state.userState, deleteObjId.id);
      const photoRef = ref(storage, deleteObjId.photo);
      const adharRef = ref(storage, deleteObjId.adharCard);
      const panRef = ref(storage, deleteObjId.panCard);
      try {
        await deleteDoc(employeDoc);
        const newArray = state.gobalData.filter((ele) => {
          return ele.id !== deleteObjId.id;
        });
        // delete the file
        await deleteObject(photoRef);
        await deleteObject(adharRef);
        await deleteObject(panRef);

        setloading(false);
        dispatch({ type: "DELETE", payload: newArray });
        toast.success("Successfully delete!");
        setDeleteObjId(null);
      } catch (error) {
        toast.error(error.message);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deleteConfirm]);

  const searchHandler = (e) => {
    setSearch(e.target.value);
  };
  useEffect(() => {
    if (search !== "") {
      const searchData = state.gobalData.filter((employe) => {
        return Object.values(employe)
          .join("")
          .toLowerCase()
          .includes(search.toLowerCase());
      });
      setData(searchData);
      setResult(searchData.length !== 0 ? "" : "No result Found");
    } else {
      setData(state.gobalData);
      setResult("");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

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
      setData(sorted);
      setOreder("DSC");
    }
    if (order === "DSC") {
      const sorted = [...state.gobalData].sort((a, b) =>
        a[col].toLowerCase() < b[col].toLowerCase() ? 1 : -1
      );
      setData(sorted);
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
      {confirmWindow && (
        <ConfirmModal
          setConfirmWindow={setConfirmWindow}
          setDeleteConfirm={setDeleteConfirm}
        />
      )}
      {connection && (
        <table className="table">
          <thead>
            <tr colSpan="5">
              <td colSpan="5" className="table_nav_conatiner">
                <nav className="table_nav">
                  {!toggleSearch ? (
                    <h3>Employee List</h3>
                  ) : (
                    <>
                      <FontAwesomeIcon icon={faSearch} />{" "}
                      <input
                        type="text"
                        onChange={searchHandler}
                        value={search}
                      />
                    </>
                  )}
                  <ul>
                    <li
                      onClick={() => {
                        setToggleSerach((pre) => !pre);
                        setSearch("");
                      }}
                    >
                      {!toggleSearch ? (
                        <FontAwesomeIcon icon={faSearch} className="icon" />
                      ) : (
                        <FontAwesomeIcon icon={faClose} className="icon" />
                      )}
                    </li>
                    <li>
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
              <th onClick={() => sorting("firstName")}>
                Name{" "}
                {icon === true ? (
                  <FontAwesomeIcon icon={faArrowDown} />
                ) : (
                  <FontAwesomeIcon icon={faArrowUp} />
                )}
              </th>
              <th>Father Name</th>
              <th>Post</th>
              <th>Number</th>
              <th>Update /Delete</th>
            </tr>
          </thead>
          <tbody>
            {result !== "" && (
              <tr className="result">
                <td colSpan="5">{result}</td>
              </tr>
            )}
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
                  <td data-label="Delete/Update" className="last">
                    <div className="td_button_container">
                      <button
                        className="button-38"
                        onClick={() => {
                          deleteEmployee(employe);
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
