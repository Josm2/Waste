import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Truck, CheckCircle, AlertTriangle, Users } from "lucide-react";
import { api } from "@/lib/api";

export default function Dashboard() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ["/api/dashboard/stats"],
    queryFn: api.getDashboardStats,
  });

  if (isLoading) {
    return (
      <div className="p-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-24 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900">Dashboard Overview</h2>
        <p className="text-gray-600">Municipal waste management system overview</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Truck style={{ color: 'var(--municipal-blue)' }} />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active Trucks</p>
                <p className="text-2xl font-bold text-gray-900">{stats?.activeTrucks || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle style={{ color: 'var(--environmental-green)' }} />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Collections Today</p>
                <p className="text-2xl font-bold text-gray-900">{stats?.collectionsToday || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-red-100 rounded-lg">
                <AlertTriangle style={{ color: 'var(--alert-red)' }} />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Pending Reports</p>
                <p className="text-2xl font-bold text-gray-900">{stats?.pendingReports || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Users className="text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Registered Users</p>
                <p className="text-2xl font-bold text-gray-900">{stats?.registeredUsers || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Weekly Collection Data</h3>
            <div className="h-64">
              <svg viewBox="0 0 400 200" className="w-full h-full">
                {/* Chart background */}
                <rect width="400" height="200" fill="#f9fafb" />
                
                {/* Grid lines */}
                {[0, 1, 2, 3, 4].map(i => (
                  <line key={i} x1="60" y1={40 + i * 30} x2="360" y2={40 + i * 30} stroke="#e5e7eb" strokeWidth="1" />
                ))}
                
                {/* Y-axis labels */}
                {['100', '75', '50', '25', '0'].map((label, i) => (
                  <text key={i} x="50" y={45 + i * 30} fontSize="12" fill="#6b7280" textAnchor="end">{label}</text>
                ))}
                
                {/* Bars */}
                {[
                  { day: 'Mon', value: 85, x: 80 },
                  { day: 'Tue', value: 92, x: 120 },
                  { day: 'Wed', value: 78, x: 160 },
                  { day: 'Thu', value: 95, x: 200 },
                  { day: 'Fri', value: 88, x: 240 },
                  { day: 'Sat', value: 76, x: 280 },
                  { day: 'Sun', value: 82, x: 320 }
                ].map((bar, i) => (
                  <g key={i}>
                    <rect 
                      x={bar.x - 15} 
                      y={170 - (bar.value * 1.2)} 
                      width="30" 
                      height={bar.value * 1.2} 
                      fill="var(--environmental-green)" 
                      opacity="0.8"
                    />
                    <text x={bar.x} y="190" fontSize="12" fill="#6b7280" textAnchor="middle">{bar.day}</text>
                  </g>
                ))}
                
                {/* Chart title */}
                <text x="200" y="20" fontSize="14" fill="#374151" textAnchor="middle" fontWeight="600">Collections Completed (%)</text>
              </svg>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Route Efficiency</h3>
            <div className="h-64">
              <svg viewBox="0 0 400 200" className="w-full h-full">
                {/* Chart background */}
                <rect width="400" height="200" fill="#f9fafb" />
                
                {/* Grid lines */}
                {[0, 1, 2, 3, 4].map(i => (
                  <line key={i} x1="60" y1={40 + i * 30} x2="360" y2={40 + i * 30} stroke="#e5e7eb" strokeWidth="1" />
                ))}
                
                {/* Y-axis labels */}
                {['100%', '75%', '50%', '25%', '0%'].map((label, i) => (
                  <text key={i} x="50" y={45 + i * 30} fontSize="12" fill="#6b7280" textAnchor="end">{label}</text>
                ))}
                
                {/* Line chart */}
                <polyline
                  points="80,110 120,95 160,125 200,85 240,100 280,75 320,90"
                  fill="none"
                  stroke="var(--municipal-blue)"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                
                {/* Data points */}
                {[
                  { x: 80, y: 110, week: 'W1' },
                  { x: 120, y: 95, week: 'W2' },
                  { x: 160, y: 125, week: 'W3' },
                  { x: 200, y: 85, week: 'W4' },
                  { x: 240, y: 100, week: 'W5' },
                  { x: 280, y: 75, week: 'W6' },
                  { x: 320, y: 90, week: 'W7' }
                ].map((point, i) => (
                  <g key={i}>
                    <circle cx={point.x} cy={point.y} r="4" fill="var(--municipal-blue)" />
                    <text x={point.x} y="190" fontSize="12" fill="#6b7280" textAnchor="middle">{point.week}</text>
                  </g>
                ))}
                
                {/* Chart title */}
                <text x="200" y="20" fontSize="14" fill="#374151" textAnchor="middle" fontWeight="600">Route Efficiency Over Time</text>
              </svg>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
