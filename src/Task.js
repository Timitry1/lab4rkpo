// Task.js
import React from 'react';

function Task({ task, onDelete, onToggle }) {
  return (
    <div className={`task ${task.completed ? 'completed' : ''}`}>
      <span onClick={() => onToggle(task.id)}>
        {task.text}
      </span>
      <button onClick={() => onDelete(task.id)}>Удалить</button>
    </div>
  );
}

export default Task;