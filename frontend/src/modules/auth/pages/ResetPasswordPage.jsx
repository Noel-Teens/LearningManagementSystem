import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button, Input, Card } from '../../../shared/components/common';
import api from '../../../shared/api/axios';
import toast from 'react-hot-toast';

const ResetPasswordPage = () => {
    const { token } = useParams();
    const navigate = useNavigate();

    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!password || !confirmPassword) {
            setError('Please fill in all fields');
            return;
        }

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        if (password.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }

        setLoading(true);
        setError('');

        try {
            await api.put(`/auth/resetpassword/${token}`, { password });
            toast.success('Password reset successfully! You can now login.');
            navigate('/login');
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to reset password');
            toast.error(err.response?.data?.error || 'Failed to reset password');
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
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="text-center">
                            <h2 className="text-2xl font-semibold text-gray-900">Reset Password</h2>
                            <p className="text-gray-500 mt-1">Enter your new password below</p>
                        </div>

                        <Input
                            label="New Password"
                            type="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => {
                                setPassword(e.target.value);
                                setError('');
                            }}
                            error={error && error.includes('match') ? '' : error}
                        />

                        <Input
                            label="Confirm Password"
                            type="password"
                            placeholder="••••••••"
                            value={confirmPassword}
                            onChange={(e) => {
                                setConfirmPassword(e.target.value);
                                setError('');
                            }}
                            error={error && error.includes('match') ? error : ''}
                        />

                        <Button
                            type="submit"
                            className="w-full"
                            size="lg"
                            loading={loading}
                        >
                            Reset Password
                        </Button>
                    </form>
                </Card>
            </div>
        </div>
    );
};

export default ResetPasswordPage;
