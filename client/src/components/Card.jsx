import React from 'react';

const Card = ({ title, value, icon, trend, iconColor, bgColor }) => {
  return (
    <div className="stats-card">
      <div className={`p-4 rounded-xl ${bgColor} ${iconColor}`}>
        {icon}
      </div>
      <div>
        <h3 className="text-gray-500 font-medium mb-1">{title}</h3>
        <p className="text-2xl font-bold text-gray-800">{value}</p>
        
        {trend && (
          <p className={`text-sm mt-1 flex items-center gap-1 ${trend.isPositive ? 'text-emerald-500' : 'text-red-500'}`}>
            <span className="font-semibold">{trend.isPositive ? '+' : '-'}{trend.value}%</span>
           <span className="text-gray-400">vs last month</span>
          </p>
        )}
      </div>
    </div>
  );
};

export default Card;
