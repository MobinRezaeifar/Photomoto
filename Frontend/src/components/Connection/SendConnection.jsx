import React from "react";

const SendConnection = ({ status, sender, receiver }) => {
  return (
    <div className="bg-slate-500 h-10 w-full px-2 py-1  my-4 rounded-lg">
      <h1>{sender}</h1>
    </div>
  );
};

export default SendConnection;
