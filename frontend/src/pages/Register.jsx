import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setCredentials } from '../redux/authSlice';
import { register } from '../utils/api';

function Register() {
  const [formData, setFormData] = useState({ username: '', password: '', role: 'user' });
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await register(formData);
      dispatch(setCredentials({ token: res.data.token, user: res.data.user }));
      navigate('/dashboard');
    } catch (err) {
      console.error(err);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="container-fluid d-flex align-items-center justify-content-center min-vh-100" style={{ background: 'linear-gradient(135deg, #f8ffae 0%, #43c6ac 100%)' }}>
      <div className="card shadow p-4 border-0" style={{ maxWidth: '450px', width: '100%' }}>
        <div className="text-center mb-4">
          <img src="/vite.svg" alt="Logo" width="60" className="mb-2" />
          <h3 className="fw-bold">Create an Account</h3>
        </div>
        <form onSubmit={handleSubmit} autoComplete="off">
          <div className="mb-3">
            <label htmlFor="username" className="form-label">Username</label>
            <input
              type="text"
              className="form-control form-control-lg"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Enter your username"
              required
            />
          </div>

          <div className="mb-3">
            <label htmlFor="password" className="form-label">Password</label>
            <input
              type="password"
              className="form-control form-control-lg"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="role" className="form-label">Select Role</label>
            <select
              className="form-select form-select-lg"
              id="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
            >
              <option value="user">User</option>
              <option value="manager">Manager</option>
            </select>
          </div>

          <div className="d-grid gap-2">
            <button type="submit" className="btn btn-success btn-lg">Register</button>
          </div>
        </form>

        <div className="mt-4 text-center">
          <span className="small text-muted">
            Already have an account? <a href="/login" className="text-decoration-none">Login here</a>
          </span>
        </div>
      </div>
    </div>
  );
}

export default Register;
