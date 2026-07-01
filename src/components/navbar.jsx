// src/components/Navbar.jsx
import { Link } from 'react-router-dom';
import { useWpMenu } from '../hooks/useWpMenu';

export default function Navbar() {
  const { items, loading } = useWpMenu('primary');

  if (loading) return null;

  return (
    <nav>
      <ul>
        {items
          .filter((item) => item.parent === 0)
          .map((item) => (
            <li key={item.id}>
              <Link to={item.url || '/'}>{item.title}</Link>
            </li>
          ))}
      </ul>
    </nav>
  );
}