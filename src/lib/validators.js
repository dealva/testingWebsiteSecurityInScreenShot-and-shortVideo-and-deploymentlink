import * as Yup from 'yup';

// export const studentSchema = Yup.object({
//   name: Yup.string().required(),
//   email: Yup.string().email().required(),
//   major: Yup.string().required(),
//   bio: Yup.string().optional(),
//   address: Yup.string().optional(),
//   phone: Yup.string().optional(),
//   // photo is handled separately
// });

// Validator for user registration
export const registerValidator = Yup.object().shape({
    name: Yup.string().required('Name is required').min(3, 'Name must be at least 3 characters'),
    email: Yup.string().email('Invalid email address').required('Email is required'),
    password: Yup.string()
      .required('Password is required')
      .min(6, 'Password must be at least 6 characters'),
    // Confirm password validation can be added if needed
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password'), null], 'Passwords must match')
      .required('Confirm password is required'),
});
  
// Validator for user login
export const loginValidator = Yup.object().shape({
    email: Yup.string().email('Invalid email address').required('Email is required'),
    password: Yup.string().required('Password is required'),
});

// Validator for updating student profile (can add more fields if necessary)
// export const studentUpdateValidator = Yup.object().shape({
//     name: Yup.string().min(3, 'Name must be at least 3 characters'),
//     major: Yup.string().min(3, 'Major must be at least 3 characters'),
//     address: Yup.string().min(5, 'Address must be at least 5 characters'),
//     phone: Yup.string().matches(/^\d{10}$/, 'Phone number must be a valid 10-digit number'),
// });