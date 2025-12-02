import { useRef, useState } from "react";
import { Button, Container, Form, Spinner } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const ForgetForm = () => {
  const history = useNavigate();
  const emailInputRef = useRef();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const enteredEmail = emailInputRef.current.value;
    const API_KEY = "AIzaSyDpWVsvC9evJbXOQnZHUyAxGQIOfLTaZOs";

    try {
      const res = await fetch(
        `https://identitytoolkit.googleapis.com/v1/accounts:sendOobCode?key=${API_KEY}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            requestType: "PASSWORD_RESET",
            email: enteredEmail,
          }),
        }
      );
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error?.message || "Failed to send reset email.");
      }

      alert("Password reset link sent to your email.");
      history("/login");
    } catch (err) {
      alert("Error: " + err.message);
    } finally {
      setLoading(false);
      emailInputRef.current.value = "";
    }
  };

  return (
    <Container
      className="d-flex justify-content-center align-items-center"
      style={{ minHeight: "60vh" }}
    >
      <Form
        onSubmit={handleSubmit}
        style={{ width: "100%", maxWidth: "500px" }}
      >
        <Form.Group className="mb-3 text-center">
          <Form.Label>
            Enter the email with which you have registered
          </Form.Label>
          <Form.Control
            type="email"
            placeholder="Email"
            ref={emailInputRef}
            required
            disabled={loading}
          />
        </Form.Group>

        <div className="text-center">
          <Button type="submit" className="w-50" disabled={loading}>
            {loading ? (
              <>
                <Spinner
                  as="span"
                  animation="border"
                  size="sm"
                  role="status"
                  aria-hidden="true"
                />
                Sending...
              </>
            ) : (
              "Send Link"
            )}
          </Button>
        </div>
      </Form>
    </Container>
  );
};

export default ForgetForm;
