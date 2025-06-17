
import axios from 'axios';
const API_URL = 'http://localhost:5000/api/wishlist';

export const getWishlist = async () => {
  const token = localStorage.getItem('token');
  
  if (token) {
    try {
      const response = await axios.get(API_URL, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data.map(item => item.villa_id);
    } catch (error) {
      console.error('API wishlist fetch failed, using localStorage', error);
    }
  }
  
  // Fallback to localStorage
  const localWishlist = localStorage.getItem('localWishlist');
  return localWishlist ? JSON.parse(localWishlist) : [];
};

// Add to wishlist
export const addToWishlist = async (villaId) => {
  const token = localStorage.getItem('token');
  
  if (token) {
    try {
      await axios.post(API_URL, { villa_id: villaId }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return true;
    } catch (error) {
      console.error('API add failed, using localStorage', error);
    }
  }
  
  // Fallback to localStorage
  const current = JSON.parse(localStorage.getItem('localWishlist') || '[]');
  const updated = [...new Set([...current, villaId])];
  localStorage.setItem('localWishlist', JSON.stringify(updated));
  return false;
};

// Remove from wishlist
export const removeFromWishlist = async (villaId) => {
  const token = localStorage.getItem('token');
  
  if (token) {
    try {
      await axios.delete(`${API_URL}/${villaId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return true;
    } catch (error) {
      console.error('API remove failed, using localStorage', error);
    }
  }
  
  // Fallback to localStorage
  const current = JSON.parse(localStorage.getItem('localWishlist') || '[]');
  const updated = current.filter(id => id !== villaId);
  localStorage.setItem('localWishlist', JSON.stringify(updated));
  return false;
};