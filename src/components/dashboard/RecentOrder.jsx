import { OverlayScrollbarsComponent } from "overlayscrollbars-react";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchSalesOrders, fetchCustomerOrder } from "../../Helper/handle-api";

// Utility function to format date
const formatDate = (dateString) => {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are zero-based in JavaScript
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

const RecentOrder = () => {
  const [orders, setOrders] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [ordersPerPage] = useState(5); // Number of orders per page
  const [orderData, setOrderData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetchSalesOrders();
        if (response && Array.isArray(response.orders)) {
          // Sort orders by orderDate in descending order
          const sortedOrders = response.orders.sort(
            (a, b) => new Date(b.orderDate) - new Date(a.orderDate)
          );
          setOrders(sortedOrders);
        } else {
          console.warn("Data is not in expected format:", response);
          setOrders([]);
        }
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };

    const fetchCustomerData = async () => {
      const response = await fetchCustomerOrder();
      if (response && response.orders) {
        setOrderData(response.orders);
      } else {
        setOrderData([]);
      }
    };

    fetchData();
    fetchCustomerData();
  }, []);

  // Combine orders and orderData for pagination
  const combinedOrders = [...orders, ...orderData];

  // Calculate the orders to display on the current page
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = combinedOrders.slice(indexOfFirstOrder, indexOfLastOrder);

  // Handle pagination: move to next/previous page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const totalPages = Math.ceil(combinedOrders.length / ordersPerPage);

  return (
    <div className="col-xxl-8">
      <div className="panel recent-order">
        <div className="panel-header">
          <h5>Recent Orders</h5>
          <div id="tableSearch"></div>
        </div>
        <div className="panel-body">
          <OverlayScrollbarsComponent>
            <table className="table table-dashed recent-order-table dataTable no-footer" id="myTable">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Order Date</th>
                  <th>Payment Method</th>
                  <th>Shop Name</th>
                  <th>Total Amount</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {currentOrders.length > 0 ? (
                  currentOrders.map((data, index) => (
                    <tr key={index}>
                      <td>{data.orderId}</td>
                      <td>{data.customerName || "N/A"}</td>
                      <td>{data.orderDate ? formatDate(data.orderDate) : "N/A"}</td>
                      <td>{data.paymentMethod || "N/A"}</td>
                      <td>{data.shopName}</td>
                      <td>{`$${data.totalAmount || "N/A"}`}</td>
                      <td>
                        <span className="badge bg-success">
                          {data.paymentStatus || "N/A"}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" style={{ textAlign: "center" }}>
                      No orders found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </OverlayScrollbarsComponent>

          {/* Pagination controls */}
          <div className="table-bottom-control">
            <div className="dataTables_info">
              Showing {indexOfFirstOrder + 1} to {Math.min(indexOfLastOrder, combinedOrders.length)} of {combinedOrders.length} orders
            </div>
            <div className="dataTables_paginate paging_simple_numbers">
              <Link
                className={`btn btn-primary previous ${currentPage === 1 ? "disabled" : ""}`}
                onClick={() => paginate(currentPage - 1)}
                disabled={currentPage === 1}
              >
                <i className="fa-light fa-angle-left"></i>
              </Link>
              <span>
                {Array.from({ length: totalPages }, (_, index) => (
                  <Link
                    key={index}
                    className={`btn btn-primary ${currentPage === index + 1 ? "current" : ""}`}
                    onClick={() => paginate(index + 1)}
                  >
                    {index + 1}
                  </Link>
                ))}
              </span>
              <Link
                className={`btn btn-primary next ${currentPage === totalPages ? "disabled" : ""}`}
                onClick={() => paginate(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                <i className="fa-light fa-angle-right"></i>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecentOrder;
