const routes = {
  signIn: '/',
  dashboard: {
    index: '/dashboard',
    objects: {
      detail: (id: string) => ({
        index: `/dashboard/objects/${id}`,
        addRecord: `/dashboard/objects/${id}/record/add`,
      })
    }
  }
};

export default routes;
