import React, { useState, useEffect } from 'react';
import { testAPI } from '../api/test';

const TestConnection = () => {
  const [status, setStatus] = useState('checking');
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const checkConnection = async () => {
      try {
        const result = await testAPI.testConnection();
        
        if (result.success) {
          setStatus('connected');
          setData(result.data);
        } else {
          setStatus('error');
          setError(`Error ${result.status}: ${result.error}`);
        }
      } catch (err) {
        setStatus('error');
        setError(err.message);
      }
    };

    checkConnection();
  }, []);

  const handleRetry = async () => {
    setStatus('checking');
    setError(null);
    
    try {
      const result = await testAPI.testConnection();
      
      if (result.success) {
        setStatus('connected');
        setData(result.data);
      } else {
        setStatus('error');
        setError(`Error ${result.status}: ${result.error}`);
      }
    } catch (err) {
      setStatus('error');
      setError(err.message);
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial' }}>
      <h1>Prueba de Conexión Backend</h1>
      
      <div style={{ 
        padding: '15px', 
        borderRadius: '5px',
        backgroundColor: status === 'connected' ? '#d4edda' : 
                        status === 'error' ? '#f8d7da' : '#fff3cd',
        border: `1px solid ${
          status === 'connected' ? '#c3e6cb' : 
          status === 'error' ? '#f5c6cb' : '#ffeaa7'
        }`
      }}>
        <h3>Estado: 
          <span style={{ 
            color: status === 'connected' ? '#155724' : 
                   status === 'error' ? '#721c24' : '#856404'
          }}>
            {status === 'checking' ? 'Verificando...' : 
             status === 'connected' ? 'Conectado ✓' : 'Error ✗'}
          </span>
        </h3>
        
        {status === 'connected' && data && (
          <div>
            <p><strong>Servicio:</strong> {data.service}</p>
            <p><strong>Mensaje:</strong> {data.message}</p>
            <p><strong>URL del backend:</strong> {import.meta.env.VITE_API_URL}</p>
          </div>
        )}
        
        {status === 'error' && (
          <div>
            <p><strong>Error:</strong> {error}</p>
            <p><strong>Sugerencias:</strong></p>
            <ul>
              <li>Verifica que el backend esté corriendo</li>
              <li>Revisa la URL en VITE_API_URL</li>
              <li>Comprueba los logs del contenedor backend</li>
            </ul>
            <button onClick={handleRetry} style={{ 
              padding: '8px 16px',
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}>
              Reintentar conexión
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TestConnection;