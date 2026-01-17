import { useState, useEffect, useRef } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Button, Input, Card, Modal } from '../../components/common';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [showDeactivatedModal, setShowDeactivatedModal] = useState(false);
    const hasAttemptedLogin = useRef(false);

    const { login, user } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        if (user) {
            const from = location.state?.from?.pathname || '/dashboard';
            navigate(from, { replace: true });
        }
    }, [user]);

    useEffect(() => {
        console.log('Errors state changed:', errors);
    }, [errors]);

    const validate = () => {
        const newErrors = {};
        if (!email) newErrors.email = 'Email is required';
        else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = 'Invalid email format';
        if (!password) newErrors.password = 'Password is required';
        else if (password.length < 8) newErrors.password = 'Password must be at least 8 characters';
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return false;
        }
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        e.stopPropagation();

        console.log('Form submitted');

        if (!validate()) {
            console.log('Validation failed');
            return;
        }

        console.log('Validation passed, attempting login');
        hasAttemptedLogin.current = true;
        setLoading(true);

        try {
            const result = await login(email, password);
            console.log('Login result:', result);

            if (result.success) {
                setErrors({});
                const from = location.state?.from?.pathname || '/dashboard';
                navigate(from, { replace: true });
            } else {
                console.log('Setting error:', result.error);
                if (result.error && result.error.toLowerCase().includes('deactivated')) {
                    setShowDeactivatedModal(true);
                } else {
                    setErrors({ general: result.error || 'Invalid email or password' });
                }
            }
        } catch (error) {
            console.log('Login exception:', error);
            setErrors({ general: 'Invalid email or password' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                {/* Logo */}
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-gray-800">LMS Platform</h1>
                    <p className="text-gray-600 mt-2">Learning Management System</p>
                </div>

                <Card className="bg-white shadow-lg">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="text-center">
                            <h2 className="text-2xl font-semibold text-gray-900">Welcome Back</h2>
                            <p className="text-gray-500 mt-1">Sign in to your account</p>
                        </div>

                        {errors.general && (
                            <div className="flex items-start gap-3 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
                                <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                </svg>
                                <span className="flex-1">{errors.general}</span>
                                <button
                                    type="button"
                                    onClick={() => setErrors(prev => ({ ...prev, general: undefined }))}
                                    className="flex-shrink-0 text-red-400 hover:text-red-600"
                                >
                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                    </svg>
                                </button>
                            </div>
                        )}

                        <Input
                            label="Email Address"
                            type="email"
                            placeholder="you@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            error={errors.email}
                        />

                        <Input
                            label="Password"
                            type="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            error={errors.password}
                        />

                        <div className="flex items-center justify-between">
                            <label className="flex items-center">
                                <input type="checkbox" className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" />
                                <span className="ml-2 text-sm text-gray-600">Remember me</span>
                            </label>
                            <Link to="/forgot-password" className="text-sm text-indigo-600 hover:text-indigo-500">
                                Forgot password?
                            </Link>
                        </div>

                        <Button
                            type="submit"
                            className="w-full"
                            size="lg"
                            loading={loading}
                        >
                            Sign In
                        </Button>
                    </form>
                </Card>

                <p className="text-center text-gray-600 mt-6 text-sm">
                    Don't have an account? Contact your administrator.
                </p>

                <Modal
                    isOpen={showDeactivatedModal}
                    onClose={() => setShowDeactivatedModal(false)}
                    title="Contact Support"
                >
                    <div className="text-center py-4">
                        <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                            <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                        </div>
                        <p className="text-sm text-gray-500">
                            Your account cannot be accessed. Kindly contact your staff or organization.
                        </p>
                        <div className="mt-6">
                            <Button onClick={() => setShowDeactivatedModal(false)} className="w-full">
                                Close
                            </Button>
                        </div>
                    </div>
                </Modal>
            </div>
        </div>
    );
};

export default LoginPage;
