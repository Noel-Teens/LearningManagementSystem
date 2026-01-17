import { useState, useEffect, useRef } from 'react';
import { Button, Input, Card } from '../../components/common';
import api from '../../api/axios';
import toast from 'react-hot-toast';

const OrganizationSettingsPage = () => {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [organization, setOrganization] = useState(null);
    const [activeTab, setActiveTab] = useState('profile');
    const fileInputRef = useRef(null);

    const [formData, setFormData] = useState({
        name: '',
        contactEmail: '',
        website: '',
        address: '',
        logoUrl: '',
        theme: {
            primaryColor: '#2563EB',
            secondaryColor: '#10B981',
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
                        primaryColor: '#2563EB',
                        secondaryColor: '#10B981',
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
                <h1 className="text-2xl font-bold text-gray-900">Organization Settings</h1>
                <p className="text-gray-500 mt-1">Configure your organization profile and settings</p>
            </div>

            {/* Tabs */}
            <div className="border-b border-gray-200">
                <nav className="flex space-x-8">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`py-3 px-1 border-b-2 font-medium text-sm transition-colors ${activeTab === tab.id
                                ? 'border-blue-600 text-blue-700'
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
                        <div className="flex items-start space-x-6">
                            <div className="w-24 h-24 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden border-2 border-dashed border-gray-300">
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
                            <div className="flex-1 space-y-3">
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
                                    >
                                        {uploading ? 'Uploading...' : 'Upload Logo'}
                                    </Button>
                                    <p className="text-xs text-gray-500 mt-2">
                                        JPG, PNG, GIF or WebP. Max 5MB.
                                    </p>
                                </div>
                                {formData.logoUrl && (
                                    <div className="flex items-center space-x-2">
                                        <span className="text-xs text-gray-500 truncate max-w-xs">
                                            {formData.logoUrl}
                                        </span>
                                        <button
                                            onClick={() => setFormData({ ...formData, logoUrl: '' })}
                                            className="text-red-500 hover:text-red-700 text-xs"
                                        >
                                            Remove
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </Card>

                    <Card title="Theme Colors" subtitle="Customize your platform's appearance">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Primary Color</label>
                                <div className="flex items-center space-x-3">
                                    <input
                                        type="color"
                                        value={formData.theme.primaryColor}
                                        onChange={(e) => setFormData({
                                            ...formData,
                                            theme: { ...formData.theme, primaryColor: e.target.value }
                                        })}
                                        className="w-12 h-10 rounded cursor-pointer"
                                    />
                                    <Input
                                        value={formData.theme.primaryColor}
                                        onChange={(e) => setFormData({
                                            ...formData,
                                            theme: { ...formData.theme, primaryColor: e.target.value }
                                        })}
                                        className="flex-1"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Secondary Color</label>
                                <div className="flex items-center space-x-3">
                                    <input
                                        type="color"
                                        value={formData.theme.secondaryColor}
                                        onChange={(e) => setFormData({
                                            ...formData,
                                            theme: { ...formData.theme, secondaryColor: e.target.value }
                                        })}
                                        className="w-12 h-10 rounded cursor-pointer"
                                    />
                                    <Input
                                        value={formData.theme.secondaryColor}
                                        onChange={(e) => setFormData({
                                            ...formData,
                                            theme: { ...formData.theme, secondaryColor: e.target.value }
                                        })}
                                        className="flex-1"
                                    />
                                </div>
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
