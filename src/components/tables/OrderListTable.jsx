import React, { useEffect, useState } from "react";
import { Table, Modal, Button, Form, Row, Col } from "react-bootstrap";
import { OverlayScrollbarsComponent } from "overlayscrollbars-react";
import PaginationSection from "./PaginationSection";
import {
  fetchCustomerOrder,
  URL,
  deleteCustomerOrder,
} from "../../Helper/handle-api";
import axios from "axios";
import InvoiceModal from "./invoiceModal";
import jsPDF from "jspdf";
import "jspdf-autotable";
import html2canvas from "html2canvas";

const OrderListTable = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [dataPerPage] = useState(10);
  const [showModal, setShowModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [allOrder, setAllOrder] = useState([]);
  const [productStock, setProductStock] = useState({});
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [selectedOrders, setSelectedOrders] = useState([]);

  const handleInvoice = (data) => {
    setSelectedOrder(data);
    setShowInvoiceModal(true);
  };

  //fetch customer orders
  useEffect(() => {
    fetchCustomerOrder()
      .then((response) => {
        if (response && response.orders) {
          setAllOrder(response.orders);
          checkStockAvailability(response.orders);
        } else {
          setAllOrder([]);
        }
      })
      .catch((err) => console.log("Error fetching data:", err));
  }, []);

  //check stock availability
  const checkStockAvailability = async (orders) => {
    const stockInfo = {};
    for (const order of orders) {
      for (const product of order.products) {
        const productId = product.productDetails.id;
        const size = product.sizeDetails.size;
        const orderedQuantity = product.sizeDetails.quantity;

        if (!stockInfo[productId]) {
          try {
            const response = await axios.get(`${URL}/product/${productId}`);
            const productData = response.data;
            stockInfo[productId] = productData.sizes.reduce((acc, sizeObj) => {
              acc[sizeObj.size] = sizeObj.stock;
              return acc;
            }, {});
          } catch (error) {
            console.error(
              `Error fetching stock for product ${productId}:`,
              error
            );
            stockInfo[productId] = {};
          }
        }

        const availableStock = stockInfo[productId][size] || 0;
        product.stockAvailable = availableStock >= orderedQuantity;
        product.stockCount = availableStock;
      }
    }
    setProductStock(stockInfo);
    setAllOrder([...orders]);
  };
  //edit customer order
  const handleEditClick = (order) => {
    setSelectedOrder(order);
    setShowModal(true);
  };

  const handleCloseModal = () => setShowModal(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSelectedOrder((prevOrder) => {
      const newOrder = { ...prevOrder };

      if (name.includes("products")) {
        const match = name.match(/products\[(\d+)\]\.sizeDetails\.quantity/);
        if (match) {
          const index = match[1];
          const quantity = parseInt(value, 10);
          newOrder.products[index].sizeDetails.quantity = quantity;

          // Recalculate totalAmount
          newOrder.totalAmount = newOrder.products.reduce((total, product) => {
            return (
              total +
              product.sizeDetails.quantity * product.productDetails.price
            );
          }, 0);

          // Recalculate balanceAmount
          newOrder.balanceAmount = newOrder.totalAmount - newOrder.paidAmount;
        }
      } else if (name === "paidAmount") {
        // Update paidAmount
        const paidAmount = parseFloat(value);
        newOrder.paidAmount = paidAmount;

        // Recalculate balanceAmount
        newOrder.balanceAmount = newOrder.totalAmount - paidAmount;
      } else if (name === "deliveryStatus") {
        // Update deliveryStatus
        newOrder.deliveryStatus = value;

        // Set deliveryDate based on deliveryStatus
        if (value === "Delivered") {
          newOrder.deliveryDate = new Date().toISOString();
        } else {
          newOrder.deliveryDate = "Not Delivered";
        }
      } else {
        newOrder[name] = value;
      }

      return newOrder;
    });
  };

  //update customer orders
  const handleSaveChanges = async () => {
    console.log("Selected Order:", selectedOrder);
    try {
      const response = await axios.put(
        `${URL}/customerorder/${selectedOrder._id}`,
        selectedOrder
      );

      if (response.status === 200) {
        console.log("Order updated:", response.data.order);
        setAllOrder((prevOrders) =>
          prevOrders.map((order) =>
            order._id === selectedOrder._id ? response.data.order : order
          )
        );
        setShowModal(false);
      } else {
        console.log("Failed to update the order");
      }
    } catch (error) {
      console.error("Error updating order:", error);
    }
  };
  ///mark as delivered and deduct stock
  const handleDelivered = async (order) => {
    console.log("Order object:", order); // Log the order object

    // Check if the order has products and sizeDetails available
    if (
      !order.products ||
      order.products.length === 0 ||
      !order.products[0].sizeDetails
    ) {
      console.error(
        "No products or size details available to mark as delivered."
      );
      return;
    }

    try {
      const response = await axios.put(
        `${URL}/customerorder/${order._id}/delivered`
      );
      if (response.status === 200) {
        setAllOrder((prevOrders) =>
          prevOrders.map((o) =>
            o._id === order._id
              ? {
                  ...o,
                  deliveryStatus: "Delivered",
                  deliveryDate: new Date().toISOString(),
                }
              : o
          )
        );
      } else {
        console.log("Failed to mark as delivered");
      }
    } catch (error) {
      console.error("Error marking as delivered:", error);
    }
  };
  const handleReturn = async (order) => {
    try {
      const response = await axios.put(
        `${URL}/customerorder/${order._id}/return`
      );
      if (response.status === 200) {
        setAllOrder((prevOrders) =>
          prevOrders.map((o) =>
            o._id === order._id ? { ...o, return: true } : o
          )
        );
        console.log("Order returned successfully");
      } else {
        console.log("Failed to return the order");
      }
    } catch (error) {
      console.error("Error returning the order:", error);
    }
  };

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const totalPages = Math.ceil(allOrder.length / dataPerPage);
  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }
  // New function to handle PDF download of selected orders

  const handleDownloadSelectedInvoices = async () => {
    if (selectedOrders.length === 0) {
      alert("Please select orders to download invoices.");
      return;
    }

    try {
      // Create a new PDF document
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      for (const [index, order] of selectedOrders.entries()) {
        const pageWidth = pdf.internal.pageSize.getWidth();
        const margin = 10;

        // Add header
        pdf.setFontSize(12);
        pdf.text("Address: WILDAMAN", margin, 25);
        pdf.text("Email: support@wildman.com", margin, 30);
        pdf.text("Phone: +1 (800) 123-4567", margin, 35);

        // Add customer and invoice details
        pdf.setFontSize(12);
        pdf.text("Customer Details:", margin, 45);
        pdf.setFontSize(10);
        pdf.text(`Name: ${order.customerName}`, margin, 50);
        pdf.text(`Email: ${order.email || "N/A"}`, margin, 55);
        pdf.text(`Phone: ${order.phone || "N/A"}`, margin, 60);
        pdf.text(`Address: ${order.address}`, margin, 65);

        pdf.setFontSize(12);
        pdf.text("Invoice Details:", pageWidth / 2 + margin, 45);
        pdf.setFontSize(10);
        pdf.text(`ORDER No.: ${order.orderId}`, pageWidth / 2 + margin, 50);
        pdf.text(
          `Order Date: ${new Date(order.orderDate).toLocaleDateString()}`,
          pageWidth / 2 + margin,
          55
        );
        pdf.text("Payment Type: Cash on delivery", pageWidth / 2 + margin, 60);

        // Prepare table data
        const tableData = order.products.map((product, pIndex) => {
          const subtotal = (
            (product.productDetails?.price || 0) *
            (1 - (product.productDetails?.discount || 0) / 100) *
            (product.sizeDetails?.quantity || 1)
          ).toFixed(2);

          return [
            pIndex + 1,
            product.productDetails?.mainCategory || "",
            product.sizeDetails?.quantity || 0,
            `Rs. ${product.productDetails?.price || 0}`,
            `${product.productDetails?.discount || 0}%`,
            `Rs. ${product.productDetails?.gst || 0}`,
            `Rs. ${subtotal}`,
          ];
        });

        // Calculate total GST and total amount
        const totalGST = order.products
          .reduce(
            (totalGst, product) =>
              totalGst +
              (product.productDetails?.gst || 0) *
                (product.sizeDetails?.quantity || 1),
            0
          )
          .toFixed(2);

        const totalAmountIncludingGST = (
          tableData.reduce(
            (sum, row) => sum + parseFloat(row[6].replace("Rs. ", "")),
            0
          ) + parseFloat(totalGST)
        ).toFixed(2);

        // Add table
        pdf.autoTable({
          startY: 75,
          head: [
            [
              "No.",
              "Products",
              "Qty.",
              "Price",
              "Offer Price",
              "Tax",
              "Subtotal",
            ],
          ],
          body: tableData,
          margin: { left: margin, right: margin },
          theme: "grid",
          headStyles: { fillColor: ["black"] },
          styles: { fontSize: 10, cellPadding: 2 },
        });

        // Add totals
        const finalY = pdf.lastAutoTable.finalY || 75;
        pdf.setFontSize(10);
        pdf.text(`Total GST: Rs. ${totalGST}`, margin, finalY + 10);
        pdf.text(
          `Total Amount (Including GST): Rs. ${totalAmountIncludingGST}`,
          margin,
          finalY + 15
        );
        pdf.text(
          "If you add gift wrapping, it will take an extra Rs.30",
          margin,
          finalY + 20
        ); // Add new page if not the last order
        if (index < selectedOrders.length - 1) {
          pdf.addPage();
        }
      }

      // Save the PDF
      pdf.save(
        `Selected_Invoices_${new Date().toISOString().split("T")[0]}.pdf`
      );

      // Clear selected orders and uncheck checkboxes
      setSelectedOrders([]);
      document.querySelectorAll(".form-check-input").forEach((checkbox) => {
        checkbox.checked = false;
      });
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("Failed to generate PDF. Please try again.");
    }
  };

  // Modify checkbox handler to track selected orders
  const handleOrderSelect = (order, isChecked) => {
    setSelectedOrders((prev) =>
      isChecked ? [...prev, order] : prev.filter((o) => o._id !== order._id)
    );
  };
  return (
    <>
      <OverlayScrollbarsComponent>
        <div className="table-responsive">
          <Button
            variant="primary"
            onClick={handleDownloadSelectedInvoices}
            disabled={selectedOrders.length === 0}
          >
            Download Selected Invoices as PDF
          </Button>
        </div>
        <Table
          className="table table-dashed table-hover digi-dataTable all-product-table table-striped"
          id="allProductTable"
        >
          <thead>
            <tr>
              <th className="no-sort">
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="markAllProduct"
                    onChange={(e) => {
                      const isChecked = e.target.checked;
                      document
                        .querySelectorAll(".order-checkbox")
                        .forEach((checkbox) => {
                          checkbox.checked = isChecked;
                        });
                      setSelectedOrders(isChecked ? [...allOrder] : []);
                    }}
                  />
                </div>
              </th>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Gift Message</th>
              <th>Product</th>
              <th>Product count</th>
              <th>Price</th>
              <th>Total Price</th>
              <th>Credit</th>
              <th>Balance</th>
              <th>Address</th>
              <th>Payment Method</th>
              <th>Delivery Status</th>
              <th>Order Date</th>
              <th>Delivery Date</th>
              <th>Product Availability</th>
              <th>Delivered</th>
              <th>Return</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {allOrder.map((data, index) => (
              <React.Fragment key={index}>
                <tr>
                  <td rowSpan={data.products?.length || 1}>
                    <div className="form-check">
                      <input
                        className="form-check-input order-checkbox"
                        type="checkbox"
                        onChange={(e) =>
                          handleOrderSelect(data, e.target.checked)
                        }
                      />
                    </div>
                  </td>
                  <td rowSpan={data.products?.length || 1}>
                    {/* <Link to="/invoices">{data.orderId}</Link> */}
                    <span
                      style={{ color: "blue", cursor: "pointer" }}
                      onClick={() => handleInvoice(data)}
                    >
                      {data.orderId}
                    </span>
                  </td>
                  <td rowSpan={data.products?.length || 1}>
                    {data.customerName}
                  </td>
                  <td rowSpan={data.products?.length || 1}>
                    {data.giftMessage}
                  </td>
                  <td>
                    {data.products?.[0]?.productDetails?.mainCategory || "N/A"}
                  </td>
                  <td>{data.products?.[0]?.sizeDetails?.quantity || "N/A"}</td>
                  <td>{data.products?.[0]?.productDetails?.price || "N/A"}</td>
                  <td rowSpan={data.products?.length || 1}>
                   Exc.GST {data.totalAmount}
                  </td>
                  <td rowSpan={data.products?.length || 1}>
                    {data.paidAmount}
                  </td>
                  <td rowSpan={data.products?.length || 1}>
                    {data.balanceAmount}
                  </td>
                  <td rowSpan={data.products?.length || 1}>{data.address}</td>
                  <td rowSpan={data.products?.length || 1}>
                    {data.paymentMethod}
                  </td>
                  <td rowSpan={data.products?.length || 1}>
                    {data.deliveryStatus}
                  </td>
                  <td rowSpan={data.products?.length || 1}>
                    {data.orderDate
                      ? new Date(data.orderDate).toLocaleDateString()
                      : "N/A"}
                  </td>
                  <td rowSpan={data.products?.length || 1}>
                    {data.deliveryDate === "Not Delivered"
                      ? data.deliveryDate
                      : data.deliveryDate
                      ? new Date(data.deliveryDate).toLocaleDateString()
                      : "N/A"}
                  </td>
                  <td>
                    {data.products.every((product) => product.stockAvailable)
                      ? "In Stock"
                      : "Out of Stock"}
                  </td>
                  <td rowSpan={data.products?.length || 1}>
                    <Button
                      variant="primary"
                      // disabled={data.deliveryStatus === "Delivered"}
                      disabled={
                        data.deliveryStatus === "Delivered" ||
                        !data.products.every(
                          (product) => product.stockAvailable
                        )
                      }
                      onClick={() => handleDelivered(data)}
                    >
                      Mark as Delivered
                    </Button>
                  </td>
                  <td rowSpan={data.products?.length || 1}>
                    <Button
                      variant="danger"
                      disabled={
                        data.deliveryStatus !== "Delivered" || data.return
                      }
                      onClick={() => handleReturn(data)}
                    >
                      {data.return ? "Returned" : "Return"}
                    </Button>
                  </td>
                  <td rowSpan={data.products?.length || 1}>
                    <div className="btn-box">
                      <button onClick={() => handleEditClick(data)}>
                        <i className="fa-light fa-pen"></i>
                      </button>
                      <button>
                        <i
                          className="fa-light fa-trash"
                          onClick={() => deleteCustomerOrder(data._id)}
                        ></i>
                      </button>
                    </div>
                  </td>
                </tr>
                {data.products?.slice(1).map((product, productIndex) => (
                  <tr key={`${index}-${productIndex}`}>
                    <td>{product.productDetails?.mainCategory || "N/A"}</td>
                    <td>{product.sizeDetails?.quantity || "N/A"}</td>
                    <td>{product.productDetails?.price || "N/A"}</td>
                    <td>
                      {product.stockAvailable ? "In Stock" : "Out of Stock"}
                    </td>
                  </tr>
                ))}
              </React.Fragment>
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

      {selectedOrder && (
        <Modal show={showModal} onHide={handleCloseModal} size="lg">
          <Modal.Header closeButton>
            <Modal.Title style={{color:"white"}}>Edit Order</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Row>
                <Col md={6}>
                  <Form.Group controlId="orderId">
                    <Form.Label>Order ID</Form.Label>
                    <Form.Control
                      type="text"
                      value={selectedOrder.orderId || ""}
                      readOnly
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group controlId="customerName">
                    <Form.Label>Customer Name</Form.Label>
                    <Form.Control
                      type="text"
                      name="customerName"
                      value={selectedOrder.customerName || ""}
                      onChange={handleInputChange}
                    />
                  </Form.Group>
                </Col>
              </Row>
              <br />
              <Row>
                <Col md={6}>
                  <Form.Group controlId="paymentMethod">
                    <Form.Label>Total Amount</Form.Label>
                    <Form.Control
                      type="text"
                      name="totalAmount"
                      value={selectedOrder.totalAmount || ""}
                      onChange={handleInputChange}
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group controlId="paidAmount">
                    <Form.Label>Paid Amount</Form.Label>
                    <Form.Control
                      type="number"
                      name="paidAmount"
                      value={selectedOrder.paidAmount || 0}
                      onChange={handleInputChange}
                    />
                  </Form.Group>
                </Col>
              </Row>
              <br />
              <Row>
                <Col md={6}>
                  <Form.Group controlId="balanceAmount">
                    <Form.Label>Balance Amount</Form.Label>
                    <Form.Control
                      type="number"
                      name="balanceAmount"
                      value={selectedOrder.balanceAmount || 0}
                      onChange={handleInputChange}
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group controlId="address">
                    <Form.Label>Address</Form.Label>
                    <Form.Control
                      type="text"
                      name="address"
                      value={selectedOrder.address || ""}
                      onChange={handleInputChange}
                    />
                  </Form.Group>
                </Col>
              </Row>
              <br />
              <Row>
                <Col md={6}>
                  <Form.Group controlId="paymentMethod">
                    <Form.Label>Payment Method</Form.Label>
                    <Form.Control
                      type="text"
                      name="paymentMethod"
                      value={selectedOrder.paymentMethod || ""}
                      onChange={handleInputChange}
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group controlId="deliveryStatus">
                    <Form.Label>Delivery Status</Form.Label>
                    <Form.Select
                      name="deliveryStatus"
                      value={selectedOrder.deliveryStatus || ""}
                      onChange={handleInputChange}
                    >
                      <option value="Out for delivery">Out for delivery</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Cancelled">Cancelled</option>
                      <option value="On transist">On transist</option>
                      <option value="Pending">Pending</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>
              <br />
              <Row>
                <Col md={6}>
                  <Form.Group controlId="orderDate">
                    <Form.Label>Order Date</Form.Label>
                    <Form.Control
                      type="text"
                      value={
                        selectedOrder.orderDate
                          ? new Date(
                              selectedOrder.orderDate
                            ).toLocaleDateString()
                          : ""
                      }
                      readOnly
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group controlId="deliveryDate">
                    <Form.Label>Delivery Date</Form.Label>
                    <Form.Control
                      type="text"
                      name="deliveryDate"
                      value={
                        selectedOrder.deliveryDate
                          ? new Date(
                              selectedOrder.deliveryDate
                            ).toLocaleDateString()
                          : "Not Delivered"
                      }
                      onChange={handleInputChange}
                    />
                  </Form.Group>
                </Col>
              </Row>
              <br />
              <Form.Group controlId="productDetails">
                <Form.Label>Product Details</Form.Label>
                {selectedOrder.products?.map((product, index) => (
                  <div key={index}>
                    <Row>
                      <Col md={4}>
                        <Form.Group controlId={`product-${index}-mainCategory`}>
                          <Form.Label>Main Category</Form.Label>
                          <Form.Control
                            type="text"
                            value={product.productDetails?.mainCategory || ""}
                            readOnly
                          />
                        </Form.Group>
                      </Col>
                      <Col md={4}>
                        <Form.Group controlId={`product-${index}-quantity`}>
                          <Form.Label>Quantity</Form.Label>
                          <Form.Control
                            type="number"
                            name={`products[${index}].sizeDetails.quantity`}
                            value={product.sizeDetails?.quantity || 0}
                            onChange={handleInputChange}
                          />
                        </Form.Group>
                      </Col>
                      <Col md={4}>
                        <Form.Group controlId={`product-${index}-price`}>
                          <Form.Label>Price</Form.Label>
                          <Form.Control
                            type="number"
                            value={product.productDetails?.price || 0}
                            readOnly
                          />
                        </Form.Group>
                      </Col>
                    </Row>
                    <br />
                  </div>
                ))}
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseModal}>
              Close
            </Button>
            <Button variant="primary" onClick={handleSaveChanges}>
              Save Changes
            </Button>
          </Modal.Footer>
        </Modal>
      )}
      <InvoiceModal
        show={showInvoiceModal}
        onHide={() => setShowInvoiceModal(false)}
        order={selectedOrder}
      />
    </>
  );
};

export default OrderListTable;
