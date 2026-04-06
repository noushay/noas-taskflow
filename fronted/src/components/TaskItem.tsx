import { useState } from "react";
import type { Task } from "./TaskList";

type Props = {
  task: Task;
  onToggle: (id: number) => void;
  onDelete: (id: number) => void;
  onSaveEdit: (
    id: number,
    updatedTitle: string,
    updatedDescription: string
  ) => void;
};

function formatDateTime(dateString?: string) {
  if (!dateString) return "Not available";

  const date = new Date(dateString);

  return date.toLocaleString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function TaskItem({ task, onToggle, onDelete, onSaveEdit }: Props) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(task.title);
  const [editedDescription, setEditedDescription] = useState(
    task.description || ""
  );

  function handleSaveEdit() {
    if (!editedTitle.trim()) return;
    onSaveEdit(task.id, editedTitle, editedDescription);
    setIsEditing(false);
  }

  function handleCancelEdit() {
    setEditedTitle(task.title);
    setEditedDescription(task.description || "");
    setIsEditing(false);
  }

  const wasEdited =
    task.updatedAt &&
    task.createdAt &&
    new Date(task.updatedAt).getTime() !== new Date(task.createdAt).getTime();

  return (
    <div className={`task-item-card ${task.completed ? "task-completed-card" : ""}`}>
      <input
        className="task-checkbox"
        type="checkbox"
        checked={task.completed}
        onChange={() => onToggle(task.id)}
      />

      <div className="task-text-content">
        {isEditing ? (
          <>
            <input
              className="edit-task-input"
              type="text"
              value={editedTitle}
              onChange={(event) => setEditedTitle(event.target.value)}
              placeholder="📝 Enter task title"
            />

            <textarea
              className="edit-task-textarea"
              value={editedDescription}
              onChange={(event) => setEditedDescription(event.target.value)}
              placeholder="🌷 Add task description"
            />
          </>
        ) : (
          <>
            <h3 className={`task-title ${task.completed ? "task-done-text" : ""}`}>
              {task.title}
            </h3>

            {task.description && (
              <p className={`task-description ${task.completed ? "task-done-text" : ""}`}>
                {task.description}
              </p>
            )}

            <div className="task-time-info">
              <p className="task-time-text">
                🕒 Created: {formatDateTime(task.createdAt)}
              </p>
              <p className="task-time-text">
                ✨ Last edited: {wasEdited ? formatDateTime(task.updatedAt) : "Not edited yet"}
              </p>
            </div>
          </>
        )}
      </div>

      <div className="task-buttons">
        {isEditing ? (
          <>
            <button className="save-task-button" onClick={handleSaveEdit}>
              💾 Save
            </button>
            <button className="cancel-edit-button" onClick={handleCancelEdit}>
              ✿ Cancel
            </button>
          </>
        ) : (
          <>
            <button className="edit-button" onClick={() => setIsEditing(true)}>
              Edit ↗
            </button>
            <button className="delete-button" onClick={() => onDelete(task.id)}>
              Delete
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default TaskItem;