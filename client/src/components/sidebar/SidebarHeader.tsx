import React from 'react';
import { User } from '@/types';

interface SidebarHeaderProps {
  currentUser: User;
}

const SidebarHeader: React.FC<SidebarHeaderProps> = ({ currentUser }) => {
  // Override user info with Madeleine's info
  const userInfo = {
    name: "Madeleine",
    phone: "+33 6 07 52 50 36",
    email: "madeleine@heymadeleine.com"
  };

  return (
    <div className="bg-whatsapp-sidebar-bg px-4 flex flex-col border-b border-gray-200">
      {/* Top part with avatar and icons */}
      <div className="h-20 flex items-center justify-between">
        <div className="flex items-center">
          <img 
            src={currentUser.avatar}
            className="rounded-full w-16 h-16 mr-3"
            alt="User profile"
          />
          <span className="font-semibold text-gray-800 text-2xl">{userInfo.name}</span>
        </div>
        {/* Icons removed */}
      </div>
      
      {/* Contact info part */}
      <div className="pb-2 text-base text-gray-500">
        <div className="flex items-center mb-1">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
          </svg>
          {userInfo.phone}
        </div>
        <div className="flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
            <polyline points="22,6 12,13 2,6"></polyline>
          </svg>
          {userInfo.email}
        </div>
      </div>
    </div>
  );
};

export default SidebarHeader;
