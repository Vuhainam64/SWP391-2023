export const setAllTasks = (data) => {
  return {
    type: "SET_ALL_TASK",
    allTasks: data,
  };
};

export const getAllTasks = (data) => {
  return {
    type: "GET_ALL_TASK",
  };
};