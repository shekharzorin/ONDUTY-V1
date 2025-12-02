import React, { useEffect, useState } from "react";
import "../styles/styles.css";
import { FaEdit, FaSearch, FaEye, FaEyeSlash } from "react-icons/fa";
import Onduty_logo from "../assets/Onduty_logo.png";
import {
  getAllAdmins,
  createAdmin,
  updateAdmin,
  deleteAdmin,
} from "../backend-apis/api";

const CompaniesPage = () => {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [hoveredStatus, setHoveredStatus] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [trialCount, setTrialCount] = useState(0);
  const [newCompany, setNewCompany] = useState({
    name: "",
    email: "",
    password: "",
    plan: "trial",
    planType: "monthly",
  });
  const [editForm, setEditForm] = useState({
    id: null,
    name: "",
    email: "",
    plan: "",
    planType: "",
  });

  // ✅ Fetch admins with tracking data
  const fetchAndUpdateAdmins = async () => {
    try {
      const admins = await getAllAdmins();

      const formatted = admins.map((admin) => ({
        _id: admin._id,
        name: admin.name,
        email: admin.email,
        mobile: admin?.profile?.mobile || "—",
        plan: admin.plan,
        planType: admin.planType || "—",
        imageUrl: admin.profile?.image || null,
        address: admin.tracking?.address || "Unknown",
        status: admin.tracking?.status || "inactive",
        updatedAt: admin.tracking?.lastUpdated || "—",
      }));

      setCompanies(formatted);
      const trialUsers = admins.filter((admin) => admin.plan === "trial").length;
      setTrialCount(trialUsers);
    } catch (error) {
      console.error("❌ Error fetching companies:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAndUpdateAdmins();
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
    const { name, value } = e.target;

    // If plan is changed to trial, clear planType
    if (name === "plan" && value === "trial") {
      setNewCompany({ ...newCompany, plan: value, planType: "" });
    } else {
      setNewCompany({ ...newCompany, [name]: value });
    }
  };

const handleAddCompany = async () => {
  const { name, email, password, plan, planType } = newCompany;
  if (!name || !email || !password) {
    alert("Please fill all required fields!");
    return;
  }

  // Only include planType if plan is a paid plan
  const payload = { name, email, password, plan };
  if (["silver", "gold", "diamond"].includes(plan)) {
    payload.planType = planType; // send only for paid plans
  }

  try {
    const response = await createAdmin(payload);
    if (response.success) {
      alert("✅ Admin added successfully!");
      await fetchAndUpdateAdmins();
      setShowAddForm(false);
      setNewCompany({ name: "", email: "", password: "", plan: "none", planType: "" });
    }
  } catch (error) {
    alert("❌ Failed to add admin: " + error.response?.data?.message);
    console.error(error);
  }
};

  const overlayClickClose = (e) => {
    if (e.target.classList.contains("modal-overlay")) {
      setShowAddForm(false);
      setShowEditModal(false);
    }
  };

  const handleEdit = (company) => {
    setSelectedCompany(company);
    setEditForm({
      id: company._id,
      name: company.name,
      email: company.email,
      plan: company.plan || "none",
      planType: company.planType || "monthly", // default for paid plans
    });
    setShowEditModal(true);
    setActiveDropdown(null);
  };

  const handleEditFieldChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

const handleSaveEdit = async () => {
  try {
    const { id, name, email, plan, planType } = editForm;

    const payload = { name, email, plan };
    if (["silver", "gold", "diamond"].includes(plan)) {
      payload.planType = planType; // send only for paid plans
    }

    const response = await updateAdmin(id, payload);

    if (response.success) {
      alert("✅ Admin updated successfully!");
      await fetchAndUpdateAdmins();
      setShowEditModal(false);
    }
  } catch (error) {
    const msg =
      error.response?.data?.message || "Failed to update admin. Please try again.";
    alert("❌ " + msg);
    console.error(error);
  }
};


  const handleDeleteCompany = async (id) => {
    try {
      const response = await deleteAdmin(id);
      if (response.success) {
        alert("🗑️ Admin deleted successfully!");
        await fetchAndUpdateAdmins();
        setShowEditModal(false);
        setShowDeleteConfirm(false);
        setDeleteConfirmText("");
      }
    } catch (error) {
      alert("❌ Failed to delete admin");
      console.error(error);
    }
  };

  // ✅ Filter by name/email + status
  const filteredCompanies = companies.filter((c) => {
    const matchesSearch =
      c.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" ? true : c.status.toLowerCase() === statusFilter;
    return matchesSearch && matchesStatus;
  });

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
          <h1>Admin Profiles</h1>
          <button className="btn btn-primary" onClick={() => setShowAddForm(true)}>
            + Add Admin
          </button>
        </div>

        {loading ? (
          <p className="loading">Loading profiles...</p>
        ) : (
          <>
            <div className="content-cards">
              <div className="card">
                <p>Total Subscriptions</p>
                <h2>{companies.length}</h2>
              </div>
              <div className="card">
                <p>Trial Plan Users</p>
                <h2>{trialCount}</h2>
              </div>
            </div>

            {/* 🔍 Search + Filter */}
            <div className="search-filter-box">
              <div className="search-box">
                <FaSearch className="search-icon" />
                <input
                  type="text"
                  placeholder="Search name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <select
                className="filter-dropdown"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>

            {/* 🧾 Table */}
            <div className="table-wrapper">
              <table className="table1">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Mobile</th>
                    <th>Address</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCompanies.length > 0 ? (
                    filteredCompanies.map((c, index) => (
                      <tr key={c._id || index}>
                        <td>{index + 1}</td>
                        <td>
                          <div className="row">
                            <img src={c.imageUrl} className="company-img" alt="" />
                            <span>{c.name}</span>
                          </div>
                        </td>
                        <td>{c.email}</td>
                        <td>{c.mobile}</td>
                        <td>{c.address}</td>
                        <td
                          className={`status-cell ${c.status === "active" ? "green" : "red"}`}
                          onMouseEnter={() => setHoveredStatus(c._id)}
                          onMouseLeave={() => setHoveredStatus(null)}
                        >
                          {c.status}
                          {hoveredStatus === c._id && (
                            <div className="status-tooltip">
                              <p>Status: {c.status}</p>
                              <p>Updated: {c.updatedAt}</p>
                            </div>
                          )}
                        </td>
                        <td
                          className="action-cell"
                          onMouseEnter={() => setActiveDropdown(c._id)}
                          onMouseLeave={() => setActiveDropdown(null)}
                        >
                          <button className="action-btn">⋯</button>
                          {activeDropdown === c._id && (
                            <div className="dropdown-menu">
                              <button onClick={() => handleEdit(c)}>
                                <FaEdit className="icon" /> Edit
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="8" className="no-data">
                        No profiles to display
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </>
        )}
      </main>

      {/* === Add Admin Modal === */}
      {showAddForm && (
        <div className="modal-overlay" onMouseDown={overlayClickClose}>
          <div className="edit-modal" onMouseDown={(e) => e.stopPropagation()}>
            <h2 className="edit-title">Add Admin</h2>
            <button className="modal-close" onClick={() => setShowAddForm(false)}>
              ×
            </button>

            <div className="edit-section">
              {/* Name */}
              <label>Name</label>
              <input
                type="text"
                name="name"
                value={newCompany.name}
                onChange={handleChange}
                placeholder="Enter name"
              />

              {/* Email */}
              <label>Email</label>
              <input
                type="email"
                name="email"
                value={newCompany.email}
                onChange={handleChange}
                placeholder="Enter email"
              />

              {/* Password */}
              <label>Password</label>
              <div className="password-wrapper">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={newCompany.password}
                  onChange={handleChange}
                  placeholder="Enter password"
                />
                <span className="password-toggle" onClick={() => setShowPassword(!showPassword)}>
                  <FaEye className={`password-icon ${showPassword ? "visible" : "hidden"}`} />
                  <FaEyeSlash className={`password-icon ${showPassword ? "hidden" : "visible"}`} />
                </span>
              </div>

              {/* Plan */}
              <label>Plan</label>
              <select name="plan" value={newCompany.plan} onChange={handleChange}>
                <option value="trial">Trial</option>
                <option value="silver">Silver</option>
                <option value="gold">Gold</option>
                <option value="diamond">Diamond</option>
              </select>

              {/* Plan Type */}
              <label>Plan Type</label>
              <select
                name="planType"
                value={newCompany.planType}
                onChange={handleChange}
                disabled={newCompany.plan === "trial"} // <-- disable for trial
              >
                <option value="monthly">Monthly</option>
                <option value="yearly">Yearly</option>
              </select>
            </div>

            {/* Buttons */}
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

      {/* === Edit Admin Modal === */}
      {showEditModal && (
        <div className="modal-overlay" onMouseDown={overlayClickClose}>
          <div className="edit-modal" onMouseDown={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setShowEditModal(false)}>
              ×
            </button>
            <h2 className="edit-title">Edit Admin</h2>

            <div className="edit-section">
              <label>Name</label>
              <input type="text" name="name" value={editForm.name} onChange={handleEditFieldChange} />
              <label>Email</label>
              <input type="email" name="email" value={editForm.email} onChange={handleEditFieldChange} />
              <label>Plan</label>
              <select name="plan" value={editForm.plan} onChange={handleEditFieldChange}>
                <option value="trial">Trial</option>
                <option value="silver">Silver</option>
                <option value="gold">Gold</option>
                <option value="diamond">Diamond</option>
                <option value="none">None</option>
              </select>
              <label>Plan Type</label>
              <select
                name="planType"
                value={editForm.planType}
                onChange={handleEditFieldChange}
                disabled={editForm.plan === "trial"} // <-- disable for trial
              >
                <option value="monthly">Monthly</option>
                <option value="yearly">Yearly</option>
              </select>
            </div>

            <div className="edit-actions">
              <button className="save-btn" onClick={handleSaveEdit}>
                Save
              </button>

              <button className="delete-btn" onClick={() => setShowDeleteConfirm(true)}>
                Delete Admin
              </button>

              {showDeleteConfirm && (
                <div className="delete-confirm-overlay">
                  <div className="delete-confirm">
                    <p>Type <strong>{editForm.name}</strong> to confirm deletion:</p>
                    <input
                      type="text"
                      value={deleteConfirmText}
                      onChange={(e) => setDeleteConfirmText(e.target.value)}
                      placeholder="Enter admin name"
                    />
                    <button
                      className="delete-btn"
                      disabled={deleteConfirmText !== editForm.name}
                      onClick={() => handleDeleteCompany(editForm.id)}
                    >
                      Confirm Delete
                    </button>
                    <button
                      className="btn btn-cancel"
                      onClick={() => {
                        setShowDeleteConfirm(false);
                        setDeleteConfirmText("");
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CompaniesPage;
