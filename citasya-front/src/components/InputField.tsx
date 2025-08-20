'use client';

import React, { ChangeEvent } from 'react';
import Select from 'react-select';

// La interfaz ahora es genérica para manejar valores de cualquier tipo (T)
export interface SelectOption<T> {
  value: T;
  label: string;
}

// Las props del componente también son genéricas
interface ServiceFormFieldProps<T extends string | number> {
  label: string;
  placeholder?: string;
  type?: string;
  className?: string;
  options?: SelectOption<T>[];
  multiple?: boolean;
  name?: string;
  value: T | T[] | ''; // ' ' se incluye para el placeholder de select
  onChange?: (
    e: ChangeEvent<HTMLSelectElement | HTMLInputElement | HTMLTextAreaElement>
    | { target: { name?: string; value: T | T[] } }
  ) => void;
  readOnly?: boolean;
  whiteBg?: boolean;
  disabled?: boolean;
}

// El componente se define con el tipo genérico
export const ServiceFormField = <T extends string | number>({
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
  disabled = false,
}: ServiceFormFieldProps<T>) => {
  const bgColorClass = whiteBg ? 'bg-white' : 'bg-green-200/40';

  // Manejador de cambio para react-select
  const handleSelectChange = (
    selected: SelectOption<T> | readonly SelectOption<T>[] | null,
  ) => {
    if (!onChange) return;

    if (multiple) {
      const selectedValues = (selected as readonly SelectOption<T>[]).map(opt => opt.value);
      onChange({ target: { name, value: selectedValues } });
    } else {
      const selectedValue = (selected as SelectOption<T>).value;
      onChange({ target: { name, value: selectedValue } });
    }
  };

  if (readOnly) {
    if (options) {
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
    return (
      <div className={`flex flex-col mt-4 ${className}`}>
        <label className="text-base font-bold text-neutral-600">{label}</label>
        <div className="px-5 pt-2 pb-4 mt-2 text-sm bg-white rounded-lg w-full max-md:pr-5 whitespace-pre-wrap">
          {String(value) || '-'}
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
            onChange={handleSelectChange}
            classNamePrefix="custom-select"
            isDisabled={disabled}
            styles={{
              control: (base) => ({
                ...base,
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
            className={`rounded-lg ${bgColorClass} p-3 mt-2 text-sm text-neutral-600
              focus:outline-none focus:ring-2 focus:ring-yellow-700/60 transition-all duration-200`}
            value={String(value)} // Convierte el valor a string para el HTML select
            onChange={onChange as (e: ChangeEvent<HTMLSelectElement>) => void}
            name={name}
            disabled={disabled}
          >
            <option value="" disabled>
              {placeholder}
            </option>
            {options.map((option) => (
              <option key={String(option.value)} value={String(option.value)}>
                {option.label}
              </option>
            ))}
          </select>
        )
      ) : type === 'textarea' ? (
        <textarea
          className={`rounded-lg ${bgColorClass} p-3 mt-2 text-sm text-neutral-600
            focus:outline-none focus:ring-2 focus:ring-yellow-700/60 transition-all duration-200`}
          placeholder={placeholder}
          rows={4}
          value={value as string}
          onChange={onChange as (e: ChangeEvent<HTMLTextAreaElement>) => void}
          name={name}
          disabled={disabled}
        />
      ) : (
        <input
          type={type}
          className={`rounded-lg ${bgColorClass} p-3 mt-2 text-sm text-neutral-600
            focus:outline-none focus:ring-2 focus:ring-yellow-700/60 transition-all duration-200`}
          placeholder={placeholder}
          value={value as string}
          onChange={onChange as (e: ChangeEvent<HTMLInputElement>) => void}
          name={name}
          disabled={disabled}
        />
      )}
    </div>
  );
};