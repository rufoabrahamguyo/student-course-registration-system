
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

export default function Register() {
  const [formData, setFormData] = useState({//initial state for the form data
    firstName: "",
    lastName: "",
    idNumber: "",
    email: "",
    password: "",
  });

  const navigate = useNavigate();//navigate to the login page

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      //register the user
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },//set the headers for the request
        body: JSON.stringify(formData),//set the body for the request
      });
      if (!res.ok) {//if the request is not successful, show an error message
        const data = await res.json().catch(() => ({}));//get the data from the response
        alert(data.message || "Registration failed");
        return;
      }
      // For convenience keep basic student info locally for Summary
      localStorage.setItem("student", JSON.stringify({
        firstName: formData.firstName,
        lastName: formData.lastName,
        idNumber: formData.idNumber,
        email: formData.email,
      }));
      navigate("/login");
    } catch (err) {
      alert("Network error during registration");
    }
  };

  return (
    <div className="container">
      <h2>Student Registration</h2>
      <form onSubmit={handleSubmit}>
        <input name="firstName" placeholder="First Name" onChange={handleChange} required />
        <input name="lastName" placeholder="Last Name" onChange={handleChange} required />
        <input name="idNumber" placeholder="ID Number" onChange={handleChange} required />
        <input type="email" name="email" placeholder="Email" onChange={handleChange} required />
        <input type="password" name="password" placeholder="Password" onChange={handleChange} required />
        <button type="submit">Register</button>
      </form>
      <p style={{ marginTop: "1rem", textAlign: "center" }}>
        Already have an account? <Link to="/login">Login</Link>
      </p>
    </div>
  );
}
