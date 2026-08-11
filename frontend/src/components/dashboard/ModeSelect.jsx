import React, { useState, useRef, useEffect } from 'react';
import { FaChevronDown } from 'react-icons/fa';

const ModeSelect = ({ value, onChange, options = [] }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handleClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    window.addEventListener('click', handleClick);
    return () => window.removeEventListener('click', handleClick);
  }, []);

  const label = options.find((o) => o.value === value)?.label || options[0]?.label || '';

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((s) => !s)}
        className="flex items-center justify-between w-full rounded-lg px-3 py-2 text-white bg-indigo-700 hover:bg-indigo-600 transition-colors"
      >
        <span className="text-sm font-medium">{label}</span>
        <FaChevronDown className="ml-2 text-white" />
      </button>

      {open && (
        <div className="absolute z-50 mt-2 w-full rounded-lg overflow-hidden shadow-lg bg-slate-900" style={{ minWidth: 200 }}>
          <ul className="divide-y divide-slate-800">
            {options.map((opt) => (
              <li key={opt.value}>
                <button
                  type="button"
                  onClick={() => {
                    onChange(opt.value);
                    setOpen(false);
                  }}
                  className={`w-full text-left px-4 py-3 text-white transition-colors ${opt.value === value ? 'bg-indigo-800' : 'bg-slate-900 hover:bg-indigo-700'}`}
                >
                  {opt.label}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ModeSelect;
