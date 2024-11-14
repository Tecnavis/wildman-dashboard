import React, { useEffect, useState } from 'react';
import { Button } from 'react-bootstrap';
import { OverlayScrollbarsComponent } from 'overlayscrollbars-react';
import PaginationSection from './PaginationSection';
import { Link } from 'react-router-dom';
import { fetchSalesOrders, updateDeliveryStatus } from '../../Helper/handle-api'; // Add API helper for updating status
import Swal from 'sweetalert2';
import Task from './Task2';

const TaskTable = () => {
  const adminDetails = JSON.parse(localStorage.getItem('adminDetails'));
  const Admin = adminDetails ? adminDetails.name : 'Unknown Admin';
 
  
  const [currentPage, setCurrentPage] = useState(1);
  const [dataPerPage] = useState(10);
  const [salesOrders, setSalesOrders] = useState([]);
  
  // Fetch all sales orders
  useEffect(() => {
    const getSalesOrders = async () => {
      const response = await fetchSalesOrders();
      if (response && Array.isArray(response.orders)) {
        setSalesOrders(response.orders);
      } else {
        setSalesOrders([]);
        console.error('Expected an array in response.orders, but got:', response);
      }
    };
    getSalesOrders();
  }, []);

  // Filter sales orders based on delivery status
  const filteredSalesOrders = salesOrders.filter(
    (order) => order.deliveryStatus === 'Out for delivery' || order.deliveryStatus === 'On transist'
  );

  // Pagination logic
  const indexOfLastData = currentPage * dataPerPage;
  const indexOfFirstData = indexOfLastData - dataPerPage;
  const currentData = filteredSalesOrders.slice(indexOfFirstData, indexOfLastData);

  // Calculate total number of pages
  const totalPages = Math.ceil(filteredSalesOrders.length / dataPerPage);
  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleDelivered = async (orderId) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "Do you want to mark this order as Delivered?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, mark as Delivered!',
      cancelButtonText: 'Cancel'
    });
    if (result.isConfirmed) {
      const currentDate = new Date();
      try {
        const response = await updateDeliveryStatus(orderId, {
          deliveryStatus: 'Delivered',
          deliveryDate: currentDate,
          adminName:Admin
        });
  
        if (response.success) {
          setSalesOrders((prevOrders) =>
            prevOrders.map((order) =>
              order._id === orderId
                ? { ...order, deliveryStatus: 'Delivered', deliveryDate: currentDate, adminName:Admin }
                : order
            )
          );
          Swal.fire({
            icon: 'success',
            title: 'Delivery status updated successfully',
            showConfirmButton: false,
            timer: 1500
          });
          console.log(`%cOrder ${orderId} Product has been Delivered`, 'color: green;');
                    
        } else {
          console.error('Failed to update delivery status');
        }
      } catch (error) {
        console.error('Error updating delivery status:', error);
      }
    }
  };
  
  return (
    <>
      {/* <OverlayScrollbarsComponent> */}
      <Task/>
      {/* </OverlayScrollbarsComponent> */}
     
      <PaginationSection
        currentPage={currentPage}
        totalPages={totalPages}
        paginate={paginate}
        pageNumbers={pageNumbers}
      />
    </>
  );
};

export default TaskTable;
