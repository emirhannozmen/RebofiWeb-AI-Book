import { useForm } from 'react-hook-form';
import { useState } from 'react';
import api from '../../services/api';
import { Link } from 'react-router-dom';

export default function ForgotPasswordForm() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const onSubmit = async (data) => {
    try {
      setError('');
      setMessage('');
      await api.post('/api/auth/forgot-password', { email: data.email });
      setMessage('If an account exists, a reset email has been sent.');
    } catch (err) {
      setError('An error occurred. Please try again.');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">Forgot Password</h2>
      {message && <div className="bg-green-100 text-green-700 p-2 mb-4 rounded">{message}</div>}
      {error && <div className="bg-red-100 text-red-700 p-2 mb-4 rounded">{error}</div>}
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-6">
          <label className="block mb-1">Email</label>
          <input
            {...register("email", { required: "Email is required" })}
            className="w-full border rounded p-2"
            type="email"
          />
          {errors.email && <span className="text-red-500 text-sm">{errors.email.message}</span>}
        </div>
        <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700">
          Reset Password
        </button>
      </form>
      <p className="mt-4 text-center text-sm">
        <Link to="/login" className="text-blue-600">Back to Login</Link>
      </p>
    </div>
  );
}
