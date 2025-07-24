import { forwardRef } from "react";

const Category = forwardRef<HTMLDivElement>((_, ref) => {
  return (
    <div ref={ref}>
      <h2>카테고리</h2>
      {/* 내용 */}
    </div>
  );
});

Category.displayName = "Category";
export default Category;
