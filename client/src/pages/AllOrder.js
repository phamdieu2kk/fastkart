import React, { useEffect, useState } from 'react';
import SummaryApi from '../common';
import OrderItem from '../components/OrderItem';

const AllOrder = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      const res = await fetch(SummaryApi.allOrder.url, {
        method: SummaryApi.allOrder.method,
        credentials: 'include',
      });
      const data = await res.json();
      setOrders(data.data || []);
    };
    fetchOrders();
  }, []);

  if (!orders.length) return <p className="py-10 text-center text-gray-500">No Order available</p>;

  return (
    <div className="h-[calc(100vh-190px)] overflow-y-scroll p-4">
      {orders.map(order => (
        <OrderItem key={order._id} order={order} showUserEmail={true} />
      ))}
    </div>
  );
};

export default AllOrder;
