/* ---------------------------------------------------------
   도서 상세 보기 — 보여 줄 글을 만든다
   form10.js 의 showBookDetail 이 여기로 왔습니다.

   form10.js 는 서버에서 값을 받아 오는 일과 글을 조립하는 일,
   alert 으로 띄우는 일을 한 함수 안에서 모두 했습니다.
   여기서는 "글을 만드는 일" 만 남깁니다.
     값을 받아 오는 일  →  api/bookApi.js 의 fetchBook
     화면에 띄우는 일   →  main.js
   그래서 이 함수는 화면도 서버도 모르는 순수 함수입니다.
   --------------------------------------------------------- */

// 값이 없을 때 대신 보여 줄 글자. 여러 군데에서 쓰므로 한곳에 둔다.
const EMPTY = "-";

// 가격을 "₩12,000" 모양으로 바꾼다. bookTable.js 의 것과 같은 규칙이다.
function formatPrice(price) {
    // == 는 null 과 undefined 를 한 번에 거른다. 0 원은 "₩0" 으로 남는다.
    if (price == null) return EMPTY;
    return `₩${price.toLocaleString()}`;
}

/* 도서 한 권의 상세 정보를 여러 줄짜리 글로 만든다.

   form10.js 는 detailInfo += ... 로 문자열을 열 번 이어 붙였습니다.
   여기서는 줄들을 배열에 담고 join("\n") 으로 한 번에 잇습니다.
   줄을 더하거나 빼기 쉽고, += 를 빠뜨려 줄이 사라지는 실수도 없습니다. */
export function formatBookDetail(book) {
    const { title, author, isbn, price, publishDate, bookDetail } = book;

    const lines = [
        `제목: ${title}`,
        `저자: ${author}`,
        `ISBN: ${isbn}`,
        `가격: ${formatPrice(price)}`,
        `출판일: ${publishDate ?? EMPTY}`,
    ];

    // 상세 정보가 없는 도서는 bookDetail 이 null 이다.
    // 그때는 기본 정보만 보여 주고 끝낸다.
    if (bookDetail) {
        // push 에 값을 여러 개 넘기면 뒤에 한꺼번에 붙는다.
        // 여기서는 ?? 가 아니라 || 를 쓴다. 입력하지 않은 칸은 null 이 아니라
        // 빈 문자열("")로 저장되는데, ?? 는 빈 문자열을 그대로 통과시켜
        // "출판사: " 처럼 뒤가 비어 보이기 때문이다.
        lines.push(
            "",                                          // 빈 줄로 한 칸 띄운다
            `설명: ${bookDetail.description || EMPTY}`,
            `언어: ${bookDetail.language || EMPTY}`,
            `페이지 수: ${bookDetail.pageCount ?? EMPTY}`,
            `출판사: ${bookDetail.publisher || EMPTY}`,
            `에디션: ${bookDetail.edition || EMPTY}`,
            `표지 이미지: ${bookDetail.coverImageUrl || EMPTY}`,
        );
    }

    // join("\n") 은 배열의 값들을 줄바꿈으로 이어 하나의 글로 만든다.
    return lines.join("\n");
}
