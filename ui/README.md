# Emotion Detection UI

A modern, responsive React frontend for the Emotion Detection AI project.

## Features

- 🎨 **Modern Glass Morphism Design** - Beautiful, modern interface with glass effects
- 📱 **Fully Responsive** - Works perfectly on desktop, tablet, and mobile
- 🖼️ **Drag & Drop Upload** - Easy image uploading with visual feedback
- 📊 **Interactive Charts** - Beautiful emotion breakdown visualization
- 😊 **Emoji Integration** - Visual emotion representation with emojis
- ⚡ **Real-time Analysis** - Instant emotion detection results
- 📥 **Download Reports** - Export analysis results as JSON
- 🎭 **Multiple Emotions** - Detects 7 different emotions with confidence scores

## Technology Stack

- **React 18** - Modern React with hooks
- **Framer Motion** - Smooth animations and transitions
- **Recharts** - Beautiful, responsive charts
- **React Dropzone** - Drag and drop file uploading
- **Lucide React** - Beautiful, consistent icons
- **CSS3** - Modern styling with gradients and glassmorphism

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Navigate to the UI directory:
   ```bash
   cd ui
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

### Building for Production

```bash
npm run build
```

## Project Structure

```
src/
├── components/
│   ├── Header.js          # App header with branding
│   ├── ImageUpload.js     # Drag & drop image upload
│   ├── ResultsDisplay.js  # Emotion analysis results
│   ├── Footer.js          # App footer
│   └── *.css             # Component styles
├── App.js                # Main app component
├── App.css              # App-level styles
├── index.js             # React entry point
└── index.css            # Global styles
```

## Features in Detail

### Image Upload
- Drag & drop interface
- File type validation (JPG, PNG, GIF, WebP)
- Visual upload feedback
- Error handling

### Results Display
- Dominant emotion highlighting
- Interactive bar chart
- Detailed emotion breakdown
- Confidence percentages
- Downloadable reports

### Responsive Design
- Mobile-first approach
- Flexible grid layouts
- Touch-friendly interactions
- Optimized for all screen sizes

## API Integration

The frontend communicates with the Node.js backend at `http://localhost:4000/api/emotion` via the proxy configuration in `package.json`.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.
