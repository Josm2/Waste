import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MapPin, CloudUpload } from "lucide-react";
import { api } from "@/lib/api";
import { queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "../contexts/AuthContext";
import { useState } from "react";
import type { WasteReport } from "@shared/schema";

export default function Reports() {
  const { toast } = useToast();
  const { user } = useAuth();
  const [reportForm, setReportForm] = useState({
    title: "",
    description: "",
    type: "",
    location: "",
    coordinates: ""
  });
  const [selectedImage, setSelectedImage] = useState<File | null>(null);

  const { data: reports, isLoading } = useQuery({
    queryKey: ["/api/waste-reports"],
    queryFn: api.getWasteReports,
  });

  const createReportMutation = useMutation({
    mutationFn: (formData: FormData) => api.createWasteReport(formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/waste-reports"] });
      toast({ title: "Report submitted successfully!" });
      setReportForm({ title: "", description: "", type: "", location: "", coordinates: "" });
      setSelectedImage(null);
    },
    onError: () => {
      toast({ title: "Failed to submit report", variant: "destructive" });
    }
  });

  const updateReportMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) => api.updateWasteReport(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/waste-reports"] });
      toast({ title: "Report updated successfully!" });
    }
  });

  const handleSubmitReport = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    
    Object.entries(reportForm).forEach(([key, value]) => {
      formData.append(key, value);
    });
    
    if (selectedImage) {
      formData.append('image', selectedImage);
    }
    
    createReportMutation.mutate(formData);
  };

  const handleGeolocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setReportForm(prev => ({
            ...prev,
            location: `Current Location (GPS): ${latitude.toFixed(4)}° N, ${longitude.toFixed(4)}° E`,
            coordinates: JSON.stringify({ lat: latitude, lng: longitude })
          }));
          toast({ title: "Location captured successfully!" });
        },
        (error) => {
          toast({ title: "Failed to get location", variant: "destructive" });
        }
      );
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "resolved":
        return "bg-green-100 text-green-800";
      case "in_progress":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-red-100 text-red-800";
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "uncollected":
        return "bg-red-100 text-red-800";
      case "illegal_dumping":
        return "bg-red-100 text-red-800";
      case "broken_bin":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "uncollected":
        return "Uncollected Waste";
      case "illegal_dumping":
        return "Illegal Dumping";
      case "broken_bin":
        return "Broken Bin";
      default:
        return "Other";
    }
  };

  if (isLoading) {
    return (
      <div className="p-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-8"></div>
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-64 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              {user?.role === "admin" ? "Citizen Reports" : "Report Issues"}
            </h2>
            <p className="text-gray-600">
              {user?.role === "admin" 
                ? "Manage waste-related reports from residents" 
                : "Report waste management issues in your area"
              }
            </p>
          </div>
          {user?.role === "admin" && (
            <div className="flex space-x-2">
              <Select>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                  <SelectItem value="resolved">Resolved</SelectItem>
                </SelectContent>
              </Select>
              <Select>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="All Types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="uncollected">Uncollected Waste</SelectItem>
                  <SelectItem value="illegal_dumping">Illegal Dumping</SelectItem>
                  <SelectItem value="broken_bin">Broken Bins</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
        </div>
      </div>

      {/* Reports Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 mb-12">
        {reports?.map((report: WasteReport) => (
          <Card key={report.id} className="overflow-hidden">
            <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
              {report.imageUrl ? (
                <img src={report.imageUrl} alt={report.title} className="w-full h-full object-cover" />
              ) : (
                <div className="text-gray-400">📷 No image</div>
              )}
            </div>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(report.type)}`}>
                  {getTypeLabel(report.type)}
                </span>
                <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(report.status)}`}>
                  {report.status.charAt(0).toUpperCase() + report.status.slice(1).replace('_', ' ')}
                </span>
              </div>
              <h3 className="font-medium text-gray-900 mb-2">{report.title}</h3>
              <p className="text-sm text-gray-600 mb-3">{report.description}</p>
              <div className="flex items-center text-xs text-gray-500 mb-3">
                <MapPin className="mr-1" size={12} />
                <span>{report.location}</span>
                <span className="mx-2">•</span>
                <span>{new Date(report.createdAt).toLocaleDateString()}</span>
              </div>
              <div className="flex space-x-2">
                {user?.role === "admin" ? (
                  <>
                    <Button 
                      size="sm" 
                      className="flex-1 text-white"
                      style={{ backgroundColor: 'var(--municipal-blue)' }}
                      onClick={() => updateReportMutation.mutate({ 
                        id: report.id, 
                        data: { status: "in_progress" } 
                      })}
                    >
                      Assign Truck
                    </Button>
                    <Button size="sm" variant="outline">
                      Details
                    </Button>
                  </>
                ) : (
                  <Button size="sm" variant="outline" className="w-full">
                    View Status
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Report Submission Form - Only for Citizens */}
      {user?.role === "resident" && (
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Submit New Report</h3>
            <form onSubmit={handleSubmitReport}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="type">Report Type</Label>
                  <Select 
                    value={reportForm.type} 
                    onValueChange={(value) => setReportForm(prev => ({ ...prev, type: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select report type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="uncollected">Uncollected Waste</SelectItem>
                      <SelectItem value="illegal_dumping">Illegal Dumping</SelectItem>
                      <SelectItem value="broken_bin">Broken Bin</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="location">Location</Label>
                  <div className="relative">
                    <Input
                      id="location"
                      placeholder="Enter location or use GPS"
                      value={reportForm.location}
                      onChange={(e) => setReportForm(prev => ({ ...prev, location: e.target.value }))}
                    />
                    <Button
                      type="button"
                      size="sm"
                      variant="ghost"
                      className="absolute right-2 top-1/2 transform -translate-y-1/2"
                      onClick={handleGeolocation}
                    >
                      <MapPin size={16} />
                    </Button>
                  </div>
                </div>

                <div>
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    placeholder="Brief description of the issue"
                    value={reportForm.title}
                    onChange={(e) => setReportForm(prev => ({ ...prev, title: e.target.value }))}
                  />
                </div>

                <div>
                  <Label htmlFor="image">Upload Photo</Label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-gray-400 transition-colors">
                    <CloudUpload className="mx-auto text-gray-400 mb-2" size={24} />
                    <p className="text-sm text-gray-600">Click to upload or drag and drop</p>
                    <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      id="image-upload"
                      onChange={(e) => setSelectedImage(e.target.files?.[0] || null)}
                    />
                    <label htmlFor="image-upload" className="cursor-pointer">
                      <span className="text-blue-600 hover:text-blue-500">Choose file</span>
                    </label>
                    {selectedImage && (
                      <p className="text-sm text-green-600 mt-2">Selected: {selectedImage.name}</p>
                    )}
                  </div>
                </div>

                <div className="md:col-span-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe the waste management issue..."
                    rows={3}
                    value={reportForm.description}
                    onChange={(e) => setReportForm(prev => ({ ...prev, description: e.target.value }))}
                  />
                </div>

                <div className="md:col-span-2">
                  <Button 
                    type="submit" 
                    className="w-full text-white" 
                    style={{ backgroundColor: 'var(--municipal-blue)' }}
                    disabled={createReportMutation.isPending}
                  >
                    {createReportMutation.isPending ? "Submitting..." : "Submit Report"}
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
