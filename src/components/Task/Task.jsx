import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { deleteTask, editTask, markTaskDone } from "../../slices/projectSlice";
import classNames from 'classnames';
import styles from './task.module.scss';

const Task = ({ projectId, id, title, subtasks, done }) => {
  const dispatch = useDispatch();
  const [newTitle, setNewTitle] = useState(title || "");
  const [editMode, setEditMode] = useState(false);

  const handleDelete = () => {
    dispatch(deleteTask({ projectId: projectId, taskId: id }));
  };

  const handleToggle = () => {
    dispatch(markTaskDone({ projectId, taskId: id, done: !done }));
  };

  const handleEdit = () => {
    if (projectId && id && newTitle) {
      dispatch(editTask({ projectId, taskId: id, newTitle: newTitle }));
      setEditMode(false);
    }
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
    <div className={styles.task}>
      {editMode ? (
        <input
          type="text"
          className={styles.task_edit_input}
          value={newTitle}
          onChange={(event) => setNewTitle(event.target.value)}
          onKeyDown={handleKeyDown}
        />
      ) : (
        <p className={classNames(styles.task_title, { [styles.done]: done })}>
          {newTitle}
        </p>
      )}
      <div className={styles.task_buttons}>
        {editMode ? (
          <>
            <button className={styles.task_button} onClick={handleEdit}>
              Save
            </button>
            <button
              className={styles.task_button}
              onClick={handleCancelEdit}
            >
              Cancel
            </button>
          </>
        ) : (
          <>
            <button className={styles.task_button} onClick={handleToggle}>
              {done ? "Not done" : "Done"}
            </button>
            <button
              className={classNames(
                styles.delete_task_button,
                styles.task_button
              )}
              onClick={handleDelete}
            >
              Delete
            </button>
            <button
              className={styles.task_button}
              onClick={() => setEditMode(true)}
            >
              Edit
            </button>
          </>
        )}
      </div>
      {subtasks && subtasks.map((subtask) => (
        <Task key={subtask.id} {...subtask} />
      ))}
    </div>
  );
};

export default Task;
