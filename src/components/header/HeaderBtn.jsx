import React, { useEffect, useState } from 'react';
import { fetchCustomerOrder } from '../../Helper/handle-api';

const HeaderBtn = () => {
  const [customerOrder, setCustomerOrder] = useState([]);

  useEffect(() => {
    fetchCustomerOrder().then((response) => {
      if (response && Array.isArray(response.orders)) {
        setCustomerOrder(response.orders);
      } else {
        setCustomerOrder([]);
      }
    });
  }, []);

  // Calculate counts based on deliveryStatus
  const deliveryStatusCounts = customerOrder.reduce(
    (counts, order) => {
      counts[order.deliveryStatus] = (counts[order.deliveryStatus] || 0) + 1;
      counts['All'] = (counts['All'] || 0) + 1;
      return counts;
    },
    { All: 0 }
  );

  return (
    <div className="product-table-quantity d-flex justify-content-between align-items-center mb-20">
      <ul className="mb-0">
        <li className="text-white">All ({deliveryStatusCounts.All || 0})</li>
        <li>Delivered ({deliveryStatusCounts.Delivered || 0})</li>
        <li>Out for Delivery ({deliveryStatusCounts["Out for delivery"] || 0})</li>
        <li>Cancel ({deliveryStatusCounts.Cancelled || 0})</li>
        <li>On Transit ({deliveryStatusCounts["On transit"] || 0})</li>
        <li>Pending ({deliveryStatusCounts.Pending || 0})</li>
        <li>Returned ({deliveryStatusCounts.Returned || 0})</li>
      </ul>
    </div>
  );
};

export default HeaderBtn;
