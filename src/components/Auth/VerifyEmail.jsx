import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const VerifyEmail = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState("verifying");
  const [message, setMessage] = useState("");

  const verify = async () => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/auth/verify-email/${token}`
      );
      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Verification failed");

      setStatus("success");
      setMessage("Email verified successfully! Redirecting to login...");
      setTimeout(() => navigate("/login"), 4000);
    } catch (err) {
      setStatus("error");
      setMessage(err.message || "Verification failed or link expired.");
    }
  };

  useEffect(() => {
    verify();
  }, [token, navigate]);

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <div
        className="card shadow p-4"
        style={{ maxWidth: "450px", width: "100%" }}
      >
        <div className="card-body text-center">
          <h3 className="card-title mb-3">Email Verification</h3>

          {status === "verifying" && (
            <>
              <div className="spinner-border text-primary my-3" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <p>Verifying your email, please wait...</p>
            </>
          )}

          {status === "success" && (
            <div className="alert alert-success" role="alert">
              {message}
            </div>
          )}

          {status === "error" && (
            <div className="alert alert-danger" role="alert">
              {message}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;
