import { useQuery } from '@tanstack/react-query';
import { useAuthStore, useUiStore } from '../store';

// Mock API call
const fetchTestData = async () => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  return { message: 'API request successful!' };
};

export default function TestComponent() {
  // Use our Zustand stores
  const { isDarkMode, toggleDarkMode } = useUiStore();
  const { isAuthenticated, login, logout } = useAuthStore();
  
  // Use TanStack Query for data fetching
  const { data, isLoading, error } = useQuery({
    queryKey: ['test-data'],
    queryFn: fetchTestData,
  });

  return (
    <div className={`p-6 rounded-lg ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'}`}>
      <h2 className="text-xl font-bold mb-4">Component Test</h2>
      
      <div className="mb-4">
        <h3 className="font-semibold mb-2">Zustand Store Test:</h3>
        <div className="space-y-2">
          <p>Dark Mode: {isDarkMode ? 'On' : 'Off'}</p>
          <button
            onClick={toggleDarkMode}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Toggle Dark Mode
          </button>
        </div>

        <div className="mt-4 space-y-2">
          <p>Auth Status: {isAuthenticated ? 'Logged In' : 'Logged Out'}</p>
          {!isAuthenticated ? (
            <button
              onClick={() => login('test@example.com', 'password')}
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            >
              Mock Login
            </button>
          ) : (
            <button
              onClick={logout}
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            >
              Logout
            </button>
          )}
        </div>
      </div>

      <div className="mt-6">
        <h3 className="font-semibold mb-2">TanStack Query Test:</h3>
        {isLoading ? (
          <p>Loading data...</p>
        ) : error ? (
          <p className="text-red-500">Error loading data</p>
        ) : (
          <p className="text-green-500">{data?.message}</p>
        )}
      </div>
    </div>
  );
} 