// src/pages/EventDetails.jsx
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import LoadingSpinner from "../components/LoadingSpinner";

export default function EventDetails() {
  const { id } = useParams(); // get event id from URL
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);

  // Mock fetch function – replace with your API call
  const fetchEvent = async (eventId) => {
    // Example: simulate API
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          id: eventId,
          title: "Tech Conference 2025",
          description: "A global conference on technology and innovation.",
          date: "2025-09-10",
          location: "New Delhi, India",
          price: "Free",
        });
      }, 1000);
    });
  };

  useEffect(() => {
    const loadEvent = async () => {
      setLoading(true);
      const data = await fetchEvent(id);
      setEvent(data);
      setLoading(false);
    };
    loadEvent();
  }, [id]);

  if (loading) return <LoadingSpinner />;

  if (!event) return <p className="text-center mt-10 text-gray-500">Event not found</p>;

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">{event.title}</h1>
      <p className="text-gray-700 mb-4">{event.description}</p>
      <div className="space-y-2">
        <p><span className="font-semibold">Date:</span> {event.date}</p>
        <p><span className="font-semibold">Location:</span> {event.location}</p>
        <p><span className="font-semibold">Price:</span> {event.price}</p>
      </div>
    </div>
  );
}
