import React from 'react';
import { useSelector } from 'react-redux';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ProjectForm from './components/ProjectForm/ProjectForm';
import Project from './components/Project/Project';
import styles from './app.module.scss'

const App = () => {
  const projects = useSelector(state => state.projects.projects);

  return (
    <Router>
      <div className={styles.app}>
        <Routes>
          <Route path="/" element={<ProjectForm projects={projects} />} />
          <Route path="/projects/:projectId" element={<Project projects={projects} />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;


