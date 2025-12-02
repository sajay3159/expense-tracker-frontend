import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  items: [],
};

const expensesSlice = createSlice({
  name: "expenses",
  initialState,
  reducers: {
    setExpenses(state, action) {
      state.items = action.payload;
    },
    addExpense(state, action) {
      state.items.push(action.payload);
    },
    updateExpense(state, action) {
      const index = state.items.findIndex(
        (item) => item.id === action.payload.id
      );
      if (index >= 0) {
        state.items[index] = action.payload;
      }
    },
    deleteExpense(state, action) {
      state.items = state.items.filter((item) => item.id !== action.payload);
    },
  },
});

export const expensesActions = expensesSlice.actions;
export default expensesSlice.reducer;
