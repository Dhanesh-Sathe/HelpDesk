// client/src/components/Tickets/TicketList.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { format } from 'date-fns';
import { AlertCircle, Search, Filter, RefreshCw } from 'lucide-react';

export const TicketList = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const navigate = useNavigate();

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get('/api/tickets', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTickets(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to load tickets. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filteredTickets = tickets
    .filter(ticket => {
      const matchesSearch = 
        ticket.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ticket.ticketId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ticket.customer.name.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = 
        filterStatus === 'all' || ticket.status.toLowerCase() === filterStatus.toLowerCase();
      
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      if (sortBy === 'newest') {
        return new Date(b.createdAt) - new Date(a.createdAt);
      } else if (sortBy === 'oldest') {
        return new Date(a.createdAt) - new Date(b.createdAt);
      }
      return 0;
    });

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <RefreshCw className="animate-spin h-8 w-8 text-blue-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="flex items-center text-red-800">
          <AlertCircle className="mr-2" size={20} />
          {error}
        </div>
        <button
          onClick={fetchTickets}
          className="mt-2 text-sm text-red-600 hover:text-red-800"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-lg shadow">
        <div className="p-4 border-b">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
            <h2 className="text-xl font-bold">Tickets</h2>
            <button
              onClick={() => navigate('/tickets/new')}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md w-full sm:w-auto"
            >
              New Ticket
            </button>
          </div>
          
          <div className="mt-4 flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search tickets..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            
            <div className="flex space-x-4">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="pending">Pending</option>
                <option value="resolved">Resolved</option>
              </select>
              
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
              </select>
            </div>
          </div>
        </div>

        <div className="divide-y">
          {filteredTickets.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              No tickets found matching your criteria
            </div>
          ) : (
            filteredTickets.map(ticket => (
              <div
                key={ticket._id}
                onClick={() => navigate(`/tickets/${ticket._id}`)}
                className="p-4 hover:bg-gray-50 cursor-pointer transition duration-150"
              >
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <h3 className="font-medium">{ticket.title}</h3>
                    <p className="text-sm text-gray-600">
                      {ticket.ticketId} • {ticket.customer.name}
                    </p>
                    <p className="text-sm text-gray-500">
                      Created {format(new Date(ticket.createdAt), 'MMM d, yyyy')}
                    </p>
                  </div>
                  <div className="text-right space-y-2">
                    <span className={`inline-flex px-2 py-1 rounded-full text-sm ${
                      ticket.status === 'Active' ? 'bg-green-100 text-green-800' :
                      ticket.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {ticket.status}
                    </span>
                    <p className="text-sm text-gray-500">
                      Priority: {ticket.priority}
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};