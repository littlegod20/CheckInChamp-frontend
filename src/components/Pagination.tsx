import type { Pagination } from "@/store/store";

interface Paginate extends Partial<Pagination> {
  onCurrentPage: React.Dispatch<React.SetStateAction<number>>;
  currentPage: number;
}

const Pagination: React.FC<Paginate> = ({
  page,
  totalPages,
  onCurrentPage,
  currentPage,
}) => {
  return (
    <>
      <div className="flex justify-between items-center mt-6 text-white">
        <button
          onClick={() => onCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="px-4 py-2 bg-green-primary rounded-lg disabled:opacity-50"
        >
          Previous
        </button>
        <span className="text-black-secondary">
          Page {page} of {totalPages}
        </span>
        <button
          onClick={() =>
            onCurrentPage((prev) => Math.min(prev + 1, totalPages || 0))
          }
          disabled={currentPage === totalPages}
          className="px-4 py-2 bg-green-primary rounded-lg disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </>
  );
};

export default Pagination;
