import React from "react";

const ShowPostModel = () => {
  return (
    <div
      className={`relative z-10 `}
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
    >
      <div className="fixed inset-0 bg-gray-600 bg-opacity-75 transition-opacity"></div>

      <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
          <div
            className={`relative transform overflow-hidden rounded-lg bg-gray-700  text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-[40rem]`}
          >
            <div className="bg-gray-700"></div>
           
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShowPostModel;
