import { Award, Download, ExternalLink } from 'lucide-react';
import { getCertificateDownloadUrl } from '../../../api/certificateApi';

const CertificateCard = ({ certificate }) => {
    const handleDownload = () => {
        const downloadUrl = getCertificateDownloadUrl(certificate.certificateUrl);
        window.open(downloadUrl, '_blank');
    };

    const handlePreview = () => {
        const downloadUrl = getCertificateDownloadUrl(certificate.certificateUrl);
        window.open(downloadUrl, '_blank');
    };

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    return (
        <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden border border-gray-200">
            {/* Header with gradient */}
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 text-white">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        <div className="bg-white/20 p-3 rounded-full">
                            <Award className="w-6 h-6" />
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold">Certificate of Completion</h3>
                            <p className="text-sm text-blue-100">Verified Credential</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="p-6">
                <h4 className="text-xl font-bold text-gray-800 mb-2">
                    {certificate.courseId?.title || 'Course Title'}
                </h4>

                <div className="flex items-center text-sm text-gray-600 mb-4">
                    <span className="font-medium">Issued on:</span>
                    <span className="ml-2">{formatDate(certificate.issuedAt)}</span>
                </div>

                <div className="text-xs text-gray-500 mb-4 font-mono bg-gray-50 p-2 rounded">
                    ID: {certificate._id}
                </div>

                {/* Action buttons */}
                <div className="flex gap-3">
                    <button
                        onClick={handlePreview}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                    >
                        <ExternalLink className="w-4 h-4" />
                        Preview
                    </button>
                    <button
                        onClick={handleDownload}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200"
                    >
                        <Download className="w-4 h-4" />
                        Download
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CertificateCard;
