import React, { useState } from "react";

const SearchableSelect = ({ options, value, onChange, label }) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  const filtered = options.filter(([code, name]) =>
    `${code} - ${name}`.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="dropdown">
      <div
        className="dropdown-selected"
        onClick={() => setOpen(!open)}
      >
        {value}
      </div>

      {open && (
        <div className="dropdown-menu">
          <input
            type="text"
            className="dropdown-search"
            placeholder={`Search ${label}...`}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <div className="dropdown-options">
            {filtered.map(([code, name]) => (
              <div
                key={code}
                className="dropdown-option"
                onClick={() => {
                  onChange(code);
                  setOpen(false);
                  setSearch("");
                }}
              >
                {code} - {name}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchableSelect;
