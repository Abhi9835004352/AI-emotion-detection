import React from 'react';

const EmotionResults = ({ results, image, onReset }) => {
    if (!results) return null;

    // Extract emotion data
    const emotionData = results.emotion || {};
    const dominantEmotion = results.dominant_emotion || 'Unknown';
    const faceConfidence = results.face_confidence || 0;

    // Emotion styling with colors and emojis
    const emotionStyles = {
        angry: { color: '#dc3545', emoji: '😠', label: 'Angry', bg: '#fff5f5' },
        disgust: { color: '#6f42c1', emoji: '🤢', label: 'Disgust', bg: '#f8f5ff' },
        fear: { color: '#fd7e14', emoji: '😨', label: 'Fear', bg: '#fff5f0' },
        happy: { color: '#28a745', emoji: '😊', label: 'Happy', bg: '#f0fff4' },
        sad: { color: '#007bff', emoji: '😢', label: 'Sad', bg: '#f0f8ff' },
        surprise: { color: '#ffc107', emoji: '😲', label: 'Surprise', bg: '#fffbf0' },
        neutral: { color: '#6c757d', emoji: '😐', label: 'Neutral', bg: '#f8f9fa' }
    };

    // Convert emotion data to sorted array
    const sortedEmotions = Object.entries(emotionData)
        .map(([emotion, value]) => ({
            emotion: emotion.toLowerCase(),
            value: parseFloat(value),
            style: emotionStyles[emotion.toLowerCase()] || emotionStyles.neutral
        }))
        .sort((a, b) => b.value - a.value);

    const topEmotion = sortedEmotions[0];
    const topEmotionStyle = emotionStyles[dominantEmotion.toLowerCase()] || emotionStyles.neutral;

    return (
        <div style={{
            maxWidth: '900px',
            margin: '30px auto 0',
            background: 'rgba(255, 255, 255, 0.95)',
            borderRadius: '24px',
            padding: '40px',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            boxShadow: '0 20px 60px rgba(102, 126, 234, 0.2)',
            animation: 'fadeInUp 0.6s ease-out'
        }}>
            {/* Header */}
            <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                <h2 style={{
                    fontSize: '2.5rem',
                    fontWeight: '800',
                    background: 'linear-gradient(135deg, #667eea, #764ba2)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                    margin: '0 0 10px 0'
                }}>
                    Emotion Analysis Results
                </h2>
                <p style={{ color: '#4a5568', fontSize: '1.1rem', margin: 0 }}>
                    AI-powered facial emotion recognition
                </p>
            </div>

            {/* Image Display */}
            {image && (
                <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                    <img
                        src={image}
                        alt="Analyzed"
                        style={{
                            maxWidth: '350px',
                            width: '100%',
                            borderRadius: '20px',
                            boxShadow: '0 12px 40px rgba(102, 126, 234, 0.15)',
                            border: '3px solid rgba(255, 255, 255, 0.3)'
                        }}
                    />
                </div>
            )}

            {/* Face Confidence */}
            <div style={{
                background: 'linear-gradient(135deg, #4facfe, #00f2fe)',
                color: 'white',
                padding: '20px',
                borderRadius: '16px',
                textAlign: 'center',
                marginBottom: '30px',
                boxShadow: '0 8px 25px rgba(79, 172, 254, 0.3)'
            }}>
                <h3 style={{ fontSize: '1.2rem', fontWeight: '600', margin: '0 0 8px 0' }}>
                    Face Detection Confidence
                </h3>
                <div style={{ fontSize: '2rem', fontWeight: '700' }}>
                    {(faceConfidence * 100).toFixed(1)}%
                </div>
            </div>

            {/* Dominant Emotion Card */}
            {topEmotion && (
                <div style={{
                    background: `linear-gradient(135deg, ${topEmotionStyle.color}15, ${topEmotionStyle.color}25)`,
                    border: `2px solid ${topEmotionStyle.color}30`,
                    padding: '30px',
                    borderRadius: '20px',
                    textAlign: 'center',
                    marginBottom: '30px',
                    boxShadow: `0 12px 40px ${topEmotionStyle.color}20`
                }}>
                    <div style={{ fontSize: '4rem', marginBottom: '15px' }}>
                        {topEmotionStyle.emoji}
                    </div>
                    <h3 style={{ 
                        fontSize: '2rem', 
                        fontWeight: '700', 
                        color: topEmotionStyle.color,
                        margin: '0 0 10px 0' 
                    }}>
                        {topEmotionStyle.label}
                    </h3>
                    <p style={{ 
                        fontSize: '1.3rem', 
                        color: '#4a5568',
                        fontWeight: '600',
                        margin: 0 
                    }}>
                        Dominant emotion with {(topEmotion.value).toFixed(1)}% confidence
                    </p>
                </div>
            )}

            {/* All Emotions Breakdown */}
            <div style={{ marginBottom: '40px' }}>
                <h3 style={{ 
                    fontSize: '1.5rem', 
                    fontWeight: '700', 
                    color: '#2d3748', 
                    marginBottom: '20px',
                    textAlign: 'center'
                }}>
                    Detailed Emotion Breakdown
                </h3>
                
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                    gap: '15px'
                }}>
                    {sortedEmotions.map((emotion, index) => (
                        <div key={emotion.emotion} style={{
                            background: emotion.style.bg,
                            border: `2px solid ${emotion.style.color}30`,
                            borderRadius: '12px',
                            padding: '20px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '15px',
                            transition: 'transform 0.2s ease',
                            cursor: 'pointer'
                        }}
                        onMouseEnter={(e) => e.target.style.transform = 'translateY(-2px)'}
                        onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
                        >
                            <div style={{ fontSize: '2.5rem' }}>
                                {emotion.style.emoji}
                            </div>
                            <div style={{ flex: 1 }}>
                                <div style={{
                                    fontSize: '1.1rem',
                                    fontWeight: '600',
                                    color: emotion.style.color,
                                    marginBottom: '5px'
                                }}>
                                    {emotion.style.label}
                                </div>
                                <div style={{
                                    fontSize: '1.5rem',
                                    fontWeight: '700',
                                    color: '#2d3748'
                                }}>
                                    {emotion.value.toFixed(1)}%
                                </div>
                                {/* Progress bar */}
                                <div style={{
                                    width: '100%',
                                    height: '6px',
                                    backgroundColor: '#e2e8f0',
                                    borderRadius: '3px',
                                    overflow: 'hidden',
                                    marginTop: '8px'
                                }}>
                                    <div style={{
                                        width: `${emotion.value}%`,
                                        height: '100%',
                                        backgroundColor: emotion.style.color,
                                        transition: 'width 1s ease-out'
                                    }}></div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Reset Button */}
            <div style={{ textAlign: 'center' }}>
                <button 
                    onClick={onReset}
                    style={{
                        background: 'linear-gradient(135deg, #667eea, #764ba2)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '50px',
                        padding: '15px 35px',
                        fontSize: '16px',
                        fontWeight: '600',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        boxShadow: '0 8px 25px rgba(102, 126, 234, 0.3)',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '10px'
                    }}
                    onMouseEnter={(e) => {
                        e.target.style.transform = 'translateY(-3px)';
                        e.target.style.boxShadow = '0 12px 35px rgba(102, 126, 234, 0.4)';
                    }}
                    onMouseLeave={(e) => {
                        e.target.style.transform = 'translateY(0)';
                        e.target.style.boxShadow = '0 8px 25px rgba(102, 126, 234, 0.3)';
                    }}
                >
                    🔄 Analyze Another Image
                </button>
            </div>
        </div>
    );
};

export default EmotionResults;
