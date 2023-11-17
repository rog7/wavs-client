import {
  ArrowLongLeftIcon,
  ArrowLongRightIcon,
} from "@heroicons/react/20/solid";
import { ChangeEvent, useRef } from "react";

interface Props {
  currentPage: number;
  handlePageChange: (page: number) => void;
  maxPages: number;
}
export default function Pagination({
  currentPage,
  handlePageChange,
  maxPages,
}: Props) {
  const inputRef = useRef<HTMLInputElement | null>(null);

  if (inputRef.current) {
    inputRef.current.value = currentPage.toString();
  }
  // Event handler to update the currentPage state when a valid numeric value is entered
  const handlePageNumberChange = (event: ChangeEvent<HTMLInputElement>) => {
    const inputValue = event.target.value;

    // Use a regular expression to validate that the input is a positive integer
    if (/^[1-9]\d*$/.test(inputValue)) {
      const value = parseInt(inputValue, 10);
      if (value > 0 && value < maxPages + 1) {
        handlePageChange(value);
      }
    }
  };

  return (
    <nav className="flex items-center justify-between px-4 sm:px-0">
      <div className="-mt-px flex w-0 flex-1">
        {currentPage !== 1 && (
          <a
            className="cursor-pointer inline-flex items-center border-t-2 border-transparent pr-1 pt-4 text-sm font-medium text-gray-500 hover:text-gray-700"
            onClick={() => {
              if (inputRef.current) {
                inputRef.current.value = String(currentPage - 1);
              }
              handlePageChange(currentPage - 1);
            }}
          >
            <ArrowLongLeftIcon
              className="mr-3 h-5 w-5 text-gray-400"
              aria-hidden="true"
            />
            Previous
          </a>
        )}
      </div>
      <div className="flex pt-4 items-center gap-x-2">
        {/* <p className="font-medium text-gray-500">Page</p> */}
        <input
          ref={inputRef}
          name="pageNumber"
          id="pageNumber"
          defaultValue={1}
          className="w-12 text-center rounded-md py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600"
          onChange={handlePageNumberChange}
        />
        <p className="font-medium text-gray-500">/</p>
        <p className="font-medium text-gray-500">{maxPages}</p>
      </div>
      <div className="-mt-px flex w-0 flex-1 justify-end">
        {currentPage !== maxPages && (
          <a
            className="cursor-pointer inline-flex items-center border-t-2 border-transparent pl-1 pt-4 text-sm font-medium text-gray-500 hover:text-gray-700"
            onClick={() => {
              if (inputRef.current) {
                inputRef.current.value = String(currentPage + 1);
              }
              handlePageChange(currentPage + 1);
            }}
          >
            Next
            <ArrowLongRightIcon
              className="ml-3 h-5 w-5 text-gray-400"
              aria-hidden="true"
            />
          </a>
        )}
      </div>
    </nav>
  );
}
