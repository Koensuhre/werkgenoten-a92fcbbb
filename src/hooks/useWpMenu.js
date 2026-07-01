// src/hooks/useWpMenu.js
import { useState, useEffect } from 'react';

export function useWpMenu(location = 'primary') {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const baseUrl = import.meta.env.VITE_WP_API_URL.replace('/wp/v2', '');
    fetch(`${baseUrl}/custom/v1/menu/${location}`)
      .then((res) => res.json())
      .then((data) => {
        setItems(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [location]);

  return { items, loading };
}