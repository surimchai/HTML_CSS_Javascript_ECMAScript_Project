/* ---------------------------------------------------------
   main.js — 앱을 조립하는 곳
   form10.js 의 이벤트 연결과 흐름 제어만 남았습니다.

   여기서 하는 일은 세 가지뿐입니다.
     (1) 필요한 함수들을 다른 파일에서 가져오고
     (2) 어떤 일이 일어났을 때 무엇을 부를지 이어 주고
     (3) 수정 중인지 아닌지 같은 상태를 기억한다

   실제 일은 api/, lib/, ui/ 가 나눠서 합니다.
   --------------------------------------------------------- */

// CSS 도 import 한다. Vite 가 이 줄을 보고 스타일을 끼워 넣는다.
import "./style.css";

// 서버와 대화하는 함수들
import {
    fetchBooks,
    fetchBook,
    createBook,
    updateBook,
    deleteBook,
} from "./api/bookApi.js";

// 입력값 검사
import { validateBook } from "./lib/validation.js";

// 폼 다루기
import {
    bookForm,
    cancelButton,
    collectBookData,
    fillForm,
    setEditMode,
    resetForm,
    scrollToForm,
} from "./ui/bookForm.js";

// 표 그리기
import {
    renderBookTable,
    renderTableError,
    bookTableBody,
} from "./ui/bookTable.js";

// 상세 보기 글 만들기
import { formatBookDetail } from "./ui/bookDetail.js";

// 메시지 표시
import {
    showError,
    showSuccess,
    clearMessages,
    setLoading,
} from "./ui/message.js";

// 지금 어느 모드로 도는지 (TEST / PROD)
import { APP_MODE } from "./config.js";

// 이 파일이 기억하는 유일한 상태다.
// 값이 있으면 수정 모드, null 이면 등록 모드다.
let editingBookId = null;


/* ── 모드 표시 ──────────────────────────────────────────── */

// 제목 옆에 TEST 또는 PROD 를 적는다.
// 값은 .env 파일에서 오고, Vite 가 빌드할 때 넣어 준다.
const appModeBadge = document.getElementById("appMode");
appModeBadge.textContent = APP_MODE;

// 모드에 따라 색을 다르게 한다. classList.add 로 클래스를 하나 더 붙인다.
if (APP_MODE === "PROD") {
    appModeBadge.classList.add("prod");
} else {
    appModeBadge.classList.add("test");
}


/* ── 목록 불러오기 ──────────────────────────────────────── */

async function loadBooks() {
    setLoading(true);

    // try 안에서 오류가 나면 곧바로 catch 로 넘어간다.
    // finally 는 성공하든 실패하든 마지막에 반드시 실행된다.
    try {
        // await 은 서버 응답이 올 때까지 기다린다.
        // form10.js 의 fetch().then().then() 사슬이 두 줄이 되었다.
        const books = await fetchBooks();
        renderBookTable(books);
    } catch (error) {
        console.error("Error:", error);
        showError(error.message);    // bookApi 가 던진 메시지
        renderTableError();
    } finally {
        // 여기에 두면 성공 경로와 실패 경로에 두 번 적지 않아도 된다.
        setLoading(false);
    }
}


/* ── 등록 / 수정 — 폼 제출 ─────────────────────────────── */

// 핸들러 안에서 await 을 쓰려면 함수에 async 를 붙여야 한다.
bookForm.addEventListener("submit", async (event) => {
    event.preventDefault();          // 폼 제출로 페이지가 새로고침되는 것을 막는다
    clearMessages();

    const bookData = collectBookData();

    // validateBook 은 문제가 있으면 메시지를, 없으면 null 을 돌려준다.
    // 문제가 있으면 여기서 끝낸다(early return).
    const errorMessage = validateBook(bookData);
    if (errorMessage) {
        showError(errorMessage);
        return;
    }

    try {
        // editingBookId 에 값이 있으면 수정, 없으면 등록이다.
        if (editingBookId) {
            await updateBook(editingBookId, bookData);
            showSuccess("도서 정보가 성공적으로 수정되었습니다.");
        } else {
            await createBook(bookData);
            showSuccess("도서가 성공적으로 등록되었습니다.");
        }

        editingBookId = null;
        resetForm();
        await loadBooks();            // 목록 새로고침
    } catch (error) {
        console.error("Error:", error);
        showError(error.message);     // 서버가 보낸 실제 메시지
    }
});


