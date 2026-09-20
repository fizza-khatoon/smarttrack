import { useState, useEffect } from 'react';
import './App.css';

function Dashboard({ onLogout }) {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');
  const [deadline, setDeadline] = useState('');
  const [priority, setPriority] = useState('medium');

  useEffect(() => {
    const fetchTasks = async () => {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/tasks', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      setTasks(data.tasks);
    };
    fetchTasks();
  }, []);

  const handleAddTask = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    const response = await fetch('http://localhost:5000/api/tasks', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ title, deadline, priority })
    });

    const data = await response.json();
    setTasks([...tasks, data.task]);
    setTitle('');
    setDeadline('');
  };

  const handleDeleteTask = async (taskId) => {
    const token = localStorage.getItem('token');

    await fetch(`http://localhost:5000/api/tasks/${taskId}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });

    setTasks(tasks.filter((task) => task._id !== taskId));
  };

  const handleCompleteTask = async (taskId) => {
    const token = localStorage.getItem('token');

    const response = await fetch(`https://smarttrack-backend-5pfj.onrender.com/api/tasks/${taskId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ status: 'completed' })
    });

    const data = await response.json();

    setTasks(tasks.map((task) =>
      task._id === taskId ? data.task : task
    ));
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    onLogout();
  };

  return (
    <div className="container">
      <h1>My Tasks</h1>
      <button onClick={handleLogout}>Logout</button>

      <form onSubmit={handleAddTask}>
        <div className="form-group">
          <input
            type="text"
            placeholder="Task title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div className="form-group">
          <input
            type="date"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
          />
        </div>
        <div className="form-group">
          <select value={priority} onChange={(e) => setPriority(e.target.value)}>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>
        <button type="submit">Add Task</button>
      </form>

      {tasks.map((task) => (
        <div key={task._id} className="task-card">
          <h3>{task.title}</h3>
          <p>{task.status}</p>
          <div className="task-buttons">
            <button onClick={() => handleCompleteTask(task._id)}>Mark Complete</button>
            <button onClick={() => handleDeleteTask(task._id)}>Delete</button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default Dashboard;