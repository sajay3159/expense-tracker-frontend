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

const SignupForm = () => {
  const nameRef = useRef();
  const emailRef = useRef();
  const passwordRef = useRef();
  const confirmPasswordRef = useRef();
  const history = useNavigate();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const name = nameRef.current.value;
    const email = emailRef.current.value;
    const password = passwordRef.current.value;
    const confirmPassword = confirmPasswordRef.current.value;

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(
        "https://expense-tracker-backend-ut31.onrender.com/api/auth/signup",
        {
          method: "POST",
          body: JSON.stringify({ name, email, password }),
          headers: { "Content-Type": "application/json" },
        }
      );
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Signup failed");

      setSuccess("Signup successful!");
      setError("");
      localStorage.setItem("token", data.token);
      history("/login");
    } catch (err) {
      setError(err.message);
      setSuccess("");
    } finally {
      setLoading(false);
      nameRef.current.value = "";
      emailRef.current.value = "";
      passwordRef.current.value = "";
      confirmPasswordRef.current.value = "";
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
            Sign Up
          </Card.Title>

          <Form onSubmit={handleSubmit}>
            <FloatingLabel label="Name" className="mb-3">
              <Form.Control
                type="text"
                placeholder="Name"
                ref={nameRef}
                className="rounded-pill"
                required
              />
            </FloatingLabel>

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

            <FloatingLabel label="Confirm Password" className="mb-3">
              <Form.Control
                type="password"
                placeholder="Confirm Password"
                ref={confirmPasswordRef}
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
                    />
                    Signing up...
                  </>
                ) : (
                  "Sign Up"
                )}
              </Button>
            </div>
          </Form>
        </Card.Body>

        <Card.Footer className="text-center bg-white border-0 mt-2">
          Have an account?{" "}
          <Link
            to="/login"
            style={{
              color: "#6c63ff",
              fontWeight: "600",
              textDecoration: "none",
            }}
          >
            Login
          </Link>
        </Card.Footer>
      </Card>
    </Container>
  );
};

export default SignupForm;
