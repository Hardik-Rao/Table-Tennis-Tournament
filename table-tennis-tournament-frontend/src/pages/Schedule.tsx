import React, { useState, useEffect } from 'react';

interface Team {
  id: number;
  name: string;
  sport: string;
}

interface Match {
  id: number;
  team1: Team;
  team2: Team;
  date: string;
  time: string;
  venue: string;
  sport: string;
  status: 'scheduled' | 'ongoing' | 'completed' | 'cancelled';
  team1_score?: number;
  team2_score?: number;
  winner_team?: string;
}

interface MatchData {
  matches: Match[];
  totalMatches: number;
  scheduledCount: number;
  ongoingCount: number;
  completedCount: number;
}

const Schedule: React.FC = () => {
  const [matchData, setMatchData] = useState<MatchData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDate, setSelectedDate] = useState('');

  useEffect(() => {
    fetchMatches();
  }, []);

  const fetchMatches = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/matches');
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      
      if (result.success) {
        setMatchData(result.data);
      } else {
        throw new Error(result.message || 'Failed to fetch matches');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while fetching matches');
      console.error('Error fetching matches:', err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'ongoing':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'completed':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'scheduled':
        return '📅';
      case 'ongoing':
        return '🔴';
      case 'completed':
        return '✅';
      case 'cancelled':
        return '❌';
      default:
        return '📅';
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (timeStr: string) => {
    const [hours, minutes] = timeStr.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const filteredMatches = matchData?.matches.filter(match => {
    const matchesStatus = selectedStatus === 'all' || match.status === selectedStatus;
    const matchesSearch = searchTerm === '' || 
      match.team1.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      match.team2.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      match.venue.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDate = selectedDate === '' || match.date === selectedDate;
    
    return matchesStatus && matchesSearch && matchesDate;
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-xl text-gray-600">Loading schedule...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center bg-red-50 p-8 rounded-lg border border-red-200">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-red-800 mb-2">Error Loading Schedule</h2>
          <p className="text-red-600 mb-4">{error}</p>
          <button 
            onClick={fetchMatches}
            className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-8">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Match Schedule
          </h1>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
            Complete tournament schedule with all matches, times, and venues for the Inter-IIT Table Tennis Championship 2023
          </p>
        </div>

        {/* Statistics Cards */}
        {matchData && (
          <div className="grid md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white p-6 rounded-xl shadow-lg text-center">
              <div className="text-3xl mb-2">📊</div>
              <h3 className="text-lg font-bold text-gray-800">Total Matches</h3>
              <p className="text-2xl font-bold text-blue-600">{matchData.totalMatches}</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-lg text-center">
              <div className="text-3xl mb-2">📅</div>
              <h3 className="text-lg font-bold text-gray-800">Scheduled</h3>
              <p className="text-2xl font-bold text-blue-600">{matchData.scheduledCount}</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-lg text-center">
              <div className="text-3xl mb-2">🔴</div>
              <h3 className="text-lg font-bold text-gray-800">Ongoing</h3>
              <p className="text-2xl font-bold text-green-600">{matchData.ongoingCount}</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-lg text-center">
              <div className="text-3xl mb-2">✅</div>
              <h3 className="text-lg font-bold text-gray-800">Completed</h3>
              <p className="text-2xl font-bold text-gray-600">{matchData.completedCount}</p>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="bg-white p-6 rounded-xl shadow-lg mb-8">
          <h3 className="text-xl font-bold mb-4 text-gray-800">Filter Matches</h3>
          <div className="grid md:grid-cols-3 gap-4">
            {/* Status Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                🔍 Status
              </label>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Matches</option>
                <option value="scheduled">Scheduled</option>
                <option value="ongoing">Ongoing</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            {/* Search Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                🔍 Search Teams/Venue
              </label>
              <input
                type="text"
                placeholder="Search teams or venue..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Date Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                📅 Filter by Date
              </label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Matches List */}
        <div className="space-y-6">
          {filteredMatches && filteredMatches.length > 0 ? (
            filteredMatches.map((match) => (
              <div key={match.id} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                  {/* Match Info */}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(match.status)}`}>
                        {getStatusIcon(match.status)} {match.status.toUpperCase()}
                      </span>
                      <span className="text-sm text-gray-500 font-medium">{match.sport}</span>
                    </div>

                    {/* Teams */}
                    <div className="flex items-center justify-center lg:justify-start gap-4 mb-4">
                      <div className="text-center lg:text-left">
                        <h3 className="font-bold text-lg text-gray-800">{match.team1.name}</h3>
                        {match.status === 'completed' && (
                          <p className="text-sm text-gray-600">Score: {match.team1_score || 0}</p>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-blue-600 font-bold">👥</span>
                        </div>
                        <span className="text-gray-400 font-bold">VS</span>
                        <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                          <span className="text-purple-600 font-bold">👥</span>
                        </div>
                      </div>

                      <div className="text-center lg:text-right">
                        <h3 className="font-bold text-lg text-gray-800">{match.team2.name}</h3>
                        {match.status === 'completed' && (
                          <p className="text-sm text-gray-600">Score: {match.team2_score || 0}</p>
                        )}
                      </div>
                    </div>

                    {/* Winner Display */}
                    {match.winner_team && (
                      <div className="flex items-center justify-center gap-2 mb-3">
                        <span className="text-yellow-500 text-lg">🏆</span>
                        <span className="font-semibold text-yellow-600">Winner: {match.winner_team}</span>
                      </div>
                    )}
                  </div>

                  {/* Match Details */}
                  <div className="lg:text-right space-y-2 lg:min-w-0 lg:w-64">
                    <div className="flex items-center justify-center lg:justify-end gap-2 text-gray-600">
                      <span className="text-sm">📅</span>
                      <span className="text-sm font-medium">{formatDate(match.date)}</span>
                    </div>
                    <div className="flex items-center justify-center lg:justify-end gap-2 text-gray-600">
                      <span className="text-sm">🕐</span>
                      <span className="text-sm font-medium">{formatTime(match.time)}</span>
                    </div>
                    <div className="flex items-center justify-center lg:justify-end gap-2 text-gray-600">
                      <span className="text-sm">📍</span>
                      <span className="text-sm font-medium">{match.venue}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12">
              <div className="text-gray-400 text-6xl mb-4">📅</div>
              <h3 className="text-xl font-bold text-gray-600 mb-2">No Matches Found</h3>
              <p className="text-gray-500">
                {matchData?.matches.length === 0 
                  ? "No matches have been scheduled yet." 
                  : "No matches match your current filters. Try adjusting your search criteria."
                }
              </p>
              {(selectedStatus !== 'all' || searchTerm || selectedDate) && (
                <button
                  onClick={() => {
                    setSelectedStatus('all');
                    setSearchTerm('');
                    setSelectedDate('');
                  }}
                  className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors"
                >
                  Clear Filters
                </button>
              )}
            </div>
          )}
        </div>

        {/* Refresh Button */}
        <div className="text-center mt-8">
          <button
            onClick={fetchMatches}
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all"
          >
            🔄 Refresh Schedule
          </button>
        </div>
      </div>
    </div>
  );
};

export default Schedule;