import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";
import "./styles/styles.css";

const App = () => {
  return (
    <div className="main">
      <Sidebar />
     
    </div>
  );
};

export default App;
