import React from "react";

const UserProgress = ({ feedback }) => {
  if (!feedback) {
    return null; // Don't render if feedback is not available
  }

  const { strongPoints, progressPoints } = feedback;

  return (
    <div className="mt-8 w-full max-w-lg bg-white shadow-lg rounded-lg p-6">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">
        Feedback Summary
      </h2>

      {/* Display Strong Points */}
      <div className="mb-6">
        <h3 className="text-xl font-medium text-green-600">Strong Points</h3>
        {strongPoints && strongPoints.length > 0 ? (
          <ul className="list-disc list-inside mt-2 space-y-2">
            {strongPoints.map((point, index) => (
              <li key={index} className="text-gray-700">
                {point}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">No strong points identified yet.</p>
        )}
      </div>

      {/* Display Areas for Improvement */}
      <div>
        <h3 className="text-xl font-medium text-yellow-600">
          Areas for Improvement
        </h3>
        {progressPoints && progressPoints.length > 0 ? (
          <ul className="list-disc list-inside mt-2 space-y-2">
            {progressPoints.map((point, index) => (
              <li key={index} className="text-gray-700">
                {point}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">
            No areas for improvement identified yet.
          </p>
        )}
      </div>
    </div>
  );
};

export default UserProgress;
