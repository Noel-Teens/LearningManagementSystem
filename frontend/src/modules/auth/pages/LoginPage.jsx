import { useState, useEffect, useRef } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button, Input, Card, Modal } from '../../../shared/components/common';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [showDeactivatedModal, setShowDeactivatedModal] = useState(false);
    const hasAttemptedLogin = useRef(false);

    const { login, logout, user } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        if (user) {
            const isStaff = user.role === 'SuperAdmin' || user.role === 'Admin';
            const redirectPath =  '/search';
            navigate(redirectPath, { replace: true });
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
            // Clear any existing session before new login attempt
            localStorage.removeItem('token');
            localStorage.removeItem('user');

            const result = await login(email, password);
            console.log('Login result:', result);

            if (result.success) {
                setErrors({});
                const isStaff = result.user.role === 'SuperAdmin' || result.user.role === 'Admin';
                const redirectPath = '/search';
                navigate(redirectPath, { replace: true });
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
        <div className="min-h-screen bg-white flex overflow-hidden">
            {/* Left Side: Branding/Image */}
            <div className="hidden lg:flex lg:w-1/2 bg-indigo-600 relative overflow-hidden items-center justify-center">
                <div className="absolute inset-0 opacity-10">
                    <svg className="h-full w-full" fill="currentColor" viewBox="0 0 100 100" preserveAspectRatio="none">
                        <defs>
                            <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                                <path d="M 10 0 L 0 0 0 10" fill="none" stroke="white" strokeWidth="0.5" />
                            </pattern>
                        </defs>
                        <rect width="100" height="100" fill="url(#grid)" />
                    </svg>
                </div>
                <div className="relative z-10 text-center p-12">
                    <div className="w-20 h-20 bg-white/20 backdrop-blur-md rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-2xl border border-white/30">
                        <span className="text-white font-bold text-4xl leading-none">L</span>
                    </div>
                    <h1 className="text-5xl font-extrabold text-white mb-6 tracking-tight">
                        Empower Your <span className="text-indigo-200">Learning</span>
                    </h1>
                    <p className="text-indigo-100 text-xl max-w-md mx-auto leading-relaxed font-medium">
                        Join our community of students and master new skills with our advanced learning platform.
                    </p>
                </div>
                {/* Decorative Blobs */}
                <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse" />
                <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse delay-700" />
            </div>

            {/* Right Side: Login Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-slate-50 lg:bg-white overflow-y-auto">
                <div className="w-full max-w-md animate-in">
                    {/* Mobile Logo */}
                    <div className="flex items-center justify-center mb-12 lg:hidden">
                        <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center mr-4 shadow-lg shadow-indigo-100">
                            <span className="text-white font-bold text-2xl">L</span>
                        </div>
                        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">LMS Platform</h1>
                    </div>

                    <div className="mb-10 text-center lg:text-left">
                        <h2 className="text-4xl font-extrabold text-slate-900 mb-3 tracking-tight">Welcome back</h2>
                        <p className="text-slate-500 text-lg font-medium">Please enter your details to sign in.</p>
                    </div>

                    {errors.general && (
                        <div className="flex items-start gap-3 p-4 bg-rose-50 border border-rose-100 rounded-2xl text-sm text-rose-600 mb-8 animate-in shadow-sm">
                            <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                            </svg>
                            <span className="flex-1 font-medium">{errors.general}</span>
                            <button
                                type="button"
                                onClick={() => setErrors(prev => ({ ...prev, general: undefined }))}
                                className="flex-shrink-0 text-rose-400 hover:text-rose-600 transition-colors"
                            >
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                </svg>
                            </button>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <Input
                            label="Email Address"
                            type="email"
                            placeholder="you@email.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            error={errors.email}
                        />

                        <div className="space-y-1">
                            <Input
                                label="Password"
                                type="password"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                error={errors.password}
                            />
                            <div className="flex justify-end pt-1">
                                <Link to="/forgot-password" title="Forgot Password" className="text-sm font-bold text-indigo-600 hover:text-indigo-500 transition-colors">
                                    Forgot password?
                                </Link>
                            </div>
                        </div>

                        <Button
                            type="submit"
                            className="w-full py-4 text-lg"
                            size="lg"
                            loading={loading}
                        >
                            Sign In
                        </Button>
                    </form>

                    <p className="text-center text-slate-500 mt-12 text-sm font-medium">
                        Don't have an account? <span className="text-slate-900 border-b-2 border-indigo-600/20">Contact your administrator.</span>
                    </p>
                </div>
            </div>

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
    );
};

export default LoginPage;
