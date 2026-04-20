import { useEffect, useState } from "react";
import TaskItem from "./TaskItem";

export type Task = {
  id: number;
  title: string;
  description?: string;
  completed: boolean;
  createdAt?: string;
  updatedAt?: string;
};

function TaskList() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [fetchError, setFetchError] = useState("");

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskDescription, setNewTaskDescription] = useState("");
  const [addError, setAddError] = useState("");

  const [deleteTaskId, setDeleteTaskId] = useState<number | null>(null);
  const [deleteError, setDeleteError] = useState("");
  const [toggleError, setToggleError] = useState("");
  const [editError, setEditError] = useState("");

  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchTasks();
  }, []);

  function sortTasks(taskList: Task[]) {
    const unfinishedTasks = taskList.filter((task) => !task.completed);
    const finishedTasks = taskList.filter((task) => task.completed);
    return [...unfinishedTasks, ...finishedTasks];
  }

  async function fetchTasks() {
    setIsLoading(true);
    setFetchError("");

    try {
      const response = await fetch("http://localhost:3000/tasks");

      if (!response.ok) {
        throw new Error("Failed to fetch tasks");
      }

      const data: Task[] = await response.json();
      setTasks(sortTasks(data));
    } catch (error) {
      console.log(error);
      setFetchError("Oops, failed to load tasks.");
    } finally {
      setIsLoading(false);
    }
  }

  async function addTask() {
    if (!newTaskTitle.trim()) {
      setAddError("Please enter a task title.");
      return;
    }

    setAddError("");

    try {
      const response = await fetch("http://localhost:3000/tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: newTaskTitle,
          description: newTaskDescription,
          completed: false,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to add task");
      }

      const createdTask: Task = await response.json();

      setTasks((currentTasks) => [createdTask, ...currentTasks]);
      setNewTaskTitle("");
      setNewTaskDescription("");
      setIsAddModalOpen(false);
    } catch (error) {
      console.log(error);
      setAddError("Oops, failed to save the task.");
    }
  }

  async function toggleTask(id: number) {
    setToggleError("");

    const taskToUpdate = tasks.find((task) => task.id === id);
    if (!taskToUpdate) return;

    const updatedCompletedValue = !taskToUpdate.completed;

    try {
      const response = await fetch(`http://localhost:3000/tasks/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: taskToUpdate.title,
          description: taskToUpdate.description,
          completed: updatedCompletedValue,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update task");
      }

      const updatedTask: Task = await response.json();

      setTasks((currentTasks) =>
        sortTasks(
          currentTasks.map((task) =>
            task.id === id ? updatedTask : task
          )
        )
      );
    } catch (error) {
      console.log(error);
      setToggleError("Oops, failed to update the task.");
    }
  }

  async function saveEditedTask(
    id: number,
    updatedTitle: string,
    updatedDescription: string
  ) {
    setEditError("");

    const taskToUpdate = tasks.find((task) => task.id === id);
    if (!taskToUpdate) return;

    try {
      const response = await fetch(`http://localhost:3000/tasks/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: updatedTitle,
          description: updatedDescription,
          completed: taskToUpdate.completed,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to edit task");
      }

      const updatedTask: Task = await response.json();

      setTasks((currentTasks) =>
        currentTasks.map((task) => (task.id === id ? updatedTask : task))
      );
    } catch (error) {
      console.log(error);
      setEditError("Oops, failed to edit the task.");
    }
  }

  function askDeleteTask(id: number) {
    setDeleteTaskId(id);
  }

  function cancelDeleteTask() {
    setDeleteTaskId(null);
  }

  async function confirmDeleteTask() {
    if (deleteTaskId === null) return;

    setDeleteError("");

    try {
      const response = await fetch(
        `http://localhost:3000/tasks/${deleteTaskId}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete task");
      }

      setTasks((currentTasks) =>
        currentTasks.filter((task) => task.id !== deleteTaskId)
      );
      setDeleteTaskId(null);
    } catch (error) {
      console.log(error);
      setDeleteError("Oops, failed to delete the task.");
    }
  }

  const filteredTasks = tasks.filter((task) => {
    const search = searchTerm.toLowerCase();
    return (
      task.title.toLowerCase().includes(search) ||
      (task.description ?? "").toLowerCase().includes(search)
    );
  });

  return (
    <div className="task-list-wrapper">
      <div className="task-top-bar">
        <h2 className="task-heading">🧚 My Tasks</h2>

        <button
          className="open-add-task-button"
          onClick={() => setIsAddModalOpen(true)}
        >
          🧚 Add Task
        </button>
      </div>

      <input
        type="text"
        placeholder="🔎 Search tasks..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="task-search-input"
        style={{
          margin: "10px 0 15px 0",
          padding: "10px 14px",
          borderRadius: "12px",
          border: "1px solid #ddd",
          width: "100%",
          fontSize: "14px",
        }}
      />

      {isAddModalOpen && (
        <div className="custom-modal-overlay">
          <div className="custom-modal-card modal-enter">
            <h3 className="custom-modal-title">🧚 Add New Task</h3>

            <input
              className="task-input"
              type="text"
              placeholder="🧚 Enter task title"
              value={newTaskTitle}
              onChange={(event) => setNewTaskTitle(event.target.value)}
            />

            <textarea
              className="task-textarea"
              placeholder="🧚 Add task description"
              value={newTaskDescription}
              onChange={(event) => setNewTaskDescription(event.target.value)}
            />

            {addError && <p className="task-error">{addError}</p>}

            <div className="custom-modal-actions">
              <button className="save-task-button" onClick={addTask}>
                💾 Save
              </button>
              <button
                className="cancel-task-button"
                onClick={() => {
                  setIsAddModalOpen(false);
                  setNewTaskTitle("");
                  setNewTaskDescription("");
                  setAddError("");
                }}
              >
                🌸 Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {deleteTaskId !== null && (
        <div className="custom-modal-overlay">
          <div className="custom-modal-card delete-modal-card modal-enter">
            <h3 className="custom-modal-title">🗑️ Delete Task</h3>
            <p className="delete-modal-text">
              Are you sure you want to delete this task?
            </p>

            <div className="custom-modal-actions">
              <button className="delete-confirm-button" onClick={confirmDeleteTask}>
                Yes, Delete
              </button>
              <button className="cancel-task-button" onClick={cancelDeleteTask}>
                Keep It
              </button>
            </div>
          </div>
        </div>
      )}

      {fetchError && <p className="task-error">{fetchError}</p>}
      {toggleError && <p className="task-error">{toggleError}</p>}
      {deleteError && <p className="task-error">{deleteError}</p>}
      {editError && <p className="task-error">{editError}</p>}

      {isLoading ? (
        <div className="pretty-state-box">
          <div className="pretty-loader"></div>
          <p className="pretty-state-text">Loading your fairy tasks...</p>
        </div>
      ) : filteredTasks.length === 0 ? (
        <div className="pretty-state-box">
          <p className="pretty-state-text">No matching tasks 🌸</p>
        </div>
      ) : (
        <div className="task-items-section">
          {filteredTasks.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              onToggle={toggleTask}
              onDelete={askDeleteTask}
              onSaveEdit={saveEditedTask}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default TaskList;