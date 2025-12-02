import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { NavLink, useNavigate } from "react-router-dom";
import { Button } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { authActions } from "../store/authSlice";

function Header() {
  const dispatch = useDispatch();
  const history = useNavigate();
  const isLoggedIn = useSelector((state) => !!state.auth.token);
  const logoutHandler = () => {
    dispatch(authActions.logout());
    history.replace("/login");
  };
  return (
    <>
      <Navbar>
        <Container>
          <Navbar.Brand href="#home" className="fs-3">
            Expense Tracker
          </Navbar.Brand>
          <Nav className="me-auto">
            {isLoggedIn && (
              <Nav.Link
                as={NavLink}
                to="/expense"
                className={({ isActive }) => (isActive ? "active" : "")}
              >
                Expense
              </Nav.Link>
            )}
            {isLoggedIn && (
              <Nav.Link
                as={NavLink}
                to="/summary"
                className={({ isActive }) => (isActive ? "active" : "")}
              >
                Expense Summary
              </Nav.Link>
            )}
          </Nav>
          {isLoggedIn && (
            <Nav>
              <Button
                variant="outline-danger"
                onClick={logoutHandler}
                className="ms-2"
              >
                Logout
              </Button>
            </Nav>
          )}
        </Container>
      </Navbar>
    </>
  );
}

export default Header;
