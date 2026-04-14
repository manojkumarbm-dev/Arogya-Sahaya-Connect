import React, { useState, useEffect } from "react";
import { User } from "@/entities/User";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert } from "@/components/ui/alert";
import {
  Bell,
  Shield,
  Save,
  User as UserIcon,
  Eye,
  Download,
  Trash2,
  HelpCircle,
  Palette,
  Globe,
  Settings as SettingsIcon,
  Database,
  AlertTriangle
} from "lucide-react";

export default function SettingsPage() {
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");

  // Profile Settings
  const [profileData, setProfileData] = useState({
    full_name: '',
    email: '',
    phone_number: '',
    address: '',
    city: '',
    state: '',
    postal_code: '',
    date_of_birth: '',
    gender: '',
    blood_group: '',
    emergency_contact: ''
  });

  // Preferences
  const [preferences, setPreferences] = useState({
    preferred_language: 'english',
    theme: 'light',
    timezone: 'Asia/Kolkata',
    date_format: 'DD/MM/YYYY',
    currency: 'INR'
  });

  // Notification Settings
  const [notifications, setNotifications] = useState({
    email_notifications: true,
    sms_notifications: true,
    push_notifications: true,
    appointment_reminders: true,
    medication_reminders: true,
    health_alerts: true,
    marketing_emails: false,
    security_alerts: true
  });

  // Privacy Settings
  const [privacy, setPrivacy] = useState({
    profile_visibility: 'private',
    data_sharing: false,
    analytics_tracking: true,
    location_services: false,
    biometric_auth: false
  });

  // Security Settings
  const [security, setSecurity] = useState({
    two_factor_auth: false,
    session_timeout: '30',
    password_change_required: false,
    login_alerts: true
  });

  // App Settings
  const [appSettings, setAppSettings] = useState({
    auto_backup: true,
    offline_mode: false,
    high_contrast: false,
    font_size: 'medium',
    animation_reduction: false,
    sound_enabled: true
  });

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const user = await User.me();
      setCurrentUser(user);

      // Initialize all settings from user data
      setProfileData({
        full_name: user.full_name || '',
        email: user.email || '',
        phone_number: user.phone_number || '',
        address: user.address || '',
        city: user.city || '',
        state: user.state || '',
        postal_code: user.postal_code || '',
        date_of_birth: user.date_of_birth || '',
        gender: user.gender || '',
        blood_group: user.blood_group || '',
        emergency_contact: user.emergency_contact || ''
      });

      setPreferences({
        preferred_language: user.preferred_language || 'english',
        theme: localStorage.getItem('theme') || 'light',
        timezone: 'Asia/Kolkata',
        date_format: 'DD/MM/YYYY',
        currency: 'INR'
      });

      // Load other settings from localStorage or defaults
      const savedNotifications = localStorage.getItem('notifications');
      if (savedNotifications) {
        setNotifications(JSON.parse(savedNotifications));
      }

      const savedPrivacy = localStorage.getItem('privacy');
      if (savedPrivacy) {
        setPrivacy(JSON.parse(savedPrivacy));
      }

      const savedSecurity = localStorage.getItem('security');
      if (savedSecurity) {
        setSecurity(JSON.parse(savedSecurity));
      }

      const savedAppSettings = localStorage.getItem('appSettings');
      if (savedAppSettings) {
        setAppSettings(JSON.parse(savedAppSettings));
      }

    } catch (error) {
      console.error('Error loading settings:', error);
    }
    setIsLoading(false);
  };

  const saveProfile = async () => {
    setIsSaving(true);
    try {
      await User.updateMyUserData(profileData);
      setCurrentUser({ ...currentUser, ...profileData });
    } catch (error) {
      console.error('Error saving profile:', error);
    }
    setIsSaving(false);
  };

  const savePreferences = async () => {
    setIsSaving(true);
    try {
      await User.updateMyUserData({ preferred_language: preferences.preferred_language });
      localStorage.setItem('theme', preferences.theme);
      localStorage.setItem('preferences', JSON.stringify(preferences));
      // Apply theme
      document.documentElement.className = preferences.theme;
    } catch (error) {
      console.error('Error saving preferences:', error);
    }
    setIsSaving(false);
  };

  const saveNotifications = async () => {
    setIsSaving(true);
    localStorage.setItem('notifications', JSON.stringify(notifications));
    setIsSaving(false);
  };

  const savePrivacy = async () => {
    setIsSaving(true);
    localStorage.setItem('privacy', JSON.stringify(privacy));
    setIsSaving(false);
  };

  const saveSecurity = async () => {
    setIsSaving(true);
    localStorage.setItem('security', JSON.stringify(security));
    setIsSaving(false);
  };

  const saveAppSettings = async () => {
    setIsSaving(true);
    localStorage.setItem('appSettings', JSON.stringify(appSettings));
    setIsSaving(false);
  };

  const exportData = () => {
    const data = {
      profile: profileData,
      preferences,
      notifications,
      privacy,
      security,
      appSettings,
      exportDate: new Date().toISOString()
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'arogya-settings-export.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const resetToDefaults = () => {
    setPreferences({
      preferred_language: 'english',
      theme: 'light',
      timezone: 'Asia/Kolkata',
      date_format: 'DD/MM/YYYY',
      currency: 'INR'
    });
    setNotifications({
      email_notifications: true,
      sms_notifications: true,
      push_notifications: true,
      appointment_reminders: true,
      medication_reminders: true,
      health_alerts: true,
      marketing_emails: false,
      security_alerts: true
    });
    setPrivacy({
      profile_visibility: 'private',
      data_sharing: false,
      analytics_tracking: true,
      location_services: false,
      biometric_auth: false
    });
    setSecurity({
      two_factor_auth: false,
      session_timeout: '30',
      password_change_required: false,
      login_alerts: true
    });
    setAppSettings({
      auto_backup: true,
      offline_mode: false,
      high_contrast: false,
      font_size: 'medium',
      animation_reduction: false,
      sound_enabled: true
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-teal-50 p-4 md:p-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
            <p className="mt-4 text-purple-700">Loading settings...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-teal-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-purple-900 mb-2 flex items-center gap-2">
            <SettingsIcon className="w-8 h-8" />
            Settings
          </h1>
          <p className="text-purple-700">Manage your account, preferences, and application settings.</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 lg:grid-cols-8">
            <TabsTrigger value="profile" className="text-xs">Profile</TabsTrigger>
            <TabsTrigger value="preferences" className="text-xs">Prefs</TabsTrigger>
            <TabsTrigger value="notifications" className="text-xs">Notifs</TabsTrigger>
            <TabsTrigger value="privacy" className="text-xs">Privacy</TabsTrigger>
            <TabsTrigger value="security" className="text-xs">Security</TabsTrigger>
            <TabsTrigger value="appearance" className="text-xs">Appearance</TabsTrigger>
            <TabsTrigger value="data" className="text-xs">Data</TabsTrigger>
            <TabsTrigger value="help" className="text-xs">Help</TabsTrigger>
          </TabsList>

          {/* Profile Settings */}
          <TabsContent value="profile" className="space-y-6">
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <UserIcon className="w-5 h-5" />
                  Profile Information
                </CardTitle>
                <CardDescription>Update your personal information and contact details.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="full_name">Full Name</Label>
                    <Input
                      id="full_name"
                      value={profileData.full_name}
                      onChange={(e) => setProfileData({...profileData, full_name: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={profileData.email}
                      onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      value={profileData.phone_number}
                      onChange={(e) => setProfileData({...profileData, phone_number: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="emergency_contact">Emergency Contact</Label>
                    <Input
                      id="emergency_contact"
                      value={profileData.emergency_contact}
                      onChange={(e) => setProfileData({...profileData, emergency_contact: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="date_of_birth">Date of Birth</Label>
                    <Input
                      id="date_of_birth"
                      type="date"
                      value={profileData.date_of_birth}
                      onChange={(e) => setProfileData({...profileData, date_of_birth: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="gender">Gender</Label>
                    <Select value={profileData.gender} onValueChange={(value) => setProfileData({...profileData, gender: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="blood_group">Blood Group</Label>
                    <Select value={profileData.blood_group} onValueChange={(value) => setProfileData({...profileData, blood_group: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select blood group" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="A+">A+</SelectItem>
                        <SelectItem value="A-">A-</SelectItem>
                        <SelectItem value="B+">B+</SelectItem>
                        <SelectItem value="B-">B-</SelectItem>
                        <SelectItem value="AB+">AB+</SelectItem>
                        <SelectItem value="AB-">AB-</SelectItem>
                        <SelectItem value="O+">O+</SelectItem>
                        <SelectItem value="O-">O-</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Textarea
                    id="address"
                    value={profileData.address}
                    onChange={(e) => setProfileData({...profileData, address: e.target.value})}
                    placeholder="Enter your full address"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city">City</Label>
                    <Input
                      id="city"
                      value={profileData.city}
                      onChange={(e) => setProfileData({...profileData, city: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="state">State</Label>
                    <Input
                      id="state"
                      value={profileData.state}
                      onChange={(e) => setProfileData({...profileData, state: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="postal_code">Postal Code</Label>
                    <Input
                      id="postal_code"
                      value={profileData.postal_code}
                      onChange={(e) => setProfileData({...profileData, postal_code: e.target.value})}
                    />
                  </div>
                </div>
                <Button onClick={saveProfile} disabled={isSaving} className="w-full md:w-auto">
                  <Save className="w-4 h-4 mr-2" />
                  {isSaving ? 'Saving...' : 'Save Profile'}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Preferences */}
          <TabsContent value="preferences" className="space-y-6">
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="w-5 h-5" />
                  Preferences
                </CardTitle>
                <CardDescription>Customize your language, theme, and regional settings.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Language</Label>
                    <Select value={preferences.preferred_language} onValueChange={(value) => setPreferences({...preferences, preferred_language: value})}>
                      <SelectTrigger>
                        <SelectValue />
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
                  </div>
                  <div className="space-y-2">
                    <Label>Theme</Label>
                    <Select value={preferences.theme} onValueChange={(value) => setPreferences({...preferences, theme: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="light">Light</SelectItem>
                        <SelectItem value="dark">Dark</SelectItem>
                        <SelectItem value="system">System</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Timezone</Label>
                    <Select value={preferences.timezone} onValueChange={(value) => setPreferences({...preferences, timezone: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Asia/Kolkata">Asia/Kolkata (IST)</SelectItem>
                        <SelectItem value="Asia/Dubai">Asia/Dubai (GST)</SelectItem>
                        <SelectItem value="Europe/London">Europe/London (GMT)</SelectItem>
                        <SelectItem value="America/New_York">America/New_York (EST)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Date Format</Label>
                    <Select value={preferences.date_format} onValueChange={(value) => setPreferences({...preferences, date_format: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                        <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                        <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <Button onClick={savePreferences} disabled={isSaving}>
                  <Save className="w-4 h-4 mr-2" />
                  {isSaving ? 'Saving...' : 'Save Preferences'}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Notifications */}
          <TabsContent value="notifications" className="space-y-6">
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="w-5 h-5" />
                  Notification Preferences
                </CardTitle>
                <CardDescription>Choose how you want to be notified about important updates.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Email Notifications</Label>
                      <p className="text-sm text-muted-foreground">Receive notifications via email</p>
                    </div>
                    <Switch
                      checked={notifications.email_notifications}
                      onCheckedChange={(checked) => setNotifications({...notifications, email_notifications: checked})}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>SMS Notifications</Label>
                      <p className="text-sm text-muted-foreground">Receive notifications via SMS</p>
                    </div>
                    <Switch
                      checked={notifications.sms_notifications}
                      onCheckedChange={(checked) => setNotifications({...notifications, sms_notifications: checked})}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Push Notifications</Label>
                      <p className="text-sm text-muted-foreground">Receive push notifications on your device</p>
                    </div>
                    <Switch
                      checked={notifications.push_notifications}
                      onCheckedChange={(checked) => setNotifications({...notifications, push_notifications: checked})}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Appointment Reminders</Label>
                      <p className="text-sm text-muted-foreground">Get reminded about upcoming appointments</p>
                    </div>
                    <Switch
                      checked={notifications.appointment_reminders}
                      onCheckedChange={(checked) => setNotifications({...notifications, appointment_reminders: checked})}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Medication Reminders</Label>
                      <p className="text-sm text-muted-foreground">Receive medication schedule reminders</p>
                    </div>
                    <Switch
                      checked={notifications.medication_reminders}
                      onCheckedChange={(checked) => setNotifications({...notifications, medication_reminders: checked})}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Health Alerts</Label>
                      <p className="text-sm text-muted-foreground">Important health-related notifications</p>
                    </div>
                    <Switch
                      checked={notifications.health_alerts}
                      onCheckedChange={(checked) => setNotifications({...notifications, health_alerts: checked})}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Marketing Emails</Label>
                      <p className="text-sm text-muted-foreground">Receive promotional emails and updates</p>
                    </div>
                    <Switch
                      checked={notifications.marketing_emails}
                      onCheckedChange={(checked) => setNotifications({...notifications, marketing_emails: checked})}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Security Alerts</Label>
                      <p className="text-sm text-muted-foreground">Notifications about account security</p>
                    </div>
                    <Switch
                      checked={notifications.security_alerts}
                      onCheckedChange={(checked) => setNotifications({...notifications, security_alerts: checked})}
                    />
                  </div>
                </div>
                <Button onClick={saveNotifications} disabled={isSaving}>
                  <Save className="w-4 h-4 mr-2" />
                  {isSaving ? 'Saving...' : 'Save Notifications'}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Privacy */}
          <TabsContent value="privacy" className="space-y-6">
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="w-5 h-5" />
                  Privacy Settings
                </CardTitle>
                <CardDescription>Control your privacy and data sharing preferences.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Profile Visibility</Label>
                    <Select value={privacy.profile_visibility} onValueChange={(value) => setPrivacy({...privacy, profile_visibility: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="public">Public</SelectItem>
                        <SelectItem value="friends">Friends Only</SelectItem>
                        <SelectItem value="private">Private</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Data Sharing</Label>
                      <p className="text-sm text-muted-foreground">Allow sharing anonymized data for research</p>
                    </div>
                    <Switch
                      checked={privacy.data_sharing}
                      onCheckedChange={(checked) => setPrivacy({...privacy, data_sharing: checked})}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Analytics Tracking</Label>
                      <p className="text-sm text-muted-foreground">Help improve the app with usage analytics</p>
                    </div>
                    <Switch
                      checked={privacy.analytics_tracking}
                      onCheckedChange={(checked) => setPrivacy({...privacy, analytics_tracking: checked})}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Location Services</Label>
                      <p className="text-sm text-muted-foreground">Use location for better healthcare recommendations</p>
                    </div>
                    <Switch
                      checked={privacy.location_services}
                      onCheckedChange={(checked) => setPrivacy({...privacy, location_services: checked})}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Biometric Authentication</Label>
                      <p className="text-sm text-muted-foreground">Use fingerprint/face ID for quick login</p>
                    </div>
                    <Switch
                      checked={privacy.biometric_auth}
                      onCheckedChange={(checked) => setPrivacy({...privacy, biometric_auth: checked})}
                    />
                  </div>
                </div>
                <Button onClick={savePrivacy} disabled={isSaving}>
                  <Save className="w-4 h-4 mr-2" />
                  {isSaving ? 'Saving...' : 'Save Privacy Settings'}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Security */}
          <TabsContent value="security" className="space-y-6">
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  Security Settings
                </CardTitle>
                <CardDescription>Manage your account security and authentication preferences.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Two-Factor Authentication</Label>
                      <p className="text-sm text-muted-foreground">Add an extra layer of security to your account</p>
                    </div>
                    <Switch
                      checked={security.two_factor_auth}
                      onCheckedChange={(checked) => setSecurity({...security, two_factor_auth: checked})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Session Timeout (minutes)</Label>
                    <Select value={security.session_timeout} onValueChange={(value) => setSecurity({...security, session_timeout: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="15">15 minutes</SelectItem>
                        <SelectItem value="30">30 minutes</SelectItem>
                        <SelectItem value="60">1 hour</SelectItem>
                        <SelectItem value="240">4 hours</SelectItem>
                        <SelectItem value="never">Never</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Login Alerts</Label>
                      <p className="text-sm text-muted-foreground">Get notified of new login attempts</p>
                    </div>
                    <Switch
                      checked={security.login_alerts}
                      onCheckedChange={(checked) => setSecurity({...security, login_alerts: checked})}
                    />
                  </div>
                </div>
                <div className="space-y-4">
                  <Button variant="outline" className="w-full">
                    <Key className="w-4 h-4 mr-2" />
                    Change Password
                  </Button>
                  <Button variant="outline" className="w-full">
                    <Download className="w-4 h-4 mr-2" />
                    Download Recovery Codes
                  </Button>
                </div>
                <Button onClick={saveSecurity} disabled={isSaving}>
                  <Save className="w-4 h-4 mr-2" />
                  {isSaving ? 'Saving...' : 'Save Security Settings'}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Appearance */}
          <TabsContent value="appearance" className="space-y-6">
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Palette className="w-5 h-5" />
                  Appearance & Accessibility
                </CardTitle>
                <CardDescription>Customize the look and feel of the application.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Font Size</Label>
                    <Select value={appSettings.font_size} onValueChange={(value) => setAppSettings({...appSettings, font_size: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="small">Small</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="large">Large</SelectItem>
                        <SelectItem value="extra-large">Extra Large</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>High Contrast Mode</Label>
                      <p className="text-sm text-muted-foreground">Increase contrast for better visibility</p>
                    </div>
                    <Switch
                      checked={appSettings.high_contrast}
                      onCheckedChange={(checked) => setAppSettings({...appSettings, high_contrast: checked})}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Reduce Animations</Label>
                      <p className="text-sm text-muted-foreground">Minimize motion and animations</p>
                    </div>
                    <Switch
                      checked={appSettings.animation_reduction}
                      onCheckedChange={(checked) => setAppSettings({...appSettings, animation_reduction: checked})}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Sound Effects</Label>
                      <p className="text-sm text-muted-foreground">Enable audio feedback</p>
                    </div>
                    <Switch
                      checked={appSettings.sound_enabled}
                      onCheckedChange={(checked) => setAppSettings({...appSettings, sound_enabled: checked})}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Auto Backup</Label>
                      <p className="text-sm text-muted-foreground">Automatically backup your data</p>
                    </div>
                    <Switch
                      checked={appSettings.auto_backup}
                      onCheckedChange={(checked) => setAppSettings({...appSettings, auto_backup: checked})}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Offline Mode</Label>
                      <p className="text-sm text-muted-foreground">Enable offline functionality</p>
                    </div>
                    <Switch
                      checked={appSettings.offline_mode}
                      onCheckedChange={(checked) => setAppSettings({...appSettings, offline_mode: checked})}
                    />
                  </div>
                </div>
                <Button onClick={saveAppSettings} disabled={isSaving}>
                  <Save className="w-4 h-4 mr-2" />
                  {isSaving ? 'Saving...' : 'Save Appearance Settings'}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Data Management */}
          <TabsContent value="data" className="space-y-6">
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="w-5 h-5" />
                  Data Management
                </CardTitle>
                <CardDescription>Export your data or manage your account.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-semibold mb-2">Export Your Data</h4>
                    <p className="text-sm text-muted-foreground mb-4">
                      Download a copy of all your personal data, settings, and health records.
                    </p>
                    <Button onClick={exportData} variant="outline">
                      <Download className="w-4 h-4 mr-2" />
                      Export Data
                    </Button>
                  </div>

                  <div className="p-4 border rounded-lg">
                    <h4 className="font-semibold mb-2">Reset to Defaults</h4>
                    <p className="text-sm text-muted-foreground mb-4">
                      Reset all settings to their default values.
                    </p>
                    <Button onClick={resetToDefaults} variant="outline">
                      <SettingsIcon className="w-4 h-4 mr-2" />
                      Reset Settings
                    </Button>
                  </div>

                  <Alert>
                    <AlertTriangle className="h-4 w-4" />
                    <div>
                      <h4 className="font-semibold">Danger Zone</h4>
                      <p className="text-sm">These actions cannot be undone.</p>
                      <div className="mt-4 space-y-2">
                        <Button variant="destructive" className="w-full">
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete All Data
                        </Button>
                        <Button variant="destructive" className="w-full">
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete Account
                        </Button>
                      </div>
                    </div>
                  </Alert>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Help & Support */}
          <TabsContent value="help" className="space-y-6">
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <HelpCircle className="w-5 h-5" />
                  Help & Support
                </CardTitle>
                <CardDescription>Get help, contact support, or learn more about the app.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-semibold mb-2">User Guide</h4>
                    <p className="text-sm text-muted-foreground mb-4">
                      Learn how to use all features of Arogya Sahaya Connect.
                    </p>
                    <Button variant="outline" className="w-full">
                      <HelpCircle className="w-4 h-4 mr-2" />
                      View Guide
                    </Button>
                  </div>

                  <div className="p-4 border rounded-lg">
                    <h4 className="font-semibold mb-2">Contact Support</h4>
                    <p className="text-sm text-muted-foreground mb-4">
                      Get help from our support team.
                    </p>
                    <Button variant="outline" className="w-full">
                      <Mail className="w-4 h-4 mr-2" />
                      Contact Support
                    </Button>
                  </div>

                  <div className="p-4 border rounded-lg">
                    <h4 className="font-semibold mb-2">FAQ</h4>
                    <p className="text-sm text-muted-foreground mb-4">
                      Find answers to frequently asked questions.
                    </p>
                    <Button variant="outline" className="w-full">
                      <HelpCircle className="w-4 h-4 mr-2" />
                      View FAQ
                    </Button>
                  </div>

                  <div className="p-4 border rounded-lg">
                    <h4 className="font-semibold mb-2">Report Issue</h4>
                    <p className="text-sm text-muted-foreground mb-4">
                      Report bugs or suggest improvements.
                    </p>
                    <Button variant="outline" className="w-full">
                      <AlertTriangle className="w-4 h-4 mr-2" />
                      Report Issue
                    </Button>
                  </div>
                </div>

                <div className="p-4 border rounded-lg">
                  <h4 className="font-semibold mb-2">App Information</h4>
                  <div className="space-y-2 text-sm">
                    <p><strong>Version:</strong> 1.0.0</p>
                    <p><strong>Last Updated:</strong> April 13, 2026</p>
                    <p><strong>Platform:</strong> Web Application</p>
                    <p><strong>Developer:</strong> Arogya Sahaya Team</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}