import React from 'react';

export const Skeleton = ({
  variant = 'text',
  width,
  height,
  className = '',
}) => {
  const baseStyle = "animate-pulse bg-slate-200 dark:bg-slate-700";

  const variants = {
    text: "h-4 w-full rounded",
    circle: "rounded-full",
    rect: "rounded-xl",
  };

  const currentVariant = variants[variant] || variants.text;

  return (
    <div
      className={`${baseStyle} ${currentVariant} ${className}`}
      style={{
        width: width ? width : undefined,
        height: height ? height : undefined,
      }}
    />
  );
};
