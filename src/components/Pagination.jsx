import { ChevronLeft, ChevronRight } from 'lucide-react';

export const Pagination = ({ currentPage, totalPages, onPageChange }) => {
    const pages = [];
    // Show fewer pages on mobile
    const maxVisiblePages = window.innerWidth < 640 ? 3 : 5;

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
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-2 mt-6 sm:mt-8 mb-4">
            <div className="flex items-center gap-1.5 sm:gap-2">
                {/* Previous Button */}
                <button
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`p-1.5 sm:p-2 rounded-lg border transition-all ${currentPage === 1
                        ? 'bg-slate-800 border-slate-700 text-slate-600 cursor-not-allowed'
                        : 'bg-slate-800 border-slate-600 text-slate-300 hover:bg-slate-700 hover:border-blue-500'
                        }`}
                >
                    <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>

                {/* First page if not visible */}
                {startPage > 1 && (
                    <>
                        <button
                            onClick={() => onPageChange(1)}
                            className="px-2.5 sm:px-4 py-1.5 sm:py-2 text-sm rounded-lg border bg-slate-800 border-slate-600 text-slate-300 hover:bg-slate-700 hover:border-blue-500 transition-all"
                        >
                            1
                        </button>
                        {startPage > 2 && <span className="text-slate-500 text-sm">...</span>}
                    </>
                )}

                {/* Page Numbers */}
                {pages.map(page => (
                    <button
                        key={page}
                        onClick={() => onPageChange(page)}
                        className={`px-2.5 sm:px-4 py-1.5 sm:py-2 text-sm rounded-lg border transition-all font-medium ${page === currentPage
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
                        {endPage < totalPages - 1 && <span className="text-slate-500 text-sm">...</span>}
                        <button
                            onClick={() => onPageChange(totalPages)}
                            className="px-2.5 sm:px-4 py-1.5 sm:py-2 text-sm rounded-lg border bg-slate-800 border-slate-600 text-slate-300 hover:bg-slate-700 hover:border-blue-500 transition-all"
                        >
                            {totalPages}
                        </button>
                    </>
                )}

                {/* Next Button */}
                <button
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={`p-1.5 sm:p-2 rounded-lg border transition-all ${currentPage === totalPages
                        ? 'bg-slate-800 border-slate-700 text-slate-600 cursor-not-allowed'
                        : 'bg-slate-800 border-slate-600 text-slate-300 hover:bg-slate-700 hover:border-blue-500'
                        }`}
                >
                    <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
            </div>

            {/* Page Info */}
            <div className="text-xs sm:text-sm text-slate-400 font-mono">
                Page {currentPage} of {totalPages}
            </div>
        </div>
    );
};
