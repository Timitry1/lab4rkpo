import React, { useState } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Link } from 'react-router-dom'; // Импортируем Link для перехода
import './DragDropPage.css'; // Подключаем стили

const ItemType = 'TASK';

function DraggableTask({ task, index, moveTask, columnId, removeTask }) {
  const [{ isDragging }, drag] = useDrag({
    type: ItemType,
    item: { index, columnId },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const opacity = isDragging ? 0.5 : 1;

  return (
    <div
      ref={drag}
      className="task-item"
      style={{ opacity }}
    >
      {task.text}
      <button onClick={() => removeTask(columnId, index)}>Удалить</button>
    </div>
  );
}

function DroppableColumn({ column, columnId, moveTask, removeTask }) {
  const [, drop] = useDrop({
    accept: ItemType,
    hover(item) {
      if (item.columnId !== columnId) {
        moveTask(item.columnId, columnId, item.index, column.tasks.length);
        item.columnId = columnId;
      }
    },
  });

  return (
    <div ref={drop} className="column">
      <h2>{column.name}</h2>
      {column.tasks.map((task, itemIndex) => (
        <DraggableTask
          key={task.id}
          task={task}
          index={itemIndex}
          moveTask={moveTask}
          columnId={columnId}
          removeTask={removeTask}
        />
      ))}
    </div>
  );
}

function DragDropPage({ tasks, setTasks }) {
  const [columns, setColumns] = useState({
    1: {
      name: 'To Do',
      tasks: tasks.filter(task => task.column === 1),
    },
    2: {
      name: 'In Progress',
      tasks: tasks.filter(task => task.column === 2),
    },
    3: {
      name: 'Done',
      tasks: tasks.filter(task => task.column === 3),
    },
    4: {
      name: 'Blocked',
      tasks: tasks.filter(task => task.column === 4),
    },
  });

  const moveTask = (fromColumnId, toColumnId, dragIndex, dropIndex) => {
    const newColumns = { ...columns };
    const fromColumn = newColumns[fromColumnId];
    const toColumn = newColumns[toColumnId];

    const [movedTask] = fromColumn.tasks.splice(dragIndex, 1);
    toColumn.tasks.splice(dropIndex, 0, movedTask);

    setColumns(newColumns);
    // Обновляем состояние задач
    const newTasks = [...tasks];
    const movedTaskIndex = newTasks.findIndex(task => task.id === movedTask.id);
    newTasks[movedTaskIndex].column = toColumnId;
    setTasks(newTasks);
  };

  const removeTask = (columnId, cardIndex) => {
    // Создаем копию колонок для предотвращения мутации исходного состояния
    const newColumns = { ...columns };
  
    // Проверка, существует ли колонка и задача в указанной колонке
    if (newColumns[columnId] && newColumns[columnId].tasks[cardIndex]) {
      // Получаем задачу, которую удаляем
      const taskToRemove = newColumns[columnId].tasks[cardIndex];
  
      // Удаляем задачу из списка задач в колонке
      newColumns[columnId].tasks.splice(cardIndex, 1);
  
      // Обновляем состояние с новыми данными
      setColumns(newColumns);
  
      // Удаляем задачу из списка всех задач
      const newTasks = tasks.filter(task => task.id !== taskToRemove.id);
      setTasks(newTasks);
    } else {
      // Логирование ошибки, если колонка или задача не найдены
      console.error(`Задача не найдена для удаления в колонке ${columnId}, индекс: ${cardIndex}`);
    }
  };
  

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="dnd-container">
        {Object.entries(columns).map(([columnId, column]) => (
          <DroppableColumn
            key={columnId}
            column={column}
            columnId={columnId}
            moveTask={moveTask}
            removeTask={removeTask}
          />
        ))}
      </div>
      <Link to="/">Назад в список задач</Link> {/* Ссылка для перехода на страницу ToDoList */}
    </DndProvider>
  );
}

export default DragDropPage;
