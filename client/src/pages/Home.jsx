import { MdOutlineFamilyRestroom, MdAttachMoney } from "react-icons/md";
import { FaUserDoctor } from "react-icons/fa6";
import { BiSolidCategory } from "react-icons/bi";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchDoctors } from "../store/slice/doctorSlice";
import { useEffect } from "react";

const options = [
  {
    path: "/patients",
    title: "Patients",
    icon: <MdOutlineFamilyRestroom />,
    description: "Manage patient records and information",
    color: "from-blue-500 to-cyan-400",
    iconColor: "text-blue-500",
    bgColor: "bg-blue-50",
  },
  {
    path: "/doctors",
    title: "Doctors",
    icon: <FaUserDoctor />,
    description: "Manage doctor records and information",
    color: "from-purple-500 to-indigo-400",
    iconColor: "text-purple-500",
    bgColor: "bg-purple-50",
  },
  {
    path: "/categories",
    title: "Categories",
    icon: <BiSolidCategory />,
    description: "Manage symptom categories",
    color: "from-pink-500 to-rose-400",
    iconColor: "text-pink-500",
    bgColor: "bg-pink-50",
  },
  {
    path: "/accounting",
    title: "Accounts",
    icon: <MdAttachMoney />,
    description: "Handle billing and financial records",
    color: "from-green-500 to-emerald-400",
    iconColor: "text-green-500",
    bgColor: "bg-green-50",
  },
];

const Home = () => {
  const { doctors } = useSelector((state) => state.doctor);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchDoctors());
  }, [dispatch]);

  const medicalName = doctors.map((item) => item.medicalName);
  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 p-4 md:p-8">
      {/* Header Section */}
      <div className="max-w-7xl mx-auto mb-10">
        <div className="flex flex-col  items-center justify-between">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800">
            {medicalName ? medicalName : "Mathura Homio Samadhan"}
          </h1>
          <p className="text-gray-600 mt-2">
            হোমিও চিকিৎসা নিন-আস্থা রাখুন-সুস্থ থাকুন
          </p>
        </div>
      </div>

      {/* Dashboard Cards Grid */}
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

        {/* Footer Note */}
        <div className="mt-8 text-center text-gray-500 text-sm">
          <p>
            মথুরা হোমিও সমাধান Management System • v2.4.1 • Last updated:
            December 2025
          </p>
        </div>
      </div>
    </div>
  );
};

export default Home;
