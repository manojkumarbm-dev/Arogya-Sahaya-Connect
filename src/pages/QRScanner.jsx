import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Video, AlertTriangle } from 'lucide-react';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";

// A mock scanner component as third-party libraries aren't available
const MockQrScanner = ({ onScan }) => {
  const handleMockScan = () => {
    // Updated mock data to include doctor-specific IDs and demonstrate conditional rendering
    // This mock data now represents a doctor's profile.
    // For patient profiles, abha_id would be present, and doctor_id/license_number would typically be absent.
    const mockData = {
      name: "Dr. Anya Sharma",
      // abha_id: "11-1111-1111-1111", // Example patient ID - commented out for doctor mock
      doctor_id: "DOC-987654", // Doctor-specific ID
      license_number: "LIC-12345-MH", // Doctor's license number
      blood_group: "A-",
      type: "doctor", // Changed type to 'doctor'
      emergency_contact: "+919988776655"
    };
    onScan(JSON.stringify(mockData));
  };

  return (
    <div className="relative w-full aspect-square bg-gray-900 rounded-lg overflow-hidden flex flex-col items-center justify-center text-white p-4">
      <Video className="w-16 h-16 text-gray-500 mb-4" />
      <p className="text-center font-semibold">QR Scanner Unavailable</p>
      <p className="text-center text-sm text-gray-400 mb-4">Camera-based QR scanning requires a specific library. This is a simulation.</p>
      <Button onClick={handleMockScan}>Simulate Scan</Button>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-3/4">
        <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-primary-purple rounded-tl-lg" />
        <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-primary-purple rounded-tr-lg" />
        <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-primary-purple rounded-bl-lg" />
        <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-primary-purple rounded-br-lg" />
      </div>
    </div>
  );
};

export default function QRScannerPage() {
  const [scanResult, setScanResult] = useState(null);
  const [error, setError] = useState(null);

  const handleScan = (data) => {
    if (data) {
      try {
        const parsedData = JSON.parse(data);
        setScanResult(parsedData);
        setError(null);
      } catch (e) {
        setError('Invalid QR code format. Please scan a valid Arogya Sahaya profile QR code.');
        setScanResult(null);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-teal-50 p-4 md:p-8">
      <div className="max-w-xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-purple-900 mb-2">QR Code Scanner</h1>
          <p className="text-purple-700">Quickly access patient information by scanning their profile QR code.</p>
        </div>

        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
          <CardContent className="p-6">
            <MockQrScanner onScan={handleScan} />
          </CardContent>
        </Card>

        {error && (
          <Alert variant="destructive" className="mt-6">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {scanResult && (
          <Card className="mt-6 bg-white/80 backdrop-blur-sm border-0 shadow-xl">
            <CardHeader>
              <CardTitle className="text-purple-900">Scanned Profile Data</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p><span className="font-semibold">Name:</span> {scanResult.name}</p>
              {scanResult.abha_id && <p><span className="font-semibold">ABHA ID:</span> {scanResult.abha_id}</p>}
              {scanResult.doctor_id && <p><span className="font-semibold">Doctor ID:</span> {scanResult.doctor_id}</p>}
              {scanResult.license_number && <p><span className="font-semibold">License No:</span> {scanResult.license_number}</p>}
              <p><span className="font-semibold">Blood Group:</span> <Badge variant="destructive">{scanResult.blood_group}</Badge></p>
              <p><span className="font-semibold">Profile Type:</span> <Badge className="capitalize">{scanResult.type}</Badge></p>
              {scanResult.emergency_contact && <p><span className="font-semibold">Emergency:</span> {scanResult.emergency_contact}</p>}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}