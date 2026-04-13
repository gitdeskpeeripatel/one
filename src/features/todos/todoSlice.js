import { createSlice } from "@reduxjs/toolkit";
import { createTodo, deleteTodo, getAllTodos, updateTodo } from "./thunk.js";

const todoSlice = createSlice({
  name: "todos",
  initialState: {
    todos: [],
    loading: false,          // page load
    formLoading: false,      // add / update
    deleteLoadingId: null,   // delete button
    error: null,
    message: null,
  },
  reducers: {
    clearMessage: (state) => {
      state.message = null;
    }
  },
  extraReducers: (builder) => {

    // ================= GET ALL =================
    builder.addCase(getAllTodos.pending, (state) => {
      state.loading = true;
    });

    builder.addCase(getAllTodos.fulfilled, (state, action) => {
      state.loading = false;
      state.todos = action.payload;
    });

    builder.addCase(getAllTodos.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });

    // ================= CREATE =================
    builder.addCase(createTodo.pending, (state) => {
      state.formLoading = true;
    });

    builder.addCase(createTodo.fulfilled, (state, action) => {
      state.formLoading = false;
      state.todos.push(action.payload);
      state.message = "Todo Added Successfully ✅";
    });

    builder.addCase(createTodo.rejected, (state, action) => {
      state.formLoading = false;
      state.error = action.payload;
    });

    // ================= UPDATE =================
    builder.addCase(updateTodo.pending, (state) => {
      state.formLoading = true;
    });

    builder.addCase(updateTodo.fulfilled, (state, action) => {
      state.formLoading = false;
      state.todos = state.todos.map(todo =>
        todo.id === action.payload.id ? action.payload : todo
      );
      state.message = "Todo Updated Successfully ✏️";
    });

    builder.addCase(updateTodo.rejected, (state, action) => {
      state.formLoading = false;
      state.error = action.payload;
    });

    // ================= DELETE =================
    builder.addCase(deleteTodo.pending, (state, action) => {
      state.deleteLoadingId = action.meta.arg;
    });

    builder.addCase(deleteTodo.fulfilled, (state, action) => {
      state.deleteLoadingId = null;
      state.todos = state.todos.filter(todo => todo.id !== action.payload);
      state.message = "Todo Deleted Successfully 🗑️";
    });

    builder.addCase(deleteTodo.rejected, (state, action) => {
      state.deleteLoadingId = null;
      state.error = action.payload;
    });
  }
});

export const { clearMessage } = todoSlice.actions;
export default todoSlice.reducer;