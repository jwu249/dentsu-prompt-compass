
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useTeam } from '@/contexts/TeamContext';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Plus, Users, Edit, Trash2, UserPlus, UserMinus, UserCheck } from 'lucide-react';

const TeamManagement = () => {
  const { teams, users, createTeam, updateTeam, deleteTeam, getUsersByTeam, assignUserToTeam, removeUserFromTeam } = useTeam();
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [isCreateTeamOpen, setIsCreateTeamOpen] = useState(false);
  const [isEditTeamOpen, setIsEditTeamOpen] = useState(false);
  const [isAssignUserOpen, setIsAssignUserOpen] = useState(false);

  const [teamForm, setTeamForm] = useState({
    name: '',
    description: '',
    instance: '',
    color: 'bg-blue-500'
  });

  const [assignForm, setAssignForm] = useState({
    userId: 'no-user',
    teamId: 'no-team'
  });

  const colorOptions = [
    'bg-blue-500',
    'bg-green-500', 
    'bg-purple-500',
    'bg-red-500',
    'bg-yellow-500',
    'bg-pink-500',
    'bg-indigo-500',
    'bg-orange-500'
  ];

  const handleCreateTeam = (e) => {
    e.preventDefault();
    createTeam(teamForm);
    setTeamForm({ name: '', description: '', instance: '', color: 'bg-blue-500' });
    setIsCreateTeamOpen(false);
  };

  const handleEditTeam = (e) => {
    e.preventDefault();
    updateTeam(selectedTeam.id, teamForm);
    setIsEditTeamOpen(false);
    setSelectedTeam(null);
  };

  const handleDeleteTeam = (teamId) => {
    if (window.confirm('Are you sure you want to delete this team? All users will be removed from this team.')) {
      deleteTeam(teamId);
    }
  };

  const handleAssignUser = (e) => {
    e.preventDefault();
    if (assignForm.userId !== 'no-user' && assignForm.teamId !== 'no-team') {
      assignUserToTeam(assignForm.userId, assignForm.teamId);
    }
    setAssignForm({ userId: 'no-user', teamId: 'no-team' });
    setIsAssignUserOpen(false);
  };

  const openEditTeam = (team) => {
    setSelectedTeam(team);
    setTeamForm({
      name: team.name,
      description: team.description,
      instance: team.instance,
      color: team.color
    });
    setIsEditTeamOpen(true);
  };

  const unassignedUsers = users.filter(user => !user.teamId);

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-background">
        {/* Header Section */}
        <div className="relative overflow-hidden bg-gradient-to-br from-chat-blue-light to-background border-b border-chat-border">
          <div className="absolute top-8 left-1/2 transform -translate-x-1/2">
            <div className="flex space-x-2">
              <div className="w-6 h-6 bg-chat-blue transform rotate-45 rounded-sm opacity-80"></div>
              <div className="w-4 h-4 bg-chat-blue transform rotate-45 rounded-sm mt-1 opacity-60"></div>
            </div>
          </div>
          
          <div className="relative z-10 p-8 text-center">
            <h1 className="text-4xl font-bold text-foreground mb-2">Team Management</h1>
            <p className="text-muted-foreground text-lg mb-8">Create teams and assign users to different instances</p>
          <div className="flex gap-4 justify-center">
            <Dialog open={isAssignUserOpen} onOpenChange={setIsAssignUserOpen}>
              <DialogTrigger asChild>
                <Button className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg shadow-lg transition-all duration-200 hover:scale-105">
                  <UserPlus className="w-5 h-5 mr-2" />
                  Assign Users
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Assign User to Team</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleAssignUser} className="space-y-4">
                  <div>
                    <Label htmlFor="userId">Select User</Label>
                    <Select value={assignForm.userId} onValueChange={(value) => setAssignForm({...assignForm, userId: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Choose a user" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="no-user">Choose a user</SelectItem>
                        {unassignedUsers.map(user => (
                          <SelectItem key={user.id} value={user.id}>
                            {user.name} ({user.email})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="teamId">Select Team</Label>
                    <Select value={assignForm.teamId} onValueChange={(value) => setAssignForm({...assignForm, teamId: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Choose a team" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="no-team">Choose a team</SelectItem>
                        {teams.map(team => (
                          <SelectItem key={team.id} value={team.id}>
                            {team.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <Button type="submit" className="w-full">Assign User</Button>
                </form>
              </DialogContent>
            </Dialog>

            <Dialog open={isCreateTeamOpen} onOpenChange={setIsCreateTeamOpen}>
              <DialogTrigger asChild>
                <Button className="bg-chat-blue hover:bg-chat-blue/90 text-white px-6 py-3 rounded-lg shadow-lg transition-all duration-200 hover:scale-105">
                  <Plus className="w-5 h-5 mr-2" />
                  Create Team
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New Team</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleCreateTeam} className="space-y-4">
                  <div>
                    <Label htmlFor="name">Team Name</Label>
                    <Input
                      id="name"
                      value={teamForm.name}
                      onChange={(e) => setTeamForm({...teamForm, name: e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={teamForm.description}
                      onChange={(e) => setTeamForm({...teamForm, description: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="instance">Instance ID</Label>
                    <Input
                      id="instance"
                      value={teamForm.instance}
                      onChange={(e) => setTeamForm({...teamForm, instance: e.target.value})}
                      placeholder="e.g., creative, strategy, tech"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="color">Team Color</Label>
                    <Select value={teamForm.color} onValueChange={(value) => setTeamForm({...teamForm, color: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {colorOptions.map(color => (
                          <SelectItem key={color} value={color}>
                            <div className="flex items-center gap-2">
                              <div className={`w-4 h-4 rounded ${color}`}></div>
                              {color.replace('bg-', '').replace('-500', '')}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <Button type="submit" className="w-full">Create Team</Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-8">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="p-6 bg-gradient-to-br from-chat-blue-light to-background border-chat-border hover:shadow-lg transition-all duration-200 animate-fade-in">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Teams</p>
                <p className="text-3xl font-bold text-chat-blue">{teams.length}</p>
              </div>
              <div className="w-12 h-12 bg-chat-blue/10 rounded-full flex items-center justify-center">
                <Users className="w-6 h-6 text-chat-blue" />
              </div>
            </div>
          </Card>
          
          <Card className="p-6 bg-gradient-to-br from-green-50 to-background border-green-200 hover:shadow-lg transition-all duration-200 animate-fade-in" style={{ animationDelay: '0.1s' }}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Assigned Users</p>
                <p className="text-3xl font-bold text-green-600">{users.filter(u => u.teamId).length}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <UserCheck className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-orange-50 to-background border-orange-200 hover:shadow-lg transition-all duration-200 animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Unassigned</p>
                <p className="text-3xl font-bold text-orange-600">{unassignedUsers.length}</p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                <UserMinus className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </Card>
        </div>

        {/* Teams Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {teams.map((team) => {
            const teamUsers = getUsersByTeam(team.id);
            return (
              <Card key={team.id} className="relative border-chat-border hover:shadow-xl transition-all duration-300 hover:scale-105 animate-fade-in group" style={{ animationDelay: `${0.1 * (teams.indexOf(team) + 1)}s` }}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${team.color}`}></div>
                      <CardTitle className="text-lg">{team.name}</CardTitle>
                    </div>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openEditTeam(team)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteTeam(team.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">{team.description}</p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Instance:</span>
                      <Badge variant="outline">{team.instance}</Badge>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Members:</span>
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        <span>{teamUsers.length}</span>
                      </div>
                    </div>
                    {teamUsers.length > 0 && (
                      <div className="pt-2 border-t">
                        <p className="text-xs text-muted-foreground mb-2">Team Members:</p>
                        <div className="space-y-1">
                          {teamUsers.map(user => (
                            <div key={user.id} className="flex items-center justify-between text-xs">
                              <span>{user.name}</span>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => removeUserFromTeam(user.id)}
                                className="h-6 w-6 p-0 text-red-600 hover:text-red-700"
                              >
                                <UserMinus className="w-3 h-3" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Edit Team Dialog */}
        <Dialog open={isEditTeamOpen} onOpenChange={setIsEditTeamOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Team</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleEditTeam} className="space-y-4">
              <div>
                <Label htmlFor="edit-name">Team Name</Label>
                <Input
                  id="edit-name"
                  value={teamForm.name}
                  onChange={(e) => setTeamForm({...teamForm, name: e.target.value})}
                  required
                />
              </div>
              <div>
                <Label htmlFor="edit-description">Description</Label>
                <Textarea
                  id="edit-description"
                  value={teamForm.description}
                  onChange={(e) => setTeamForm({...teamForm, description: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="edit-instance">Instance ID</Label>
                <Input
                  id="edit-instance"
                  value={teamForm.instance}
                  onChange={(e) => setTeamForm({...teamForm, instance: e.target.value})}
                  required
                />
              </div>
              <div>
                <Label htmlFor="edit-color">Team Color</Label>
                <Select value={teamForm.color} onValueChange={(value) => setTeamForm({...teamForm, color: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {colorOptions.map(color => (
                      <SelectItem key={color} value={color}>
                        <div className="flex items-center gap-2">
                          <div className={`w-4 h-4 rounded ${color}`}></div>
                          {color.replace('bg-', '').replace('-500', '')}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button type="submit" className="w-full">Update Team</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
};

export default TeamManagement;
