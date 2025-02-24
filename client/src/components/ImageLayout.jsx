import React from 'react';
import main from "../assets/main.gif"

const ImageLayout = () => {
  return (
    <div className="relative mt-5 w-full min-h-screen bg-navy-900 p-8 overflow-hidden">
      <img src={main} alt="background" />
    </div>
  );
};

export default ImageLayout;
