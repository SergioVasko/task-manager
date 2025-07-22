import { useEffect, useState } from "react";
import axios from "axios";

function TaskForm({ task, onTaskSaved, onCancel }) {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [visibility, setVisibility] = useState("public"); // or "private"
    const [category, setCategory] = useState("");

    useEffect(() => {
        if (task) {
            setTitle(task.title);
            setDescription(task.description);
            setVisibility(task.visibility);
            setCategory(task.category.id || "");
        } else {
            // Clear form for new task
            setTitle("");
            setDescription("");
            setVisibility("public");
            setCategory("");
        }
    }, [task]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const payload = { title, description, visibility, category: parseInt(category)};

            if (task?.id) {
                // Edit existing task (PUT)
                await axios.put(`/api/tasks/${task.id}`, payload, { withCredentials: true });
            } else {
                // Create new task (POST)
                await axios.post("/api/tasks", payload, { withCredentials: true });
            }

            if (onTaskSaved) onTaskSaved();
            // Optionally reset form if creating new task
            if (!task) {
                setTitle("");
                setDescription("");
                setVisibility("public");
                setCategory("");
            }
        } catch (error) {
            if (error.response?.data?.error) {
                alert(error.response.data.error); // Display single "error" message like "Category not found"
            } else if (error.response?.data?.errors) {
                const messages = Object.values(error.response.data.errors).join("\n");
                alert(messages); // Display validation errors from Symfony validator
            } else {
                console.error("Unexpected error:", error);
                alert("Unexpected error. Check console.");
            }
        }
    };

    return (
        <form onSubmit={handleSubmit} className="mb-6 p-4 bg-white rounded shadow">
            <h3 className="text-xl mb-4">{task ? "Edit Task" : "Create New Task"}</h3>

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

            <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded mr-2">
                {task ? "Save Changes" : "Create Task"}
            </button>

            {task && (
                <button
                    type="button"
                    onClick={onCancel}
                    className="bg-gray-400 text-white px-4 py-2 rounded"
                >
                    Cancel
                </button>
            )}
        </form>
    );
}

export default TaskForm;
