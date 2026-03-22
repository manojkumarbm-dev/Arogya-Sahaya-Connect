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
    const user = {
      ...defaultUser,
      id: Date.now().toString(),
      full_name: userType === 'healthcare_provider' ? 'Dr. Arogya Provider' : 'Arogya User',
      email: userType === 'healthcare_provider' ? 'doctor@arogya.app' : 'user@arogya.app',
      user_type: userType,
      is_verified: true,
      preferred_language: 'english',
      isGuest: false, // Real logged-in users are not guests
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

  getToken,
};

