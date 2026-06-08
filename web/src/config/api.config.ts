// Lấy base URL từ file .env
const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:3005/api';

export const API_ENDPOINTS = {
  BASE: API_BASE,
  PACKAGES: `${API_BASE}/packages`,
  WALLET: `${API_BASE}/wallet`,
  // Bạn có thể dễ dàng mở rộng thêm các route khác tại đây khi dự án lớn lên
  // TRANSACTIONS: `${API_BASE}/transactions`,
};