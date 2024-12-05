import React from 'react';

const UserActivityBoard = ({ name, level, scores }) => {
  return (
    <div className="flex flex-col items-start justify-between bg-gray-800 text-white h-[30px] w-full p-2 rounded-md">
      <div className="flex items-center justify-between w-full">
        <h1 className="text-sm font-bold">{name}</h1>
        <p className="text-sm text-gray-400">Level {level}</p>
      </div>
      {scores && (
        <div className="text-sm text-gray-300">
          <p>Scores: {scores}</p>
        </div>
      )}
    </div>
  );
};

export default UserActivityBoard;