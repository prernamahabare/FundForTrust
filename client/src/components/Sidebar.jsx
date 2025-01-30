import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { logo, sun } from '../assets';
import { navlinks } from '../constants';

const Icon = ({ name, imgUrl, isActive, disabled, handleClick }) => (
  <div 
    className={`w-12 h-12 flex justify-center items-center rounded-lg ${isActive === name ? 'bg-gray-700' : ''} ${!disabled && 'cursor-pointer'}`} 
    onClick={handleClick}
  >
    <img src={imgUrl} alt={name} className={`w-1/2 h-1/2 ${isActive !== name && 'grayscale'}`} />
  </div>
);

const Sidebar = () => {
  const navigate = useNavigate();
  const [isActive, setIsActive] = useState('dashboard');

  return (
    <div className="flex flex-col items-center h-screen bg-gray-900 text-white p-4">
      <Link to="/">
        <img src={logo} alt="Logo" className="w-14 h-14 mb-4" />
      </Link>
      <div className="flex-1 flex flex-col gap-4">
        {navlinks.map((link) => (
          <Icon 
            key={link.name} 
            {...link} 
            isActive={isActive} 
            handleClick={() => {
              if (!link.disabled) {
                setIsActive(link.name);
                navigate(link.link);
              }
            }}
          />
        ))}
      </div>
      <img src={sun} alt="Theme Toggle" className="w-8 h-8 mt-auto cursor-pointer" />
    </div>
  );
};

export default Sidebar;
