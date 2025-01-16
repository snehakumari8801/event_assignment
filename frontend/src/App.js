import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Dashboard from "./components/Dashboard";
import EventForm from "./components/EventForm";
import Login from "./components/Login";
import Register from "./components/Register";
import EditEvent from "./components/EditEvent";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/event/create" element={<EventForm />} />
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard/editEvent/:id" element={<EditEvent />} />
      </Routes>
    </Router>
  );
};

export default App;
