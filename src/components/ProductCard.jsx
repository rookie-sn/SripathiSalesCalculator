import React from 'react';
import { Plus, Eye, EyeOff, Trash2, PlusCircle, MinusCircle } from 'lucide-react';

const ProductCard = ({
  card,
  updateCard,
  addCardBelow,
  deleteCard,
  toggleVisibility,
  toggleOperator,
  isOnlyCard
}) => {
  const subtotal = card.price * card.qty;
  const isHidden = !card.isVisible;

  return (
    <div className={`relative mb-8 transition-all duration-300 mt-6 ${isHidden ? 'opacity-50 grayscale' : 'opacity-100'}`}>
      
      {/* Product Name Tab - Changed from absolute to relative on mobile, absolute on larger screens if needed, 
          actually absolute works if we add enough top padding to the card. Let's adjust the card padding and top margin. */}
      <div className="absolute -top-8 left-2 sm:left-4 z-10">
        <input
          type="text"
          value={card.name}
          onChange={(e) => updateCard(card.id, 'name', e.target.value)}
          placeholder="Product Name"
          className={`bg-white border-b-2 border-theme-accent text-sm font-semibold px-3 py-1.5 rounded-t-lg focus:outline-none focus:ring-0 shadow-[0_-2px_4px_-2px_rgba(0,0,0,0.1)] ${isHidden ? 'pointer-events-none' : ''}`}
          style={{ width: '180px' }}
        />
      </div>

      {/* Main Card Body */}
      <div className={`bg-white shadow-md rounded-xl p-3 sm:p-5 border border-gray-100 flex flex-col sm:flex-row items-center gap-3 sm:gap-4 ${isHidden ? 'pointer-events-none' : ''}`}>
        
        {/* Left Side Controls (Desktop) & Top Controls (Mobile) */}
        <div className="flex sm:flex-col justify-between w-full sm:w-auto items-center gap-2 sm:pr-4 sm:border-r border-gray-200 pointer-events-auto order-1 sm:order-none pb-2 sm:pb-0 border-b sm:border-b-0">
          <div className="flex gap-2 sm:flex-col items-center">
            <button 
              onClick={() => addCardBelow(card.id)}
              className="text-gray-400 hover:text-theme-accent transition-colors p-1"
              title="Add product below"
            >
              <Plus size={22} />
            </button>
            {!isOnlyCard && (
              <button 
                onClick={() => deleteCard(card.id)}
                className="text-gray-400 hover:text-red-500 transition-colors p-1"
                title="Delete product"
              >
                <Trash2 size={18} />
              </button>
            )}
          </div>
          {/* On mobile, bring visibility toggle to the top for easy access */}
          <div className="sm:hidden flex items-center gap-2 pointer-events-auto">
            <button
              onClick={() => toggleOperator(card.id)}
              className={`p-1.5 rounded-full transition-colors ${
                card.operator === 'add' ? 'text-green-600 bg-green-50' : 'text-red-600 bg-red-50'
              }`}
            >
              {card.operator === 'add' ? <PlusCircle size={22} /> : <MinusCircle size={22} />}
            </button>
            <button
              onClick={() => toggleVisibility(card.id)}
              className={`p-1.5 rounded-full transition-colors ${
                card.isVisible ? 'text-theme-accent bg-blue-50' : 'text-gray-500 bg-gray-200'
              }`}
            >
              {card.isVisible ? <Eye size={22} /> : <EyeOff size={22} />}
            </button>
          </div>
        </div>

        {/* Inputs Area */}
        <div className="flex-1 w-full flex items-end sm:items-center justify-between sm:justify-start gap-1 sm:gap-4 order-2 sm:order-none">
          
          <div className="flex flex-col flex-1 sm:flex-none">
            <label className="text-[11px] uppercase tracking-wider text-gray-500 mb-1 font-semibold text-center sm:text-left">Price</label>
            <input
              type="number"
              min="0"
              value={card.price === 0 ? '' : card.price}
              onChange={(e) => updateCard(card.id, 'price', parseFloat(e.target.value) || 0)}
              placeholder="0"
              className="w-full sm:w-24 px-1 sm:px-2 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-theme-accent bg-gray-50 text-center sm:text-left text-sm sm:text-base"
            />
          </div>
          
          <span className="text-gray-400 font-bold mb-2 px-0.5 text-sm sm:text-base">×</span>
          
          <div className="flex flex-col flex-1 sm:flex-none">
            <label className="text-[11px] uppercase tracking-wider text-gray-500 mb-1 font-semibold text-center sm:text-left">Qty</label>
            <input
              type="number"
              min="0"
              value={card.qty === 0 ? '' : card.qty}
              onChange={(e) => updateCard(card.id, 'qty', parseInt(e.target.value) || 0)}
              placeholder="0"
              className="w-full sm:w-20 px-1 sm:px-2 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-theme-accent bg-gray-50 text-center sm:text-left text-sm sm:text-base"
            />
          </div>
          
          <span className="text-gray-400 font-bold mb-2 px-0.5 text-sm sm:text-base">=</span>
          
          <div className="flex flex-col flex-1 sm:flex-none overflow-hidden">
            <label className="text-[11px] uppercase tracking-wider text-gray-500 mb-1 font-semibold text-center sm:text-left">Subtotal</label>
            <div className="w-full text-sm sm:text-base font-bold text-gray-800 bg-gray-100 px-1 sm:px-2 py-2 rounded-md border text-center sm:text-right overflow-hidden text-ellipsis whitespace-nowrap">
              {subtotal.toLocaleString('en-IN', { style: 'currency', currency: 'INR' }).replace('₹', '₹ ')}
            </div>
          </div>

        </div>

        {/* Right Side Controls (Desktop Only) */}
        <div className="hidden sm:flex items-center gap-4 pl-4 sm:border-l border-gray-200 pointer-events-auto order-3 sm:order-none">
          <button
            onClick={() => toggleOperator(card.id)}
            className={`flex items-center justify-center p-2 rounded-full transition-colors ${
              card.operator === 'add' ? 'text-green-600 bg-green-50 hover:bg-green-100' : 'text-red-600 bg-red-50 hover:bg-red-100'
            }`}
            title={card.operator === 'add' ? "Adding to total (Click to subtract)" : "Subtracting from total (Click to add)"}
          >
            {card.operator === 'add' ? <PlusCircle size={28} /> : <MinusCircle size={28} />}
          </button>
          <button
            onClick={() => toggleVisibility(card.id)}
            className={`p-2 rounded-full transition-colors ${
              card.isVisible ? 'text-theme-accent bg-blue-50 hover:bg-blue-100' : 'text-gray-500 bg-gray-200 hover:bg-gray-300'
            }`}
            title={card.isVisible ? "Visible (Included in total)" : "Hidden (Excluded from total)"}
          >
            {card.isVisible ? <Eye size={24} /> : <EyeOff size={24} />}
          </button>
        </div>

      </div>
    </div>
  );
};

export default ProductCard;
