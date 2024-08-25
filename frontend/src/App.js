import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useLocation,
  Navigate,
} from "react-router-dom";
import PostList from "./pages/PostList";
import PostDetail from "./pages/PostDetail";
import PostForm from "./components/PostForm";
import Signup from "./components/Signup";
import Login from "./components/Login";

const ProtectedRoute = ({ children }) => {
  const location = useLocation();
  const token = localStorage.getItem("user");

  if (!token) {
    // Redirect to login page if token is not found
    return <Navigate to="/login" state={{ from: location }} />;
  }

  return children;
};

const App = () => {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <PostList />
          </ProtectedRoute>
        }
      />
      <Route
        path="/posts/:id"
        element={
          <ProtectedRoute>
            <PostDetail />
          </ProtectedRoute>
        }
      />
      <Route
        path="/create-post/:id?"
        element={
          <ProtectedRoute>
            <PostForm />
          </ProtectedRoute>
        }
      />
      <Route path="/signup" element={<Signup />} />
      <Route path="/login" element={<Login />} />
    </Routes>
  );
};

const AppWrapper = () => (
  <Router>
    <App />
  </Router>
);

export default AppWrapper;
