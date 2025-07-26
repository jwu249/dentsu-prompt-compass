
import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useAzureAuth } from '@/contexts/AzureAuthContext';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { 
  MessageSquare, 
  FileText, 
  Upload, 
  History, 
  LogOut,
  User,
  Settings,
  ClipboardCheck
} from 'lucide-react';

const Sidebar = () => {
  const { user, logout } = useAzureAuth();
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
    { path: '/admin/submissions', icon: ClipboardCheck, label: 'Review Submissions' },
    { path: '/admin/teams', icon: User, label: 'Team Management' },
    { path: '/admin/users', icon: User, label: 'User Management' },
  ];

  const navItems = user?.role === 'admin' ? adminNavItems : userNavItems;

  return (
    <div className="h-full bg-background border-r border-border flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-red-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">D</span>
            </div>
            <div>
              <h2 className="font-semibold text-foreground">Dentsu Portal</h2>
              <p className="text-sm text-muted-foreground capitalize">{user?.role}</p>
              {user?.team && (
                <p className="text-xs text-muted-foreground">{user.team} Team</p>
              )}
              {user?.instance && (
                <p className="text-xs text-blue-600 font-medium">Instance: {user.instance}</p>
              )}
            </div>
          </div>
        </div>
        <ThemeToggle />
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
                  ? 'bg-red-50 text-red-700 border-r-2 border-red-600 dark:bg-red-900/20 dark:text-red-400 dark:border-red-400'
                  : 'text-foreground hover:bg-muted'
              }`
            }
          >
            <item.icon size={20} />
            <span className="font-medium">{item.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* User Info & Logout */}
      <div className="p-4 border-t border-border">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
            <User size={16} className="text-muted-foreground" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-foreground truncate">{user?.name}</p>
            <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
          </div>
        </div>
        <Button
          onClick={logout}
          variant="outline"
          className="w-full justify-start text-foreground hover:text-red-600 hover:border-red-200"
        >
          <LogOut size={16} className="mr-2" />
          Sign Out
        </Button>
      </div>
    </div>
  );
};

export default Sidebar;
