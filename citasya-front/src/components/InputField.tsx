'use client';

import React from 'react';
import Select from 'react-select';

interface SelectOption {
  value: string;
  label: string;
}

interface ServiceFormFieldProps {
  label: string;
  placeholder?: string;
  type?: string;
  className?: string;
  options?: SelectOption[];
  multiple?: boolean;
  name?: string;
  value: string | string[];
  onChange?: (
    e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement | HTMLTextAreaElement>
    | { target: { name?: string; value: string | string[] } }
  ) => void;
  readOnly?: boolean;
  whiteBg?: boolean;
}

export const ServiceFormField: React.FC<ServiceFormFieldProps> = ({
  label,
  placeholder,
  type = 'text',
  className,
  options,
  multiple = false,
  name,
  value,
  onChange,
  readOnly = false,
  whiteBg = false,
}) => {
  // Clase condicional para el fondo. Si whiteBg es true, usa bg-white; de lo contrario, usa el color original.
  const bgColorClass = whiteBg ? 'bg-white' : 'bg-green-200/40';

  if (readOnly) {
    // Solo mostrar texto en un div que imite estilo
    if (options) {
      // Para selects mostrar etiquetas de las opciones seleccionadas
      const displayValues = multiple && Array.isArray(value)
        ? options.filter(opt => value.includes(opt.value)).map(opt => opt.label).join(', ')
        : options.find(opt => opt.value === value)?.label || '';

      return (
        <div className={`flex flex-col mt-4 ${className}`}>
          <label className="text-base font-bold text-neutral-600">{label}</label>
          <div className="px-5 pt-2 pb-4 mt-2 text-sm bg-white w-full rounded-lg max-md:pr-5 ">
            {displayValues || '-'}
          </div>
        </div>
      );
    }
    // Para input o textarea solo mostrar texto
    return (
      <div className={`flex flex-col mt-4 ${className}`}>
        <label className="text-base font-bold text-neutral-600">{label}</label>
        <div className="px-5 pt-2 pb-4 mt-2 text-sm bg-white rounded-lg w-full max-md:pr-5 whitespace-pre-wrap">
          {value || '-'}
        </div>
      </div>
    );
  }
  return (
    <div className={`flex flex-col mt-4 ${className}`}>
      <label className="text-base font-bold text-neutral-600">
        {label}
      </label>

      {options ? (
        multiple ? (
          <Select
            isMulti
            options={options}
            placeholder={placeholder}
            value={options.filter(opt => Array.isArray(value) && value.includes(opt.value))}
            onChange={(selected) => {
              const selectedValues = (selected as SelectOption[]).map(opt => opt.value);
              if (onChange) {
                onChange({ target: { name, value: selectedValues } });
              }
            }}
            classNamePrefix="custom-select"
            styles={{
              control: (base) => ({
                ...base,
                // Corrección del error tipográfico y uso de la prop whiteBg
                backgroundColor: whiteBg ? 'white' : 'rgba(187, 247, 208, 0.4)',
                borderRadius: '0.5rem',
                padding: '2px',
                borderColor: 'transparent',
                boxShadow: 'none',
                minHeight: '42px',
                ':hover': { borderColor: 'rgb(202 138 4 / 0.6)' }
              }),
              multiValue: (base) => ({
                ...base,
                backgroundColor: 'rgba(202, 138, 4, 0.15)',
              }),
              multiValueLabel: (base) => ({
                ...base,
                color: '#525252',
                fontSize: '0.875rem'
              }),
              multiValueRemove: (base) => ({
                ...base,
                color: '#525252',
                ':hover': { backgroundColor: '#f87171', color: 'white' }
              }),
              placeholder: (base) => ({
                ...base,
                color: '#525252',
                fontSize: '0.875rem'
              }),
              option: (base, state) => ({
                ...base,
                fontSize: '0.875rem',
                color: '#525252',
                backgroundColor: state.isFocused
                  ? 'rgba(202, 138, 4, 0.15)'
                  : 'transparent',
                ':active': { backgroundColor: 'rgba(202, 138, 4, 0.25)' }
              })
            }}
          />
        ) : (
          <select
            // Se usa la clase condicional para el color de fondo
            className={`rounded-lg ${bgColorClass} p-3 mt-2 text-sm text-neutral-600
                         focus:outline-none focus:ring-2 focus:ring-yellow-700/60 transition-all duration-200`}
            value={value as string}
            onChange={onChange}
            name={name}
          >
            <option value="" disabled>
              {placeholder}
            </option>
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        )
      ) : type === 'textarea' ? (
        <textarea
          // Se usa la clase condicional para el color de fondo
          className={`rounded-lg ${bgColorClass} p-3 mt-2 text-sm text-neutral-600
                       focus:outline-none focus:ring-2 focus:ring-yellow-700/60 transition-all duration-200`}
          placeholder={placeholder}
          rows={4}
          value={value as string}
          onChange={onChange}
          name={name}
        />
      ) : (
        <input
          type={type}
          // Se usa la clase condicional para el color de fondo
          className={`rounded-lg ${bgColorClass} p-3 mt-2 text-sm text-neutral-600
                       focus:outline-none focus:ring-2 focus:ring-yellow-700/60 transition-all duration-200`}
          placeholder={placeholder}
          value={value as string}
          onChange={onChange}
          name={name}
        />
      )}
    </div>
  );
};
