import { Routes, Route } from 'react-router-dom';
import TestComponent from './components/TestComponent';
import { useUiStore } from './store';

function App() {
  const { isDarkMode } = useUiStore();

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <header className={`${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'} shadow`}>
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold">Vecino Marketplace</h1>
        </div>
      </header>
      <main>
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <Routes>
            <Route path="/" element={
              <div className="px-4 py-6 sm:px-0">
                <TestComponent />
              </div>
            } />
          </Routes>
        </div>
      </main>
    </div>
  );
}

export default App; 