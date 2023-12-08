import React, { useState, useEffect } from 'react';
import 'bulma/css/bulma.css';
import { CodeGenerator } from './components/CodeGenerator.jsx';
import html2canvas from 'html2canvas';
import { format, isAfter, differenceInSeconds, add } from 'date-fns';
import './App.css';

function App() {
  const [hasCode, setHasCode] = useState(false);
  const [userData, setUserData] = useState({});
  const [nextGenerationTime, setNextGenerationTime] = useState(null);
  const [showForm, setShowForm] = useState(true);
  const [countdown, setCountdown] = useState(0);

  useEffect(() => {
    const savedCode = localStorage.getItem('generatedCode');
    if (savedCode) {
      setHasCode(true);
      const savedUserData = JSON.parse(localStorage.getItem('userData'));
      setUserData(savedUserData);
      const nextGenTime = localStorage.getItem('nextGenerationTime');
      setNextGenerationTime(nextGenTime ? new Date(nextGenTime) : null);

      if (nextGenTime && isAfter(new Date(), new Date(nextGenTime))) {
        setShowForm(true);
      } else {
        setShowForm(false);
        startCountdown();
      }
    }
  }, []);

  useEffect(() => {
    const calculateCountdown = () => {
      if (nextGenerationTime) {
        const secondsUntilNextGen = differenceInSeconds(nextGenerationTime, new Date());
        setCountdown(secondsUntilNextGen > 0 ? secondsUntilNextGen : 0);
      }
    };

    calculateCountdown();

    const countdownInterval = setInterval(calculateCountdown, 1000);

    return () => clearInterval(countdownInterval);
  }, [nextGenerationTime]);

  const handleCodeGenerated = (code, user) => {
    localStorage.setItem('generatedCode', code);
    localStorage.setItem('userData', JSON.stringify(user));

    const nextGenTime = add(new Date(), { days: 1 });
    localStorage.setItem('nextGenerationTime', nextGenTime.toISOString());

    setHasCode(true);
    setUserData(user);
    setNextGenerationTime(nextGenTime);
    setShowForm(false);
    startCountdown();
  };

  const handleDownloadCode = () => {
    const codeContainer = document.getElementById('code-container');

    if (codeContainer) {
      html2canvas(codeContainer).then((canvas) => {
        const link = document.createElement('a');
        link.href = canvas.toDataURL('image/jpeg');
        link.download = `generated_code.jpg`;
        link.click();
      });
    }
  };

  const handleShowForm = () => {
    setShowForm(true);
  };

  const startCountdown = () => {
    if (countdown > 0) {
      const countdownInterval = setInterval(() => {
        setCountdown((prevCountdown) => (prevCountdown > 0 ? prevCountdown - 1 : 0));
      }, 1000);

      setTimeout(() => {
        clearInterval(countdownInterval);
        setShowForm(true);
      }, countdown * 1000);
    }
  };

  return (
    <div className="App">
      <div className="background-container">
        <div className="container">
          {hasCode ? (
            <div>
              <div id="code-container" className="p-1">
                <div className="has-text-centered mt-4 m-4">
                  <h2 className="title is-3">Aquí está tu código de descuento</h2>
                  <p className="subtitle is-1 has-text-primary">
                    {localStorage.getItem('generatedCode')}
                  </p>
                  
                  <div className="mt-4">
                    <p className="is-size-5">
                      <strong>Nombre:</strong> {userData.name}
                    </p>
                    <p className="is-size-5">
                      <strong>DNI:</strong> {userData.dni}
                    </p>
                    <p className="is-size-5">
                      <strong>Generado el:</strong> {format(nextGenerationTime, "dd/MM/yyyy 'a las' HH:mm")}
                    </p>
                  </div>
                  
                  <p>¡Mostra este código cuando vayas a pagar tu pedido para obtener un descuento por tu cerveza!</p>
                </div>
              </div>
              {countdown > 0 && (
                <div className="has-text-centered">
                  <p>
                    <strong>Podes volver a pedir un código en:</strong> {formatCountdown(countdown)}
                  </p>
                </div>
              )}
              <div className="has-text-centered mt-4">
                <button onClick={handleDownloadCode} className="button is-primary">
                  Descargar Código como JPG
                </button>
              </div>
            </div>
          ) : (
            <div>
              <header className="App-header">
                <h1 className="main-title">¡Genera tu cúpon para cerveza!</h1>
              </header>
              {showForm && (
                <CodeGenerator
                  onCodeGenerated={handleCodeGenerated}
                  userData={userData}
                  onShowForm={() => setShowForm(true)}
                />
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const formatCountdown = (seconds) => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  return `${hours} horas y ${minutes} minutos`;
};

export { App };
