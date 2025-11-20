"use client";

import { Survey } from "@/components/Survey";
import { steps, VEHICLE_NUMBERS } from "./constants";
import { useState } from "react";

type Tab = 'unloading' | 'loading';
const TABS: { id: Tab, label: string }[] = [
  { id: 'unloading', label: 'CNG Unloading' },
  { id: 'loading', label: 'CNG Loading' },
];

export default function CNGPage() {
  const [tab, setTab] = useState<Tab>('unloading');
  const [profile, setProfile] = useState(VEHICLE_NUMBERS[0]);
  const handleSubmit = (data: any) => {
    console.log("Form submitted with data:", data);
  };

  return (
    <div className="-m-6">
      <TopBar
        tab={tab}
        onTabChange={setTab}
        profile={profile}
        onProfileChange={setProfile}
      />
      <div className="max-w-3xl mx-auto mt-10 px-6">
        <Survey
          key={profile}
          steps={steps}
          onSubmit={handleSubmit}
          prefilledData={{ vehicleNumber: profile }}
        />
      </div>
    </div>
  );
}

function ProfileSelector({ profile, onProfileChange }: { profile: string, onProfileChange: (profile: string) => void}) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const profiles = VEHICLE_NUMBERS;
  return (
    <div className="relative inline-block text-left">
      <div>
        <button
          type="button"
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="inline-flex items-center justify-center rounded-md border border-gray-300 dark:border-gray-600 shadow-sm px-4 py-2 bg-white dark:bg-gray-700 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          id="options-menu"
          aria-expanded={isDropdownOpen}
          aria-haspopup="true"
        >
          {profile}
          <svg
            className={`-mr-1 ml-2 h-5 w-5 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M5.23 7.21a.75.75 0 011.06.02L10 11.584l3.71-4.354a.75.75 0 111.14.976l-4.25 5a.75.75 0 01-1.14 0l-4.25-5a.75.75 0 01.02-1.06z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>

      {isDropdownOpen && (
        <>
          {/* Backdrop to close dropdown when clicking outside */}
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsDropdownOpen(false)}
          />
          <div
            className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white dark:bg-gray-700 ring-1 ring-black ring-opacity-5 dark:ring-gray-600 focus:outline-none z-20"
            role="menu"
            aria-orientation="vertical"
            aria-labelledby="options-menu"
          >
            <div className="py-1" role="none">
              {profiles.map((p) => (
                <button
                  key={p}
                  className={`text-gray-700 dark:text-gray-200 block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-600 ${
                    p === profile ? 'bg-gray-100 dark:bg-gray-600 font-semibold' : ''
                  }`}
                  role="menuitem"
                  onClick={() => {
                    onProfileChange(p);
                    setIsDropdownOpen(false);
                  }}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

interface TopBarProps {
  tab: Tab;
  onTabChange: (tab: Tab) => void;
  profile: string;
  onProfileChange: (profile: string) => void;
}

function TopBar({ tab, onTabChange, profile, onProfileChange }: TopBarProps) {
  return (
    <div className="w-full bg-white dark:bg-gray-800 shadow-md border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex items-center justify-between">
      <div className="flex space-x-4">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => onTabChange(t.id)}
            className={`px-4 py-2 rounded-md font-medium ${
              tab === t.id
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>
      <ProfileSelector profile={profile} onProfileChange={onProfileChange} />
    </div>
  );
}