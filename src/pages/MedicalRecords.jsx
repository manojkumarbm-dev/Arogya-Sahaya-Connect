import React, { useState, useEffect } from "react";
import { User } from "@/entities/User";
import { MedicalRecord } from "@/entities/MedicalRecord";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { UploadFile } from "@/integrations/Core";
import { 
  FileText, 
  Search,
  Upload,
  Calendar,
  Stethoscope,
  Download,
  AlertCircle,
  Shield,
  Filter,
  FilePlus,
  HeartPulse,
  Pill
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const recordTypeIcons = {
  consultation: <Stethoscope className="w-4 h-4 text-blue-500" />,
  test_report: <FileText className="w-4 h-4 text-green-500" />,
  prescription: <Pill className="w-4 h-4 text-red-500" />,
  discharge_summary: <FilePlus className="w-4 h-4 text-indigo-500" />,
  vaccination: <Shield className="w-4 h-4 text-yellow-500" />,
  other: <FileText className="w-4 h-4 text-gray-500" />,
};

const RecordDetailDialog = ({ record, isOpen, onClose }) => {
  if (!record) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl bg-white dark:bg-gray-900">
        <DialogHeader>
          <DialogTitle className="text-purple-900 dark:text-purple-300">{record.title}</DialogTitle>
          <DialogDescription>
            Record from {format(new Date(record.record_date), "MMMM d, yyyy")}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4 max-h-[70vh] overflow-y-auto pr-2">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-gray-700 dark:text-gray-300">Type:</span>
            <Badge variant="outline" className="capitalize dark:border-gray-600">
              {recordTypeIcons[record.record_type]}
              <span className="ml-2">{record.record_type.replace('_', ' ')}</span>
            </Badge>
          </div>
          {record.patient_abha_id && (
             <p><span className="font-semibold text-gray-700 dark:text-gray-300">Patient ABHA ID:</span> <span className="text-gray-600 dark:text-gray-400">{record.patient_abha_id}</span></p>
          )}
          {record.diagnosis && (
            <div>
              <h3 className="font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2 mb-1"><HeartPulse/> Diagnosis</h3>
              <p className="text-gray-600 dark:text-gray-400 p-3 bg-purple-50 dark:bg-gray-800 rounded-md">{record.diagnosis}</p>
            </div>
          )}
          {record.description && (
             <div>
              <h3 className="font-semibold text-gray-700 dark:text-gray-300 mb-1">Description</h3>
              <p className="text-gray-600 dark:text-gray-400 p-3 bg-gray-50 dark:bg-gray-800 rounded-md">{record.description}</p>
            </div>
          )}
          {record.medications && record.medications.length > 0 && (
            <div>
              <h3 className="font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2 mb-1"><Pill/> Medications</h3>
              <div className="flex flex-wrap gap-2">
                {record.medications.map((med, index) => (
                  <Badge key={index} variant="secondary" className="dark:bg-gray-700 dark:text-gray-200">{med}</Badge>
                ))}
              </div>
            </div>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Close</Button>
          {record.file_url && (
            <a href={record.file_url} target="_blank" rel="noopener noreferrer">
              <Button className="bg-primary-purple hover:bg-primary-light-purple dark:text-white">
                <Download className="w-4 h-4 mr-2" /> View Document
              </Button>
            </a>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default function MedicalRecordsPage() {
  const [currentUser, setCurrentUser] = useState(null);
  const [records, setRecords] = useState([]);
  const [filteredRecords, setFilteredRecords] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [recordTypeFilter, setRecordTypeFilter] = useState("all");
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  
  useEffect(() => {
    loadPageData();
  }, []);

  useEffect(() => {
    let filteredData = records;

    const lowercasedFilter = searchTerm.toLowerCase();
    if (searchTerm) {
      filteredData = filteredData.filter(item =>
        item.title.toLowerCase().includes(lowercasedFilter) ||
        item.diagnosis?.toLowerCase().includes(lowercasedFilter) ||
        item.patient_abha_id?.toLowerCase().includes(lowercasedFilter)
      );
    }

    if (recordTypeFilter !== "all") {
      filteredData = filteredData.filter(item => item.record_type === recordTypeFilter);
    }
    
    setFilteredRecords(filteredData);
  }, [searchTerm, recordTypeFilter, records]);

  const loadPageData = async () => {
    setIsLoading(true);
    try {
      const user = await User.me();
      setCurrentUser(user);
      
      let fetchedRecords;
      if (user.user_type === 'patient') {
        fetchedRecords = await MedicalRecord.filter({ patient_abha_id: user.abha_id }, "-record_date");
      } else {
        fetchedRecords = await MedicalRecord.list("-record_date");
      }
      
      setRecords(fetchedRecords);
    } catch (error) {
      console.error("Error loading data:", error);
    }
    setIsLoading(false);
  };
  
  const UploadDialog = () => {
    const [newRecord, setNewRecord] = useState({
      title: "",
      record_type: "consultation",
      record_date: new Date().toISOString().split('T')[0],
      description: "",
      file: null,
      patient_abha_id: "",
      diagnosis: "",
      medications: ""
    });
    const [isUploading, setIsUploading] = useState(false);

    const handleFileChange = (e) => {
      if (e.target.files.length > 0) {
        setNewRecord({ ...newRecord, file: e.target.files[0] });
      }
    };

    const handleUpload = async () => {
      if (!newRecord.title || !newRecord.file || !newRecord.patient_abha_id) {
        alert("Please provide a title, patient ABHA ID, and select a file.");
        return;
      }
      setIsUploading(true);
      try {
        const { file_url } = await UploadFile({ file: newRecord.file });
        
        await MedicalRecord.create({
          patient_abha_id: newRecord.patient_abha_id,
          doctor_id: currentUser.id,
          title: newRecord.title,
          record_type: newRecord.record_type,
          record_date: newRecord.record_date,
          description: newRecord.description,
          file_url: file_url,
          diagnosis: newRecord.diagnosis,
          medications: newRecord.medications ? newRecord.medications.split(',').map(m => m.trim()) : []
        });

        setShowUploadDialog(false);
        loadPageData();
      } catch (error) {
        console.error("Upload failed:", error);
        alert("Upload failed. Please try again.");
      }
      setIsUploading(false);
    };

    return (
      <Dialog open={showUploadDialog} onOpenChange={setShowUploadDialog}>
        <DialogContent className="dark:bg-gray-900">
          <DialogHeader>
            <DialogTitle className="dark:text-white">Upload New Medical Record</DialogTitle>
            <DialogDescription>Add a new document to a patient's health records.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4 max-h-[70vh] overflow-y-auto pr-2">
            <div className="space-y-2">
              <Label htmlFor="patient_abha_id" className="dark:text-gray-300">Patient ABHA ID *</Label>
              <Input id="patient_abha_id" value={newRecord.patient_abha_id} onChange={(e) => setNewRecord({...newRecord, patient_abha_id: e.target.value})} placeholder="Patient's ABHA ID" className="dark:bg-gray-800 dark:border-gray-700 dark:text-white" />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="title" className="dark:text-gray-300">Record Title *</Label>
              <Input id="title" value={newRecord.title} onChange={(e) => setNewRecord({...newRecord, title: e.target.value})} placeholder="e.g., Annual Check-up Report" className="dark:bg-gray-800 dark:border-gray-700 dark:text-white"/>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="record_type" className="dark:text-gray-300">Record Type</Label>
                <Select value={newRecord.record_type} onValueChange={(value) => setNewRecord({...newRecord, record_type: value})}>
                  <SelectTrigger className="dark:bg-gray-800 dark:border-gray-700 dark:text-white">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent className="dark:bg-gray-800 dark:border-gray-700 dark:text-white">
                    {Object.keys(recordTypeIcons).map(type => (
                       <SelectItem key={type} value={type} className="capitalize dark:focus:bg-gray-700">{type.replace('_', ' ')}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="record_date" className="dark:text-gray-300">Record Date</Label>
                <Input id="record_date" type="date" value={newRecord.record_date} onChange={(e) => setNewRecord({...newRecord, record_date: e.target.value})} className="dark:bg-gray-800 dark:border-gray-700 dark:text-white" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="diagnosis" className="dark:text-gray-300">Diagnosis (Optional)</Label>
              <Input id="diagnosis" value={newRecord.diagnosis} onChange={(e) => setNewRecord({...newRecord, diagnosis: e.target.value})} placeholder="e.g., Type 2 Diabetes" className="dark:bg-gray-800 dark:border-gray-700 dark:text-white"/>
            </div>
             <div className="space-y-2">
              <Label htmlFor="medications" className="dark:text-gray-300">Medications (comma-separated)</Label>
              <Input id="medications" value={newRecord.medications} onChange={(e) => setNewRecord({...newRecord, medications: e.target.value})} placeholder="e.g., Metformin, Atorvastatin" className="dark:bg-gray-800 dark:border-gray-700 dark:text-white"/>
            </div>
            <div className="space-y-2">
              <Label htmlFor="description" className="dark:text-gray-300">Description (Optional)</Label>
              <Textarea id="description" value={newRecord.description} onChange={(e) => setNewRecord({...newRecord, description: e.target.value})} placeholder="Brief note about the record" className="dark:bg-gray-800 dark:border-gray-700 dark:text-white"/>
            </div>
            <div className="space-y-2">
              <Label htmlFor="file" className="dark:text-gray-300">File *</Label>
              <Input id="file" type="file" onChange={handleFileChange} className="dark:bg-gray-800 dark:border-gray-700 file:text-gray-400 file:dark:text-gray-300"/>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowUploadDialog(false)} className="dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700">Cancel</Button>
            <Button onClick={handleUpload} disabled={isUploading} className="bg-primary-purple hover:bg-primary-light-purple dark:text-white">
              {isUploading ? "Uploading..." : "Upload"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  };

  const canUpload = currentUser?.user_type === 'healthcare_provider' || currentUser?.role === 'admin';

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-teal-50 dark:from-gray-900 dark:to-teal-900/40 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-purple-900 dark:text-purple-200 mb-2">Medical Records</h1>
            <p className="text-purple-700 dark:text-purple-400">
              {currentUser?.user_type === 'patient' ? "Your complete digital health history." : "Manage patient records securely."}
            </p>
          </div>
          {canUpload && (
            <Button onClick={() => setShowUploadDialog(true)} className="bg-primary-purple hover:bg-primary-light-purple dark:text-white">
              <Upload className="w-4 h-4 mr-2" /> Upload Record
            </Button>
          )}
        </div>
        
        <Card className="mb-6 bg-white/50 dark:bg-gray-800/50 border-0 shadow-md">
          <CardContent className="p-4 flex flex-col md:flex-row gap-4">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                placeholder={currentUser?.user_type === 'patient' ? "Search records..." : "Search by title, diagnosis, or patient ABHA..."}
                className="pl-10 dark:bg-gray-900/50 dark:border-gray-700 dark:text-white"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-gray-400"/>
              <Select value={recordTypeFilter} onValueChange={setRecordTypeFilter}>
                <SelectTrigger className="w-full md:w-[180px] dark:bg-gray-900/50 dark:border-gray-700 dark:text-white">
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent className="dark:bg-gray-800 dark:border-gray-700 dark:text-white">
                  <SelectItem value="all" className="dark:focus:bg-gray-700">All Types</SelectItem>
                   {Object.keys(recordTypeIcons).map(type => (
                       <SelectItem key={type} value={type} className="capitalize dark:focus:bg-gray-700">{type.replace('_', ' ')}</SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
        
        {isLoading ? (
          <p className="text-center text-gray-600 dark:text-gray-400">Loading records...</p>
        ) : filteredRecords.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRecords.map(record => (
              <Card 
                key={record.id} 
                className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl dark:hover:shadow-purple-900/20 transition-all duration-300 cursor-pointer"
                onClick={() => setSelectedRecord(record)}
              >
                <CardHeader>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-grow min-w-0">
                      <CardTitle className="text-purple-900 dark:text-purple-300 leading-tight truncate">{record.title}</CardTitle>
                      <Badge variant="outline" className="mt-2 capitalize dark:border-gray-600 text-gray-600 dark:text-gray-300">
                        {recordTypeIcons[record.record_type]}
                        <span className="ml-2">{record.record_type.replace('_', ' ')}</span>
                      </Badge>
                    </div>
                    <div className="flex-shrink-0">
                      <Download className="w-5 h-5 text-gray-400 dark:text-gray-500" />
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {currentUser?.user_type === 'healthcare_provider' && record.patient_abha_id && (
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-2 font-mono">
                      Patient: {record.patient_abha_id}
                    </p>
                  )}
                  {record.diagnosis && (
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2 truncate"><span className="font-semibold">Diagnosis:</span> {record.diagnosis}</p>
                  )}
                  <div className="flex items-center text-sm text-gray-500 dark:text-gray-500 mt-4">
                    <Calendar className="w-4 h-4 mr-2" />
                    <span>{format(new Date(record.record_date), "MMMM d, yyyy")}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white/50 dark:bg-gray-800/30 rounded-2xl">
            <AlertCircle className="w-16 h-16 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300">No Records Found</h3>
            <p className="text-gray-500 dark:text-gray-400 mt-2">
              {canUpload ? "Try adjusting your search or upload your first record." : "No medical records available."}
            </p>
          </div>
        )}
      </div>
      {canUpload && <UploadDialog />}
      <RecordDetailDialog record={selectedRecord} isOpen={!!selectedRecord} onClose={() => setSelectedRecord(null)} />
    </div>
  );
}