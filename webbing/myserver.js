import express from "express";
import cors from "cors";
import sequelize from "./databaseconnection.js";
import Task from "./models/task.js";

const app = express();
const PORT = 3000;

// 🔥 middleware
app.use(cors());
app.use(express.json());

// 🔹 בדיקה
app.get("/", (req, res) => {
  res.send("Server is running 🚀");
});

// 🔹 קבלת כל המשימות
app.get("/tasks", async (req, res) => {
  try {
    const tasks = await Task.findAll();
    res.json(tasks);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch tasks" });
  }
});

// 🔹 יצירת משימה
app.post("/tasks", async (req, res) => {
  try {
    const { title, description, completed } = req.body;

    const newTask = await Task.create({
      title,
      description,
      completed: completed || false,
    });

    res.status(201).json(newTask);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to create task" });
  }
});

// 🔹 עדכון משימה
app.put("/tasks/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const task = await Task.findByPk(id);

    if (!task) {
      return res.status(404).json({ error: "Task not found" });
    }

    await task.update(req.body);
    res.json(task);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to update task" });
  }
});

// 🔹 מחיקת משימה
app.delete("/tasks/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const task = await Task.findByPk(id);

    if (!task) {
      return res.status(404).json({ error: "Task not found" });
    }

    await task.destroy();
    res.json({ message: "Task deleted" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to delete task" });
  }
});

// 🔥 הפעלת השרת
async function startServer() {
  try {
    await sequelize.authenticate();
    console.log("Connected to Postgres with Sequelize!");

    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Unable to connect to DB:", error);
  }
}

startServer();