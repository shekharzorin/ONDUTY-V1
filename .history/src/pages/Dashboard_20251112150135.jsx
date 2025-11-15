import React, { useEffect, useState } from "react";
import "../styles/styles.css";
import { FaEdit, FaSearch, FaEye, FaEyeSlash, FaTrash } from "react-icons/fa";
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
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [newCompany, setNewCompany] = useState({
    name: "",
    email: "",
    password: "",
    plan: "none",
    planType: "monthly",
  });
  const [editForm, setEditForm] = useState({
    id: null,
    name: "",
    email: "",
    plan: "",
    planType: "",
  });

  // ✅ Fetch all admins
  useEffect(() => {
    const fetchAdmins = async () => {
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
        }));
        setCompanies(formatted);
      } catch (error) {
        console.error("❌ Error fetching companies:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAdmins();
  }, []);

  // ✅ ESC to close modals
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

  // ✅ Add admin (POST)
  const handleAddCompany = async () => {
    const { name, email, password, plan, planType } = newCompany;
    if (!name || !email || !password) {
      alert("Please fill all required fields!");
      return;
    }

    try {
      const response = await createAdmin({
        name,
        email,
        password,
        plan,
        planType,
      });

      if (response.success) {
        alert("✅ Admin added successfully!");
        setCompanies((prev) => [
          ...prev,
          {
            _id: response.data.id,
            name,
            email,
            mobile: "—",
            plan,
            planType,
            imageUrl: "",
          },
        ]);
        setShowAddForm(false);
        setNewCompany({
          name: "",
          email: "",
          password: "",
          plan: "none",
          planType: "monthly",
        });
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
      planType: company.planType || "monthly",
    });
    setShowEditModal(true);
    setActiveDropdown(null);
  };

  const handleEditFieldChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  // ✅ Save edit (PUT)
  const handleSaveEdit = async () => {
    try {
      const { id, name, email, plan, planType } = editForm;
      const response = await updateAdmin(id, { name, email, plan, planType });
      if (response.success) {
        alert("✅ Admin updated successfully!");
        setCompanies((prev) =>
          prev.map((c) => (c._id === id ? { ...c, name, email, plan, planType } : c))
        );
        setShowEditModal(false);
      }
    } catch (error) {
      alert("❌ Failed to update admin");
      console.error(error);
    }
  };

  // ✅ Delete admin (DELETE)
  const handleDeleteCompany = async (id) => {
    if (!window.confirm("Are you sure you want to delete this admin?")) return;
    try {
      const response = await deleteAdmin(id);
      if (response.success) {
        alert("🗑️ Admin deleted successfully!");
        setCompanies((prev) => prev.filter((c) => c._id !== id));
        setShowEditModal(false);
      }
    } catch (error) {
      alert("❌ Failed to delete admin");
      console.error(error);
    }
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
                <p>Total Profiles</p>
                <h2>{companies.length}</h2>
              </div>
            </div>

            <div className="search-box">
              <FaSearch className="search-icon" />
              <input
                type="text"
                placeholder="Search name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="table-wrapper">
              <table className="table1">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Mobile</th>
                    <th>Address</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCompanies.length > 0 ? (
                    filteredCompanies.map((c, index) => (
                      <tr key={c._id || index}>
                        <td>{index + 1}</td>
                        <td>
                          {c.imageUrl ? (
                            <div className="row">
                              <img src={c.imageUrl} alt={c.name} className="company-img" />
                              <td>{c.name}</td>
                            </div>
                          ) : (
                            <span>No Image</span>
                          )}
                        </td>
                        
                        <td>{c.email}</td>
                        <td>{c.mobile}</td>
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
                              <button onClick={() => handleDeleteCompany(c._id)}>
                                <FaTrash className="icon" /> Delete
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
              <label>Name</label>
              <input
                type="text"
                name="name"
                value={newCompany.name}
                onChange={handleChange}
                placeholder="Enter name"
              />

              <label>Email</label>
              <input
                type="email"
                name="email"
                value={newCompany.email}
                onChange={handleChange}
                placeholder="Enter email"
              />

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

              <label>Plan</label>
              <select name="plan" value={newCompany.plan} onChange={handleChange}>
                <option value="trial">Trial</option>
                <option value="silver">Silver</option>
                <option value="gold">Gold</option>
                <option value="diamond">Diamond</option>
                <option value="none">None</option>
              </select>

              <label>Plan Type</label>
              <select name="planType" value={newCompany.planType} onChange={handleChange}>
                <option value="monthly">Monthly</option>
                <option value="yearly">Yearly</option>
              </select>
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
              <input
                type="text"
                name="name"
                value={editForm.name}
                onChange={handleEditFieldChange}
              />

              <label>Email</label>
              <input
                type="email"
                name="email"
                value={editForm.email}
                onChange={handleEditFieldChange}
              />

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
              >
                <option value="monthly">Monthly</option>
                <option value="yearly">Yearly</option>
              </select>
            </div>

            <div className="edit-actions">
              <button className="save-btn" onClick={handleSaveEdit}>
                Save
              </button>
              <button
                className="delete-btn"
                onClick={() => handleDeleteCompany(editForm.id)}
              >
                Delete Admin
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CompaniesPage;
