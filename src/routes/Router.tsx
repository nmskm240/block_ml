import { createBrowserRouter } from 'react-router-dom';
import * as pages from '../pages';
import AuthMiddleware from './middlewares/AuthMiddleware';

const router = createBrowserRouter([
    {path: '/', element: <pages.ProjectEditPage />, unstable_middleware: [AuthMiddleware]},
    {path: '/login', element: <pages.AuthPage />, unstable_middleware: [AuthMiddleware]},
]);

export default router;
