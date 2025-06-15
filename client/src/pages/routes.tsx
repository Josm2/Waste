import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Route as RouteIcon, Download } from "lucide-react";
import { api } from "@/lib/api";
import type { Route } from "@shared/schema";

export default function Routes() {
  const { data: routes, isLoading } = useQuery({
    queryKey: ["/api/routes"],
    queryFn: api.getRoutes,
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "completed":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-yellow-100 text-yellow-800";
    }
  };

  const getRouteColor = (name: string) => {
    switch (name) {
      case "Route A":
        return "var(--municipal-blue)";
      case "Route B":
        return "var(--environmental-green)";
      case "Route C":
        return "var(--alert-red)";
      default:
        return "#6B7280";
    }
  };

  if (isLoading) {
    return (
      <div className="p-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-8"></div>
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-3 h-96 bg-gray-200 rounded-lg"></div>
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
            <h2 className="text-2xl font-bold text-gray-900">Route Optimization</h2>
            <p className="text-gray-600">Optimize collection routes for maximum efficiency</p>
          </div>
          <div className="flex space-x-2">
            <Button 
              className="text-white"
              style={{ backgroundColor: 'var(--environmental-green)' }}
            >
              <RouteIcon className="mr-2" size={16} />
              Optimize Routes
            </Button>
            <Button variant="outline">
              <Download className="mr-2" size={16} />
              Export
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Route Map */}
        <div className="lg:col-span-3">
          <Card>
            <CardContent className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Optimized Routes</h3>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600">Efficiency:</span>
                  <span 
                    className="text-sm font-medium"
                    style={{ color: 'var(--environmental-green)' }}
                  >
                    +23%
                  </span>
                </div>
              </div>

              <div className="h-96 bg-gray-100 rounded-lg relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-green-50">
                  {/* Street grid */}
                  <div className="absolute inset-0">
                    {[...Array(6)].map((_, i) => (
                      <div key={`h-${i}`} className={`absolute left-0 right-0 h-1 bg-gray-300`} style={{ top: `${(i + 1) * (100 / 6)}%` }}></div>
                    ))}
                    {[...Array(6)].map((_, i) => (
                      <div key={`v-${i}`} className={`absolute top-0 bottom-0 w-1 bg-gray-300`} style={{ left: `${(i + 1) * (100 / 6)}%` }}></div>
                    ))}
                  </div>
                  
                  {/* Route paths - SVG for better route visualization */}
                  <svg className="absolute inset-0 w-full h-full">
                    <path 
                      d="M 50 50 Q 150 100 250 80 T 350 120" 
                      stroke="var(--municipal-blue)" 
                      strokeWidth="3" 
                      fill="none" 
                      strokeDasharray="5,5"
                    />
                    <path 
                      d="M 80 200 Q 180 250 280 230 T 380 270" 
                      stroke="var(--environmental-green)" 
                      strokeWidth="3" 
                      fill="none" 
                      strokeDasharray="5,5"
                    />
                    <path 
                      d="M 100 300 Q 200 350 300 330 T 400 370" 
                      stroke="var(--alert-red)" 
                      strokeWidth="3" 
                      fill="none" 
                      strokeDasharray="5,5"
                    />
                  </svg>
                  
                  {/* Truck positions */}
                  <div 
                    className="absolute top-12 left-12 w-8 h-8 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: 'var(--municipal-blue)' }}
                  >
                    🚛
                  </div>
                  <div 
                    className="absolute top-48 left-20 w-8 h-8 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: 'var(--environmental-green)' }}
                  >
                    🚛
                  </div>
                  <div 
                    className="absolute top-72 left-24 w-8 h-8 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: 'var(--alert-red)' }}
                  >
                    🚛
                  </div>
                  
                  {/* Collection points */}
                  {[
                    { top: 16, left: 32 },
                    { top: 24, left: 48 },
                    { top: 32, left: 64 },
                    { top: 52, left: 36 },
                    { top: 60, left: 52 },
                    { top: 76, left: 28 }
                  ].map((point, i) => (
                    <div
                      key={i}
                      className="absolute w-4 h-4 bg-yellow-400 rounded-full"
                      style={{ top: `${point.top}%`, left: `${point.left}%` }}
                    ></div>
                  ))}
                </div>
                
                <div className="absolute bottom-4 left-4 bg-white p-3 rounded shadow text-xs">
                  <div className="space-y-2">
                    {routes?.map((route: Route) => (
                      <div key={route.id} className="flex items-center">
                        <div 
                          className="w-3 h-3 rounded-full mr-2"
                          style={{ backgroundColor: getRouteColor(route.name) }}
                        ></div>
                        <span>{route.name} ({route.distance})</span>
                      </div>
                    ))}
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-yellow-400 rounded-full mr-2"></div>
                      <span>Collection Points</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Route Details */}
        <div>
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Route Performance</h3>
              <div className="space-y-4">
                {routes?.map((route: Route) => (
                  <div key={route.id} className="border border-gray-200 rounded-lg p-3">
                    <div className="flex items-center justify-between mb-2">
                      <span 
                        className="font-medium"
                        style={{ color: getRouteColor(route.name) }}
                      >
                        {route.name}
                      </span>
                      <span className={`text-xs px-2 py-1 rounded ${getStatusColor(route.status)}`}>
                        {route.status.charAt(0).toUpperCase() + route.status.slice(1)}
                      </span>
                    </div>
                    <div className="text-sm text-gray-600 space-y-1">
                      <p>Distance: {route.distance}</p>
                      <p>Time: {route.estimatedTime}</p>
                      <p>Collections: {route.collectionsCount}</p>
                      <p>Truck: {route.truckId}</p>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-6 pt-4 border-t border-gray-200">
                <h4 className="font-medium text-gray-900 mb-2">Optimization Stats</h4>
                <div className="text-sm text-gray-600 space-y-1">
                  <div className="flex justify-between">
                    <span>Fuel Savings:</span>
                    <span 
                      className="font-medium"
                      style={{ color: 'var(--environmental-green)' }}
                    >
                      18%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Time Reduction:</span>
                    <span 
                      className="font-medium"
                      style={{ color: 'var(--environmental-green)' }}
                    >
                      23%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Total Distance:</span>
                    <span>{routes?.reduce((acc, route) => acc + parseFloat(route.distance), 0).toFixed(1)}km</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
