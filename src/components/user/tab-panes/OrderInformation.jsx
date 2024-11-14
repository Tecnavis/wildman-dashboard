import axios from "axios";
import React, { useEffect, useState } from "react";
import { URL } from "../../../Helper/handle-api";
import { useForm } from "../../../Helper/useForm";
import Swal from "sweetalert2";
import InvoiceModal from './invoiceModal1';
const OrderInformation = () => {
  const adminDetails = JSON.parse(localStorage.getItem("adminDetails"));
  const adminName = adminDetails ? adminDetails.name : null;
  const cartItems = JSON.parse(localStorage.getItem("orderDetails"));
  const products = cartItems ? cartItems.productDetails : [];

  const [values, handleChange, setValues] = useForm({
    orderId: "",
    orderDate: new Date().toISOString().slice(0, 10),
    orderStatus: "Packing",
    totalAmount: cartItems ? cartItems.cartTotal : 0,
    quantity: "",
    customerName: "",
    email: "",
    phone: "",
    address: "",
    shopName: "",
    paymentMethod: "Cash on delivery",
    paidAmount: 0,
    balanceAmount: 0,
    paymentStatus: "Unpaid",
    deliveryStatus: "Out for delivery",
    deliveryDate: "",
    note: "",
    adminName,
  });
  const [customerNotFound, setCustomerNotFound] = useState(false); 
  const [customerSuggestions, setCustomerSuggestions] = useState([]);
  useEffect(() => {
    if (values.customerName.length > 2) {
      fetchCustomerSuggestions(values.customerName);
    } else {
      setCustomerSuggestions([]);
      setCustomerNotFound(false); // Reset error if name is being typed again
    }
  }, [values.customerName]);

  const fetchCustomerSuggestions = async (query) => {
    try {
      const response = await axios.get(`${URL}/customer/search/suggest?query=${query}`);
      if (response.data.length === 0) {
        setCustomerNotFound(true); // Set error if no suggestions found
      } else {
        setCustomerNotFound(false); // No error if suggestions are found
      }
      setCustomerSuggestions(response.data);
    } catch (error) {
      console.error("Error fetching customer suggestions:", error);
    }
  };

  const handleCustomerSelect = (customer) => {
    setValues({
      ...values,
      customerName: customer.name,
      email: customer.email,
      phone: customer.phone,
      address: customer.address,
      shopName: customer.shopname,
    });
    setCustomerSuggestions([]);
    setCustomerNotFound(false); // Reset error on selection
  };


  // Validation function
  const validateForm = () => {
    const { customerName, email, phone, address, paymentMethod, paidAmount, totalAmount } =
      values;
    if (
      !customerName ||
      !email ||
      !phone ||
      !address ||
      !paymentMethod ||
      paidAmount === "" ||
      !totalAmount
    ) {
      Swal.fire({
        icon: "warning",
        title: "Missing Information",
        text: "Please fill in all the required fields.",
      });
      return false;
    }
    return true;
  };

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   if (!validateForm()) return;

  //   const orderId = generateOrderId();

  //   const order = {
  //     ...values,
  //     orderId,
  //     balanceAmount: values.totalAmount - values.paidAmount,
  //     products: products.map(product => ({
  //       ...product,
  //       size: product.size ,
  //       coverImage: product.coverimage,
        
  //     })),
  //   };

  //   try {
  //     const res = await axios.post(`${URL}/salesorder`, order);
  //     console.log(res);
      
  //     // Update stock for each product
  //     await Promise.all(products.map(async (product) => {
  //       await axios.put(`${URL}/product/${product.id}/stock`, {
  //         size: product.size,
  //         quantity: product.quantity
  //       });
  //     }));

  //     Swal.fire({
  //       icon: "success",
  //       title: "Order Created",
  //       text: "Order created successfully!",
  //     });
      
  //     // Reset form and clear localStorage
  //     setValues({
  //       ...values,
  //       customerName: "",
  //       email: "",
  //       phone: "",
  //       address: "",
  //       paidAmount: 0,
  //       deliveryDate: "",
  //     });
  //     localStorage.removeItem("orderDetails");
  //   } catch (err) {
  //     console.error(err);
  //     Swal.fire({
  //       icon: "error",
  //       title: "Order Creation Failed",
  //       text: "Error creating order. Please try again.",
  //     });
  //   }
  // };
  const [showModal, setShowModal] = useState(false);
  const [invoiceData, setInvoiceData] = useState({});

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const orderId = generateOrderId();

    const order = {
      ...values,
      orderId,
      balanceAmount: values.totalAmount - values.paidAmount,
      products: products.map(product => ({
        ...product,
        size: product.size,
        coverImage: product.coverimage,
      })),
    };

    try {
      const res = await axios.post(`${URL}/salesorder`, order);
      console.log(res);

      // Prepare the invoice data
      setInvoiceData({
        customerName: values.customerName,
        email: values.email,
        phone: values.phone,
        address: values.address,
        products: products,
        totalAmount: values.totalAmount,
        orderId: orderId,
        paidAmount: values.paidAmount,
        balanceAmount: values.totalAmount - values.paidAmount,
        // Add other relevant invoice details here
      });

      // Update stock for each product
      await Promise.all(products.map(async (product) => {
        await axios.put(`${URL}/product/${product.id}/stock`, {
          size: product.size,
          quantity: product.quantity
        });
      }));

      Swal.fire({
        icon: "success",
        title: "Order Created",
        text: "Order created successfully!",
      });

      // Show the modal
      setShowModal(true);

      // Reset form and clear localStorage
      setValues({
        ...values,
        customerName: "",
        email: "",
        phone: "",
        address: "",
        paidAmount: 0,
        deliveryDate: "",
      });
      localStorage.removeItem("orderDetails");
    } catch (err) {
      console.error(err);
      Swal.fire({
        icon: "error",
        title: "Order Creation Failed",
        text: "Error creating order. Please try again.",
      });
    }
  };
  const generateOrderId = () => {
    const currentDate = new Date();
    const dateString = `${currentDate.getFullYear()}${String(
      currentDate.getMonth() + 1
    ).padStart(2, "0")}${String(currentDate.getDate()).padStart(2, "0")}`;
    return `ORDER${dateString}`;
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="profile-edit-tab-title">
        <h6>Order Information</h6>
      </div>
      <div className="public-information mb-30">
        <div className="row g-4">
          <div className="col-md-12">
            <div className="row g-3">
              <div className="col-sm-6"></div>
              <div className="col-sm-12">
                <div className="input-group">
                  <span className="input-group-text">
                    <i className="fa-light fa-calendar-days" />
                  </span>
                  <input
                    type="date"
                    className="form-control"
                    placeholder="Order Date"
                    value={values.orderDate}
                    name="orderDate"
                    onChange={handleChange}
                    readOnly
                  />
                </div>
              </div>
              <div className="col-12">
                <textarea
                  className="form-control h-150-p"
                  placeholder="Notes ...(optional)"
                  name="note"
                  onChange={handleChange}
                  value={values.note}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="private-information mb-30">
        <div className="row g-3">
        <div className="col-md-4 col-sm-6">
        <div className="input-group">
          <span className="input-group-text">
            <i className="fa-light fa-user" />
          </span>
          <input
            type="text"
            className="form-control"
            placeholder="Customer Name (required)"
            value={values.customerName}
            name="customerName"
            onChange={handleChange}
          />
        </div>
        {customerNotFound && (
        <div className="error-message" style={{ color: 'red',fontFamily: 'Lato' }}>
          Name is not available
        </div>
      )}
        {customerSuggestions.length > 0 && (
          <ul className="customer-suggestions">
            {customerSuggestions.map((customer) => (
              <li key={customer._id} onClick={() => handleCustomerSelect(customer)} style={{ color: 'green' }}>
                {customer.name}
              </li>
            ))}
          </ul>
        )}
      </div>
          <div className="col-md-4 col-sm-6">
            <div className="input-group flex-nowrap">
              <span className="input-group-text">
                <i className="fa-light fa-user-tie" />
              </span>
              <input
                type="text"
                className="form-control"
                placeholder="Admin Name"
                value={values.adminName}
                name="adminName"
                onChange={handleChange}
                readOnly
              />
            </div>
          </div>
          <div className="col-md-4 col-sm-6">
            <div className="input-group flex-nowrap">
              <span className="input-group-text">
                <i className="fa-light fa-circle-check" />
              </span>
              <select
                className="form-control"
                name="orderStatus"
                onChange={handleChange}
                value={values.orderStatus}
                defaultValue={"Packing"}
              >
                <option value="">Order Status</option>
                <option value="Packing">Packing</option>
                <option value="Delivered">Delivered</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>
          </div>
          <div className="col-md-4 col-sm-6">
            <div className="input-group">
              <span className="input-group-text">
                <i className="fa-light fa-envelope" />
              </span>
              <input
                type="email"
                className="form-control"
                placeholder="Email (required)"
                value={values.email}
                name="email"
                onChange={handleChange}
                readOnly
              />
            </div>
          </div>
          <div className="col-md-4 col-sm-6">
            <div className="input-group">
              <span className="input-group-text">
                <i className="fa-light fa-phone" />
              </span>
              <input
                type="tel"
                className="form-control"
                placeholder="Phone (required)"
                value={values.phone}
                name="phone"
                onChange={handleChange}
                readOnly
              />
            </div>
          </div>
          <div className="col-md-4 col-sm-6">
            <div className="input-group">
              <span className="input-group-text">
                <i className="fa-light fa-shop" />
              </span>
              <input
                type="text"
                className="form-control"
                placeholder="Shop Name"
                value={values.shopName}
                name="shopName"
                onChange={handleChange}
                readOnly
              />
            </div>
          </div>
          <div className="col-12">
            <textarea
              className="form-control h-100-p"
              placeholder="Address (required)"
              name="address"
              onChange={handleChange}
              value={values.address}
              readOnly
            />
          </div>
        </div>
      </div>
      <div className="social-information">
        <div className="row g-3">
          <br />
          <div className="profile-edit-tab-title">
            <h6>Payment Information</h6>
          </div>
          <div className="col-sm-4">
            <div className="input-group">
              <span className="input-group-text">
                <i className="fa-brands fa-dollar-sign" />
              </span>
              <input
                type="text"
                className="form-control"
                placeholder="Total Amount"
                value={values.totalAmount}
                name="totalAmount"
                onChange={handleChange}
                readOnly
              />
            </div>
          </div>
          <div className="col-sm-4">
            <div className="input-group">
              <span className="input-group-text">
                <i className="fa-brands fa-dollar-sign" />
              </span>
              <input
                type="text"
                className="form-control"
                placeholder="Pay Amount"
                value={values.paidAmount}
                name="paidAmount"
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="col-sm-4">
            <div className="input-group">
              <span className="input-group-text">
                <i className="fa-brands fa-dollar-sign" />
              </span>
              <input
                type="text"
                className="form-control"
                placeholder="Balance"
                value={values.totalAmount - values.paidAmount} // Update here
                name="balance"
                readOnly
              />
            </div>
          </div>

          <div className="col-sm-6">
            <div className="input-group">
              <span className="input-group-text">
                <i className="fa-brands fa-paypal" />
              </span>
              <select
                className="form-control select-search"
                name="paymentMethod"
                onChange={handleChange}
                value={values.paymentMethod}
                defaultValue={"Cash on delivery"}
              >
                <option value="Payment method">Payment Method</option>
                <option value="UPI">UPI</option>
                <option value="Cash on delivery">Cash on delivery</option>
              </select>
            </div>
          </div>
          <div className="col-sm-6">
            <div className="input-group">
              <span className="input-group-text">
                <i className="fa-brands fa-paypal" />
              </span>
              <select
                className="form-control select-search"
                name="paymentStatus"
                onChange={handleChange}
                value={values.paymentStatus}
              >
                <option value="">Payment Status</option>
                <option value="Unpaid">Unpaid</option>
                <option value="Paid">Paid</option>
                <option value="Partially Paid">Partially Paid</option>
              </select>
            </div>
          </div>
          <div className="col-sm-6">
            <div className="input-group">
              <span className="input-group-text">
                <i className="fa-brands fa-paypal" />
              </span>
              <select
                className="form-control select-search"
                name="deliveryStatus"
                onChange={handleChange}
                value={values.deliveryStatus}
              >
                <option value="Pending">Delivery Status</option>
                <option value="Delivered">Delivered</option>
                <option value="Cancelled">Cancelled</option>
                <option value="Out for delivery">Out for delivery</option>
                <option value="On transist">On transist</option>
                <option value="Pending">Pending</option>
              </select>
            </div>
          </div>
          <div className="col-sm-6">
            <div className="input-group">
              <span className="input-group-text">
                <i className="fa-brands fa-calender" />
              </span>
              <input
                type="date"
                className="form-control"
                name="deliveryDate"
                onChange={handleChange}
                value={values.deliveryDate}
              />
            </div>
          </div>

          <div className="col-sm-6">
            <div className="input-group">
              <span className="input-group-text">
                <i className="fa-solid fa-paper-plane" />
              </span>
              <button type="submit" className="btn btn-primary">
                Submit Order
              </button>
            </div>
          </div>
        </div>
      </div>
      <InvoiceModal show={showModal} handleClose={() => setShowModal(false)} invoiceData={invoiceData} />
    </form>
    
  );
};

export default OrderInformation;
