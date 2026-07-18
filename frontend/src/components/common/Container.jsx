import React from 'react';

export const Container = ({
  children,
  className = '',
  clean = false,
  ...props
}) => {
  return (
    <div
      className={`${
        clean ? '' : 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};
export default Container;
