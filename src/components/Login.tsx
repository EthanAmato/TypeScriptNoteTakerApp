import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth, logInWithEmailAndPassword, signInWithGoogle } from "../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { Button, Col, Container, Form, Row, Stack } from "react-bootstrap";


export function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [user, loading, error] = useAuthState(auth);
    const navigate = useNavigate();
    useEffect(() => {
        if (loading) {
            // maybe trigger a loading screen
            return;
        }
        if (user) navigate("/dashboard");
    }, [user, loading]);
    return (
        <>
            <Container fluid>
                <Row className="mb-4 text-center">
                    <h1>Login</h1>
                </Row>
                <Row className="d-flex justify-content-center">
                    <Form>
                        <Stack gap={4}>
                            <Row className="justify-content-center">
                                <Col lg={8}>
                                    <Form.Group controlId="email">
                                        <Form.Label>Email</Form.Label>
                                        <Form.Control type="email"
                                            // helps with setting up queries for filtering later
                                            onChange={e => setEmail(e.target.value)}
                                        />
                                    </Form.Group>
                                </Col>
                            </Row>
                            <Row className="justify-content-center">
                                <Col lg={8}>
                                    <Form.Group controlId="password">
                                        <Form.Label>
                                            Password
                                        </Form.Label>
                                        <Form.Control type="password"
                                            // helps with setting up queries for filtering later
                                            onChange={e => setPassword(e.target.value)}
                                        />
                                    </Form.Group>
                                </Col>
                            </Row>
                            <Row className="justify-content-center">
                                <Col lg={8} className="d-flex justify-content-center ">
                                    <Button className="h-100 google" 
                                            variant="outline-dark"
                                            onClick={signInWithGoogle}>
                                        <img    width="20px" 
                                                style={{marginBottom:"3px", marginRight:"5px"}}
                                                alt="Google Sign-in"
                                                src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Google_%22G%22_Logo.svg/512px-Google_%22G%22_Logo.svg.png"
                                        />Login with Google</Button>
                                </Col>
                            </Row>
                            <Row className="justify-content-center">
                                <Col xs={"auto"} className="flex-column">
                                    <Button onClick={() => logInWithEmailAndPassword(email, password)}
                                        className="my-4"
                                        type="submit">Login</Button>
                                </Col>
                                <Col xs={"auto"} className="flex-column">
                                    <Stack>
                                        <p className="fs-6 mb-0">Don't Have an Account?</p>
                                        <Button onClick={() => navigate("/register")} 
                                                type="button" 
                                                variant={"outline-primary"}>Register</Button>
                                    </Stack>
                                </Col>
                            </Row>
                        </Stack>
                    </Form>
                </Row>
            </Container>
        </>
    );
}
 