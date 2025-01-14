import { createSlice } from "@reduxjs/toolkit";

const getFromLocalStorage = (key, defaultValue) => {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : defaultValue;
};

const initialState = {
  eventDetails: null,
  event: [],
  token: getFromLocalStorage("token", null),
  editEvent: false,
  editEventId: null,
  user: getFromLocalStorage("user", null),
};

const userSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setEventDetails: (state, action) => {
      state.eventDetails = action.payload;
    },
    setEvent: (state, action) => {
      state.event = action.payload;
    },
    setEditEvent: (state, action) => {
      state.editEvent = action.payload;
    },
    setEditEventId: (state, action) => {
      state.editEventId = action.payload;
    },
    setToken: (state, action) => {
      state.token = action.payload;
      if (action.payload) {
        localStorage.setItem("token", action.payload);
      } else {
        localStorage.removeItem("token");
      }
    },
    setUser: (state, action) => {
      state.user = action.payload;
      if (action.payload) {
        localStorage.setItem("user", JSON.stringify(action.payload));
      } else {
        localStorage.removeItem("user");
      }
    },
  },
});

export const {
  setEventDetails,
  setEvent,
  setEditEvent,
  setEditEventId,
  setToken,
  setUser,
} = userSlice.actions;

export default userSlice.reducer;
