import { useEffect, useState } from "react";
import axios from "axios";
import Header from "./components/Header";
import TaskList from "./components/TaskList";
import TaskForm from "./components/TaskForm";

axios.defaults.baseURL = "http://localhost:8080";

function App() {
    const [user, setUser] = useState(null);
    const [tasks, setTasks] = useState([]);

    useEffect(() => {
        axios.get("/api/me", { withCredentials: true })
            .then(res => setUser(res.data))
            .catch(() => setUser(null));
    }, []);

    useEffect(() => {
        fetchTasks();
    }, []);

    const fetchTasks = () => {
        axios.get("/api/tasks", { withCredentials: true })
            .then(res => setTasks(res.data))
            .catch(() => setTasks([]));
    };

    const handleLogout = () => {
        axios.post("/logout", {}, { withCredentials: true })
            .then(() => setUser(null));
    };

    const handleTaskCreated = (newTask) => {
        // Option 1: refetch all tasks
        fetchTasks();

        // Or Option 2: append new task locally:
        // setTasks(prev => [...prev, newTask]);
    };

    return (
        <div className="min-h-screen bg-gray-100">
            <Header user={user} onLogout={handleLogout} />
            <main className="p-6">
                <h2 className="text-2xl mb-4">Tasks</h2>
                <TaskList tasks={tasks} />
                <br />
                <TaskForm onTaskCreated={handleTaskCreated} />
            </main>
        </div>
    );
}

export default App;
