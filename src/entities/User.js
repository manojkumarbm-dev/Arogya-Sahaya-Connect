const STORAGE_KEY = 'app_user';
const TOKEN_KEY = 'app_token';

const defaultUser = {
  id: 'guest',
  full_name: 'Guest User',
  email: 'guest@arogya.app',
  phone_number: '+911234567890',
  // No user_type for guest users
  abha_id: '',
  address: '',
  date_of_birth: '',
  gender: 'other',
  blood_group: '',
  emergency_contact: '',
  preferred_language: 'english',
  is_verified: true,
  isGuest: true, // Flag to identify guest users
};

const demoUsers = [
  {
    id: 'user-demo-001',
    full_name: 'Rajesh Kumar',
    email: 'rajesh.kumar@arogya.app',
    phone_number: '+919876543210',
    user_type: 'patient',
    abha_id: 'ABHA1234567890',
    address: '123 Health Street, Medical Complex',
    date_of_birth: '1985-06-15',
    gender: 'male',
    blood_group: 'B+',
    city: 'Delhi',
    state: 'Delhi',
    postal_code: '110001',
    country: 'India',
    emergency_contact: '+919876543210',
    preferred_language: 'hindi',
    is_verified: true,
    created_at: '2023-01-15T10:00:00Z',
    updated_at: '2024-03-20T14:30:00Z'
  },
  {
    id: 'user-demo-002',
    full_name: 'Dr. Priya Verma',
    email: 'priya.verma@hospital.arogya.app',
    phone_number: '+919111222333',
    user_type: 'healthcare_provider',
    abha_id: 'ABHA0987654321',
    address: 'City Hospital, Medical Department',
    date_of_birth: '1990-03-22',
    gender: 'female',
    blood_group: 'O+',
    city: 'Mumbai',
    state: 'Maharashtra',
    postal_code: '400001',
    country: 'India',
    emergency_contact: '+919111222333',
    preferred_language: 'english',
    is_verified: true,
    created_at: '2023-06-01T09:00:00Z',
    updated_at: '2024-03-18T16:45:00Z'
  },
  {
    id: 'user-demo-003',
    full_name: 'Anjali Singh',
    email: 'anjali.singh@arogya.app',
    phone_number: '+919333444555',
    user_type: 'patient',
    abha_id: 'ABHA5566778899',
    address: '456 Wellness Avenue',
    date_of_birth: '1988-12-10',
    gender: 'female',
    blood_group: 'A+',
    city: 'Bangalore',
    state: 'Karnataka',
    postal_code: '560001',
    country: 'India',
    emergency_contact: '+919333444555',
    preferred_language: 'english',
    is_verified: true,
    created_at: '2023-09-10T11:20:00Z',
    updated_at: '2024-03-19T13:15:00Z'
  }
];

const loadStoredUser = () => {
  const rawUser = localStorage.getItem(STORAGE_KEY);
  if (rawUser) {
    try {
      return JSON.parse(rawUser);
    } catch (e) {
      console.error('Invalid stored user data', e);
    }
  }
  return null;
};

const saveUser = (user) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
};

const setToken = (token) => {
  localStorage.setItem(TOKEN_KEY, token);
};

const clearToken = () => {
  localStorage.removeItem(TOKEN_KEY);
};

const getToken = () => localStorage.getItem(TOKEN_KEY);

export const User = {
  me: async () => {
    let token = getToken();
    let user = loadStoredUser();

    if (!token) {
      // If no explicit auth, return guest user
      user = { ...defaultUser };
      saveUser(user);
      setToken('guest-token');
      return user;
    }

    if (!user) {
      user = { ...defaultUser };
      saveUser(user);
    }

    return user;
  },

  login: async (userType = 'patient') => {
    const demoUser = demoUsers.find(u => u.user_type === userType) || demoUsers[0];
    const user = {
      ...demoUser,
      id: Date.now().toString(),
      is_verified: true,
      isGuest: false
    };

    saveUser(user);
    setToken('fake-login-token');

    return user;
  },

  logout: async () => {
    localStorage.removeItem(STORAGE_KEY);
    clearToken();
    return true;
  },

  updateMyUserData: async (data) => {
    const currentUser = loadStoredUser() || defaultUser;
    const updatedUser = { ...currentUser, ...data };
    saveUser(updatedUser);
    return updatedUser;
  },

  getGuestUser: () => {
    return { ...defaultUser };
  },

  getDemoUsers: () => [...demoUsers],

  filter: async (query) => {
    let filtered = demoUsers;
    if (query.user_type) {
      filtered = filtered.filter(u => u.user_type === query.user_type);
    }
    if (query.email) {
      filtered = filtered.filter(u => u.email.includes(query.email));
    }
    return filtered;
  },

  list: async () => {
    return [...demoUsers];
  },

  getToken,
};

