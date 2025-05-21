import { RoomContextProvider } from "../../contexts/RoomContext/RoomContextProvider";
import AuthPage from "../../views/pages/AuthPage/AuthPage";
import DashboardPage from "../../views/pages/DashboardPage/DashboardPage";
import EmailVerificationPage from "../../views/pages/EmailVerificationPage/EmailVerificationPage";
import RoomInvitationPage from "../../views/pages/RoomInvitationPage/RoomInvitationPage";
import InfoPage from "../../views/pages/InfoPage/InfoPage";
import NotFoundPage from "../../views/pages/NotFoundPage/NotFoundPage";
import ProfilePage from "../../views/pages/ProfilePage/ProfilePage";
import RoomPage from "../../views/pages/RoomPage/RoomPage";

const routesData = [
    //{title: , path: , element: }
    {title: '404', path: '*', element: <NotFoundPage/>},

    {title: 'info', path: '/', element: <InfoPage/>},
    {title: 'auth', path: '/auth', element: <AuthPage/>},

    {title: 'dashboard', path: '/dashboard', element: <DashboardPage/>},
    {title: 'room', path: '/dashboard/:id', element: <RoomContextProvider><RoomPage/></RoomContextProvider>},
    {title: 'profile', path: '/profile', element: <ProfilePage/>},

    {title: 'emailVerification', path: '/verify-email', element: <EmailVerificationPage/>},
    {title: 'acceptInvitation', path: '/accept-invitation', element: <RoomInvitationPage/>},
];

export default routesData;