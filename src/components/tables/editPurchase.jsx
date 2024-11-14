import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { fetchAdmins } from "../../Helper/handle-api";

const EditPurchaseForm = ({ show, handleClose, purchase, handleUpdate }) => {
  const [editedPurchase, setEditedPurchase] = useState(purchase || {});

  useEffect(() => {
    setEditedPurchase(purchase);
    getAdmins();
  }, [purchase]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Update the editedPurchase with new values and calculate balance
    setEditedPurchase((prev) => {
      const updatedPurchase = { ...prev, [name]: value };

      // Calculate balance if totalAmount and paidAmount are available
      if (name === "totalAmount" || name === "paidAmount") {
        const totalAmount = parseFloat(updatedPurchase.totalAmount) || 0;
        const paidAmount = parseFloat(updatedPurchase.paidAmount) || 0;
        const balance = totalAmount - paidAmount;

        updatedPurchase.balance = balance;

        // Update payment status based on balance
        if (balance === 0) {
          updatedPurchase.paymentStatus = "Paid";
        } else if (balance > 0) {
          updatedPurchase.paymentStatus = "Pending";
        }
      }

      return updatedPurchase;
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleUpdate(editedPurchase);
    handleClose();
  };

  const [admins, setAdmins] = useState([]);
  //get all admins
  const getAdmins = async () => {
    try {
      const response = await fetchAdmins();
      if (Array.isArray(response)) {
        setAdmins(response); // Set response directly as it's already an array
      } else {
        setAdmins([]); // Ensure fallback to empty array if something's wrong
        console.error("Expected an array, but got:", response);
      }
    } catch (error) {
      console.error("Error fetching admins:", error);
    }
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Edit Purchase</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Item</Form.Label>
            <Form.Control
              type="text"
              name="item"
              value={editedPurchase?.item || ""}
              onChange={handleChange}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Supplier</Form.Label>
            <Form.Control
              type="text"
              name="supplier"
              value={editedPurchase?.supplier || ""}
              onChange={handleChange}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Admin</Form.Label>
            <Form.Select
              name="adminName"
              value={editedPurchase?.adminName || ""}
              onChange={handleChange}
            >
              <option value="">Select Admin</option>
              {admins.map((admin) => (
                <option key={admin._id} value={admin.name}>
                  {admin.name}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Phone</Form.Label>
            <Form.Control
              type="text"
              name="phone"
              value={editedPurchase?.phone || ""}
              onChange={handleChange}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="text"
              name="email"
              value={editedPurchase?.email || ""}
              onChange={handleChange}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Payment Method</Form.Label>
            <Form.Control
              type="text"
              name="paymentMethod"
              value={editedPurchase?.paymentMethod || ""}
              onChange={handleChange}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Total Amount</Form.Label>
            <Form.Control
              type="number"
              name="totalAmount"
              value={editedPurchase?.totalAmount || ""}
              onChange={handleChange}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Paid Amount</Form.Label>
            <Form.Control
              type="number"
              name="paidAmount"
              value={editedPurchase?.paidAmount || ""}
              onChange={handleChange}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Balance</Form.Label>
            <Form.Control
              type="text"
              name="balance"
              value={editedPurchase?.balance || ""}
              onChange={handleChange}
              readOnly
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Purchase Status</Form.Label>
            <Form.Select
              name="PurchasedStatus"
              value={editedPurchase?.PurchasedStatus || ""}
              onChange={handleChange}
            >
              <option value="On the way">On the way</option>
              <option value="Cancelled">Cancelled</option>
              <option value="Item Received">Item Received</option>
            </Form.Select>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Payment Status</Form.Label>
            <Form.Control
              type="text"
              name="paymentStatus"
              value={editedPurchase?.paymentStatus || ""}
              readOnly
            />
          </Form.Group>
          <Button variant="primary" type="submit">
            Update Purchase
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default EditPurchaseForm;
