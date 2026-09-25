/* ---------------------------------------------------------
   폼 다루기 — 값 모으기 / 채우기 / 모드 전환
   form10.js 에서 폼과 관련된 코드는 제출 핸들러, editBook,
   resetForm 세 군데에 흩어져 있었습니다. 여기로 모았습니다.

   폼 구조가 바뀌면 이 파일만 고치면 됩니다.
   --------------------------------------------------------- */

// export 를 붙이면 다른 파일에서 import 로 가져다 쓸 수 있다.
// 이 둘은 main.js 가 이벤트를 걸어야 하므로 밖으로 내보낸다.
export const bookForm = document.getElementById("bookForm");
export const cancelButton = document.getElementById("cancelButton");

// 이 둘은 이 파일 안에서만 쓰므로 export 하지 않는다.
const submitButton = bookForm.querySelector('button[type="submit"]');
// closest 는 자기 자신부터 부모 쪽으로 올라가며 맞는 요소를 찾는다.
// 폼을 감싸고 있는 <div class="form-container"> 를 찾아 둔다.
const formContainer = bookForm.closest(".form-container");

/* 숫자 칸(가격, 페이지 수)의 값을 숫자로 바꾼다.
   FormData 가 돌려주는 값은 언제나 문자열이라 "1500" 처럼 들어온다.
   비워 두면 "" 이 오는데, 그대로 보내면 서버가 숫자로 읽지 못한다.
   그래서 비어 있으면 null 을 돌려준다.

   Number 로 바꾸는 방법이 여럿이라 한곳에 모아 둔다.
   form10.js 의 parseInt 대신 Number 를 쓰는데,
   parseInt("12abc") 는 12 를 돌려주지만 Number("12abc") 는 NaN 이다.
   잘못 입력한 값을 조용히 통과시키지 않는 쪽이 낫다. */
function toNumberOrNull(value) {
    // trim() 으로 공백만 든 칸도 빈 칸으로 본다.
    if (!value || !value.trim()) return null;
    return Number(value);
}

// 폼에 입력된 값을 서버가 받는 구조로 모은다.
export function collectBookData() {
    // FormData 는 폼 안의 입력칸을 name 속성으로 꺼내 쓸 수 있게 모아 준다.
    // id 가 아니라 name 이 열쇠다.
    const formData = new FormData(bookForm);

    // 서버는 도서 기본 정보와 상세 정보를 나눠서 받는다.
    return {
        title: formData.get("title").trim(),
        author: formData.get("author").trim(),
        isbn: formData.get("isbn").trim(),
        price: toNumberOrNull(formData.get("price")),
        // 여기서만 ?? 가 아니라 || 를 쓴다.
        // 아무것도 입력하지 않으면 빈 문자열("")이 오는데,
        // ?? 는 빈 문자열을 통과시켜 서버로 "" 이 나가 버린다.
        publishDate: formData.get("publishDate") || null,
        bookDetail: {
            description: formData.get("description").trim(),
            language: formData.get("language").trim(),
            pageCount: toNumberOrNull(formData.get("pageCount")),
            publisher: formData.get("publisher").trim(),
            coverImageUrl: formData.get("coverImageUrl").trim(),
            edition: formData.get("edition").trim(),
        },
    };
}

// 서버에서 받은 도서 정보로 폼을 채운다. 수정 버튼을 눌렀을 때 쓴다.
export function fillForm(book) {
    const { title, author, isbn, price, publishDate, bookDetail } = book;

    bookForm.title.value = title;
    bookForm.author.value = author;
    bookForm.isbn.value = isbn;

    // 값이 없으면 빈 칸으로 둔다. null 을 그대로 넣으면 "null" 이 보인다.
    bookForm.price.value = price ?? "";
    bookForm.publishDate.value = publishDate ?? "";

    // 상세 정보를 등록하지 않은 도서는 bookDetail 이 없다.
    //   bookDetail?.language  bookDetail 이 없으면 undefined 를 돌려주고 멈춘다
    //   ?? ""                 그 undefined 를 빈 문자열로 바꾼다
    // form10.js 에서는 if (book.bookDetail) { ... } 로 감싸야 했다.
    bookForm.description.value = bookDetail?.description ?? "";
    bookForm.language.value = bookDetail?.language ?? "";
    bookForm.pageCount.value = bookDetail?.pageCount ?? "";
    bookForm.publisher.value = bookDetail?.publisher ?? "";
    bookForm.coverImageUrl.value = bookDetail?.coverImageUrl ?? "";
    bookForm.edition.value = bookDetail?.edition ?? "";
}

// 등록 모드와 수정 모드를 전환한다. 인자를 생략하면 등록 모드다.
export function setEditMode(isEditing = false) {
    // 조건 ? 참일 때 값 : 거짓일 때 값  (삼항 연산자)
    submitButton.textContent = isEditing ? "도서 수정" : "도서 등록";
    cancelButton.style.display = isEditing ? "inline-block" : "none";

    // classList.toggle 의 두 번째 인자는 "뒤집기"가 아니라 "강제"다.
    //   true  면 무조건 넣고, false 면 무조건 뺀다.
    // 두 번째 인자가 없으면 부를 때마다 넣었다 뺐다 하므로,
    // setEditMode(true) 가 두 번 불리면 강조 표시가 사라져 버린다.
    // 이 클래스는 style.css 에서 폼 왼쪽에 녹색 띠를 그린다.
    formContainer.classList.toggle("editing", isEditing);
}

// 폼을 비우고 등록 모드로 되돌린다.
export function resetForm() {
    bookForm.reset();            // 입력칸을 모두 비운다
    setEditMode(false);
}

// 수정 버튼을 눌렀을 때 폼이 보이도록 부드럽게 스크롤한다.
export function scrollToForm() {
    bookForm.scrollIntoView({ behavior: "smooth" });
}
