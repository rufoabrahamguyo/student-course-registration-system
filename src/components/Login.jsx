import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [login, setLogin] = useState({ email: "", password: "" });
  const navigate = useNavigate();

//Handles the user inputs
  const handleChange = (e) => {
    setLogin({ ...login, [e.target.name]: e.target.value });
  };
//Validates user credentials and navigates to course selection page if valid
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(login),
      });
      const data = await res.json();
      if (!res.ok) {
        alert(data.message || "Login failed");
        return;
      }
      localStorage.setItem("token", data.token);
      localStorage.setItem("student", JSON.stringify({
        firstName: data.user.firstName,
        lastName: data.user.lastName,
        idNumber: data.user.idNumber,
        email: data.user.email,
      }));
      navigate("/courses");
    } catch (err) {
      alert("Network error during login");
    }
  };

  return (
    <div className="container">
      <h2>Student Login</h2>
      <form onSubmit={handleSubmit}>
        <input name="email" placeholder="Email" onChange={handleChange} required />
        <input type="password" name="password" placeholder="Password" onChange={handleChange} required />
        <button type="submit">Login</button>
      </form>
    </div>
  );
}
