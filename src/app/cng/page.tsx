"use client";

import { Survey } from "@/components/Survey";
import { UnloadingSteps, LoadingSteps, SAMPLE_PROFILES, Profile } from "./constants";
import { useState } from "react";

type Tab = 'unloading' | 'loading';
const TABS: { id: Tab, label: string }[] = [
  { id: 'unloading', label: 'CNG Unloading' },
  { id: 'loading', label: 'CNG Loading' },
];

export default function CNGPage() {
  const [tab, setTab] = useState<Tab>('unloading');
  const [profile, setProfile] = useState(SAMPLE_PROFILES[0]);
  const handleSubmit = (data: any) => {
    console.log("Form submitted with data:", data);
  };
  const steps = tab === 'unloading' ? UnloadingSteps : LoadingSteps;

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
          key={`${tab}-${profile}`}
          steps={steps}
          onSubmit={handleSubmit}
          prefilledData={{ vehicleNumber: profile, driverName: profile.driverName, driverContact: profile.driverContact }}
        />
      </div>
    </div>
  );
}

function ProfileSelector({ profile, onProfileChange }: { profile: Profile, onProfileChange: (profile: Profile) => void}) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const profiles = SAMPLE_PROFILES;
  
  // Get initials from profile (first 2 characters)
  const getInitials = (text: string) => {
    return text.slice(0, 2).toUpperCase();
  };
  
  return (
    <div className="relative inline-block text-left">
      <div>
        <button
          type="button"
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="inline-flex items-center gap-3 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 pr-3"
          id="options-menu"
          aria-expanded={isDropdownOpen}
          aria-haspopup="true"
        >
          <div className="w-10 h-10 rounded-full bg-blue-600 dark:bg-blue-500 flex items-center justify-center text-white font-semibold text-sm">
            {getInitials(profile.driverName)}
          </div>
          <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
            {profile.driverName}
          </span>
          <svg
            className={`h-4 w-4 text-gray-500 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`}
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
                  key={p.vehicleNumber}
                  className={`text-gray-700 dark:text-gray-200 flex items-center gap-3 w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-600 ${
                    p === profile ? 'bg-gray-100 dark:bg-gray-600' : ''
                  }`}
                  role="menuitem"
                  onClick={() => {
                    onProfileChange(p);
                    setIsDropdownOpen(false);
                  }}
                >
                  <div className="w-8 h-8 rounded-full bg-blue-600 dark:bg-blue-500 flex items-center justify-center text-white font-semibold text-xs">
                    {getInitials(p.driverName)}
                  </div>
                  <span className={p.vehicleNumber === profile.vehicleNumber ? 'font-semibold' : ''}>
                    {p.driverName}
                  </span>
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
  profile: Profile;
  onProfileChange: (profile: Profile) => void;
}

function TopBar({ tab, onTabChange, profile, onProfileChange }: TopBarProps) {
  return (
    <div className="w-full bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 px-6 flex items-center justify-between">
      <div className="flex space-x-8">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => onTabChange(t.id)}
            className={`relative px-1 py-4 font-medium text-sm transition-colors ${
              tab === t.id
                ? 'text-blue-600 dark:text-blue-400'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
            }`}
          >
            {t.label}
            {tab === t.id && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 dark:bg-blue-400" />
            )}
          </button>
        ))}
      </div>
      <div className="py-2">
        <ProfileSelector profile={profile} onProfileChange={onProfileChange} />
      </div>
    </div>
  );
}