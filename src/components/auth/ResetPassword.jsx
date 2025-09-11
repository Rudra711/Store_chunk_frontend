import React, { useRef, useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Form, Button, Card, Alert, Spinner } from "react-bootstrap";
import CenteredContainer from "./CenteredContainer";

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const passwordRef = useRef();
  const passwordConfirmRef = useRef();

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const userId = searchParams.get("userId");
  const token = searchParams.get("token");
  const API_BASE = import.meta.env.VITE_API_URL;
  useEffect(() => {
    if (!userId || !token) {
      setError("Invalid or missing password reset link.");
    }
  }, [userId, token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (passwordRef.current.value !== passwordConfirmRef.current.value) {
      return setError("Passwords do not match");
    }

    if (!userId || !token) return setError("Invalid reset link.");

    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/api/auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          token,
          password: passwordRef.current.value,
        }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || data.message || "Failed to reset password");

      setSuccess("Password updated successfully! Redirecting to login...");
      setTimeout(() => navigate("/login"), 3000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <CenteredContainer>
      <Card>
        <Card.Body>
          <h2 className="text-center mb-4">Reset Password</h2>
          {error && <Alert variant="danger">{error}</Alert>}
          {success && <Alert variant="success">{success}</Alert>}

          {!success && (
            <Form onSubmit={handleSubmit}>
              <Form.Group id="password" className="mb-3">
                <Form.Label>New Password</Form.Label>
                <Form.Control type="password" ref={passwordRef} required minLength={6} />
              </Form.Group>

              <Form.Group id="password-confirm" className="mb-3">
                <Form.Label>Confirm Password</Form.Label>
                <Form.Control type="password" ref={passwordConfirmRef} required minLength={6} />
              </Form.Group>

              <Button disabled={loading || !!error} className="w-100" type="submit">
                {loading ? <Spinner animation="border" size="sm" /> : "Reset Password"}
              </Button>
            </Form>
          )}
        </Card.Body>
      </Card>
    </CenteredContainer>
  );
}
