import { Link, NavLink, Route, Routes } from "react-router-dom";
 
import StudentListPage from "./pages/StudentListPage.jsx";
import StudentFormPage from "./pages/StudentFormPage.jsx";
import NotFoundPage from "./pages/NotFoundPage.jsx";
 
// 지금 어느 모드로 도는지 (TEST / PROD)
import { APP_MODE } from "./config.js";
 
import "./style.css";
 
function App() {
    // 제목 옆에 붙일 배지의 class. 운영이면 빨강, 아니면 회색.
    let modeClass = "app-mode test";
    if (APP_MODE === "PROD") {
        modeClass = "app-mode prod";
    }
 
    return (
        <>
            {/* 어느 페이지에서나 보이는 머리말. Routes 바깥에 있어서 바뀌지 않는다. */}
            <header className="app-header">
                {/* Link 는 <a> 처럼 보이지만 페이지를 새로 내려받지 않는다.
                    주소만 바꾸고 React 가 화면을 갈아 끼운다. */}
                <div className="app-brand">
                    <Link to="/" className="app-title">학생 관리 시스템</Link>
                    <span className={modeClass}>{APP_MODE}</span>
                </div>
 
                <nav className="app-nav">
                    {/* NavLink 는 Link 와 같지만, 지금 보고 있는 주소와 맞으면
                        className 에 isActive 가 true 로 들어온다.
                        그래서 "지금 여기 있다" 를 표시할 수 있다. */}
                    <NavLink
                        to="/"
                        end
                        className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}
                    >
                        학생 목록
                    </NavLink>
 
                    <NavLink
                        to="/new"
                        className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}
                    >
                        학생 등록
                    </NavLink>
                </nav>
            </header>
 
            {/* Routes 안에서 주소와 맞는 Route 하나만 그려진다. */}
            <Routes>
                <Route path="/" element={<StudentListPage />} />
                <Route path="/new" element={<StudentFormPage />} />
                <Route path="/edit/:id" element={<StudentFormPage />} />
                <Route path="*" element={<NotFoundPage />} />
            </Routes>
        </>
    );
}
 
export default App;
