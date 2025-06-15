import { Link, useLocation } from "wouter";
import { 
  LayoutDashboard, 
  Calendar, 
  AlertTriangle, 
  Route as RouteIcon, 
  GraduationCap, 
  Users,
  User
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";

interface NavItem {
  path: string;
  label: string;
  icon: any;
  badge?: number;
}

const adminNavItems: NavItem[] = [
  { path: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { path: "/schedule", label: "Collection Schedule", icon: Calendar },
  { path: "/reports", label: "Citizen Reports", icon: AlertTriangle, badge: 3 },
  { path: "/routes", label: "Route Optimization", icon: RouteIcon },
  { path: "/education", label: "Education Portal", icon: GraduationCap },
  { path: "/residents", label: "Resident Management", icon: Users },
];

const citizenNavItems: NavItem[] = [
  { path: "/schedule", label: "Collection Schedule", icon: Calendar },
  { path: "/reports", label: "Report Issues", icon: AlertTriangle },
  { path: "/profile", label: "Profile & Settings", icon: User },
];

export default function Sidebar() {
  const [location] = useLocation();
  const { user } = useAuth();

  const navItems = user?.role === "admin" ? adminNavItems : citizenNavItems;

  const isActive = (path: string) => {
    if (path === "/dashboard" && (location === "/" || location === "/dashboard")) {
      return true;
    }
    return location === path;
  };

  return (
    <aside className="w-64 bg-white shadow-sm border-r border-gray-200">
      <nav className="mt-8">
        <div className="px-4">
          <ul className="space-y-2">
            {navItems.map((item: any) => {
              const Icon = item.icon;
              const active = isActive(item.path);
              
              return (
                <li key={item.path}>
                  <Link href={item.path}>
                    <button 
                      className={`w-full flex items-center px-4 py-2 text-sm font-medium rounded-lg ${
                        active 
                          ? 'text-white bg-blue-600' 
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                      style={active ? { backgroundColor: 'var(--municipal-blue)' } : {}}
                    >
                      <Icon className="mr-3" size={16} />
                      {item.label}
                      {item.badge && user?.role === "admin" && item.badge && (
                        <span 
                          className="ml-auto text-white text-xs px-2 py-1 rounded-full"
                          style={{ backgroundColor: 'var(--alert-red)' }}
                        >
                          {item.badge}
                        </span>
                      )}
                    </button>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </nav>
    </aside>
  );
}
