// client/src/components/Tickets/TicketDetail.js
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { format } from 'date-fns';
import { AlertCircle, Clock, User } from 'lucide-react';

export const TicketDetail = () => {
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { id } = useParams();
  // const navigate = useNavigate();

  useEffect(() => {
    fetchTicketDetails();
  }, [id]);

  const fetchTicketDetails = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`/api/tickets/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTicket(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to load ticket details');
      setLoading(false);
    }
  };

  const updateTicketStatus = async (newStatus) => {
    try {
      const token = localStorage.getItem('token');
      await axios.patch(`/api/tickets/${id}/status`, 
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` }}
      );
      setTicket(prev => ({ ...prev, status: newStatus }));
    } catch (err) {
      console.error('Failed to update ticket status:', err);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-gray-600">Loading ticket details...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 mt-4">
        <div className="flex items-center text-red-800">
          <AlertCircle className="mr-2" size={20} />
          {error}
        </div>
      </div>
    );
  }

  if (!ticket) return null;

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-6 border-b">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{ticket.title}</h2>
            <div className="mt-1 flex items-center space-x-4 text-sm text-gray-500">
              <span className="flex items-center">
                <Clock size={16} className="mr-1" />
                {format(new Date(ticket.createdAt), 'MMM d, yyyy')}
              </span>
              <span className="flex items-center">
                <User size={16} className="mr-1" />
                {ticket.customer.name}
              </span>
              <span className={`px-2 py-1 rounded-full text-sm ${
                ticket.status === 'Active' ? 'bg-green-100 text-green-800' :
                ticket.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {ticket.status}
              </span>
            </div>
          </div>
          
          <div className="flex space-x-3">
            <button
              onClick={() => updateTicketStatus('Active')}
              className="px-4 py-2 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-md"
              disabled={ticket.status === 'Active'}
            >
              Mark Active
            </button>
            <button
              onClick={() => updateTicketStatus('Resolved')}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md"
              disabled={ticket.status === 'Resolved'}
            >
              Mark Resolved
            </button>
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="mb-6">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Description</h3>
          <p className="text-gray-600 whitespace-pre-wrap">{ticket.description}</p>
        </div>

        <div className="border-t pt-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Details</h3>
          <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <dt className="text-sm font-medium text-gray-500">Ticket ID</dt>
              <dd className="mt-1 text-sm text-gray-900">{ticket.ticketId}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Priority</dt>
              <dd className="mt-1 text-sm text-gray-900">{ticket.priority}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Customer Email</dt>
              <dd className="mt-1 text-sm text-gray-900">{ticket.customer.email}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Created</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {format(new Date(ticket.createdAt), 'PPpp')}
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  );
};