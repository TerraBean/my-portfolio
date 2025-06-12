'use client';

import { useState, useEffect } from 'react';
import { ScrapedNews, EnhancedPost, ConnectionStatus } from '@/lib/types/news';

interface NewsScrapingPanelProps {
  className?: string;
}

export default function NewsScrapingPanel({ className }: NewsScrapingPanelProps) {
  // State management
  const [isLoading, setIsLoading] = useState(false);
  const [scrapedNews, setScrapedNews] = useState<ScrapedNews[]>([]);
  const [enhancedPosts, setEnhancedPosts] = useState<EnhancedPost[]>([]);
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus | null>(null);
  const [isTestingConnection, setIsTestingConnection] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Test AI connection on component mount
  useEffect(() => {
    testConnection();
  }, []);

  const showMessage = (type: 'success' | 'error', text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 5000);
  };

  // Test AI service connection
  const testConnection = async () => {
    setIsTestingConnection(true);
    try {
      const response = await fetch('/api/admin/news/test-connection');
      const result = await response.json();
      
      setConnectionStatus({
        connected: result.connected || false,
        service: result.service || 'Google Gemini AI',
        timestamp: result.timestamp || new Date().toISOString(),
        error: result.error || undefined
      });

      if (result.connected) {
        showMessage('success', 'AI service connection verified');
      } else {
        showMessage('error', result.error || 'AI service connection failed');
      }
    } catch (error) {
      setConnectionStatus({
        connected: false,
        service: 'Google Gemini AI',
        timestamp: new Date().toISOString(),
        error: 'Connection test failed'
      });
      showMessage('error', 'Failed to test AI service connection');
    } finally {
      setIsTestingConnection(false);
    }
  };

  // Handle news scraping
  const handleScrapeNews = async (autoEnhance = false) => {
    if (!connectionStatus?.connected) {
      showMessage('error', 'AI service not connected. Please test connection first.');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/admin/news/scrape', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ limit: 10, autoEnhance }),
      });

      const result = await response.json();
      
      if (result.success) {
        if (autoEnhance) {
          setEnhancedPosts(result.data || []);
          setScrapedNews([]);
          showMessage('success', `Enhanced ${result.count} articles`);
        } else {
          setScrapedNews(result.data || []);
          setEnhancedPosts([]);
          showMessage('success', `Scraped ${result.count} articles`);
        }
      } else {
        showMessage('error', result.error || 'Operation failed');
      }
    } catch (error) {
      showMessage('error', 'Scraping failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle individual article enhancement
  const handleEnhanceArticle = async (article: ScrapedNews) => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/admin/news/enhance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ news: article }),
      });

      const result = await response.json();
      
      if (result.success) {
        // Add enhanced post to list
        setEnhancedPosts(prev => [...prev, result.data]);
        
        // Remove from scraped news
        setScrapedNews(prev => prev.filter(item => item.url !== article.url));
        
        showMessage('success', 'Article enhanced successfully');
      } else {
        showMessage('error', result.error || 'Enhancement failed');
      }
    } catch (error) {
      showMessage('error', 'Enhancement failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Message Display */}
      {message && (
        <div className={`p-4 rounded-md ${
          message.type === 'success' 
            ? 'bg-green-50 border border-green-200 text-green-800' 
            : 'bg-red-50 border border-red-200 text-red-800'
        }`}>
          {message.text}
        </div>
      )}

      {/* Connection Status */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">AI Service Status</h3>
          <button
            onClick={testConnection}
            disabled={isTestingConnection}
            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-md text-sm font-medium disabled:opacity-50"
          >
            {isTestingConnection ? 'Testing...' : 'Test Connection'}
          </button>
        </div>
        
        {connectionStatus && (
          <div className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${
              connectionStatus.connected ? 'bg-green-500' : 'bg-red-500'
            }`}></div>
            <span className={connectionStatus.connected ? 'text-green-700' : 'text-red-700'}>
              {connectionStatus.connected 
                ? `Connected to ${connectionStatus.service}` 
                : connectionStatus.error || 'Not connected'
              }
            </span>
            <span className="text-sm text-gray-500 ml-auto">
              {new Date(connectionStatus.timestamp).toLocaleTimeString()}
            </span>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold mb-2">News Scraping Actions</h3>
        <p className="text-gray-600 mb-4">Scrape the latest Ghana news articles and enhance them with AI</p>
        
        <div className="flex gap-2 flex-wrap mb-4">
          <button
            onClick={() => handleScrapeNews(false)}
            disabled={isLoading || !connectionStatus?.connected}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? '⏳ Loading...' : '📥 Scrape News'}
          </button>
          
          <button
            onClick={() => handleScrapeNews(true)}
            disabled={isLoading || !connectionStatus?.connected}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? '⏳ Loading...' : '⚡ Scrape & Auto-Enhance'}
          </button>
        </div>

        {!connectionStatus?.connected && (
          <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 p-3 rounded-md">
            AI service connection required for scraping operations.
          </div>
        )}
      </div>

      {/* Scraped News List */}
      {scrapedNews.length > 0 && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold mb-2">Scraped Articles ({scrapedNews.length})</h3>
          <p className="text-gray-600 mb-4">Raw articles ready for AI enhancement</p>
          
          <div className="space-y-4">
            {scrapedNews.map((article, index) => (
              <div key={index} className="border rounded-lg p-4 space-y-2">
                <h4 className="font-semibold">{article.title}</h4>
                <p className="text-sm text-gray-600">
                  {article.content.substring(0, 200)}...
                </p>
                <div className="flex justify-between items-center">
                  <div className="flex gap-2">
                    <span className="px-2 py-1 bg-gray-100 rounded text-xs">{article.source}</span>
                    <span className="px-2 py-1 bg-gray-100 rounded text-xs">
                      {new Date(article.publishedDate).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => window.open(article.url, '_blank')}
                      className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded"
                    >
                      🔗 View
                    </button>
                    <button
                      onClick={() => handleEnhanceArticle(article)}
                      disabled={isLoading}
                      className="px-3 py-1 text-sm bg-emerald-600 hover:bg-emerald-700 text-white rounded disabled:opacity-50"
                    >
                      ⚡ Enhance
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Enhanced Posts List */}
      {enhancedPosts.length > 0 && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold mb-2">Enhanced Articles ({enhancedPosts.length})</h3>
          <p className="text-gray-600 mb-4">AI-enhanced articles ready for publication</p>
          
          <div className="space-y-4">
            {enhancedPosts.map((post, index) => (
              <div key={index} className="border rounded-lg p-4 space-y-3">
                <h4 className="font-semibold text-lg">{post.title}</h4>
                <p className="text-sm text-gray-600 italic">{post.excerpt}</p>
                <div className="flex flex-wrap gap-1">
                  {post.tags.map((tag, tagIndex) => (
                    <span key={tagIndex} className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex gap-2">
                    <span className="px-2 py-1 bg-emerald-100 text-emerald-800 rounded text-xs font-medium">
                      {post.category}
                    </span>
                    <span className="px-2 py-1 bg-gray-100 rounded text-xs">{post.originalSource}</span>
                  </div>
                  <button
                    onClick={() => window.open(post.originalUrl, '_blank')}
                    className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded"
                  >
                    🔗 Source
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {scrapedNews.length === 0 && enhancedPosts.length === 0 && !isLoading && (
        <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
          <p className="text-gray-500">No articles scraped yet. Click "Scrape News" to get started.</p>
        </div>
      )}
    </div>
  );
}