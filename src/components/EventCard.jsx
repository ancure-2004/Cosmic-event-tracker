import { Link } from "react-router-dom";

export default function EventCard({ event }) {
  const avgDiameter = (
    (event.estimated_diameter.kilometers.estimated_diameter_min +
      event.estimated_diameter.kilometers.estimated_diameter_max) /
    2
  ).toFixed(3);

  return (
    <div className="border p-4 rounded shadow hover:shadow-lg transition">
      <h3 className="text-lg font-bold">{event.name}</h3>
      <p>
        Hazardous:{" "}
        <span className={event.is_potentially_hazardous_asteroid ? "text-red-600" : "text-green-600"}>
          {event.is_potentially_hazardous_asteroid ? "Yes" : "No"}
        </span>
      </p>
      <p>Diameter: {avgDiameter} km</p>
      <p>
        Closest Approach: {event.close_approach_data[0]?.close_approach_date_full}
      </p>
      <Link
        to={`/event/${event.id}`}
        state={{ event }}
        className="text-blue-600 underline"
      >
        View Details
      </Link>
    </div>
  );
}
