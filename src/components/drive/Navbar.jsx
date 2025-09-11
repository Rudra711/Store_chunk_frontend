import React from "react";
import { Navbar, Nav, Container, NavDropdown } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useUser } from "../../lib/context/user"; // update path if needed

export default function NavbarComponent() {
  const { user, logout } = useUser();

  const avatarUrl =
    user?.prefs?.avatar ||
    "https://ui-avatars.com/api/?name=" + encodeURIComponent(user?.name || user?.email || "U");

  return (
    <Navbar bg="light" expand="sm">
      <Container>
        <Navbar.Brand as={Link} to="/" style={{ marginLeft: "-40px" }}>Store_chunk</Navbar.Brand>

        <Nav className="ms-auto">
          {user ? (
            <NavDropdown
              title={
                <span>
                  <img
                    src={avatarUrl}
                    alt="avatar"
                    style={{
                      width: "30px",
                      height: "30px",
                      borderRadius: "50%",
                      marginRight: "8px",
                      objectFit: "cover",
                    }}
                  />
                  {user.email}
                </span>
              }
              align="end"
              id="user-nav-dropdown"
            >
              <NavDropdown.Item as={Link} to="/user">Profile</NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item onClick={logout}>Logout</NavDropdown.Item>
            </NavDropdown>
          ) : (
            <>
              <Nav.Link as={Link} to="/login">Login</Nav.Link>
              <Nav.Link as={Link} to="/signup">Sign Up</Nav.Link>
            </>
          )}
        </Nav>
      </Container>
    </Navbar>
  );
}
