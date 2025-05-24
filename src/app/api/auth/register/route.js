import { NextResponse } from 'next/server';
import { registerValidator } from '@/lib/validators';
import { StatusCodes } from 'http-status-codes';
import { db } from '@/lib/db';
import bcrypt from 'bcryptjs';
import { verifyRecaptcha } from '@/contexts/recaptcha/server';

const hashPassword = async (password) => {
  return bcrypt.hash(password, 10);
};
const getNextUserId = async () => {
  const [rows] = await db.query(`
    SELECT id FROM users
    WHERE id LIKE 'user-%'
    ORDER BY id DESC
    LIMIT 1
  `);

  if (rows.length === 0) {
    return 'user-001';
  }

  const lastId = rows[0].id; 
  const lastNumber = parseInt(lastId.split('-')[1], 10);
  const nextNumber = String(lastNumber + 1).padStart(3, '0'); 
  return `user-${nextNumber}`;
};

const insertUser = async (name, email, hashedPassword) => {
  const id = await getNextUserId();
  await db.execute(
    'INSERT INTO users (id, username, email, password) VALUES (?, ?, ?, ?)',
    [id, name, email, hashedPassword]
  );
  return id;
};



const handleRegistrationError = (error) => {
  if (error.name === 'ValidationError') {
    return NextResponse.json(
      {
        message: 'Validation failed',
        errors: error.errors,
      },
      { status: StatusCodes.BAD_REQUEST }
    );
  }

  return NextResponse.json(
    {
      message: 'Something went wrong, please try again later',
    },
    { status: StatusCodes.INTERNAL_SERVER_ERROR }
  );
};

export async function POST(req) {
  try {
    
    const body = await req.json();

    const { recaptchaToken } = body;
    const isValidCaptcha = await verifyRecaptcha(recaptchaToken, 'register');
    if (!isValidCaptcha) {
      return NextResponse.json(
        { message: 'reCAPTCHA verification failed' },
        { status: StatusCodes.BAD_REQUEST }
      );
    }
    
    // Validate input
    await registerValidator.validate(body, { abortEarly: false });
 
    
    // Hash the password
    const hashedPassword = await hashPassword(body.password);


    const userId = await insertUser(body.name, body.email, hashedPassword);
    console.log('User ID:', userId);

   

    return NextResponse.json(
      {
        message: 'User and student profile created successfully',
        user: {
          id: userId,
          name: body.name,
          email: body.email,
        },
      },
      { status: StatusCodes.CREATED }
    );
  } catch (error) {
    console.error('Registration Error:', error);
    return handleRegistrationError(error);
  }
}
