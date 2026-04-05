import { useState } from "react";

type Task = {
  id: number;
  title: string;
  description: string;
  completed: boolean;
};

type Props = {
  task: Task;
  onToggle: (id: number) => void;
  onDelete: (id: number) => void;
};

function TaskItem({ task, onToggle, onDelete }: Props) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(task.title);
  const [editedDescription, setEditedDescription] = useState(task.description);
  const [editError, setEditError] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  async function handleSaveEdit() {
    if (!editedTitle.trim()) return;

    setIsSaving(true);
    setEditError("");

    try {
      const updatedTask = {
        ...task,
        title: editedTitle,
        description: editedDescription,
      };

      const response = await fetch(`http://localhost:3000/tasks/${task.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedTask),
      });

      if (!response.ok) {
        throw new Error("Failed to update task");
      }

      setIsEditing(false);
      window.location.reload();
    } catch (err) {
      console.log(err);
      setEditError("Failed to edit task");
    } finally {
      setIsSaving(false);
    }
  }

  function handleCancelEdit() {
    setEditedTitle(task.title);
    setEditedDescription(task.description);
    setEditError("");
    setIsEditing(false);
  }

  return (
    <div className="task-item">
      <input
        type="checkbox"
        checked={task.completed}
        onChange={() => onToggle(task.id)}
      />

      {isEditing ? (
        <div className="task-text">
          <input
            type="text"
            value={editedTitle}
            onChange={(e) => setEditedTitle(e.target.value)}
            placeholder="Edit title..."
          />

          <input
            type="text"
            value={editedDescription}
            onChange={(e) => setEditedDescription(e.target.value)}
            placeholder="Edit description..."
          />

          <div className="task-buttons">
            <button onClick={handleSaveEdit} disabled={isSaving}>
              {isSaving ? "Saving..." : "💾 Save"}
            </button>
            <button onClick={handleCancelEdit} disabled={isSaving}>
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className="task-text">
            <span className={task.completed ? "completed-task" : ""}>
              {task.title}
            </span>

            <p className={task.completed ? "task-description completed-task" : "task-description"}>
              {task.description}
            </p>
          </div>

          <button onClick={() => setIsEditing(true)}>✏️ Edit</button>
          <button onClick={() => onDelete(task.id)}>❌ Delete</button>
        </>
      )}

      {editError && <p className="action-error-text">{editError}</p>}
    </div>
  );
}

export default TaskItem;