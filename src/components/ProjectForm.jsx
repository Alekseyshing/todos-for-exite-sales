import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addProject } from '../slices/projectSlice';
import ProjectList from './ProjectList';
import { v4 as uuidv4 } from 'uuid';

const ProjectForm = ({ projects }) => {
  const dispatch = useDispatch();
  const [title, setTitle] = useState('');

  const handleTitleChange = e => {
    setTitle(e.target.value);
  };

  const handleAddProject = (e) => {
    e.preventDefault();
    const id = uuidv4();
    dispatch(addProject({ id, title }));
    setTitle('');
  };

  return (
    <div>
      <div className="project-form">
        <input type="text" placeholder="Enter project name" value={title} onChange={handleTitleChange} />
        <button className="add-project" onClick={handleAddProject}>
          Add project
        </button>
      </div>
      <ProjectList projects={projects} />
    </div>
  );
};

export default ProjectForm;
