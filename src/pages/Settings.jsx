import React, { useState, useEffect } from "react";
import { User } from "@/entities/User";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Languages, Bell, Shield, Save } from "lucide-react";

export default function SettingsPage() {
  const [currentUser, setCurrentUser] = useState(null);
  const [preferredLanguage, setPreferredLanguage] = useState('english');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      const user = await User.me();
      setCurrentUser(user);
      setPreferredLanguage(user.preferred_language || 'english');
    };
    fetchUser();
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    await User.updateMyUserData({ preferred_language: preferredLanguage });
    setIsSaving(false);
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-teal-50 p-4 md:p-8">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-purple-900 mb-2">Settings</h1>
          <p className="text-purple-700">Manage your application preferences.</p>
        </div>
        
        <div className="space-y-6">
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Languages /> Language</CardTitle>
              <CardDescription>Choose your preferred language for the application.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="max-w-sm space-y-4">
                <Select value={preferredLanguage} onValueChange={setPreferredLanguage}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select language" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="english">English</SelectItem>
                    <SelectItem value="hindi">हिन्दी (Hindi)</SelectItem>
                    <SelectItem value="bengali">বাংলা (Bengali)</SelectItem>
                    <SelectItem value="telugu">తెలుగు (Telugu)</SelectItem>
                    <SelectItem value="tamil">தமிழ் (Tamil)</SelectItem>
                    <SelectItem value="marathi">मराठी (Marathi)</SelectItem>
                  </SelectContent>
                </Select>
                <Button onClick={handleSave} disabled={isSaving}>
                  <Save className="w-4 h-4 mr-2" /> {isSaving ? 'Saving...' : 'Save Language'}
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg opacity-60">
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Bell /> Notifications (Coming Soon)</CardTitle>
              <CardDescription>Manage how you receive reminders and alerts.</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-500">This feature is under development.</p>
            </CardContent>
          </Card>
          
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg opacity-60">
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Shield /> Security & Privacy (Coming Soon)</CardTitle>
              <CardDescription>Manage your account security and data privacy settings.</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-500">This feature is under development.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}