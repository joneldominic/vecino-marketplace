import React from 'react';
import { useAuthStore } from '../store';

// HOC to wrap components requiring authentication
export function withAuth<T>(Component: React.ComponentType<T>) {
  const WithAuth = (props: T) => {
    const { isAuthenticated } = useAuthStore();

    if (!isAuthenticated) {
      return <div className="p-4 text-red-500">Please log in to view this content.</div>;
    }

    return <Component {...props} />;
  };

  // Set display name for debugging
  WithAuth.displayName = `WithAuth(${Component.displayName || Component.name || 'Component'})`;

  return WithAuth;
}

export default withAuth;
