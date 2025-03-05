import React from 'react';
import { User } from '@/types';

interface SidebarHeaderProps {
  currentUser: User;
}

const SidebarHeader: React.FC<SidebarHeaderProps> = ({ currentUser }) => {
  return (
    <div className="bg-whatsapp-sidebar-bg h-16 px-4 flex items-center justify-between border-b border-gray-200">
      <div className="flex items-center">
        <img 
          src={currentUser.avatar}
          className="rounded-full w-10 h-10"
          alt="User profile"
        />
      </div>
      <div className="flex items-center text-gray-500 space-x-4">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"></line></svg>
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="1"></circle><circle cx="19" cy="12" r="1"></circle><circle cx="5" cy="12" r="1"></circle></svg>
      </div>
    </div>
  );
};

export default SidebarHeader;
