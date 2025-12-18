import { Routes, Route, Navigate } from "react-router-dom";
import "./App.css";
import LoginForm from "./components/Auth/LoginForm";
import SignupForm from "./components/Auth/SignupForm";
import Header from "./components/Header";
import NotFound from "./components/NotFound";
import ExpensePage from "./pages/ExpensePage";
import { useSelector } from "react-redux";
import SummaryPage from "./pages/SummaryPage";
import VerifyEmail from "./components/Auth/VerifyEmail";

function App() {
  const token = useSelector((state) => state.auth.token);
  const isLoggedIn = !!token;

  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />

        <Route
          path="/login"
          element={
            isLoggedIn ? <Navigate to="/expense" replace /> : <LoginForm />
          }
        />
        <Route path="/verify-email/:token" element={<VerifyEmail />} />

        <Route
          path="/signup"
          element={
            isLoggedIn ? <Navigate to="/expense" replace /> : <SignupForm />
          }
        />

        <Route
          path="/expense"
          element={
            isLoggedIn ? <ExpensePage /> : <Navigate to="/login" replace />
          }
        />

        <Route
          path="/summary"
          element={
            isLoggedIn ? <SummaryPage /> : <Navigate to="/login" replace />
          }
        />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

export default App;
