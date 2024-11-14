import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchCustomerOrder, fetchSalesOrders } from "../../Helper/handle-api";

const Invoices = () => {
  const [salesOrders, setSalesOrders] = useState([]);
  const [orderData, setOrderData] = useState([]);

  // Fetch all sales orders
  useEffect(() => {
    const getSalesOrders = async () => {
      const response = await fetchSalesOrders();
      if (response && Array.isArray(response.orders)) {
        setSalesOrders(response.orders);
      } else {
        setSalesOrders([]);
        console.error(
          "Expected an array in response.orders, but got:",
          response
        );
      }
    };

    const fetchCustomerData = async () => {
      const response = await fetchCustomerOrder();
      if (response && Array.isArray(response.orders)) {
        setOrderData(response.orders);
      } else {
        setOrderData([]);
      }
    };

    // Call both fetch functions
    getSalesOrders();
    fetchCustomerData();
  }, []);

  // Filter sales orders based on delivery status
  const filteredSalesOrders = salesOrders.filter(
    (order) => order.deliveryStatus === "Pending"
  );
  const filteredOrderData = orderData.filter(
    (order) => order.deliveryStatus === "Pending"
  );

  // Utility function to format the date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0"); // Pad with leading zero
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are zero-indexed
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  return (
    <div className="panel">
      <div className="panel-header">
        <h5>Pending Orders</h5>
        <Link className="btn btn-sm btn-primary" to="/salesorders">
          View All
        </Link>
      </div>
      <div className="panel-body p-0">
        <div className="table-responsive">
          <table className="table invoice-table table-hover">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Client</th>
                <th>Shop Name</th>
                <th>Order Date</th>
                <th>Total</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredSalesOrders.map((order) => (
                <tr key={order.orderId}>
                  <td>{order.orderId}</td>
                  <td>{order.customerName}</td>
                  <td>{order.shopName}</td>
                  <td>{formatDate(order.orderDate)}</td>
                  <td>${order.totalAmount}</td>
                  <td>
                    <span className="d-block text-end">
                      <span
                        className={`badge ${
                          order.paymentStatus === "Paid"
                            ? "bg-success"
                            : "bg-danger"
                        } px-2`}
                      >
                        {order.paymentStatus}
                      </span>
                    </span>
                  </td>
                </tr>
              ))}
              {filteredOrderData.map((order) => (
                <tr key={`customer-${order.orderId}`}>
                  <td>{order.orderId}</td>
                  <td>{order.customerName}</td>
                  <td>{order.shopName}</td>
                  <td>{formatDate(order.orderDate)}</td>
                  <td>${order.totalAmount}</td>
                  <td>
                    <span className="d-block text-end">
                      <span
                        className={`badge ${
                          order.paymentStatus === "Paid"
                            ? "bg-success"
                            : "bg-danger"
                        } px-2`}
                      >
                        {order.paymentStatus}
                      </span>
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Invoices;
