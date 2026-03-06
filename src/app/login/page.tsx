"use client";

import { useState } from 'react';
import { apiClient } from '../../services/api';

export default function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const endpoint = isLogin ? '/users/login' : '/users/register';
      const response = await apiClient.post(endpoint, formData);
      
      if (response.data.success) {
        // Guardamos la sesión en el navegador
        localStorage.setItem('soa_user', JSON.stringify(response.data.data));
        window.location.href = '/'; // Redirigimos al inicio
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al procesar la solicitud');
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '4rem auto', backgroundColor: 'var(--card-bg)', padding: '2rem', borderRadius: '8px' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '1.5rem' }}>{isLogin ? 'Iniciar Sesión' : 'Crear Cuenta'}</h2>
      
      {error && <p style={{ color: '#ef4444', marginBottom: '1rem', textAlign: 'center' }}>{error}</p>}
      
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {!isLogin && (
          <input 
            type="text" placeholder="Tu Nombre" required
            onChange={e => setFormData({...formData, name: e.target.value})}
            style={{ padding: '0.75rem', borderRadius: '4px', border: '1px solid #475569', background: '#0f172a', color: '#fff' }}
          />
        )}
        <input 
          type="email" placeholder="Correo Electrónico" required
          onChange={e => setFormData({...formData, email: e.target.value})}
          style={{ padding: '0.75rem', borderRadius: '4px', border: '1px solid #475569', background: '#0f172a', color: '#fff' }}
        />
        <input 
          type="password" placeholder="Contraseña" required
          onChange={e => setFormData({...formData, password: e.target.value})}
          style={{ padding: '0.75rem', borderRadius: '4px', border: '1px solid #475569', background: '#0f172a', color: '#fff' }}
        />
        <button type="submit" style={{ padding: '0.75rem', backgroundColor: 'var(--primary)', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
          {isLogin ? 'Entrar' : 'Registrarse'}
        </button>
      </form>

      <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.875rem' }}>
        {isLogin ? '¿No tienes cuenta? ' : '¿Ya tienes cuenta? '}
        <span onClick={() => setIsLogin(!isLogin)} style={{ color: 'var(--accent)', cursor: 'pointer', textDecoration: 'underline' }}>
          {isLogin ? 'Regístrate' : 'Inicia Sesión'}
        </span>
      </p>
    </div>
  );
}