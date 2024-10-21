import React from "react";
import { NavLink } from "react-router-dom";
import { FaListAlt, FaPlusSquare, FaBox, FaUsers } from "react-icons/fa";

const AdminMenu = () => {
  return (
    <>
      <div className="text-center">
        <div className="list-group dashboard-menu">
          <NavLink to="/dashboard/admin" className="" style={{ textDecoration: "none" }}>
            <h4>Admin Panel</h4>
          </NavLink>
          <NavLink to="/dashboard/admin/create-category" className="list-group-item list-group-item-action">
            <FaListAlt className="me-2" /> Create Category
          </NavLink>
          <NavLink to="/dashboard/admin/create-product" className="list-group-item list-group-item-action">
            <FaPlusSquare className="me-2" /> Create Product
          </NavLink>
          <NavLink to="/dashboard/admin/products" className="list-group-item list-group-item-action">
            <FaBox className="me-2" /> Products
          </NavLink>
          <NavLink to="/dashboard/admin/users" className="list-group-item list-group-item-action">
            <FaUsers className="me-2" /> Users
          </NavLink>
        </div>
      </div>
    </>
  );
};

export default AdminMenu;