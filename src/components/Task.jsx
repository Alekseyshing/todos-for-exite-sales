import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { deleteTask, editTask, toggleDone } from "../slices/taskSlice";

const Task = ({ id, title, subtasks, done }) => {
  const dispatch = useDispatch();
  const [editMode, setEditMode] = useState(false);
  const [newTitle, setNewTitle] = useState(title || "");

  const handleDelete = () => {
    dispatch(deleteTask(id));
  };

  const handleToggle = () => {
    dispatch(toggleDone(id));
  };

  const handleEdit = () => {
    dispatch(editTask({ id, title: newTitle }));
    setEditMode(false);
  };

  const handleCancelEdit = () => {
    setNewTitle(title);
    setEditMode(false);
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      handleEdit();
    } else if (event.key === "Escape") {
      handleCancelEdit();
    }
  };

  return (
    <div className={`task ${done ? "done" : ""}`}>
      <div className="task-title">
        {editMode ? (
          <input
            type="text"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            onKeyDown={handleKeyDown}
            autoFocus
          />
        ) : (
          <div onClick={handleToggle}>{title}</div>
        )}
        <div className="task-buttons">
          {editMode ? (
            <>
              <button className="task-button" onClick={handleEdit}>
                Save
              </button>
              <button className="task-button" onClick={handleCancelEdit}>
                Cancel
              </button>
            </>
          ) : (
            <>
              <button className="task-button" onClick={() => setEditMode(true)}>
                Edit
              </button>
              <button className="task-button" onClick={handleDelete}>
                Delete
              </button>
            </>
          )}
        </div>
      </div>
      {subtasks && subtasks.map((subtask) => (
        <Task key={subtask.id} {...subtask} />
      ))}
    </div>
  );
};

export default Task;
