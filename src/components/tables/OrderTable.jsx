import React, { useEffect, useState } from "react";
import { Button, Table } from "react-bootstrap";
import { allProductData } from "../../data/Data";
import { OverlayScrollbarsComponent } from "overlayscrollbars-react";
import PaginationSection from "./PaginationSection";
import { fetchProducts, URL } from "../../Helper/handle-api";
import Swal from 'sweetalert2';

const AllOrderTable = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [dataPerPage] = useState(10);
  const dataList = allProductData;
  const [selectedSizeStock, setSelectedSizeStock] = useState({});

  // Get admin ID from localStorage
  const adminDetails = JSON.parse(localStorage.getItem('adminDetails'));
  const adminId = adminDetails ? adminDetails._id : null;

  // Pagination logic
  const indexOfLastData = currentPage * dataPerPage;
  const indexOfFirstData = indexOfLastData - dataPerPage;
  const currentData = dataList.slice(indexOfFirstData, indexOfLastData);

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Calculate total number of pages
  const totalPages = Math.ceil(dataList.length / dataPerPage);
  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  // All product list
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProduct = async () => {
      const response = await fetchProducts();
      setProducts(response);
    };
    fetchProduct();
  }, []);

  // Handle size selection and set stock count for each size
  const handleSizeChange = (productId, stock) => {
    setSelectedSizeStock((prevState) => ({
      ...prevState,
      [productId]: stock,
    }));
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

  // Shopping bag redirection
  const shoppingBag = () => {
    window.location.href = "/shoppingbag";
  };

  const [selectedProducts, setSelectedProducts] = useState([]);

  const handleCheckboxChange = (product) => {
    const isProductSelected = selectedProducts.find(p => p.productId === product._id);
    if (isProductSelected) {
      setSelectedProducts(selectedProducts.filter(p => p.productId !== product._id));
    } else {
      setSelectedProducts([...selectedProducts, {
        productId: product._id,
        size: selectedSizeStock[product._id] || "default size", // Replace with actual size logic
        stock: selectedSizeStock[product._id] || 0 // Replace with actual stock logic
      }]);
    }
  };

  const handleAddToCart = async () => {
    try {
      if (!adminId) {
        console.error('Admin ID not found in localStorage');
        return;
      }
  
      const response = await fetch(`${URL}/shopping`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ adminId, products: selectedProducts }),
      });
  
      const result = await response.json();
      if (response.ok) {
        window.location.href = "/shoppingbag";
      } else {
        Swal.fire({
          title: 'Already added',
          text: 'The product is already in your cart!',
          confirmButtonText: 'OK',
        });
      }
    } catch (error) {
      console.error('Error adding to cart', error);
      // Show SweetAlert for the error
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Something went wrong! Please try again later.',
        confirmButtonText: 'OK',
      });
    }
  };
  
  return (
    <>
      <OverlayScrollbarsComponent>
      <Button onClick={handleAddToCart} style={{marginBottom: "10px"}}>Add to Cart</Button>
        <Table
          className="table table-dashed table-hover digi-dataTable all-product-table table-striped"
          id="AllOrderTable"
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
              <th>Color</th>
              <th>Size</th>
              <th>Price</th>
              <th>Model Number</th>
              <th>Status</th>
              {/* <th>Action</th> */}
            </tr>
          </thead>
          <tbody>
            {products.map((product) => {
              const totalStock = calculateTotalStock(product.sizes); // Calculate total stock

              return (
                <tr key={product._id}>
                  <td>
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        onChange={() => handleCheckboxChange(product)}
                      />
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
                          <option
                            key={sizeData._id}
                            value={sizeData.stock}
                          >
                            {`Size: ${sizeData.size} (Stock: ${sizeData.stock})`}
                          </option>
                        ))}
                      </select>
                    </div>
                  </td>
                  <td>${product.price}</td>
                  <td>{product.modelNo}</td>
                  <td>{renderStockStatus(totalStock)}</td>
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
    </>
  );
};

export default AllOrderTable;
