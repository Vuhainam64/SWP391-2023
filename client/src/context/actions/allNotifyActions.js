export const setAllNotify = (data) => {
  return {
    type: "SET_ALL_NOTIFY",
    allNotify: data,
  };
};

export const getAllNotify = (data) => {
  return {
    type: "GET_ALL_NOTIFY",
  };
};