import React, { useCallback, useEffect, useState } from "react";
import {
  BiChevronLeft,
  BiFirstPage,
  BiChevronRight,
  BiLastPage,
} from "react-icons/bi";
const Pagination = ({
  itemsPerPage,
  totalItems,
  paginate,
  choseItemPerPage,
}) => {
  const pageNumbers = [];
  const [showPagina, setShowPagina] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  //khỏi tạo số trang bằng công thức toán học.
  for (let i = 1; i <= Math.ceil(totalItems / itemsPerPage); i++) {
    pageNumbers.push(i);
  }
  const handleClick = useCallback(
    (number) => {
      setCurrentPage(number);
      paginate(number);
    },
    [setCurrentPage, paginate]
  );

  const handleFirstPage = () => {
    handleClick(1);
  };

  const handlePrevClick = () => {
    if (currentPage > 1) {
      handleClick(currentPage - 1);
    }
  };

  const handleNextClick = () => {
    if (currentPage < pageNumbers.length) {
      handleClick(currentPage + 1);
    }
  };
  const handleLastPage = () => {
    handleClick(pageNumbers.length);
  };
  const handleSelectChange = (event) => {
    console.log(pageNumbers);
    choseItemPerPage(event.target.value);
  };
  //Bắt lỗi tự động cập nhật "currentPage" nếu nó đang ở trang cuối mà lại chọn "itemPerPage khác".
  useEffect(() => {
    if (pageNumbers.length > 0) {
      if (currentPage >= pageNumbers.length) {
        handleClick(pageNumbers.length);
      } else if (currentPage === 1) {
        setShowPagina([
          1,
          2,
          3,
          4,
          0,
          pageNumbers.length - 1,
          pageNumbers.length,
        ]);
      } else if (currentPage === pageNumbers.length) {
        setShowPagina([
          1,
          0,
          pageNumbers.length - 3,
          pageNumbers.length - 2,
          pageNumbers.length - 1,
          pageNumbers.length,
        ]);
      } else if (currentPage <= 3) {
        setShowPagina([
          1,
          2,
          3,
          4,
          0,
          pageNumbers.length - 1,
          pageNumbers.length,
        ]);
      } else if (currentPage >= pageNumbers.length - 2) {
        setShowPagina([
          1,
          0,
          pageNumbers.length - 3,
          pageNumbers.length - 2,
          pageNumbers.length - 1,
          pageNumbers.length,
        ]);
      } else if (currentPage >= 4 && currentPage <= pageNumbers.length - 3) {
        setShowPagina([
          1,
          0,
          currentPage - 1,
          currentPage,
          currentPage + 1,
          0,
          pageNumbers.length,
        ]);
      } else {
        // Handle other cases if needed
      }
    }
  }, [currentPage, pageNumbers.length, handleClick]);

  return (
    <div className="flex justify-center gap-5">
      <div className="col-start-2 justify-center">
        <div>
          <ul className="pagination flex gap-2 ">
            {/* phần chọn chuyển trang nhanh: "FirstPage" và "PreviousPage" */}
            <li>
              <button
                className={
                  currentPage > 1 ? "font-bold" : "font-bold text-gray-300"
                }
                onClick={handleFirstPage}
                disabled={currentPage > 1 ? false : true}
              >
                <BiFirstPage className="text-2xl" />
              </button>
            </li>
            <li>
              <button className="font-bold" onClick={handlePrevClick}>
                <BiChevronLeft className="text-2xl" />
              </button>
            </li>
            {/* /////////////////////////////////////////////////////////// */}
            {/* Xử lý và hiện ra các "page" có thể chọn */}
            {/* Xử lý nếu tổng số "page" <=7 thì cho in ra hết */}
            {pageNumbers.length < 7
              ? pageNumbers.map((number) => (
                  <li
                    key={number}
                    className={` font-medium rounded-full  p-1 px-3 leading-5 text-center ${
                      currentPage === number
                        ? "bg-slate-950 text-white"
                        : "bg-slate-200"
                    }`}
                    onClick={() => handleClick(number)}
                  >
                    <button className="">{number}</button>
                  </li>
                ))
              : showPagina.map((number) =>
                  number !== 0 ? (
                    <li
                      key={number}
                      className={` font-medium rounded-full p-1 px-3 leading-5 text-center ${
                        currentPage === number
                          ? "bg-slate-950 text-white"
                          : "bg-slate-200"
                      }`}
                    >
                      <button onClick={() => handleClick(number)}>
                        {number}
                      </button>
                    </li>
                  ) : (
                    <li
                      key={Math.random()}
                      className="font-medium rounded-full leading-5 text-center bg-slate-50"
                    >
                      ...
                    </li>
                  )
                )}
            {/* /////////////////////////////////////////////////////////// */}
            <li>
              <button className="font-bold" onClick={handleNextClick}>
                <BiChevronRight className="text-2xl" />
              </button>
            </li>
            <li>
              <button
                className={
                  currentPage < pageNumbers.length
                    ? "font-bold"
                    : "font-bold text-gray-300"
                }
                onClick={handleLastPage}
                disabled={currentPage < pageNumbers.length ? false : true}
              >
                <BiLastPage className="text-2xl" />
              </button>
            </li>
          </ul>
        </div>
      </div>
      <div className="col-start-3 flex justify-end">
        <label className="font-bold pr-5" htmlFor="selectItemPerPageInput">
          Rows per page{" "}
        </label>
        <select
          className="w-16 font-bold border-2"
          id="selectItemPerPageInput"
          value={itemsPerPage}
          onChange={handleSelectChange}
        >
          <option value="5">5</option>
          <option value="6">6</option>
          <option value="7">7</option>
          <option value="8">8</option>
          <option value="9">9</option>
          <option value="10">10</option>
        </select>
      </div>
    </div>
  );
};

export default Pagination;
