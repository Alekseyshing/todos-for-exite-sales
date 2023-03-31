import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { deleteProject, setCurrentProject, updateProjectTitle, markTaskDone, addTask } from '../slices/projectSlice';
import Task from './Task/Task';

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
    <div className={`project ${isCurrentProject ? 'active' : ''}`} onClick={handleProjectClick}>
      <h2>{project.name}</h2>
      <button className="delete-project" onClick={handleDeleteProject}>
        Delete project
      </button>
      <div className="add-task-container">
        <input type="text" placeholder="Enter new task" value={newTaskName} onChange={e => setNewTaskName(e.target.value)} />
        <button className="add-task" onClick={handleAddTask}>
          Add task
        </button>
      </div>
      <input type="text" placeholder="Search tasks" value={searchQuery} onChange={handleSearchQueryChange} />
      {isCurrentProject && (
        <ul className="task-list">
          {filteredTasks.map(task => (
            <Task key={task.id} projectId={projectId} id={task.id} title={task.name} subtasks={task.subtasks} done={task.done} />
          ))}
        </ul>
      )}
    </div>
  );
};

export default Project;


