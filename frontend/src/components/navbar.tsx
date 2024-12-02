import { Navbar, Nav, Container } from 'react-bootstrap';
import { Link } from 'react-router-dom';

export default function CostumeNavbar(){
  return (
    <Navbar bg="dark" variant="dark" expand="lg">
      <Container>
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/">Home</Nav.Link>
            <Nav.Link as={Link} to="/telephoneList">Telephones List</Nav.Link>
            <Nav.Link as={Link} to="/telephoneModification">Telephones Modification</Nav.Link>
            <Nav.Link as={Link} to="/telephoneSearch">Telephones Search</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

