import React, { useState, useEffect } from "react";
import { User } from "@/entities/User";
import { Vaccination } from "@/entities/Vaccination";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

export default function VaccinationsPage() {
  const [currentUser, setCurrentUser] = useState(null);
  const [vaccinations, setVaccinations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadPageData();
  }, []);

  const loadPageData = async () => {
    try {
      const user = await User.me();
      setCurrentUser(user);
      const fetchedVaccinations = await Vaccination.filter({ patient_abha_id: user.abha_id }, "-vaccination_date");
      setVaccinations(fetchedVaccinations);
    } catch (error) {
      console.error("Error loading data:", error);
    }
    setIsLoading(false);
  };
  
  const upcomingVaccinations = vaccinations.filter(v => v.next_dose_date && new Date(v.next_dose_date) > new Date() && !v.is_completed);
  const completedVaccinations = vaccinations.filter(v => v.is_completed);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-teal-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-purple-900 mb-2">Vaccination History</h1>
          <p className="text-purple-700">Track your immunizations and reminders.</p>
        </div>

        {isLoading ? (
          <p>Loading vaccinations...</p>
        ) : (
          <>
            <Card className="mb-8 bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-teal-900 flex items-center gap-2"><Clock /> Upcoming Doses & Reminders</CardTitle>
              </CardHeader>
              <CardContent>
                {upcomingVaccinations.length > 0 ? (
                  <div className="space-y-4">
                    {upcomingVaccinations.map(v => (
                      <div key={v.id} className="p-4 rounded-lg bg-teal-50 border border-teal-200">
                        <div className="flex justify-between items-center">
                          <p className="font-bold text-teal-800">{v.vaccine_name} (Dose {v.dose_number + 1})</p>
                          <Badge>Due: {format(new Date(v.next_dose_date), "MMM d, yyyy")}</Badge>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">Last dose taken on: {format(new Date(v.vaccination_date), "MMM d, yyyy")}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-600">No upcoming vaccination reminders.</p>
                )}
              </CardContent>
            </Card>

            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-purple-900 flex items-center gap-2"><CheckCircle /> Completed Vaccinations</CardTitle>
              </CardHeader>
              <CardContent className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {completedVaccinations.map(v => (
                  <div key={v.id} className="p-4 rounded-lg bg-purple-50 border border-purple-200">
                    <p className="font-bold text-purple-800">{v.vaccine_name}</p>
                    <p className="text-sm text-gray-600 mt-1">
                      Final Dose: {format(new Date(v.vaccination_date), "MMM d, yyyy")}
                    </p>
                    {v.certificate_url && (
                       <a href={v.certificate_url} target="_blank" rel="noopener noreferrer">
                         <Button variant="link" className="p-0 h-auto mt-2 text-primary-purple">View Certificate</Button>
                       </a>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  );
}