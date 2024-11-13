import React from 'react';
import { Youtube } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import SearchBar from './SearchBar';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const navigate = useNavigate();

  const handleSearch = (query: string) => {
    navigate(`/search?q=${query.replace(/\s+/g, '+')}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center space-x-2">
              <Youtube className="h-8 w-8 text-red-600" />
              <h1 className="text-xl font-bold text-gray-900">Trending Now</h1>
            </Link>
            <SearchBar onSearch={handleSearch} />
          </div>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
};

export default Layout;