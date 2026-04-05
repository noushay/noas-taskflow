import TaskList from "./components/TaskList";// יבוא קומפוננטות 
import "./App.css";

function App() {// קומפוננטה בשם אפ
  return (
    <div className="app-container">
      <div className="app">
        <h1>🧚 TaskFlow 🌸</h1>
        <p className="subtitle">My task list💖</p>
        <TaskList />
      </div>
    </div>
  );
}// החזר של הקומפוננטה, מה שמוצג על המסך 

export default App;