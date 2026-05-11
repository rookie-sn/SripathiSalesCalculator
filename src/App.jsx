import React, { useState, useEffect } from 'react';
import SalesOrder from './components/SalesOrder';
import { PlusCircle, Calculator as CalcIcon } from 'lucide-react';

const generateId = () => Math.random().toString(36).substr(2, 9);

function App() {
  const [orders, setOrders] = useState(() => {
    // Load from localStorage on initial render
    const saved = localStorage.getItem('sripathi_sales_orders');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Failed to parse local storage data");
      }
    }
    // Default state if nothing in local storage
    return [
      {
        id: generateId(),
        orderName: 'New Sale',
        cards: [
          { id: generateId(), name: '', price: 0, qty: 0, isVisible: true, operator: 'add' }
        ]
      }
    ];
  });

  const [masterTotal, setMasterTotal] = useState(0);

  // Save to localStorage and calculate Master Total whenever orders change
  useEffect(() => {
    localStorage.setItem('sripathi_sales_orders', JSON.stringify(orders));

    let total = 0;
    orders.forEach(order => {
      order.cards.forEach(card => {
        if (!card.isVisible) return;
        const subtotal = card.price * card.qty;
        if (card.operator === 'add') total += subtotal;
        else total -= subtotal;
      });
    });
    setMasterTotal(total);
  }, [orders]);

  // --- Order Level Operations ---
  const addNewOrder = () => {
    setOrders(prevOrders => [
      {
        id: generateId(),
        orderName: 'New Sale',
        cards: [{ id: generateId(), name: '', price: 0, qty: 0, isVisible: true, operator: 'add' }]
      },
      ...prevOrders
    ]);
  };

  const deleteOrder = (orderId) => {
    setOrders(prevOrders => {
      if (prevOrders.length === 1 && window.confirm("This will clear your only order. Are you sure?")) {
         return [{
          id: generateId(),
          orderName: 'New Sale',
          cards: [{ id: generateId(), name: '', price: 0, qty: 0, isVisible: true, operator: 'add' }]
        }];
      } else if (prevOrders.length > 1) {
        return prevOrders.filter(o => o.id !== orderId);
      }
      return prevOrders;
    });
  };

  const updateOrderName = (orderId, newName) => {
    setOrders(prevOrders => prevOrders.map(o => o.id === orderId ? { ...o, orderName: newName } : o));
  };

  // --- Card Level Operations ---
  const updateCard = (orderId, cardId, field, value) => {
    setOrders(prevOrders => prevOrders.map(o => {
      if (o.id !== orderId) return o;
      return {
        ...o,
        cards: o.cards.map(c => c.id === cardId ? { ...c, [field]: value } : c)
      };
    }));
  };

  const addCardBelow = (orderId, cardId) => {
    setOrders(prevOrders => prevOrders.map(o => {
      if (o.id !== orderId) return o;
      const index = o.cards.findIndex(c => c.id === cardId);
      const newCards = [...o.cards];
      newCards.splice(index + 1, 0, { id: generateId(), name: '', price: 0, qty: 0, isVisible: true, operator: 'add' });
      return { ...o, cards: newCards };
    }));
  };

  const deleteCard = (orderId, cardId) => {
    setOrders(prevOrders => prevOrders.map(o => {
      if (o.id !== orderId) return o;
      if (o.cards.length === 1) return o; // Prevent deleting the last card in an order
      return {
        ...o,
        cards: o.cards.filter(c => c.id !== cardId)
      };
    }));
  };

  const toggleVisibility = (orderId, cardId) => {
    setOrders(prevOrders => prevOrders.map(o => {
      if (o.id !== orderId) return o;
      return {
        ...o,
        cards: o.cards.map(c => c.id === cardId ? { ...c, isVisible: !c.isVisible } : c)
      };
    }));
  };

  const toggleOperator = (orderId, cardId) => {
    setOrders(prevOrders => prevOrders.map(o => {
      if (o.id !== orderId) return o;
      return {
        ...o,
        cards: o.cards.map(c => c.id === cardId ? { ...c, operator: c.operator === 'add' ? 'subtract' : 'add' } : c)
      };
    }));
  };

  return (
    <div className="min-h-screen bg-theme-bg relative font-sans">
      {/* Sticky Header */}
      <header className="fixed top-0 left-0 right-0 bg-theme-accent text-white shadow-md z-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CalcIcon size={24} className="hidden sm:block" />
            <h1 className="text-lg sm:text-xl font-bold tracking-widest uppercase">
              Sripathi Agency
            </h1>
          </div>
          <button 
            onClick={addNewOrder}
            className="flex items-center gap-2 bg-white text-theme-accent hover:bg-gray-100 px-3 py-1.5 sm:px-4 sm:py-2 rounded-md font-semibold text-sm transition-colors shadow-sm"
          >
            <PlusCircle size={18} />
            <span className="hidden sm:inline">New Sale</span>
            <span className="sm:hidden">Add</span>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-20 sm:pt-24 pb-32 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto space-y-6">
          {orders.map(order => (
            <SalesOrder
              key={order.id}
              order={order}
              updateOrderName={updateOrderName}
              deleteOrder={deleteOrder}
              updateCard={updateCard}
              addCardBelow={addCardBelow}
              deleteCard={deleteCard}
              toggleVisibility={toggleVisibility}
              toggleOperator={toggleOperator}
            />
          ))}
          
          {orders.length === 0 && (
             <div className="text-center py-20 text-gray-500">
                <p>No active sales orders.</p>
                <button onClick={addNewOrder} className="mt-4 text-theme-accent font-bold hover:underline">
                  Create a new sale
                </button>
             </div>
          )}
        </div>
      </main>

      {/* Sticky Master Grand Total Footer */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-[0_-4px_10px_-2px_rgba(0,0,0,0.1)] p-4 sm:p-6 z-50">
        <div className="max-w-5xl mx-auto flex flex-row justify-between items-center gap-4">
          <div className="text-gray-500 font-bold text-sm sm:text-lg uppercase tracking-wider flex items-center gap-2">
            Master Total <span className="hidden sm:inline">({orders.length} orders)</span>
          </div>
          <div className={`text-3xl sm:text-5xl font-black tracking-tight ${masterTotal < 0 ? 'text-red-600' : 'text-theme-accent'}`}>
            {masterTotal.toLocaleString('en-IN', { style: 'currency', currency: 'INR' }).replace('₹', '₹ ')}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
