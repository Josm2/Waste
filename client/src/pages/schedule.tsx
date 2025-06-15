import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Calendar, Clock, MapPin, Truck, Bell } from "lucide-react";
import { api } from "@/lib/api";
import { useAuth } from "../contexts/AuthContext";
import type { CollectionSchedule } from "@shared/schema";

export default function Schedule() {
  const { user } = useAuth();
  const { data: schedules, isLoading } = useQuery({
    queryKey: ["/api/collection-schedules"],
    queryFn: api.getCollectionSchedules,
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return { bg: "bg-green-100", text: "text-green-800", border: "border-green-500" };
      case "in_progress":
        return { bg: "bg-yellow-100", text: "text-yellow-800", border: "border-yellow-500" };
      default:
        return { bg: "bg-blue-100", text: "text-blue-800", border: "border-blue-500" };
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "completed":
        return "Completed";
      case "in_progress":
        return "In Progress";
      default:
        return "Scheduled";
    }
  };

  if (isLoading) {
    return (
      <div className="p-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-8"></div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 h-96 bg-gray-200 rounded-lg"></div>
            <div className="h-96 bg-gray-200 rounded-lg"></div>
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
            <h2 className="text-2xl font-bold text-gray-900">Collection Schedule</h2>
            <p className="text-gray-600">Manage waste collection schedules by zone and barangay</p>
          </div>
          <Button 
            className="text-white hover:bg-blue-700"
            style={{ backgroundColor: 'var(--municipal-blue)' }}
          >
            <Plus className="mr-2" size={16} />
            Add Schedule
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Map View */}
        <div className="lg:col-span-2">
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Collection Map</h3>
              <div className="h-96 bg-gray-100 rounded-lg relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-green-100">
                  {/* Streets */}
                  <div className="absolute top-1/4 left-0 right-0 h-2 bg-gray-300"></div>
                  <div className="absolute top-1/2 left-0 right-0 h-2 bg-gray-300"></div>
                  <div className="absolute top-3/4 left-0 right-0 h-2 bg-gray-300"></div>
                  <div className="absolute top-0 bottom-0 left-1/4 w-2 bg-gray-300"></div>
                  <div className="absolute top-0 bottom-0 left-1/2 w-2 bg-gray-300"></div>
                  <div className="absolute top-0 bottom-0 left-3/4 w-2 bg-gray-300"></div>
                  
                  {/* Collection zones */}
                  <div 
                    className="absolute top-8 left-8 w-16 h-16 rounded-full opacity-70 flex items-center justify-center"
                    style={{ backgroundColor: 'var(--environmental-green)' }}
                  >
                    🚛
                  </div>
                  <div className="absolute top-32 right-16 w-16 h-16 bg-yellow-500 rounded-full opacity-70 flex items-center justify-center">
                    🕒
                  </div>
                  <div 
                    className="absolute bottom-16 left-1/3 w-16 h-16 rounded-full opacity-70 flex items-center justify-center"
                    style={{ backgroundColor: 'var(--municipal-blue)' }}
                  >
                    📍
                  </div>
                </div>
                
                <div className="absolute bottom-4 left-4 bg-white p-2 rounded shadow text-xs">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center">
                      <div 
                        className="w-3 h-3 rounded-full mr-1"
                        style={{ backgroundColor: 'var(--environmental-green)' }}
                      ></div>
                      <span>Completed</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-yellow-500 rounded-full mr-1"></div>
                      <span>In Progress</span>
                    </div>
                    <div className="flex items-center">
                      <div 
                        className="w-3 h-3 rounded-full mr-1"
                        style={{ backgroundColor: 'var(--municipal-blue)' }}
                      ></div>
                      <span>Scheduled</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Schedule List */}
        <div>
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Today's Schedule</h3>
              <div className="space-y-4">
                {schedules?.map((schedule: CollectionSchedule) => {
                  const colors = getStatusColor(schedule.status);
                  return (
                    <div key={schedule.id} className={`border-l-4 pl-4 ${colors.border}`}>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-gray-900">
                            {schedule.zone} - {schedule.barangay}
                          </p>
                          <p className="text-sm text-gray-600">{schedule.scheduledTime}</p>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs ${colors.bg} ${colors.text}`}>
                          {getStatusLabel(schedule.status)}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
