import { createBrowserRouter } from 'react-router-dom';
import * as pages from '../pages';

const router = createBrowserRouter([
    {path: '/', element: <pages.ProjectEditPage />},
    {path: '/login', element: <pages.AuthPage />},
]);

export default router;
