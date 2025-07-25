import React from "react";

function TaskList({ user, tasks, onEditClick }) {
    return (
        <ul className="space-y-2">
            {tasks.map(task => (
                <li key={task.id} className="bg-white p-4 shadow rounded">
                    <h3 className="text-lg font-semibold">{task.title}</h3>
                    <p className="text-sm text-gray-500">
                        Category: {task.category ? (task.category.name) : <b>No Category</b>}
                    </p>
                    <p className="text-sm text-gray-500">
                        User: {task.user ? (task.user.email) : <b>No User</b>}
                    </p>
                    <p>{task.description}</p>
                    <span className="text-sm text-gray-500">Visibility: {task.visibility}</span>
                    {onEditClick && (
                        <button
                            disabled={user?.id != task.user?.id}
                            onClick={() => onEditClick(task)}
                            className="block bg-blue-500 hover:bg-blue-700 text-white font-bold px-2 py-1 rounded
                                disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            Edit
                        </button>
                    )}
                </li>
            ))}
        </ul>
    );
}

export default TaskList;