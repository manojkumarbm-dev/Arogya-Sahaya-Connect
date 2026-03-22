import vaccinationSchema from '@/../entities/Vaccination.json';

const demoVaccinations = [
  {
    id: 'vax-001',
    patient_abha_id: 'ABHA1234567890',
    vaccine_name: 'COVID-19 (Pfizer)',
    vaccination_date: '2024-01-15',
    next_dose_date: null,
    dose_number: 3,
    vaccination_center: 'City Health Center',
    batch_number: 'PFZ-2024-001',
    certificate_url: 'https://via.placeholder.com/150',
    is_completed: true,
    reminder_enabled: false
  },
  {
    id: 'vax-002',
    patient_abha_id: 'ABHA1234567890',
    vaccine_name: 'Influenza (Seasonal)',
    vaccination_date: '2024-03-10',
    next_dose_date: '2025-03-10',
    dose_number: 1,
    vaccination_center: 'Local Primary Health Center',
    batch_number: 'INF-2024-055',
    certificate_url: 'https://via.placeholder.com/150',
    is_completed: false,
    reminder_enabled: true
  },
  {
    id: 'vax-003',
    patient_abha_id: 'ABHA1234567890',
    vaccine_name: 'Polio (IPV)',
    vaccination_date: '2024-02-20',
    next_dose_date: null,
    dose_number: 4,
    vaccination_center: 'District Hospital',
    batch_number: 'POL-2024-033',
    certificate_url: 'https://via.placeholder.com/150',
    is_completed: true,
    reminder_enabled: false
  },
  {
    id: 'vax-004',
    patient_abha_id: 'ABHA1234567890',
    vaccine_name: 'Tetanus (DPT)',
    vaccination_date: '2024-01-05',
    next_dose_date: '2024-07-05',
    dose_number: 2,
    vaccination_center: 'Community Health Clinic',
    batch_number: 'DPT-2024-012',
    certificate_url: 'https://via.placeholder.com/150',
    is_completed: false,
    reminder_enabled: true
  }
];

export const Vaccination = {
  ...vaccinationSchema,
  schema: vaccinationSchema,
  getDemoRecords: () => [...demoVaccinations],
  filter: async (query, sort) => {
    let filtered = demoVaccinations;
    if (query.patient_abha_id) {
      filtered = filtered.filter(v => v.patient_abha_id === query.patient_abha_id);
    }
    if (query.vaccine_name) {
      filtered = filtered.filter(v => v.vaccine_name === query.vaccine_name);
    }
    if (sort === '-vaccination_date') {
      filtered.sort((a, b) => new Date(b.vaccination_date) - new Date(a.vaccination_date));
    }
    return filtered;
  },
  list: async (sort) => {
    let records = [...demoVaccinations];
    if (sort === '-vaccination_date') {
      records.sort((a, b) => new Date(b.vaccination_date) - new Date(a.vaccination_date));
    }
    return records;
  },
  create: async (data) => {
    const newRecord = {
      id: `vax-${Date.now()}`,
      ...data
    };
    demoVaccinations.push(newRecord);
    return newRecord;
  }
};
