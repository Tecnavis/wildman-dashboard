import React, { useEffect, useState } from "react";
import { Table } from "react-bootstrap";
import { OverlayScrollbarsComponent } from "overlayscrollbars-react";
import PaginationSection from "./PaginationSection";
import InvoiceModal from "./invoiceModal";
import {
  fetchSalesOrders,
  updateSalesOrder,
  fetchProducts,
  deleteSalesOrder,
  URL,
} from "../../Helper/handle-api";
import EditSalesOrderModal from "./SalesorderEdit";
import axios from "axios";
import Swal from "sweetalert2";

const Salesorders = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [dataPerPage] = useState(10);
  const [salesOrders, setSalesOrders] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null); // State for selected order

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
    getSalesOrders();
  }, []);

  // Pagination logic
  const indexOfLastData = currentPage * dataPerPage;
  const indexOfFirstData = indexOfLastData - dataPerPage;
  const currentData = salesOrders.slice(indexOfFirstData, indexOfLastData);

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const totalPages = Math.ceil(salesOrders.length / dataPerPage);
  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  const handleEdit = (purchase) => {
    setSelectedOrder(purchase);
    setShowModal(true);
  };
  const [error, setError] = useState(null);

  // ... (other existing code)

  const handleUpdate = async (updatedOrder) => {
    try {
      setError(null); // Clear any previous errors
      const response = await updateSalesOrder(updatedOrder._id, updatedOrder);
      if (response) {
        setSalesOrders((prevOrders) =>
          prevOrders.map((order) =>
            order._id === updatedOrder._id ? updatedOrder : order
          )
        );
        setShowModal(false);
      }
    } catch (error) {
      console.error("Error updating sales order:", error);
      setError(
        error.response?.data?.message ||
          "An error occurred while updating the sales order."
      );
    }
  };

  // Helper function to update product stock
  const updateProductStock = async (productId, quantityDifference) => {
    try {
      const product = await fetchProducts(productId);
      if (product) {
        const newStock = product.totalStock - quantityDifference;
        await updateProduct(productId, { totalStock: newStock });
      }
    } catch (error) {
      console.error("Error updating product stock:", error);
    }
  };
  //delete sales order
  const handleDelete = async (id) => {
    try {
      const response = await deleteSalesOrder(id);
      if (response) {
        setSalesOrders((prevOrders) =>
          prevOrders.filter((order) => order._id !== id)
        );
      }
      Swal.fire("Success", "Sales order deleted successfully!", "success");
    } catch (error) {
      Swal.fire(
        "Error",
        "An error occurred while deleting the sales order.",
        "error"
      );
      console.error("Error deleting sales order:", error);
    }
  };

  //
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const handleInvoice = (order) => {
    setSelectedOrder(order);
    setShowInvoiceModal(true);
  };

  return (
    <>
      <OverlayScrollbarsComponent>
        <Table
          className="table table-dashed table-hover digi-dataTable all-product-table table-striped"
          id="allProductTable"
        >
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Staff</th>
              <th>Customer Name</th>
              <th>Customer</th>
              <th>Shop Name</th>
              <th>Products</th>
              <th>Image</th>
              <th>Total Amount</th>
              <th>Paid Amount</th>
              <th>Balance Amount</th>
              <th>Payment Status</th>
              <th>Delivery Status</th>
              <th>Order Date</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {currentData.map((order) => (
              <tr key={order._id}>
                <td>
                  <span
                    style={{ color: "blue", cursor: "pointer" }}
                    onClick={() => handleInvoice(order)}
                  >
                    {order.orderId}
                  </span>
                </td>
                <td>{order.adminName}</td>
                <td>{order.customerName}</td>
                <td>
                  {order.email}
                  <br />
                  {order.phone}
                </td>
                <td>
                  {order.shopName}
                  <br />
                  {order.address}
                </td>
                <td>
                  {order.products.map(
                    (product, index) =>
                      product.quantity > 0 && (
                        <div key={index}>
                          {product.mainCategory}: {product.quantity} x $
                          {product.price}
                        </div>
                      )
                  )}
                </td>
                <td>
  {(() => {
    const uniqueImages = new Set();
    return order.products.map((product, index) => {
      if (product.quantity > 0 && !uniqueImages.has(product.coverImage)) {
        uniqueImages.add(product.coverImage); // Track unique image
        return (
          <div key={index}>
            <img
              src={`${URL}/images/${product.coverImage}`}
              alt="product"
              style={{ width: "50px", height: "50px" }}
            />
          </div>
        );
      }
      return null; // Don't render duplicates
    });
  })()}
</td>

                <td>${order.totalAmount}</td>
                <td>${order.paidAmount}</td>
                <td>${order.balanceAmount}</td>
                <td
                  className={
                    order.paymentStatus === "Paid"
                      ? "text-success"
                      : "text-danger"
                  }
                  style={{
                    color: order.paymentStatus === "Paid" ? "green" : "red",
                  }}
                >
                  {order.paymentStatus}
                </td>

                <td className="text-success">{order.deliveryStatus}</td>
                <td>{new Date(order.orderDate).toLocaleDateString()}</td>
                <td>
                  <div className="btn-box">
                    <button onClick={() => handleEdit(order)}>
                      <i className="fa-light fa-pen"></i>
                    </button>
                    <button onClick={() => handleDelete(order._id)}>
                      <i className="fa-light fa-trash"></i>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </OverlayScrollbarsComponent>
      <PaginationSection
        currentPage={currentPage}
        totalPages={totalPages}
        paginate={paginate}
        pageNumbers={pageNumbers}
      />
      <EditSalesOrderModal
        show={showModal}
        onHide={() => {
          setShowModal(false);
          setError(null); // Clear error when modal is closed
        }}
        order={selectedOrder}
        handleUpdate={handleUpdate}
      />
      <InvoiceModal
        show={showInvoiceModal}
        onHide={() => setShowInvoiceModal(false)}
        order={selectedOrder}
      />
    </>
  );
};

export default Salesorders;
