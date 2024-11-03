import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Copy, Upload, Download, RefreshCw } from 'lucide-react';
import './tools.css';

const JSONFormatter = () => {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [indentSize, setIndentSize] = useState(2);
  const [copied, setCopied] = useState(false);

  const formatJSON = () => {
    if (!input.trim()) {
      setError('Please enter JSON to format');
      setOutput('');
      return;
    }

    try {
      // Parse the input to validate it
      const parsed = JSON.parse(input);
      // Stringify with proper indentation
      const formatted = JSON.stringify(parsed, null, indentSize);
      setOutput(formatted);
      setError('');
    } catch (err) {
      setError('Invalid JSON: ' + err.message);
      setOutput('');
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(output);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const handleUpload = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result;
        if (typeof content === 'string') {
          setInput(content);
          setError('');
        }
      };
      reader.readAsText(file);
    }
  };

  const handleDownload = () => {
    if (!output) return;
    
    const blob = new Blob([output], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'formatted.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleMinify = () => {
    if (!input.trim()) {
      setError('Please enter JSON to minify');
      setOutput('');
      return;
    }

    try {
      const parsed = JSON.parse(input);
      const minified = JSON.stringify(parsed);
      setOutput(minified);
      setError('');
    } catch (err) {
      setError('Invalid JSON: ' + err.message);
      setOutput('');
    }
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setInput(text);
    } catch (err) {
      console.error('Failed to paste: ', err);
    }
  };

  return (
    <div className="tool-page">
      <div className="tool-header">
        <Link to="/" className="back-button">
          <ArrowLeft size={24} />
          <span>Back to Tools</span>
        </Link>
        <h1 className="tool-title">JSON Formatter</h1>
        <p className="tool-subtitle">Format, validate, and beautify JSON data</p>
      </div>

      <div className="tool-content">
        <div className="json-container">
          <div className="json-controls">
            <div className="input-group">
              <label htmlFor="indent">Indent Size</label>
              <select
                id="indent"
                value={indentSize}
                onChange={(e) => setIndentSize(Number(e.target.value))}
                className="tool-select"
              >
                <option value="2">2 spaces</option>
                <option value="4">4 spaces</option>
                <option value="8">8 spaces</option>
              </select>
            </div>

            <div className="button-group">
              <label className="file-input-label">
                <input
                  type="file"
                  accept=".json"
                  onChange={handleUpload}
                  className="file-input"
                />
                <Upload size={20} />
                Upload
              </label>

              <button 
                onClick={handlePaste}
                className="tool-button icon-button"
              >
                <RefreshCw size={20} />
                Paste
              </button>
            </div>
          </div>

          <div className="json-editor-grid">
            <div className="json-section">
              <div className="json-header">
                <h3>Input JSON</h3>
              </div>
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Paste your JSON here..."
                className="json-textarea"
              />
            </div>

            <div className="json-actions">
              <button 
                onClick={formatJSON}
                className="tool-button"
              >
                Format →
              </button>
              <button 
                onClick={handleMinify}
                className="tool-button secondary"
              >
                Minify →
              </button>
            </div>

            <div className="json-section">
              <div className="json-header">
                <h3>Formatted Output</h3>
                {error && <div className="json-error">{error}</div>}
              </div>
              <textarea
                value={output}
                readOnly
                className={`json-textarea ${error ? 'has-error' : ''}`}
                placeholder="Formatted JSON will appear here..."
              />
              <div className="json-output-actions">
                <button 
                  onClick={copyToClipboard}
                  className="tool-button icon-button"
                  disabled={!output}
                >
                  <Copy size={20} />
                  {copied ? 'Copied!' : 'Copy'}
                </button>
                <button 
                  onClick={handleDownload}
                  className="tool-button icon-button"
                  disabled={!output}
                >
                  <Download size={20} />
                  Download
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JSONFormatter;