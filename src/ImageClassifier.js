// src/ImageClassifier.js
import React, { useState } from 'react';
import * as mobilenet from '@tensorflow-models/mobilenet';
import '@tensorflow/tfjs';

const ImageClassifier = () => {
  const [image, setImage] = useState(null);
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);

  // Load the MobileNet model
  const loadModel = async () => {
    setLoading(true);
    const model = await mobilenet.load();
    setLoading(false);
    return model;
  };

  // Handle image change
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result);
        setPrediction(null);
      };
      reader.readAsDataURL(file);
    }
  };

  // Make prediction
  const handleClassify = async () => {
    if (image) {
      setLoading(true);
      const model = await loadModel();
      const imgElement = document.getElementById('image');
      const predictions = await model.classify(imgElement);
      setPrediction(predictions);
      setLoading(false);
    }
  };

  return (
    <div style={{ textAlign: 'center', padding: '20px' }}>
      <h1>Image Classifier using TensorFlow.js</h1>

      <input
        type="file"
        accept="image/*"
        onChange={handleImageChange}
        style={{ margin: '20px' }}
      />

      {image && (
        <div>
          <img
            id="image"
            src={image}
            alt="Selected"
            style={{ maxWidth: '100%', maxHeight: '400px', marginBottom: '20px' }}
          />
        </div>
      )}
      <div>
      <button
        onClick={handleClassify}
        disabled={loading}
        style={{
          padding: '10px 20px',
          fontSize: '16px',
          cursor: 'pointer',
          backgroundColor: '#4CAF50',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
        }}
      >
        {loading ? 'Classifying...' : 'Classify Image'}
      </button>
      </div>

      {prediction && (
        <div style={{ marginTop: '20px' }}>
          <h3>Prediction:</h3>
          <ul>
            {prediction.map((item, index) => (
              <li key={index}>
                <strong>{item.className}</strong> - {Math.round(item.probability * 100)}%
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ImageClassifier;
