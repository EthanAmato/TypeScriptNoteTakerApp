import { useEffect, useState } from "react";
import { Button, Col, Container, Form, Row, Stack } from "react-bootstrap";
import { useAuthState } from "react-firebase-hooks/auth";
import { Link, useNavigate } from "react-router-dom";
import {
    auth,
    registerWithEmailAndPassword,
    sendPasswordReset,
    signInWithGoogle,
} from "../firebase";
export function ResetPassword() {
    const [email, setEmail] = useState("");
    const [user, loading, error] = useAuthState(auth);
    const navigate = useNavigate();

    useEffect(() => {
        if (loading) return;
        if (user) navigate("/");
    }, [user, loading]);
    return (
        <>
            <Container fluid>
                <Row className="mb-4 text-center">
                    <h1>Reset Password</h1>
                </Row>
                <Row className="d-flex justify-content-center">
                    <Form>
                        <Stack gap={4}>
                            
                            <Row className="justify-content-center">
                                <Col lg={8}>
                                    <Form.Group controlId="email">
                                        <Form.Label>Email</Form.Label>
                                        <Form.Control type="email"
                                            value={email}
                                            onChange={e => setEmail(e.target.value)}
                                        />
                                    </Form.Group>
                                </Col>
                            </Row>
                            <Row className="justify-content-center mt-2">
                                <Col xs={"auto"} className="flex-column">
                                    <Button onClick={() => sendPasswordReset(email)}
                                        className="my-4"
                                        type="button">Send Reset Request</Button>
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