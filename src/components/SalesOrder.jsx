import React, { useState, useEffect } from 'react';
import ProductCard from './ProductCard';
import { Trash2, ChevronDown, ChevronUp } from 'lucide-react';

const SalesOrder = ({
  order,
  updateOrderName,
  deleteOrder,
  updateCard,
  addCardBelow,
  deleteCard,
  toggleVisibility,
  toggleOperator
}) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [orderTotal, setOrderTotal] = useState(0);

  useEffect(() => {
    const total = order.cards.reduce((acc, card) => {
      if (!card.isVisible) return acc;
      const subtotal = card.price * card.qty;
      return card.operator === 'add' ? acc + subtotal : acc - subtotal;
    }, 0);
    setOrderTotal(total);
  }, [order.cards]);

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8 border border-gray-200">
      
      {/* Order Header */}
      <div className="bg-gray-50 border-b border-gray-200 p-4 sm:px-6 flex flex-wrap sm:flex-nowrap items-center justify-between gap-4">
        <div className="flex-1 min-w-[200px]">
          <input
            type="text"
            value={order.orderName}
            onChange={(e) => updateOrderName(order.id, e.target.value)}
            placeholder="Sales Order Name (e.g., Customer A)"
            className="w-full bg-transparent text-xl font-bold text-gray-800 placeholder-gray-400 focus:outline-none border-b border-transparent focus:border-theme-accent transition-colors"
          />
        </div>
        
        <div className="flex items-center gap-4">
          <div className="text-right">
            <span className="text-xs uppercase tracking-wider text-gray-500 font-semibold block">Order Total</span>
            <span className={`text-xl font-bold ${orderTotal < 0 ? 'text-red-600' : 'text-theme-accent'}`}>
              {orderTotal.toLocaleString('en-IN', { style: 'currency', currency: 'INR' }).replace('₹', '₹ ')}
            </span>
          </div>
          
          <div className="flex items-center gap-1 border-l border-gray-300 pl-4 ml-2">
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-2 text-gray-500 hover:text-theme-accent hover:bg-blue-50 rounded-full transition-colors"
              title={isExpanded ? "Collapse Order" : "Expand Order"}
            >
              {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            </button>
            <button
              onClick={() => deleteOrder(order.id)}
              className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
              title="Delete Entire Order"
            >
              <Trash2 size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* Order Content */}
      {isExpanded && (
        <div className="p-4 sm:p-6 bg-theme-bg/30">
          <div className="space-y-6 mt-4">
            {order.cards.map(card => (
              <ProductCard
                key={card.id}
                card={card}
                updateCard={(cardId, field, value) => updateCard(order.id, cardId, field, value)}
                addCardBelow={(cardId) => addCardBelow(order.id, cardId)}
                deleteCard={(cardId) => deleteCard(order.id, cardId)}
                toggleVisibility={(cardId) => toggleVisibility(order.id, cardId)}
                toggleOperator={(cardId) => toggleOperator(order.id, cardId)}
                isOnlyCard={order.cards.length === 1}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SalesOrder;
