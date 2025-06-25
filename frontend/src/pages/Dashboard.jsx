import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
  getUsers,
  getCurrentUser,
} from "../utils/api";
import { setCredentials } from "../redux/authSlice";
import { logout } from "../redux/authSlice";
import { Modal, Button } from "react-bootstrap";
import { setTasks } from "../redux/taskSlice";

function Dashboard() {
  const { tasks } = useSelector((state) => state.task);
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    status: "to do",
    assignedTo: "",
  });
  const [filter, setFilter] = useState("all");
  const { token, user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const [users, setUsers] = useState([]);
  const [editTask, setEditTask] = useState(null);
  const [editForm, setEditForm] = useState({
    title: "",
    description: "",
    status: "to do",
    assignedTo: "",
  });
  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const res = await getCurrentUser();
        dispatch(setCredentials({ user: res.data.user }));
      } catch (err) {
        console.error('Error fetching current user:', err);
      }
    };

    const fetchTasks = async () => {
      try {
        const res = await getTasks();
        dispatch(setTasks({ tasks: res.data }));
      } catch (err) {
        console.error('Error fetching tasks:', err);
      }
    };

    fetchCurrentUser();
    fetchTasks();
  }, []);

  // Separate useEffect for fetching users when user role is available
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await getUsers();
        setUsers(res.data);
      } catch (err) {
        console.error('Error fetching users:', err);
      }
    };

    if (user?.role === "manager") {
      fetchUsers();
    }
  }, [user]); // This runs when user data changes

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const res = await createTask(newTask);
      dispatch(setTasks({ tasks: [...tasks, res.data] }));
      setNewTask({
        title: "",
        description: "",
        status: "to do",
        assignedTo: "",
      });
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdate = async (id, updates) => {
    try {
      const res = await updateTask(id, updates);
      dispatch(setTasks({
        tasks: tasks.map((task) => (task._id === id ? res.data : task)),
      }));
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteTask(id);
      dispatch(setTasks({ tasks: tasks.filter((task) => task._id !== id) }));
    } catch (err) {
      console.error(err);
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    document.location.href = "/login";
  };

  const filteredTasks =
    filter === "all" ? tasks : tasks.filter((task) => task.status === filter);

  const openEditModal = (task) => {
    setEditTask(task);
    setEditForm({
      title: task.title,
      description: task.description,
      status: task.status,
      assignedTo: task.assignedTo?._id || "",
    });
  };

  const closeEditModal = () => {
    setEditTask(null);
  };

  const handleEditChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    await handleUpdate(editTask._id, editForm);
    closeEditModal();
  };

  return (
    <div
      className="container-fluid min-vh-100 p-0"
      style={{
        background: "linear-gradient(135deg, #f8ffae 0%, #43c6ac 100%)",
      }}
    >
      <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm px-4">
        <span className="navbar-brand fw-bold">TeamTask</span>
        <div className="ms-auto">
          <span className="me-3">
            {user?.username} ({user?.role})
          </span>
          <button
            className="btn btn-outline-danger btn-sm"
            onClick={handleLogout}
          >
            Logout
          </button>
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
                  <select
                    className="form-select d-inline-block w-auto"
                    onChange={(e) => setFilter(e.target.value)}
                  >
                    <option value="all">All</option>
                    <option value="to do">To Do</option>
                    <option value="in progress">In Progress</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
              </div>
              {user?.role === "manager" && (
                <form
                  className="row g-2 align-items-end mb-4"
                  onSubmit={handleCreate}
                >
                  <div className="col-md-3">
                    <input
                      type="text"
                      className="form-control"
                      value={newTask.title}
                      onChange={(e) =>
                        setNewTask({ ...newTask, title: e.target.value })
                      }
                      placeholder="Task Title"
                      required
                    />
                  </div>
                  <div className="col-md-4">
                    <input
                      type="text"
                      className="form-control"
                      value={newTask.description}
                      onChange={(e) =>
                        setNewTask({ ...newTask, description: e.target.value })
                      }
                      placeholder="Task Description"
                      required
                    />
                  </div>
                  <div className="col-md-3">
                    <select
                      className="form-select"
                      value={newTask.assignedTo}
                      onChange={(e) =>
                        setNewTask({ ...newTask, assignedTo: e.target.value })
                      }
                      required
                    >
                      <option value="">Select User</option>
                      {users
                        .filter((u) => u.role === "user")
                        .map((u) => (
                          <option key={u._id} value={u._id}>
                            {u.username}
                          </option>
                        ))}
                    </select>
                  </div>
                  <div className="col-md-2 d-grid">
                    <button type="submit" className="btn btn-success">
                      Create Task
                    </button>
                  </div>
                </form>
              )}
              <ul className="list-group">
                {filteredTasks.map((task) => (
                  <li
                    key={task._id}
                    className="list-group-item mb-3 rounded shadow-sm"
                  >
                    <div className="d-flex justify-content-between align-items-center">
                      <div>
                        <h5 className="mb-1 fw-bold">{task.title}</h5>
                        <p className="mb-1">{task.description}</p>
                        <span className="badge bg-secondary me-2">
                          Status: {task.status}
                        </span>
                        <span className="badge bg-info text-dark">
                          Assigned To: {task.assignedTo?.username}
                        </span>
                      </div>
                      <div className="d-flex align-items-center gap-2">
                        <select
                          className="form-select form-select-sm me-2"
                          value={task.status}
                          onChange={(e) =>
                            handleUpdate(task._id, { status: e.target.value })
                          }
                        >
                          <option value="to do">To Do</option>
                          <option value="in progress">In Progress</option>
                          <option value="completed">Completed</option>
                        </select>
                        {user?.role === "manager" && (
                          <>
                            <Button
                              variant="outline-primary"
                              size="sm"
                              onClick={() => openEditModal(task)}
                            >
                              Edit
                            </Button>
                            <button
                              className="btn btn-outline-danger btn-sm"
                              onClick={() => handleDelete(task._id)}
                            >
                              Delete
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Task Modal (Manager only) */}
      <Modal show={!!editTask} onHide={closeEditModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Edit Task</Modal.Title>
        </Modal.Header>
        <form onSubmit={handleEditSubmit} autoComplete="off">
          <Modal.Body>
            <div className="mb-3">
              <label className="form-label">Title</label>
              <input
                type="text"
                className="form-control"
                name="title"
                value={editForm.title}
                onChange={handleEditChange}
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Description</label>
              <input
                type="text"
                className="form-control"
                name="description"
                value={editForm.description}
                onChange={handleEditChange}
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Assigned User</label>
              <select
                className="form-select"
                name="assignedTo"
                value={editForm.assignedTo}
                onChange={handleEditChange}
                required
              >
                <option value="">Select User</option>
                {users
                  .filter((u) => u.role === "user")
                  .map((u) => (
                    <option key={u._id} value={u._id}>
                      {u.username}
                    </option>
                  ))}
              </select>
            </div>
            <div className="mb-3">
              <label className="form-label">Status</label>
              <select
                className="form-select"
                name="status"
                value={editForm.status}
                onChange={handleEditChange}
                required
              >
                <option value="to do">To Do</option>
                <option value="in progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={closeEditModal} type="button">
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              Save Changes
            </Button>
          </Modal.Footer>
        </form>
      </Modal>
    </div>
  );
}

export default Dashboard;
