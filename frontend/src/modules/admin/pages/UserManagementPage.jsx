import { useState, useEffect } from 'react';
import { Button, Input, Card, Modal } from '../../../shared/components/common';
import { useAuth } from '../../auth/context/AuthContext';
import api from '../../../shared/api/axios';
import toast from 'react-hot-toast';

const UserManagementPage = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: 'Learner',
    });
    const [formLoading, setFormLoading] = useState(false);
    const [errors, setErrors] = useState({});

    const { register, updateUserStatus, user: currentUser } = useAuth();

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await api.get('/auth/users');
            setUsers(response.data.data || []);
        } catch (error) {
            // If endpoint doesn't exist yet, show empty state
            console.log('Users endpoint not available');
            setUsers([]);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateUser = async (e) => {
        e.preventDefault();

        const newErrors = {};
        if (!formData.name) newErrors.name = 'Name is required';
        if (!formData.email) newErrors.email = 'Email is required';
        if (!formData.password) newErrors.password = 'Password is required';
        else if (formData.password.length < 6) newErrors.password = 'Min 6 characters';

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        setFormLoading(true);
        const result = await register(formData);
        setFormLoading(false);

        if (result.success) {
            setShowCreateModal(false);
            setFormData({ name: '', email: '', password: '', role: 'Learner' });
            fetchUsers();
        }
    };

    const handleStatusToggle = async (userId, currentStatus) => {
        const result = await updateUserStatus(userId, !currentStatus);
        if (result.success) {
            setUsers(users.map(u =>
                u._id === userId ? { ...u, isActive: !currentStatus } : u
            ));
        }
    };

    const handleDeleteUser = async (userId) => {
        if (!window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) return;

        try {
            await api.delete(`/auth/users/${userId}`);
            setUsers(users.filter(u => u._id !== userId));
            toast.success('User deleted successfully');
        } catch (error) {
            toast.error(error.response?.data?.error || 'Failed to delete user');
        }
    };

    const getRoleBadgeColor = (role) => {
        const colors = {
            SuperAdmin: 'bg-purple-100 text-purple-800',
            Admin: 'bg-blue-100 text-blue-800',
            Trainer: 'bg-green-100 text-green-800',
            Learner: 'bg-gray-100 text-gray-800',
        };
        return colors[role] || colors.Learner;
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
                    <p className="text-gray-500 mt-1">Manage users and their roles</p>
                </div>
                <Button onClick={() => setShowCreateModal(true)}>
                    + Add User
                </Button>
            </div>

            {/* Users Table */}
            <Card padding={false}>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    User
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Role
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Status
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Created
                                </th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {loading ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center">
                                        <div className="animate-spin rounded-full h-8 w-8 border-4 border-blue-600 border-t-transparent mx-auto"></div>
                                    </td>
                                </tr>
                            ) : users.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                                        No users found. Create one to get started.
                                    </td>
                                </tr>
                            ) : (
                                users.map((user) => (
                                    <tr key={user._id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4">
                                            <div>
                                                <div className="font-medium text-gray-900">{user.name}</div>
                                                <div className="text-sm text-gray-500">{user.email}</div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleBadgeColor(user.role)}`}>
                                                {user.role}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${user.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                                }`}>
                                                {user.isActive ? 'Active' : 'Inactive'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-500">
                                            {new Date(user.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <Button
                                                variant={user.isActive ? 'danger' : 'success'}
                                                size="sm"
                                                onClick={() => handleStatusToggle(user._id, user.isActive)}
                                            >
                                                {user.isActive ? 'Deactivate' : 'Activate'}
                                            </Button>

                                            {currentUser?.role === 'SuperAdmin' && (
                                                <Button
                                                    variant="danger"
                                                    size="sm"
                                                    className="ml-2"
                                                    onClick={() => handleDeleteUser(user._id)}
                                                >
                                                    Delete
                                                </Button>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </Card>

            {/* Create User Modal */}
            <Modal
                isOpen={showCreateModal}
                onClose={() => setShowCreateModal(false)}
                title="Create New User"
            >
                <form onSubmit={handleCreateUser} className="space-y-4">
                    <Input
                        label="Full Name"
                        placeholder="John Doe"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        error={errors.name}
                    />
                    <Input
                        label="Email Address"
                        type="email"
                        placeholder="john@example.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        error={errors.email}
                    />
                    <Input
                        label="Password"
                        type="password"
                        placeholder="••••••••"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        error={errors.password}
                    />
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                        <select
                            value={formData.role}
                            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                            className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                            <option value="Learner">Learner</option>
                            <option value="Trainer">Trainer</option>
                            <option value="Admin">Admin</option>
                            <option value="SuperAdmin">Super Admin</option>
                        </select>
                    </div>
                    <div className="flex gap-3 pt-4">
                        <Button type="button" variant="ghost" onClick={() => setShowCreateModal(false)} className="flex-1">
                            Cancel
                        </Button>
                        <Button type="submit" loading={formLoading} className="flex-1">
                            Create User
                        </Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default UserManagementPage;
