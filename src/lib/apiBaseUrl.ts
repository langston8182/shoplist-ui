export const getApiBaseUrl = (): string => {
  const environment = import.meta.env.VITE_ENVIRONMENT || 'preprod';
  
  if (environment === 'prod') {
    return 'https://shoplist-api.cyrilmarchive.com';
  }
  
  return 'https://shoplist-api-preprod.cyrilmarchive.com';
};