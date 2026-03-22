import familyMemberSchema from '@/../entities/FamilyMember.json';

const demoFamilyMembers = [
  {
    id: 'fm-001',
    primary_user_id: 'user-123',
    name: 'Priya Sharma',
    relationship: 'spouse',
    abha_id: 'ABHA0987654321',
    date_of_birth: '1992-07-15',
    gender: 'female',
    blood_group: 'O+',
    phone_number: '+919876543210',
    medical_conditions: ['Hypertension'],
    emergency_contact: '+919876543210'
  },
  {
    id: 'fm-002',
    primary_user_id: 'user-123',
    name: 'Aarav Sharma',
    relationship: 'child',
    abha_id: 'ABHA1122334455',
    date_of_birth: '2015-03-22',
    gender: 'male',
    blood_group: 'A+',
    phone_number: '+919999888777',
    medical_conditions: ['Asthma'],
    emergency_contact: '+919876543210'
  },
  {
    id: 'fm-003',
    primary_user_id: 'user-123',
    name: 'Savitri Sharma',
    relationship: 'parent',
    abha_id: 'ABHA5566778899',
    date_of_birth: '1965-11-08',
    gender: 'female',
    blood_group: 'B+',
    phone_number: '+919555666777',
    medical_conditions: ['Type 2 Diabetes', 'Arthritis'],
    emergency_contact: '+919876543210'
  },
  {
    id: 'fm-004',
    primary_user_id: 'user-123',
    name: 'Rajesh Sharma',
    relationship: 'sibling',
    abha_id: 'ABHA2233445566',
    date_of_birth: '1990-05-30',
    gender: 'male',
    blood_group: 'AB+',
    phone_number: '+919111222333',
    medical_conditions: [],
    emergency_contact: '+919876543210'
  }
];

export const FamilyMember = {
  ...familyMemberSchema,
  schema: familyMemberSchema,
  getDemoRecords: () => [...demoFamilyMembers],
  filter: async (query, sort) => {
    let filtered = demoFamilyMembers;
    if (query.primary_user_id) {
      filtered = filtered.filter(f => f.primary_user_id === query.primary_user_id);
    }
    if (query.relationship) {
      filtered = filtered.filter(f => f.relationship === query.relationship);
    }
    return filtered;
  },
  list: async () => {
    return [...demoFamilyMembers];
  },
  create: async (data) => {
    const newRecord = {
      id: `fm-${Date.now()}`,
      ...data
    };
    demoFamilyMembers.push(newRecord);
    return newRecord;
  }
};
