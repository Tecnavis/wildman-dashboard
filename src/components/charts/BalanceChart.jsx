import React, { useContext, useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { DigiContext } from '../../context/DigiContext';
import { fetchProducts, fetchSalesOrders } from '../../Helper/handle-api';

const BalanceChart = () => {
  const [chartData, setChartData] = useState([]);
  const { isLightTheme, isRechartHeight } = useContext(DigiContext);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsResponse, ordersResponse] = await Promise.all([
          fetchProducts(),
          fetchSalesOrders()
        ]);

        console.log('Products Response:', productsResponse);
        console.log('Sales Orders Response:', ordersResponse);

        if (!Array.isArray(productsResponse) || !ordersResponse || !Array.isArray(ordersResponse.orders)) {
          console.error('Invalid data format received');
          return;
        }

        const currentYear = new Date().getFullYear();

        const stockByMonth = productsResponse.reduce((acc, product) => {
          const productDate = new Date(product.date);
          if (productDate.getFullYear() === currentYear) {
            const month = productDate.toLocaleString('default', { month: 'long' });
            if (!acc[month]) acc[month] = 0;
            acc[month] += product.sizes.reduce((sum, size) => sum + size.stock, 0);
          }
          return acc;
        }, {});

        const ordersByMonth = ordersResponse.orders.reduce((acc, order) => {
          const orderDate = new Date(order.orderDate);
          if (orderDate.getFullYear() === currentYear) {
            const month = orderDate.toLocaleString('default', { month: 'long' });
            if (!acc[month]) acc[month] = 0;
            acc[month] += order.products.reduce((sum, product) => sum + product.quantity, 0);
          }
          return acc;
        }, {});

        const months = [
          'January', 'February', 'March', 'April', 'May', 'June', 
          'July', 'August', 'September', 'October', 'November', 'December'
        ];

        const data = months.map(month => ({
          name: month,
          stock: stockByMonth[month] || 0,
          order: ordersByMonth[month] || 0
        }));

        console.log('Chart Data:', data);
        setChartData(data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <ResponsiveContainer width="100%" maxHeight={410} minHeight={isRechartHeight}>
      <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 15 }}>
        <CartesianGrid strokeDasharray="3" stroke={isLightTheme ? 'rgb(0 0 0 / 20%)' : 'rgba(255, 255, 255, 0.2)'} />
        <XAxis dataKey="name" stroke={isLightTheme ? 'hsl(0deg 0% 0% / 70%)' : 'hsl(0deg 0% 89.41% / 70%)'} />
        <YAxis stroke={isLightTheme ? 'hsl(0deg 0% 0% / 70%)' : 'hsl(0deg 0% 89.41% / 70%)'} />
        <Tooltip />
        <Legend />
        <Bar dataKey="stock" fill="#0D99FF" name="Stock" />
        <Bar dataKey="order" fill="#a9b4cc" name="Orders" />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default BalanceChart;