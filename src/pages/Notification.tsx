import React from "react";
import { Bell, Star } from "lucide-react";

interface Notification {
  id: number;
  username: string;
  bookTitle: string;
  rating: number;
  comment: string;
  timestamp: string;
}

const notifications: Notification[] = [
  {
    id: 1,
    username: "Ali Hassan",
    bookTitle: "The Power of Habit",
    rating: 5,
    comment: "Amazing book! It changed my daily routine.",
    timestamp: "2025-02-11 10:30 AM",
  },
  {
    id: 2,
    username: "Muna Ahmed",
    bookTitle: "Atomic Habits",
    rating: 4,
    comment: "Very practical tips, but a bit repetitive.",
    timestamp: "2025-02-10 08:45 PM",
  },
];

const NotificationPage: React.FC = () => {
  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Notifications</h1>
        <Bell className="w-6 h-6 text-gray-600" />
      </div>

      {/* Notification List */}
      <div className="space-y-4">
        {notifications.map((notif) => (
          <div
            key={notif.id}
            className="bg-white shadow-md rounded-lg p-4 flex flex-col md:flex-row md:items-center md:justify-between border border-gray-200"
          >
            {/* Notification Details */}
            <div>
              <p className="font-semibold text-gray-700">{notif.username} reviewed:</p>
              <p className="text-gray-600 font-medium">{notif.bookTitle}</p>
              <p className="text-sm text-gray-500">"{notif.comment}"</p>
              <p className="text-xs text-gray-400 mt-1">{notif.timestamp}</p>
            </div>
            
            {/* Rating */}
            <div className="flex items-center mt-2 md:mt-0">
              {[...Array(notif.rating)].map((_, i) => (
                <Star key={i} className="w-5 h-5 text-yellow-400" />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NotificationPage;
