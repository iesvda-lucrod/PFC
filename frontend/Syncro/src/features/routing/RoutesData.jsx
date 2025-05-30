import { RoomContextProvider } from "../../contexts/RoomContext/RoomContextProvider";
import AuthPage from "../../views/pages/AuthPage/AuthPage";
import DashboardPage from "../../views/pages/DashboardPage/DashboardPage";
import EmailVerificationPage from "../../views/pages/EmailVerificationPage/EmailVerificationPage";
import RoomInvitationPage from "../../views/pages/RoomInvitationPage/RoomInvitationPage";
import LandingPage from "../../views/pages/LandingPage/LandingPage";
import NotFoundPage from "../../views/pages/NotFoundPage/NotFoundPage";
import ProfilePage from "../../views/pages/ProfilePage/ProfilePage";
import ForgotPasswordPage from "../../views/pages/ForgotPasswordPage/ForgotPasswordPage";
import ContactPage from "../../views/pages/ContactPage/ContactPage";
import RoomPageWrapper from "../../views/pages/RoomPage/RoomPageWrapper/RoomPageWrapper";

const routesData = [
    //{title: , path: , element: }
    {title: '404', path: '*', element: <NotFoundPage/>},

    {title: 'info', path: '/', element: <LandingPage/>},
    {title: 'auth', path: '/auth', element: <AuthPage/>},

    {title: 'dashboard', path: '/dashboard', element: <DashboardPage/>},
    {title: 'room', path: '/dashboard/:id', element: <RoomPageWrapper />},
    {title: 'profile', path: '/profile', element: <ProfilePage/>},
    {title: 'contact', path: '/contact', element: <ContactPage/>},

    {title: 'emailVerification', path: '/verify-email', element: <EmailVerificationPage/>},
    {title: 'acceptInvitation', path: '/accept-invitation', element: <RoomInvitationPage/>},
    {title: 'changePassword', path: '/change-password', element: <ForgotPasswordPage/>},
];

export default routesData;