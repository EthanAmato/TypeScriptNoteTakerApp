import { useEffect, useState } from "react";
import { Button, Col, Container, Form, Row, Stack } from "react-bootstrap";
import { useAuthState } from "react-firebase-hooks/auth";
import { Link, useNavigate } from "react-router-dom";
import {
    auth,
    registerWithEmailAndPassword,
    signInWithGoogle,
} from "../firebase";
export function Register() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [user, loading, error] = useAuthState(auth);
    const navigate = useNavigate();
    const register = () => {
        if (!name) alert("Please enter name");
        registerWithEmailAndPassword(name, email, password);
    };
    useEffect(() => {
        if (loading) return;
        if (user) navigate("/");
    }, [user, loading]);
    return (
        <>
            <Container fluid>
                <Row className="mb-4 text-center">
                    <h1>Register</h1>
                </Row>
                <Row className="d-flex justify-content-center">
                    <Form>
                        <Stack gap={4}>
                            <Row className="justify-content-center">
                                <Col lg={8}>
                                    <Form.Group controlId="name">
                                        <Form.Label>Name</Form.Label>
                                        <Form.Control required type="text"
                                            value={name}
                                            onChange={e => setName(e.target.value)}
                                        />
                                    </Form.Group>
                                </Col>
                            </Row>
                            <Row className="justify-content-center">
                                <Col lg={8}>
                                    <Form.Group controlId="email">
                                        <Form.Label>Email</Form.Label>
                                        <Form.Control required type="email"
                                            value={email}
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
                                        <Form.Control required type="password"
                                            value={password}
                                            onChange={e => setPassword(e.target.value)}
                                        />
                                    </Form.Group>
                                </Col>
                            </Row>
                            <Row className="justify-content-center mt-4">
                                <Col lg={8} className="d-flex justify-content-center ">
                                    <Button className="h-100 google" 
                                            variant="outline-dark"
                                            type="button"
                                            onClick={signInWithGoogle}>
                                        <img    width="20px" 
                                                style={{marginBottom:"3px", marginRight:"5px"}}
                                                alt="Google Sign-in"
                                                src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Google_%22G%22_Logo.svg/512px-Google_%22G%22_Logo.svg.png"
                                        />Register with Google</Button>
                                </Col>
                            </Row>
                            <Row className="justify-content-center mt-4">
                                <Col xs={"auto"} className="flex-column">
                                    <Button onClick={register}
                                        className="my-4"
                                        type="button">Register</Button>
                                </Col>
                                <Col xs={"auto"} className="flex-column">
                                    <Stack>
                                        <p className="fs-6 mb-0">Already Have an Account?</p>
                                        <Button onClick={() => navigate("/login")}
                                            type="button"
                                            variant={"outline-primary"}>Go to Login</Button>
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