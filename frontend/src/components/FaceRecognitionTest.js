import React, { useState, useEffect } from 'react';
import { loadModels, extractFaceDescriptorFromBase64 } from '../utils/faceRecognition';

function FaceRecognitionTest() {
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState(null);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadModels()
      .then(() => {
        setModelsLoaded(true);
        console.log('Face-API.js models loaded successfully');
      })
      .catch((err) => {
        setError('Failed to load models: ' + err.message);
        console.error('Model loading error:', err);
      });
  }, []);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      const base64 = event.target.result;
      setImage(base64);
      setResult(null);
      setError(null);

      setLoading(true);
      try {
        const descriptor = await extractFaceDescriptorFromBase64(base64);
        setResult({
          success: true,
          descriptorLength: descriptor.length,
          firstValues: descriptor.slice(0, 5),
          message: 'Face detected and descriptor extracted successfully!'
        });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div style={{ padding: '40px', maxWidth: '800px', margin: '0 auto' }}>
      <h1>Face Recognition Test</h1>
      
      <div style={{ marginBottom: '20px', padding: '15px', background: modelsLoaded ? '#d4edda' : '#fff3cd', borderRadius: '4px' }}>
        <strong>Models Status:</strong> {modelsLoaded ? '✓ Loaded' : '⏳ Loading...'}
      </div>

      {modelsLoaded && (
        <>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '10px', fontWeight: 'bold' }}>
              Upload Face Photo:
            </label>
            <input 
              type="file" 
              accept="image/*" 
              onChange={handleImageUpload}
              style={{ padding: '10px' }}
            />
          </div>

          {image && (
            <div style={{ marginBottom: '20px' }}>
              <img 
                src={image} 
                alt="Uploaded" 
                style={{ maxWidth: '300px', maxHeight: '300px', borderRadius: '8px', border: '2px solid #ddd' }}
              />
            </div>
          )}

          {loading && (
            <div style={{ padding: '15px', background: '#f0f9ff', borderRadius: '4px', marginBottom: '20px' }}>
              <strong>Processing...</strong> Detecting face and extracting descriptor...
            </div>
          )}

          {result && (
            <div style={{ padding: '15px', background: '#d4edda', borderRadius: '4px', marginBottom: '20px' }}>
              <h3 style={{ margin: '0 0 10px 0', color: '#155724' }}>✓ Success!</h3>
              <p style={{ margin: '5px 0' }}><strong>Message:</strong> {result.message}</p>
              <p style={{ margin: '5px 0' }}><strong>Descriptor Length:</strong> {result.descriptorLength} values</p>
              <p style={{ margin: '5px 0' }}><strong>First 5 Values:</strong> [{result.firstValues.map(v => v.toFixed(3)).join(', ')}...]</p>
            </div>
          )}

          {error && (
            <div style={{ padding: '15px', background: '#f8d7da', borderRadius: '4px', marginBottom: '20px', color: '#721c24' }}>
              <h3 style={{ margin: '0 0 10px 0' }}>✗ Error</h3>
              <p style={{ margin: 0 }}>{error}</p>
            </div>
          )}
        </>
      )}

      <div style={{ marginTop: '40px', padding: '20px', background: '#f8f9fa', borderRadius: '4px' }}>
        <h3>Instructions:</h3>
        <ol>
          <li>Wait for models to load (should take 2-5 seconds)</li>
          <li>Upload a clear photo with a visible face</li>
          <li>The system will detect the face and extract a 128-number descriptor</li>
          <li>If successful, you'll see the descriptor details</li>
        </ol>
        <p style={{ marginTop: '15px', fontSize: '14px', color: '#666' }}>
          <strong>Tips:</strong> Use a frontal face photo with good lighting for best results.
        </p>
      </div>
    </div>
  );
}

export default FaceRecognitionTest;
