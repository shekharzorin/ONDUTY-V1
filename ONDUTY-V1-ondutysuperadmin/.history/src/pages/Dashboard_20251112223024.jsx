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

  // ✅ Fetch all admins with tracking
  const fetchAndUpdateAdmins = async () => {
    try {
      const response = await getAllAdmins();

      const formatted = response.map((admin) => ({
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

      const trialUsers = response.filter((admin) => admin.plan === "trial").length;
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

  // ✅ Add Admin
  const handleAddCompany = async () => {
    const { name, email, password, plan, planType } = newCompany;
    if (!name || !email || !password) {
      alert("Please fill all required fields!");
      return;
    }

    try {
      const response = await createAdmin({ name, email, password, plan, planType });
      if (response.success) {
        alert("✅ Admin added successfully!");
        await fetchAndUpdateAdmins();
        setShowAddForm(false);
        setNewCompany({ name: "", email: "", password: "", plan: "none", planType: "monthly" });
      }
    } catch (error) {
      alert("❌ Failed to add admin: " + error.response?.data?.message);
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

  // ✅ Save Edit
  const handleSaveEdit = async () => {
    try {
      const { id, name, email, plan, planType } = editForm;
      const response = await updateAdmin(id, { name, email, plan, planType });
      if (response.success) {
        alert("✅ Admin updated successfully!");
        await fetchAndUpdateAdmins();
        setShowEditModal(false);
      }
    } catch (error) {
      alert("❌ Failed to update admin");
      console.error(error);
    }
  };

  // ✅ Delete Admin
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
    }
  };

  // ✅ Filtered + Search
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
    </div>
  );
};

export default CompaniesPage;
