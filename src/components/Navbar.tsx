import { useEffect, useState } from "react";
import { Container, Nav, Navbar as BootstrapNavbar, NavDropdown } from "react-bootstrap";
import { useAuthState } from "react-firebase-hooks/auth";
import { Link, useNavigate } from 'react-router-dom';
import { getUserNotes, auth, logout } from "../firebase";


export function Navbar() {
    const navigate = useNavigate();
    const [user, loading, error] = useAuthState(auth);
    const [loginButton, setLoginButton]:any = useState();
    useEffect(() => {
        if(!user) {
            setLoginButton(<Nav.Link onClick={() => { navigate("/login") }}>Login</Nav.Link>)
        } else{ 
            setLoginButton(<Nav.Link onClick={() => logout()}>Logout</Nav.Link>)
        }

    }, [user])


    return (
        <BootstrapNavbar bg="light" expand="lg">
            <Container>
                <BootstrapNavbar.Brand onClick={() => { navigate("/") }}><Nav.Link>NoteTaker</Nav.Link></BootstrapNavbar.Brand>
                <BootstrapNavbar.Toggle aria-controls="basic-BootstrapNavbar-nav" />
                <BootstrapNavbar.Collapse id="basic-BootstrapNavbar-nav">
                    <Nav className="me-auto">
                        <Nav.Link onClick={() => { navigate("/") }}>Home</Nav.Link>
                    </Nav>
                    <Nav>
                        {loginButton}
                    </Nav>
                </BootstrapNavbar.Collapse>
            </Container>
        </BootstrapNavbar>
    );
}
