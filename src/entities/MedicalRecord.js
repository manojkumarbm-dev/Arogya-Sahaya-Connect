import medicalRecordSchema from '@/../entities/MedicalRecord.json';

const demoMedicalRecords = [
  {
    id: 'mr-001',
    patient_abha_id: 'ABHA1234567890',
    doctor_id: 'DOC001',
    record_type: 'consultation',
    title: 'General Health Checkup',
    description: 'Routine consultation for annual health checkup and preventive care assessment.',
    file_url: 'https://via.placeholder.com/150',
    record_date: '2024-03-15',
    diagnosis: 'Generally healthy with normal vital signs',
    medications: ['Multivitamin tablet daily'],
    is_sensitive: false
  },
  {
    id: 'mr-002',
    patient_abha_id: 'ABHA1234567890',
    doctor_id: 'DOC002',
    record_type: 'test_report',
    title: 'Blood Test Report',
    description: 'Complete blood count and biochemistry panel performed on 2024-03-10',
    file_url: 'https://via.placeholder.com/150',
    record_date: '2024-03-10',
    diagnosis: 'All parameters within normal range',
    medications: [],
    is_sensitive: false
  },
  {
    id: 'mr-003',
    patient_abha_id: 'ABHA1234567890',
    doctor_id: 'DOC001',
    record_type: 'prescription',
    title: 'Allergy Medication Prescription',
    description: 'Prescribed for seasonal allergies and sinus congestion',
    file_url: 'https://via.placeholder.com/150',
    record_date: '2024-02-28',
    diagnosis: 'Seasonal allergic rhinitis',
    medications: ['Cetirizine 10mg once daily', 'Nasal saline spray twice daily'],
    is_sensitive: false
  },
  {
    id: 'mr-004',
    patient_abha_id: 'ABHA1234567890',
    doctor_id: 'DOC003',
    record_type: 'discharge_summary',
    title: 'Hospital Discharge Summary',
    description: 'Discharge summary from hospital stay for treatment of acute respiratory infection',
    file_url: 'https://via.placeholder.com/150',
    record_date: '2024-02-15',
    diagnosis: 'Acute respiratory infection - treated and resolved',
    medications: ['Antibiotics course completed', 'Vitamin C supplement'],
    is_sensitive: true
  }
];

export const MedicalRecord = {
  ...medicalRecordSchema,
  schema: medicalRecordSchema,
  getDemoRecords: () => [...demoMedicalRecords],
  filter: async (query, sort) => {
    let filtered = demoMedicalRecords;
    if (query.patient_abha_id) {
      filtered = filtered.filter(r => r.patient_abha_id === query.patient_abha_id);
    }
    if (query.doctor_id) {
      filtered = filtered.filter(r => r.doctor_id === query.doctor_id);
    }
    if (query.record_type) {
      filtered = filtered.filter(r => r.record_type === query.record_type);
    }
    if (sort === '-record_date') {
      filtered.sort((a, b) => new Date(b.record_date) - new Date(a.record_date));
    }
    return filtered;
  },
  list: async (sort) => {
    let records = [...demoMedicalRecords];
    if (sort === '-record_date') {
      records.sort((a, b) => new Date(b.record_date) - new Date(a.record_date));
    }
    return records;
  },
  create: async (data) => {
    const newRecord = {
      id: `mr-${Date.now()}`,
      ...data
    };
    demoMedicalRecords.push(newRecord);
    return newRecord;
  }
};
