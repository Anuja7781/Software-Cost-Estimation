# Software Cost Estimation Frontend

React-based web interface for the Software Cost Estimation API with Explainable AI.

## Features

- **Interactive Project Form**: Input all NASA93 project characteristics
- **Cost Prediction**: Get instant cost estimates in person-months
- **Explainable AI**: View SHAP and LIME explanations for predictions
- **Responsive Design**: Works on desktop and mobile devices
- **Real-time Results**: Live updates as you modify project parameters

## Tech Stack

- **React 19**: Modern React with hooks
- **Axios**: HTTP client for API communication
- **CSS3**: Custom styling with gradients and animations
- **Responsive Design**: Mobile-first approach

## Setup

1. Ensure the backend API is running on `http://localhost:8000`

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

The app will open at `http://localhost:3000`

## Project Structure

```
src/
├── components/
│   ├── ProjectForm.js    # Main input form
│   ├── ProjectForm.css   # Form styling
│   ├── Results.js        # Results display
│   └── Results.css       # Results styling
├── services/
│   └── api.js           # API communication
├── App.js               # Main app component
├── App.css              # Main app styling
└── index.js             # App entry point
```

## Usage

1. **Fill Project Details**: Enter project size (KLOC), year, and select relevant characteristics
2. **Get Cost Estimate**: Click "Get Cost Estimate" for basic prediction
3. **View Explanations**: Click "Get Explanation" for detailed SHAP analysis
4. **Full Analysis**: Click "Full Analysis" for both prediction and explanations

## API Integration

The frontend communicates with the FastAPI backend:

- `POST /predict` - Cost prediction with feature importance
- `POST /explain` - Detailed SHAP explanations
- `GET /health` - Backend health check

## Environment Variables

Create a `.env` file to configure the API URL:

```
REACT_APP_API_URL=http://localhost:8000
```

## Build for Production

```bash
npm run build
```

This creates an optimized production build in the `build/` folder.

## Deployment

The built files can be served by any static web server or deployed to:

- Netlify
- Vercel
- GitHub Pages
- AWS S3 + CloudFront
- Traditional web hosting

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Contributing

1. Follow React best practices
2. Use functional components with hooks
3. Maintain responsive design
4. Test API integration thoroughly

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
