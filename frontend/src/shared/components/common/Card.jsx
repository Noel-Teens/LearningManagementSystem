const Card = ({
    children,
    title,
    subtitle,
    className = '',
    padding = true,
    ...props
}) => {
    return (
        <div
            className={`bg-white rounded-2xl shadow-sm hover:shadow-md border border-slate-100 transition-shadow duration-300 ${className}`}
            {...props}
        >
            {(title || subtitle) && (
                <div className="px-6 py-4 border-b border-gray-200">
                    {title && <h3 className="text-lg font-semibold text-gray-900">{title}</h3>}
                    {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
                </div>
            )}
            <div className={padding ? 'p-6' : ''}>
                {children}
            </div>
        </div>
    );
};

export default Card;
