import { createContext, useContext, useState } from 'react';
import { AuthContext } from '../Auth/AuthContext';
import { BASE_URL } from '../../constants/constants';

const SearchContext = createContext();

export function SearchProvider({ children }) {
  const [searchResults, setSearchResults] = useState({
    datasources: [],
    dashboards: [],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { user } = useContext(AuthContext);

  const search = async (query) => {
    if (!query.trim()) {
      setSearchResults({ datasources: [], dashboards: [] });
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Check if user is authenticated
      if (!user?.token) {
        throw new Error('User not authenticated');
      }

      // Get all user data including datasources and dashboards
      const response = await fetch(`${BASE_URL}/user/all`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true',
          Authorization: `Bearer ${user?.token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch data');
      }

      const userData = await response.json();
      const userDashboards = userData.data[0]?.dashboards || [];
      const userDatasources = userData.data[0]?.datasources || [];

      // Filter dashboards
      const filteredDashboards = userDashboards.map(db => ({
        ...db,
        type: 'dashboard',
        sourceType: db.sourceType
      })).filter(
        (db) =>
          db.name.toLowerCase().includes(query.toLowerCase()) ||
          db.description?.toLowerCase().includes(query.toLowerCase())
      );

      // Filter datasources
      const filteredDatasources = userDatasources.map(ds => ({
        ...ds,
        type: 'datasource',
        datasourceType: ds.type
      })).filter(
        (ds) =>
          ds.name.toLowerCase().includes(query.toLowerCase()) ||
          ds.description?.toLowerCase().includes(query.toLowerCase())
      );

      setSearchResults({
        datasources: filteredDatasources,
        dashboards: filteredDashboards,
      });
    } catch (err) {
      console.error('Search error:', err);
      setError(err.message || 'An error occurred while searching');
      setSearchResults({ datasources: [], dashboards: [] });
    } finally {
      setLoading(false);
    }
  };

  return (
    <SearchContext.Provider value={{ searchResults, loading, error, search }}>
      {children}
    </SearchContext.Provider>
  );
}

export function useSearch() {
  const context = useContext(SearchContext);
  if (!context) {
    throw new Error('useSearch must be used within a SearchProvider');
  }
  return context;
} 