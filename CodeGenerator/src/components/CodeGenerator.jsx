import React, { useState, useEffect } from 'react';

const CodeGenerator = ({ onCodeGenerated, userData }) => {
  const [formData, setFormData] = useState({
    name: '',
    dni: '',
    birthdate: '',
    instagram: '',
  });

  const [error, setError] = useState('');

  useEffect(() => {
    const lastGeneratedTime = localStorage.getItem('lastGeneratedTime');
    const currentTime = new Date().getTime();

    if (lastGeneratedTime && currentTime - lastGeneratedTime < 24 * 60 * 60 * 1000) {
      setError('Debes esperar 24 horas para generar otro código.');
    } else {
      setError('');
    }
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleGenerateCode = () => {
    const lastGeneratedTime = localStorage.getItem('lastGeneratedTime');
    const currentTime = new Date().getTime();
  
    if (lastGeneratedTime && currentTime - lastGeneratedTime < 24 * 60 * 60 * 1000) {
      setError('Debes esperar 24 horas para generar otro código.');
    } else {
      if (!formData.name || !formData.dni || !formData.birthdate || !formData.instagram) {
        setError('Todos los campos son obligatorios.');
      } else if (!/^\d{7,8}$/.test(formData.dni)) {
        setError('El DNI debe tener entre 7 y 8 números.');
      } else if (!/^@/.test(formData.instagram)) {
        setError('El usuario de Instagram debe comenzar con "@".');
      } else {
        const birthYear = parseInt(formData.birthdate.split('-')[0], 10);
        const currentYear = new Date().getFullYear();
        const age = currentYear - birthYear;

        if (age < 18) {
          setError('Debes ser mayor de 18 años para generar un código.');
        } else {
          const generatedCode = Math.random().toString(36).substring(7);
          localStorage.setItem('lastGeneratedTime', new Date().getTime());
          onCodeGenerated(generatedCode, formData);
        }
      }
    }
  };

  return (
    <div>
      <div className="field">
        <label className="label">Nombre</label>
        <div className="control">
          <input
            className="input"
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
          />
        </div>
      </div>
      <div className="field">
        <label className="label">DNI</label>
        <div className="control">
          <input
            className="input"
            type="text"
            name="dni"
            value={formData.dni}
            onChange={handleInputChange}
          />
        </div>
      </div>
      <div className="field">
        <label className="label">Fecha de Nacimiento</label>
        <div className="control">
          <input
            className="input"
            type="date"
            name="birthdate"
            value={formData.birthdate}
            onChange={handleInputChange}
          />
        </div>
      </div>
      <div className="field">
        <label className="label">Usuario de Instagram</label>
        <div className="control">
          <input
            className="input"
            type="text"
            name="instagram"
            value={formData.instagram}
            onChange={handleInputChange}
          />
        </div>
      </div>
      <button className="button is-primary" onClick={handleGenerateCode}>
        Generar Código
      </button>
      {error && (
        <div className="notification is-danger is-small" style={{ padding: '10px', marginTop: '15px' }}>
          <button className="delete" onClick={() => setError('')}></button>
          {error}
        </div>
      )}
    </div>
  );
};

export { CodeGenerator };
