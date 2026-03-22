
import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { User } from "@/entities/User";
import { 
  Heart, 
  FileText, 
  Shield, 
  Users, 
  QrCode, 
  Settings, 
  Home,
  Bell,
  LogOut,
  Stethoscope,
  UserCheck,
  Moon,
  Sun
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const navigationItems = [
  {
    title: "Dashboard",
    url: createPageUrl("Dashboard"),
    icon: Home,
    roles: ["patient", "healthcare_provider"]
  },
  {
    title: "Medical Records",
    url: createPageUrl("MedicalRecords"),
    icon: FileText,
    roles: ["patient", "healthcare_provider"]
  },
  {
    title: "Vaccinations",
    url: createPageUrl("Vaccinations"),
    icon: Shield,
    roles: ["patient"]
  },
  {
    title: "Family",
    url: createPageUrl("Family"),
    icon: Users,
    roles: ["patient"]
  },
  {
    title: "QR Scanner",
    url: createPageUrl("QRScanner"),
    icon: QrCode,
    roles: ["patient", "healthcare_provider"]
  },
  {
    title: "Profile",
    url: createPageUrl("Profile"),
    icon: UserCheck,
    roles: ["patient", "healthcare_provider"]
  }
];

export default function Layout({ children, currentPageName }) {
  const location = useLocation();
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");

  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const user = await User.me();
      setCurrentUser(user);
    } catch (error) {
      // User not logged in
    }
    setIsLoading(false);
  };

  const handleLogout = async () => {
    await User.logout();
    window.location.href = createPageUrl("Auth");
  };

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center">
        <div className="animate-pulse flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-500 rounded-lg"></div>
          <span className="text-blue-900 font-semibold">Loading Arogya Sahaya Connect...</span>
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return children;
  }

  const filteredNavigation = navigationItems.filter(item => 
    item.roles.includes(currentUser.user_type)
  );

  return (
    <SidebarProvider>
      <style>{`
        :root {
          --primary-purple: #6d28d9;
          --primary-light-purple: #8b5cf6;
          --secondary-teal: #0d9488;
          --secondary-light-teal: #14b8a6;
          --accent-pink: #ec4899;
          --accent-orange: #f97316;
        }
      `}</style>
      
      <div className="min-h-screen flex w-full bg-gradient-to-br from-purple-50 via-white to-teal-50 dark:from-gray-900 dark:via-gray-900 dark:to-teal-900">
        <Sidebar className="border-r border-purple-100 dark:border-gray-800 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
          <SidebarHeader className="border-b border-purple-100 dark:border-gray-800 p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-purple to-primary-light-purple rounded-xl flex items-center justify-center shadow-lg">
                <Heart className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="font-bold text-primary-purple text-lg dark:text-purple-300">Arogya Sahaya</h2>
                <p className="text-xs text-primary-light-purple font-medium dark:text-purple-400">Healthcare Connect</p>
              </div>
            </div>
          </SidebarHeader>
          
          <SidebarContent className="p-3">
            <SidebarGroup>
              <SidebarGroupLabel className="text-xs font-semibold text-purple-700 dark:text-purple-400 uppercase tracking-wider px-3 py-3">
                Navigation
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {filteredNavigation.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton 
                        asChild 
                        className={`hover:bg-purple-50 dark:hover:bg-gray-800 hover:text-primary-purple dark:hover:text-purple-300 transition-all duration-200 rounded-xl mb-1 px-3 py-2.5 ${
                          location.pathname === item.url ? 'bg-purple-100 dark:bg-gray-800 text-primary-purple dark:text-purple-200 font-bold shadow-sm' : 'text-gray-700 dark:text-gray-300'
                        }`}
                      >
                        <Link to={item.url} className="flex items-center gap-3">
                          <item.icon className="w-4 h-4" />
                          <span className="font-medium">{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            <SidebarGroup>
              <SidebarGroupLabel className="text-xs font-semibold text-purple-700 dark:text-purple-400 uppercase tracking-wider px-3 py-3">
                Account
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <div className="px-3 py-2 space-y-3">
                  <div className="bg-gradient-to-r from-purple-50 to-teal-50 dark:from-gray-800 dark:to-teal-900/50 rounded-xl p-3">
                    <div className="flex items-center gap-2 text-sm">
                      {currentUser.user_type === 'healthcare_provider' ? (
                        <Stethoscope className="w-4 h-4 text-primary-purple dark:text-purple-300" />
                      ) : (
                        <UserCheck className="w-4 h-4 text-secondary-teal dark:text-teal-300" />
                      )}
                      <span className="text-gray-700 dark:text-gray-200 font-medium">{currentUser.full_name}</span>
                    </div>
                    <Badge 
                      variant="outline" 
                      className={`mt-2 text-xs ${
                        currentUser.user_type === 'healthcare_provider' 
                          ? 'bg-purple-100 text-primary-purple border-purple-200 dark:bg-purple-900/50 dark:text-purple-300 dark:border-purple-700' 
                          : 'bg-teal-100 text-secondary-teal border-teal-200 dark:bg-teal-900/50 dark:text-teal-300 dark:border-teal-700'
                      }`}
                    >
                      {currentUser.user_type === 'healthcare_provider' ? 'Healthcare Provider' : 'Patient'}
                    </Badge>
                  </div>
                  
                  {currentUser.abha_id && (
                    <div className="text-xs text-gray-600 dark:text-gray-400">
                      <span className="font-medium">ABHA ID:</span> {currentUser.abha_id}
                    </div>
                  )}
                </div>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>

          <SidebarFooter className="border-t border-purple-100 dark:border-gray-800 p-4">
            <div className="space-y-2">
              <Button onClick={toggleTheme} variant="ghost" className="w-full justify-start gap-3 text-gray-700 dark:text-gray-300 hover:bg-purple-50 dark:hover:bg-gray-800 hover:text-primary-purple dark:hover:text-purple-300">
                {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
                {theme === 'light' ? 'Dark Mode' : 'Light Mode'}
              </Button>
              <Link to={createPageUrl("Settings")}>
                <Button variant="ghost" className="w-full justify-start gap-3 text-gray-700 dark:text-gray-300 hover:bg-purple-50 dark:hover:bg-gray-800 hover:text-primary-purple dark:hover:text-purple-300">
                  <Settings className="w-4 h-4" />
                  Settings
                </Button>
              </Link>
              <Button 
                variant="ghost" 
                className="w-full justify-start gap-3 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/50 hover:text-red-700 dark:text-red-500 dark:hover:text-red-400"
                onClick={handleLogout}
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </Button>
            </div>
          </SidebarFooter>
        </Sidebar>

        <main className="flex-1 flex flex-col min-h-screen">
          <header className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-b border-purple-100 dark:border-gray-800 px-6 py-4 md:hidden">
            <div className="flex items-center justify-between">
              <SidebarTrigger className="hover:bg-purple-50 dark:hover:bg-gray-800 p-2 rounded-lg transition-colors duration-200 text-gray-800 dark:text-gray-200" />
              <div className="flex items-center gap-2">
                <Heart className="w-6 h-6 text-primary-purple" />
                <h1 className="text-lg font-bold text-primary-purple dark:text-purple-300">Arogya Sahaya</h1>
              </div>
              <Button variant="ghost" size="icon" className="hover:bg-purple-50 dark:hover:bg-gray-800">
                <Bell className="w-5 h-5 text-primary-purple dark:text-purple-300" />
              </Button>
            </div>
          </header>

          <div className="flex-1 overflow-auto">
            {children}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
