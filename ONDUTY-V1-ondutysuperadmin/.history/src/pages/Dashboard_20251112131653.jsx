import React, { useEffect, useState } from "react";
import "../styles/styles.css"; // ✅ Uses your global styles
import { FaEdit, FaSearch, FaEye, FaEyeSlash } from "react-icons/fa";
import Onduty_logo from "../assets/Onduty_logo.png";
import { getAllAdmins } from "../backend-apis/api"

const CompaniesPage = () => {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [filterStatus, setFilterStatus] = useState("Subscribed");
  const [searchTerm, setSearchTerm] = useState("");
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [newCompany, setNewCompany] = useState({
    name: "",
    email: "",
    contact: "",
    location: "",
  });
  const [editForm, setEditForm] = useState({
    id: null,
    name: "",
    email: "",
    contact: "",
    location: "",
    subscription: "",
  });


   // ✅ Fetch data from backend
  useEffect(() => {
    const fetchAdmins = async () => {
      try {
        const admins = await getAllAdmins();
        setCompanies(admins);
      } catch (error) {
        console.error("Error fetching companies:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAdmins();
  }, []);


  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") {
        setShowAddForm(false);
        setShowEditModal(false);
        setActiveDropdown(null);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const handleChange = (e) => {
    setNewCompany({ ...newCompany, [e.target.name]: e.target.value });
  };

  const handleAddCompany = () => {
    if (!newCompany.name || !newCompany.email) {
      alert("Please fill all required fields");
      return;
    }
    const newEntry = {
      id: companies.length + 1,
      ...newCompany,
      img: "https://randomuser.me/api/portraits/lego/1.jpg",
      subscription: "Monthly",
      status: "Active",
    };
    setCompanies([...companies, newEntry]);
    setNewCompany({ name: "", email: "", contact: "", location: "" });
    setShowAddForm(false);
  };

  const handleEdit = (company) => {
    setSelectedCompany(company);
    setEditForm({
      id: company.id,
      name: company.name,
      email: company.email,
      contact: company.contact,
      location: company.location,
      subscription: company.subscription || "Monthly",
    });
    setShowEditModal(true);
    setActiveDropdown(null);
  };

  const handleEditFieldChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

 
  const overlayClickClose = (e) => {
    if (e.target.classList.contains("modal-overlay")) {
      setShowAddForm(false);
      setShowEditModal(false);
    }
  };

  const handleSaveEdit = () => {
    const updated = companies.map((c) =>
      c.id === editForm.id
        ? {
            ...c,
            name: editForm.name,
            email: editForm.email,
            contact: editForm.contact,
            location: editForm.location,
            subscription: editForm.subscription,
          }
        : c
    );
    setCompanies(updated);
    setShowEditModal(false);
    setSelectedCompany(null);
  };

  const handleDeleteCompany = (id) => {
    if (!window.confirm("Are you sure you want to delete this company?")) return;
    setCompanies(companies.filter((c) => c.id !== id));
    setShowEditModal(false);
    setSelectedCompany(null);
  };

  const filteredCompanies = companies.filter((company) =>
    company.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="layout">
      {/* === Sidebar === */}
      <aside className="sidebar">
        <div className="sidebar-logo">
          <img src={Onduty_logo} alt="Onduty" className="onduty-img" />
        </div>
        <div className="sidebar-menu">
          <button className="sidebar-item active">Dashboard</button>
        </div>
      </aside>

      {/* === Main Content === */}
      <main className="content">
        <div className="content-header">
          <h1>Companies</h1>
          <button className="add-btn" onClick={() => setShowAddForm(true)}>
            + Add Companies
          </button>
        </div>

        {loading ? (
          <p className="loading">Loading companies...</p>
        ) : (
          <>
            <div className="content-cards">
              <div className="card">
                <p>Total companies</p>
                <h2>{companies.length}</h2>
              </div>
              <div className="card">
                <p>Subscribed companies</p>
                <h2>{companies.filter((c) => c.status === "Active").length}</h2>
              </div>
              <div className="card">
                <p>Inactive companies</p>
                <h2>{companies.filter((c) => c.status === "Inactive").length}</h2>
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
                <option>Subscribed</option>
                <option>White Labeling</option>
              </select>
            </div>

            {/* === Companies Table === */}
            <div className="table-wrapper">
              <table className="table1">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Company Name</th>
                    <th>Email</th>
                    <th>Contact</th>
                    <th>Location</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCompanies.length > 0 ? (
                    filteredCompanies.map((c, index) => (
                      <tr key={c._id || index}>
                        <td>{index + 1}</td>
                        <td className="company-cell">
                          <img
                            src="https://randomuser.me/api/portraits/lego/1.jpg"
                            alt={c.name}
                            className="company-img"
                          />
                          <span>{c.name}</span>
                        </td>
                        <td>{c.email}</td>
                        <td>{c.contact || "N/A"}</td>
                        <td>{c.location || "N/A"}</td>
                        <td>
                          <button
                            className={`status-btn ${
                              c.status === "Active" ? "active" : "inactive"
                            }`}
                          >
                            {c.status || "Active"}
                          </button>
                        </td>
                        <td
                          className="action-cell"
                          onMouseEnter={() => setActiveDropdown(c._id)}
                          onMouseLeave={() => setActiveDropdown(null)}
                        >
                          <button className="action-btn">⋯</button>
                          {activeDropdown === c._id && (
                            <div className="dropdown-menu">
                              <button onClick={() => setEditForm(true)}>
                                <FaEdit className="icon" /> Edit
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="7" className="no-data">
                        No companies to display
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </>
        )}
      </main>

      {/* === Add Company Modal === */}
      {showAddForm && (
        <div className="modal-overlay" onMouseDown={overlayClickClose}>
          <div className="edit-modal" onMouseDown={(e) => e.stopPropagation()}>
            <h2 className="edit-title">Add company</h2>
            <button className="modal-close" onClick={() => setShowAddForm(false)}>
              ×
            </button>
            <div className="edit-section">
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
                <div className="form-group">
                  <label>Email</label>
                  <input
                    type="email"
                    name="email"
                    value={newCompany.email}
                    onChange={handleChange}
                    placeholder="Enter email@gmail.com"
                  />
                </div>
                <div className="form-group small">
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

              <div className="form-group password-group">
                <label>Password</label>
                <div className="password-wrapper">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={newCompany.password || ""}
                    onChange={handleChange}
                    placeholder="Enter password"
                  />
                  <span
                    className="password-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ?  <FaEye /> : <FaEyeSlash /> }
                  </span>
                </div>
              </div>
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

      {/* === Edit Company Modal === */}
      {showEditModal && (
        <div className="modal-overlay" onMouseDown={overlayClickClose}>
          <div className="edit-modal" onMouseDown={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setShowEditModal(true)}>
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
                  placeholder="Enter company name"
                />
                <div className="form-group-row">
                  <div className="form-group">
                    <label>Email</label>
                    <input
                      type="email"
                      name="email"
                      value={editForm.email}
                      onChange={handleEditFieldChange}
                      placeholder="Enter email@gmail.com"
                    />
                  </div>
                  <div className="form-group">
                    <label>Contact no</label>
                    <input
                      type="text"
                      name="contact"
                      value={editForm.contact}
                      onChange={handleEditFieldChange}
                      placeholder="+91 9876543210"
                    />
                  </div>
                </div>
                <label>Location</label>
                <textarea
                  name="location"
                  value={editForm.location}
                  onChange={handleEditFieldChange}
                  placeholder="Enter company location"
                />
              </div>

              <div className="edit-section">
                <h3 className="subscription">Subscriptions</h3>
                <label>Plan</label>
                <select
                  value={editForm.subscription}
                  onChange={(e) =>
                    setEditForm({ ...editForm, subscription: e.target.value })
                  }
                >
                  <option>Monthly</option>
                  <option>Yearly</option>
                </select>
                <div className="toggle-row">
                  <span>Set reminder</span>
                  <label className="switch">
                    <input
                      type="checkbox"
                      checked={editForm.reminder}
                      onChange={(e) =>
                        setEditForm({
                          ...editForm,
                          reminder: e.target.checked,
                        })
                      }
                    />
                    <span className="slider" />
                  </label>
                </div>
              </div>
            </div>

            <div className="edit-actions">
              <button className="save-btn" onClick={handleSaveEdit}>
                Save
              </button>
              <button className="delete-btn" onClick={() => handleDeleteCompany(editForm.id)}
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

export default CompaniesPage;
