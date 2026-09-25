import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import {
  fetchBooks,
  fetchBook,
  createBook,
  updateBook,
  deleteBook,
} from "./api/bookApi.js";

import { validateBook } from "./lib/validation.js";
import {
  EMPTY_FORM,
  toRequest,
  toFormValues,
} from "./lib/bookData.js";

import BookForm from "./components/BookForm.jsx";
import BookTable from "./components/BookTable.jsx";
import BookDetail from "./components/BookDetail.jsx";

import { APP_MODE } from "./config.js";

import "./style.css";

const MESSAGE_TIMEOUT = 3000;

function App() {
  const [books, setBooks] = useState([]);
  const [form, setForm] = useState(EMPTY_FORM);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [listError, setListError] = useState(null);
  const [message, setMessage] = useState(null);
  const [detailBook, setDetailBook] = useState(null);

  const formRef = useRef(null);

  const isEditing = editingId !== null;

  const loadBooks = useCallback(async () => {
    setLoading(true);
    setListError(null);

    try {
      const data = await fetchBooks();
      setBooks(data);
    } catch (error) {
      console.error("Error:", error);

      setMessage({
        text: error.message,
        type: "error",
      });

      setListError("오류: 데이터를 불러올 수 없습니다.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadBooks();
  }, [loadBooks]);

  useEffect(() => {
    if (!message) {
      return;
    }

    if (message.type !== "success") {
      return;
    }

    const timer = setTimeout(
      () => setMessage(null),
      MESSAGE_TIMEOUT
    );

    return () => clearTimeout(timer);
  }, [message]);

  function handleChange(event) {
    const name = event.target.name;
    const value = event.target.value;

    const next = { ...form };
    next[name] = value;

    setForm(next);
  }

  const resetForm = useCallback(() => {
    setForm(EMPTY_FORM);
    setEditingId(null);
  }, []);

  async function handleSubmit(event) {
    event.preventDefault();

    setMessage(null);

    const bookData = toRequest(form);

    const errorMessage = validateBook(bookData);

    if (errorMessage) {
      setMessage({
        text: errorMessage,
        type: "error",
      });

      return;
    }

    try {
      if (isEditing) {
        await updateBook(editingId, bookData);

        setMessage({
          text: "도서 정보가 성공적으로 수정되었습니다.",
          type: "success",
        });
      } else {
        await createBook(bookData);

        setMessage({
          text: "도서가 성공적으로 등록되었습니다.",
          type: "success",
        });
      }

      resetForm();
      await loadBooks();
    } catch (error) {
      console.error("Error:", error);

      setMessage({
        text: error.message,
        type: "error",
      });
    }
  }

  const handleEdit = useCallback(async (bookId) => {
    setMessage(null);

    try {
      const book = await fetchBook(bookId);

      setForm(toFormValues(book));
      setEditingId(bookId);

      if (formRef.current) {
        formRef.current.scrollIntoView({
          behavior: "smooth",
        });
      }
    } catch (error) {
      console.error("Error:", error);

      setMessage({
        text: error.message,
        type: "error",
      });
    }
  }, []);

  const handleDelete = useCallback(
    async (bookId) => {
      if (!confirm("정말로 이 도서를 삭제하시겠습니까?")) {
        return;
      }

      try {
        await deleteBook(bookId);

        setMessage({
          text: "도서가 성공적으로 삭제되었습니다.",
          type: "success",
        });

        if (editingId === bookId) {
          resetForm();
        }

        if (detailBook?.id === bookId) {
          setDetailBook(null);
        }

        await loadBooks();
      } catch (error) {
        console.error("Error:", error);

        setMessage({
          text: error.message,
          type: "error",
        });
      }
    },
    [editingId, detailBook, resetForm, loadBooks]
  );

  const handleDetail = useCallback(async (bookId) => {
    setMessage(null);

    try {
      const book = await fetchBook(bookId);
      setDetailBook(book);
    } catch (error) {
      console.error("Error:", error);

      setMessage({
        text: error.message,
        type: "error",
      });
    }
  }, []);

  let modeClass = "app-mode test";

  if (APP_MODE === "PROD") {
    modeClass = "app-mode prod";
  }

  return (
    <>
      <h1>
        도서 관리 시스템{" "}
        <span className={modeClass}>
          {APP_MODE}
        </span>
      </h1>

      <BookForm
        form={form}
        isEditing={isEditing}
        message={message}
        onChange={handleChange}
        onSubmit={handleSubmit}
        onCancel={resetForm}
        containerRef={formRef}
      />

      <BookDetail
        book={detailBook}
        onClose={() => setDetailBook(null)}
      />

      <BookTable
        books={books}
        loading={loading}
        error={listError}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onDetail={handleDetail}
      />
    </>
  );
}

export default App;