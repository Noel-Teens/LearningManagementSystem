import { useState, useEffect, useRef } from 'react';
import { Button, Input, Card } from '../../../shared/components/common';
import api from '../../../shared/api/axios';
import toast from 'react-hot-toast';
import { useTheme } from '../../../context/ThemeContext';


const OrganizationSettingsPage = () => {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [organization, setOrganization] = useState(null);
    const [activeTab, setActiveTab] = useState('profile');
    const fileInputRef = useRef(null);
    const { refreshTheme, isDark } = useTheme();



    const [formData, setFormData] = useState({
        name: '',
        contactEmail: '',
        website: '',
        address: '',
        logoUrl: '',
        theme: {
            mode: 'light',
            fontFamily: 'Inter, sans-serif',
        },
        learningPolicies: {
            allowSelfEnrollment: false,
            certificateAutoGeneration: true,
            passingScorePercentage: 70,
            maxQuizAttempts: 3,
        },
    });

    useEffect(() => {
        fetchOrganization();
    }, []);

    const fetchOrganization = async () => {
        try {
            const response = await api.get('/organizations');
            if (response.data.data && response.data.data.length > 0) {
                const org = response.data.data[0];
                setOrganization(org);
                setFormData({
                    name: org.name || '',
                    contactEmail: org.contactEmail || '',
                    website: org.website || '',
                    address: org.address || '',
                    logoUrl: org.logoUrl || '',
                    theme: org.theme || {
                        mode: 'light',
                        fontFamily: 'Inter, sans-serif',
                    },
                    learningPolicies: org.learningPolicies || formData.learningPolicies,
                });
            }
        } catch (error) {
            console.log('Organization not found');
        } finally {
            setLoading(false);
        }
    };

    const handleLogoUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Validate file type
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
        if (!allowedTypes.includes(file.type)) {
            toast.error('Please upload an image file (jpeg, png, gif, webp)');
            return;
        }

        // Validate file size (5MB max)
        if (file.size > 5 * 1024 * 1024) {
            toast.error('Image size must be less than 5MB');
            return;
        }

        setUploading(true);
        const uploadData = new FormData();
        uploadData.append('logo', file);

        try {
            const response = await api.post('/upload/logo', uploadData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            const logoUrl = response.data.data.url;
            setFormData({ ...formData, logoUrl });

            // If organization exists, update logo immediately
            if (organization) {
                await api.put(`/organizations/${organization._id}/logo`, { logoUrl });
                toast.success('Logo uploaded successfully');
            } else {
                toast.success('Logo uploaded! Save profile to apply.');
            }
        } catch (error) {
            toast.error(error.response?.data?.error || 'Logo upload failed');
        } finally {
            setUploading(false);
            // Reset file input
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        }
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            if (organization) {
                await api.put(`/organizations/${organization._id}`, formData);
                toast.success('Organization updated successfully');
            } else {
                const response = await api.post('/organizations', formData);
                setOrganization(response.data.data);
                toast.success('Organization created successfully');
            }
        } catch (error) {
            toast.error(error.response?.data?.error || 'Failed to save');
        } finally {
            setSaving(false);
        }
    };

    const handleThemeSave = async () => {
        if (!organization) {
            toast.error('Please save organization profile first');
            return;
        }
        setSaving(true);
        try {
            await api.put(`/organizations/${organization._id}/theme`, formData.theme);
            // Refresh global theme
            if (refreshTheme) {
                await refreshTheme();
            }
            toast.success('Theme updated successfully');
        } catch (error) {
            toast.error(error.response?.data?.error || 'Failed to save theme');
        } finally {
            setSaving(false);
        }
    };

    const handlePoliciesSave = async () => {
        if (!organization) {
            toast.error('Please save organization profile first');
            return;
        }
        setSaving(true);
        try {
            await api.put(`/organizations/${organization._id}/policies`, formData.learningPolicies);
            toast.success('Learning policies updated successfully');
        } catch (error) {
            toast.error(error.response?.data?.error || 'Failed to save policies');
        } finally {
            setSaving(false);
        }
    };

    const tabs = [
        { id: 'profile', label: 'Profile' },
        { id: 'branding', label: 'Branding' },
        { id: 'policies', label: 'Learning Policies' },
    ];

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>Organization Settings</h1>
                <p className={`mt-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Configure your organization profile and settings</p>
            </div>

            {/* Tabs */}
            <div className={`border-b ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
                <nav className="flex space-x-8">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`py-3 px-1 border-b-2 font-medium text-sm transition-colors ${activeTab === tab.id
                                ? 'border-blue-600 text-blue-500'
                                : isDark
                                    ? 'border-transparent text-gray-400 hover:text-gray-200 hover:border-gray-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </nav>
            </div>

            {/* Profile Tab */}
            {activeTab === 'profile' && (
                <Card title="Organization Profile" subtitle="Basic information about your organization">
                    <div className="space-y-4">
                        <Input
                            label="Organization Name"
                            placeholder="Acme Corporation"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        />
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Input
                                label="Contact Email"
                                type="email"
                                placeholder="contact@acme.com"
                                value={formData.contactEmail}
                                onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                            />
                            <Input
                                label="Website"
                                placeholder="https://acme.com"
                                value={formData.website}
                                onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                            />
                        </div>
                        <Input
                            label="Address"
                            placeholder="123 Business Street, City, Country"
                            value={formData.address}
                            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                        />
                        <div className="pt-4 flex justify-end">
                            <Button onClick={handleSave} loading={saving}>
                                Save Profile
                            </Button>
                        </div>
                    </div>
                </Card>
            )}

            {/* Branding Tab */}
            {activeTab === 'branding' && (
                <div className="space-y-6">
                    <Card title="Logo" subtitle="Your organization's logo">
                        <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-6">
                            <div className="w-32 h-32 sm:w-24 sm:h-24 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden border-2 border-dashed border-gray-300">
                                {uploading ? (
                                    <div className="animate-spin rounded-full h-8 w-8 border-4 border-blue-600 border-t-transparent"></div>
                                ) : formData.logoUrl ? (
                                    <img src={formData.logoUrl} alt="Logo" className="w-full h-full object-cover" />
                                ) : (
                                    <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                )}
                            </div>
                            <div className="flex-1 space-y-3 text-center sm:text-left w-full">
                                <div>
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                                        onChange={handleLogoUpload}
                                        className="hidden"
                                        id="logo-upload"
                                    />
                                    <Button
                                        onClick={() => fileInputRef.current?.click()}
                                        variant="outline"
                                        loading={uploading}
                                        disabled={uploading}
                                        className="w-full sm:w-auto"
                                    >
                                        {uploading ? 'Uploading...' : 'Upload Logo'}
                                    </Button>
                                    <p className="text-xs text-gray-500 mt-2">
                                        JPG, PNG, GIF or WebP. Max 5MB.
                                    </p>
                                </div>
                                {formData.logoUrl && (
                                    <div className="flex items-center justify-center sm:justify-start space-x-2">
                                        <span className="text-xs text-gray-500 truncate max-w-xs hidden sm:block">
                                            {formData.logoUrl}
                                        </span>
                                        <button
                                            onClick={() => setFormData({ ...formData, logoUrl: '' })}
                                            className="text-red-500 hover:text-red-700 text-xs font-medium"
                                        >
                                            Remove Logo
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </Card>

                    <Card title="Theme Mode" subtitle="Choose your platform's appearance">
                        <div className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* Light Mode Option */}
                                <button
                                    type="button"
                                    onClick={() => setFormData({
                                        ...formData,
                                        theme: { ...formData.theme, mode: 'light' }
                                    })}
                                    className={`p-4 rounded-xl border-2 transition-all ${formData.theme.mode === 'light'
                                        ? isDark
                                            ? 'border-blue-500 bg-blue-900/30'
                                            : 'border-blue-600 bg-blue-50'
                                        : isDark
                                            ? 'border-gray-600 hover:border-gray-500'
                                            : 'border-gray-200 hover:border-gray-300'
                                        }`}
                                >
                                    <div className="flex items-center space-x-3">
                                        <div className={`w-12 h-12 rounded-lg flex items-center justify-center shadow-sm ${isDark ? 'bg-gray-700 border border-gray-600' : 'bg-white border border-gray-200'
                                            }`}>
                                            <svg className="w-6 h-6 text-yellow-500" fill="currentColor" viewBox="0 0 24 24">
                                                <path d="M12 2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zM7.5 12a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM18.894 6.166a.75.75 0 00-1.06-1.06l-1.591 1.59a.75.75 0 101.06 1.061l1.591-1.59zM21.75 12a.75.75 0 01-.75.75h-2.25a.75.75 0 010-1.5H21a.75.75 0 01.75.75zM17.834 18.894a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 10-1.061 1.06l1.59 1.591zM12 18a.75.75 0 01.75.75V21a.75.75 0 01-1.5 0v-2.25A.75.75 0 0112 18zM7.758 17.303a.75.75 0 00-1.061-1.06l-1.591 1.59a.75.75 0 001.06 1.061l1.591-1.59zM6 12a.75.75 0 01-.75.75H3a.75.75 0 010-1.5h2.25A.75.75 0 016 12zM6.697 7.757a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 00-1.061 1.06l1.59 1.591z" />
                                            </svg>
                                        </div>
                                        <div className="text-left">
                                            <p className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>Light Mode</p>
                                            <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Clean, bright interface</p>
                                        </div>
                                    </div>
                                    {formData.theme.mode === 'light' && (
                                        <div className="mt-3 flex items-center text-blue-500 text-sm font-medium">
                                            <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                            </svg>
                                            Selected
                                        </div>
                                    )}
                                </button>

                                {/* Dark Mode Option */}
                                <button
                                    type="button"
                                    onClick={() => setFormData({
                                        ...formData,
                                        theme: { ...formData.theme, mode: 'dark' }
                                    })}
                                    className={`p-4 rounded-xl border-2 transition-all ${formData.theme.mode === 'dark'
                                        ? isDark
                                            ? 'border-blue-500 bg-blue-900/30'
                                            : 'border-blue-600 bg-blue-50'
                                        : isDark
                                            ? 'border-gray-600 hover:border-gray-500'
                                            : 'border-gray-200 hover:border-gray-300'
                                        }`}
                                >
                                    <div className="flex items-center space-x-3">
                                        <div className="w-12 h-12 bg-gray-800 rounded-lg flex items-center justify-center shadow-sm border border-gray-700">
                                            <svg className="w-6 h-6 text-indigo-400" fill="currentColor" viewBox="0 0 24 24">
                                                <path fillRule="evenodd" d="M9.528 1.718a.75.75 0 01.162.819A8.97 8.97 0 009 6a9 9 0 009 9 8.97 8.97 0 003.463-.69.75.75 0 01.981.98 10.503 10.503 0 01-9.694 6.46c-5.799 0-10.5-4.701-10.5-10.5 0-4.368 2.667-8.112 6.46-9.694a.75.75 0 01.818.162z" clipRule="evenodd" />
                                            </svg>
                                        </div>
                                        <div className="text-left">
                                            <p className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>Dark Mode</p>
                                            <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Easy on the eyes</p>
                                        </div>
                                    </div>
                                    {formData.theme.mode === 'dark' && (
                                        <div className="mt-3 flex items-center text-blue-500 text-sm font-medium">
                                            <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                            </svg>
                                            Selected
                                        </div>
                                    )}
                                </button>
                            </div>
                        </div>
                        <div className="mt-4">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Font Family</label>
                            <select
                                value={formData.theme.fontFamily}
                                onChange={(e) => setFormData({
                                    ...formData,
                                    theme: { ...formData.theme, fontFamily: e.target.value }
                                })}
                                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            >
                                <option value="Inter, sans-serif">Inter</option>
                                <option value="Roboto, sans-serif">Roboto</option>
                                <option value="Open Sans, sans-serif">Open Sans</option>
                                <option value="Poppins, sans-serif">Poppins</option>
                            </select>
                        </div>
                        <div className="pt-4 flex justify-end">
                            <Button onClick={handleThemeSave} loading={saving}>
                                Save Theme
                            </Button>
                        </div>
                    </Card>
                </div>
            )}

            {/* Policies Tab */}
            {activeTab === 'policies' && (
                <Card title="Learning Policies" subtitle="Configure learning rules and settings">
                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <h4 className="font-medium text-gray-900">Allow Self Enrollment</h4>
                                <p className="text-sm text-gray-500">Let learners enroll themselves in courses</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={formData.learningPolicies.allowSelfEnrollment}
                                    onChange={(e) => setFormData({
                                        ...formData,
                                        learningPolicies: { ...formData.learningPolicies, allowSelfEnrollment: e.target.checked }
                                    })}
                                    className="sr-only peer"
                                />
                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                            </label>
                        </div>

                        <div className="flex items-center justify-between">
                            <div>
                                <h4 className="font-medium text-gray-900">Auto-Generate Certificates</h4>
                                <p className="text-sm text-gray-500">Automatically generate certificates on course completion</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={formData.learningPolicies.certificateAutoGeneration}
                                    onChange={(e) => setFormData({
                                        ...formData,
                                        learningPolicies: { ...formData.learningPolicies, certificateAutoGeneration: e.target.checked }
                                    })}
                                    className="sr-only peer"
                                />
                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                            </label>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Passing Score Percentage
                                </label>
                                <div className="flex items-center space-x-3">
                                    <input
                                        type="range"
                                        min="0"
                                        max="100"
                                        value={formData.learningPolicies.passingScorePercentage}
                                        onChange={(e) => setFormData({
                                            ...formData,
                                            learningPolicies: { ...formData.learningPolicies, passingScorePercentage: parseInt(e.target.value) }
                                        })}
                                        className="flex-1"
                                    />
                                    <span className="w-12 text-center font-medium text-gray-900">
                                        {formData.learningPolicies.passingScorePercentage}%
                                    </span>
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Max Quiz Attempts
                                </label>
                                <select
                                    value={formData.learningPolicies.maxQuizAttempts}
                                    onChange={(e) => setFormData({
                                        ...formData,
                                        learningPolicies: { ...formData.learningPolicies, maxQuizAttempts: parseInt(e.target.value) }
                                    })}
                                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                >
                                    <option value={1}>1 attempt</option>
                                    <option value={2}>2 attempts</option>
                                    <option value={3}>3 attempts</option>
                                    <option value={5}>5 attempts</option>
                                    <option value={10}>10 attempts</option>
                                    <option value={-1}>Unlimited</option>
                                </select>
                            </div>
                        </div>

                        <div className="pt-4 flex justify-end">
                            <Button onClick={handlePoliciesSave} loading={saving}>
                                Save Policies
                            </Button>
                        </div>
                    </div>
                </Card>
            )}
        </div>
    );
};

export default OrganizationSettingsPage;
