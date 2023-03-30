import React from 'react';
import { useSelector } from 'react-redux';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ProjectForm from './components/ProjectForm';
import Task from './components/Task';
import Project from './components/Project';

const App = () => {
  const projects = useSelector(state => state.projects.projects);

  return (
    <Router>
      <div className="app">
        <Routes>
          <Route path="/" element={<ProjectForm projects={projects} />} />
          <Route path="/projects/:projectId" element={<Project projects={projects} />} />
          <Route path="/projects/:projectId/task" element={<Task projects={projects} />} />
        </Routes>

      </div>
    </Router>
  );
};

export default App;


