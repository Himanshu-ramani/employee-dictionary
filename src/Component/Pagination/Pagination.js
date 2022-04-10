import React,{useEffect} from "react";
import "./Pagination.css";
const Pagination = ({
  postPerPage,
  totalPosts,
  paginate,
  perPage,
  currentPage,
  getCurrentPage
}) => {


  const pageNumber = [];
useEffect(() => {
  getCurrentPage(pre => pageNumber.includes(pre)? pre :pageNumber.slice(-1).pop() )
}, [pageNumber])


  for (let i = 1; i <= Math.ceil(totalPosts / postPerPage); i++) {
    pageNumber.push(i);
  }
  const setPostPerPage = (event) => {
    perPage(event.target.value);
  };
 
  return (
    <tr>
      <td colSpan="7" className="pagination_td">
        <nav className="pagination">
          <ul>
          {currentPage === 1 ? (
              <></>
            ) : <li>
              <button className="shift_Button" onClick={() => paginate(1)}>  &laquo;</button>
            </li>}
            {currentPage === 1 ? (
              <></>
            ) : (
              <li>
                <button onClick={() => paginate(currentPage-- - 1)}>
                  {" "}
                 Previous
                </button>
              </li>
            )}
            {pageNumber.map((number) => (
              <li key={number}>
                {<button onClick={() => paginate(number)} className={currentPage === number ? "pagination_active" : ""}>{number}</button>}
              </li>
            ))}
            {currentPage === pageNumber.length ? (
              <></>
            ) : (
              <li>
                <button onClick={() => paginate(currentPage++ + 1)}>
                  {" "}
                 Next
                </button>
              </li>
            )}
            {currentPage === pageNumber.length ? (
              <></>
            ) : (
              <li>
                <button onClick={() => paginate(pageNumber.length)}>
                &raquo;
                </button>
              </li>
            )}
          </ul>
          <div>
            Show &nbsp;
            <select name="cars" id="cars" onChange={setPostPerPage}>
              <option value="5">5 Row</option>
              <option value="10">10 Row</option>
              <option value="15">15 Row</option>
              <option value="20">20 Row</option>
            </select>
          </div>
        </nav>
      </td>
    </tr>
  );
};

export default Pagination;
