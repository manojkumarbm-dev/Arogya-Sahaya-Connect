
import React, { useState, useEffect } from "react";
import { User } from "@/entities/User";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Heart, Shield, Users, FileText, Stethoscope, UserPlus, CheckCircle, AlertTriangle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";

export default function AuthPage() {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showSetup, setShowSetup] = useState(false);
  const [authMethod, setAuthMethod] = useState('gmail'); // 'gmail', 'aadhaar', 'mobile'
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState('');
  const [setupData, setSetupData] = useState({
    user_type: '',
    abha_id: '',
    aadhaar_number: '',
    phone_number: '',
    date_of_birth: '',
    gender: '',
    blood_group: '',
    address: '',
    doctor_id: '',
    license_number: '',
    specialization: '',
    hospital_id: '',
    hospital_name: '',
    hospital_address: '',
    preferred_language: 'english',
    emergency_contact: '',
    is_verified: false
  });

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const user = await User.me();
        if (user.user_type) {
          if (user.user_type === 'healthcare_provider' && !user.is_verified) {
            setCurrentUser(user);
            setShowSetup(true);
            setVerificationStatus('pending');
          } else {
            navigate(createPageUrl("Dashboard"));
          }
        } else {
          setCurrentUser(user);
          setShowSetup(true);
        }
      } catch (error) {
        // User not authenticated - this is expected after logout
        setCurrentUser(null);
        setShowSetup(false);
      }
      setIsLoading(false);
    };

    checkAuth();
  }, [navigate]); // Added navigate to dependency array

  const handleLogin = async () => {
    if (authMethod === 'gmail') {
      await User.login();
    } else {
      // For demo purposes, simulate other auth methods
      alert(`${authMethod} authentication will be implemented soon. Using Gmail for now.`);
      await User.login();
    }
  };

  const handleLicenseVerification = async () => {
    if (!setupData.license_number || !setupData.doctor_id) {
      alert("Please enter both Doctor ID and License Number");
      return;
    }
    
    setIsVerifying(true);
    // Simulate license verification process
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // For demo, accept specific license numbers as valid
    const validLicenses = ['MH-DOC-2023-001', 'DL-MED-2024-567', 'KA-PHY-2022-890'];
    
    if (validLicenses.includes(setupData.license_number)) {
      setVerificationStatus('verified');
      setSetupData({...setupData, is_verified: true});
    } else {
      setVerificationStatus('failed');
    }
    setIsVerifying(false);
  };

  const handleSetupSubmit = async (e) => {
    e.preventDefault();
    
    if (setupData.user_type === 'healthcare_provider' && !setupData.is_verified) {
      alert("Please verify your license before completing setup");
      return;
    }
    
    try {
      await User.updateMyUserData(setupData);
      navigate(createPageUrl("Dashboard"));
    } catch (error) {
      console.error("Setup failed:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center">
        <div className="animate-pulse flex items-center gap-3">
          <Heart className="w-8 h-8 text-blue-600" />
          <span className="text-xl font-semibold text-blue-900">Loading...</span>
        </div>
      </div>
    );
  }

  if (showSetup) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 p-4 md:p-8">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
              <Heart className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-blue-900 mb-2">Welcome to Arogya Sahaya Connect</h1>
            <p className="text-blue-700">Complete your profile setup to get started</p>
          </div>

          <Card className="shadow-2xl border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader className="text-center border-b border-blue-100">
              <CardTitle className="text-xl text-blue-900">Profile Setup</CardTitle>
              <CardDescription>Please provide your details to set up your healthcare profile</CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <form onSubmit={handleSetupSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="user_type">Account Type</Label>
                    <Select value={setupData.user_type} onValueChange={(value) => setSetupData({...setupData, user_type: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select account type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="patient">
                          <div className="flex items-center gap-2">
                            <UserPlus className="w-4 h-4" />
                            Patient
                          </div>
                        </SelectItem>
                        <SelectItem value="healthcare_provider">
                          <div className="flex items-center gap-2">
                            <Stethoscope className="w-4 h-4" />
                            Healthcare Provider
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  {setupData.user_type === 'patient' && (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="abha_id">ABHA ID (Optional)</Label>
                        <Input
                          id="abha_id"
                          value={setupData.abha_id}
                          onChange={(e) => setSetupData({...setupData, abha_id: e.target.value})}
                          placeholder="Enter your ABHA ID"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="aadhaar_number">Aadhaar Number (Alternative ID)</Label>
                        <Input
                          id="aadhaar_number"
                          value={setupData.aadhaar_number}
                          onChange={(e) => setSetupData({...setupData, aadhaar_number: e.target.value})}
                          placeholder="Enter Aadhaar Number"
                        />
                      </div>
                    </>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="phone_number">Phone Number *</Label>
                    <Input
                      id="phone_number"
                      value={setupData.phone_number}
                      onChange={(e) => setSetupData({...setupData, phone_number: e.target.value})}
                      placeholder="+91 XXXXXXXXXX"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="emergency_contact">Emergency Contact *</Label>
                    <Input
                      id="emergency_contact"
                      value={setupData.emergency_contact}
                      onChange={(e) => setSetupData({...setupData, emergency_contact: e.target.value})}
                      placeholder="Emergency contact number"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="date_of_birth">Date of Birth *</Label>
                    <Input
                      id="date_of_birth"
                      type="date"
                      value={setupData.date_of_birth}
                      onChange={(e) => setSetupData({...setupData, date_of_birth: e.target.value})}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="gender">Gender *</Label>
                    <Select value={setupData.gender} onValueChange={(value) => setSetupData({...setupData, gender: value})} required>
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
                    <Label htmlFor="blood_group">Blood Group *</Label>
                    <Select value={setupData.blood_group} onValueChange={(value) => setSetupData({...setupData, blood_group: value})} required>
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
                  <Label htmlFor="address">Address *</Label>
                  <Input
                    id="address"
                    value={setupData.address}
                    onChange={(e) => setSetupData({...setupData, address: e.target.value})}
                    placeholder="Enter your complete address"
                    required
                  />
                </div>

                {setupData.user_type === 'healthcare_provider' && (
                  <>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="doctor_id">Doctor ID *</Label>
                        <Input
                          id="doctor_id"
                          value={setupData.doctor_id}
                          onChange={(e) => setSetupData({...setupData, doctor_id: e.target.value})}
                          placeholder="Your unique doctor ID"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="license_number">Medical License Number *</Label>
                        <Input
                          id="license_number"
                          value={setupData.license_number}
                          onChange={(e) => setSetupData({...setupData, license_number: e.target.value})}
                          placeholder="e.g., MH-DOC-2023-001"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="specialization">Specialization *</Label>
                        <Input
                          id="specialization"
                          value={setupData.specialization}
                          onChange={(e) => setSetupData({...setupData, specialization: e.target.value})}
                          placeholder="e.g., Cardiology, Pediatrics"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="hospital_id">Hospital ID</Label>
                        <Input
                          id="hospital_id"
                          value={setupData.hospital_id}
                          onChange={(e) => setSetupData({...setupData, hospital_id: e.target.value})}
                          placeholder="Hospital/Clinic ID"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="hospital_name">Hospital Name *</Label>
                        <Input
                          id="hospital_name"
                          value={setupData.hospital_name}
                          onChange={(e) => setSetupData({...setupData, hospital_name: e.target.value})}
                          placeholder="Hospital/Clinic name"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="hospital_address">Hospital Address *</Label>
                        <Input
                          id="hospital_address"
                          value={setupData.hospital_address}
                          onChange={(e) => setSetupData({...setupData, hospital_address: e.target.value})}
                          placeholder="Hospital/Clinic address"
                          required
                        />
                      </div>
                    </div>

                    <Card className="bg-yellow-50 border border-yellow-200">
                      <CardHeader>
                        <CardTitle className="text-sm flex items-center gap-2">
                          <Shield className="w-4 h-4" />
                          License Verification Required
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        {verificationStatus === '' && (
                          <div className="space-y-2">
                            <p className="text-sm text-gray-600">Please verify your medical license to complete registration.</p>
                            <Button 
                              type="button"
                              onClick={handleLicenseVerification}
                              disabled={isVerifying || !setupData.license_number || !setupData.doctor_id}
                              className="w-full"
                            >
                              {isVerifying ? 'Verifying...' : 'Verify License'}
                            </Button>
                          </div>
                        )}
                        
                        {verificationStatus === 'verified' && (
                          <Alert>
                            <CheckCircle className="h-4 w-4" />
                            <AlertDescription>
                              License verified successfully! You can now complete your registration.
                            </AlertDescription>
                          </Alert>
                        )}
                        
                        {verificationStatus === 'failed' && (
                          <Alert variant="destructive">
                            <AlertTriangle className="h-4 w-4" />
                            <AlertDescription>
                              License verification failed. Please check your details and try again.
                              <br />Demo: Try "MH-DOC-2023-001", "DL-MED-2024-567", or "KA-PHY-2022-890"
                            </AlertDescription>
                          </Alert>
                        )}
                      </CardContent>
                    </Card>
                  </>
                )}

                <div className="space-y-2">
                  <Label htmlFor="preferred_language">Preferred Language</Label>
                  <Select value={setupData.preferred_language} onValueChange={(value) => setSetupData({...setupData, preferred_language: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select language" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="english">English</SelectItem>
                      <SelectItem value="hindi">हिन्दी (Hindi)</SelectItem>
                      <SelectItem value="bengali">বাংলা (Bengali)</SelectItem>
                      <SelectItem value="telugu">తెలుగు (Telugu)</SelectItem>
                      <SelectItem value="tamil">தமிழ் (Tamil)</SelectItem>
                      <SelectItem value="gujarati">ગુજરાતી (Gujarati)</SelectItem>
                      <SelectItem value="marathi">मराठी (Marathi)</SelectItem>
                      <SelectItem value="kannada">ಕನ್ನಡ (Kannada)</SelectItem>
                      <SelectItem value="malayalam">മലയാളം (Malayalam)</SelectItem>
                      <SelectItem value="punjabi">ਪੰਜਾਬੀ (Punjabi)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button 
                  type="submit" 
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3 rounded-xl shadow-lg transition-all duration-200"
                  disabled={setupData.user_type === 'healthcare_provider' && !setupData.is_verified}
                >
                  Complete Setup
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <div className="container mx-auto px-4 py-8 md:py-16">
        <div className="text-center mb-12">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-blue-700 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl">
            <Heart className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-blue-900 mb-4 tracking-tight">
            Arogya Sahaya Connect
          </h1>
          <p className="text-xl text-blue-700 mb-8 max-w-2xl mx-auto leading-relaxed">
            Your comprehensive healthcare management platform for patients and healthcare providers
          </p>
          
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 px-4 py-2">
              <Shield className="w-4 h-4 mr-2" />
              Secure & Private
            </Badge>
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 px-4 py-2">
              <FileText className="w-4 h-4 mr-2" />
              Digital Records
            </Badge>
            <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200 px-4 py-2">
              <Users className="w-4 h-4 mr-2" />
              Family Management
            </Badge>
          </div>
        </div>

        <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8 mb-16">
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-2xl hover:shadow-3xl transition-all duration-300">
            <CardHeader className="text-center p-8">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <UserPlus className="w-6 h-6 text-blue-600" />
              </div>
              <CardTitle className="text-2xl text-blue-900">For Patients</CardTitle>
              <CardDescription className="text-blue-700">
                Manage your health records, family members, and stay on top of your healthcare journey
              </CardDescription>
            </CardHeader>
            <CardContent className="p-8 pt-0">
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-center gap-3">
                  <FileText className="w-4 h-4 text-green-600" />
                  Digital medical records
                </li>
                <li className="flex items-center gap-3">
                  <Shield className="w-4 h-4 text-green-600" />
                  Vaccination tracking
                </li>
                <li className="flex items-center gap-3">
                  <Users className="w-4 h-4 text-green-600" />
                  Family health management
                </li>
                <li className="flex items-center gap-3">
                  <Heart className="w-4 h-4 text-green-600" />
                  Appointment reminders
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-2xl hover:shadow-3xl transition-all duration-300">
            <CardHeader className="text-center p-8">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Stethoscope className="w-6 h-6 text-green-600" />
              </div>
              <CardTitle className="text-2xl text-blue-900">For Healthcare Providers</CardTitle>
              <CardDescription className="text-blue-700">
                Access patient records securely and provide better care with digital tools
              </CardDescription>
            </CardHeader>
            <CardContent className="p-8 pt-0">
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-center gap-3">
                  <FileText className="w-4 h-4 text-blue-600" />
                  Patient record access
                </li>
                <li className="flex items-center gap-3">
                  <Shield className="w-4 h-4 text-blue-600" />
                  Secure data handling
                </li>
                <li className="flex items-center gap-3">
                  <Heart className="w-4 h-4 text-blue-600" />
                  Better patient care
                </li>
                <li className="flex items-center gap-3">
                  <Users className="w-4 h-4 text-blue-600" />
                  Professional network
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>

        <div className="max-w-md mx-auto mb-8">
          <Card className="bg-white/90 backdrop-blur-sm shadow-lg">
            <CardHeader>
              <CardTitle className="text-center text-gray-800">Choose Login Method</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button 
                onClick={() => setAuthMethod('gmail')}
                variant={authMethod === 'gmail' ? 'default' : 'outline'}
                className="w-full"
              >
                Gmail Account
              </Button>
              <Button 
                onClick={() => setAuthMethod('aadhaar')}
                variant={authMethod === 'aadhaar' ? 'default' : 'outline'}
                className="w-full"
              >
                Aadhaar Authentication
              </Button>
              <Button 
                onClick={() => setAuthMethod('mobile')}
                variant={authMethod === 'mobile' ? 'default' : 'outline'}
                className="w-full"
              >
                Mobile Number OTP
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="text-center">
          <Button 
            onClick={handleLogin}
            size="lg"
            className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-8 py-4 rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 text-lg font-semibold"
          >
            {authMethod === 'gmail' ? 'Sign In with Google' : `Login with ${authMethod}`}
          </Button>
          <p className="text-sm text-blue-600 mt-4">
            Secure authentication {authMethod === 'gmail' ? 'powered by Google' : `via ${authMethod}`}
          </p>
        </div>
      </div>
    </div>
  );
}
