import React from "react";

const Dashboard = () => {
  return (
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

        {/* === ONE TABLE (Active + Inactive Rows) === */}
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
  );
};

export default Dashboard;
