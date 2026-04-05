import { useEffect, useState } from "react";// import the function
/*לחזור שוב על סוגי הפונקציות  */
import TaskItem from "./TaskItem";//יבוא קומפוננטה 

type Task = {// Task tamplate object
  id: number;
  title: string;
  description: string;
  completed: boolean;
};

function TaskList() {
  const [tasks, setTasks] = useState<Task[]>([]);

  const [isLoading, setIsLoading] = useState(false);
  const [fetchError, setFetchError] = useState("");

  const [newTask, setNewTask] = useState("");
  const [newDescription, setNewDescription] = useState("");

  const [addError, setAddError] = useState("");
  const [deleteError, setDeleteError] = useState("");
  const [toggleError, setToggleError] = useState("");

  async function fetchTasks() {
    setIsLoading(true);
    setFetchError("");

    const startTime = Date.now();

    try {
      const response = await fetch("http://localhost:3000/tasks");

      if (!response.ok) {
        throw new Error("Failed to fetch tasks");
      }

      const data: Task[] = await response.json();
      setTasks(data);
    } catch (err) {
      setFetchError("Oops, the server failed. Please try again.");
      console.log(err);
    } finally {
      const elapsed = Date.now() - startTime;
      const minLoadingTime = 500;

      if (elapsed < minLoadingTime) {
        setTimeout(() => {
          setIsLoading(false);
        }, minLoadingTime - elapsed);
      } else {
        setIsLoading(false);
      }
    }
  }

  useEffect(() => {
    fetchTasks();
  }, []);

  async function handleToggle(id: number) {
    setToggleError("");

    const taskToUpdate = tasks.find((task) => task.id === id);

    if (!taskToUpdate) return;

    const updatedTask = {
      ...taskToUpdate,
      completed: !taskToUpdate.completed,
    };

    try {
      const response = await fetch(`http://localhost:3000/tasks/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedTask),
      });

      if (!response.ok) {
        throw new Error("Failed to update task");
      }

      setTasks((prevTasks) =>
        prevTasks.map((task) => (task.id === id ? updatedTask : task))
      );
    } catch (err) {
      console.log(err);
      setToggleError("Failed to update task");
    }
  }

  async function handleAddTask() {
    if (!newTask.trim()) return;

    setAddError("");

    try {
      const response = await fetch("http://localhost:3000/tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: newTask,
          description: newDescription,
          completed: false,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create task");
      }

      const data: Task = await response.json();

      setTasks([...tasks, data]);
      setNewTask("");
      setNewDescription("");
    } catch (err) {
      console.log(err);
      setAddError("Failed to add task");
    }
  }

  async function handleDeleteTask(id: number) {
    setDeleteError("");

    try {
      const response = await fetch(`http://localhost:3000/tasks/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete task");
      }

      const updatedTasks = tasks.filter((task) => task.id !== id);
      setTasks(updatedTasks);
    } catch (err) {
      console.log(err);
      setDeleteError("Failed to delete task");
    }
  }

  return (
    <div className="task-list">
      <h3 className="task-list-title">🌷 </h3>

      {isLoading ? (
        <div className="pretty-state-box">
          <div className="pretty-loader"></div>
          <p className="pretty-state-text">Loading tasks...</p>
        </div>
      ) : fetchError ? (
        <div className="pretty-state-box error-state-box">
          <div className="pretty-error-icon">✕</div>
          <p className="pretty-state-text">{fetchError}</p>
        </div>
      ) : (
        <>
          <div className="add-task">
            <input
              type="text"
              placeholder="✨ Add a new task..."
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
            />

            <input
              type="text"
              placeholder="📝 Add description..."
              value={newDescription}
              onChange={(e) => setNewDescription(e.target.value)}
            />

            <button onClick={handleAddTask}>✨ Add</button>
          </div>

          {addError && <p className="action-error-text">{addError}</p>}
          {deleteError && <p className="action-error-text">{deleteError}</p>}
          {toggleError && <p className="action-error-text">{toggleError}</p>}

          {tasks.length === 0 ? (
            <p className="empty-text">No tasks yet</p>
          ) : (
            tasks.map((task) => (
              <TaskItem
                key={task.id}
                task={task}
                onToggle={handleToggle}
                onDelete={handleDeleteTask}
              />
            ))
          )}
        </>
      )}
    </div>
  );
}

export default TaskList;
