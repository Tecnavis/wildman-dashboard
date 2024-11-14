import React, { useEffect, useState } from "react";
import { Table } from "react-bootstrap";
import { OverlayScrollbarsComponent } from "overlayscrollbars-react";
import PaginationSection from "./PaginationSection";
import { fetchProducts, URL } from "../../Helper/handle-api";
import EditProductModal from "./editProductModal";
import axios from "axios";
import Swal from "sweetalert2";
const AllProductTable = ({ filteredProducts }) => {
  const [products, setProducts] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);
  const [dataPerPage] = useState(20);
  const dataList = products;
  const [selectedSizeStock, setSelectedSizeStock] = useState({});
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showModal, setShowModal] = useState(false);
  // Pagination logic
  const indexOfLastData = currentPage * dataPerPage;
  const indexOfFirstData = indexOfLastData - dataPerPage;
  const currentProducts = filteredProducts.slice(
    indexOfFirstData,
    indexOfLastData
  );
  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Calculate total number of pages
  const totalPages = Math.ceil(filteredProducts.length / dataPerPage);
  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

  // All product list

  useEffect(() => {
    const fetchProduct = async () => {
      const response = await fetchProducts();
      setProducts(response);
    };
    fetchProduct();
  }, []);

  // Handle size selection and set stock count for each size
  useEffect(() => {
    setCurrentPage(1);
  }, [filteredProducts]);

  // Handle size selection and set stock count for each size
  const handleSizeChange = (productId, stock) => {
    setSelectedSizeStock((prevState) => ({
      ...prevState,
      [productId]: stock,
    }));
  };
  // Date format
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const year = date.getUTCFullYear();
    const month = String(date.getUTCMonth() + 1).padStart(2, "0");
    const day = String(date.getUTCDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };
  // Calculate total stock for a product
  const calculateTotalStock = (sizes) => {
    return sizes.reduce((total, sizeData) => total + sizeData.stock, 0);
  };
  // Render the status based on total stock
  const renderStockStatus = (totalStock) => {
    if (totalStock === 0) {
      return <span style={{ color: "red" }}>Out of Stock</span>;
    }
    return <span style={{ color: "green" }}>In Stock</span>;
  };

  // Handle product edit icon click
  const handleEditProduct = (product) => {
    setSelectedProduct(product);
    setShowModal(true);
  };

  const handleSave = () => {
    setShowModal(false);
  };

  // Handle product deletion
  const handleDeleteProduct = (productId) => {
    Swal.fire({
      title: "Are you sure?",
      text: "Do you want to delete this product?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(`${URL}/product/${productId}`);
          setProducts((prevProducts) =>
            prevProducts.filter((product) => product._id !== productId)
          );
          Swal.fire("Deleted!", "Your product has been deleted.", "success");
        } catch (error) {
          Swal.fire(
            "Error!",
            "There was an error deleting the product.",
            "error"
          );
        }
      }
    });
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
              <th className="no-sort">
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="markAllProduct"
                  />
                </div>
              </th>
              <th>Product</th>
              <th>ID</th>
              <th>Total Stock</th>
              <th>Color</th>
              <th>Size</th>
              <th>Price</th>
              <th>Model Number</th>
              <th>Added Date</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {currentProducts.map((product) => {
              const totalStock = calculateTotalStock(product.sizes); // Calculate total stock

              return (
                <tr key={product._id}>
                  <td>
                    <div className="form-check">
                      <input className="form-check-input" type="checkbox" />
                    </div>
                  </td>
                  <td>
                    <div className="table-product-card">
                      <div className="part-img">
                        <img
                          src={`${URL}/images/${product.coverimage}`}
                          alt="Product"
                        />
                      </div>
                      <div className="part-txt">
                        <span className="product-name">
                          {product.subCategory}
                        </span>
                        <span className="product-category">
                          Category: {product.mainCategory}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td>{product.productId}</td>
                  <td>{totalStock}</td>
                  <td>{product.color}</td>
                  <td>
                    <div className="size-selection-wrapper">
                      <select
                        className="form-control size-select"
                        onChange={(e) =>
                          handleSizeChange(product._id, e.target.value)
                        }
                        aria-label={`Select size for product ${product.productId}`}
                      >
                        <option value="" disabled>
                          Select Size
                        </option>
                        {product.sizes.map((sizeData) => (
                          <option key={sizeData._id} value={sizeData.stock}>
                            {`Size: ${sizeData.size} (Stock: ${sizeData.stock})`}
                          </option>
                        ))}
                      </select>
                    </div>
                  </td>
                  <td>${product.price}</td>
                  <td>{product.modelNo}</td>
                  <td>{formatDate(product.date)}</td>
                  <td>{renderStockStatus(totalStock)}</td>{" "}
                  <td>
                    <div className="btn-box">
                      <button>
                        <i className="fa-light fa-eye"></i>
                      </button>
                      <button onClick={() => handleEditProduct(product)}>
                        <i className="fa-light fa-pen"></i>
                      </button>

                      <button onClick={() => handleDeleteProduct(product._id)}>
                        <i className="fa-light fa-trash"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      </OverlayScrollbarsComponent>
      <PaginationSection
        currentPage={currentPage}
        totalPages={totalPages}
        paginate={paginate}
        pageNumbers={pageNumbers}
      />
      <EditProductModal
        productId={selectedProduct?._id}
        show={showModal}
        onClose={() => setShowModal(false)}
        onSave={handleSave}
      />
    </>
  );
};

export default AllProductTable;
