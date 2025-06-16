import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getTasks, createTask, updateTask, deleteTask,getUsers} from '../utils/api';
import { logout } from '../redux/authSlice';

function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({ title: '', description: '', status: 'to do', assignedTo: '' });
  const [filter, setFilter] = useState('all');
  const { token, user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);


useEffect(() => {
  const fetchTasks = async () => {
    try {
      const res = await getTasks();
      setTasks(res.data);
    } catch (err) {
      console.error(err);
    }
  };
  const fetchUsers = async () => {
    try {
      const res = await getUsers();
      setUsers(res.data);
    } catch (err) {
      console.error(err);
    }
  };
  fetchTasks();
  if (user?.role === 'manager') {
    fetchUsers();
  }
}, [user?.role]);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const res = await createTask(newTask);
      setTasks([...tasks, res.data]);
      setNewTask({ title: '', description: '', status: 'to do', assignedTo: '' });
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdate = async (id, updates) => {
    try {
      const res = await updateTask(id, updates);
      setTasks(tasks.map((task) => (task._id === id ? res.data : task)));
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteTask(id);
      setTasks(tasks.filter((task) => task._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const filteredTasks = filter === 'all' ? tasks : tasks.filter((task) => task.status === filter);

  return (
    <div className="container-fluid min-vh-100 p-0" style={{ background: 'linear-gradient(135deg, #f8ffae 0%, #43c6ac 100%)' }}>
      <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm px-4">
        <span className="navbar-brand fw-bold">TeamTask</span>
        <div className="ms-auto">
          <span className="me-3">{user?.username} ({user?.role})</span>
          <button className="btn btn-outline-danger btn-sm" onClick={handleLogout}>Logout</button>
        </div>
      </nav>
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-lg-8">
            <div className="card shadow border-0 p-4">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="fw-bold mb-0">Dashboard</h2>
                <div>
                  <label className="me-2">Filter by Status:</label>
                  <select className="form-select d-inline-block w-auto" onChange={(e) => setFilter(e.target.value)}>
                    <option value="all">All</option>
                    <option value="to do">To Do</option>
                    <option value="in progress">In Progress</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
              </div>
              {user?.role === 'manager' && (
                <form className="row g-2 align-items-end mb-4" onSubmit={handleCreate}>
                  <div className="col-md-3">
                    <input
                      type="text"
                      className="form-control"
                      value={newTask.title}
                      onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                      placeholder="Task Title"
                      required
                    />
                  </div>
                  <div className="col-md-4">
                    <input
                      type="text"
                      className="form-control"
                      value={newTask.description}
                      onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                      placeholder="Task Description"
                      required
                    />
                  </div>
                  <div className="col-md-3">
                    <select
                      className="form-select"
                      value={newTask.assignedTo}
                      onChange={(e) => setNewTask({ ...newTask, assignedTo: e.target.value })}
                      required
                    >
                      <option value="">Select User</option>
                      {users.filter((u) => u.role === 'user').map((u) => (
                        <option key={u._id} value={u._id}>
                          {u.username}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="col-md-2 d-grid">
                    <button type="submit" className="btn btn-success">Create Task</button>
                  </div>
                </form>
              )}
              <ul className="list-group">
                {filteredTasks.map((task) => (
                  <li key={task._id} className="list-group-item mb-3 rounded shadow-sm">
                    <div className="d-flex justify-content-between align-items-center">
                      <div>
                        <h5 className="mb-1 fw-bold">{task.title}</h5>
                        <p className="mb-1">{task.description}</p>
                        <span className="badge bg-secondary me-2">Status: {task.status}</span>
                        <span className="badge bg-info text-dark">Assigned To: {task.assignedTo?.username}</span>
                      </div>
                      {(task.assignedTo?._id === user?.id || user?.role === 'manager') && (
                        <div className="d-flex align-items-center gap-2">
                          <select
                            className="form-select form-select-sm me-2"
                            value={task.status}
                            onChange={(e) => handleUpdate(task._id, { status: e.target.value })}
                          >
                            <option value="to do">To Do</option>
                            <option value="in progress">In Progress</option>
                            <option value="completed">Completed</option>
                          </select>
                          <button className="btn btn-outline-danger btn-sm" onClick={() => handleDelete(task._id)}>Delete</button>
                        </div>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;