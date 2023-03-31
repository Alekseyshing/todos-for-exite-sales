import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { deleteProject, updateProjectTitle } from '../../slices/projectSlice';
import styles from './list.module.scss'


const ProjectList = ({ projects }) => {
  const dispatch = useDispatch();
  const [renamingProjectId, setRenamingProjectId] = useState(null);
  const [newTitle, setNewTitle] = useState('');

  const handleDeleteClick = (id) => {
    dispatch(deleteProject(id));
  };

  const handleRenameClick = (id) => {
    setRenamingProjectId(id);
    setNewTitle('');
  };

  const handleRenameSubmit = (event) => {
    event.preventDefault();
    if (newTitle && renamingProjectId) {
      dispatch(updateProjectTitle({ id: renamingProjectId, title: newTitle }));
      setRenamingProjectId(null);
    }
  };


  return (
    <div className={styles.project_list}>
      <h2>Projects</h2>
      <ul>
        {projects.map((project) => (
          <li key={project.id}>
            {renamingProjectId === project.id ? (
              <form onSubmit={handleRenameSubmit}>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(event) => setNewTitle(event.target.value)}
                />
                <button type="submit">Save</button>
              </form>
            ) : (
              <>
                <Link to={`/projects/${project.id}`} target="_blank">
                  {project.name}
                </Link>
                <div className={styles.buttons_section}>
                  <button onClick={() => handleDeleteClick(project.id)}>Delete</button>
                  <button className={styles.rename_button} onClick={() => handleRenameClick(project.id)}>Rename</button>
                </div>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProjectList;

