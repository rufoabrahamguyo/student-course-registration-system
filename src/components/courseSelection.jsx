import { useState } from "react";
import { useNavigate } from "react-router-dom";

const courses = ["Programming With Frameworks", "Requirements Engineering", "Artificial Intelligence", "Computer Organisation", "Data Structures and Algorithms", "Management Information Systems"];
const lecturers = ["Prof John Kimani", "Ms.Gladys Ngoroge", "Ms.Leah Mutanu", "Dr.Martin Mburu", "Prof. David Oriedi"];

export default function CourseSelection() {
  const [selectedCourses, setSelectedCourses] = useState([]);
  const navigate = useNavigate();

//updates a specific field for the selected course at position index
  const handleSelect = (index, field, value) => {
    const updated = [...selectedCourses];
    updated[index] = { ...updated[index], [field]: value };
    setSelectedCourses(updated);
  };

// Get available courses for a specific row 
  const getAvailableCourses = (currentIndex) => {
    const selectedCourseNames = selectedCourses
      .map((c, i) => i !== currentIndex ? c.course : null)
      .filter(Boolean);
    return courses.filter(course => !selectedCourseNames.includes(course));
  };
//adding a new course selection if less than 5 courses are selected
  const addCourse = () => {
    if (selectedCourses.length < 5) {
      setSelectedCourses([...selectedCourses, { course: "", lecturer: "" }]);
    } else {
      alert("You can only select 5 courses");
    }
  };
// checking for duplicate lecturers and saving selections to local storage before navigating to summary page
  const handleSubmit = async () => {
    // Check if any course is selected without a lecturer
    const incompleteCourse = selectedCourses.find(c => c.course && !c.lecturer);
    if (incompleteCourse) {
      alert("Please select a lecturer for all courses!");
      return;
    }
    const lecturersUsed = selectedCourses.map(c => c.lecturer);
    if (new Set(lecturersUsed).size !== lecturersUsed.length) {
      alert("A lecturer cannot teach more than one course!");
      return;
    }
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("/api/selections", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
        body: JSON.stringify({ selections: selectedCourses }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        alert(data.message || "Failed to save selections");
        return;
      }
      // Fallback keep in localStorage for Summary if backend unavailable later
      localStorage.setItem("selections", JSON.stringify(selectedCourses));
      navigate("/summary");
    } catch (err) {
      alert("Network error saving selections");
    }
  };

  return (
    <div className="container">
      <h2>Select Courses (Max 5)</h2>
      {selectedCourses.map((c, i) => (
        <div key={i} className="course-selection-row">
          <select onChange={(e) => handleSelect(i, "course", e.target.value)} value={c.course}>
            <option value="">Select course</option>
            {getAvailableCourses(i).map(course => <option key={course}>{course}</option>)}
          </select>

          <select onChange={(e) => handleSelect(i, "lecturer", e.target.value)} value={c.lecturer}>
            <option value="">Select lecturer</option>
            {lecturers.map(lec => <option key={lec}>{lec}</option>)}
          </select>
        </div>
      ))}
      <button onClick={addCourse}>Add Course</button>
      <button onClick={handleSubmit}>Submit</button>
    </div>
  );
}
