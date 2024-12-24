//App.js
import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Link, Routes } from 'react-router-dom';
import TaskList from './TaskList';
import DragDropPage from './DragDropPage'; // Импортируем DragDropPage
import './App.css';

function App() {
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState('all');
  const [taskText, setTaskText] = useState('');

  const addTask = () => {
    if (taskText.trim()) {
      setTasks([...tasks, { id: Date.now(), text: taskText, completed: false, column: 1 }]);
      setTaskText('');
    }
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  const toggleTaskStatus = (id) => {
    setTasks(tasks.map((task) =>
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const filteredTasks = tasks.filter((task) => {
    if (filter === 'completed') return task.completed;
    if (filter === 'incomplete') return !task.completed;
    return true;
  });

  return (
    <Router>
      <div className="app-container">
        <h1>To-Do List</h1>
        <div className="task-input">
          <input
            type="text"
            value={taskText}
            onChange={(e) => setTaskText(e.target.value)}
            placeholder="Введите новую задачу"
          />
          <button onClick={addTask}>Добавить</button>
        </div>
        <div className="filters">
          <button onClick={() => setFilter('all')}>Все</button>
          <button onClick={() => setFilter('completed')}>Выполненные</button>
          <button onClick={() => setFilter('incomplete')}>Невыполненные</button>
        </div>
        <Routes>
          <Route path="/" element={
            <>
              <TaskList tasks={filteredTasks} onDelete={deleteTask} onToggle={toggleTaskStatus} />
              <Link to="/dragdrop">Перейти на страницу перетаскивания</Link>
            </>
          } />
          <Route path="/dragdrop" element={<DragDropPage tasks={tasks} setTasks={setTasks} />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
