import { Metadata } from 'next';
import LoginPage from '@/components/LoginPage';

export const metadata: Metadata = {
    title: 'Login | Rovify',
    description: 'Sign in to your Rovify account',
};

export default function Login() {
    return <LoginPage />;
}