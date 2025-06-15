import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { User, Mail, MapPin, Bell, LogOut, Trash } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

export default function Profile() {
  const { user, logout } = useAuth();
  const { toast } = useToast();
  const [profileData, setProfileData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    barangay: user?.barangay || "",
    notifications: {
      email: true,
      sms: false,
      push: false
    }
  });

  const handleSaveProfile = () => {
    toast({ title: "Profile updated successfully!" });
  };

  const handleDeleteAccount = () => {
    if (window.confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
      toast({ title: "Account deletion requested", description: "Your account will be deleted within 24 hours." });
      logout();
    }
  };

  if (!user) {
    return (
      <div className="p-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Not Logged In</h2>
          <p className="text-gray-600">Please log in to view your profile.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900">Profile & Settings</h2>
        <p className="text-gray-600">Manage your account information and preferences</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Personal Information */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center mb-4">
              <User className="mr-2" style={{ color: 'var(--municipal-blue)' }} />
              <h3 className="text-lg font-semibold text-gray-900">Personal Information</h3>
            </div>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  value={profileData.name}
                  onChange={(e) => setProfileData(prev => ({ ...prev, name: e.target.value }))}
                />
              </div>
              
              <div>
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={profileData.email}
                  onChange={(e) => setProfileData(prev => ({ ...prev, email: e.target.value }))}
                />
              </div>
              
              <div>
                <Label htmlFor="barangay">Barangay/Location</Label>
                <Select 
                  value={profileData.barangay} 
                  onValueChange={(value) => setProfileData(prev => ({ ...prev, barangay: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select your barangay" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Barangay 1">Barangay 1</SelectItem>
                    <SelectItem value="Barangay 2">Barangay 2</SelectItem>
                    <SelectItem value="Barangay 3">Barangay 3</SelectItem>
                    <SelectItem value="Barangay 4">Barangay 4</SelectItem>
                    <SelectItem value="Barangay 5">Barangay 5</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-gray-500 mt-1">
                  Update your location for accurate collection schedules
                </p>
              </div>
              
              <Button 
                onClick={handleSaveProfile}
                className="w-full text-white"
                style={{ backgroundColor: 'var(--municipal-blue)' }}
              >
                Save Changes
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Notification Preferences */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center mb-4">
              <Bell className="mr-2" style={{ color: 'var(--environmental-green)' }} />
              <h3 className="text-lg font-semibold text-gray-900">Notification Preferences</h3>
            </div>
            
            <div className="space-y-4">
              <p className="text-sm text-gray-600 mb-4">
                Choose how you want to receive notifications about collection schedules and updates.
              </p>
              
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="email-notifications"
                    checked={profileData.notifications.email}
                    onCheckedChange={(checked) => 
                      setProfileData(prev => ({
                        ...prev,
                        notifications: { ...prev.notifications, email: checked as boolean }
                      }))
                    }
                  />
                  <Label htmlFor="email-notifications" className="flex items-center">
                    <Mail className="mr-2" size={16} />
                    Email Notifications
                  </Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="sms-notifications"
                    checked={profileData.notifications.sms}
                    onCheckedChange={(checked) => 
                      setProfileData(prev => ({
                        ...prev,
                        notifications: { ...prev.notifications, sms: checked as boolean }
                      }))
                    }
                  />
                  <Label htmlFor="sms-notifications" className="flex items-center">
                    📱 SMS Notifications
                  </Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="push-notifications"
                    checked={profileData.notifications.push}
                    onCheckedChange={(checked) => 
                      setProfileData(prev => ({
                        ...prev,
                        notifications: { ...prev.notifications, push: checked as boolean }
                      }))
                    }
                  />
                  <Label htmlFor="push-notifications" className="flex items-center">
                    🔔 Push Notifications
                  </Label>
                </div>
              </div>
              
              <div className="pt-4 border-t border-gray-200">
                <h4 className="font-medium text-gray-900 mb-2">Notification Types</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Collection schedule reminders</li>
                  <li>• Schedule changes or delays</li>
                  <li>• Community clean-up events</li>
                  <li>• Important announcements</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Account Actions */}
        <Card className="lg:col-span-2">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Actions</h3>
            
            <div className="flex space-x-4">
              <Button 
                onClick={logout}
                variant="outline"
                className="flex items-center"
              >
                <LogOut className="mr-2" size={16} />
                Log Out
              </Button>
              
              <Button 
                onClick={handleDeleteAccount}
                variant="destructive"
                className="flex items-center"
              >
                <Trash className="mr-2" size={16} />
                Delete Account
              </Button>
            </div>
            
            <p className="text-xs text-gray-500 mt-4">
              Account deletion is permanent and cannot be undone. All your data will be removed from our systems.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}