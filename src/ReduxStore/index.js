import { createStore, combineReducers } from "redux";

const gobalData = (state = [], action) => {
  if (action.type === "API_CALL") {
    return (state = action.payload);
  }
  if (action.type === "ADD") {
    return (state = action.payload);
  }
  if (action.type === "DELETE") {
    return (state = action.payload);
  }
  if (action.type === "UPDATE") {
    return (state = action.payload);
  }
  return state;
};
const userName = (state = "", action) => {
  if (action.type === "GET_USER") {
    return (state = action.payload);
  }

  return state;
};

const userState = (state = null, action) => {
  if (action.type === "REFRESH") {
    return (state = action.payload);
  }
  if (action.type === "SIGNUP") {
    return (state = action.payload);
  }
  if (action.type === "LOGIN") {
    return (state = action.payload);
  }
  if (action.type === "LOGOUT") {
    return (state = action.payload);
  }

  return state;
};

const store = createStore(combineReducers({ gobalData, userState, userName }));

export default store;
