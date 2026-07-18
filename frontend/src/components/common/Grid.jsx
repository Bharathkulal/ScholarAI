import React from 'react';

export const Grid = ({
  children,
  cols = 1,
  sm,
  md,
  lg,
  xl,
  gap = 6,
  className = '',
  ...props
}) => {
  const gaps = {
    0: 'gap-0',
    2: 'gap-2',
    3: 'gap-3',
    4: 'gap-4',
    6: 'gap-6',
    8: 'gap-8',
    10: 'gap-10',
  };

  const colClasses = {
    1: 'grid-cols-1',
    2: 'grid-cols-2',
    3: 'grid-cols-3',
    4: 'grid-cols-4',
    5: 'grid-cols-5',
    6: 'grid-cols-6',
    12: 'grid-cols-12',
  };

  const smClasses = {
    1: 'sm:grid-cols-1',
    2: 'sm:grid-cols-2',
    3: 'sm:grid-cols-3',
    4: 'sm:grid-cols-4',
  };

  const mdClasses = {
    1: 'md:grid-cols-1',
    2: 'md:grid-cols-2',
    3: 'md:grid-cols-3',
    4: 'md:grid-cols-4',
    6: 'md:grid-cols-6',
  };

  const lgClasses = {
    1: 'lg:grid-cols-1',
    2: 'lg:grid-cols-2',
    3: 'lg:grid-cols-3',
    4: 'lg:grid-cols-4',
  };

  return (
    <div
      className={`grid ${colClasses[cols]} ${sm ? smClasses[sm] : ''} ${
        md ? mdClasses[md] : ''
      } ${lg ? lgClasses[lg] : ''} ${gaps[gap] || gaps[6]} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};
export default Grid;
