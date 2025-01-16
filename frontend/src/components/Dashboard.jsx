import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  setEditEventId,
  setEventDetails,
  setEditEvent,
  setEvent,
} from "../slices/userSlice";

const Dashboard = () => {
  // let API_BASE_URL = "http://localhost:3000/api/v1"
  let API_BASE_URL = 'https://event-assignment-backend.onrender.com'

  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editLoading, setEditLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const dataOfEvent = ["All", "javascript", "python", "c++", "java"];

  const { event ,user,token} = useSelector((state) => state.auth);
  //console.log("user is " , user);
  

  const fetchEvents = () => {
    setLoading(true); // Start loading for fetching events
    axios
      .get(`${API_BASE_URL}/events/allevents`)
      .then((response) => {
        setEvents(response.data);
        dispatch(setEvent([...response.data]));
        setFilteredEvents(response.data); // Show all events initially
        setLoading(false); // Stop loading when data is fetched
      })
      .catch((error) => {
        console.log(error);
        setLoading(false); // Stop loading on error
      });
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const editEventHandler = async (id) => {
    // setEditLoading(true);
    dispatch(setEditEvent(true));
    dispatch(setEditEventId(id));

    //navigate(`/dashboard/editEvent/${id}`);
  };

  //console.log("event ", event);

  const filterByCategory = (category) => {
    if (category === "All") {
      setFilteredEvents(events);
    } else {
      const filtered = events.filter((event) => event.category === category);
      setFilteredEvents(filtered);
    }
  };

  const deleteEventHandler = async (id) => {
    setLoading(true);
    try {
      await axios.delete(`${API_BASE_URL}/events/delete`, id);
      fetchEvents();
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
    fetchEvents();
  };

  const logout = async()=>{
     localStorage.removeItem('user');
     localStorage.removeItem('token');
     console.log( token , user);
     alert("Logout successfully!")
  }

  return (
    <div className="min-h-screen bg-gray-400 py-8 px-4 sm:px-6 md:px-12 lg:px-20">
      <div className="max-w-4xl mx-auto bg-gray-300 p-6 rounded-lg shadow-md">
        {/* Header Section */}
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-center text-gray-800 mb-4">
            Upcoming Events
          </h1>
          <div className="flex flex-wrap justify-center gap-4 mb-6">
            <Link to="/">
              <button className="bg-green-600 text-white px-4 sm:px-6 py-2 rounded-md hover:bg-green-700  focus:outline-none focus:ring-2 focus:ring-red-500">
                Login
              </button>
            </Link>
            <Link to="/register">
              <button className="bg-green-600 text-white px-4 sm:px-6 py-2 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500">
                Register
              </button>
            </Link>
            <Link to="/event/create">
              <button className="bg-green-600 text-white px-4 sm:px-6 py-2 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500">
                Create an event
              </button>
            </Link>

            <Link to="/">
              <button 
              onClick={logout}
              className="bg-red-400 text-white px-4 sm:px-6 py-2 rounded-md hover:bg-red-700  focus:outline-none focus:ring-2 focus:ring-red-500">
                Logout
              </button>
            </Link>
          </div>
        </div>

        {/* Category Filter Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-5 gap-4 mb-4">
          {dataOfEvent.map((category) => (
            <button
              key={category}
              onClick={() => filterByCategory(category)}
              className={`${
                category === "All"
                  ? "bg-gray-700 text-white"
                  : "bg-gray-500 text-white"
              } rounded-2xl hover:bg-blue-600 transition py-2`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Loading Indicator */}
        {loading && (
          <div className="text-center text-gray-500">Loading events...</div>
        )}

        {/* Events List */}
        {filteredEvents.length === 0 ? (
          <h3 className="text-lg sm:text-xl text-gray-500 text-center">
            No events found
          </h3>
        ) : (
          <ul className="grid gap-6 sm:gap-8 lg:grid-cols-2">
            {filteredEvents.map((event) => (
              <li
                key={event._id}
                className="p-4 bg-gray-50 rounded-lg shadow-sm hover:bg-gray-200 transition-all"
              >
                <div className="mb-4">
                  <h3 className="text-lg sm:text-xl font-medium text-gray-700">
                    {event.name}
                  </h3>
                  <p className="text-gray-500">
                    {new Date(event.date).toISOString().split("T")[0]}
                  </p>
                </div>

                {/* Edit Button */}
                {editLoading ? (
                  <button className="bg-red-600 text-white px-4 py-2 rounded-md cursor-not-allowed">
                    Editing...
                  </button>
                ) : (
                  <Link to={`/dashboard/editEvent/${event._id}`}>
                    <button
                      onClick={() => editEventHandler(event._id)}
                      className="bg-black text-white px-4 py-2 rounded-md hover:bg-gray-700 transition"
                    >
                      Edit Details
                    </button>
                  </Link>
                )}

                {/* Delete Button */}
                <button
                  onClick={() => deleteEventHandler(event._id)}
                  className="bg-red-600 ml-6 mt-5 sm:mt-0 text-white px-4 py-2 rounded-md hover:bg-red-700 transition"
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
