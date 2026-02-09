import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button, Input, Card } from '../../../shared/components/common';
import api from '../../../shared/api/axios';
import toast from 'react-hot-toast';

const ForgotPasswordPage = () => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!email) {
            setError('Email is required');
            return;
        }
        if (!/\S+@\S+\.\S+/.test(email)) {
            setError('Invalid email format');
            return;
        }

        setLoading(true);
        setError('');

        try {
            await api.post('/auth/forgotpassword', { email });
            setSubmitted(true);
            toast.success('Password reset email sent!');
        } catch (err) {
            toast.error(err.response?.data?.error || 'Failed to send reset email');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-gray-800">LMS Platform</h1>
                    <p className="text-gray-600 mt-2">Learning Management System</p>
                </div>

                <Card className="bg-white shadow-lg">
                    {submitted ? (
                        <div className="text-center py-4">
                            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <h2 className="text-2xl font-semibold text-gray-900">Check Your Email</h2>
                            <p className="text-gray-500 mt-2">
                                We've sent a password reset link to <strong>{email}</strong>
                            </p>
                            <Link
                                to="/login"
                                className="inline-block mt-6 text-indigo-600 hover:text-indigo-500 font-medium"
                            >
                                ← Back to Login
                            </Link>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="text-center">
                                <h2 className="text-2xl font-semibold text-gray-900">Forgot Password?</h2>
                                <p className="text-gray-500 mt-1">Enter your email to reset your password</p>
                            </div>

                            <Input
                                label="Email Address"
                                type="email"
                                placeholder="you@example.com"
                                value={email}
                                onChange={(e) => {
                                    setEmail(e.target.value);
                                    setError('');
                                }}
                                error={error}
                            />

                            <Button
                                type="submit"
                                className="w-full"
                                size="lg"
                                loading={loading}
                            >
                                Send Reset Link
                            </Button>

                            <div className="text-center">
                                <Link to="/login" className="text-sm text-indigo-600 hover:text-indigo-500">
                                    ← Back to Login
                                </Link>
                            </div>
                        </form>
                    )}
                </Card>
            </div>
        </div>
    );
};

export default ForgotPasswordPage;
