import * as faceapi from 'face-api.js';

let modelsLoaded = false;
let loadingPromise = null;

export const loadModels = async () => {
  if (modelsLoaded) return;
  if (loadingPromise) return loadingPromise;
  
  loadingPromise = (async () => {
    try {
      const MODEL_URL = '/models';
      await Promise.all([
        faceapi.nets.ssdMobilenetv1.loadFromUri(MODEL_URL),
        faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
        faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL)
      ]);
      modelsLoaded = true;
      console.log('Face-API models loaded successfully');
    } catch (error) {
      console.error('Error loading Face-API models:', error);
      loadingPromise = null;
      throw error;
    }
  })();
  
  return loadingPromise;
};

export const extractFaceDescriptor = async (imageElement) => {
  await loadModels();
  
  const detection = await faceapi
    .detectSingleFace(imageElement)
    .withFaceLandmarks()
    .withFaceDescriptor();
  
  if (!detection) {
    throw new Error('No face detected in image');
  }
  
  return Array.from(detection.descriptor);
};

export const compareFaces = (descriptor1, descriptor2, threshold = 0.6) => {
  const distance = faceapi.euclideanDistance(descriptor1, descriptor2);
  return distance < threshold;
};

export const extractFaceDescriptorFromBase64 = async (base64Image) => {
  await loadModels();
  
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = async () => {
      try {
        const descriptor = await extractFaceDescriptor(img);
        resolve(descriptor);
      } catch (error) {
        reject(error);
      }
    };
    img.onerror = () => reject(new Error('Failed to load image'));
    img.src = base64Image.startsWith('data:') ? base64Image : `data:image/jpeg;base64,${base64Image}`;
  });
};
