import React from 'react';
import { useFormContext } from 'react-hook-form';
import { Input } from '../ui/Input';

export const FormInput = ({
  name,
  rules,
  defaultValue = '',
  ...props
}) => {
  const { register, formState: { errors } } = useFormContext();
  const error = errors[name];

  return (
    <Input
      {...register(name, rules)}
      error={error}
      defaultValue={defaultValue}
      {...props}
    />
  );
};
export default FormInput;
