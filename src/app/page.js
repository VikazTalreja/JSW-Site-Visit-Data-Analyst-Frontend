'use client';

import { useState, useRef, useEffect } from 'react';
import dynamic from 'next/dynamic';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const ChartComponent = dynamic(() => import('../components/ChartComponent'), {
  ssr: false,
});

export default function Home() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [chartData, setChartData] = useState(null);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, chartData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const newMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, newMessage]);
    setInput('');
    setIsLoading(true);
    setChartData(null); // Reset chart data for new query

    try {
      const response = await fetch('http://localhost:3001/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [...messages, newMessage],
        }),
      });

      const data = await response.json();
      
      // Handle assistant response
      if (data.response) {
        setMessages(prev => [...prev, data.response]);
      }

      // Handle chart data if present
      if (data.chartData) {
        setChartData(data.chartData);
      }
    } catch (error) {
      console.error('Error:', error);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'Sorry, there was an error processing your request.'
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-white">
      {/* Header */}
      <div className="bg-gray-100 text-black font-bold px-6 py-4 shadow-md">
        <div className="max-w-xl mx-auto flex items-center justify-between">
          <h1 className="text-2xl font-semibold">JSW Steel Sales Insight Assistant</h1>
         </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 max-w-5xl mx-auto w-full p-6">
        {/* Messages Container */}
        <div className="bg-white rounded-lg shadow p-6 w-full mb-6 h-[calc(100vh-240px)] overflow-y-auto">
          <div className="space-y-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${
                  message?.role === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                <div
                  className={`max-w-[80%] rounded-lg p-4 ${
                    message?.role === 'user'
                      ? 'bg-gray-200 shadow-sm shadow-gray-400  border border-gray-100 text-black'
                      : 'bg-gray-100 text-gray-800 border shadow-sm shadow-gray-400 border-gray-200'
                  } shadow`}
                >
                  <div className="text-sm mb-1 text-gray-500">
                    {message?.role === 'user' ? 'You' : 'JSW Assistant'}
                  </div>
                  <div className="prose prose-sm max-w-none whitespace-pre-wrap prose-table:border prose-table:border-collapse prose-th:border prose-th:border-gray-300 prose-th:p-2 prose-td:border prose-td:border-gray-300 prose-td:p-2">
                    <ReactMarkdown 
                      remarkPlugins={[remarkGfm]}
                    >
                      {message?.content || 'No content available'}
                    </ReactMarkdown>
                  </div>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 border border-gray-200 rounded-lg p-4 shadow">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200"></div>
                  </div>
                </div>
              </div>
            )}
            {/* Chart Integration */}
            {chartData && !isLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 text-gray-800 border border-gray-200 rounded-lg p-4 shadow w-full">
                  <h3 className="text-lg font-semibold mb-4">Data Visualization</h3>
                  <div className="h-72">
                    <ChartComponent data={chartData} />
                  </div>
                </div>
              </div>
            )}
          </div>
          <div ref={messagesEndRef} />
        </div>

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6">
          <div className="flex gap-3">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about JSW Steel sales insights, performance trends, or payment delays..."
              className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent text-gray-800 placeholder-gray-400"
            />
            <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 font-medium"
            >
              Send
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
