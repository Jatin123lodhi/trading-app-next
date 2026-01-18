"use client";
import { useEffect, useState } from "react";

const OrdersList = ({ marketId, refreshTrigger }: { marketId: string, refreshTrigger?: number }) => {
    const [orders, setOrders] = useState<{ _id: string, amount: number, outcome: string, status: string, createdAt: Date }[]>([]);
    useEffect(() => {
        const fetchOrders = async () => {
            const response = await fetch(`/api/orders?marketId=${marketId}`, {
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem("token")}`
                }
            });
            const data = await response.json();
            setOrders(data.data);
        };
        fetchOrders();
    }, [marketId, refreshTrigger]);
    if(orders.length === 0) return <div></div>;
    return (
        <div>
            <h3 className="text-lg font-bold">Orders</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {orders.map((order) => (
                    <div key={order._id} className="border p-4 rounded-md">
                        <p>Amount: {order.amount}</p>
                        <p>Placed Outcome: {order.outcome}</p>
                        <p>Status: {order.status}</p>
                        <p>Placed At: {new Date(order.createdAt).toLocaleDateString()}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default OrdersList;