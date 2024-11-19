import React, { useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import MainPage from "./components/MainPage";
import SearchPage from "./components/SearchPage";
import logo from "./assets/svg/logo.jpg";
import LoginPage from "./components/LoginPage";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import PostList from "./pages/PostList";
import PostModal from "./components/PostModal";
import useStore from "./store/useStore";
import CreatePost from "./components/CreatePost";
import ProfilePage from "./components/ProfilePage";
import Footer from "./layout/Footer";
import UpdatePost from "./components/UpdatePost";

const queryClient = new QueryClient();

function App() {
  const { isLogin, loggedInEmail, setIsLogin, setLoggedInEmail, selectedPost } =
    useStore();

  useEffect(() => {
    const email = localStorage.getItem("loggedInEmail");
    if (email) {
      setLoggedInEmail(email);
      setIsLogin(true); // 로그인 상태로 설정
    }
  }, [setLoggedInEmail, setIsLogin]);

  const handleLogin = (email) => {
    setLoggedInEmail(email);
    setIsLogin(true);
    localStorage.setItem("loggedInEmail", email);
    window.location.href = "/";
  };

  const handleLogout = () => {
    setLoggedInEmail("");
    setIsLogin(false);
    localStorage.removeItem("loggedInEmail");
    window.location.href = "/";
  };

  const currentComponent = useStore((state) => state.currentComponent);
  const setComponent = useStore((state) => state.setComponent);

  const handlePostList = () => {
    setComponent("postList");
  };

  return (
    <Router>
      <QueryClientProvider client={queryClient}>
        <div className="flex flex-col items-center min-h-screen">
          {/* 전체 너비를 키우기 위해 'max-w-7xl'로 변경 */}
          <div className="max-w-7xl mx-auto w-full flex flex-col flex-grow">
            {/* Header */}
            <header className="flex justify-between items-center p-5 border-b-2 border-orange-500">
              <div className="flex items-center">
                <Link to="/" className="flex items-center">
                  <img
                    src={logo}
                    alt="Logo"
                    className="max-w-16 h-auto mr-2 rounded-full" // 로고 크기 키움
                  />
                  <span
                    className="text-4xl font-semibold text-orange-500"
                    style={{
                      fontFamily: "'Nanum Pen Script', cursive",
                      letterSpacing: "4px",
                      fontWeight: "normal",
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
                      className="bg-orange-500 text-white py-2 px-4 rounded hover:bg-blue-500  material-symbols-outlined"
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
            <nav className="flex flex-row justify-center items-center space-x-6 border-b border-gray-300 py-4">
              <Link
                to="/"
                className="w-32 px-4 py-3 text-lg font-bold text-orange-500 border border-orange-500 rounded hover:text-blue-500 hover:border-blue-500 text-center"
              >
                레시피
              </Link>
              <Link
                to="/search"
                className="w-32 px-4 py-3 text-lg font-bold text-orange-500 border border-orange-500 rounded hover:text-blue-500 hover:border-blue-500 text-center"
              >
                검색
              </Link>
              <Link
                to="/board"
                className="w-32 px-4 py-3 text-lg font-bold text-orange-500 border border-orange-500 rounded hover:text-blue-500 hover:border-blue-500 text-center"
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
            <footer className="border-t border-gray-300 py-4">
              <Footer />
            </footer>
          </div>
        </div>
      </QueryClientProvider>
    </Router>
  );
}

export default App;
