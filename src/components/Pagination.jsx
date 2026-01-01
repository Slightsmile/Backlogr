import { ChevronLeft, ChevronRight } from 'lucide-react';

export const Pagination = ({ currentPage, totalPages, onPageChange }) => {
    const pages = [];
    const maxVisiblePages = 5;

    // Calculate which pages to show
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    // Adjust start if we're near the end
    if (endPage - startPage < maxVisiblePages - 1) {
        startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
    }

    return (
        <div className="flex items-center justify-center gap-2 mt-8 mb-4">
            {/* Previous Button */}
            <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={`p-2 rounded-lg border transition-all ${currentPage === 1
                        ? 'bg-slate-800 border-slate-700 text-slate-600 cursor-not-allowed'
                        : 'bg-slate-800 border-slate-600 text-slate-300 hover:bg-slate-700 hover:border-blue-500'
                    }`}
            >
                <ChevronLeft className="w-5 h-5" />
            </button>

            {/* First page if not visible */}
            {startPage > 1 && (
                <>
                    <button
                        onClick={() => onPageChange(1)}
                        className="px-4 py-2 rounded-lg border bg-slate-800 border-slate-600 text-slate-300 hover:bg-slate-700 hover:border-blue-500 transition-all"
                    >
                        1
                    </button>
                    {startPage > 2 && <span className="text-slate-500">...</span>}
                </>
            )}

            {/* Page Numbers */}
            {pages.map(page => (
                <button
                    key={page}
                    onClick={() => onPageChange(page)}
                    className={`px-4 py-2 rounded-lg border transition-all font-medium ${page === currentPage
                            ? 'bg-blue-600 border-blue-500 text-white'
                            : 'bg-slate-800 border-slate-600 text-slate-300 hover:bg-slate-700 hover:border-blue-500'
                        }`}
                >
                    {page}
                </button>
            ))}

            {/* Last page if not visible */}
            {endPage < totalPages && (
                <>
                    {endPage < totalPages - 1 && <span className="text-slate-500">...</span>}
                    <button
                        onClick={() => onPageChange(totalPages)}
                        className="px-4 py-2 rounded-lg border bg-slate-800 border-slate-600 text-slate-300 hover:bg-slate-700 hover:border-blue-500 transition-all"
                    >
                        {totalPages}
                    </button>
                </>
            )}

            {/* Next Button */}
            <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`p-2 rounded-lg border transition-all ${currentPage === totalPages
                        ? 'bg-slate-800 border-slate-700 text-slate-600 cursor-not-allowed'
                        : 'bg-slate-800 border-slate-600 text-slate-300 hover:bg-slate-700 hover:border-blue-500'
                    }`}
            >
                <ChevronRight className="w-5 h-5" />
            </button>

            {/* Page Info */}
            <div className="ml-4 text-sm text-slate-400 font-mono">
                Page {currentPage} of {totalPages}
            </div>
        </div>
    );
};
