

import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { setEventDetails,setEvent } from "../slices/userSlice"; 
import { useForm } from "react-hook-form";
import { useSelector, useDispatch } from "react-redux";

const EventForm = () => {
  const [eventData, setEventData] = useState({
    name: "",
    date: "",
    category: "",
    image: null,
  });

  const { eventDetails, editEvent, event, token, editEventId } = useSelector(
    (state) => state.auth
  );
  const { eventId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  console.log(token, editEventId);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    if (editEvent) {
      setEventData({
        name: eventDetails.name,
        date: eventDetails.date,
        category: eventDetails.category,
        image: eventDetails.image,
      });

      setValue("name", eventDetails.name);
      setValue("date", eventDetails.date);
      setValue("category", eventDetails.category);
      setValue("image", eventDetails.image);
    } else if (eventId) {
      const fetchEvent = async () => {
        try {
          const response = await axios.get(
            `http://localhost:3000/api/v1/events/${eventId}`
          );
          const fetchedEvent = response.data;

          setEventData({
            name: fetchedEvent.name,
            date: fetchedEvent.date,
            category: fetchedEvent.category,
            image: null,
          });

          setValue("name", fetchedEvent.name);
          setValue("date", fetchedEvent.date);
          setValue("category", fetchedEvent.category);
        } catch (error) {
          console.error(error);
        }
      };

      fetchEvent();
    }
  }, [eventId, editEvent, setValue, eventDetails]);

  console.log(event, eventId, editEventId, editEvent, setValue, eventDetails);
  

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEventData((prev) => ({ ...prev, [name]: value }));
    setValue(name, value);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setEventData((prev) => ({ ...prev, image: file }));
    setValue("image", file);
  };

  const onSubmit = async (data) => {
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("date", data.date);
    formData.append("category", data.category);
    if (eventData.image) {
      formData.append("image", eventData.image);
    }

    try {
      let response;
      if (editEvent || eventId) {
        const idToEdit = editEvent ? event._id : eventId;
        response = await axios.put(
          `http://localhost:3000/api/v1/events/edit/${idToEdit}`,
           eventId
        );
      } else {
        response = await axios.post(
          "http://localhost:3000/api/v1/events/create",
          eventData
        );
      }

      dispatch(setEventDetails(response?.data?.event));
      navigate("/");  
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async () => {
    try {
      const confirmed = window.confirm("Are you sure you want to delete this event?");
      if (confirmed) {
        await axios.delete(`http://localhost:3000/api/v1/events/${eventId}`);
        dispatch(setEventDetails({}));
        navigate("/");  
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-300">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-lg p-8 bg-white rounded-lg shadow-lg"
      >
        <h2 className="text-3xl font-semibold text-center text-gray-700 mb-6">
          {editEvent || eventId ? "Edit Event" : "Create Event"}
        </h2>

        {/* Event Name */}
        <div className="mb-4">
          <label htmlFor="name" className="block text-gray-600 font-medium mb-2">
            Event Name
          </label>
          <input
            {...register("name", { required: "Event name is required" })}
            type="text"
            name="name"
            id="name"
            value={eventData.name}
            onChange={handleChange}
            placeholder="Event Name"
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          {errors.name && (
            <span className="text-red-500 text-sm">{errors.name.message}</span>
          )}
        </div>

        {/* Event Date */}
        <div className="mb-4">
          <label htmlFor="date" className="block text-gray-600 font-medium mb-2">
            Event Date
          </label>
          <input
            {...register("date", { required: "Event date is required" })}
            type="date"
            name="date"
            id="date"
            value={eventData.date}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          {errors.date && (
            <span className="text-red-500 text-sm">{errors.date.message}</span>
          )}
        </div>

        {/* Event Category */}
        <div className="mb-4">
          <label
            htmlFor="category"
            className="block text-gray-600 font-medium mb-2"
          >
            Event Category
          </label>
          <input
            {...register("category", { required: "Event category is required" })}
            type="text"
            name="category"
            id="category"
            value={eventData.category}
            onChange={handleChange}
            placeholder="Category"
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          {errors.category && (
            <span className="text-red-500 text-sm">{errors.category.message}</span>
          )}
        </div>

        {/* Event Image */}
        <div className="mb-6">
          <label
            htmlFor="image"
            className="block text-gray-600 font-medium mb-2"
          >
            Upload Image
          </label>
          <input
            {...register("image")}
            type="file"
            onChange={handleFileChange}
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          {eventData.image && (
            <p className="text-sm text-gray-600 mt-2">
              Selected file: {eventData.image.name}
            </p>
          )}
        </div>

        <button
          type="submit"
          className="w-full py-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          {editEvent ? "Save Changes" : "Create Event"}
        </button>

        {editEvent && (
          <button
            type="button"
            onClick={handleDelete}
            className="w-full py-3 bg-red-600 text-white rounded-md mt-4 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            Delete Event
          </button>
        )}
      </form>
    </div>
  );
};

export default EventForm;
