import React from "react";
import TablerIcon from "../icon/tablerIcon";
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
  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i);

  return (
    <div className={styles.pagination}>
      {/* 이전 버튼 */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 0}
        className={`${styles.pageButton} ${styles.iconButton}`}
      >
        <TablerIcon name="ChevronLeft" size={18} />
      </button>

      {/* 페이지 번호 */}
      {pageNumbers.map((number) => (
        <button
          key={number}
          onClick={() => onPageChange(number)}
          className={`${styles.pageButton} ${
            currentPage === number ? styles.active : ""
          }`}
        >
          {number + 1}
        </button>
      ))}

      {/* 다음 버튼 */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages - 1}
        className={`${styles.pageButton} ${styles.iconButton}`}
      >
        <TablerIcon name="ChevronRight" size={18} />
      </button>
    </div>
  );
};

export default Pagination;
