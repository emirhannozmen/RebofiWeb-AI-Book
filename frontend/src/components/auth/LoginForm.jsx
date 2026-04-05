import { useForm } from 'react-hook-form';
import { useAuthContext } from '../../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { useState } from 'react';

export default function LoginForm() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const { login } = useAuthContext();
  const navigate = useNavigate();
  const [serverError, setServerError] = useState('');

  const onSubmit = async (data) => {
    try {
      setServerError('');
      await login(data.email, data.password);
      navigate('/books');
    } catch (error) {
      setServerError(error.response?.data?.detail || 'Failed to login');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
      {serverError && <div className="bg-red-100 text-red-700 p-2 mb-4 rounded">{serverError}</div>}
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-4">
          <label className="block mb-1">Email</label>
          <input
            {...register("email", { required: "Email is required" })}
            className="w-full border rounded p-2"
            type="email"
          />
          {errors.email && <span className="text-red-500 text-sm">{errors.email.message}</span>}
        </div>
        <div className="mb-6">
          <label className="block mb-1">Password</label>
          <input
            {...register("password", { required: "Password is required" })}
            className="w-full border rounded p-2"
            type="password"
          />
          {errors.password && <span className="text-red-500 text-sm">{errors.password.message}</span>}
        </div>
        <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700">
          Login
        </button>
      </form>
      <p className="mt-4 text-center text-sm">
        Don't have an account? <Link to="/register" className="text-blue-600">Register</Link>
      </p>
    </div>
  );
}
