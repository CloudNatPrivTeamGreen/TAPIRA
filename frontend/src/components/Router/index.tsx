import { Routes, Route } from 'react-router-dom';
import { routers } from './router.config';

const AppRouter = () => {
  return (
    <Routes>
      {routers.map((route) => {
        const { component: Component } = route;
        return (
          <Route key={route.path} path={route.path} element={<Component />} />
        );
      })}
    </Routes>
  );
};

export default AppRouter;
