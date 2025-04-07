import React, { useState } from 'react';
import { Link2, Copy, ExternalLink, Download, Circle, Square, Triangle, Star } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { useTranslation } from 'react-i18next';

interface QRColorTemplate {
  id: string;
  name: string;
  style: {
    fgColor: string;
    bgColor: string;
  };
}

interface QRShapeTemplate {
  id: string;
  name: string;
  icon: React.ReactNode;
  dotStyle: string;
}

const QR_COLOR_TEMPLATES: QRColorTemplate[] = [
  { id: 'classic', name: '经典黑白', style: { fgColor: '#000000', bgColor: '#FFFFFF' } },
  { id: 'modern-blue', name: '现代蓝', style: { fgColor: '#1EC2FF', bgColor: '#FFFFFF' } },
  { id: 'purple-gradient', name: '紫色', style: { fgColor: '#6259FF', bgColor: '#FFFFFF' } },
  { id: 'neon-green', name: '霓虹绿', style: { fgColor: '#00FF00', bgColor: '#000000' } },
  { id: 'sunset', name: '日落橙', style: { fgColor: '#FF6B6B', bgColor: '#FFE4E4' } },
  { id: 'dark-mode', name: '暗黑模式', style: { fgColor: '#E4E4E7', bgColor: '#18181B' } }
];

const QR_SHAPE_TEMPLATES: QRShapeTemplate[] = [
  { 
    id: 'squares', 
    name: '方形', 
    icon: <Square className="w-4 h-4" />,
    dotStyle: `
      .qr-dot {
        fill-opacity: 1;
        rx: 0;
        ry: 0;
      }
    `
  },
  { 
    id: 'dots', 
    name: '圆形', 
    icon: <Circle className="w-4 h-4" />,
    dotStyle: `
      .qr-dot {
        fill-opacity: 1;
        rx: 100%;
        ry: 100%;
      }
    `
  },
  { 
    id: 'rounded', 
    name: '圆角', 
    icon: <Square className="w-4 h-4 rounded" />,
    dotStyle: `
      .qr-dot {
        fill-opacity: 1;
        rx: 25%;
        ry: 25%;
      }
    `
  },
  { 
    id: 'star', 
    name: '星形', 
    icon: <Star className="w-4 h-4" />,
    dotStyle: `
      .qr-dot {
        fill-opacity: 1;
        clip-path: path('M10,0L13.09,6.58L20,7.64L15,12.76L16.18,20L10,16.58L3.82,20L5,12.76L0,7.64L6.91,6.58Z');
        transform: scale(0.05);
      }
    `
  }
];

const QR_PATTERNS = [
  {
    id: 'solid',
    name: '纯色',
    style: `
      .qr-dot {
        fill-opacity: 1;
      }
    `
  },
  {
    id: 'gradient',
    name: '渐变',
    style: `
      .qr-dot {
        fill: url(#qr-gradient);
      }
    `
  },
  {
    id: 'sketch',
    name: '手绘',
    style: `
      .qr-dot {
        fill-opacity: 0.9;
        stroke: currentColor;
        stroke-width: 0.5;
        stroke-dasharray: 2 2;
        filter: url(#sketch-filter);
      }
    `
  },
  {
    id: 'watercolor',
    name: '水墨',
    style: `
      .qr-dot {
        fill-opacity: 0.8;
        filter: url(#watercolor-filter);
      }
    `
  }
];

