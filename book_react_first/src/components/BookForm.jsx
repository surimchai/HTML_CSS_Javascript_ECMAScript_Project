import BookFormField from "./BookFormField.jsx";
import MessageBox from "./MessageBox.jsx";

function BookForm({
  form,
  isEditing,
  message,
  onChange,
  onSubmit,
  onCancel,
  containerRef,
}) {
  const actionLabel = isEditing ? "수정" : "등록";
  const containerClass = isEditing
    ? "form-container editing"
    : "form-container";

  return (
    <div className={containerClass} ref={containerRef}>
      <h2>도서 {actionLabel}</h2>

      <form onSubmit={onSubmit}>
        <div className="form-grid">
          <BookFormField
            label="제목"
            name="title"
            value={form.title}
            onChange={onChange}
            required
          />

          <BookFormField
            label="저자"
            name="author"
            value={form.author}
            onChange={onChange}
            required
          />

          <BookFormField
            label="ISBN"
            name="isbn"
            value={form.isbn}
            onChange={onChange}
            required
          />

          <BookFormField
            label="가격"
            name="price"
            type="number"
            value={form.price}
            onChange={onChange}
          />

          <BookFormField
            label="출판일"
            name="publishDate"
            type="date"
            value={form.publishDate}
            onChange={onChange}
          />

          <BookFormField
            label="언어"
            name="language"
            value={form.language}
            onChange={onChange}
          />

          <BookFormField
            label="페이지 수"
            name="pageCount"
            type="number"
            value={form.pageCount}
            onChange={onChange}
          />

          <BookFormField
            label="출판사"
            name="publisher"
            value={form.publisher}
            onChange={onChange}
          />

          <BookFormField
            label="에디션"
            name="edition"
            value={form.edition}
            onChange={onChange}
          />

          <BookFormField
            label="표지 이미지 URL"
            name="coverImageUrl"
            type="url"
            value={form.coverImageUrl}
            onChange={onChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="description">설명:</label>
          <textarea
            id="description"
            name="description"
            rows="4"
            value={form.description}
            onChange={onChange}
          />
        </div>

        <div className="button-group">
          <button type="submit">
            도서 {actionLabel}
          </button>

          {isEditing && (
            <button
              type="button"
              className="cancel-btn"
              onClick={onCancel}
            >
              취소
            </button>
          )}

          <MessageBox message={message} />
        </div>
      </form>
    </div>
  );
}

export default BookForm;