import React from "react";

function Header({ user, onLogout }) {
    return (
        <header className="bg-white shadow p-4 flex justify-between items-center">
            <h1 className="text-xl font-bold">Task Manager</h1>
            <div>
                {user ? (
                    <>
                        <span className="mr-4">Welcome, {user.email}</span>
                        <button className="bg-red-500 text-white px-3 py-1 rounded" onClick={onLogout}>
                            Logout
                        </button>
                    </>
                ) : (
                    <a className="bg-blue-500 text-white px-3 py-1 rounded" href="/login">
                        Login
                    </a>
                )}
            </div>
        </header>
    );
}

export default Header;