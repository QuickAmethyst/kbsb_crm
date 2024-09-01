const routes = {
  signIn: '/',
  dashboard: {
    index: '/dashboard',
    objects: {
      detail: (id: string) => `/dashboard/objects/${id}`
    }
  }
};

export default routes;
