// Configuración de entorno para conexión con el backend
const getEndpoint = (): string => {
  if (typeof window !== 'undefined') {
    const override = localStorage.getItem('API_URL_OVERRIDE');
    if (override && override.trim() !== '') {
      return override.trim().replace(/\/+$/, '');
    }
  }
  return 'http://localhost:3003';
};

export const environment = {
  production: false,
  get endpoint(): string {
    return getEndpoint();
  },
  defaultEndpoint: 'http://localhost:3003'
};

