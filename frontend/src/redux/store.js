import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import taskReducer from "./taskSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    task: taskReducer,
  },
});

export default store;
