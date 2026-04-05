import { useForm } from 'react-hook-form';
import { useAuthContext } from '../../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { useState } from 'react';

export default function RegisterForm() {
  const { register, handleSubmit, formState: { errors }, watch } = useForm();
  const { register: registerUser } = useAuthContext();
  const navigate = useNavigate();
  const [serverError, setServerError] = useState('');

  const onSubmit = async (data) => {
    try {
      setServerError('');
      await registerUser(data.name, data.email, data.password);
      navigate('/books');
    } catch (error) {
      setServerError(error.response?.data?.detail || 'Failed to register');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">Register</h2>
      {serverError && <div className="bg-red-100 text-red-700 p-2 mb-4 rounded">{serverError}</div>}
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-4">
          <label className="block mb-1">Name</label>
          <input
            {...register("name", { required: "Name is required" })}
            className="w-full border rounded p-2"
            type="text"
          />
          {errors.name && <span className="text-red-500 text-sm">{errors.name.message}</span>}
        </div>
        <div className="mb-4">
          <label className="block mb-1">Email</label>
          <input
            {...register("email", { required: "Email is required" })}
            className="w-full border rounded p-2"
            type="email"
          />
          {errors.email && <span className="text-red-500 text-sm">{errors.email.message}</span>}
        </div>
        <div className="mb-4">
          <label className="block mb-1">Password</label>
          <input
            {...register("password", { required: "Password is required", minLength: { value: 8, message: "Min 8 chars" } })}
            className="w-full border rounded p-2"
            type="password"
          />
          {errors.password && <span className="text-red-500 text-sm">{errors.password.message}</span>}
        </div>
        <div className="mb-6">
          <label className="block mb-1">Confirm Password</label>
          <input
            {...register("confirmPassword", { 
              validate: (val) => {
                if (watch('password') != val) {
                  return "Your passwords do no match";
                }
              }
             })}
            className="w-full border rounded p-2"
            type="password"
          />
          {errors.confirmPassword && <span className="text-red-500 text-sm">{errors.confirmPassword.message}</span>}
        </div>
        <button type="submit" className="w-full bg-green-600 text-white p-2 rounded hover:bg-green-700">
          Register
        </button>
      </form>
      <p className="mt-4 text-center text-sm">
        Already have an account? <Link to="/login" className="text-blue-600">Login</Link>
      </p>
    </div>
  );
}
