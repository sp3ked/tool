import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowRightLeft } from 'lucide-react';
import './tools.css';

const UnitConverter = () => {
  const [category, setCategory] = useState('length');
  const [fromUnit, setFromUnit] = useState('');
  const [toUnit, setToUnit] = useState('');
  const [inputValue, setInputValue] = useState('');
  const [result, setResult] = useState('');

  // Wrap categories in useMemo to prevent re-creation on each render
  const categories = useMemo(() => ({
    length: {
      name: 'Length',
      units: {
        meters: { name: 'Meters (m)', factor: 1 },
        kilometers: { name: 'Kilometers (km)', factor: 1000 },
        centimeters: { name: 'Centimeters (cm)', factor: 0.01 },
        millimeters: { name: 'Millimeters (mm)', factor: 0.001 },
        inches: { name: 'Inches (in)', factor: 0.0254 },
        feet: { name: 'Feet (ft)', factor: 0.3048 },
        yards: { name: 'Yards (yd)', factor: 0.9144 },
        miles: { name: 'Miles (mi)', factor: 1609.344 }
      }
    },
    weight: {
      name: 'Weight',
      units: {
        kilograms: { name: 'Kilograms (kg)', factor: 1 },
        grams: { name: 'Grams (g)', factor: 0.001 },
        milligrams: { name: 'Milligrams (mg)', factor: 0.000001 },
        pounds: { name: 'Pounds (lb)', factor: 0.45359237 },
        ounces: { name: 'Ounces (oz)', factor: 0.028349523125 }
      }
    },
    temperature: {
      name: 'Temperature',
      units: {
        celsius: { name: 'Celsius (°C)' },
        fahrenheit: { name: 'Fahrenheit (°F)' },
        kelvin: { name: 'Kelvin (K)' }
      }
    },
    volume: {
      name: 'Volume',
      units: {
        liters: { name: 'Liters (L)', factor: 1 },
        milliliters: { name: 'Milliliters (mL)', factor: 0.001 },
        cubicMeters: { name: 'Cubic Meters (m³)', factor: 1000 },
        gallons: { name: 'Gallons (gal)', factor: 3.78541 },
        quarts: { name: 'Quarts (qt)', factor: 0.946353 },
        cups: { name: 'Cups (cup)', factor: 0.236588 }
      }
    }
  }), []);

  // Wrap convertTemperature in useCallback to prevent re-creation on each render
  const convertTemperature = useCallback((value, from, to) => {
    let converted;
    let celsius;
    switch (from) {
      case 'celsius':
        celsius = value;
        break;
      case 'fahrenheit':
        celsius = (value - 32) * 5/9;
        break;
      case 'kelvin':
        celsius = value - 273.15;
        break;
      default:
        return 0;
    }
    switch (to) {
      case 'celsius':
        converted = celsius;
        break;
      case 'fahrenheit':
        converted = (celsius * 9/5) + 32;
        break;
      case 'kelvin':
        converted = celsius + 273.15;
        break;
      default:
        converted = 0;
    }
    return converted;
  }, []);

  useEffect(() => {
    // Set default units when category changes
    const categoryUnits = Object.keys(categories[category].units);
    setFromUnit(categoryUnits[0]);
    setToUnit(categoryUnits[1]);
  }, [category, categories]);

  useEffect(() => {
    if (!inputValue) {
      setResult('');
      return;
    }

    const value = parseFloat(inputValue);
    if (isNaN(value)) {
      setResult('Invalid input');
      return;
    }

    let converted;
    if (category === 'temperature') {
      converted = convertTemperature(value, fromUnit, toUnit);
    } else {
      const fromFactor = categories[category].units[fromUnit].factor;
      const toFactor = categories[category].units[toUnit].factor;
      converted = (value * fromFactor) / toFactor;
    }

    setResult(converted.toLocaleString(undefined, { 
      maximumFractionDigits: 6,
      minimumFractionDigits: 0
    }));
  }, [inputValue, fromUnit, toUnit, category, categories, convertTemperature]);

  const swapUnits = () => {
    setFromUnit(toUnit);
    setToUnit(fromUnit);
  };

  return (
    <div className="tool-page">
      <div className="tool-header">
        <Link to="/" className="back-button">
          <ArrowLeft size={24} />
          <span>Back to Tools</span>
        </Link>
        <h1 className="tool-title">Unit Converter</h1>
        <p className="tool-subtitle">Convert between different units of measurement</p>
      </div>

      <div className="tool-content">
        <div className="converter-container">
          {/* Category Selection */}
          <div className="input-group">
            <label htmlFor="category">Category</label>
            <select
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="tool-select"
            >
              {Object.entries(categories).map(([key, value]) => (
                <option key={key} value={key}>{value.name}</option>
              ))}
            </select>
          </div>

          {/* Conversion Inputs */}
          <div className="conversion-row">
            <div className="conversion-group">
              <input
                type="number"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Enter value"
                className="tool-input"
              />
              <select
                value={fromUnit}
                onChange={(e) => setFromUnit(e.target.value)}
                className="tool-select"
              >
                {Object.entries(categories[category].units).map(([key, unit]) => (
                  <option key={key} value={key}>{unit.name}</option>
                ))}
              </select>
            </div>

            <button 
              onClick={swapUnits}
              className="swap-button"
              title="Swap units"
            >
              <ArrowRightLeft size={24} />
            </button>

            <div className="conversion-group">
              <input
                type="text"
                value={result}
                readOnly
                placeholder="Result"
                className="tool-input"
              />
              <select
                value={toUnit}
                onChange={(e) => setToUnit(e.target.value)}
                className="tool-select"
              >
                {Object.entries(categories[category].units).map(([key, unit]) => (
                  <option key={key} value={key}>{unit.name}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UnitConverter;
