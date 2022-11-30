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
                                    <Form.Group controlId="login">
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
                                    <Form.Group controlId="login">
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
                            <Row  className="justify-content-center">
                                <Col xs={"auto"}>
                                        <Button type="submit">Login</Button>
                                </Col>
                                <Col xs={"auto"} className="flex-column">
                                        <Stack>
                                            <Button  type="button" variant={"outline-primary"}>Register</Button>
                                            <p className="fs-6">Don't Have an Account?</p>
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

{/* <div className="login">
        <div className="login__container">
          <input
            type="text"
            className="login__textBox"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="E-mail Address"
          />
          <input
            type="password"
            className="login__textBox"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
          />
          <button
            className="login__btn"
            onClick={() => logInWithEmailAndPassword(email, password)}
          >
            Login
          </button>
          <button className="login__btn login__google" onClick={signInWithGoogle}>
            Login with Google
          </button>
          <div>
            <Link to="/reset">Forgot Password</Link>
          </div>
          <div>
            Don't have an account? <Link to="/register">Register</Link> now.
          </div>
        </div>
      </div> */}