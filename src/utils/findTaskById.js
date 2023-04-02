export const findTaskById = (project, taskId) => {
  for (const task of project.tasks) {
    if (task.id === taskId) {
      return task;
    }
    for (const subtask of task.subtasks) {
      if (subtask.id === taskId) {
        return subtask;
      }
    }
  }
  return null;
}

export const setTaskDone = (task, done) => {
  task.done = done;
  if (task.parent) {
    setTaskDone(task.parent, done);
  }
}