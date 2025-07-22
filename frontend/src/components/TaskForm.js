import { useState } from "react";
import axios from "axios";

function TaskForm({ onTaskCreated }) {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [visibility, setVisibility] = useState("public"); // or "private"
    const [category, setCategory] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const payload = { title, description, visibility, category };
            const response = await axios.post("/api/tasks", payload, { withCredentials: true });

            // Notify parent that a new task was created (to refresh task list)
            if (onTaskCreated) onTaskCreated(response.data);

            // Reset form
            setTitle("");
            setDescription("");
            setVisibility("public");
            setCategory("");
        } catch (error) {
            console.error("Failed to create task:", error);
            alert("Error creating task. Check console.");
        }
    };

    return (
        <form onSubmit={handleSubmit} className="mb-6 p-4 bg-white rounded shadow">
            <h3 className="text-xl mb-4">Create New Task</h3>

            <div className="mb-2">
                <label className="block font-semibold">Title</label>
                <input
                    type="text"
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    required
                    className="border rounded w-full p-2"
                />
            </div>

            <div className="mb-2">
                <label className="block font-semibold">Description</label>
                <textarea
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                    required
                    className="border rounded w-full p-2"
                />
            </div>

            <div className="mb-2">
                <label className="block font-semibold">Visibility</label>
                <select
                    value={visibility}
                    onChange={e => setVisibility(e.target.value)}
                    className="border rounded w-full p-2"
                >
                    <option value="public">Public</option>
                    <option value="private">Private</option>
                </select>
            </div>

            <div className="mb-4">
                <label className="block font-semibold">Category</label>
                <input
                    type="text"
                    value={category}
                    onChange={e => setCategory(e.target.value)}
                    className="border rounded w-full p-2"
                />
            </div>

            <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
                Create Task
            </button>
        </form>
    );
}

export default TaskForm;
