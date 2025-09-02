"use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

type Task = {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
};

type StatusFilter = "all" | "active" | "completed";

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [filter, setFilter] = useState<StatusFilter>("all");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Fetch tasks
  const fetchTasks = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/tasks?status=${filter}`);
      const data = await res.json();
      setTasks(data.tasks);
      setError(null);
    } catch {
      setError("Failed to load tasks.");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchTasks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter]);

  // Create task
  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError("Title is required.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, description }),
      });
      if (!res.ok) {
        const err = await res.json();
        setError(err.message || "Failed to create task.");
      } else {
        setTitle("");
        setDescription("");
        setError(null);
        fetchTasks();
      }
    } catch {
      setError("Failed to create task.");
    }
    setLoading(false);
  };

  // Update task status
  const handleToggle = async (id: string, completed: boolean) => {
    setLoading(true);
    try {
      await fetch(`/api/tasks/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ completed: !completed }),
      });
      fetchTasks();
    } catch {
      setError("Failed to update task.");
    }
    setLoading(false);
  };

  // Delete task
  const handleDelete = async (id: string) => {
    setLoading(true);
    try {
      await fetch(`/api/tasks/${id}`, { method: "DELETE" });
      fetchTasks();
    } catch {
      setError("Failed to delete task.");
    }
    setLoading(false);
  };

  return (
    <div className="max-w-xl mx-auto py-8">
      <h1 className="text-4xl font-bold mb-2">Task Manager</h1>
      <p className="mb-4">Manage your tasks efficiently and effectively.</p>

      <form onSubmit={handleCreate} className="mb-6 space-y-2">
        <h2 className="text-2xl font-bold">Create Task</h2>
        <input
          className="border px-2 py-1 w-full"
          placeholder="Title (required)"
          value={title}
          onChange={e => setTitle(e.target.value)}
          disabled={loading}
        />
        <textarea
          className="border px-2 py-1 w-full"
          placeholder="Description (optional)"
          value={description}
          onChange={e => setDescription(e.target.value)}
          disabled={loading}
        />
        <Button type="submit" variant="default" disabled={loading}>
          Create Task
        </Button>
        {error && <div className="text-red-600">{error}</div>}
      </form>

      <div className="mb-4 flex gap-2">
        {["all", "active", "completed"].map(f => (
          <Button
            key={f}
            variant={filter === f ? "default" : "outline"}
            onClick={() => setFilter(f as StatusFilter)}
            disabled={loading}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </Button>
        ))}
      </div>

      <div>
        {loading ? (
          <div>Loading...</div>
        ) : tasks.length === 0 ? (
          <div>No tasks found.</div>
        ) : (
          <ul className="space-y-2">
            {tasks.map(task => (
              <li
                key={task.id}
                className={`border p-2 rounded flex justify-between items-center ${
                  task.completed ? "bg-green-50" : ""
                }`}
              >
                <div>
                  <span
                    className={`font-semibold ${
                      task.completed ? "line-through text-gray-400" : ""
                    }`}
                  >
                    {task.title}
                  </span>
                  {task.description && (
                    <div className="text-sm text-gray-600">
                      {task.description}
                    </div>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button
                    variant={task.completed ? "outline" : "default"}
                    onClick={() => handleToggle(task.id, task.completed)}
                    disabled={loading}
                  >
                    {task.completed ? "Mark Undone" : "Mark Done"}
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() => handleDelete(task.id)}
                    disabled={loading}
                  >
                    Delete
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
