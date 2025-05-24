'use client';

import TextInput from '@/components/common/form/TextInput';
import SubmitButton from '@/components/common/form/SubmitButton';
import FormHeader from '@/components/common/form/FormHeader';
import useRegisterForm from '@/hooks/auth/useRegisterForm';
import RedirectPrompt from '@/components/common/form/RedirectPrompt';


export default function RegisterForm (){
    const { formData, loading, handleChange, handleSubmit } = useRegisterForm();
    return (
        <>
        <form onSubmit={handleSubmit} className="space-y-4">
            <FormHeader title="Register" />
                <TextInput
                label="Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
            />

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

            <TextInput
                label="Confirm Password"
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
            />

            <SubmitButton 
                loading={loading} 
                text="Register" 
            />
        </form>
        <RedirectPrompt 
            message="Already have an account?" 
            linkText="Login here" 
            href="/login" 
        />
        </>
    );
};

