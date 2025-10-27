import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Register from "./components/Register";
import Login from "./components/Login";
import CourseSelection from "./components/courseSelection";
import Summary from "./components/Summary";


function App() {
  

  return (
    <Router>
    <Routes>
      <Route path="/" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route path="/courses" element={<CourseSelection />} />
      <Route path="/summary" element={<Summary />} />
    </Routes>
  </Router>
  )
}

export default App
