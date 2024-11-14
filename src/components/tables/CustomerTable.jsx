import React, { useContext, useState, useRef, useEffect } from "react";

import { OverlayScrollbarsComponent } from "overlayscrollbars-react";
import {
  fetchPurchase,
  deletePurchase,
  updatePurchase,
} from "../../Helper/handle-api";
import Swal from "sweetalert2";
import EditPurchaseForm from "./editPurchase";
const CustomerTable = () => {
  const [purchases, setPurchases] = useState([]);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedPurchase, setSelectedPurchase] = useState(null);

  useEffect(() => {
    const getPurchase = async () => {
      const data = await fetchPurchase();
      setPurchases(data);
    };
    getPurchase();
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB"); // en-GB is used for DD/MM/YYYY format
  };

  const getPurchaseStatusColor = (status) => {
    switch (status) {
      case "On the way":
        return "orange";
      case "Cancelled":
        return "red";
      case "Item Received":
        return "green";
      default:
        return "black";
    }
  };

  const handleDelete = async (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await deletePurchase(id);
          setPurchases((prevPurchases) =>
            prevPurchases.filter((purchase) => purchase._id !== id)
          );
          Swal.fire("Deleted!", "The purchase has been deleted.", "success");
        } catch (error) {
          console.error("Error deleting purchase:", error);
          Swal.fire(
            "Error",
            "There was an issue deleting the purchase.",
            "error"
          );
        }
      }
    });
  };

  const handleEdit = (purchase) => {
    setSelectedPurchase(purchase);
    setShowEditModal(true);
  };

  const handleUpdate = async (updatedPurchase) => {
    try {
      await updatePurchase(updatedPurchase._id, updatedPurchase);
      setPurchases(
        purchases.map((p) =>
          p._id === updatedPurchase._id ? updatedPurchase : p
        )
      );
      Swal.fire("Updated!", "The purchase has been updated.", "success");
    } catch (error) {
      console.error("Error updating purchase:", error);
      Swal.fire("Error", "There was an issue updating the purchase.", "error");
    }
  };
  return (
    <>
      <OverlayScrollbarsComponent>
        <table
          className="table table-dashed table-hover digi-dataTable all-customer-table table-striped"
          id="allCustomerTable"
        >
          <thead>
            <tr>
              <th className="no-sort">
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="markAllCustomer"
                  />
                </div>
              </th>
              <th>ID</th>
              <th>Item</th>
              <th>Order By</th>
              <th>Date</th>
              <th>Supplier</th>
              <th>Phone</th>
              <th>Total</th>
              <th>Paid</th>
              <th>Balance</th>
              <th>Payment Status</th>
              <th>Payment Method</th>
              <th>Purchase Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {purchases.map((purchase) => (
              <tr key={purchase._id}>
                <td>
                  <div className="form-check">
                    <input className="form-check-input" type="checkbox" />
                  </div>
                </td>
                <td>{purchase.purchaseId}</td>
                <td>{purchase.item}</td>
                <td>{purchase.adminName}</td>
                <td>{formatDate(purchase.date)}</td> {/* Format the date */}
                <td>{purchase.supplier}</td>
                <td>{purchase.phone}</td>
                <td>{purchase.totalAmount}</td>
                <td>{purchase.paidAmount}</td>
                <td>{purchase.balance}</td>
                <td
                  style={{
                    color: purchase.paymentStatus === "Paid" ? "green" : "red", // Conditionally style the payment status
                  }}
                >
                  {purchase.paymentStatus}
                </td>
                <td>{purchase.paymentMethod}</td>
                <td
                  style={{
                    color: getPurchaseStatusColor(purchase.PurchasedStatus), // Conditionally style the purchase status
                  }}
                >
                  {purchase.PurchasedStatus}
                </td>
                <td>
                  <div>
                    <button
                      className="btn btn-primary"
                      onClick={() => handleEdit(purchase)}
                      style={{ marginRight: "5px" }}
                    >
                      <i className="fa-regular fa-pen-to-square"></i>
                    </button>
                    <button
                      className="btn btn-danger"
                      data-bs-toggle="modal"
                      data-bs-target="#deletePurchase"
                      onClick={() => handleDelete(purchase._id)}
                    >
                      <i className="fa-regular fa-trash-can"></i>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </OverlayScrollbarsComponent>
      <EditPurchaseForm
        show={showEditModal}
        handleClose={() => setShowEditModal(false)}
        purchase={selectedPurchase}
        handleUpdate={handleUpdate}
      />
    </>
  );
};

export default CustomerTable;
