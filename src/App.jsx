import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  createTodo,
  deleteTodo,
  getAllTodos,
  updateTodo,
} from "./features/todos/thunk.js";
import { clearMessage } from "./features/todos/todoSlice.js";
import { Trash2, Edit3, Plus, CheckCircle2 } from "lucide-react";

const App = () => {
  const [todo, setTodo] = useState({});
  const dispatch = useDispatch();

  const {
    todos,
    loading,
    formLoading,
    deleteLoadingId,
    message,
    error,
  } = useSelector((state) => state.todos);

  useEffect(() => {
    dispatch(getAllTodos());
  }, []);

  useEffect(() => {
    if (message) {
      setTimeout(() => dispatch(clearMessage()), 2000);
    }
  }, [message]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Empty todo validation
    if (!todo.text || todo.text.trim() === "") {
      return;
    }
    
    todo.id ? dispatch(updateTodo(todo)) : dispatch(createTodo(todo));
    setTodo({});
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-black">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-xl font-semibold text-white">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black py-10 px-4">

      {/* MESSAGE */}
      {message && (
        <div className="max-w-md mx-auto mb-4 text-center bg-white text-black py-3 px-4 rounded-lg shadow-lg">
          <div className="flex items-center justify-center gap-2">
            <CheckCircle2 size={20} />
            <span className="font-medium">{message}</span>
          </div>
        </div>
      )}

      {/* HEADER */}
      <div className="max-w-4xl mx-auto mb-8 text-center">
        <h1 className="text-5xl font-extrabold text-white mb-2">
          My Todos
        </h1>
        <p className="text-gray-400 text-sm">Organize your tasks efficiently</p>
      </div>

      {/* FORM */}
      <div className="max-w-2xl mx-auto bg-neutral-900 p-8 rounded-2xl shadow-2xl border border-neutral-800 mb-8">
        <div className="space-y-4">
          <div className="relative">
            <input
              type="text"
              name="text"
              value={todo.text || ""}
              onChange={(e) =>
                setTodo({ ...todo, text: e.target.value })
              }
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleSubmit(e);
                }
              }}
              className="w-full bg-black text-white border border-neutral-700 px-5 py-4 rounded-xl focus:ring-2 focus:ring-white focus:border-transparent outline-none transition-all placeholder-gray-500"
              placeholder="What needs to be done?"
            />
          </div>

          <button
            onClick={handleSubmit}
            disabled={formLoading || !todo.text?.trim()}
            className={`w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-all
              ${formLoading || !todo.text?.trim()
                ? "bg-neutral-700 text-neutral-400 cursor-not-allowed" 
                : "bg-white text-black shadow-lg"}
            `}
          >
            {formLoading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-black"></div>
                Processing...
              </>
            ) : todo.id ? (
              <>
                <Edit3 size={20} />
                Update Todo
              </>
            ) : (
              <>
                <Plus size={20} />
                Add Todo
              </>
            )}
          </button>
        </div>
      </div>

      {/* TODOS LIST */}
      <div className="max-w-4xl mx-auto">
        {todos.length === 0 ? (
          <div className="bg-neutral-900 rounded-2xl shadow-2xl border border-neutral-800 p-12 text-center">
            <div className="text-6xl mb-4">📝</div>
            <h3 className="text-2xl font-bold text-white mb-2">No Todos Yet</h3>
            <p className="text-gray-500">Add your first todo to get started!</p>
          </div>
        ) : (
          <div className="bg-neutral-900 rounded-2xl shadow-2xl border border-neutral-800 overflow-hidden">
            <div className="p-6 bg-neutral-800 border-b border-neutral-700">
              <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                <CheckCircle2 className="text-white" />
                Your Tasks ({todos.length})
              </h2>
            </div>
            
            <div className="divide-y divide-neutral-800">
              {todos.map((t, i) => (
                <div 
                  key={t.id} 
                  className="p-5"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 flex-1">
                      <span className="text-gray-500 font-semibold text-lg w-8">
                        {i + 1}.
                      </span>
                      <p className="text-white text-lg flex-1">{t.text}</p>
                    </div>
                    
                    <div className="flex gap-2">
                      <button
                        onClick={() => setTodo(t)}
                        className="px-4 py-2 bg-white text-black rounded-lg transition-all flex items-center gap-2 font-medium"
                      >
                        <Edit3 size={16} />
                        Edit
                      </button>

                      <button
                        onClick={() => dispatch(deleteTodo(t.id))}
                        disabled={deleteLoadingId === t.id}
                        className="px-4 py-2 bg-neutral-700 text-white rounded-lg transition-all flex items-center gap-2 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {deleteLoadingId === t.id ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
                            Deleting...
                          </>
                        ) : (
                          <>
                            <Trash2 size={16} />
                            Delete
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {error && (
        <div className="max-w-4xl mx-auto mt-4">
          <div className="bg-neutral-900 border border-neutral-700 text-white p-4 rounded-xl text-center">
            <p className="font-medium">{error}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;