import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import { SearchBarProps } from '../utils/types';

const SearchBar: React.FC<SearchBarProps> = ({
  className = "",
  onSearch,
  initialValue = ""
}) => {
  const [searchTerm, setSearchTerm] = useState(initialValue);
  const [isFocused, setIsFocused] = useState(false);

  // Update search term if initialValue changes
  useEffect(() => {
    if (initialValue !== searchTerm) {
      setSearchTerm(initialValue);
    }
  }, [initialValue, searchTerm]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    if (onSearch) {
      onSearch(value);
    }
  };

  return (
    <form className={`relative ${className}`} onSubmit={e => e.preventDefault()}>
      <div className={`relative flex items-center rounded-sm w-[85%] mx-auto bg-white px-2 py-3 shadow-lg transition-all ${isFocused ? 'ring-2 ring-gray-200' : ''}`}>
        <Search size={20} className="text-gray-400 mr-2" strokeWidth={1.5} />
        <input
          type="text"
          value={searchTerm}
          onChange={handleChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder="Search food or Category..."
          className="w-full bg-transparent focus:outline-none text-gray-700 placeholder-gray-400"
        />
      </div>
    </form>
  );
};

export default SearchBar;