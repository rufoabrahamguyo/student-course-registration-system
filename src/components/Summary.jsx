import { useEffect, useState } from "react";

export default function Summary() {
  const [selections, setSelections] = useState([]);
  const student = JSON.parse(localStorage.getItem("student")) || {};

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      const local = JSON.parse(localStorage.getItem("selections")) || [];
      setSelections(local);
      return;
    }
    (async () => {
      try {
        const res = await fetch("/api/selections/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) {
          const local = JSON.parse(localStorage.getItem("selections")) || [];
          setSelections(local);
          return;
        }
        const data = await res.json();
        setSelections(data?.selections || []);
      } catch {
        const local = JSON.parse(localStorage.getItem("selections")) || [];
        setSelections(local);
      }
    })();
  }, []);

  return (
    <div className="container">
      <h2>Registration Summary</h2>
      <p><strong>Name:</strong> {student.firstName} {student.lastName}</p>
      <p><strong>ID Number:</strong> {student.idNumber}</p>
      <p><strong>Selected Courses:</strong></p>
      <ul>
        {selections.map((s, i) => (
          <li key={i}>{s.course} — Lecturer: {s.lecturer}</li>
        ))}
      </ul>
    </div>
  );
}
  