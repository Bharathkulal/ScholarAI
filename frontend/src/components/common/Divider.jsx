import React from 'react';

export const Divider = ({
  className = '',
  orientation = 'horizontal',
  ...props
}) => {
  const isHorizontal = orientation === 'horizontal';

  return (
    <div
      className={`${
        isHorizontal
          ? 'w-full h-[1px] my-6 bg-slate-200 dark:bg-slate-700/80'
          : 'h-auto w-[1px] mx-4 bg-slate-200 dark:bg-slate-700/80 self-stretch'
      } ${className}`}
      {...props}
    />
  );
};
export default Divider;
