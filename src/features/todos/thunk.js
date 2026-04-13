import { createAsyncThunk } from "@reduxjs/toolkit";
import { apiIntance } from "../../api/apiInstance";

export const createTodo = createAsyncThunk('todos/createTodo',async(todo, {rejectWithValue})=>{
    try {
        let response = await apiIntance.post('/todos.json', todo);
        return {...todo, id: response.data.name}
    } catch (error) {
        return rejectWithValue(error.message)
    }
})

export const getAllTodos = createAsyncThunk('todos/getAllTodos',async(_, {rejectWithValue})=>{
    try {
        let response = await apiIntance.get('/todos.json');
        if(!response.data) return []
        return Object.keys(response.data).map((key)=>{
            return (
                {...response.data[key], id: key}
            )
        })
    } catch (error) {
        return rejectWithValue(error.message)
    }
})

export const deleteTodo = createAsyncThunk('todos/deleteTodo',async(id,{rejectWithValue})=>{
    try {
        await apiIntance.delete(`/todos/${id}.json`)
        return id;
    } catch (error) {
        return rejectWithValue(error.message)
    }
})

export const updateTodo = createAsyncThunk('todos/updateTodo',async(todo,{rejectWithValue})=>{
    try {
        await apiIntance.patch(`/todos/${todo.id}.json`,todo)
        return todo;
    } catch (error) {
        return rejectWithValue(error.message)
    }
})