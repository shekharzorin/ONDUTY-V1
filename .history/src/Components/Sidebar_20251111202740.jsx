import React from "react";
import { NavLink } from "react-router-dom";
import Onduty_logo from "../assets/Onduty_logo.png";
import "../styles/styles.css";

const Sidebar = () => {
  return (
    <div className="layout">
        <aside className="sidebar">
            <div className="sidebar-logo">
                <img src={Onduty_logo} alt="Onduty" className="onduty-img" />
            </div>

            <div className="sidebar-menu">
                <NavLink to="/dashboard" className={({ isActive }) => `sidebar-item ${isActive ? "active" : ""}`}>
                    Dashboard
                </NavLink>

                <NavLink to="/users" className={({ isActive }) => `sidebar-item ${isActive ? "active" : ""}`}>
                    Users List
                </NavLink>

                <NavLink to="/whitelabel" className={({ isActive }) => `sidebar-item ${isActive ? "active" : ""}`}>
                    White Label
                </NavLink>
            </div>
        </aside>
    </div>
  );
};

export default Sidebar;
