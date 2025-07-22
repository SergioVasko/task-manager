import React from "react";

function TaskList({ tasks }) {
    return (
        <ul className="space-y-2">
            {tasks.map(task => (
                <li key={task.id} className="bg-white p-4 shadow rounded">
                    <h3 className="text-lg font-semibold">{task.title}</h3>
                    <p>{task.description}</p>
                    <span className="text-sm text-gray-500">Visibility: {task.visibility}</span>
                </li>
            ))}
        </ul>
    );
}

export default TaskList;