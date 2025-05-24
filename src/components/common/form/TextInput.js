'use client';
import { useEffect, useState } from 'react';

const TextInput = ({
  label,
  type = 'text',
  name,
  value,
  onChange,
  required = false,
}) => {
  const [clientValue, setClientValue] = useState(value);

  useEffect(() => {
    setClientValue(value);
  }, [value]);

  // Conditionally render the label for hidden inputs
  if (type === 'hidden') {
    return (
      <input
        type="hidden"
        name={name}
        id={name}
        defaultValue={clientValue}
        onChange={onChange}
      />
    );
  }

  return (
    <div>
      <label htmlFor={name} className="block text-sm font-medium">
        {label}
      </label>
      <input
        type={type}
        name={name}
        id={name}
        value={clientValue}
        onChange={onChange}
        required={required}
        className="w-full px-4 py-2 border rounded focus:outline-none"
      />
    </div>
  );
};

export default TextInput;
