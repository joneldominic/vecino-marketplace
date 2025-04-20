import { useQuery } from '@tanstack/react-query';
import { useAuthStore, useUiStore } from '../store';
import { testApi } from '../services';
import { useState, useEffect } from 'react';

interface TestData {
  message: string;
  timestamp: string;
}

// API call to our backend test endpoint using our service
const fetchTestData = async (): Promise<TestData> => {
  try {
    const response = await testApi.getTestData();
    return response.data;
  } catch (error) {
    console.error('Error fetching test data:', error);
    throw error;
  }
};

// Mock API call for development when backend is not available
const _mockFetchTestData = async (): Promise<TestData> => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  return { message: 'Mock API request successful!', timestamp: new Date().toISOString() };
};

export default function TestComponent() {
  // Use our Zustand stores
  const { isDarkMode, toggleDarkMode } = useUiStore();
  const { isAuthenticated, login, logout } = useAuthStore();
  const [useMock, setUseMock] = useState(false);

  // For testing, we'll try to use the real API endpoint
  const { data, isLoading, error, refetch } = useQuery<TestData, Error>({
    queryKey: ['test-data'],
    queryFn: useMock ? _mockFetchTestData : fetchTestData,
    retry: 1,
    enabled: true, // The query will execute on component mount
  });

  // If there's an error fetching data, fall back to mock data
  useEffect(() => {
    if (error && !useMock) {
      setUseMock(true);
    }
  }, [error, useMock]);

  return (
    <div
      className={`p-6 rounded-lg ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'}`}
    >
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
        <h3 className="font-semibold mb-2">Backend API Test:</h3>
        {isLoading ? (
          <p>Loading data...</p>
        ) : error && !useMock ? (
          <div>
            <p className="text-red-500">Error loading data from backend</p>
            <button
              onClick={() => setUseMock(true)}
              className="mt-2 px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600"
            >
              Use Mock Data
            </button>
          </div>
        ) : (
          <div>
            <p className="text-green-500">{data?.message}</p>
            {data?.timestamp && (
              <p className="text-sm text-gray-500">Timestamp: {data.timestamp}</p>
            )}
            {useMock && (
              <p className="text-xs text-orange-500 mt-2">
                Using mock data. Backend connection failed.
              </p>
            )}
            <button
              onClick={() => {
                setUseMock(false);
                refetch();
              }}
              className="mt-2 px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600"
            >
              Retry Backend Connection
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
