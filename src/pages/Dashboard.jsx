
import React, { useState, useEffect } from "react";
import { User } from "@/entities/User";
import { MedicalRecord } from "@/entities/MedicalRecord";
import { Vaccination } from "@/entities/Vaccination";
import { FamilyMember } from "@/entities/FamilyMember";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { 
  Heart, 
  FileText, 
  Shield, 
  Users, 
  Calendar,
  Stethoscope,
  UserCheck,
  TrendingUp,
  QrCode
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

export default function DashboardPage() {
  const [currentUser, setCurrentUser] = useState(null);
  const [stats, setStats] = useState({
    medicalRecords: 0,
    vaccinations: 0,
    familyMembers: 0,
    upcomingReminders: 0
  });
  const [recentRecords, setRecentRecords] = useState([]);
  const [upcomingVaccinations, setUpcomingVaccinations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Moved loadDashboardData inside useEffect and made it a local function
  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const user = await User.me();
        setCurrentUser(user);
        
        if (user.user_type === 'patient') {
          await loadPatientData(user);
        } else {
          await loadProviderData(user);
        }
      } catch (error) {
        console.error("Error loading dashboard:", error);
      }
      setIsLoading(false);
    };

    loadDashboardData();
  }, []); // Empty dependency array means this runs once on mount

  const loadPatientData = async (user) => {
    try {
      const [records, vaccinations, familyMembers] = await Promise.all([
        MedicalRecord.filter({ patient_abha_id: user.abha_id }, '-created_date', 5),
        Vaccination.filter({ patient_abha_id: user.abha_id }, '-created_date'),
        FamilyMember.filter({ primary_user_id: user.id })
      ]);

      const upcoming = vaccinations.filter(v => 
        v.next_dose_date && new Date(v.next_dose_date) > new Date() && !v.is_completed
      );

      setStats({
        medicalRecords: records.length,
        vaccinations: vaccinations.length,
        familyMembers: familyMembers.length,
        upcomingReminders: upcoming.length
      });

      setRecentRecords(records);
      setUpcomingVaccinations(upcoming.slice(0, 3));
    } catch (error) {
      console.error("Error loading patient data:", error);
    }
  };

  const loadProviderData = async (user) => {
    try {
      const records = await MedicalRecord.filter({ doctor_id: user.id }, '-created_date', 10);
      
      setStats({
        medicalRecords: records.length,
        patientsToday: records.filter(r => 
          new Date(r.created_date).toDateString() === new Date().toDateString()
        ).length,
        totalPatients: new Set(records.map(r => r.patient_abha_id)).size,
        recordsThisWeek: records.filter(r => {
          const recordDate = new Date(r.created_date);
          const weekAgo = new Date();
          weekAgo.setDate(weekAgo.getDate() - 7);
          return recordDate > weekAgo;
        }).length
      });

      setRecentRecords(records.slice(0, 5));
    } catch (error) {
      console.error("Error loading provider data:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-teal-50 dark:from-gray-900 dark:to-teal-900/40 flex items-center justify-center">
        <div className="animate-pulse flex items-center gap-3">
          <Heart className="w-8 h-8 text-primary-purple" />
          <span className="text-xl font-semibold text-purple-900 dark:text-purple-300">Loading Dashboard...</span>
        </div>
      </div>
    );
  }

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    return "Good Evening";
  };

  const PatientDashboard = () => (
    <>
      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">Medical Records</p>
                <p className="text-2xl font-bold text-purple-900 dark:text-purple-200">{stats.medicalRecords}</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/50 rounded-xl flex items-center justify-center">
                <FileText className="w-6 h-6 text-primary-purple dark:text-purple-300" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">Vaccinations</p>
                <p className="text-2xl font-bold text-teal-900 dark:text-teal-200">{stats.vaccinations}</p>
              </div>
              <div className="w-12 h-12 bg-teal-100 dark:bg-teal-900/50 rounded-xl flex items-center justify-center">
                <Shield className="w-6 h-6 text-secondary-teal dark:text-teal-300" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">Family Members</p>
                <p className="text-2xl font-bold text-pink-900 dark:text-pink-300">{stats.familyMembers}</p>
              </div>
              <div className="w-12 h-12 bg-pink-100 dark:bg-pink-900/50 rounded-xl flex items-center justify-center">
                <Users className="w-6 h-6 text-accent-pink dark:text-pink-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">Reminders</p>
                <p className="text-2xl font-bold text-orange-900 dark:text-orange-300">{stats.upcomingReminders}</p>
              </div>
              <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/50 rounded-xl flex items-center justify-center">
                <Calendar className="w-6 h-6 text-accent-orange dark:text-orange-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Recent Records */}
        <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-purple-900 dark:text-purple-200">Recent Medical Records</CardTitle>
              <CardDescription className="dark:text-gray-400">Your latest medical activities</CardDescription>
            </div>
            <Link to={createPageUrl("MedicalRecords")}>
              <Button variant="outline" size="sm" className="dark:bg-gray-700 dark:text-white dark:border-gray-600">View All</Button>
            </Link>
          </CardHeader>
          <CardContent>
            {recentRecords.length > 0 ? (
              <div className="space-y-3">
                {recentRecords.map((record) => (
                  <div key={record.id} className="flex items-start gap-3 p-3 rounded-lg bg-purple-50 dark:bg-gray-900/50">
                    <div className="w-2 h-2 bg-primary-purple rounded-full mt-2 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-purple-900 dark:text-purple-300 truncate">{record.title}</p>
                      <p className="text-sm text-purple-700 dark:text-purple-400">
                        {format(new Date(record.record_date), "MMM d, yyyy")}
                      </p>
                      <Badge variant="outline" className="mt-1 dark:border-gray-600 dark:text-gray-300">
                        {record.record_type.replace('_', ' ')}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <FileText className="w-12 h-12 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
                <p className="text-gray-600 dark:text-gray-400">No medical records yet</p>
                <Link to={createPageUrl("MedicalRecords")}>
                  <Button className="mt-3 bg-primary-purple hover:bg-primary-light-purple dark:text-white">Add First Record</Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Upcoming Vaccinations */}
        <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-teal-900 dark:text-teal-200">Upcoming Vaccinations</CardTitle>
              <CardDescription className="dark:text-gray-400">Don't miss your next doses</CardDescription>
            </div>
            <Link to={createPageUrl("Vaccinations")}>
              <Button variant="outline" size="sm" className="dark:bg-gray-700 dark:text-white dark:border-gray-600">View All</Button>
            </Link>
          </CardHeader>
          <CardContent>
            {upcomingVaccinations.length > 0 ? (
              <div className="space-y-3">
                {upcomingVaccinations.map((vaccination) => (
                  <div key={vaccination.id} className="flex items-start gap-3 p-3 rounded-lg bg-teal-50 dark:bg-gray-900/50">
                    <div className="w-2 h-2 bg-secondary-teal rounded-full mt-2 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-teal-900 dark:text-teal-300">{vaccination.vaccine_name}</p>
                      <p className="text-sm text-teal-700 dark:text-teal-400">
                        Due: {format(new Date(vaccination.next_dose_date), "MMM d, yyyy")}
                      </p>
                      <Badge variant="outline" className="mt-1 dark:border-gray-600 dark:text-gray-300">
                        Dose {vaccination.dose_number + 1}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Shield className="w-12 h-12 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
                <p className="text-gray-600 dark:text-gray-400">No upcoming vaccinations</p>
                <Link to={createPageUrl("Vaccinations")}>
                  <Button className="mt-3 bg-primary-purple hover:bg-primary-light-purple dark:text-white">Manage Vaccinations</Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );

  const ProviderDashboard = () => (
    <>
      {/* Provider Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">Total Records</p>
                <p className="text-2xl font-bold text-purple-900 dark:text-purple-200">{stats.medicalRecords}</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/50 rounded-xl flex items-center justify-center">
                <FileText className="w-6 h-6 text-primary-purple dark:text-purple-300" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">Patients Today</p>
                <p className="text-2xl font-bold text-teal-900 dark:text-teal-200">{stats.patientsToday || 0}</p>
              </div>
              <div className="w-12 h-12 bg-teal-100 dark:bg-teal-900/50 rounded-xl flex items-center justify-center">
                <UserCheck className="w-6 h-6 text-secondary-teal dark:text-teal-300" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">Total Patients</p>
                <p className="text-2xl font-bold text-pink-900 dark:text-pink-300">{stats.totalPatients || 0}</p>
              </div>
              <div className="w-12 h-12 bg-pink-100 dark:bg-pink-900/50 rounded-xl flex items-center justify-center">
                <Users className="w-6 h-6 text-accent-pink dark:text-pink-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">This Week</p>
                <p className="text-2xl font-bold text-orange-900 dark:text-orange-300">{stats.recordsThisWeek || 0}</p>
              </div>
              <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/50 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-accent-orange dark:text-orange-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid md:grid-cols-1 gap-6">
        <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-purple-900 dark:text-purple-200">Recent Patient Records</CardTitle>
              <CardDescription className="dark:text-gray-400">Latest patient interactions</CardDescription>
            </div>
            <Link to={createPageUrl("MedicalRecords")}>
              <Button variant="outline" size="sm" className="dark:bg-gray-700 dark:text-white dark:border-gray-600">View All</Button>
            </Link>
          </CardHeader>
          <CardContent>
            {recentRecords.length > 0 ? (
              <div className="space-y-3">
                {recentRecords.map((record) => (
                  <div key={record.id} className="flex items-start gap-3 p-4 rounded-lg bg-purple-50 dark:bg-gray-900/50 border border-purple-100 dark:border-gray-800">
                    <div className="w-10 h-10 bg-purple-200 dark:bg-purple-900 rounded-full flex items-center justify-center flex-shrink-0">
                      <FileText className="w-5 h-5 text-primary-purple dark:text-purple-300" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-purple-900 dark:text-purple-300">{record.title}</p>
                      <p className="text-sm text-purple-700 dark:text-purple-400 mb-1">
                        Patient ABHA: {record.patient_abha_id}
                      </p>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="dark:border-gray-600 dark:text-gray-300">{record.record_type.replace('_', ' ')}</Badge>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {format(new Date(record.created_date), "MMM d, yyyy HH:mm")}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Stethoscope className="w-12 h-12 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
                <p className="text-gray-600 dark:text-gray-400">No patient records yet</p>
                <Link to={createPageUrl("MedicalRecords")}>
                  <Button className="mt-3 bg-primary-purple hover:bg-primary-light-purple dark:text-white">Add First Record</Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-teal-50 dark:from-gray-900 dark:to-teal-900/40 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-primary-purple to-primary-light-purple rounded-2xl flex items-center justify-center shadow-lg">
              {currentUser?.user_type === 'healthcare_provider' ? (
                <Stethoscope className="w-8 h-8 text-white" />
              ) : (
                <Heart className="w-8 h-8 text-white" />
              )}
            </div>
            <div>
              <h1 className="text-3xl font-bold text-purple-900 dark:text-purple-200">
                {getGreeting()}, {currentUser?.full_name}!
              </h1>
              <p className="text-purple-700 dark:text-purple-400">
                {currentUser?.user_type === 'healthcare_provider' 
                  ? `${currentUser.specialization} at ${currentUser.hospital_name}`
                  : "Welcome to your healthcare dashboard"
                }
              </p>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-3">
            <Badge variant="outline" className={`px-3 py-1 ${
              currentUser?.user_type === 'healthcare_provider' 
                ? 'bg-purple-100 text-primary-purple border-purple-200 dark:bg-purple-900/50 dark:text-purple-300 dark:border-purple-700' 
                : 'bg-teal-100 text-secondary-teal border-teal-200 dark:bg-teal-900/50 dark:text-teal-300 dark:border-teal-700'
            }`}>
              {currentUser?.user_type === 'healthcare_provider' ? 'Healthcare Provider' : 'Patient'}
            </Badge>
            {currentUser?.abha_id && (
              <Badge variant="outline" className="bg-pink-100 text-accent-pink border-pink-200 px-3 py-1 dark:bg-pink-900/50 dark:text-pink-300 dark:border-pink-700">
                ABHA ID: {currentUser.abha_id}
              </Badge>
            )}
          </div>
        </div>

        {/* Dashboard Content */}
        {currentUser?.user_type === 'patient' ? <PatientDashboard /> : <ProviderDashboard />}

        {/* Quick Actions */}
        <Card className="bg-gradient-to-r from-primary-purple to-accent-pink border-0 shadow-2xl mt-8">
          <CardContent className="p-6">
            <h3 className="text-xl font-bold text-white mb-4">Quick Actions</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Link to={createPageUrl("MedicalRecords")}>
                <Button variant="secondary" className="w-full bg-white/20 backdrop-blur-sm text-white border-0 hover:bg-white/30">
                  <FileText className="w-4 h-4 mr-2" />
                  Records
                </Button>
              </Link>
              <Link to={createPageUrl("Profile")}>
                <Button variant="secondary" className="w-full bg-white/20 backdrop-blur-sm text-white border-0 hover:bg-white/30">
                  <UserCheck className="w-4 h-4 mr-2" />
                  Profile
                </Button>
              </Link>
              <Link to={createPageUrl("QRScanner")}>
                <Button variant="secondary" className="w-full bg-white/20 backdrop-blur-sm text-white border-0 hover:bg-white/30">
                  <QrCode className="w-4 h-4 mr-2" />
                  QR Scanner
                </Button>
              </Link>
              {currentUser?.user_type === 'patient' && (
                <Link to={createPageUrl("Family")}>
                  <Button variant="secondary" className="w-full bg-white/20 backdrop-blur-sm text-white border-0 hover:bg-white/30">
                    <Users className="w-4 h-4 mr-2" />
                    Family
                  </Button>
                </Link>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
