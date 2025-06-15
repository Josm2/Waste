import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Megaphone, Download, User } from "lucide-react";
import { api } from "@/lib/api";
import { queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import type { Resident } from "@shared/schema";

export default function Residents() {
  const { toast } = useToast();
  const [showNotificationForm, setShowNotificationForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBarangay, setSelectedBarangay] = useState("all");

  const { data: residents, isLoading } = useQuery({
    queryKey: ["/api/residents"],
    queryFn: api.getResidents,
  });

  const sendNotificationMutation = useMutation({
    mutationFn: api.createNotification,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/notifications"] });
      toast({ title: "Notification sent successfully!" });
      setShowNotificationForm(false);
    }
  });

  const filteredResidents = residents?.filter((resident: Resident) => {
    const matchesSearch = resident.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         resident.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesBarangay = selectedBarangay === "all" || resident.location === selectedBarangay;
    return matchesSearch && matchesBarangay;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleSendNotification = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget as HTMLFormElement);
    
    const channels = [];
    if (formData.get('email')) channels.push('email');
    if (formData.get('sms')) channels.push('sms');
    if (formData.get('push')) channels.push('push');
    
    const notificationData = {
      subject: formData.get('subject') as string,
      message: formData.get('message') as string,
      type: formData.get('type') as string,
      recipientGroup: formData.get('recipientGroup') as string,
      channels: JSON.stringify(channels)
    };
    
    sendNotificationMutation.mutate(notificationData);
  };

  if (isLoading) {
    return (
      <div className="p-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-8"></div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="h-64 bg-gray-200 rounded-lg"></div>
            <div className="lg:col-span-2 h-64 bg-gray-200 rounded-lg"></div>
          </div>
        </div>
      </div>
    );
  }

  const stats = {
    totalRegistered: residents?.length || 0,
    activeUsers: residents?.filter((r: Resident) => r.status === "active").length || 0,
    newThisMonth: residents?.filter((r: Resident) => {
      const oneMonthAgo = new Date();
      oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
      return new Date(r.registeredDate) > oneMonthAgo;
    }).length || 0,
    notificationsSent: 3421 // Mock value
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Resident Management</h2>
            <p className="text-gray-600">Manage resident registrations and notifications</p>
          </div>
          <div className="flex space-x-2">
            <Button 
              onClick={() => setShowNotificationForm(true)}
              className="text-white"
              style={{ backgroundColor: 'var(--municipal-blue)' }}
            >
              <Megaphone className="mr-2" size={16} />
              Send Notification
            </Button>
            <Button variant="outline">
              <Download className="mr-2" size={16} />
              Export List
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Resident Statistics */}
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Registration Stats</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Total Registered</span>
                <span className="text-lg font-semibold text-gray-900">{stats.totalRegistered}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Active Users</span>
                <span 
                  className="text-lg font-semibold"
                  style={{ color: 'var(--environmental-green)' }}
                >
                  {stats.activeUsers}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">New This Month</span>
                <span 
                  className="text-lg font-semibold"
                  style={{ color: 'var(--municipal-blue)' }}
                >
                  {stats.newThisMonth}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Notifications Sent</span>
                <span className="text-lg font-semibold text-purple-600">{stats.notificationsSent}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Registrations */}
        <div className="lg:col-span-2">
          <Card>
            <CardContent className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Recent Registrations</h3>
                <div className="flex space-x-2">
                  <Input
                    placeholder="Search residents..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-48"
                  />
                  <Select value={selectedBarangay} onValueChange={setSelectedBarangay}>
                    <SelectTrigger className="w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Barangays</SelectItem>
                      <SelectItem value="Barangay 1">Barangay 1</SelectItem>
                      <SelectItem value="Barangay 2">Barangay 2</SelectItem>
                      <SelectItem value="Barangay 3">Barangay 3</SelectItem>
                      <SelectItem value="Barangay 5">Barangay 5</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-2 text-left font-medium text-gray-900">Name</th>
                      <th className="px-4 py-2 text-left font-medium text-gray-900">Location</th>
                      <th className="px-4 py-2 text-left font-medium text-gray-900">Registered</th>
                      <th className="px-4 py-2 text-left font-medium text-gray-900">Status</th>
                      <th className="px-4 py-2 text-left font-medium text-gray-900">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredResidents?.map((resident: Resident) => (
                      <tr key={resident.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3">
                          <div className="flex items-center">
                            <div className="h-8 w-8 rounded-full bg-gray-300 flex items-center justify-center mr-3">
                              <User className="text-gray-600" size={16} />
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">{resident.name}</p>
                              <p className="text-xs text-gray-500">{resident.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-gray-900">{resident.location}</td>
                        <td className="px-4 py-3 text-gray-500">
                          {new Date(resident.registeredDate).toLocaleDateString()}
                        </td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(resident.status)}`}>
                            {resident.status.charAt(0).toUpperCase() + resident.status.slice(1)}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <Button size="sm" variant="outline" className="mr-2">
                            View
                          </Button>
                          <Button size="sm" variant="ghost">
                            Message
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Notification System */}
      {showNotificationForm && (
        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Send Notification</h3>
              <Button variant="outline" onClick={() => setShowNotificationForm(false)}>
                Cancel
              </Button>
            </div>
            
            <form onSubmit={handleSendNotification}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="recipientGroup">Recipient Group</Label>
                  <Select name="recipientGroup" required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select recipient group" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Residents</SelectItem>
                      <SelectItem value="Barangay 1">Barangay 1</SelectItem>
                      <SelectItem value="Barangay 2">Barangay 2</SelectItem>
                      <SelectItem value="Barangay 3">Barangay 3</SelectItem>
                      <SelectItem value="active">Active Users Only</SelectItem>
                      <SelectItem value="pending">Pending Registrations</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="type">Notification Type</Label>
                  <Select name="type" required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select notification type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="collection_reminder">Collection Reminder</SelectItem>
                      <SelectItem value="schedule_change">Schedule Change</SelectItem>
                      <SelectItem value="community_cleanup">Community Clean-up</SelectItem>
                      <SelectItem value="system_announcement">System Announcement</SelectItem>
                      <SelectItem value="educational_content">Educational Content</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="md:col-span-2">
                  <Label htmlFor="subject">Subject</Label>
                  <Input name="subject" placeholder="Enter notification subject" required />
                </div>
                
                <div className="md:col-span-2">
                  <Label htmlFor="message">Message</Label>
                  <Textarea name="message" placeholder="Enter your message here..." rows={4} required />
                </div>
                
                <div className="md:col-span-2">
                  <Label>Channels</Label>
                  <div className="flex items-center space-x-4 mt-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox name="sms" id="sms" />
                      <Label htmlFor="sms">Send via SMS</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox name="email" id="email" defaultChecked />
                      <Label htmlFor="email">Send via Email</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox name="push" id="push" />
                      <Label htmlFor="push">Push Notification</Label>
                    </div>
                  </div>
                </div>
                
                <div className="md:col-span-2">
                  <Button 
                    type="submit" 
                    className="text-white"
                    style={{ backgroundColor: 'var(--municipal-blue)' }}
                    disabled={sendNotificationMutation.isPending}
                  >
                    {sendNotificationMutation.isPending ? "Sending..." : "Send Notification"}
                  </Button>
                </div>
              </div>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
