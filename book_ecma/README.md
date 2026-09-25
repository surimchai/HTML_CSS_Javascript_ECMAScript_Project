# book_ecma — 도서 관리 시스템 (ECMAScript + Vite)

`book/book-client-step10.html` + `js/form10.js` + `css/form10.css` 로 만든
도서 관리 시스템을, **ES6+ 문법과 모듈로 다시 작성**하고 **Vite** 위에 올린 버전입니다.

기능은 step10 과 완전히 같습니다. 달라진 것은 코드를 쓰는 방식뿐입니다.
`student_ecma/` 와 같은 구조로 되어 있으므로 두 프로젝트를 나란히 놓고 비교할 수 있습니다.

## 실행

```bash
npm install       # 처음 한 번
npm run dev       # 개발 서버 (http://localhost:5173)
npm run build     # 배포용 빌드 → dist/
npm run preview   # 빌드 결과 확인
```

서버(Spring Boot)가 `http://localhost:8080` 에서 실행 중이어야 합니다.
주소는 `.env.development` 의 `VITE_API_BASE_URL` 로 바꿀 수 있습니다.

## 폴더 구조

```
book_ecma/
├─ index.html                 화면 마크업 (step10 과 거의 동일)
├─ .env.development           개발용 서버 주소 · VITE_MODE=TEST
├─ .env.production            배포용 서버 주소 · VITE_MODE=PROD
└─ src/
   ├─ main.js                 앱 조립 — 이벤트 연결과 초기 로드
   ├─ style.css               form10.css 이식
   ├─ config.js               API 주소 · 모드 (import.meta.env)
   ├─ api/
   │  └─ bookApi.js           서버 통신 (async/await, CRUD 5개)
   ├─ lib/
   │  └─ validation.js        유효성 검사 (순수 함수)
   └─ ui/
      ├─ message.js           성공·실패·로딩 표시
      ├─ bookForm.js          폼 값 수집·채우기·모드 전환
      ├─ bookTable.js         목록 표 그리기
      └─ bookDetail.js        상세 보기 글 만들기
```

## form10.js 와 무엇이 달라졌나

| 주제 | form10.js (3부) | book_ecma (ECMAScript) |
|---|---|---|
| 파일 구성 | 1개 파일 300여 줄 | 역할별 8개 모듈 |
| 서버 주소 | 코드에 하드코딩 | `.env` + `import.meta.env` |
| 비동기 | `fetch().then().then().catch()` | `async / await` + `try / catch` |
| 오류 처리 | 함수마다 반복 | `request()` 하나로 통합 |
| 오류 메시지 | 고정된 문구 | 서버 메시지 → 상태 코드별 기본 문구 |
| 없는 값 방어 | `book.bookDetail ? ... : "-"` | `bookDetail?.publisher ?? "-"` |
| 숫자 변환 | `parseInt` ("12abc" → 12) | `Number` ("12abc" → NaN) |
| 표의 버튼 | `onclick="editBook(3)"` | `data-action` + 이벤트 위임 |
| 값 출력 | `innerHTML` 에 문자열 조합 | `textContent` (태그가 실행되지 않음) |
| 검사 결과 | 함수 안에서 `alert()` | 메시지를 돌려주고 호출한 쪽이 표시 |
| 안내 메시지 | 모두 `alert()` | 폼 아래 `#formError` 에 표시 |
| 상세 정보 조립 | `detailInfo += ...` 10번 | 배열 `push` + `join("\n")` |
| 취소 버튼 | 없음 (CSS 규칙만 있었음) | 수정 모드에서 표시·동작 |
| 로딩 표시 | 없음 (CSS 규칙만 있었음) | 목록 로드 중 표시 |
| 모드 구분 | 없음 | 제목 옆 TEST / PROD 배지 |

## student_ecma 와 다른 점

| | student_ecma | book_ecma |
|---|---|---|
| 목록의 액션 | 수정 · 삭제 | 수정 · 삭제 · **상세** |
| 중첩 필드 이름 | `detailRequest` (보낼 때) / `detail` (받을 때) | `bookDetail` (양쪽 동일) |
| 추가 검사 | 학번 · 전화번호 · 이메일 형식 | ISBN 형식 · 표지 URL 형식 · 음수 |
| 409 오류 문구 | 이미 등록된 학번입니다 | 이미 등록된 ISBN 입니다 |
| 테마 색 | 파랑 `#007bff` | 초록 `#4CAF50` |

## 단계별 설명 문서

`docs/ECMAScript_실습_단계별_forBook.docx` 에 이 프로젝트를 처음부터 만드는
과제 안내가 `[과제 1] ~ [과제 12]` 로 정리되어 있습니다.
