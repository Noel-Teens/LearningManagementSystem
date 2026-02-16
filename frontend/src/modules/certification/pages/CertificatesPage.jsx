import { useState, useEffect } from 'react';
import { Award, Loader2, FileX } from 'lucide-react';
import { getUserCertificates } from '../../../api/certificateApi';
import { useAuth } from '../../auth/context/AuthContext';
import CertificateCard from '../components/CertificateCard';
import toast from 'react-hot-toast';

const CertificatesPage = () => {
    const { user } = useAuth();
    const [certificates, setCertificates] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchCertificates();
    }, [user]);

    const fetchCertificates = async () => {
        try {
            setLoading(true);
            const userId = user._id || user.id;
            const response = await getUserCertificates(userId);
            setCertificates(response.data || []);
        } catch (error) {
            console.error('Error fetching certificates:', error);
            toast.error('Failed to load certificates');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="text-center">
                    <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
                    <p className="text-gray-600">Loading your certificates...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Header */}
            <div className="mb-8">
                <div className="flex items-center gap-3 mb-2">
                    <Award className="w-8 h-8 text-blue-600" />
                    <h1 className="text-3xl font-bold text-gray-900">My Certificates</h1>
                </div>
                <p className="text-gray-600">
                    View and download your earned course completion certificates
                </p>
            </div>

            {/* Certificates grid */}
            {certificates.length === 0 ? (
                <div className="text-center py-16">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 rounded-full mb-4">
                        <FileX className="w-10 h-10 text-gray-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-700 mb-2">
                        No Certificates Yet
                    </h3>
                    <p className="text-gray-500 max-w-md mx-auto">
                        Complete your enrolled courses to earn certificates. Certificates are automatically
                        generated when you finish all lessons in a course.
                    </p>
                </div>
            ) : (
                <>
                    <div className="mb-4 text-sm text-gray-600">
                        <span className="font-semibold">{certificates.length}</span> certificate
                        {certificates.length !== 1 ? 's' : ''} earned
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {certificates.map((certificate) => (
                            <CertificateCard key={certificate._id} certificate={certificate} />
                        ))}
                    </div>
                </>
            )}
        </div>
    );
};

export default CertificatesPage;
