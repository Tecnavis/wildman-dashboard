import React, { useState, useEffect } from "react";
import { useForm } from "../../Helper/useForm";
import axios from "axios";
import { URL } from "../../Helper/handle-api";
import Swal from "sweetalert2";

const PurchaseForm = () => {
  const adminDetails = JSON.parse(localStorage.getItem("adminDetails"));
  const adminName = adminDetails ? adminDetails.name : null;

  const [values, handleChange, setValues] = useForm({
    // Removed purchaseId since it's generated on the server
    adminName: adminName,
    totalAmount: "",
    date: new Date().toISOString().split("T")[0], // Set current date automatically
    supplier: "",
    email: "",
    phone: "",
    address: "",
    shopName: "",
    item: "",
    PurchasedStatus: "Item Received",
    paymentMethod: "Cash",
    paidAmount: "0",
    paymentStatus: "",
    balance: "",
  });

  const [supplierSuggestions, setSupplierSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [supplierError, setSupplierError] = useState("");

  useEffect(() => {
    // Calculate balance and payment status
    const totalAmount = parseFloat(values.totalAmount) || 0;
    const paidAmount = parseFloat(values.paidAmount) || 0;
    const balance = totalAmount - paidAmount;
    const paymentStatus = balance === 0 ? "Paid" : "Pending";

    setValues((prevValues) => ({
      ...prevValues,
      balance,
      paymentStatus,
    }));
  }, [values.totalAmount, values.paidAmount]);

  const handleSupplierChange = async (e) => {
    const { value } = e.target;
    handleChange(e);

    // Clear previous error message
    setSupplierError("");

    if (value) {
      setIsLoading(true);
      try {
        const response = await axios.get(`${URL}/supplier/search/suggest`, {
          params: { query: value },
        });

        // Check if suppliers are found
        if (response.data.length === 0) {
          setSupplierError("Supplier name not available");
          setSupplierSuggestions([]); // Clear suggestions
        } else {
          setSupplierSuggestions(response.data);
        }
      } catch (error) {
        console.error("Error fetching supplier suggestions:", error);
        setSupplierError("Not Found Supplier.");
      } finally {
        setIsLoading(false);
      }
    } else {
      setSupplierSuggestions([]);
    }
  };

  const handleSelectSupplier = (supplier) => {
    setValues({
      ...values,
      supplier: supplier.name,
      email: supplier.email,
      phone: supplier.phone,
      address: supplier.address,
      shopName: supplier.shop,
      item: supplier.item,
    });
    setSupplierSuggestions([]);
  };

  const handleCreate = async (e) => {
    e.preventDefault();

    // Check if supplier is empty or not selected
    if (!values.supplier) {
      Swal.fire({
        icon: "error",
        title: "Select Supplier",
        text: "Please select a supplier before confirming the order.",
      });
      return; // Prevent form submission if supplier is not selected
    }

    try {
      const purchaseData = { ...values };
      const res = await axios.post(`${URL}/purchase`, purchaseData);
      console.log(res.data);
      Swal.fire({
        icon: "success",
        title: "Purchase Created",
        text: `Purchase created successfully!`,
      });
      resetForm();
    } catch (error) {
      console.error("Error creating purchase:", error);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: error.message || "Something went wrong!",
      });
    }
  };

  const resetForm = () => {
    setValues({
      adminName: "",
      totalAmount: "",
      date: new Date().toISOString().split("T")[0],
      supplier: "",
      email: "",
      phone: "",
      address: "",
      shopName: "",
      item: "",
      PurchasedStatus: "Item Received",
      paymentMethod: "",
      paidAmount: "",
      paymentStatus: "",
      balance: "",
    });
  };

  // In handleCreate:

  return (
    <div className="col-lg-12">
      <div className="panel">
        <div className="panel-header">
          <h5>Purchase Form</h5>
        </div>
        <div className="panel-body">
          <div className="row g-3">
            <div className="col-sm-6">
              <input
                type="date"
                className="form-control form-control-sm"
                placeholder="Purchase Date*"
                name="date"
                onChange={handleChange}
                value={values.date}
              />
            </div>
            <div className="col-sm-6">
              <input
                type="text"
                className="form-control form-control-sm"
                placeholder="Staff Name(Order by)*"
                name="adminName"
                onChange={handleChange}
                value={values.adminName}
                readOnly
                required
              />
            </div>
            <div className="col-sm-6">
              <input
                type="text"
                className="form-control form-control-sm"
                placeholder="Supplier Name*"
                name="supplier"
                onChange={handleSupplierChange}
                value={values.supplier}
              />
              {isLoading && <div>Loading...</div>}
              {supplierSuggestions.length > 0 && (
                <ul className="suggestions">
                  {supplierSuggestions.map((supplier) => (
                    <li
                      key={supplier._id}
                      onClick={() => handleSelectSupplier(supplier)}
                    >
                      {supplier.name}
                    </li>
                  ))}
                </ul>
              )}
              {supplierError && (
                <div style={{ display: "block", color: "red" }}>
                  {supplierError}
                </div>
              )}{" "}
              {/* Display error message */}
            </div>
            <div className="col-sm-6">
              <input
                type="text"
                className="form-control form-control-sm"
                placeholder="Item Name*"
                name="item"
                onChange={handleChange}
                value={values.item}
              />
            </div>
            <div className="col-sm-6">
              <input
                type="email"
                className="form-control form-control-sm"
                placeholder="Email*"
                name="email"
                onChange={handleChange}
                value={values.email}
                readOnly
              />
            </div>
            <div className="col-sm-6">
              <input
                type="tel"
                className="form-control form-control-sm"
                placeholder="Phone*"
                name="phone"
                onChange={handleChange}
                value={values.phone}
                readOnly
              />
            </div>
            <div className="col-sm-6">
              <input
                type="text"
                className="form-control form-control-sm"
                placeholder="Address*"
                name="address"
                onChange={handleChange}
                value={values.address}
                readOnly
              />
            </div>
            <div className="col-sm-6">
              <input
                type="text"
                className="form-control form-control-sm"
                placeholder="Shop Name*"
                name="shopName"
                onChange={handleChange}
                value={values.shopName}
                readOnly
              />
            </div>
            <div className="col-6">
              <select
                className="form-select form-select-sm"
                size="1"
                name="PurchasedStatus"
                onChange={handleChange}
                value={values.PurchasedStatus}
                defaultValue={"Item Received"}
              >
                <option value="">Purchased status</option>
                <option value="Item Received">Item Received</option>
                <option value="On the way">On the way</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>
            <div className="col-sm-6">
              <input
                type="number"
                className="form-control form-control-sm"
                placeholder="Total Amount*"
                name="totalAmount"
                onChange={handleChange}
                value={values.totalAmount}
              />
            </div>
            <div className="col-sm-6">
              <input
                type="number"
                className="form-control form-control-sm"
                placeholder="Paid Amount*"
                name="paidAmount"
                onChange={handleChange}
                value={values.paidAmount}
              />
            </div>
            <div className="col-sm-6">
              <input
                type="number"
                className="form-control form-control-sm"
                placeholder="Balance*"
                name="balance"
                onChange={handleChange}
                value={values.balance}
                readOnly
              />
            </div>
            <div className="col-sm-6">
              <input
                type="text"
                className="form-control form-control-sm"
                placeholder="Paid Status*"
                name="paymentStatus"
                onChange={handleChange}
                value={values.paymentStatus}
                readOnly
              />
            </div>
            <div className="col-sm-6">
              <select
                className="form-select form-select-sm"
                size="1"
                name="paymentMethod"
                onChange={handleChange}
                value={values.paymentMethod}
              >
                <option value="">Payment Method</option>
                <option value="Cash">Cash</option>
                <option value="UPI">UPI</option>
              </select>
            </div>
            <div className="col-12 text-end">
              <button className="btn btn-sm btn-primary" onClick={handleCreate}>
                Confirm Order
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PurchaseForm;
