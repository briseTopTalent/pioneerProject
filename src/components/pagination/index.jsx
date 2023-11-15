import React from "react";
import ReactPaginate from "react-paginate";

const Pagination = ({ currentPage, totalPages, clickAction }) => {
	return (
		<ReactPaginate
			previousLabel={<>&laquo;</>}
			nextLabel={<>&raquo;</>}
			breakLabel={"..."}
			breakClassName={"page-item"}
			pageCount={totalPages}
			initialPage={currentPage - 1}
			pageRangeDisplayed={1}
			marginPagesDisplayed={1}
			onPageChange={(data) => clickAction(data.selected + 1)}
			disableInitialCallback={true}
			containerClassName={"pagination custom-pagination pagination-rounded"}
			pageClassName={"page-item"}
			pageLinkClassName={"page-link"}
			previousClassName={"page-item"}
			previousLinkClassName={"page-link"}
			nextClassName={"page-item"}
			nextLinkClassName={"page-link"}
			activeClassName={"active"}
		/>
	);
};
export default Pagination;
