
import '../componentStyles/Pagination.css'




function Pagination({ currentPage, totalPages, onPageChange, activeClass = 'active' }) {
  if (totalPages <= 1) return null;

  const getPageNumbers = () => {
    const pages = new Set();

    // Always include 1
    pages.add(1);

    // Ellipsis before current range
    if (currentPage > 3) {
      pages.add('start-ellipsis');
    }

    // Center range (currentPage ±1)
    for (let i = currentPage - 1; i <= currentPage + 1; i++) {
      if (i > 1 && i < totalPages) {
        pages.add(i);
      }
    }

    // Ellipsis after current range
    if (currentPage < totalPages - 2) {
      pages.add('end-ellipsis');
    }

    // Always include last page
    if (totalPages > 1) {
      pages.add(totalPages);
    }

    return Array.from(pages);
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className="pagination">
      {/* Prev */}
      {currentPage > 1 && (
        <button onClick={() => onPageChange(currentPage - 1)}>Prev</button>
      )}

      {/* Page Buttons & Ellipses */}
      {pageNumbers.map((page, idx) => {
        if (page === 'start-ellipsis' || page === 'end-ellipsis') {
          return <span key={`ellipsis-${idx}`} className="pagination-ellipsis">...</span>;
        }

        return (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={currentPage === page ? activeClass : ''}
          >
            {page}
          </button>
        );
      })}

      {/* Next */}
      {currentPage < totalPages && (
        <button onClick={() => onPageChange(currentPage + 1)}>Next</button>
      )}
    </div>
  );
}

export default Pagination;



  

