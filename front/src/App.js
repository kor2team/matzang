import React, { useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import MainPage from "./components/MainPage";
import SearchPage from "./components/SearchPage";
import logo from "./assets/svg/logo.jpg";
import LoginPage from "./components/LoginPage";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import PostList from "./pages/PostList";
import PostModal from "./components/PostModal";
import useStore from "./store/useStore"; // UI 상태 관리
import useLocalStore from "./store/useLocalStore"; // 로그인 상태 관리
import CreatePost from "./components/CreatePost";
import UpdatePost from "./components/UpdatePost";
import ProfilePage from "./components/ProfilePage";
import Footer from "./layout/Footer";

const queryClient = new QueryClient();

function App() {
  // UI 상태를 관리하는 useStore
  const { currentComponent, setComponent, selectedPost } = useStore(
    (state) => state
  );

  // 로그인 상태를 관리하는 useLocalStore
  const { isLogin, loggedInEmail, setIsLogin, setUser } = useLocalStore(
    (state) => state
  );

  useEffect(() => {
    const email = localStorage.getItem("loggedInEmail");
    if (email) {
      setUser({ email, token: localStorage.getItem("auth_token") });
      setIsLogin(true); // 로그인 상태로 설정
    }
  }, [setUser, setIsLogin]);

  // 로그인 처리 함수
  const handleLogin = (email, token) => {
    setUser({ email, token });
    setIsLogin(true);
    localStorage.setItem("loggedInEmail", email); // 로컬 스토리지에 이메일 저장
    localStorage.setItem("auth_token", token); // 토큰도 로컬 스토리지에 저장
    window.location.href = "/"; // 로그인 후 리디렉션
  };

  // 로그아웃 처리 함수
  const handleLogout = () => {
    setUser({ email: "", token: "" });
    setIsLogin(false);
    localStorage.removeItem("loggedInEmail"); // 로컬 스토리지에서 이메일 삭제
    localStorage.removeItem("auth_token"); // 로컬 스토리지에서 토큰 삭제
    window.location.href = "/"; // 로그아웃 후 리디렉션
  };

  // 게시물 목록으로 이동하는 함수
  const handlePostList = () => {
    setComponent("postList");
  };

  return (
    <Router>
      <QueryClientProvider client={queryClient}>
        <div className="flex flex-col items-center">
          <div className="max-w-3xl mx-auto w-full flex flex-col flex-grow">
            {/* Header */}
            <header className="flex justify-between items-center p-5 border-b-2 border-orange-500">
              <div className="flex items-center">
                <Link to="/" className="flex items-center">
                  <img
                    src={logo}
                    alt="Logo"
                    className="max-w-12 h-auto mr-2 rounded-full"
                  />
                  <span
                    className="text-xl font-semibold text-orange-500"
                    style={{
                      fontFamily: "'Nanum Pen Script', cursive", // Nanum Pen Script 폰트 적용
                      letterSpacing: "4px", // 글자 간격을 넓혀서 날려쓰는 느낌
                      fontWeight: "normal", // 글자 굵기 조정
                      fontSize: "2rem",
                    }}
                  >
                    맛남의 장
                  </span>
                </Link>
              </div>
              <div className="flex justify-end">
                {isLogin ? (
                  <>
                    <Link
                      to="/profile"
                      className="mr-4 text-orange-500 hover:text-blue-500"
                    >
                      {loggedInEmail}
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="bg-orange-500 text-white py-2 px-4 rounded hover:bg-blue-500 material-symbols-outlined"
                    >
                      logout
                    </button>
                  </>
                ) : (
                  <Link
                    to="/login"
                    className="text-orange-500 hover:text-blue-500"
                  >
                    로그인
                  </Link>
                )}
              </div>
            </header>

            {/* Navigation Bar */}
            <nav className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-x-4 sm:space-y-0 border-b border-gray-300 py-4">
              <Link
                to="/"
                className="w-24 px-4 py-2 text-orange-500 border border-orange-500 rounded hover:text-blue-500 hover:border-blue-500 text-center"
              >
                레시피
              </Link>
              <Link
                to="/search"
                className="w-24 px-4 py-2 text-orange-500 border border-orange-500 rounded hover:text-blue-500 hover:border-blue-500 text-center"
              >
                검색
              </Link>
              <Link
                to="/board"
                className="w-24 px-4 py-2 text-orange-500 border border-orange-500 rounded hover:text-blue-500 hover:border-blue-500 text-center"
                onClick={handlePostList}
              >
                게시물
              </Link>
            </nav>

            {/* Main Content */}
            <main className="flex-grow p-5 bg-gray-100">
              <Routes>
                <Route path="/" element={<MainPage />} />
                <Route path="/search" element={<SearchPage />} />
                <Route
                  path="/login"
                  element={<LoginPage onLogin={handleLogin} />}
                />
                <Route
                  path="/board"
                  element={
                    <div>
                      {currentComponent === "postList" && <PostList />}
                      {currentComponent === "createPost" && <CreatePost />}
                      {currentComponent === "updatePost" && <UpdatePost />}
                    </div>
                  }
                />
                <Route
                  path="/profile"
                  element={
                    <ProfilePage
                      email={loggedInEmail}
                      onLogout={handleLogout}
                    />
                  }
                />
              </Routes>
              <PostModal post={selectedPost} />
            </main>

            {/* Footer */}
            <footer className="border-t border-gray-300">
              <Footer />
            </footer>
          </div>
        </div>
      </QueryClientProvider>
    </Router>
  );
}

export default App;
