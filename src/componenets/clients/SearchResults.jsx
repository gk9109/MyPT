// src/components/search/SearchResults.jsx
import CoachCard from "./CoachCard";
import { subscribeToCoach } from "../../Services/subscriptions";

export default function SearchResults({ results = [], clientUid }) {
  if (!results.length) return null;

  const onSubscribe = async (coach) => {
    if (!clientUid) return; 
    await subscribeToCoach({ coachUid: coach.uid, clientUid });
  };

  return (
    <div className="d-flex flex-column align-items-center">
      {results.map((coach) => (
        <div key={coach.uid || coach.id} className="w-100 mb-3" style={{ maxWidth: 520 }}>
          <CoachCard
            coach={coach}
            onView={onView}
            mode="search"
            onFavorite={() => onSubscribe(coach)}
          />
        </div>
      ))}
    </div>
  );
}
