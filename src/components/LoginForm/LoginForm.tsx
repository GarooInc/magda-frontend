import { useState } from 'react';
import { IoEye } from "react-icons/io5";
import { IoMdEyeOff } from "react-icons/io";
import Toast from '../Toast/Toast';
import { signIn } from '../../lib/auth';
import { useNavigate } from 'react-router-dom'; 

type ToastType = 'error' | 'success' | 'warning' | 'info';

type Notification = {
  message: string;
  type: ToastType; 
};

const LoginForm = () => {
  
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState<Notification | null>(null);
  const navigate = useNavigate();


  const showNotification = (message: string, type: ToastType) => {
    setNotification({ message: message, type: type });
  };

  const clearNotification = () => {
    setNotification(null);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    if (!username.trim() || !password.trim()) {
      showNotification('Por favor complete todos los campos', 'warning');
      setIsLoading(false);
      return;
    }

    try {
      const session = await signIn(username.trim(), password.trim());

      const idToken = session.tokens?.idToken?.toString() ?? '';
      localStorage.setItem('cognitoToken', idToken);

      const shortUsername = username.trim().substring(0, 5);
      localStorage.setItem('username', shortUsername);

      showNotification('Inicio de sesión exitoso', 'success');

      setTimeout(() => {
        clearNotification();
        navigate('/panel-finca');
      }, 1000);
    } catch (error: unknown) {
      let errorMessage = 'Error desconocido';
      if (typeof error === 'string') {
        errorMessage = error;
      } else if (error && typeof error === 'object') {
        const maybe = error as { message?: string; name?: string };
        if (maybe?.message) errorMessage = maybe.message;
        else if (maybe?.name) errorMessage = maybe.name;
      }
      showNotification(errorMessage, 'error');
      setPassword('');
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <>
      <div className="card bg-white w-full max-w-sm shrink-0 shadow-2xl">
        <form className="card-body" onSubmit={handleSubmit}>
          <div className="form-control">
            <label className="label font-gotham">
              <span className="text-black">Usuario</span>
            </label>
            <input 
              type="text" 
              placeholder="Usuario" 
              className="input input-bordered bg-gray-200 text-black shadow-md w-full rounded-xl" 
              required 
              value={username}
              onChange={handleUsernameChange}
              disabled={isLoading}
            />
          </div>

          <div className="form-control">
            <label className="label">
              <span className="text-black">Contraseña</span>
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Contraseña"
                className="input input-bordered w-full pr-10 bg-gray-200 text-black shadow-md rounded-xl"
                required
                value={password}
                onChange={handlePasswordChange}
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute top-1/2 right-2 transform -translate-y-1/2"
                disabled={isLoading}
              >
                {showPassword ? (
                  <IoMdEyeOff className="h-5 w-5 text-black cursor-pointer" />
                ) : (
                  <IoEye className="h-5 w-5 text-black cursor-pointer" />
                )}
              </button>
            </div>
            <label className="label font-gotham">
              <a href="#" className="label-text-alt link link-hover text-gray-600">
                ¿Olvidaste tu contraseña?
              </a>
            </label>
          </div>

          <div className="form-control mt-6">
            <button 
              type="submit"
              className="btn w-full bg-[#200085] text-white hover:bg-[#200085] border-none rounded-xl"
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="loading loading-spinner"></span>
              ) : (
                'Iniciar sesión'
              )}
            </button>
          </div>
        </form>
      </div>

      {notification && (
        <Toast
          message={notification.message}
          type={notification.type}
          onClose={clearNotification}
        />
      )}
    </>
  );
};

export default LoginForm;