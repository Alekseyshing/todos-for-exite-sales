import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addProject } from '../../slices/projectSlice';
import ProjectList from '../ProjectList/ProjectList';
import { v4 as uuidv4 } from 'uuid';
import styles from './form.module.scss'

const ProjectForm = ({ projects }) => {
  const dispatch = useDispatch();
  const [title, setTitle] = useState('');

  const handleTitleChange = e => {
    setTitle(e.target.value);
  };

  const handleAddProject = (e) => {
    e.preventDefault();
    if (!title) return; // if title is empty, return early
    const id = uuidv4();
    dispatch(addProject({ id, title }));
    setTitle('');
  };

  return (
    <div>
      <div className={styles.project_form}>
        <input type="text" placeholder="Enter project name" value={title} onChange={handleTitleChange} />
        <button className={styles.add_project} onClick={handleAddProject} disabled={!title}>
          Add project
        </button>
      </div>
      <ProjectList projects={projects} />
    </div>
  );
};

export default ProjectForm;