/* ── 수정 / 삭제 / 상세 — 표의 클릭을 tbody 한 곳에서 받는다 ── */

/* 버튼마다 이벤트를 걸지 않는 이유는, 표를 다시 그릴 때마다
   버튼이 새로 만들어져 매번 다시 걸어야 하기 때문이다.
   사라지지 않는 부모인 tbody 에 한 번만 걸어 두면
   나중에 생기는 행의 버튼도 그대로 동작한다(이벤트 위임). */
bookTableBody.addEventListener("click", async (event) => {
    // tbody 안에서 일어난 클릭이 전부 여기로 들어온다.
    // 제목 칸을 눌렀는지 버튼을 눌렀는지 먼저 가려내야 한다.
    //
    //   event.target  이벤트를 건 tbody 가 아니라 실제로 눌린 가장 안쪽 요소
    //   closest(...)  자기 자신부터 부모 쪽으로 올라가며 조건에 맞는 첫 요소를 찾는다
    //                 끝까지 없으면 null 을 돌려준다
    const button = event.target.closest("button[data-action]");
    if (!button) return;             // 버튼이 아닌 곳을 눌렀다

    // data-action="edit" 은 button.dataset.action 으로 읽는다.
    const { action, id } = button.dataset;

    // dataset 값은 언제나 문자열이다. data-id="3" 이면 "3" 이 온다.
    // 그래서 Number() 로 숫자로 바꿔서 넘긴다.
    if (action === "edit") {
        await startEdit(Number(id));
    } else if (action === "delete") {
        await removeBook(Number(id));
    } else if (action === "detail") {
        await showDetail(Number(id));
    }
});

// 수정할 도서 정보를 불러와 폼에 채우고 수정 모드로 바꾼다.
async function startEdit(bookId) {
    clearMessages();

    try {
        const book = await fetchBook(bookId);

        fillForm(book);
        editingBookId = bookId;         // 이제 제출하면 등록이 아니라 수정이 된다
        setEditMode(true);
        scrollToForm();
    } catch (error) {
        console.error("Error:", error);
        showError(error.message);
    }
}

// 확인을 받은 뒤 도서를 삭제한다.
async function removeBook(bookId) {
    if (!confirm("정말로 이 도서를 삭제하시겠습니까?")) {
        return;
    }

    try {
        await deleteBook(bookId);
        showSuccess("도서가 성공적으로 삭제되었습니다.");

        // 수정 중이던 도서를 삭제했다면 폼도 등록 모드로 되돌린다.
        // 이걸 빠뜨리면 없는 도서를 수정하려다 404 가 난다.
        if (editingBookId === bookId) {
            editingBookId = null;
            resetForm();
        }

        await loadBooks();
    } catch (error) {
        console.error("Error:", error);
        showError(error.message);
    }
}

/* 도서 한 권의 상세 정보를 보여 준다.

   등록 · 수정 · 삭제 안내는 화면 안 메시지(#formError)로 옮겼지만,
   상세 보기는 여러 줄을 한꺼번에 보여 주는 것이라 alert 을 그대로 둔다.
   보여 줄 글은 formatBookDetail 이 만들고, 이 함수는 띄우기만 한다.
   나중에 <dialog> 나 모달 창으로 바꾸더라도 고칠 곳은 이 한 줄뿐이다. */
async function showDetail(bookId) {
    clearMessages();

    try {
        const book = await fetchBook(bookId);
        alert(formatBookDetail(book));
    } catch (error) {
        console.error("Error:", error);
        showError(error.message);
    }
}


/* ── 취소 버튼 — 수정 모드에서 빠져나온다 ──────────────── */

cancelButton.addEventListener("click", () => {
    editingBookId = null;
    resetForm();
    clearMessages();
});


/* ── 시작 ──────────────────────────────────────────────── */

// form10.js 에서는 DOMContentLoaded 안에서 불러야 했다.
// type="module" 은 HTML 을 다 읽은 뒤 실행되므로 여기서 바로 부른다.
loadBooks();
