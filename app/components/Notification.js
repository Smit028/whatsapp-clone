// components/Notification.js
import "../globals.css"


const Notification = ({ callerId, onAccept, onDecline }) => {
    return (
        <div className="fixed bottom-5 right-5 z-50 bg-white p-4 shadow-lg rounded-lg border border-gray-300">
            <p className="font-semibold">Incoming Call from {callerId}...</p>
            <div className="mt-2">
                <button 
                    onClick={onAccept} 
                    className="mr-2 p-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition duration-300"
                >
                    Accept
                </button>
                <button 
                    onClick={onDecline} 
                    className="p-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition duration-300"
                >
                    Decline
                </button>
            </div>
        </div>
    );
};

export default Notification;
