import { useRef, useState } from "react";
import {
  Button,
  Card,
  Container,
  FloatingLabel,
  Spinner,
} from "react-bootstrap";
import Form from "react-bootstrap/Form";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { authActions } from "../../store/authSlice";

const LoginForm = () => {
  const dispatch = useDispatch();
  const history = useNavigate();
  const emailRef = useRef();
  const passwordRef = useRef();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const email = emailRef.current.value;
    const password = passwordRef.current.value;

    try {
      const response = await fetch(
        "https://expense-tracker-backend-ut31.onrender.com/api/auth/login",
        {
          method: "POST",
          body: JSON.stringify({ email, password }),
          headers: { "Content-Type": "application/json" },
        }
      );
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Login failed");

      setSuccess("Login successful!");
      setError("");

      dispatch(
        authActions.login({
          token: data.token,
          email: data.user.email,
          uid: data.user._id,
        })
      );

      localStorage.setItem("token", data.token);
      history("/expense");
    } catch (err) {
      setError(err.message);
      setSuccess("");
    } finally {
      setLoading(false);
      emailRef.current.value = "";
      passwordRef.current.value = "";
    }
  };

  return (
    <Container className="d-flex justify-content-center align-items-center vh-100">
      <Card
        className="p-4 shadow-lg rounded-4"
        style={{ width: "350px", backgroundColor: "#ffffff" }}
      >
        <Card.Body>
          <Card.Title className="text-center mb-4 fw-bold fs-3 text-primary">
            Login
          </Card.Title>

          <Form onSubmit={handleSubmit}>
            <FloatingLabel label="Email address" className="mb-3">
              <Form.Control
                type="email"
                placeholder="Email"
                ref={emailRef}
                className="rounded-pill"
                required
              />
            </FloatingLabel>

            <FloatingLabel label="Password" className="mb-3">
              <Form.Control
                type="password"
                placeholder="Password"
                ref={passwordRef}
                className="rounded-pill"
                required
              />
            </FloatingLabel>

            {error && <p className="text-danger text-center">{error}</p>}
            {success && <p className="text-success text-center">{success}</p>}

            <div className="d-grid gap-2">
              <Button
                type="submit"
                variant="primary"
                className="rounded-pill py-2"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Spinner
                      as="span"
                      animation="border"
                      size="sm"
                      role="status"
                      aria-hidden="true"
                    />{" "}
                    Logging in...
                  </>
                ) : (
                  "Login"
                )}
              </Button>
            </div>
          </Form>
        </Card.Body>

        <Card.Footer className="text-center bg-white border-0 mt-2">
          Don't have an account?{" "}
          <Link
            to="/signup"
            style={{
              color: "#6c63ff",
              fontWeight: "600",
              textDecoration: "none",
            }}
          >
            Sign up
          </Link>
        </Card.Footer>
      </Card>
    </Container>
  );
};

export default LoginForm;
