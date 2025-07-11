
import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { 
  MessageSquare, 
  FileText, 
  Upload, 
  History, 
  LogOut,
  User,
  Settings
} from 'lucide-react';

const Sidebar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const userNavItems = [
    { path: '/chat', icon: MessageSquare, label: 'Chat' },
    { path: '/chat/prompts', icon: FileText, label: 'Prompts & Templates' },
    { path: '/chat/pptx', icon: Upload, label: 'PowerPoint Templates' },
    { path: '/chat/csv', icon: Upload, label: 'CSV Uploads' },
    { path: '/chat/history', icon: History, label: 'Chat History' },
  ];

  const adminNavItems = [
    { path: '/admin', icon: Settings, label: 'Dashboard' },
    { path: '/admin/submissions', icon: FileText, label: 'Review Submissions' },
    { path: '/admin/teams', icon: User, label: 'Team Management' },
    { path: '/admin/users', icon: User, label: 'User Management' },
  ];

  const navItems = user?.role === 'admin' ? adminNavItems : userNavItems;

  return (
    <div className="h-full bg-white border-r border-gray-200 flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-red-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold">D</span>
          </div>
          <div>
            <h2 className="font-semibold text-gray-900">Dentsu Portal</h2>
            <p className="text-sm text-gray-500 capitalize">{user?.role}</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-2">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                isActive
                  ? 'bg-red-50 text-red-700 border-r-2 border-red-600'
                  : 'text-gray-700 hover:bg-gray-50'
              }`
            }
          >
            <item.icon size={20} />
            <span className="font-medium">{item.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* User Info & Logout */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
            <User size={16} className="text-gray-600" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">{user?.name}</p>
            <p className="text-xs text-gray-500 truncate">{user?.email}</p>
          </div>
        </div>
        <Button
          onClick={logout}
          variant="outline"
          className="w-full justify-start text-gray-700 hover:text-red-600 hover:border-red-200"
        >
          <LogOut size={16} className="mr-2" />
          Sign Out
        </Button>
      </div>
    </div>
  );
};

export default Sidebar;
