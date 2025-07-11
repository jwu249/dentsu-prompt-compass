
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
import { Plus, Users, Edit, Trash2, UserPlus, UserMinus } from 'lucide-react';

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
    userId: '',
    teamId: ''
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
    assignUserToTeam(assignForm.userId, assignForm.teamId);
    setAssignForm({ userId: '', teamId: '' });
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
      <div className="p-6">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Team Management</h1>
            <p className="text-muted-foreground">Manage teams and assign users</p>
          </div>
          <div className="flex gap-2">
            <Dialog open={isAssignUserOpen} onOpenChange={setIsAssignUserOpen}>
              <DialogTrigger asChild>
                <Button className="bg-green-600 hover:bg-green-700">
                  <UserPlus className="w-4 h-4 mr-2" />
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
                <Button className="bg-red-600 hover:bg-red-700">
                  <Plus className="w-4 h-4 mr-2" />
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {teams.map((team) => {
            const teamUsers = getUsersByTeam(team.id);
            return (
              <Card key={team.id} className="relative">
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
