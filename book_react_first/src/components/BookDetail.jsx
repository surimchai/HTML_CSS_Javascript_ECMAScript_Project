function formatPrice(price) {
  if (price == null) {
    return "-";
  }

  return `₩${price.toLocaleString()}`;
}

function BookDetail({ book, onClose }) {
  if (!book) {
    return null;
  }

  const detail = book.bookDetail;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>도서 상세 정보</h2>

        <p>
          <strong>제목:</strong> {book.title}
        </p>

        <p>
          <strong>저자:</strong> {book.author}
        </p>

        <p>
          <strong>ISBN:</strong> {book.isbn}
        </p>

        <p>
          <strong>가격:</strong> {formatPrice(book.price)}
        </p>

        <p>
          <strong>출판일:</strong> {book.publishDate ?? "-"}
        </p>

        <p>
          <strong>설명:</strong> {detail?.description || "-"}
        </p>

        <p>
          <strong>언어:</strong> {detail?.language || "-"}
        </p>

        <p>
          <strong>페이지 수:</strong> {detail?.pageCount ?? "-"}
        </p>

        <p>
          <strong>출판사:</strong> {detail?.publisher || "-"}
        </p>

        <p>
          <strong>에디션:</strong> {detail?.edition || "-"}
        </p>

        <p>
          <strong>표지 이미지 URL:</strong>{" "}
          {detail?.coverImageUrl || "-"}
        </p>

        <div className="button-group">
          <button type="button" onClick={onClose}>
            닫기
          </button>
        </div>
      </div>
    </div>
  );
}

export default BookDetail;