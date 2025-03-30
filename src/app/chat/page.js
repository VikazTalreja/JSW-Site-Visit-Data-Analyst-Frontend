'use client';

import { useState, useRef, useEffect } from 'react';
import dynamic from 'next/dynamic';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useRouter } from 'next/navigation';
const ChartComponent = dynamic(() => import('@/components/ChartComponent'), {
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

    const router = useRouter();

    useEffect(() => {
        const loggedIn = localStorage.getItem('loggedIn');
        if (loggedIn !== 'true') {
            router.push('/');
        }
    }, []);

    useEffect(() => {
        scrollToBottom();
    }, [messages, chartData]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        // Add user message immediately
        const userMessage = { role: 'user', content: input };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);
        setChartData(null);

        try {
            const response = await fetch('https://jsw-lang-chatbot.onrender.com/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ query: input }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to get response from server');
            }

            const data = await response.json();

            if (data && data.final_response) {  // Changed to access data.final_response directly
                const fullText = String(data.final_response);

                // Create assistant message with empty content initially
                setMessages(prev => [...prev, { role: 'assistant', content: '' }]);

                // Typewriter effect
                let currentText = '';
                for (let i = 0; i < fullText.length; i++) {
                    currentText += fullText[i];
                    setMessages(prev => {
                        const newMessages = [...prev];
                        newMessages[newMessages.length - 1] = {
                            role: 'assistant',
                            content: currentText
                        };
                        return newMessages;
                    });
                    await new Promise(resolve => setTimeout(resolve, 10)); // Adjust typing speed
                }
            } else if (data && data.error) {
                setMessages(prev => [...prev, {
                    role: 'assistant',
                    content: `Error: ${data.error}`
                }]);
            } else {
                setMessages(prev => [...prev, {
                    role: 'assistant',
                    content: "Unexpected response from server."
                }]);
            }
        } catch (error) {
            setMessages(prev => [...prev, {
                role: 'assistant',
                content: `Sorry, there was an error: ${error.message}`
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
                    <h1 className="text-2xl font-semibold">JSW Site Visit Data Analyst</h1>
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
                                className={`flex ${message?.role === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                                <div
                                    className={`max-w-[80%] rounded-lg p-4 ${
                                        message?.role === 'user'
                                            ? 'bg-gray-200 shadow-sm shadow-gray-400 border border-gray-100 text-black'
                                            : 'bg-gray-100 text-gray-800 border shadow-sm shadow-gray-400 border-gray-200'
                                    }`}
                                >
                                    <div className="text-sm mb-1 text-gray-500">
                                        {message?.role === 'user' ? 'You' : 'JSW Assistant'}
                                    </div>
                                    <div className={`prose prose-sm max-w-none whitespace-pre-wrap ${
                                        message?.role === 'user' ? 'prose-invert' : ''
                                    }`}>
                                        <ReactMarkdown
                                            remarkPlugins={[remarkGfm]}
                                            components={{
                                                table: ({ node, ...props }) => (
                                                    <div className="overflow-x-auto my-4">
                                                        <table className="min-w-full divide-y divide-gray-300" {...props} />
                                                    </div>
                                                ),
                                                thead: ({ node, ...props }) => (
                                                    <thead className="bg-gray-100" {...props} />
                                                ),
                                                th: ({ node, ...props }) => (
                                                    <th
                                                        className="px-3 py-2 text-left text-xs font-medium text-gray-700 uppercase tracking-wider border border-gray-300"
                                                        {...props}
                                                    />
                                                ),
                                                td: ({ node, ...props }) => (
                                                    <td
                                                        className="px-3 py-2 whitespace-normal text-sm text-gray-700 border border-gray-300"
                                                        {...props}
                                                    />
                                                ),
                                            }}
                                        >
                                            {message?.content}
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