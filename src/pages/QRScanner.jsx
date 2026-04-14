import React, { useState, useRef, useEffect } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Video, AlertTriangle, Camera, CameraOff } from 'lucide-react';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";

// Real QR Scanner component using html5-qrcode library
const QrScanner = ({ onScan, onError }) => {
  const scannerRef = useRef(null);
  const [isScanning, setIsScanning] = useState(false);
  const [hasCamera, setHasCamera] = useState(false);
  const [scanner, setScanner] = useState(null);

  useEffect(() => {
    // Check if camera is available
    navigator.mediaDevices.getUserMedia({ video: true })
      .then(() => setHasCamera(true))
      .catch(() => setHasCamera(false));

    return () => {
      // Cleanup scanner on unmount
      if (scanner) {
        scanner.stop().then(() => scanner.clear()).catch(console.error);
      }
    };
  }, []);

  const startScanning = () => {
    if (!hasCamera) {
      onError('Camera access is not available. Please check your camera permissions.');
      return;
    }

    if (scanner) {
      scanner.stop().then(() => scanner.clear()).catch(console.error);
    }

    const html5QrCode = new Html5Qrcode("qr-reader");
    setScanner(html5QrCode);
    setIsScanning(true);

    html5QrCode.start(
      { facingMode: "environment" }, // Use back camera on mobile
      {
        fps: 10,
        qrbox: { width: 250, height: 250 },
        aspectRatio: 1.0,
      },
      (decodedText) => {
        // Success callback - keep scanning for multiple codes
        onScan(decodedText);
      },
      (errorMessage) => {
        // Error callback - ignore most scan errors as they're expected
        console.log('QR scan error:', errorMessage);
      }
    ).catch((err) => {
      console.error('Failed to start scanner:', err);
      onError('Failed to start camera. Please try again.');
      setIsScanning(false);
      setScanner(null);
    });
  };

  const stopScanning = () => {
    if (scanner) {
      scanner.stop().then(() => {
        scanner.clear();
        setScanner(null);
      }).catch(console.error);
    }
    setIsScanning(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-center gap-2">
        {!isScanning ? (
          <Button
            onClick={startScanning}
            disabled={!hasCamera}
            className="bg-green-600 hover:bg-green-700"
          >
            <Camera className="w-4 h-4 mr-2" />
            Start Scanning
          </Button>
        ) : (
          <Button
            onClick={stopScanning}
            variant="destructive"
          >
            <CameraOff className="w-4 h-4 mr-2" />
            Stop Scanning
          </Button>
        )}
      </div>

      <div className="relative w-full aspect-square bg-gray-900 rounded-lg overflow-hidden">
        <div id="qr-reader" ref={scannerRef} className="w-full h-full"></div>

        {!isScanning && (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-4">
            <Video className="w-16 h-16 text-gray-500 mb-4" />
            <p className="text-center font-semibold mb-2">
              {hasCamera ? 'Ready to Scan' : 'Camera Not Available'}
            </p>
            <p className="text-center text-sm text-gray-400">
              {hasCamera
                ? 'Click "Start Scanning" to begin QR code detection'
                : 'Please check your camera permissions and try again'
              }
            </p>
          </div>
        )}

        {/* Scanner frame overlay */}
        {isScanning && (
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-3/4 pointer-events-none">
            <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-green-400 rounded-tl-lg" />
            <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-green-400 rounded-tr-lg" />
            <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-green-400 rounded-bl-lg" />
            <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-green-400 rounded-br-lg" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 border-2 border-green-400 rounded-full opacity-50"></div>
          </div>
        )}
      </div>

      {isScanning && (
        <div className="text-center">
          <p className="text-sm text-gray-600">Position QR code within the frame to scan</p>
        </div>
      )}
    </div>
  );
};

export default function QRScannerPage() {
  const [scanResult, setScanResult] = useState(null);
  const [error, setError] = useState(null);
  const [isScanning, setIsScanning] = useState(false);

  const handleScan = (data) => {
    if (data) {
      try {
        const parsedData = JSON.parse(data);
        setScanResult(parsedData);
        setError(null);
        setIsScanning(false);
      } catch (e) {
        setError('Invalid QR code format. Please scan a valid Arogya Sahaya profile QR code.');
        setScanResult(null);
        setIsScanning(false);
      }
    }
  };

  const handleScanError = (errorMessage) => {
    setError(errorMessage);
    setIsScanning(false);
  };

  const handleScanStart = () => {
    setIsScanning(true);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-teal-50 p-4 md:p-8">
      <div className="max-w-xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-purple-900 mb-2">QR Code Scanner</h1>
          <p className="text-purple-700">Quickly access patient information by scanning their profile QR code.</p>
        </div>

        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
          <CardHeader>
            <CardTitle className="text-purple-900 flex items-center gap-2">
              <Video className="w-5 h-5" />
              QR Scanner
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <QrScanner
              onScan={handleScan}
              onError={handleScanError}
            />
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
              <CardTitle className="text-purple-900 flex items-center gap-2">
                <Video className="w-5 h-5" />
                Scanned Profile Data
              </CardTitle>
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