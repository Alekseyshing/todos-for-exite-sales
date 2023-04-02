import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { deleteTask, editTask, markTaskDone, addSubtask } from "../../slices/projectSlice";
import classNames from 'classnames';
import { v4 as uuidv4 } from 'uuid';
import styles from './task.module.scss';

const Task = ({ projectId, id, title, subtasks, done, parentId }) => {
  const dispatch = useDispatch();
  const [newTitle, setNewTitle] = useState(title || "");
  const [editMode, setEditMode] = useState(false);
  const [showAddSubtaskModal, setShowAddSubtaskModal] = useState(false);
  const [newSubtaskTitle, setNewSubtaskTitle] = useState('');

  const handleDelete = () => {
    if (parentId) {
      dispatch(deleteTask({ projectId, taskId: id, parentId }));
    } else {
      dispatch(deleteTask({ projectId, taskId: id }));
    }
  };

  const handleToggle = () => {
    if (parentId) {
      dispatch(markTaskDone({ projectId, taskId: id, parentId, done: !done }));
    } else {
      dispatch(markTaskDone({ projectId, taskId: id, done: !done }));
    }
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

  const handleAddSubtask = (e) => {
    e.preventDefault();
    const newSubtask = {
      id: uuidv4(),
      title: newSubtaskTitle,
      subtasks: []
    };
    if (parentId) {
      dispatch(addSubtask({ projectId, taskId: parentId, subtask: newSubtask }));
    } else {
      dispatch(addSubtask({ projectId, taskId: id, subtask: newSubtask }));
    }
    setShowAddSubtaskModal(false);
    setNewSubtaskTitle('');
  };



  const renderSubtasks = (subtasks) => {
    if (subtasks.length > 0) {
      return subtasks.map((subtask) => (
        <div className={styles.subtask} key={subtask.id}>
          <Task
            projectId={projectId}
            subtasks={subtask.subtasks}
            id={subtask.id}
            title={subtask.name}
            done={subtask.done}
          />
        </div>
      ));
    }
  }

  return (
    <div className={styles.task_container} >
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
          <div>
            <p className={classNames(styles.task_title, { [styles.done]: done })}>
              {newTitle}
            </p>
          </div>
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
              <button className={styles.task_button} onClick={() => setShowAddSubtaskModal(true)}>
                Add subtask
              </button>
              {showAddSubtaskModal && (
                <div className={styles.modal}>
                  <form onSubmit={handleAddSubtask}>
                    <input type="text" value={newSubtaskTitle} onChange={e => setNewSubtaskTitle(e.target.value)} />
                    <button type="submit">Add</button>
                    <button type="button" onClick={() => setShowAddSubtaskModal(false)}>Cancel</button>
                  </form>
                </div>
              )}
            </>
          )}
        </div>
      </div>
      {renderSubtasks(subtasks)}
    </div>
  );
}

export default Task
