import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import Header from "./components/Header";
import TaskList from "./components/TaskList";
import TaskForm from "./components/TaskForm";

axios.defaults.baseURL = "http://localhost:8080";
axios.defaults.withCredentials = true; // ensure cookies are sent

function App() {
    const [user, setUser] = useState(null);
    const [tasks, setTasks] = useState([]);
    const [taskToEdit, setTaskToEdit] = useState(null);

    const fetchTasks = useCallback(() => {
        axios
            .get("/api/tasks")
            .then(res => setTasks(res.data))
            .catch(() => setTasks([]));
    }, []);

    useEffect(() => {
        axios
            .get("/api/me")
            .then(res => setUser(res.data))
            .catch(() => setUser(null));
    }, []);

    useEffect(() => {
        fetchTasks();
    }, [fetchTasks]);

    const handleLogout = () => {
        axios.post("/logout").then(() => setUser(null));
    };

    const handleTaskSaved = (savedTask) => {
        setTaskToEdit(null); // close edit form
        fetchTasks();
    };

    const handleEditClick = (task) => {
        // setTaskToEdit({ ...task, category: task.category?.id || null });
        setTaskToEdit(task);
    };

    const handleCancelEdit = () => {
        setTaskToEdit(null);
    };

    return (
        <div className="min-h-screen bg-gray-100">
            <Header user={user} onLogout={handleLogout} />
            <main className="p-6">
                <h2 className="text-2xl mb-4">Tasks</h2>
                <TaskList tasks={tasks} onEditClick={handleEditClick} />
                <br />
                <TaskForm
                    task={taskToEdit}
                    onTaskSaved={handleTaskSaved}
                    onCancel={handleCancelEdit}
                />
            </main>
        </div>
    );
}

export default App;
