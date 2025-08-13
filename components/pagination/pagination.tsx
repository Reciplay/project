import React from "react";
import styles from "./pagination.module.scss";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  const pageNumbers = [];
  for (let i = 0; i < totalPages; i++) {
    pageNumbers.push(i);
  }

  return (
    <div className={styles.pagination}>
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 0}
      >
        &lt;
      </button>
      {pageNumbers.map((number) => (
        <button
          key={number}
          onClick={() => onPageChange(number)}
          className={currentPage === number ? styles.active : ""}
        >
          {number + 1}
        </button>
      ))}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages - 1}
      >
        &gt;
      </button>
    </div>
  );
};

export default Pagination;
