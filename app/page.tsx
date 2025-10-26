"use client";

import { useEffect, useState } from "react";
import { TaskService } from "@/application/services/TaskService";
import { Task } from "@/domain/Task";
import { Category } from "@/domain/Category";

export default function Home() {
  const [taskService] = useState(() => new TaskService());
  const [tasks, setTasks] = useState<Task[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [priority, setPriority] = useState<"low" | "medium" | "high">("medium");
  const [filterCategory, setFilterCategory] = useState("All");

  // Initialize data
  useEffect(() => {
    setCategories(taskService.getAllCategories());
    setTasks(taskService.getAllTasks());
    if (taskService.getAllCategories().length > 0) {
      setSelectedCategory(taskService.getAllCategories()[0].getName());
    }
    setIsHydrated(true);
  }, [taskService]);

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    try {
      taskService.createTask(title, selectedCategory, description, priority);
      setTasks(taskService.getAllTasks());
      setTitle("");
      setDescription("");
      setPriority("medium");
    } catch (error) {
      alert(error instanceof Error ? error.message : "Failed to create task");
    }
  };

  const handleToggleTask = (id: string) => {
    taskService.toggleTaskCompletion(id);
    setTasks(taskService.getAllTasks());
  };

  const handleDeleteTask = (id: string) => {
    taskService.deleteTask(id);
    setTasks(taskService.getAllTasks());
  };

  const filteredTasks =
    filterCategory === "All"
      ? tasks
      : tasks.filter((t) => t.getCategory() === filterCategory);

  const stats = taskService.getStatistics();

  if (!isHydrated) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <h1 className="text-4xl font-bold text-gray-800 mb-2">Task Dashboard</h1>
        <p className="text-gray-600 mb-8">Stay organized and boost your productivity</p>

        {/* Statistics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
            <div className="text-gray-600">Total Tasks</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-2xl font-bold text-green-600">{stats.completed}</div>
            <div className="text-gray-600">Completed</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
            <div className="text-gray-600">Pending</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-2xl font-bold text-purple-600">{categories.length}</div>
            <div className="text-gray-600">Categories</div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Add Task Form */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Add Task</h2>
              <form onSubmit={handleAddTask} className="space-y-4">
                <input
                  type="text"
                  placeholder="Task title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <textarea
                  placeholder="Description (optional)"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {categories.map((cat) => (
                    <option key={cat.getId()} value={cat.getName()}>
                      {cat.getName()}
                    </option>
                  ))}
                </select>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as "low" | "medium" | "high")}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="low">Low Priority</option>
                  <option value="medium">Medium Priority</option>
                  <option value="high">High Priority</option>
                </select>
                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700 transition"
                >
                  Add Task
                </button>
              </form>
            </div>
          </div>

          {/* Tasks List */}
          <div className="lg:col-span-2">
            {/* Category Filter */}
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-gray-700 mb-3">Filter by Category</h2>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setFilterCategory("All")}
                  className={`px-4 py-2 rounded-lg font-medium transition ${
                    filterCategory === "All"
                      ? "bg-blue-600 text-white"
                      : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  All
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat.getId()}
                    onClick={() => setFilterCategory(cat.getName())}
                    style={{
                      backgroundColor: filterCategory === cat.getName() ? cat.getColor() : "white",
                      color: filterCategory === cat.getName() ? "white" : "gray",
                    }}
                    className={`px-4 py-2 rounded-lg font-medium transition border ${
                      filterCategory === cat.getName() ? "border-transparent" : "border-gray-300"
                    }`}
                  >
                    {cat.getName()}
                  </button>
                ))}
              </div>
            </div>

            {/* Tasks */}
            <div className="space-y-4">
              {filteredTasks.length === 0 ? (
                <div className="bg-white rounded-lg shadow p-8 text-center text-gray-500">
                  No tasks yet. Create one to get started!
                </div>
              ) : (
                filteredTasks.map((task) => (
                  <div
                    key={task.getId()}
                    className="bg-white rounded-lg shadow p-4 hover:shadow-md transition"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4 flex-1">
                        <input
                          type="checkbox"
                          checked={task.getIsCompleted()}
                          onChange={() => handleToggleTask(task.getId())}
                          className="mt-1 w-5 h-5 text-blue-600 rounded cursor-pointer"
                        />
                        <div className="flex-1">
                          <h3
                            className={`font-bold text-lg ${
                              task.getIsCompleted() ? "line-through text-gray-400" : "text-gray-800"
                            }`}
                          >
                            {task.getTitle()}
                          </h3>
                          {task.getDescription() && (
                            <p className="text-gray-600 text-sm mt-1">{task.getDescription()}</p>
                          )}
                          <div className="flex gap-2 mt-2">
                            <span
                              className="text-xs px-2 py-1 rounded-full text-white"
                              style={{ backgroundColor: categories.find((c) => c.getName() === task.getCategory())?.getColor() || "#3B82F6" }}
                            >
                              {task.getCategory()}
                            </span>
                            <span
                              className={`text-xs px-2 py-1 rounded-full text-white ${
                                task.getPriority() === "high"
                                  ? "bg-red-500"
                                  : task.getPriority() === "medium"
                                  ? "bg-yellow-500"
                                  : "bg-green-500"
                              }`}
                            >
                              {task.getPriority()}
                            </span>
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => handleDeleteTask(task.getId())}
                        className="text-red-600 hover:text-red-800 font-bold ml-4"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
