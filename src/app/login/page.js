import AuthLayout from '@/components/auth/layout/AuthLayout';
import LoginForm from '@/components/auth/LoginForm';
import { metadataConfig } from '@/lib/metadata';

export const metadata = metadataConfig.login;

export default function LoginPage() {
  return (
    <AuthLayout>

        <LoginForm />

    </AuthLayout>
  );
};

