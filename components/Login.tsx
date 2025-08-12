
import React, { useState } from 'react';
import { USER_CREDENTIALS } from '../constants';

interface LoginProps {
  onLogin: (email: string) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [email, setEmail] = useState(USER_CREDENTIALS.email);
  const [password, setPassword] = useState(USER_CREDENTIALS.password);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email === USER_CREDENTIALS.email && password === USER_CREDENTIALS.password) {
      setError('');
      onLogin(email);
    } else {
      setError('E-mail ou senha inválidos. Tente novamente.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-sm mx-auto bg-white rounded-2xl shadow-xl p-8">
        <div className="text-center mb-8">
          <img src="https://i.postimg.cc/K8BYfBW9/PNG-GLICOBEM.png" alt="GlicoBem" className="h-12 mx-auto" />
          <p className="text-gray-500 mt-2">Coma bem, com prazer e segurança.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="text-sm font-medium text-gray-700">E-mail</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="acesso@appglicobem.com"
              className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="text-sm font-medium text-gray-700">Senha</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="GlicoBem2024@!"
              className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
              required
            />
          </div>

          {error && <p className="text-sm text-red-600 text-center">{error}</p>}

          <button
            type="submit"
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-lg font-semibold text-white bg-emerald-500 hover:bg-emerald-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition duration-150"
          >
            Entrar
          </button>
        </form>

        <p className="mt-8 text-xs text-center text-gray-500">
          Conteúdo educativo. Não substitui orientação médica.
        </p>
      </div>
    </div>
  );
};

export default Login;