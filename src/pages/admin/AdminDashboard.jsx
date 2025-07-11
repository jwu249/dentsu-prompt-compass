
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FileText, Users, Upload, Clock } from 'lucide-react';
import DashboardLayout from '@/components/layout/DashboardLayout';

const AdminDashboard = () => {
  const stats = [
    {
      title: 'Pending Submissions',
      value: '12',
      icon: Clock,
      color: 'text-yellow-600 dark:text-yellow-400',
      bgColor: 'bg-yellow-100 dark:bg-yellow-900/20'
    },
    {
      title: 'Total Users',
      value: '48',
      icon: Users,
      color: 'text-blue-600 dark:text-blue-400',
      bgColor: 'bg-blue-100 dark:bg-blue-900/20'
    },
    {
      title: 'Prompts Created',
      value: '156',
      icon: FileText,
      color: 'text-green-600 dark:text-green-400',
      bgColor: 'bg-green-100 dark:bg-green-900/20'
    },
    {
      title: 'Files Uploaded',
      value: '89',
      icon: Upload,
      color: 'text-purple-600 dark:text-purple-400',
      bgColor: 'bg-purple-100 dark:bg-purple-900/20'
    }
  ];

  const recentActivity = [
    {
      id: 1,
      user: 'John Doe',
      action: 'submitted a new prompt',
      item: 'Marketing Campaign Analysis',
      time: '2 hours ago',
      status: 'pending'
    },
    {
      id: 2,
      user: 'Sarah Smith',
      action: 'uploaded PowerPoint template',
      item: 'Q4 Presentation Template',
      time: '4 hours ago',
      status: 'pending'
    },
    {
      id: 3,
      user: 'Mike Johnson',
      action: 'uploaded CSV file',
      item: 'Bulk Prompts Dataset',
      time: '1 day ago',
      status: 'approved'
    }
  ];

  return (
    <DashboardLayout>
      <div className="p-6">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-foreground">Admin Dashboard</h1>
          <p className="text-muted-foreground">Monitor and manage your Dentsu Prompt Portal</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                    <p className="text-3xl font-bold text-foreground mt-2">{stat.value}</p>
                  </div>
                  <div className={`w-12 h-12 rounded-lg ${stat.bgColor} flex items-center justify-center`}>
                    <stat.icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-center justify-between p-4 border border-border rounded-lg">
                  <div className="flex-1">
                    <p className="text-sm text-foreground">
                      <span className="font-medium">{activity.user}</span> {activity.action}
                    </p>
                    <p className="text-sm text-muted-foreground">{activity.item}</p>
                    <p className="text-xs text-muted-foreground mt-1">{activity.time}</p>
                  </div>
                  <Badge className={
                    activity.status === 'pending' 
                      ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-200' 
                      : 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-200'
                  }>
                    {activity.status}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;
