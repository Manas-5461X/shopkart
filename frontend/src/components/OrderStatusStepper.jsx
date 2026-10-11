import React from 'react';

const STATUS_STAGES = [
  { key: 'PLACED', label: 'Placed', icon: '📦', description: 'Order received' },
  { key: 'CONFIRMED', label: 'Confirmed', icon: '✓', description: 'Order confirmed by seller' },
  { key: 'SHIPPED', label: 'Shipped', icon: '🚚', description: 'Package in transit' },
  { key: 'DELIVERED', label: 'Delivered', icon: '🎁', description: 'Delivered successfully' },
];

export const OrderStatusStepper = ({ currentStatus, compact = false }) => {
  const currentIndex = STATUS_STAGES.findIndex(s => s.key === currentStatus);

  if (currentStatus === 'PENDING_PAYMENT') {
    return (
      <div className={`rounded-2xl bg-amber-50 border border-amber-200/80 p-3.5 flex items-center justify-between text-amber-800 ${compact ? 'text-xs' : 'text-sm'}`}>
        <div className="flex items-center gap-2.5 font-bold">
          <span className="animate-spin text-base">⏳</span>
          <span>Payment Pending — awaiting payment confirmation</span>
        </div>
        <span className="text-[10px] font-black uppercase tracking-widest bg-amber-200/70 text-amber-900 px-2.5 py-0.5 rounded-full">
          PENDING
        </span>
      </div>
    );
  }

  // Calculate percentage of track filled (0% to 100%)
  const progressPercent = currentIndex <= 0 ? 0 : (currentIndex / (STATUS_STAGES.length - 1)) * 100;

  if (compact) {
    return (
      <div className="w-full">
        {/* Progress Bar Track */}
        <div className="relative flex items-center justify-between">
          {/* Background track */}
          <div className="absolute left-2 right-2 top-3 h-1 bg-gray-200 rounded-full z-0"></div>
          
          {/* Active filled track */}
          <div 
            className="absolute left-2 top-3 h-1 bg-[#6d5dfc] rounded-full transition-all duration-500 z-0"
            style={{ width: `calc(${progressPercent}% * 0.94)` }}
          ></div>

          {STATUS_STAGES.map((stage, idx) => {
            const isCompleted = currentIndex > idx;
            const isCurrent = currentIndex === idx;
            const isUpcoming = currentIndex < idx;

            return (
              <div key={stage.key} className="relative z-10 flex flex-col items-center">
                <div 
                  className={`h-6 w-6 rounded-full flex items-center justify-center text-[10px] font-black transition-all duration-300 shadow-xs ${
                    isCurrent
                      ? 'bg-[#6d5dfc] text-white ring-4 ring-purple-100 scale-110'
                      : isCompleted
                      ? 'bg-black text-white'
                      : 'bg-white text-gray-400 border border-gray-300'
                  }`}
                >
                  {isCompleted ? '✓' : idx + 1}
                </div>
                <span 
                  className={`text-[10px] font-extrabold mt-1.5 tracking-tight ${
                    isCurrent
                      ? 'text-[#6d5dfc]'
                      : isCompleted
                      ? 'text-gray-900'
                      : 'text-gray-400 font-semibold'
                  }`}
                >
                  {stage.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // Detailed view for OrderDetails
  return (
    <div className="w-full">
      <div className="relative">
        {/* Continuous Bar */}
        <div className="hidden sm:block absolute left-6 right-6 top-6 h-1.5 bg-gray-200 rounded-full z-0"></div>
        <div 
          className="hidden sm:block absolute left-6 top-6 h-1.5 bg-gradient-to-r from-purple-500 to-[#6d5dfc] rounded-full transition-all duration-700 z-0"
          style={{ width: `calc(${progressPercent}% * 0.88)` }}
        ></div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-2 relative z-10">
          {STATUS_STAGES.map((stage, idx) => {
            const isCompleted = currentIndex > idx;
            const isCurrent = currentIndex === idx;
            const isUpcoming = currentIndex < idx;

            return (
              <div 
                key={stage.key} 
                className={`p-3.5 sm:p-4 rounded-2xl transition-all duration-300 text-center sm:text-center flex flex-col items-center ${
                  isCurrent 
                    ? 'bg-white shadow-lg shadow-purple-500/5 border-2 border-[#6d5dfc]' 
                    : isCompleted 
                    ? 'bg-white/80 border border-gray-200/80' 
                    : 'bg-gray-50/60 border border-gray-100 opacity-60'
                }`}
              >
                {/* Milestone Node */}
                <div 
                  className={`h-11 w-11 rounded-full flex items-center justify-center text-sm font-black mb-2.5 transition-all duration-300 ${
                    isCurrent
                      ? 'bg-[#6d5dfc] text-white ring-4 ring-purple-100 shadow-md shadow-purple-500/20 scale-105'
                      : isCompleted
                      ? 'bg-black text-white'
                      : 'bg-white text-gray-400 border border-gray-300'
                  }`}
                >
                  {isCompleted ? '✓' : stage.icon}
                </div>

                <div className="flex items-center gap-1.5 justify-center">
                  <span className={`text-xs font-black tracking-tight ${isCurrent ? 'text-[#6d5dfc]' : isCompleted ? 'text-gray-900' : 'text-gray-400'}`}>
                    {stage.label}
                  </span>
                  {isCurrent && (
                    <span className="h-1.5 w-1.5 rounded-full bg-[#6d5dfc] animate-ping"></span>
                  )}
                </div>

                <p className="text-[11px] text-gray-500 font-medium mt-1 leading-snug">
                  {stage.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default OrderStatusStepper;
