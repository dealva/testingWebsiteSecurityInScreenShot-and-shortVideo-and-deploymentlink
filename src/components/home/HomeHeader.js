'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Logo from '../common/header/Logo';
import SearchBar from '../common/header/SearchBar';
import UploadButton from '../common/header/UploadButton';
import UserAvatar from '../common/header/UserAvatar';
import UserDropdown from '../common/header/UserDropdown';

export default function HomeHeader({ user, onSearchSubmit }) {
  const router = useRouter();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [profilePhoto, setProfilePhoto] = useState(user?.profile_photo);

  const toggleDropdown = () => setDropdownOpen(prev => !prev);

  const handlePhotoUpdate = useCallback((newFile) => {
    const url = URL.createObjectURL(newFile);
    setProfilePhoto(url);
    setDropdownOpen(false);
  }, []);

  const handleLoginClick = () => {
    router.push('/login');
  };

  // called by SearchBar on Enter key with the search string
  const handleSearchSubmit = (query) => {
    if (onSearchSubmit) onSearchSubmit(query.trim());
  };

  return (
    <header className="bg-gray-900 text-white px-6 py-4 flex items-center justify-between fixed top-0 left-0 right-0 z-50">
      <Logo />

      <div className="flex-1 flex justify-center">
        <SearchBar onSearchSubmit={handleSearchSubmit} />
      </div>

      <div className="flex items-center gap-2">
        {user ? (
          <>
            <UploadButton />
            <div className="relative">
              <UserAvatar
                src={profilePhoto || '/assets/images/avatar/defaultAvatar.png'}
                onClick={toggleDropdown}
              />
              {dropdownOpen && (
                <UserDropdown
                  username={user.username || 'Unknown User'}
                  email={user.email || 'No email'}
                  profile_photo={profilePhoto || '/assets/images/avatar/defaultAvatar.png'}
                  onPhotoUploaded={handlePhotoUpdate}
                />
              )}
            </div>
          </>
        ) : (
          <button
            onClick={handleLoginClick}
            className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded text-white"
            aria-label="Login"
          >
            Login
          </button>
        )}
      </div>
    </header>
  );
}
