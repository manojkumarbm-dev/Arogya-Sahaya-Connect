
import React, { useState, useEffect } from "react";
import { User } from "@/entities/User";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  UserCheck, 
  Edit, 
  Save, 
  X, 
  QrCode, 
  Phone, 
  Mail, 
  MapPin,
  Heart,
  Stethoscope,
  Building2,
  BadgeCheck,
  LogOut // Added LogOut icon import
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { createPageUrl } from "@/utils"; // Added createPageUrl import

export default function ProfilePage() {
  const [currentUser, setCurrentUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({});
  const [showQRDialog, setShowQRDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState('');

  useEffect(() => {
    loadUserProfile();
  }, []);

  const loadUserProfile = async () => {
    try {
      const user = await User.me();
      setCurrentUser(user);
      setEditData(user);
    } catch (error) {
      console.error("Error loading profile:", error);
    }
    setIsLoading(false);
  };

  const handleEdit = () => {
    setIsEditing(true);
    setEditData({ ...currentUser });
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditData({ ...currentUser });
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await User.updateMyUserData(editData);
      setCurrentUser({ ...editData });
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating profile:", error);
    }
    setIsSaving(false);
  };

  const handleLogout = async () => {
    await User.logout();
    window.location.href = createPageUrl("Auth");
  };

  const generateQRData = () => {
    if (!currentUser) return "";
    
    const qrData = {
      name: currentUser.full_name,
      phone: currentUser.phone_number,
      blood_group: currentUser.blood_group,
      emergency_contact: currentUser.emergency_contact,
      type: currentUser.user_type
    };
    
    if (currentUser.user_type === 'healthcare_provider') {
      qrData.doctor_id = currentUser.doctor_id;
      qrData.license_number = currentUser.license_number;
      qrData.specialization = currentUser.specialization;
      qrData.hospital = currentUser.hospital_name;
    } else { // Assuming 'patient' for other user types
      qrData.abha_id = currentUser.abha_id;
    }
    
    const qrString = JSON.stringify(qrData);
    setQrCodeUrl(`https://api.qrserver.com/v1/create-qr-code/?size=256x256&data=${encodeURIComponent(qrString)}`);
    setShowQRDialog(true);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-teal-50 flex items-center justify-center">
        <div className="animate-pulse flex items-center gap-3">
          <UserCheck className="w-8 h-8 text-purple-600" />
          <span className="text-xl font-semibold text-purple-900">Loading Profile...</span>
        </div>
      </div>
    );
  }

  const getInitials = (name) => {
    return name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'U';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-teal-50 p-4 md:p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-purple-900 mb-2">My Profile</h1>
        <p className="text-purple-700">Manage your personal and medical information</p>
      </div>

      <div className="max-w-4xl mx-auto">
        <div className="grid md:grid-cols-3 gap-6">
          {/* Profile Card */}
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
            <CardHeader className="text-center pb-4">
              <div className="flex justify-center mb-4">
                <Avatar className="w-24 h-24">
                  <AvatarFallback className="text-2xl font-bold bg-gradient-to-br from-purple-600 to-pink-500 text-white">
                    {getInitials(currentUser?.full_name)}
                  </AvatarFallback>
                </Avatar>
              </div>
              <CardTitle className="text-xl text-purple-900">{currentUser?.full_name}</CardTitle>
              <CardDescription>
                <Badge variant="outline" className={`${
                  currentUser?.user_type === 'healthcare_provider' 
                    ? 'bg-purple-100 text-purple-700 border-purple-200' 
                    : 'bg-teal-100 text-teal-700 border-teal-200'
                }`}>
                  {currentUser?.user_type === 'healthcare_provider' ? (
                    <Stethoscope className="w-3 h-3 mr-1" />
                  ) : (
                    <Heart className="w-3 h-3 mr-1" />
                  )}
                  {currentUser?.user_type === 'healthcare_provider' ? 'Healthcare Provider' : 'Patient'}
                </Badge>
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3 text-sm">
                <Mail className="w-4 h-4 text-gray-500" />
                <span className="text-gray-700">{currentUser?.email}</span>
              </div>
              {currentUser?.phone_number && (
                <div className="flex items-center gap-3 text-sm">
                  <Phone className="w-4 h-4 text-gray-500" />
                  <span className="text-gray-700">{currentUser.phone_number}</span>
                </div>
              )}
              {currentUser?.address && (
                <div className="flex items-center gap-3 text-sm">
                  <MapPin className="w-4 h-4 text-gray-500" />
                  <span className="text-gray-700">{currentUser.address}</span>
                </div>
              )}
              
              <Separator />
              
              <Button 
                onClick={generateQRData}
                variant="outline" 
                className="w-full"
              >
                <QrCode className="w-4 h-4 mr-2" />
                Show QR Code
              </Button>
              
              <Button 
                onClick={isEditing ? handleCancel : handleEdit}
                variant={isEditing ? "outline" : "default"}
                className={`w-full ${!isEditing && 'bg-purple-600 hover:bg-purple-700'}`}
              >
                {isEditing ? <X className="w-4 h-4 mr-2" /> : <Edit className="w-4 h-4 mr-2" />}
                {isEditing ? 'Cancel' : 'Edit Profile'}
              </Button>
              
              <Separator />

              <Button 
                onClick={handleLogout}
                variant="destructive"
                className="w-full"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </Button>
            </CardContent>
          </Card>

          {/* Details Card */}
          <div className="md:col-span-2">
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-purple-900">Personal Information</CardTitle>
                    <CardDescription>Your medical and contact details</CardDescription>
                  </div>
                  {isEditing && (
                    <Button 
                      onClick={handleSave}
                      disabled={isSaving}
                      className="bg-purple-600 hover:bg-purple-700"
                    >
                      <Save className="w-4 h-4 mr-2" />
                      {isSaving ? 'Saving...' : 'Save Changes'}
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  
                  {currentUser?.user_type === 'patient' && (
                    <div className="space-y-2">
                      <Label htmlFor="abha_id">ABHA ID</Label>
                      {isEditing ? (
                        <Input
                          id="abha_id"
                          value={editData.abha_id || ''}
                          onChange={(e) => setEditData({...editData, abha_id: e.target.value})}
                          placeholder="Enter ABHA ID"
                        />
                      ) : (
                        <div className="p-3 bg-purple-50 rounded-lg">
                          <span className="font-medium text-purple-900">
                            {currentUser?.abha_id || 'Not provided'}
                          </span>
                        </div>
                      )}
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="phone_number">Phone Number</Label>
                    {isEditing ? (
                      <Input
                        id="phone_number"
                        value={editData.phone_number || ''}
                        onChange={(e) => setEditData({...editData, phone_number: e.target.value})}
                        placeholder="+91 XXXXXXXXXX"
                      />
                    ) : (
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <span className="text-gray-800">
                          {currentUser?.phone_number || 'Not provided'}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="date_of_birth">Date of Birth</Label>
                    {isEditing ? (
                      <Input
                        id="date_of_birth"
                        type="date"
                        value={editData.date_of_birth || ''}
                        onChange={(e) => setEditData({...editData, date_of_birth: e.target.value})}
                      />
                    ) : (
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <span className="text-gray-800">
                          {currentUser?.date_of_birth ? new Date(currentUser.date_of_birth).toLocaleDateString() : 'Not provided'}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="gender">Gender</Label>
                    {isEditing ? (
                      <Select value={editData.gender || ''} onValueChange={(value) => setEditData({...editData, gender: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select gender" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="male">Male</SelectItem>
                          <SelectItem value="female">Female</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    ) : (
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <span className="text-gray-800 capitalize">
                          {currentUser?.gender || 'Not provided'}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="blood_group">Blood Group</Label>
                    {isEditing ? (
                      <Select value={editData.blood_group || ''} onValueChange={(value) => setEditData({...editData, blood_group: value})}>
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
                    ) : (
                      <div className="p-3 bg-red-50 rounded-lg">
                        <span className="text-red-800 font-medium">
                          {currentUser?.blood_group || 'Not provided'}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="emergency_contact">Emergency Contact</Label>
                    {isEditing ? (
                      <Input
                        id="emergency_contact"
                        value={editData.emergency_contact || ''}
                        onChange={(e) => setEditData({...editData, emergency_contact: e.target.value})}
                        placeholder="Emergency contact number"
                      />
                    ) : (
                      <div className="p-3 bg-orange-50 rounded-lg">
                        <span className="text-orange-800 font-medium">
                          {currentUser?.emergency_contact || 'Not provided'}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  {isEditing ? (
                    <Input
                      id="address"
                      value={editData.address || ''}
                      onChange={(e) => setEditData({...editData, address: e.target.value})}
                      placeholder="Complete address"
                    />
                  ) : (
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <span className="text-gray-800">
                        {currentUser?.address || 'Not provided'}
                      </span>
                    </div>
                  )}
                </div>

                {currentUser?.user_type === 'healthcare_provider' && (
                  <>
                    <Separator />
                    <h3 className="text-lg font-semibold text-purple-900 flex items-center gap-2">
                      <Building2 className="w-5 h-5" />
                      Professional Information
                    </h3>
                    
                    <div className="grid md:grid-cols-2 gap-4">
                       <div className="space-y-2">
                        <Label htmlFor="doctor_id">Doctor ID</Label>
                        {isEditing ? (
                          <Input
                            id="doctor_id"
                            value={editData.doctor_id || ''}
                            onChange={(e) => setEditData({...editData, doctor_id: e.target.value})}
                            placeholder="Your unique doctor ID"
                          />
                        ) : (
                          <div className="p-3 bg-gray-50 rounded-lg">
                            <span className="text-gray-800">
                              {currentUser?.doctor_id || 'Not provided'}
                            </span>
                          </div>
                        )}
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="license_number">License Number</Label>
                        {isEditing ? (
                          <Input
                            id="license_number"
                            value={editData.license_number || ''}
                            onChange={(e) => setEditData({...editData, license_number: e.target.value})}
                            placeholder="Medical license number"
                          />
                        ) : (
                          <div className="p-3 bg-gray-50 rounded-lg flex items-center gap-2">
                             <BadgeCheck className="w-4 h-4 text-green-600"/>
                            <span className="text-gray-800">
                              {currentUser?.license_number || 'Not provided'}
                            </span>
                          </div>
                        )}
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="specialization">Specialization</Label>
                        {isEditing ? (
                          <Input
                            id="specialization"
                            value={editData.specialization || ''}
                            onChange={(e) => setEditData({...editData, specialization: e.target.value})}
                            placeholder="Medical specialization"
                          />
                        ) : (
                          <div className="p-3 bg-purple-50 rounded-lg">
                            <span className="text-purple-800 font-medium">
                              {currentUser?.specialization || 'Not provided'}
                            </span>
                          </div>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="hospital_id">Hospital ID</Label>
                        {isEditing ? (
                          <Input
                            id="hospital_id"
                            value={editData.hospital_id || ''}
                            onChange={(e) => setEditData({...editData, hospital_id: e.target.value})}
                            placeholder="Hospital/Clinic ID"
                          />
                        ) : (
                          <div className="p-3 bg-gray-50 rounded-lg">
                            <span className="text-gray-800">
                              {currentUser?.hospital_id || 'Not provided'}
                            </span>
                          </div>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="hospital_name">Hospital Name</Label>
                        {isEditing ? (
                          <Input
                            id="hospital_name"
                            value={editData.hospital_name || ''}
                            onChange={(e) => setEditData({...editData, hospital_name: e.target.value})}
                            placeholder="Hospital/Clinic name"
                          />
                        ) : (
                          <div className="p-3 bg-gray-50 rounded-lg">
                            <span className="text-gray-800">
                              {currentUser?.hospital_name || 'Not provided'}
                            </span>
                          </div>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="hospital_address">Hospital Address</Label>
                        {isEditing ? (
                          <Input
                            id="hospital_address"
                            value={editData.hospital_address || ''}
                            onChange={(e) => setEditData({...editData, hospital_address: e.target.value})}
                            placeholder="Hospital/Clinic address"
                          />
                        ) : (
                          <div className="p-3 bg-gray-50 rounded-lg">
                            <span className="text-gray-800">
                              {currentUser?.hospital_address || 'Not provided'}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* QR Code Dialog */}
        <Dialog open={showQRDialog} onOpenChange={setShowQRDialog}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-purple-900">
                <QrCode className="w-5 h-5" />
                Your Profile QR Code
              </DialogTitle>
            </DialogHeader>
            <div className="flex flex-col items-center space-y-4 py-4">
              {qrCodeUrl ? (
                <img src={qrCodeUrl} alt="Your Profile QR Code" className="w-64 h-64 rounded-xl border-4 border-purple-200" />
              ) : (
                <div className="w-64 h-64 bg-gray-100 animate-pulse rounded-xl flex items-center justify-center">
                  <p className="text-gray-500">Generating QR...</p>
                </div>
              )}
              <p className="text-sm text-gray-600 text-center max-w-xs">
                Scan this code to quickly share your basic profile information with healthcare providers.
              </p>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}