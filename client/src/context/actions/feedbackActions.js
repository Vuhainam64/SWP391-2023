export const setFeedback = (data) => {
    return {
        type: "SET_FEEDBACK",
        feedback: data,
    };
};

export const getFeedback = (data) => {
    return {
        type: "GET_FEEDBACK",
    };
};