import React, { useState } from "react";
import Onduty_logo from "../assets/Onduty_logo.png";
import "../";

const Sidebar = () => {
  const [activeTab, setActiveTab] = useState("dashboard");

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <img src={Onduty_logo} alt="Onduty" className="onduty-img" />
      </div>

      <div className="sidebar-menu">
        <button
          className={`sidebar-item ${activeTab === "dashboard" ? "active" : ""}`}
          onClick={() => setActiveTab("dashboard")}
        >
          Dashboard
        </button>

        <button
          className={`sidebar-item ${activeTab === "users" ? "active" : ""}`}
          onClick={() => setActiveTab("users")}
        >
          Users List
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
