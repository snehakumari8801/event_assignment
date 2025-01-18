import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { setEventDetails } from "../slices/userSlice";
import { useForm } from "react-hook-form";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import Login from "../components/Login";

const EventForm = () => {
  // let API_BASE_URL = "http://localhost:3000/api/v1"
  let API_BASE_URL = "https://event-assignment-backend.onrender.com";

  const [eventData, setEventData] = useState({
    name: "",
    date: "",
    category: "",
    image: null,
  });

  const { eventDetails, editEvent, event, token, editEventId, user } =
    useSelector((state) => state.auth);
  const { eventId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  //console.log("edit Id", editEventId);
  console.log("user ", user);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  let eventDetail = event.find((event) => event._id === editEventId);

  useEffect(() => {
    if (editEvent) {
      const eventDetail = event.find((event) => event._id === editEventId);
      if (eventDetail) {
        setEventData({
          name: eventDetail.name,
          date: eventDetail.date,
          category: eventDetail.category,
          image: eventDetail.image,
        });

        setValue("name", eventDetail.name);
        setValue("date", eventDetail.date);
        setValue("category", eventDetail.category);
        setValue("image", eventDetail.image);
      }
    } else if (eventId) {
      const fetchEvent = async () => {
        try {
          const response = await axios.get(
            `${API_BASE_URL}/api/v1/events/${eventId}`
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
  }, [eventId, editEvent, setValue, editEventId, event]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEventData((prev) => ({ ...prev, [name]: value }));
    setValue(name, value);
  };

  // if (!user) {
  //   return (
  //     <div className="text-center mt-5 -mb-5">
  //       <p className="text-lg font-semibold text-black">Please login first to continue.</p>
  //      <Login/>
  //     </div>
  //   );
  // }

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
      if (editEvent) {
        response = await axios.put(
          `${API_BASE_URL}/api/v1/events/edit/${editEventId}`,
          eventData
        );
      } else {
        response = await axios.post(
          `${API_BASE_URL}/api/v1/events/create`,
          eventData
        );
      }

      dispatch(setEventDetails(response?.data?.event));
      navigate("/dashboard");
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  const handleDelete = async () => {
    try {
      const confirmed = window.confirm(
        "Are you sure you want to delete this event?"
      );
      if (confirmed) {
        await axios.delete(`${API_BASE_URL}/events/${eventId}`);
        dispatch(setEventDetails({}));
        navigate("/dashboard"); // Redirect after deletion
      }
    } catch (error) {
      console.error("Error deleting event:", error);
    }
  };

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-gray-300">
      <Link to="/dashboard">
        <div
          className=" bg-red-800 mt-2 text-center pt-2 text-white rounded-xl h-10 
        w-[380px] "
        >
          <span>Go To Dashboard</span>
        </div>
      </Link>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full mt-7 max-w-lg p-8 bg-white rounded-lg shadow-lg"
      >
        <h2 className="text-3xl font-semibold text-center text-gray-700 mb-6">
          {editEvent || eventId ? "Edit Event" : "Create Event"}
        </h2>

        {/* Event Name */}
        <div className="mb-4">
          <label
            htmlFor="name"
            className="block text-gray-600 font-medium mb-2"
          >
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
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
          />
          {errors.name && (
            <span className="text-red-500 text-sm">{errors.name.message}</span>
          )}
        </div>

        {/* Event Date */}
        <div className="mb-4">
          <label
            htmlFor="date"
            className="block text-gray-600 font-medium mb-2"
          >
            Event Date
          </label>
          <input
            {...register("date", { required: "Event date is required" })}
            type="date"
            name="date"
            id="date"
            value={eventData.date}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
          />
          {errors.date && (
            <span className="text-red-500 text-sm">{errors.date.message}</span>
          )}
        </div>

        {/* Event Category */}
        {/* <div className="mb-4">
          <label
            htmlFor="category"
            className="block text-gray-600 font-medium mb-2"
          >
            Event Category
          </label>
          <input
            {...register("category", {
              required: "Event category is required",
            })}
            type="text"
            name="category"
            id="category"
            value={eventData.category}
            onChange={handleChange}
            placeholder="Category"
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
          />
          {errors.category && (
            <span className="text-red-500 text-sm">
              {errors.category.message}
            </span>
          )}
        </div> */}

        <div className="mb-4">
          <label
            htmlFor="category"
            className="block text-gray-600 font-medium mb-2"
          >
            Event Category
          </label>
          <select
            {...register("category", {
              required: "Event category is required",
            })}
            name="category"
            id="category"
            value={eventData.category}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            <option value="">Select Category</option>
            <option value="javascript">JavaScript</option>
            <option value="python">Python</option>
            <option value="c++">C++</option>
            <option value="java">Java</option>
          </select>
          {errors.category && (
            <span className="text-red-500 text-sm">
              {errors.category.message}
            </span>
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
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
          />
          {eventData.image && (
            <p className="text-sm text-gray-600 mt-2">
              Selected file: {eventData.image.name}
            </p>
          )}
        </div>

        <button
          type="submit"
          className="w-full py-3 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-red-500"
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
