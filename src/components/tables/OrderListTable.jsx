import React, { useEffect, useState } from "react";
import { Table, Modal, Button, Form, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import { OverlayScrollbarsComponent } from "overlayscrollbars-react";
import PaginationSection from "./PaginationSection";
import { fetchCustomerOrder, URL,deleteCustomerOrder } from "../../Helper/handle-api";
import axios from "axios";
import InvoiceModal from "./invoiceModal";
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
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
            console.error(`Error fetching stock for product ${productId}:`, error);
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
  
      if (name.includes('products')) {
        const match = name.match(/products\[(\d+)\]\.sizeDetails\.quantity/);
        if (match) {
          const index = match[1];
          const quantity = parseInt(value, 10);
          newOrder.products[index].sizeDetails.quantity = quantity;
  
          // Recalculate totalAmount
          newOrder.totalAmount = newOrder.products.reduce((total, product) => {
            return total + (product.sizeDetails.quantity * product.productDetails.price);
          }, 0);
  
          // Recalculate balanceAmount
          newOrder.balanceAmount = newOrder.totalAmount - newOrder.paidAmount;
        }
      } else if (name === 'paidAmount') {
        // Update paidAmount
        const paidAmount = parseFloat(value);
        newOrder.paidAmount = paidAmount;
  
        // Recalculate balanceAmount
        newOrder.balanceAmount = newOrder.totalAmount - paidAmount;
      } else if (name === 'deliveryStatus') {
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
    if (!order.products || order.products.length === 0 || !order.products[0].sizeDetails) {
        console.error("No products or size details available to mark as delivered.");
        return;
    }

    try {
        const response = await axios.put(`${URL}/customerorder/${order._id}/delivered`);
        if (response.status === 200) {
            setAllOrder((prevOrders) =>
                prevOrders.map((o) =>
                    o._id === order._id
                        ? { ...o, deliveryStatus: "Delivered", deliveryDate: new Date().toISOString() }
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
      const response = await axios.put(`${URL}/customerorder/${order._id}/return`);
      if (response.status === 200) {
        setAllOrder((prevOrders) =>
          prevOrders.map((o) =>
            o._id === order._id
              ? { ...o, return: true }
              : o
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
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    // Fetch logo
    let logoUrl = '';
    try {
      const logoResponse = await axios.get(`${URL}/logo`);
      if (logoResponse.data && logoResponse.data.length > 0) {
        logoUrl = `${URL}/images/${logoResponse.data[0].image}`;
      }
    } catch (error) {
      console.error("Error fetching logo:", error);
    }

    // Iterate through selected orders
    for (const [index, order] of selectedOrders.entries()) {
      // Calculate total GST
      const totalGst = order.products.reduce(
        (totalGst, product) =>
          totalGst +
          (product.productDetails?.gst || 0) *
            (product.sizeDetails?.quantity || 1),
        0
      );

      // Create PDF content
      const pageContent = `
        <div style="font-family: Arial, sans-serif; max-width: 210mm; margin: 0 auto; padding: 10mm;">
          <div style="display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 20px;">
            <div>
              ${logoUrl ? `<img src="${logoUrl}" style="max-width: 100px; margin-bottom: 10px;">` : ''}
              <p style="margin: 0; font-size: 10px;">Address: 456 E-Commerce Avenue, Cityville, Countryland</p>
              <p style="margin: 0; font-size: 10px;">Email: support@warehouse.com</p>
              <p style="margin: 0; font-size: 10px;">Phone: +1 (800) 123-4567</p>
            </div>
          </div>

          <div style="display: flex; justify-content: space-between; margin-bottom: 20px;">
            <div style="width: 48%;">
              <h3 style="margin-bottom: 10px; font-size: 12px;">Customer Details:</h3>
              <p style="margin: 0; font-size: 10px;"><strong>Name:</strong> ${order.customerName}</p>
              <p style="margin: 0; font-size: 10px;"><strong>Email:</strong> ${order.email || 'N/A'}</p>
              <p style="margin: 0; font-size: 10px;"><strong>Phone:</strong> ${order.phone || 'N/A'}</p>
              <p style="margin: 0; font-size: 10px;"><strong>Address:</strong> ${order.address}</p>
            </div>
            <div style="width: 48%; text-align: right;">
              <h3 style="margin-bottom: 10px; font-size: 12px;">Invoice Details:</h3>
              <p style="margin: 0; font-size: 10px;"><strong>ORDER No.:</strong> ${order.orderId}</p>
              <p style="margin: 0; font-size: 10px;"><strong>Order Date:</strong> ${new Date(order.orderDate).toLocaleDateString()}</p>
              <p style="margin: 0; font-size: 10px;"><strong>Total Amount:</strong> ₹ ${(order.totalAmount + totalGst).toFixed(2)}</p>
              <p style="margin: 0; font-size: 10px;"><strong>Payment Type:</strong> Cash on delivery</p>
            </div>
          </div>

          <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
            <thead>
              <tr>
                <th style="border: 1px solid #000; padding: 5px; font-size: 10px;">No.</th>
                <th style="border: 1px solid #000; padding: 5px; font-size: 10px;">Products</th>
                <th style="border: 1px solid #000; padding: 5px; font-size: 10px;">Qty.</th>
                <th style="border: 1px solid #000; padding: 5px; font-size: 10px;">Price</th>
                <th style="border: 1px solid #000; padding: 5px; font-size: 10px;">Offer Price</th>
                <th style="border: 1px solid #000; padding: 5px; font-size: 10px;">Tax</th>
                <th style="border: 1px solid #000; padding: 5px; font-size: 10px;">Subtotal</th>
              </tr>
            </thead>
            <tbody>
              ${order.products.map((product, pIndex) => `
                <tr>
                  <td style="border: 1px solid #000; padding: 5px; font-size: 10px;">${pIndex + 1}</td>
                  <td style="border: 1px solid #000; padding: 5px; font-size: 10px;">${product.productDetails?.mainCategory || ''}</td>
                  <td style="border: 1px solid #000; padding: 5px; font-size: 10px;">${product.sizeDetails?.quantity || 0}</td>
                  <td style="border: 1px solid #000; padding: 5px; font-size: 10px;">₹${product.productDetails?.price || 0}</td>
                  <td style="border: 1px solid #000; padding: 5px; font-size: 10px;">${product.productDetails?.discount || 0}%</td>
                  <td style="border: 1px solid #000; padding: 5px; font-size: 10px;">₹${product.productDetails?.gst || 0}</td>
                  <td style="border: 1px solid #000; padding: 5px; font-size: 10px;">
                    MRP Price: ₹${(
                      (product.productDetails?.price * product.sizeDetails?.quantity) +
                      (product.shippingCost || 0) +
                      (product.productDetails?.gst || 0)
                    ).toFixed(2)}<br>
                    Offer Price: ₹${(
                      (product.productDetails?.price || 0) *
                      (1 - (product.productDetails?.discount || 0) / 100) *
                      (product.sizeDetails?.quantity || 1)
                    ).toFixed(2)}
                  </td>
                </tr>
              `).join('')}
              <tr>
                <td colspan="6" style="border: 1px solid #000; padding: 5px; text-align: right; font-size: 10px;"><strong>Total GST</strong></td>
                <td style="border: 1px solid #000; padding: 5px; font-size: 10px;">₹ ${totalGst.toFixed(2)}</td>
              </tr>
              <tr>
                <td colspan="6" style="border: 1px solid #000; padding: 5px; text-align: right; font-size: 10px;"><strong>Total Amount (Including GST)</strong></td>
                <td style="border: 1px solid #000; padding: 5px; font-size: 10px;">₹ ${(order.totalAmount + totalGst).toFixed(2)}</td>
              </tr>
            </tbody>
          </table>
        </div>
      `;

      // Create a temporary div to render the HTML
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = pageContent;
      document.body.appendChild(tempDiv);

      // Convert to canvas
      const canvas = await html2canvas(tempDiv, { 
        scale: 2,
        useCORS: true,
        logging: false
      });

      // Remove temporary div
      document.body.removeChild(tempDiv);

      // Add canvas to PDF
      const imgData = canvas.toDataURL('image/png');
      pdf.addImage(imgData, 'PNG', 0, 0, 210, 297, '', 'FAST');
      
      // Add new page if not the last order
      if (index < selectedOrders.length - 1) {
        pdf.addPage();
      }
    }

    // Save the PDF
    pdf.save(`Selected_Invoices_${new Date().toISOString().split('T')[0]}.pdf`);

    // Clear selected orders and uncheck checkboxes
    setSelectedOrders([]);
    document.querySelectorAll('.form-check-input').forEach(checkbox => {
      checkbox.checked = false;
    });

  } catch (error) {
    console.error("Error generating PDF:", error);
    alert("Failed to generate PDF. Please try again.");
  }
};

// Modify checkbox handler to track selected orders
const handleOrderSelect = (order, isChecked) => {
  setSelectedOrders(prev => 
    isChecked 
      ? [...prev, order] 
      : prev.filter(o => o._id !== order._id)
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
                      document.querySelectorAll('.order-checkbox').forEach(checkbox => {
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
                <td>
                    <div className="form-check">
                      <input
                        className="form-check-input order-checkbox"
                        type="checkbox"
                        onChange={(e) => handleOrderSelect(data, e.target.checked)}
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
                  <td rowSpan={data.products?.length || 1}>{data.giftMessage}</td>
                  <td>
                    {data.products?.[0]?.productDetails?.mainCategory || "N/A"}
                  </td>
                  <td>{data.products?.[0]?.sizeDetails?.quantity || "N/A"}</td>
                  <td>{data.products?.[0]?.productDetails?.price || "N/A"}</td>
                  <td rowSpan={data.products?.length || 1}>
                    {data.totalAmount}
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
                  <td >
                    {data.products.every(product => product.stockAvailable)
                      ? "In Stock"
                      : "Out of Stock"}
                  </td>   
                  <td rowSpan={data.products?.length || 1}>
                    <Button
                      variant="primary"
                      // disabled={data.deliveryStatus === "Delivered"}
                      disabled={data.deliveryStatus === "Delivered" || !data.products.every(product => product.stockAvailable)}
                      onClick={() => handleDelivered(data)}
                    >
                      Mark as Delivered
                    </Button>
                  </td>    
                  <td rowSpan={data.products?.length || 1}>
                  <Button 
                      variant="danger" 
                      disabled={data.deliveryStatus !== "Delivered" || data.return}
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
                        <i className="fa-light fa-trash" onClick={() => deleteCustomerOrder(data._id)}></i>
                      </button>
                    </div>
                  </td>
                </tr>
                {data.products?.slice(1).map((product, productIndex) => (
                  <tr key={`${index}-${productIndex}`}>
                    <td>{product.productDetails?.mainCategory || "N/A"}</td>
                    <td>{product.sizeDetails?.quantity || "N/A"}</td>
                    <td>{product.productDetails?.price || "N/A"}</td>
                    <td>{product.stockAvailable ? "In Stock" : "Out of Stock"}</td>
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
            <Modal.Title>Edit Order</Modal.Title>
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
                <Col md={4}>
                  <Form.Group controlId="shopName">
                    <Form.Label>Shop Name</Form.Label>
                    <Form.Control
                      type="text"
                      name="shopName"
                      value={selectedOrder.shopName || ""}
                      onChange={handleInputChange}
                    />
                  </Form.Group>
                </Col>
                <Col md={4}>
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
                <Col md={4}>
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