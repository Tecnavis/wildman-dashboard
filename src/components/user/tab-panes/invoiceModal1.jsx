import React, { useCallback, useRef,useState,useEffect } from "react";
import { Modal } from "react-bootstrap";
import "./style.css";
import { URL } from "../../../Helper/handle-api";
import axios from "axios";
import Swal from "sweetalert2";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

const InvoiceModal = ({ show, handleClose, invoiceData }) => {
  const adminDetails = JSON.parse(localStorage.getItem("adminDetails"));
  const adminName = adminDetails ? adminDetails.name : "Unknown Admin";

  const totalAmount = invoiceData.totalAmount
    ? invoiceData.totalAmount.toFixed(2)
    : "0.00";
  const paidAmount = invoiceData.paidAmount
    ? Number(invoiceData.paidAmount).toFixed(2)
    : "0.00";
  const balanceAmount = (invoiceData.balanceAmount || 0).toFixed(2);

  const modalContentRef = useRef(null);

  const handleSendEmail = useCallback(async () => {
    if (!modalContentRef.current) {
      console.error("Modal content not found");
      return;
    }

    try {
      const canvas = await html2canvas(modalContentRef.current, {
        scale: 2,
        useCORS: true,
        logging: true,
        height: modalContentRef.current.offsetHeight + 40,
        width: modalContentRef.current.offsetWidth + 40,
      });

      const imgData = canvas.toDataURL("image/png");

      const pdf = new jsPDF("p", "mm", "a4");
      const imgWidth = 210;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);

      const pdfBlob = pdf.output("blob");

      // Check file size
      if (pdfBlob.size > 50 * 1024 * 1024) {
        Swal.fire(
          "Error",
          "The generated PDF is too large (max 10MB). Please try reducing the content.",
          "error"
        );
        return;
      }

      console.log("PDF Blob size:", pdfBlob.size); // Log the size of the PDF blob

      const formData = new FormData();
      formData.append(
        "pdf",
        pdfBlob,
        `invoice-${invoiceData.customerName}.pdf`
      );
      formData.append("Email", invoiceData.email);
      formData.append("adminName", adminName);

      const response = await axios.post(
        `${URL}/salesorder/send-email`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      if (response.status === 200) {
        Swal.fire("Success", "Email sent successfully", "success");
      }
    } catch (error) {
      console.error("Error sending email:", error);
      if (error.response) {
        console.error("Error response data:", error.response.data);
        console.error("Error response status:", error.response.status);
        console.error("Error response headers:", error.response.headers);
        Swal.fire(
          "Error",
          `Failed to send email: ${error.response.data.message}`,
          "error"
        );
      } else if (error.request) {
        console.error("Error request:", error.request);
        Swal.fire("Error", "No response received from server", "error");
      } else {
        console.error("Error message:", error.message);
        Swal.fire("Error", `Failed to send email: ${error.message}`, "error");
      }
    }
  }, [invoiceData, adminName]);

  const [logo, setLogo] = useState([]);

  // Fetch logo
  useEffect(() => {
    const fetchLogo = async () => {
      try {
        const response = await axios.get(`${URL}/logo`);
        setLogo(response.data);
      } catch (error) {
        console.error("Error fetching logo:", error);
      }
    };
    fetchLogo();
  }, []);
  return (
    <Modal show={show} onHide={handleClose} size="xl" centered>
      <Modal.Header closeButton>
        <Modal.Title>Invoice</Modal.Title>
      </Modal.Header>
      <Modal.Body className="invoice-modal-body">
        <div ref={modalContentRef} style={{ padding: "20px" }}>
          <div className="invoice-header mb-4">
            <div className="row justify-content-between align-items-start">
              <div className="col-xl-4 col-lg-5 col-sm-6">
                <div className="shop-address">
                  <div className="logo mb-3">
                    {logo.map((data) => (
                      <img
                        key={data._id}
                        className="logo"
                        src={`${URL}/images/${data.image}`}
                        alt="Business Logo"
                        style={{
                          width: "100px",
                        }}
                      />
                    ))}
                  </div>
                  <div className="part-txt">
                    <p>
                      <strong>Admin:</strong> {adminName}
                    </p>
                    <p>
                      <strong>Address:</strong> 456 E-Commerce Avenue,
                      Cityville, Countryland
                    </p>
                    <p>
                      <strong>Email:</strong> support@shopifymart.com
                    </p>
                    <p>
                      <strong>Phone:</strong> +1 (800) 123-4567
                    </p>
                  </div>
                </div>
              </div>
              <div className="col-sm-6 text-end">
                <div className="customer-details">
                  <h4>Customer Details:</h4>
                  <ul className="list-unstyled">
                    <li>
                      <strong>Name:</strong> {invoiceData.customerName}
                    </li>
                    <li>
                      <strong> Email:</strong> {invoiceData.email}
                    </li>
                    <li>
                      <strong>Phone:</strong> {invoiceData.phone}
                    </li>
                    <li>
                      <strong>Address:</strong> {invoiceData.address}
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div className="invoice-body">
            <div className="product-details mb-4">
              <h4>Product Details:</h4>
              <table className="table table-bordered">
                <thead className="table-light">
                  <tr>
                    <th>Product Name</th>
                    <th>Quantity</th>
                    <th>Size</th>
                    <th>Price</th>
                    <th>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {(invoiceData.products || []).map((product, index) => {
                    const productTotal = (
                      (product.price || 0) * (product.quantity || 0)
                    ).toFixed(2);
                    return (
                      <tr key={index}>
                        <td>{product.mainCategory}</td>
                        <td>{product.quantity || 0}</td>
                        <td>{product.size}</td>
                        <td>${(product.price || 0).toFixed(2)}</td>
                        <td>${productTotal}</td>
                      </tr>
                    );
                  })}
                  <tr>
                    <td colSpan={4} className="text-end fw-bold">
                      Balance:
                    </td>
                    <td>${balanceAmount}</td>
                  </tr>
                  <tr>
                    <td colSpan={4} className="text-end fw-bold">
                      Paid Amount:
                    </td>
                    <td>${paidAmount}</td>
                  </tr>
                  <tr>
                    <td colSpan={4} className="text-end fw-bold">
                      Total Amount:
                    </td>
                    <td>${totalAmount}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <button className="btn btn-primary" onClick={handleSendEmail}>
          Send
        </button>
        <button className="btn btn-secondary" onClick={handleClose}>
          Close
        </button>
      </Modal.Footer>
    </Modal>
  );
};

export default InvoiceModal;
