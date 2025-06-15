import { Bell, Recycle, User, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useAuth } from "../contexts/AuthContext";

export default function Header() {
  const { user, switchAccount } = useAuth();

  const handleSwitchToAdmin = () => {
    switchAccount({
      id: 1,
      username: "admin",
      password: "admin123",
      role: "admin",
      name: "MENRO Administrator",
      email: "admin@city.gov.ph",
      barangay: null,
      notificationPreferences: '["email"]'
    });
  };

  const handleSwitchToCitizen = () => {
    switchAccount({
      id: 2,
      username: "citizen",
      password: "citizen123",
      role: "resident",
      name: "Maria Santos",
      email: "maria.santos@email.com",
      barangay: "Barangay 1",
      notificationPreferences: '["email", "sms"]'
    });
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-4">
            <div className="flex-shrink-0">
              <Recycle className="text-2xl" style={{ color: 'var(--environmental-green)' }} />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-gray-900">Municipal Waste Management</h1>
              <p className="text-sm text-gray-500">
                {user?.role === "admin" ? "City Environmental Management" : "Citizen Portal"}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <button className="relative p-2 text-gray-400 hover:text-gray-500">
              <Bell className="text-lg" />
              <span className="absolute top-0 right-0 block h-2 w-2 rounded-full" style={{ backgroundColor: 'var(--alert-red)' }}></span>
            </button>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center space-x-2 p-2">
                  <div className="h-8 w-8 rounded-full flex items-center justify-center" style={{ backgroundColor: 'var(--municipal-blue)' }}>
                    <User className="text-white text-sm" />
                  </div>
                  <div className="text-left">
                    <span className="text-sm font-medium text-gray-700 block">{user?.name}</span>
                    <span className="text-xs text-gray-500">{user?.role === "admin" ? "MENRO Admin" : "Citizen"}</span>
                  </div>
                  <ChevronDown className="h-4 w-4 text-gray-500" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem onClick={handleSwitchToAdmin} className="cursor-pointer">
                  <div className="flex items-center">
                    <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                      <User className="text-blue-600 text-sm" />
                    </div>
                    <div>
                      <div className="font-medium">MENRO Administrator</div>
                      <div className="text-xs text-gray-500">Admin Account</div>
                    </div>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleSwitchToCitizen} className="cursor-pointer">
                  <div className="flex items-center">
                    <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center mr-3">
                      <User className="text-green-600 text-sm" />
                    </div>
                    <div>
                      <div className="font-medium">Maria Santos</div>
                      <div className="text-xs text-gray-500">Citizen Account</div>
                    </div>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="cursor-pointer">
                  Profile & Settings
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer text-red-600">
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  );
}
