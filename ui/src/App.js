import React, { useState, useRef } from 'react';
import EmotionResults from './components/EmotionResults';
import './App.css';

function App() {
    const [results, setResults] = useState(null);
    const [loading, setLoading] = useState(false);
    const [capturedImage, setCapturedImage] = useState(null);
    const [error, setError] = useState('');
    const [showCamera, setShowCamera] = useState(false);
    const [stream, setStream] = useState(null);

    const videoRef = useRef(null);
    const fileInputRef = useRef(null);

    // Start camera preview
    const startCamera = async () => {
        try {
            setError('');
            const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true });
            setStream(mediaStream);
            setShowCamera(true);

            // Wait a bit then set video source
            setTimeout(() => {
                if (videoRef.current) {
                    videoRef.current.srcObject = mediaStream;
                }
            }, 100);
        } catch (err) {
            setError('Camera access denied. Please allow camera permissions and try again.');
        }
    };

    // Capture photo from preview
    const capturePhoto = async () => {
        if (!videoRef.current || !stream) return;

        setLoading(true);

        const video = videoRef.current;
        const canvas = document.createElement('canvas');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        const ctx = canvas.getContext('2d');
        ctx.drawImage(video, 0, 0);

        // Stop camera
        stream.getTracks().forEach(track => track.stop());
        setShowCamera(false);

        // Convert to blob and analyze
        canvas.toBlob(async (blob) => {
            const imageUrl = URL.createObjectURL(blob);
            setCapturedImage(imageUrl);

            const formData = new FormData();
            formData.append('image', blob, 'camera-capture.jpg');

            try {
                const response = await fetch('http://localhost:4000/analyze', {
                    method: 'POST',
                    body: formData
                });

                const result = await response.json();
                setResults(result);
            } catch (err) {
                setError('Analysis failed. Please try again.');
            } finally {
                setLoading(false);
            }
        });
    };

    // Cancel camera
    const cancelCamera = () => {
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
        }
        setShowCamera(false);
        setStream(null);
    };

    // File upload function
    const handleFileUpload = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        try {
            setLoading(true);
            setError('');

            const imageUrl = URL.createObjectURL(file);
            setCapturedImage(imageUrl);

            const formData = new FormData();
            formData.append('image', file);

            const response = await fetch('http://localhost:4000/analyze', {
                method: 'POST',
                body: formData
            });

            const result = await response.json();
            setResults(result);
        } catch (err) {
            setError('Upload failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    // Reset function
    const reset = () => {
        setResults(null);
        setCapturedImage(null);
        setError('');
        setLoading(false);
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
        }
        setShowCamera(false);
        setStream(null);
    };

    return (
        <div className="App">
            {/* Header Section */}
            <div className="app-header">
                <h1 className="app-title">AI Emotion Detector</h1>
                <p className="app-subtitle">Discover emotions through advanced facial analysis</p>
            </div>

            <div className="main-content">
                <div className="app-content fade-in-up">
                    {loading && (
                        <div className="loading-state">
                            <div className="loading-spinner"></div>
                            <h3>Analyzing Emotions</h3>
                            <p>Our AI is processing your image...</p>
                        </div>
                    )}

                    {error && (
                        <div className="error-message">
                            ⚠️ {error}
                        </div>
                    )}

                    {!loading && !results && !showCamera && (
                        <>
                            <div className="action-buttons">
                                <button
                                    onClick={startCamera}
                                    className="action-btn camera-btn"
                                    disabled={loading}
                                >
                                    📷 Take Photo
                                </button>

                                <button
                                    onClick={() => fileInputRef.current?.click()}
                                    className="action-btn upload-btn"
                                    disabled={loading}
                                >
                                    📁 Upload Image
                                </button>
                            </div>

                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                onChange={handleFileUpload}
                                style={{ display: 'none' }}
                            />

                            {/* Feature Cards */}
                            <div className="feature-grid">
                                <div className="feature-card">
                                    <div className="feature-icon">🎯</div>
                                    <h3 className="feature-title">Accurate Detection</h3>
                                    <p className="feature-description">
                                        Advanced AI algorithms analyze facial expressions with high precision
                                    </p>
                                </div>
                                <div className="feature-card">
                                    <div className="feature-icon">⚡</div>
                                    <h3 className="feature-title">Real-time Analysis</h3>
                                    <p className="feature-description">
                                        Get instant emotion analysis results in seconds
                                    </p>
                                </div>
                                <div className="feature-card">
                                    <div className="feature-icon">🔒</div>
                                    <h3 className="feature-title">Privacy First</h3>
                                    <p className="feature-description">
                                        Your images are processed locally and never stored
                                    </p>
                                </div>
                                <div className="feature-card">
                                    <div className="feature-icon">📊</div>
                                    <h3 className="feature-title">Detailed Insights</h3>
                                    <p className="feature-description">
                                        Comprehensive emotion breakdown with confidence scores
                                    </p>
                                </div>
                            </div>
                        </>
                    )}

                    {showCamera && (
                        <div className="camera-preview">
                            <h3 style={{ marginBottom: '20px', color: '#2d3748' }}>
                                Position yourself and click capture
                            </h3>
                            <div className="camera-container">
                                <video
                                    ref={videoRef}
                                    autoPlay
                                    playsInline
                                    className="camera-video"
                                />
                                <div className="camera-overlay"></div>
                            </div>
                            <div style={{ marginTop: '20px' }}>
                                <button
                                    onClick={capturePhoto}
                                    className="capture-btn"
                                    style={{ marginRight: '15px' }}
                                >
                                    📸 Capture Photo
                                </button>
                                <button
                                    onClick={cancelCamera}
                                    style={{
                                        background: 'linear-gradient(135deg, #6c757d, #495057)',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '50px',
                                        padding: '15px 30px',
                                        fontSize: '16px',
                                        fontWeight: '600',
                                        cursor: 'pointer',
                                        transition: 'all 0.3s ease',
                                        boxShadow: '0 8px 25px rgba(108, 117, 125, 0.3)'
                                    }}
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    )}

                    {results && (
                        <EmotionResults
                            results={results}
                            image={capturedImage}
                            onReset={reset}
                        />
                    )}
                </div>
            </div>
        </div>
    );
}

export default App;
