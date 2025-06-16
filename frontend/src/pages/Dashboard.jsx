import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getTasks, createTask, updateTask, deleteTask,getUsers} from '../utils/api';
import { logout } from '../redux/authSlice';

function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({ title: '', description: '', status: 'à faire', assignedTo: '' });
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
      setNewTask({ title: '', description: '', status: 'à faire', assignedTo: '' });
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
    <div>
      <h2>Dashboard</h2>
      <button onClick={handleLogout}>Logout</button>
      <h1>user name : {user?.username}</h1>
      <h1>user role : {user?.role}</h1>
      {user?.role === 'manager' && (
        <form onSubmit={handleCreate}>
          <input
            type="text"
            value={newTask.title}
            onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
            placeholder="Task Title"
          />
          <input
            type="text"
            value={newTask.description}
            onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
            placeholder="Task Description"
          />
       <select
  value={newTask.assignedTo}
  onChange={(e) => setNewTask({ ...newTask, assignedTo: e.target.value })}
>
  <option value="">Select User</option>
  {users.map((u) => (
    <option key={u._id} value={u._id}>
      {u.username} ({u.role})
    </option>
  ))}
</select>
          <button type="submit">Create Task</button>
        </form>
      )}
      <div>
        <label>Filter by Status: </label>
        <select onChange={(e) => setFilter(e.target.value)}>
          <option value="all">All</option>
          <option value="à faire">To Do</option>
          <option value="en cours">In Progress</option>
          <option value="terminée">Completed</option>
        </select>
      </div>
      <ul>
        {filteredTasks.map((task) => (
          <li key={task._id}>
            <h3>{task.title}</h3>
            <p>{task.description}</p>
            <p>Status: {task.status}</p>
            <p>Assigned To: {task.assignedTo?.username}</p>
            {(task.assignedTo?._id === user?.id || user?.role === 'manager') && (
              <>
                <select
                  value={task.status}
                  onChange={(e) => handleUpdate(task._id, { status: e.target.value })}
                >
                  <option value="à faire">To Do</option>
                  <option value="en cours">In Progress</option>
                  <option value="terminée">Completed</option>
                </select>
                <button onClick={() => handleDelete(task._id)}>Delete</button>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Dashboard;