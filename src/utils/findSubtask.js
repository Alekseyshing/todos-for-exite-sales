export const findParentSubtask = (subtasks, taskId) => {
  for (const subtask of subtasks) {
    if (subtask.id === taskId) {
      return subtask;
    } else if (subtask.subtasks.length > 0) {
      const parentSubtask = findParentSubtask(subtask.subtasks, taskId);
      if (parentSubtask) {
        return parentSubtask;
      }
    }
  }
  return null;
}