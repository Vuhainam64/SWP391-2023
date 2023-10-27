export const setAllEmployee = (data) => {
    return {
        type: "SET_ALL_EMPLOYEE",
        allEmployee: data,
    };
};

export const getAllEmployee = (data) => {
    return {
        type: "GET_ALL_EMPLOYEE",
    };
};