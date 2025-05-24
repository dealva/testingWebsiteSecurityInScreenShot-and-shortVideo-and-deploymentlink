'use client';

import TextInput from '@/components/common/form/TextInput';
import SubmitButton from '@/components/common/form/SubmitButton';
import FormHeader from '@/components/common/form/FormHeader';
import RedirectPrompt from '@/components/common/form/RedirectPrompt';
import useLoginForm from '@/hooks/auth/useLoginForm';
import BackToHomeButton from '@/components/common/BackToHomeButton';

function LoginForm() {
  const { formData, loading, handleChange, handleSubmit } = useLoginForm();

  return (
    <div className="max-w-md mx-auto p-4">
      <FormHeader title="Login" />
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <TextInput
          label="Email"
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
        />

        <TextInput
          label="Password"
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          required
        />

        <SubmitButton 
          loading={loading} 
          text="Login" 
        />
      </form>

      <div className="mt-6">
        <RedirectPrompt 
          message="Don't have an account yet?" 
          linkText="Register here" 
          href="/register" 
        />
      </div>

      <div className="mt-4 text-center">
        <BackToHomeButton />
      </div>
    </div>
  );
}

export default LoginForm;
