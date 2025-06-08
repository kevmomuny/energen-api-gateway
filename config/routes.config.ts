export interface RouteConfig {
  pathPrefix: string;
  targetServiceBaseUrl: string; // Base URL of the Catalyst server
  targetFunctionPath: string;   // Path to the specific Zoho function
}

export const serviceRoutes: RouteConfig[] = [
  {
    pathPrefix: '/api/v1/customers',
    targetServiceBaseUrl: 'https://mobile-bid-tool-888909920.development.catalystserverless.com/server/',
    targetFunctionPath: 'zoho-sync-manager',
  },
  {
    pathPrefix: '/api/v1/equipment',
    targetServiceBaseUrl: 'https://mobile-bid-tool-888909920.development.catalystserverless.com/server/',
    targetFunctionPath: 'equipment-analysis-processor',
  },
  {
    pathPrefix: '/api/v1/upload-image',
    targetServiceBaseUrl: 'https://mobile-bid-tool-888909920.development.catalystserverless.com/server/',
    targetFunctionPath: 'image-processor',
  },
  {
    pathPrefix: '/api/v1/settings',
    targetServiceBaseUrl: 'https://mobile-bid-tool-888909920.development.catalystserverless.com/server/',
    targetFunctionPath: 'settings-manager',
  },
  {
    pathPrefix: '/api/v1/data-sync',
    targetServiceBaseUrl: 'https://mobile-bid-tool-888909920.development.catalystserverless.com/server/',
    targetFunctionPath: 'offline-data-sync-manager',
  },
  {
    pathPrefix: '/api/v1/reports',
    targetServiceBaseUrl: 'https://mobile-bid-tool-888909920.development.catalystserverless.com/server/',
    targetFunctionPath: 'reporting-engine',
  },
  {
    pathPrefix: '/api/v1/notifications',
    targetServiceBaseUrl: 'https://mobile-bid-tool-888909920.development.catalystserverless.com/server/',
    targetFunctionPath: 'notification-manager',
  },
  // Assuming /api/v1/auth is handled by the gateway itself and not proxied.
  // If it were to be proxied, it would look like this:
  // {
  //   pathPrefix: '/api/v1/auth',
  //   targetServiceBaseUrl: 'https://mobile-bid-tool-888909920.development.catalystserverless.com/server/',
  //   targetFunctionPath: 'auth-service-function', // replace with actual function name if applicable
  // },
];
