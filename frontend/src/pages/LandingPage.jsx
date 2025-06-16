import React from 'react';

const LandingPage = () => {
  return (
    <div className="d-flex flex-column justify-content-center align-items-center min-vh-100" style={{ background: 'linear-gradient(135deg, #f8ffae 0%, #43c6ac 100%)' }}>
      <div className="card shadow p-5 border-0 text-center" style={{ maxWidth: 420 }}>
        <img src="src/assets/logo.png" alt="TeamTask Logo" width="160" className="mb-4 mx-auto" />
        <h1 className="fw-bold mb-3">Welcome to TeamTask</h1>
        <p className="text-muted mb-4">Collaborate, manage, and track your team's tasks efficiently with our modern task management platform.</p>
        <div className="d-flex justify-content-center gap-3">
          <a href="/login" className="btn btn-primary btn-lg">Login</a>
          <a href="/register" className="btn btn-outline-primary btn-lg">Register</a>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;