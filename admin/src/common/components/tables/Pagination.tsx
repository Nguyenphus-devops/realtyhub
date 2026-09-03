import React, { useMemo } from "react";

type PaginationProps = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  const pages = useMemo(() => {
    const delta = 1;

    const start = Math.max(1, currentPage - delta);
    const end = Math.min(totalPages, currentPage + delta);

    const generatedPages: number[] = [];

    for (let i = start; i <= end; i++) {
      generatedPages.push(i);
    }

    return generatedPages;
  }, [currentPage, totalPages]);

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage <= 1}
        className="flex h-10 items-center justify-center rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-sm text-gray-700 shadow-theme-xs hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03]"
      >
        Trước
      </button>

      <div className="flex items-center gap-2">
        {startEllipsis(currentPage) && (
          <>
            <button
              type="button"
              onClick={() => onPageChange(1)}
              className="flex h-10 w-10 items-center justify-center rounded-lg text-sm font-medium text-gray-700 hover:bg-blue-500/[0.08] hover:text-brand-500 dark:text-gray-400"
            >
              1
            </button>

            <span className="px-1 text-sm text-gray-500">...</span>
          </>
        )}

        {pages.map((page) => {
          const isActive = currentPage === page;

          return (
            <button
              key={page}
              type="button"
              onClick={() => onPageChange(page)}
              className={`flex h-10 w-10 items-center justify-center rounded-lg text-sm font-medium transition ${
                isActive
                  ? "bg-brand-500 text-white"
                  : "text-gray-700 hover:bg-blue-500/[0.08] hover:text-brand-500 dark:text-gray-400 dark:hover:text-brand-500"
              }`}
            >
              {page}
            </button>
          );
        })}

        {endEllipsis(currentPage, totalPages) && (
          <>
            <span className="px-1 text-sm text-gray-500">...</span>

            <button
              type="button"
              onClick={() => onPageChange(totalPages)}
              className="flex h-10 w-10 items-center justify-center rounded-lg text-sm font-medium text-gray-700 hover:bg-blue-500/[0.08] hover:text-brand-500 dark:text-gray-400"
            >
              {totalPages}
            </button>
          </>
        )}
      </div>

      <button
        type="button"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage >= totalPages}
        className="flex h-10 items-center justify-center rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-sm text-gray-700 shadow-theme-xs hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03]"
      >
        Sau
      </button>
    </div>
  );
};

const startEllipsis = (currentPage: number) => currentPage > 2;

const endEllipsis = (
  currentPage: number,
  totalPages: number
) => currentPage < totalPages - 1;

export default Pagination;
