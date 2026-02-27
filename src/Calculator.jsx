import { useState, useRef, useEffect } from 'react';
import './Calculator.css';

const operationSymbols = {
  add: '+',
  subtract: '−',
  multiply: '×',
  divide: '÷',
};

function Calculator() {
  const [num1, setNum1] = useState('');
  const [num2, setNum2] = useState('');
  const [operation, setOperation] = useState('add');
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [history, setHistory] = useState(() => {
    try {
      const stored = localStorage.getItem('calculator-history');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });
  const idCounter = useRef(0);
  const hasInteracted = useRef(false);

  // Sync idCounter and hasInteracted with restored history on mount only
  useEffect(() => {
    if (history.length > 0) {
      idCounter.current = Math.max(...history.map(e => e.id));
      hasInteracted.current = true;
    }
  }, []);

  function calculate() {
    setError(null);
    setResult(null);

    const a = parseFloat(num1);
    const b = parseFloat(num2);

    if (num1 === '' || num2 === '') return;

    if (isNaN(a) || isNaN(b)) {
      setError('Please enter valid numbers');
      return;
    }

    let computed;
    switch (operation) {
      case 'add':      computed = a + b; break;
      case 'subtract': computed = a - b; break;
      case 'multiply': computed = a * b; break;
      case 'divide':
        if (b === 0) {
          setError('Cannot divide by zero');
          return;
        }
        computed = a / b;
        break;
      default:
        setError('Unknown operation');
        return;
    }

    // Round to 10 significant decimal places to avoid floating point noise
    const rounded = parseFloat(computed.toFixed(10));

    const entry = {
      id: ++idCounter.current,
      expression: `${a} ${operationSymbols[operation]} ${b}`,
      result: rounded,
      timestamp: new Date(),
    };

    hasInteracted.current = true;
    setHistory(prev => {
      const updatedHistory = [...prev, entry].slice(-10);
      return updatedHistory;
    });

    setResult(rounded);
  }

  // Sync history to localStorage whenever it changes
  useEffect(() => {
    if (hasInteracted.current) {
      localStorage.setItem('calculator-history', JSON.stringify(history));
    }
  }, [history]);

  function clearHistory() {
    hasInteracted.current = true;
    setHistory([]);
    idCounter.current = 0;
  }

  function handleHistoryClick(entry) {
    setNum1(String(entry.result));
    setNum2('');
    setResult(null);
    setError(null);
  }

  return (
    <div className="calculator-wrapper">
      <div className="calculator">
        <h1 className="calculator-title">Simple Calculator</h1>
        <div className="calculator-form">
          <input
            type="number"
            value={num1}
            onChange={(e) => setNum1(e.target.value)}
            placeholder="First number"
            className="calculator-input"
          />
          <select
            value={operation}
            onChange={(e) => setOperation(e.target.value)}
            className="calculator-select"
          >
            <option value="add">Add (+)</option>
            <option value="subtract">Subtract (−)</option>
            <option value="multiply">Multiply (×)</option>
            <option value="divide">Divide (÷)</option>
          </select>
          <input
            type="number"
            value={num2}
            onChange={(e) => setNum2(e.target.value)}
            placeholder="Second number"
            className="calculator-input"
          />
          <button onClick={calculate} className="calculator-button">
            Calculate
          </button>
          {error !== null && (
            <div className="calculator-error">
              {error}
            </div>
          )}
          {error === null && result !== null && (
            <div className="calculator-result">
              Result: {result}
            </div>
          )}
        </div>
      </div>
      <div id="history-panel">
        {history.length === 0 ? (
          hasInteracted.current && <p className="history-empty">No history yet</p>
        ) : (
          <>
            <div className="history-header">
              <span className="history-title">History</span>
              <button onClick={clearHistory} className="history-clear-button">
                Clear
              </button>
            </div>
            <ul className="history-list">
              {history.map((entry) => (
                <li
                  key={entry.id}
                  className="history-item"
                  onClick={() => handleHistoryClick(entry)}
                >
                  {entry.expression} = {entry.result}
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
    </div>
  );
}

export default Calculator;
