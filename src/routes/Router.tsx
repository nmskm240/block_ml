import { createBrowserRouter } from 'react-router-dom';
import * as pages from '../pages';
import AuthMiddleware from './middlewares/AuthMiddleware';

const router = createBrowserRouter([
    {path: '/', element: <pages.ProjectEditPage />, loader: AuthMiddleware},
    {path: '/login', element: <pages.AuthPage />, loader: AuthMiddleware},
]);

export default router;
