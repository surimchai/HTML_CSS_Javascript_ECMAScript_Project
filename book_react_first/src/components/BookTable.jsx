import { memo } from "react";

const COLUMN_COUNT = 7;

function formatPrice(price) {
  if (price == null) return "-";
  return `₩${price.toLocaleString()}`;
}

function BookTable({
  books,
  loading,
  error,
  onEdit,
  onDelete,
  onDetail,
}) {
  let rows;

  if (error) {
    rows = (
      <tr>
        <td colSpan={COLUMN_COUNT} className="error-row">
          {error}
        </td>
      </tr>
    );
  } else if (books.length === 0) {
    rows = (
      <tr>
        <td colSpan={COLUMN_COUNT} className="empty-row">
          등록된 도서가 없습니다.
        </td>
      </tr>
    );
  } else {
    rows = books.map((book) => (
      <tr key={book.id}>
        <td>{book.title}</td>
        <td>{book.author}</td>
        <td>{book.isbn}</td>
        <td>{formatPrice(book.price)}</td>
        <td>{book.publishDate ?? "-"}</td>
        <td>{book.bookDetail?.publisher ?? "-"}</td>

        <td>
          <button
            type="button"
            className="edit-btn"
            onClick={() => onEdit(book.id)}
          >
            수정
          </button>

          <button
            type="button"
            className="delete-btn"
            onClick={() => onDelete(book.id)}
          >
            삭제
          </button>

          <button
            type="button"
            className="detail-btn"
            onClick={() => onDetail(book.id)}
          >
            상세
          </button>
        </td>
      </tr>
    ));
  }

  return (
    <div className="table-container">
      <h2>도서 목록</h2>

      {loading && <div className="loading">로딩 중...</div>}

      <table>
        <thead>
          <tr>
            <th>제목</th>
            <th>저자</th>
            <th>ISBN</th>
            <th>가격</th>
            <th>출판일</th>
            <th>출판사</th>
            <th>액션</th>
          </tr>
        </thead>

        <tbody>{rows}</tbody>
      </table>
    </div>
  );
}

export default memo(BookTable);