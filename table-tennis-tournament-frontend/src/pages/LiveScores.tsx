import React, { useEffect, useState } from "react";
import { io} from "socket.io-client";

interface LiveScore {
  id: number;
  team1: {
    name: string;
  };
  team2: {
    name: string;
  };
  date: string;
  time: string;
  venue: string;
  sport: string;
  status: string;
  team1_score: number;
  team2_score: number;
  winner_team: string | null;
}

const Scores: React.FC = () => {
  const [liveScores, setLiveScores] = useState<LiveScore[]>([]);


  useEffect(() => {
  const newSocket = io(import.meta.env.VITE_API_URL);

  

    newSocket.on("liveScoresUpdate", (updatedScore: LiveScore | LiveScore[]) => {
      // Sometimes backend broadcasts a single match update or array of matches
      if (Array.isArray(updatedScore)) {
        setLiveScores(updatedScore);
      } else {
        setLiveScores(prevScores => {
          const index = prevScores.findIndex(s => s.id === updatedScore.id);
          if (index !== -1) {
            const newScores = [...prevScores];
            newScores[index] = updatedScore;
            return newScores;
          } else {
            return [...prevScores, updatedScore];
          }
        });
      }
    });

    // Optionally, fetch initial live ongoing matches from your REST API
    fetch(`${import.meta.env.VITE_API_URL}api/matches`)

      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          const ongoingMatches = data.data.matches.filter((m: LiveScore) => m.status === "ongoing");
          setLiveScores(ongoingMatches);
        }
      })
      .catch(console.error);

    return () => {
      newSocket.disconnect();
    };
  }, []);

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-4xl font-bold text-center mb-8 text-gray-800">Live Scores</h1>
      {liveScores.length === 0 ? (
        <p className="text-center text-gray-600">No ongoing matches currently.</p>
      ) : (
        liveScores.map((match) => (
          <div
            key={match.id}
            className="mb-6 p-6 bg-white rounded-xl shadow-md flex flex-col sm:flex-row items-center justify-between"
          >
            <div className="text-center sm:text-left flex-1">
              <h2 className="text-2xl font-semibold mb-2">
                {match.team1.name} vs {match.team2.name}
              </h2>
              <p className="text-sm text-gray-500">
                {match.sport} · {match.date} {match.time} · {match.venue}
              </p>
              <p className="mt-1 font-medium">
                Status: <span className="capitalize">{match.status}</span>
              </p>
            </div>
            <div className="flex items-center gap-8 text-3xl font-bold mt-4 sm:mt-0">
              <div className="text-right">
                <div>{match.team1_score}</div>
                <div className="text-sm font-normal">{match.team1.name}</div>
              </div>
              <div>:</div>
              <div className="text-left">
                <div>{match.team2_score}</div>
                <div className="text-sm font-normal">{match.team2.name}</div>
              </div>
            </div>
            {match.status === "completed" && match.winner_team && (
              <div className="mt-4 sm:mt-0 sm:ml-8 text-green-600 font-semibold">
                Winner: {match.winner_team}
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default Scores;
