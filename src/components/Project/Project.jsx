import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { deleteProject, setCurrentProject, addTask } from '../../slices/projectSlice';
import Task from '../Task/Task';
import classNames from 'classnames';
import styles from './project.module.scss'

const Project = ({ projects }) => {
  const dispatch = useDispatch();
  const currentProjectId = useSelector(state => state.projects.currentProjectId);
  const navigate = useNavigate();

  const { projectId } = useParams();

  const project = projects.find(p => p.id === projectId);
  const tasks = project.tasks;

  const [searchQuery, setSearchQuery] = useState('');
  const [newTaskName, setNewTaskName] = useState('');

  useEffect(() => {
    const storedQuery = localStorage.getItem('searchQuery');
    if (storedQuery) {
      setSearchQuery(storedQuery);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('searchQuery', searchQuery);
  }, [searchQuery]);

  const handleDeleteProject = () => {
    dispatch(deleteProject(project.id));
    navigate('/');
  };

  const handleAddTask = () => {
    if (newTaskName) {
      dispatch(addTask({ projectId: project.id, taskName: newTaskName }));
      setNewTaskName('');
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      handleAddTask();
    }
  };

  const handleSearchQueryChange = e => {
    const query = e.target.value;
    setSearchQuery(query);
  };

  const handleProjectClick = () => {
    dispatch(setCurrentProject(project.id));
  };

  const isCurrentProject = currentProjectId === project.id;
  const filteredTasks = Array.isArray(tasks)
    ? project.tasks.filter(task => task.name?.toLowerCase().includes(searchQuery.toLowerCase()))
    : [];


  return (
    <div
      className={classNames(styles.project, {
        [styles.active]: isCurrentProject
      })}
      onClick={handleProjectClick}>
      <h2>{project.name}</h2>
      <button className={styles.delete_project} onClick={handleDeleteProject}>
        Delete project
      </button>
      <button className={styles.back_to_projects} onClick={() => navigate('/')}>
        Go to Projects
      </button>
      <div className={styles.add_task_container}>
        <input
          type="text"
          placeholder="Enter new task"
          value={newTaskName}
          onChange={e => setNewTaskName(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button className={styles.add_task} onClick={handleAddTask}>
          Add task
        </button>
      </div>
      <input type="text" placeholder="Search tasks" value={searchQuery} onChange={handleSearchQueryChange} />
      {isCurrentProject && (
        <ul className={styles.task_list}>
          {filteredTasks.map(task => (
            <Task
              key={task.id}
              projectId={projectId}
              id={task.id}
              title={task.name}
              subtasks={task.subtasks}
              done={task.done}
            />
          ))}
        </ul>
      )}
    </div>
  );
};

export default Project;


