import { createSlice } from "@reduxjs/toolkit";

const initialToken = localStorage.getItem("token");
const initialEmail = localStorage.getItem("email");
const initialUid = localStorage.getItem("uid");

const authSlice = createSlice({
  name: "auth",
  initialState: {
    token: initialToken || null,
    email: initialEmail || "",
    uid: initialUid || null,
  },
  reducers: {
    login(state, action) {
      const { token, email, uid } = action.payload;
      state.token = token;
      state.email = email;
      state.uid = uid;
      localStorage.setItem("token", token);
      localStorage.setItem("email", email);
      localStorage.setItem("uid", uid);
    },
    logout(state) {
      state.token = null;
      state.email = "";
      state.uid = null;
      localStorage.removeItem("token");
      localStorage.removeItem("email");
      localStorage.removeItem("uid");
    },
  },
});

export const authActions = authSlice.actions;
export default authSlice.reducer;
