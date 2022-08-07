import React from "react";
import { Nav, Navbar, Container, Button, NavDropdown } from "react-bootstrap";
import { useLogoutUserMutation } from "../services/appApi";
import { useSelector } from "react-redux";
import { LinkContainer } from "react-router-bootstrap";
import logo from "../assets/logo.png";

function Navigation() {
  const user = useSelector((state) => state.user);
  const [logoutUser] = useLogoutUserMutation();

  async function handleLogout(e) {
    e.preventDefault();
    await logoutUser(user);
    // redirect to home page
    window.location.replace("/");
  }

  return (
    <Navbar expand="lg">
      <Container>
        <LinkContainer to="/">
          <Navbar.Brand>
            <h3>JEWEPE ACADEMY</h3>
          </Navbar.Brand>
        </LinkContainer>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            {!user && (
              <LinkContainer to="/login">
                <Nav.Link variant="primary">Login</Nav.Link>
              </LinkContainer>
            )}
            {user && (
              <LinkContainer to="/register">
                <Nav.Link>Daftar Kursus</Nav.Link>
              </LinkContainer>
            )}

            {user &&  (
              <NavDropdown
                title={
                  <>
                    <img
                      src={user.picture}
                      style={{
                        width: 30,
                        height: 30,
                        marginRight: 10,
                        objectFit: "cover",
                        borderRadius: "50%",
                      }}
                    />
                    {user.name}
                  </>
                }
                id="basic-nav-dropdown"
              >
                {user.isAdmin && (
                  <>
                    <LinkContainer to="/admin">
                      <NavDropdown.Item>Dashboard</NavDropdown.Item>
                    </LinkContainer>
                  </>
                )}
                {user && !user.isBanned && (
                  <>
                    <LinkContainer to="/register">
                      <NavDropdown.Item>Daftar Kursus</NavDropdown.Item>
                    </LinkContainer>
                  </>
                )}
                <NavDropdown.Item>
                  <NavDropdown.Divider />
                {user && !user.isBanned && 
                  <Button variant="danger" onClick={handleLogout}>
                    Logout
                  </Button>
}
                </NavDropdown.Item>
              </NavDropdown>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Navigation;
