import axios from 'axios';

// Konfigurasi instance axios dengan URL base dari .env
const apiClient = axios.create({
  baseURL: process.env.REACT_APP_BACKEND_URL || 'http://localhost:3001/api',
});

// (Logika Kompleks) Interceptor untuk menambahkan header otentikasi secara otomatis
apiClient.interceptors.request.use(
  (config) => {
    // Ambil token/signature yang disimpan (misal dari localStorage) setelah login
    const token = localStorage.getItem('authToken'); 
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// --- Definisi Fungsi API ---

/**
 * @dev Mengambil profil lengkap pengguna yang sedang login dari backend.
 */
export const getProfile = () => apiClient.get('/users/profile');

/**
 * @dev Mengambil daftar misi yang tersedia.
 */
export const getMissions = () => apiClient.get('/missions');

/**
 * @dev Meminta signature dari backend untuk mengklaim hadiah misi.
 * @param {string} missionId ID dari misi yang akan diklaim.
 * @returns {Promise<{amount: number, nonce: number, signature: string}>}
 */
export const getClaimSignature = (missionId) => apiClient.post('/missions/claim-signature', { missionId });

// ...tambahkan fungsi API lain sesuai kebutuhan