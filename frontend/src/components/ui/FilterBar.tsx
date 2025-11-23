'use client';

import { useState } from 'react';

interface FilterBarProps {
  specialties: string[];
  onFilterChange: (specialty: string) => void;
  onSortChange: (sort: string) => void;
  activeFilter: string;
  activeSort: string;
}

export default function FilterBar({
  specialties,
  onFilterChange,
  onSortChange,
  activeFilter,
  activeSort
}: FilterBarProps) {
  const [isOpen, setIsOpen] = useState(false);

  const sortOptions = [
    { value: 'experience', label: 'Most Experienced' },
    { value: 'name', label: 'Name (A-Z)' },
    { value: 'availability', label: 'Accepting Clients' }
  ];

  return (
    <div className="mb-12">
      {/* Mobile filter toggle */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden w-full glass rounded-lg px-4 py-3 flex items-center justify-between mb-4"
      >
        <span className="font-semibold">Filters & Sort</span>
        <svg
          className={`w-5 h-5 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Filter content */}
      <div className={`${isOpen ? 'block' : 'hidden'} md:block`}>
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
          {/* Specialty filters */}
          <div className="flex-1">
            <label className="text-sm text-gray-400 mb-2 block">Filter by Specialty</label>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => onFilterChange('all')}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  activeFilter === 'all'
                    ? 'bg-gradient-to-r from-teal-6 to-teal-6 text-white'
                    : 'glass hover:bg-white/10'
                }`}
              >
                All Trainers
              </button>
              {specialties.map((specialty) => (
                <button
                  key={specialty}
                  onClick={() => onFilterChange(specialty)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    activeFilter === specialty
                      ? 'bg-gradient-to-r from-teal-6 to-teal-6 text-white'
                      : 'glass hover:bg-white/10'
                  }`}
                >
                  {specialty}
                </button>
              ))}
            </div>
          </div>

          {/* Sort dropdown */}
          <div className="w-full md:w-auto">
            <label className="text-sm text-gray-400 mb-2 block">Sort By</label>
            <select
              value={activeSort}
              onChange={(e) => onSortChange(e.target.value)}
              className="w-full md:w-auto glass rounded-lg px-4 py-2 bg-transparent border border-white/10 focus:border-teal-5 focus:outline-none"
            >
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value} className="bg-gray-900">
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}
