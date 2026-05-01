import React from 'react';

const FormInput = ({
  label,
  id,
  type = 'text',
  placeholder,
  value,
  onChange,
  error,
  required = false,
  className = '',
  ...props
}) => {
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {label && (
        <label htmlFor={id} className="text-sm font-semibold text-gray-700">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <input
        id={id}
        name={id}
        type={type}
        className={`form-input ${error ? 'border-red-500 focus:ring-red-400' : ''}`}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
        {...props}
      />
      {error && <span className="text-sm text-red-500 mt-1">{error}</span>}
    </div>
  );
};

export default FormInput;
