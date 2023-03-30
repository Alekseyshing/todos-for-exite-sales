import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { deleteProject, setCurrentProject, updateProjectTitle } from '../slices/projectSlice';
import { addTask } from '../slices/taskSlice';
import Task from './Task';
import { useNavigate } from 'react-router-dom';
import { saveState } from '../utils/localStorage';

const Project = ({ projects }) => {
  const dispatch = useDispatch();
  const currentProjectId = useSelector(state => state.projects.currentProjectId);
  const navigate = useNavigate();

  const { projectId } = useParams();

  const project = projects.find(p => p.id === projectId);

  const handleTitleChange = e => {
    const title = e.target.value;
    dispatch(updateProjectTitle({ id: project.id, title }));
  };

  const handleDeleteClick = () => {
    const updatedState = dispatch(deleteProject(project.id));
    saveState(updatedState);
    navigate('/')
  };

  const handleAddTask = () => {
    dispatch(addTask({ projectId: project.id }));
    navigate(`/projects/${project.id}/task`);
  };

  const handleProjectClick = () => {
    dispatch(setCurrentProject(project.id));
  };

  const isCurrentProject = currentProjectId === project.id;

  return (
    <div className={`project ${isCurrentProject ? 'active' : ''}`} onClick={handleProjectClick}>
      {/* <input type="text" onChange={handleTitleChange} /> */}
      <h1>{project.title}</h1>
      <button className="delete" onClick={handleDeleteClick}>
        Delete
      </button>
      <button className="add-task" onClick={handleAddTask}>
        Add task
      </button>
      {isCurrentProject && (
        <ul className="task-list">
          {Array.isArray(project.tasks) && projects.tasks.map(task => (
            <Task key={task.id} id={task.id} title={task.title} subtasks={task.subtasks} done={task.done} />
          ))}
        </ul>
      )}
    </div>
  );
}; export default Project

