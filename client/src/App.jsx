import { useState, useEffect } from "react";
import axios from "axios";
import './App.css';


function App() {
  const [todos, setTodos] = useState([]);
  const [text, setText] = useState("");
  const [editId, setEditId] = useState(null);
  const [editText, setEditText] = useState("");


  useEffect(() => {
    axios.get("http://localhost:5000/api/todos")
      .then(res => setTodos(res.data));
  }, []);

  const addTodo = () => {
    if (!text) return;
    axios.post("http://localhost:5000/api/todos", { text })
      .then(res => {
        setTodos([...todos, res.data]);
        setText("");
      });
  };

  const toggleTodo = (id, completed) => {
    axios.put(`http://localhost:5000/api/todos/${id}`, { completed: !completed })
      .then(res => {
        setTodos(todos.map(todo => todo._id === id ? res.data : todo));
      });
  };

  const deleteTodo = (id) => {
    axios.delete(`http://localhost:5000/api/todos/${id}`)
      .then(() => {
        setTodos(todos.filter(todo => todo._id !== id));
      });
  };

  const startEditing = (todo) => {
    setEditId(todo._id);
    setEditText(todo.text);
  };

  const saveEdit = (id) => {
    axios.put(`http://localhost:5000/api/todos/${id}`, { text: editText })
      .then(res => {
        console.log("Updated Todo:", res.data); // 🔍 Log the updated todo
        setTodos(todos.map(todo => todo._id === id ? res.data : todo));
        setEditId(null);
        setEditText("");
      })
      .catch(err => {
        console.error("Update failed:", err);
      });
  };
  

  const cancelEdit = () => {
    setEditId(null);
    setEditText("");
  };
  

  return (
    <div className="app-container">
      <h1>📝 Deepika's To-Do List</h1>
      <div style={{ marginBottom: '20px' }}>
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Add a task"
        />
        <button className="add-btn" onClick={addTodo}>Add</button>
      </div>
      <ul>
        {todos.map((todo) => (
          <li key={todo._id}>
            {editId === todo._id ? (
              <>
                <input
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                />
                <button className="save-btn" onClick={() => saveEdit(todo._id)}>💾 Save</button>
                <button className="cancel-btn" onClick={cancelEdit}>✖ Cancel</button>
              </>
            ) : (
              <>
                <span
                  onClick={() => toggleTodo(todo._id, todo.completed)}
                  style={{
                    textDecoration: todo.completed ? "line-through" : "none",
                  }}
                >
                  {todo.text}
                </span>
                <div>
                  <button className="edit-btn" onClick={() => startEditing(todo)}>✏ Edit</button>
                  <button className="delete-btn" onClick={() => deleteTodo(todo._id)}>❌ Delete</button>
                </div>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
  
}

export default App;
