import React, { useContext, useEffect, useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { DigiContext } from '../../context/DigiContext';
import { fetchProducts, fetchSalesOrders } from '../../Helper/handle-api';
import moment from 'moment'; // Import moment.js for date handling

const SalesChart = () => {
  const [monthlyData, setMonthlyData] = useState([]);
  const currentYear = moment().year(); // Get the current year

  // Define month names
  const monthNames = moment.months(); // ['January', 'February', ..., 'December']

  useEffect(() => {
    // Fetch and process product stock data
    fetchProducts()
      .then((res) => {
        processStockData(res); // Process the product stock data
      })
      .catch((err) => {
        console.log(err);
      });

    // Fetch and process sales orders data
    fetchSalesOrders()
      .then((res) => {
        processOrderData(res.orders); // Process the sales orders data
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  // Process stock data for each month
  const processStockData = (products) => {
    const monthlyStock = {};

    products.forEach(product => {
      const productDate = moment(product.date);
      if (productDate.year() === currentYear) { // Only process current year data
        const month = productDate.month(); // Get the month index (0-11)
        if (!monthlyStock[month]) {
          monthlyStock[month] = { stock: 0, order: 0 }; // Initialize stock and order counts
        }

        product.sizes.forEach(size => {
          monthlyStock[month].stock += size.stock; // Add the stock for each size
        });
      }
    });

    setMonthlyData(prevData => mergeMonthlyData(prevData, monthlyStock));
  };

  // Process order data for each month
  const processOrderData = (orders) => {
    const monthlyOrders = {};

    orders.forEach(order => {
      const orderDate = moment(order.orderDate);
      if (orderDate.year() === currentYear) { // Only process current year data
        const month = orderDate.month(); // Get the month index (0-11)
        if (!monthlyOrders[month]) {
          monthlyOrders[month] = { stock: 0, order: 0 }; // Initialize stock and order counts
        }

        // Sum the quantities from the products array
        const totalQuantity = order.products.reduce((acc, product) => acc + product.quantity, 0);
        monthlyOrders[month].order += totalQuantity; // Add the total quantity
      }
    });

    setMonthlyData(prevData => mergeMonthlyData(prevData, monthlyOrders));
  };

  // Merge stock and order data into one dataset
  const mergeMonthlyData = (existingData, newData) => {
    const mergedData = { ...existingData };

    // Update merged data with stock and orders
    Object.keys(newData).forEach(month => {
      if (!mergedData[month]) {
        mergedData[month] = { stock: 0, order: 0 };
      }
      mergedData[month].stock += newData[month].stock || 0;
      mergedData[month].order += newData[month].order || 0;
    });

    // Prepare final data with all month names
    const filledData = monthNames.map((monthName, index) => {
      const foundData = mergedData[index] || { stock: 0, order: 0 }; // Get data or default to 0
      return {
        name: monthName, // Use the full month name
        stock: foundData.stock,
        order: foundData.order,
      };
    });

    return filledData;
  };

  const { isLightTheme, isRechartHeight } = useContext(DigiContext);

  return (
    <ResponsiveContainer width="100%" maxHeight={410} minHeight={isRechartHeight}>
      <AreaChart data={monthlyData} margin={{ top: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3" stroke={`${isLightTheme ? 'hsl(0deg 0% 0% / 20%)' : 'rgba(255, 255, 255, 0.2)'}`} />
        <XAxis dataKey="name" stroke={`${isLightTheme ? 'hsl(0deg 0% 27.45% / 70%)' : 'hsl(0deg 0% 89.41% / 70%)'}`} />
        <YAxis stroke={`${isLightTheme ? 'hsl(0deg 0% 27.45% / 70%)' : 'hsl(0deg 0% 89.41% / 70%)'}`} />
        <Tooltip />
        <Legend className='sales' />

        {/* Stock Data */}
        <Area type='monotone' dataKey="stock" stackId="1" fill="hsl(205.29deg 100% 52.55% / 60%)" stroke="hsl(205.29deg 100% 52.55% / 60%)" />

        {/* Order Data in Red */}
        <Area type='monotone' dataKey="order" stackId="1" fill="red" stroke="red" />
      </AreaChart>
    </ResponsiveContainer>
  );
};

export default SalesChart;
