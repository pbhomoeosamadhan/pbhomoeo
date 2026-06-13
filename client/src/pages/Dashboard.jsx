import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { fetchDoctors } from "../store/slice/doctorSlice";
import { MdAttachMoney, MdOutlineFamilyRestroom } from "react-icons/md";
import { FaUserDoctor } from "react-icons/fa6";
import { BiSolidCategory } from "react-icons/bi";

const Dashboard = () => {
  const { doctors } = useSelector((state) => state.doctor);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  useEffect(() => {
    dispatch(fetchDoctors());
  }, [dispatch]);
  
  const options = [
    {
      path: "doctors",
      title: "Chember",
      icon: <FaUserDoctor />,
      description: "Manage doctor records and information",
      color: "from-purple-500 to-indigo-400",
      iconColor: "text-purple-500",
      bgColor: "bg-purple-50",
    },
    {
      path: "categories",
      title: "Categories",
      icon: <BiSolidCategory />,
      description: "Manage symptom categories",
      color: "from-pink-500 to-rose-400",
      iconColor: "text-pink-500",
      bgColor: "bg-pink-50",
    },
    
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-7xl mx-auto py-10">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-3 py-4">
            আপনার চেম্বার সিলেক্ট করুন
          </h1>
          <p className="text-gray-600 text-lg">
            রোগের চিকিৎসায় সহজ সমাধান হোমিও চিকিৎসা
          </p>
          <div className="h-1 w-24 bg-gradient-to-r from-blue-500 to-indigo-500 mx-auto mt-4 rounded-full"></div>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {doctors?.map((chem, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden group"
            >
              {/* Card Header with Gradient */}
              <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-4">
                <h2 className="text-xl font-bold text-white text-center truncate">
                  {chem?.medicalName}
                </h2>
              </div>

              {/* Card Body */}
              <div className="p-6 space-y-4">
                {/* Doctor Name */}
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0">
                    <svg
                      className="w-5 h-5 text-blue-500 mt-0.5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      ></path>
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase font-semibold">
                      Doctor
                    </p>
                    <p className="text-gray-800 font-medium">
                      {chem?.doctorName}
                    </p>
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0">
                    <svg
                      className="w-5 h-5 text-blue-500 mt-0.5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      ></path>
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase font-semibold">
                      Email
                    </p>
                    <p className="text-gray-800 text-sm break-all">
                      {chem?.email}
                    </p>
                  </div>
                </div>

                {/* Phone */}
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0">
                    <svg
                      className="w-5 h-5 text-blue-500 mt-0.5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                      ></path>
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase font-semibold">
                      Phone
                    </p>
                    <p className="text-gray-800 font-medium">{chem?.phone}</p>
                  </div>
                </div>

                {/* Address */}
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0">
                    <svg
                      className="w-5 h-5 text-blue-500 mt-0.5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      ></path>
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      ></path>
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase font-semibold">
                      Address
                    </p>
                    <p className="text-gray-800 text-sm">{chem?.address}</p>
                  </div>
                </div>

                {/* Time Section */}
                <div className="pt-4 border-t border-gray-200">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                      <svg
                        className="w-4 h-4 text-green-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        ></path>
                      </svg>
                      <span className="text-sm font-semibold text-gray-700">
                        Open: {chem?.timeOpen}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <svg
                        className="w-4 h-4 text-red-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        ></path>
                      </svg>
                      <span className="text-sm font-semibold text-gray-700">
                        Close: {chem?.timeClose}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Card Footer with Hover Effect */}
              <div className="bg-gray-50 px-6 py-3">
                <button
                  onClick={() => navigate(`/${chem._id}`)}
                  className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-2 rounded-lg hover:from-blue-600 hover:to-indigo-700 transition-all duration-300 transform hover:scale-105 font-medium"
                >
                  Book Appointment
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {doctors?.length === 0 && (
          <div className="text-center py-16">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 rounded-full mb-4">
              <svg
                className="w-10 h-10 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                ></path>
              </svg>
            </div>
            <p className="text-gray-500 text-lg">No chambers found</p>
            <p className="text-gray-400 text-sm mt-2">
              Please check back later
            </p>
          </div>
        )}
      </div>
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {options.map((option) => (
            <Link
              to={option.path}
              key={option.title}
              className="group block transition-transform duration-300 hover:scale-[1.02]"
            >
              <div
                className={`h-full rounded-2xl overflow-hidden shadow-lg transition-all duration-300 hover:shadow-xl ${option.bgColor} border border-white`}
              >
                {/* Gradient Top Bar */}
                <div className={`h-2 bg-gradient-to-r ${option.color}`}></div>

                <div className="p-6">
                  <div className="flex items-start">
                    {/* Icon Container */}
                    <div
                      className={`flex-shrink-0 w-14 h-14 rounded-xl flex items-center justify-center ${option.bgColor} border border-white shadow-sm`}
                    >
                      <div className={`text-2xl ${option.iconColor}`}>
                        {option.icon}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="ml-5 flex-1">
                      <h3 className="text-xl font-bold text-gray-800 group-hover:text-gray-900 transition-colors">
                        {option.title}
                      </h3>
                      <p className="text-gray-600 mt-2 text-sm leading-relaxed">
                        {option.description}
                      </p>

                      {/* Access Button */}
                      <div className="mt-4 flex items-center text-sm font-medium">
                        <span
                          className={`${option.iconColor} transition-colors group-hover:underline`}
                        >
                          Access Module
                        </span>
                        <svg
                          className="ml-2 w-4 h-4 transition-transform duration-300 group-hover:translate-x-1"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M14 5l7 7m0 0l-7 7m7-7H3"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
