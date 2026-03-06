"use client"; // Lo hacemos client component para poder leer el localStorage

import './globals.css';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<{name: string} | null>(null);

  useEffect(() => {
    // Revisamos si hay un usuario logueado en el navegador
    const storedUser = localStorage.getItem('soa_user');
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('soa_user');
    window.location.href = '/login';
  };

  return (
    <html lang="es">
      <body>
        <header style={{ padding: '1.5rem 2rem', borderBottom: '1px solid #334155', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h1 style={{ margin: 0 }}>🎬 Movie App SOA</h1>
          <nav style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
            <Link href="/" style={{ color: 'var(--foreground)', textDecoration: 'none' }}>Inicio</Link>
            {user ? (
              <>
                <Link href="/favorites" style={{ color: 'var(--foreground)', textDecoration: 'none' }}>Mis Favoritos</Link>
                <span style={{ color: 'var(--accent)' }}>Hola, {user.name}</span>
                <button onClick={handleLogout} style={{ background: 'transparent', border: '1px solid #ef4444', color: '#ef4444', padding: '0.5rem 1rem', borderRadius: '4px', cursor: 'pointer' }}>Salir</button>
              </>
            ) : (
              <Link href="/login" style={{ backgroundColor: 'var(--primary)', padding: '0.5rem 1rem', borderRadius: '4px', color: '#fff', textDecoration: 'none' }}>Iniciar Sesión</Link>
            )}
          </nav>
        </header>
        <main className="container">
          {children}
        </main>
      </body>
    </html>
  );
}