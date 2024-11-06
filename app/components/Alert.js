// components/Alert.js
import React from 'react';

const Alert = ({ callerId, onAccept, onDecline }) => {
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-lg text-center">
                <h2 className="text-xl font-bold mb-4">Incoming Call</h2>
                <p className="mb-4">Caller ID: <strong>{callerId}</strong></p>
                <div className="flex justify-around">
                    <button
                        onClick={onAccept}
                        className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-300"
                    >
                        Accept
                    </button>
                    <button
                        onClick={onDecline}
                        className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition duration-300"
                    >
                        Decline
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Alert;
