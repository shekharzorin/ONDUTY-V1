import React, { useState } from "react";
import { FaSearch, FaEdit } from "react-icons/fa";
import Onduty_logo from "../assets/Onduty_logo.png";
import "../styles/styles.css";

const Dashboard = () => {
  // ----------------- STATE -----------------
  const [companies, setCompanies] = useState([
    {
      id: 1,
      name: "TechCorp",
      email: "techcorp@gmail.com",
      contact: "+91 9876543210",
      location: "Hyderabad",
      status: "Active",
      img: "https://via.placeholder.com/40",
    },
    {
      id: 2,
      name: "MediPlus",
      email: "mediplus@gmail.com",
      contact: "+91 9123456789",
      location: "Bangalore",
      status: "Inactive",
      img: "https://via.placeholder.com/40",
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("All Status");
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editForm, setEditForm] = useState({});
  const [newCompany, setNewCompany] = useState({
    name: "",
    email: "",
    contact: "",
    location: "",
    password: "",
  });

  // ----------------- FILTER -----------------
  const filteredCompanies = companies.filter((c) => {
    const matchesSearch = c.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesStatus =
      filterStatus === "All Status" ||
      (filterStatus === "Subscribed" && c.status === "Active") ||
      (filterStatus === "White Labeling" && c.status === "Inactive");
    return matchesSearch && matchesStatus;
  });

  // ----------------- HANDLERS -----------------
  const handleChange = (e) => {
    setNewCompany({ ...newCompany, [e.target.name]: e.target.value });
  };

  const handleAddCompany = () => {
    if (!newCompany.name || !newCompany.email) {
      alert("Please fill all required fields");
      return;
    }
    const newId = companies.length + 1;
    const added = { ...newCompany, id: newId, img: "https://via.placeholder.com/40", status: "Active" };
    setCompanies([...companies, added]);
    setShowAddForm(false);
    setNewCompany({ name: "", email: "", contact: "", location: "", password: "" });
  };

  const handleEdit = (company) => {
    setEditForm(company);
    setShowEditModal(true);
  };

  const handleEditFieldChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const handleSaveEdit = () => {
    setCompanies((prev) =>
      prev.map((c) => (c.id === editForm.id ? editForm : c))
    );
    setShowEditModal(false);
  };

  const handleDeleteCompany = (id) => {
    if (window.confirm("Are you sure you want to delete this company?")) {
      setCompanies(companies.filter((c) => c.id !== id));
      setShowEditModal(false);
    }
  };

  const overlayClickClose = (e) => {
    if (e.target.classList.contains("modal-overlay")) {
      setShowAddForm(false);
      setShowEditModal(false);
    }
  };

  // ----------------- RENDER -----------------
  return (
    <div className="layout">
      <main className="content">
        <div className="content-header">
          <h1>Companies</h1>
          <button className="add-btn" onClick={() => setShowAddForm(true)}>
            + Add Companies
          </button>
        </div>

        <div className="content-cards">
          <div className="card">
            <p>Total companies</p>
            <h2>{companies.length}</h2>
          </div>
          <div className="card">
            <p>Subscribed companies</p>
            <h2>03</h2>
          </div>
          <div className="card">
            <p>Trial companies</p>
            <h2>04</h2>
          </div>
        </div>

        <div className="search-box">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search company..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option>All Status</option>
            <option>White Labeling</option>
            <option>Subscribed</option>
          </select>
        </div>

        <div className="table-wrapper">
          <table className="table1">
            <thead>
              <tr>
                <th>ID</th>
                <th>Company Name</th>
                <th>Email</th>
                <th>Contact</th>
                <th>Location</th>
                <th className="status">Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredCompanies.map((c) => (
                <tr key={c.id}>
                  <td>{c.id}</td>
                  <td className="company-cell">
                    <img src={c.img} alt={c.name} className="company-img" />
                    <span>{c.name}</span>
                  </td>
                  <td>{c.email}</td>
                  <td>{c.contact}</td>
                  <td>{c.location}</td>
                  <td>
                    <button
                      className={`status-btn ${
                        c.status === "Active" ? "active" : "inactive"
                      }`}
                    >
                      {c.status}
                    </button>
                  </td>
                  <td
                    className="action-cell"
                    onMouseEnter={() => setActiveDropdown(c.id)}
                    onMouseLeave={() => setActiveDropdown(null)}
                  >
                    <button className="action-btn">⋯</button>
                    {activeDropdown === c.id && (
                      <div className="dropdown-menu">
                        <button onClick={() => handleEdit(c)}>
                          <FaEdit className="icon" /> Edit
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
              {filteredCompanies.length === 0 && (
                <tr>
                  <td colSpan="7" style={{ textAlign: "center", color: "#888" }}>
                    No companies to display
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </main>

      {/* Add Company Modal */}
      {showAddForm && (
        <div className="modal-overlay" onMouseDown={overlayClickClose}>
          <div className="modal-content" onMouseDown={(e) => e.stopPropagation()}>
            <h2>Add company</h2>

            <div className="form-group">
              <label>Company name</label>
              <input
                type="text"
                name="name"
                value={newCompany.name}
                onChange={handleChange}
                placeholder="Enter company name"
              />
            </div>

            <div className="form-group-row">
              <div className="form-group" style={{ flex: 1 }}>
                <label>Email</label>
                <input
                  type="email"
                  name="email"
                  value={newCompany.email}
                  onChange={handleChange}
                  placeholder="Enter email@gmail.com"
                />
              </div>
              <div className="form-group small" style={{ display: "flex", alignItems: "flex-end" }}>
                <button
                  type="button"
                  className="btn-otp"
                  onClick={() => {
                    if (!newCompany.email) {
                      alert("Please enter email before sending OTP");
                      return;
                    }
                    alert(`OTP sent to ${newCompany.email}`);
                  }}
                >
                  Send OTP
                </button>
              </div>
              <div className="form-group small">
                <label>Enter OTP</label>
                <input
                  type="text"
                  name="enterotp"
                  value={newCompany.enterotp || ""}
                  onChange={handleChange}
                  placeholder="Enter OTP"
                />
              </div>
            </div>

            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                name="password"
                value={newCompany.password || ""}
                onChange={handleChange}
                placeholder="Enter password"
              />
            </div>

            <div className="form-buttons">
              <button className="btn btn-cancel" onClick={() => setShowAddForm(false)}>
                Cancel
              </button>
              <button className="btn btn-primary" onClick={handleAddCompany}>
                Add
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Company Modal */}
      {showEditModal && (
        <div className="modal-overlay" onMouseDown={overlayClickClose}>
          <div className="edit-modal" onMouseDown={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setShowEditModal(false)}>
              ×
            </button>

            <h2 className="edit-title">Edit Company</h2>
            <div className="edit-sections">
              <div className="edit-section">
                <h3>Edit Company Details</h3>
                <label>Company name</label>
                <input
                  type="text"
                  name="name"
                  value={editForm.name}
                  onChange={handleEditFieldChange}
                />
                <div className="form-group-row">
                  <div className="form-group">
                    <label>Email</label>
                    <input
                      type="email"
                      name="email"
                      value={editForm.email}
                      onChange={handleEditFieldChange}
                    />
                  </div>
                  <div className="form-group">
                    <label>Contact no</label>
                    <input
                      type="text"
                      name="contact"
                      value={editForm.contact}
                      onChange={handleEditFieldChange}
                    />
                  </div>
                </div>
                <label>Location</label>
                <textarea
                  name="location"
                  value={editForm.location}
                  onChange={handleEditFieldChange}
                />
              </div>
            </div>

            <div className="edit-actions">
              <button className="save-btn" onClick={handleSaveEdit}>
                Save
              </button>
              <button
                className="delete-btn"
                onClick={() => handleDeleteCompany(editForm.id)}
              >
                Delete Company
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
