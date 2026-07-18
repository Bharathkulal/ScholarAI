import React from 'react';
import { useFormContext } from 'react-hook-form';
import { Select } from '../ui/Select';

export const FormSelect = ({
  name,
  rules,
  defaultValue = '',
  ...props
}) => {
  const { register, formState: { errors } } = useFormContext();
  const error = errors[name];

  return (
    <Select
      {...register(name, rules)}
      error={error}
      defaultValue={defaultValue}
      {...props}
    />
  );
};
export default FormSelect;