export default function URLShortener() {
  const { t } = useTranslation();
  const [url, setUrl] = useState('');
  const [shortenedUrl, setShortenedUrl] = useState('');
  const [selectedColor, setSelectedColor] = useState<QRColorTemplate>(QR_COLOR_TEMPLATES[0]);
  const [selectedShape, setSelectedShape] = useState<QRShapeTemplate>(QR_SHAPE_TEMPLATES[0]);
  const [selectedPattern, setSelectedPattern] = useState(QR_PATTERNS[0]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      // TODO: Implement URL shortening logic
      const shortUrl = 'https://short.url/abc123';
      setShortenedUrl(shortUrl);
    } catch (err) {
      setError(t('urlShortenerPage.error'));
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shortenedUrl);
    } catch (err) {
      setError(t('urlShortenerPage.copyError'));
    }
  };

  const downloadQRCode = () => {
    const svg = document.querySelector('.qr-code-container svg');
    if (!svg) return;
    
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    canvas.width = svg.clientWidth * 2;
    canvas.height = svg.clientHeight * 2;
    
    img.onload = () => {
      if (!ctx) return;
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      
      const link = document.createElement('a');
      link.href = canvas.toDataURL('image/png');
      link.download = 'qrcode.png';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    };
    
    img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
  };

  const combinedStyle = `
    ${selectedShape.dotStyle}
    ${selectedPattern.style}
  `;

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <Link2 className="h-12 w-12 text-primary-400 mx-auto mb-4" />
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary-400 to-secondary-400 text-transparent bg-clip-text">
            {t('urlShortenerPage.title')}
          </h1>
          <p className="text-lg text-gray-300">
            {t('urlShortenerPage.description')}
          </p>
        </div>

        <div className="bg-gradient-to-br from-gray-900/50 to-gray-800/50 rounded-xl border border-gray-700 p-6 md:p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="url" className="block text-sm font-medium text-gray-300 mb-1">
                {t('urlShortenerPage.enterUrl')}
              </label>
              <input
                type="url"
                id="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://example.com/very/long/url"
                required
                className="block w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-primary-400 focus:border-transparent"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-primary-500 to-secondary-500 hover:from-primary-600 hover:to-secondary-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
            >
              {isLoading ? t('urlShortenerPage.processing') : t('urlShortenerPage.shortenButton')}
            </button>
          </form>

          {error && (
            <div className="mt-4 p-4 bg-red-900/50 border border-red-700 rounded-lg">
              <p className="text-sm text-red-400">{error}</p>
            </div>
          )}

          {shortenedUrl && (
            <div className="mt-6 space-y-6">
              <div className="p-4 bg-gray-800/50 rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="flex-1 mr-4">
                    <h3 className="text-sm font-medium text-gray-300">{t('urlShortenerPage.shortenedUrl')}</h3>
                    <p className="mt-1 text-sm text-primary-400">{shortenedUrl}</p>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={copyToClipboard}
                      className="p-2 text-gray-400 hover:text-primary-400 rounded-lg hover:bg-gray-700/50"
                      title={t('urlShortenerPage.copyToClipboard')}
                    >
                      <Copy className="h-5 w-5" />
                    </button>
                    <a
                      href={shortenedUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 text-gray-400 hover:text-primary-400 rounded-lg hover:bg-gray-700/50"
                      title={t('urlShortenerPage.openLink')}
                    >
                      <ExternalLink className="h-5 w-5" />
                    </a>
                  </div>
                </div>
              </div>

              <div className="p-6 bg-gray-800/50 rounded-lg">
                <div className="space-y-6">
                  {/* Color Templates */}
                  <div>
                    <h3 className="text-sm font-medium text-gray-300 mb-3">颜色模板</h3>
                    <div className="grid grid-cols-6 gap-2">
                      {QR_COLOR_TEMPLATES.map((template) => (
                        <button
                          key={template.id}
                          onClick={() => setSelectedColor(template)}
                          className={`p-2 rounded-lg border transition-all ${
                            selectedColor.id === template.id
                              ? 'border-primary-400 bg-primary-400/10'
                              : 'border-gray-700 hover:border-gray-600'
                          }`}
                        >
                          <div 
                            className="w-full aspect-square rounded"
                            style={{ 
                              backgroundColor: template.style.bgColor,
                              border: `2px solid ${template.style.fgColor}`
                            }}
                          />
                          <p className="text-[10px] text-center mt-1 text-gray-300">{template.name}</p>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Shape Templates */}
                  <div>
                    <h3 className="text-sm font-medium text-gray-300 mb-3">形状模板</h3>
                    <div className="grid grid-cols-4 gap-2">
                      {QR_SHAPE_TEMPLATES.map((template) => (
                        <button
                          key={template.id}
                          onClick={() => setSelectedShape(template)}
                          className={`p-2 rounded-lg border transition-all ${
                            selectedShape.id === template.id
                              ? 'border-primary-400 bg-primary-400/10'
                              : 'border-gray-700 hover:border-gray-600'
                          }`}
                        >
                          <div className="flex justify-center items-center h-8">
                            {template.icon}
                          </div>
                          <p className="text-[10px] text-center mt-1 text-gray-300">{template.name}</p>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Pattern Templates */}
                  <div>
                    <h3 className="text-sm font-medium text-gray-300 mb-3">样式效果</h3>
                    <div className="grid grid-cols-4 gap-2">
                      {QR_PATTERNS.map((pattern) => (
                        <button
                          key={pattern.id}
                          onClick={() => setSelectedPattern(pattern)}
                          className={`p-2 rounded-lg border transition-all ${
                            selectedPattern.id === pattern.id
                              ? 'border-primary-400 bg-primary-400/10'
                              : 'border-gray-700 hover:border-gray-600'
                          }`}
                        >
                          <div className="flex justify-center items-center h-8">
                            <div className="w-6 h-6 bg-current rounded"></div>
                          </div>
                          <p className="text-[10px] text-center mt-1 text-gray-300">{pattern.name}</p>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* QR Code Preview */}
                  <div className="flex flex-col items-center space-y-4">
                    <div className="relative group">
                      <div className="absolute -inset-0.5 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-lg blur opacity-50 group-hover:opacity-75 transition duration-1000"></div>
                      <div className="relative bg-white p-4 rounded-lg qr-code-container">
                        <style>
                          {combinedStyle}
                        </style>
                        <svg width="0" height="0">
                          <defs>
                            <linearGradient id="qr-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                              <stop offset="0%" stopColor={selectedColor.style.fgColor} />
                              <stop offset="100%" stopColor={selectedColor.style.fgColor} />
                            </linearGradient>
                            <filter id="sketch-filter">
                              <feTurbulence type="fractalNoise" baseFrequency="0.02" numOctaves="3" />
                              <feDisplacementMap in="SourceGraphic" scale="2" />
                            </filter>
                            <filter id="watercolor-filter">
                              <feTurbulence type="turbulence" baseFrequency="0.01" numOctaves="3" />
                              <feGaussianBlur stdDeviation="0.5" />
                              <feDisplacementMap in="SourceGraphic" scale="5" />
                            </filter>
                          </defs>
                        </svg>
                        <QRCodeSVG
                          value={shortenedUrl}
                          size={200}
                          fgColor={selectedColor.style.fgColor}
                          bgColor={selectedColor.style.bgColor}
                          level="Q"
                          includeMargin={true}
                          className="qr-code"
                        />
                      </div>
                    </div>
                    <button
                      onClick={downloadQRCode}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-primary-400 hover:text-primary-300 border border-primary-400 hover:border-primary-300 rounded-lg transition-colors"
                    >
                      <Download className="h-4 w-4" />
                      {t('urlShortenerPage.downloadQr')}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="mt-8 text-center text-sm text-gray-400">
          <p>{t('urlShortenerPage.footer')}</p>
        </div>
      </div>
    </div>
  );
}