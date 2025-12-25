import React, { useEffect, useState, useMemo, useRef } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchPatients,
  addVisit,
  deleteVisit,
  updatePatient,
} from "../store/slice/patientsSlice";
import { fetchDoctors } from "../store/slice/doctorSlice";
import {
  createSerial,
  getSerials,
  deleteSerial,
} from "../store/slice/serialSlice";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  FiEdit,
  FiPlus,
  FiUser,
  FiClock,
  FiClipboard,
  FiHeart,
  FiArrowLeft,
  FiCalendar,
  FiTrash2,
  FiPrinter,
  FiChevronRight,
  FiChevronDown,
  FiBriefcase,
  FiFileText,
  FiPhone,
  FiHash,
  FiImage,
  FiExternalLink,
  FiUpload,
  FiRefreshCw,
} from "react-icons/fi";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import AddVisitModal from "../components/AddVisitModal";
import EditPatientModal from "../components/EditPatientModal";
import EditSymptomsModal from "../components/EditSymptomsModal";
import EditPrescriptionsModal from "../components/EditPrescriptionsModal";
import Prescription from "../components/Prescription";
import { useReactToPrint } from "react-to-print";

// --- Sub-components defined first ---

const PatientHeader = ({ patient, onBack }) => (
  <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl shadow-lg p-6 mb-8 border-l-4 border-blue-500">
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
      <div className="flex items-center gap-4">
        <div className="relative">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center shadow-md">
            <FiUser className="text-3xl text-white" />
          </div>
          <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-1 shadow">
            <div className="w-6 h-6 bg-amber-500 rounded-full flex items-center justify-center">
              <span className="text-xs font-bold text-white">
                {patient.patientAge}
              </span>
            </div>
          </div>
        </div>
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 font-serif">
            {patient.patientName}
          </h1>
          <div className="flex flex-wrap gap-4 mt-2">
            <div className="flex items-center gap-2 text-gray-600">
              <FiPhone className="text-gray-400" />
              <span className="font-medium">{patient.patientMobile}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <FiHash className="text-gray-400" />
              <span className="font-medium">
                Serial: {patient.patientSerial}
              </span>
            </div>
          </div>
        </div>
      </div>
      <button
        onClick={onBack}
        className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-all duration-300 shadow-sm hover:shadow"
      >
        <FiArrowLeft className="text-gray-600" />
        <span className="font-medium text-gray-700">Back to Patients</span>
      </button>
    </div>
  </div>
);

const InfoCard = ({ title, icon, children, onEdit, className = "" }) => (
  <div
    className={`bg-white rounded-xl shadow-sm border border-gray-200 p-5 hover:shadow-md transition-shadow duration-300 ${className}`}
  >
    <div className="flex justify-between items-center mb-4 pb-3 border-b border-gray-100">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-blue-50 rounded-lg">
          {React.cloneElement(icon, { className: "text-blue-500" })}
        </div>
        <h3 className="text-lg font-bold text-gray-800">{title}</h3>
      </div>
      {onEdit && (
        <button
          onClick={onEdit}
          className="p-2 rounded-lg hover:bg-blue-50 transition-colors duration-200 text-blue-600 hover:text-blue-700"
          title="Edit"
        >
          <FiEdit className="h-4 w-4" />
        </button>
      )}
    </div>
    <div className="text-gray-700">{children}</div>
  </div>
);

const VisitHistory = ({ visits = [], onAddVisit, onDeleteVisit }) => {
  const [showAll, setShowAll] = useState(false);
  const displayedVisits = showAll ? visits : visits.slice(0, 3);

  return (
    <InfoCard title="Visit History" icon={<FiClock />} className="h-full">
      <div className="space-y-3">
        {displayedVisits.length > 0 ? (
          displayedVisits.map((visit) => (
            <div
              key={visit._id}
              className="flex justify-between items-center p-3 bg-gray-50 rounded-lg border border-gray-100 hover:bg-blue-50 transition-colors duration-200 group"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white rounded-lg shadow-sm">
                  <FiCalendar className="text-blue-400" />
                </div>
                <div>
                  <p className="font-semibold text-gray-800">
                    {new Date(visit.date).toLocaleDateString("en-US", {
                      weekday: "short",
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </p>
                  <p className="text-sm text-gray-600 truncate max-w-[200px]">
                    {visit.problem || "No problem specified"}
                  </p>
                </div>
              </div>
              <button
                onClick={() => onDeleteVisit(visit._id)}
                className="p-2 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-red-50 transition-all duration-200 text-red-400 hover:text-red-600"
                title="Delete visit"
              >
                <FiTrash2 className="h-4 w-4" />
              </button>
            </div>
          ))
        ) : (
          <div className="text-center py-4">
            <FiCalendar className="h-12 w-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">No visits recorded yet</p>
          </div>
        )}
      </div>

      {visits.length > 3 && (
        <button
          onClick={() => setShowAll(!showAll)}
          className="mt-4 w-full text-center text-sm font-medium text-blue-600 hover:text-blue-700 py-2 hover:bg-blue-50 rounded-lg transition-colors duration-200"
        >
          {showAll ? "Show Less" : `Show All (${visits.length})`}
        </button>
      )}

      <button
        onClick={onAddVisit}
        className="mt-4 w-full flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-lg hover:from-blue-600 hover:to-cyan-600 transition-all duration-300 shadow hover:shadow-md font-medium"
      >
        <FiPlus /> Add New Visit
      </button>
    </InfoCard>
  );
};

const VisitAccordion = ({ visit, index, handleEdit, onPrint }) => {
  const [isExpanded, setIsExpanded] = useState(index === 0); // Auto-expand first visit

  return (
    <div className="mb-4">
      <div
        onClick={() => setIsExpanded(!isExpanded)}
        className="cursor-pointer flex justify-between items-center p-4 bg-gradient-to-r from-white to-gray-50 rounded-xl border border-gray-200 hover:border-blue-300 transition-all duration-300 shadow-sm hover:shadow"
      >
        <div className="flex items-center gap-4">
          <div className="p-2 bg-blue-100 rounded-lg">
            <FiClipboard className="text-blue-500" />
          </div>
          <div>
            <p className="font-bold text-gray-800">
              Visit {index + 1} •{" "}
              <span className="text-blue-600">
                {new Date(visit.date).toLocaleDateString()}
              </span>
            </p>
            <p className="text-sm text-gray-600 mt-1">
              {visit.problem || "No problem specified"}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onPrint(visit);
            }}
            className="p-2 rounded-lg hover:bg-blue-50 transition-colors duration-200 text-blue-600 hover:text-blue-700"
            title="Print Prescription"
          >
            <FiPrinter className="h-5 w-5" />
          </button>
          <div className="text-gray-400">
            {isExpanded ? (
              <FiChevronDown className="h-5 w-5" />
            ) : (
              <FiChevronRight className="h-5 w-5" />
            )}
          </div>
        </div>
      </div>

      {isExpanded && (
        <div className="mt-2 p-5 bg-white rounded-xl border border-gray-200 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            <InfoCard
              title="General Info"
              icon={<FiBriefcase />}
              onEdit={() => handleEdit("general", visit, visit._id)}
            >
              <div className="space-y-3">
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    Condition
                  </p>
                  <p className="font-medium text-gray-800 mt-1">
                    {visit.condition || "Not specified"}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    Duration
                  </p>
                  <p className="font-medium text-gray-800 mt-1">
                    {visit.duration || "Not specified"}
                  </p>
                </div>
                {visit.notes && (
                  <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                      Notes
                    </p>
                    <p className="text-sm text-gray-700 mt-1">{visit.notes}</p>
                  </div>
                )}
              </div>
            </InfoCard>

            <InfoCard
              title="Symptoms"
              icon={<FiHeart />}
              onEdit={() =>
                handleEdit("symptoms", { symtoms: visit.symtoms }, visit._id)
              }
            >
              <div className="space-y-3">
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    Main Symptom
                  </p>
                  <p className="font-medium text-gray-800 mt-1">
                    {visit.symtoms?.symtomsName || "Not recorded"}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                    Sub-symptoms
                  </p>
                  {visit.symtoms?.subSymtoms?.length > 0 ? (
                    <ul className="space-y-1.5">
                      {visit.symtoms.subSymtoms.map((s, i) => (
                        <li
                          key={i}
                          className="flex items-center gap-2 text-sm text-gray-700"
                        >
                          <div className="w-1.5 h-1.5 bg-blue-400 rounded-full"></div>
                          {s.subSymtomsName}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-gray-500 italic">
                      No sub-symptoms recorded
                    </p>
                  )}
                </div>
              </div>
            </InfoCard>

            <InfoCard
              title="Prescriptions"
              icon={<FiFileText />}
              onEdit={() =>
                handleEdit(
                  "prescriptions",
                  { prescriptions: visit.prescriptions },
                  visit._id
                )
              }
            >
              {visit.prescriptions?.length > 0 ? (
                <ul className="space-y-2.5">
                  {visit.prescriptions.map((p, i) => (
                    <li
                      key={i}
                      className="p-3 bg-gradient-to-r from-gray-50 to-white rounded-lg border border-gray-100 hover:border-blue-200 transition-colors duration-200"
                    >
                      <div className="flex justify-between items-center">
                        <span className="font-semibold text-gray-800">
                          {p.name}
                        </span>
                        <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded">
                          {p.dose}
                        </span>
                      </div>
                      {p.instructions && (
                        <p className="text-xs text-gray-600 mt-1">
                          {p.instructions}
                        </p>
                      )}
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="text-center py-4">
                  <FiFileText className="h-8 w-8 text-gray-300 mx-auto mb-2" />
                  <p className="text-gray-500 text-sm">
                    No prescriptions recorded
                  </p>
                </div>
              )}
            </InfoCard>
          </div>

          <div className="mt-6 pt-5 border-t border-gray-100 flex justify-end">
            <button
              onClick={() => onPrint(visit)}
              className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-lg hover:from-blue-600 hover:to-cyan-600 transition-all duration-300 shadow hover:shadow-md font-medium"
            >
              <FiPrinter /> Generate Prescription
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const HistoryTagList = ({ title, items, icon }) => (
  <div className="mb-4 last:mb-0">
    <div className="flex items-center gap-2 mb-2">
      {icon}
      <p className="font-semibold text-gray-700">{title}</p>
    </div>
    {items && items.length > 0 ? (
      <div className="flex flex-wrap gap-2">
        {items.map((item, index) => (
          <span
            key={index}
            className="inline-flex items-center px-3 py-1.5 bg-gradient-to-r from-gray-100 to-white text-gray-700 text-sm font-medium rounded-full border border-gray-200 hover:border-blue-300 transition-colors duration-200"
          >
            {item}
          </span>
        ))}
      </div>
    ) : (
      <p className="text-gray-500 text-sm italic">
        No {title.toLowerCase()} recorded
      </p>
    )}
  </div>
);

// --- Main Serial Component ---

const Serial = () => {
  const { patientSerialNumber } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { patients = [], isLoading } = useSelector((state) => state.patient);
  const { doctors = [] } = useSelector((state) => state.doctor);
  const { serials, loading, error } = useSelector((state) => state.serial);
  const [isVisitModalOpen, setVisitModalOpen] = useState(false);
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [isSymptomsModalOpen, setSymptomsModalOpen] = useState(false);
  const [isPrescriptionsModalOpen, setPrescriptionsModalOpen] = useState(false);
  const [editingSection, setEditingSection] = useState(null);
  const [defaultValues, setDefaultValues] = useState({});
  const [editingVisitId, setEditingVisitId] = useState(null);
  const [selectedVisit, setSelectedVisit] = useState(null);
  const [activeTab, setActiveTab] = useState("visits"); // "visits" or "history"
  const [file, setFile] = useState(null);

  useEffect(() => {
    dispatch(fetchDoctors());
    dispatch(getSerials());
  }, [dispatch]);

  const medicalName =
    doctors.length > 0 ? doctors[0]?.medicalName : "Mathura Homio Samadhan";

  const patient = useMemo(
    () => patients.find((p) => p.patientSerial === Number(patientSerialNumber)),
    [patients, patientSerialNumber]
  );

  const componentRef = useRef();
  const handlePrint = useReactToPrint({
    contentRef: componentRef,
    documentTitle: `Prescription_${patient?.patientName}_${
      new Date().toISOString().split("T")[0]
    }`,
  });

  useEffect(() => {
    if (patients.length === 0) {
      dispatch(fetchPatients());
    }
    if (doctors.length === 0) {
      dispatch(fetchDoctors());
    }
  }, [dispatch, patients.length, doctors.length]);

  useEffect(() => {
    if (selectedVisit && componentRef.current) {
      setTimeout(() => {
        handlePrint();
        setSelectedVisit(null);
      }, 500);
    }
  }, [selectedVisit, handlePrint]);

  const handleAddVisit = async (visitData) => {
    try {
      await dispatch(addVisit({ patientId: patient._id, visitData })).unwrap();
      toast.success("✅ New visit added successfully!");
    } catch (error) {
      toast.error(`❌ Failed to add visit: ${error}`);
    }
  };

  const handleDeleteVisit = async (visitId) => {
    if (
      window.confirm(
        "Are you sure you want to delete this visit? This action cannot be undone."
      )
    ) {
      try {
        await dispatch(
          deleteVisit({ patientId: patient._id, visitId })
        ).unwrap();
        toast.success("✅ Visit deleted successfully!");
      } catch (error) {
        toast.error(`❌ Failed to delete visit: ${error.message}`);
      }
    }
  };

  const handleEdit = (section, data, visitId = null) => {
    setEditingSection(section);
    setDefaultValues(data);
    setEditingVisitId(visitId);
    if (section === "symptoms") {
      setSymptomsModalOpen(true);
    } else if (section === "prescriptions") {
      setPrescriptionsModalOpen(true);
    } else {
      setEditModalOpen(true);
    }
  };

  const handleSave = async (data) => {
    try {
      let updatedVisits = [...patient.visits];
      let updatedHistory = patient.history;
      let updatedMedicalHistory = patient.medicalHistory;

      if (editingSection === "prescriptions") {
        updatedVisits = updatedVisits.map((v) =>
          v._id === editingVisitId
            ? { ...v, prescriptions: data.prescriptions }
            : v
        );
      } else if (editingSection === "symptoms") {
        updatedVisits = updatedVisits.map((v) =>
          v._id === editingVisitId ? { ...v, symtoms: data.symtoms } : v
        );
      } else if (editingSection === "history") {
        updatedHistory = { ...data.history };
        updatedMedicalHistory = data.medicalHistory;
      } else {
        updatedVisits = updatedVisits.map((v) =>
          v._id === editingVisitId ? { ...v, ...data } : v
        );
      }

      const updatedData = {
        ...patient,
        history: updatedHistory,
        medicalHistory: updatedMedicalHistory,
        visits: updatedVisits,
      };

      await dispatch(
        updatePatient({ id: patient._id, data: updatedData })
      ).unwrap();

      toast.success("✅ Patient updated successfully!");
      setEditModalOpen(false);
      setSymptomsModalOpen(false);
      setPrescriptionsModalOpen(false);
    } catch (error) {
      toast.error(`❌ Failed to update: ${error}`);
    }
  };

  const handlePrintClick = (visit) => {
    setSelectedVisit(visit);
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleImageSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      toast.error("Please select an image");
      return;
    }
    const formData = new FormData();
    formData.append("photo", file);
    formData.append("pId", patient._id);
    try {
      await dispatch(createSerial(formData)).unwrap();
      toast.success("Image uploaded successfully");
      setFile(null);
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleDeleteImage = async (id) => {
    if (window.confirm("Are you sure you want to delete this image?")) {
      try {
        await dispatch(deleteSerial(id)).unwrap();
        toast.success("Image deleted successfully");
      } catch (error) {
        toast.error(error.message);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col justify-center items-center h-screen bg-gradient-to-br from-blue-50 to-cyan-50">
        <div className="relative">
          <div className="animate-spin rounded-full h-24 w-24 border-t-4 border-b-4 border-blue-500"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <FiUser className="text-3xl text-blue-400" />
          </div>
        </div>
        <p className="mt-6 text-lg font-medium text-gray-600">
          Loading patient data...
        </p>
      </div>
    );
  }

  if (!patient) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 p-6">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md text-center">
          <HiOutlineExclamationCircle className="h-16 w-16 text-red-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-3">
            Patient Not Found
          </h2>
          <p className="text-gray-600 mb-6">
            Patient with serial number{" "}
            <span className="font-bold">{patientSerialNumber}</span> could not
            be found.
          </p>
          <button
            onClick={() => navigate("/patients")}
            className="px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-lg hover:from-blue-600 hover:to-cyan-600 transition-all duration-300 shadow hover:shadow-md font-medium"
          >
            Back to Patients List
          </button>
        </div>
      </div>
    );
  }

  const { history = {}, visits = [], medicalHistory = [] } = patient;
  const doctor = doctors[0] || {};
  const patientSerials = serials?.filter(
    (serial) => serial.pId?.toString() === patient._id
  );

  return (
    <div className="flex-1 bg-gradient-to-br from-gray-50 to-blue-50 min-h-screen">
      {/* Header Section */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <Link to="/" className="flex flex-col items-center text-center">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-800 font-serif">
                {medicalName}
              </h1>
              <p className="text-gray-600 mt-1 text-sm">
                হোমিও চিকিৎসা নিন-আস্থা রাখুন-সুস্থ থাকুন
              </p>
            </Link>
            <div className="flex items-center gap-4">
              <div className="hidden md:block px-4 py-2 bg-blue-50 rounded-lg">
                <p className="text-sm text-gray-600">Doctor</p>
                <p className="font-bold text-gray-800">
                  {doctor.doctorName || "Dr. Unknown"}
                </p>
              </div>
              <button
                onClick={() => navigate("/patients")}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-all duration-300"
              >
                <FiArrowLeft /> Patients
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-6">
        <PatientHeader patient={patient} onBack={() => navigate("/patients")} />

        {/* Tab Navigation */}
        <div className="flex border-b border-gray-200 mb-6">
          <button
            className={`px-6 py-3 font-medium text-lg transition-colors duration-300 ${
              activeTab === "visits"
                ? "text-blue-600 border-b-2 border-blue-500"
                : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setActiveTab("visits")}
          >
            <div className="flex items-center gap-2">
              <FiClipboard /> Visit History
              {visits.length > 0 && (
                <span className="bg-blue-100 text-blue-700 text-xs font-bold px-2 py-1 rounded-full">
                  {visits.length}
                </span>
              )}
            </div>
          </button>
          <button
            className={`px-6 py-3 font-medium text-lg transition-colors duration-300 ${
              activeTab === "history"
                ? "text-blue-600 border-b-2 border-blue-500"
                : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setActiveTab("history")}
          >
            <div className="flex items-center gap-2">
              <FiFileText /> Medical History
            </div>
          </button>
        </div>

        {activeTab === "visits" ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Visits List */}
            <div className="lg:col-span-2">
              {visits.length > 0 ? (
                <div>
                  <h3 className="text-xl font-bold text-gray-800 mb-4">
                    All Visits ({visits.length})
                  </h3>
                  {visits.map((visit, index) => (
                    <VisitAccordion
                      key={visit._id}
                      visit={visit}
                      index={index}
                      handleEdit={handleEdit}
                      onPrint={handlePrintClick}
                    />
                  ))}
                </div>
              ) : (
                <div className="bg-white rounded-2xl shadow-sm p-8 text-center">
                  <FiCalendar className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-gray-700 mb-2">
                    No Visits Recorded
                  </h3>
                  <p className="text-gray-500 mb-6">
                    This patient hasn't had any visits yet.
                  </p>
                  <button
                    onClick={() => setVisitModalOpen(true)}
                    className="px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-lg hover:from-blue-600 hover:to-cyan-600 transition-all duration-300 shadow hover:shadow-md font-medium"
                  >
                    Add First Visit
                  </button>
                </div>
              )}
            </div>
            {/* =====================================================///////////////////======================= */}

            <div className="space-y-6 order-3">
              <InfoCard title="Patient Images" icon={<FiImage />}>
                <div className="space-y-4">
                  {/* Image Upload Form */}
                  <form onSubmit={handleImageSubmit} className="space-y-4">
                    <label
                      htmlFor="image-upload"
                      className="block border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-blue-400 transition-colors duration-300 cursor-pointer"
                    >
                      <div className="flex flex-col items-center justify-center">
                        <FiUpload className="h-12 w-12 text-gray-400 mb-4" />
                        <p className="text-gray-600 font-medium mb-2">
                          Click to upload or drag & drop
                        </p>
                        <p className="text-sm text-gray-500">
                          PNG, JPG, GIF up to 5MB
                        </p>
                      </div>
                      <input
                        type="file"
                        onChange={handleFileChange}
                        accept="image/*"
                        className="hidden"
                        id="image-upload"
                      />
                    </label>
                    {file && (
                      <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <FiImage className="h-6 w-6 text-green-600" />
                            <div>
                              <p className="text-sm font-medium text-green-800">
                                Selected File
                              </p>
                              <p className="text-xs text-green-600 truncate max-w-[200px]">
                                {file.name}
                              </p>
                            </div>
                          </div>
                          <span className="text-xs font-medium text-green-700">
                            {(file.size / 1024 / 1024).toFixed(2)} MB
                          </span>
                        </div>
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={!file}
                      className={`w-full py-3 rounded-lg font-medium transition-all duration-300 flex items-center justify-center gap-2 ${
                        file
                          ? "bg-gradient-to-r from-blue-500 to-cyan-500 text-white hover:from-blue-600 hover:to-cyan-600 shadow hover:shadow-md"
                          : "bg-gray-100 text-gray-400 cursor-not-allowed"
                      }`}
                    >
                      <FiUpload /> {loading ? "Uploading..." : "Upload Image"}
                    </button>
                  </form>

                  {/* Image Gallery */}
                  <div>
                    <div className="flex justify-between items-center mb-3 pb-2 border-b">
                      <h4 className="font-semibold text-gray-700">
                        Uploaded Images ({patientSerials?.length || 0})
                      </h4>
                      {patientSerials?.length > 0 && (
                        <button
                          onClick={() => dispatch(getSerials())}
                          className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1"
                        >
                          <FiRefreshCw className="h-3 w-3" /> Refresh
                        </button>
                      )}
                    </div>
                    {patientSerials?.length > 0 ? (
                      <div className="grid grid-cols-2 gap-4">
                        {patientSerials.map((serial) => (
                          <div
                            key={serial._id}
                            className="group relative overflow-hidden rounded-xl border border-gray-200 hover:border-blue-300 transition-all duration-300 hover:shadow-lg"
                          >
                            <div className="aspect-square overflow-hidden bg-gray-100">
                              <img
                                src={serial.image?.url}
                                alt={`Patient image ${serial._id}`}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                onError={(e) => {
                                  e.target.onerror = null;
                                  e.target.src =
                                    "https://via.placeholder.com/300x300?text=Image+Error";
                                }}
                              />
                            </div>
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                              <div className="absolute bottom-2 left-3 right-3">
                                <p className="text-white text-xs">
                                  Uploaded:{" "}
                                  {new Date(
                                    serial.createdAt
                                  ).toLocaleDateString()}
                                </p>
                              </div>
                            </div>
                            <button
                              onClick={() =>
                                window.open(serial.image?.url, "_blank")
                              }
                              className="absolute top-2 right-2 p-1.5 bg-white/90 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-white"
                              title="View Full Size"
                            >
                              <FiExternalLink className="h-4 w-4 text-gray-700" />
                            </button>
                            <button
                              onClick={() => handleDeleteImage(serial._id)}
                              className="absolute bottom-2 right-2 p-1.5 bg-red-500/90 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-red-500"
                              title="Delete Image"
                            >
                              <FiTrash2 className="h-4 w-4 text-white" />
                            </button>
                            <div className="absolute top-2 left-2">
                              <span className="px-2 py-1 bg-black/70 text-white text-xs rounded-full">
                                #{serial._id.slice(-4)}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-3">
                          <FiImage className="h-8 w-8 text-gray-400" />
                        </div>
                        <p className="text-gray-500 font-medium">
                          No images uploaded yet
                        </p>
                        <p className="text-sm text-gray-400 mt-1">
                          Upload patient images or documents
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </InfoCard>
            </div>

            {/* =====================================================///////////////////======================= */}
            {/* Sidebar */}
            <div className="space-y-6 order-2">
              <VisitHistory
                visits={visits}
                onAddVisit={() => setVisitModalOpen(true)}
                onDeleteVisit={handleDeleteVisit}
              />

              <InfoCard title="Quick Actions" icon={<FiBriefcase />}>
                <div className="space-y-3">
                  <button
                    onClick={() => setVisitModalOpen(true)}
                    className="w-full text-left p-3 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors duration-200 text-blue-700 font-medium"
                  >
                    + Add New Visit
                  </button>
                  <button
                    onClick={() =>
                      handleEdit("history", {
                        history,
                        medicalHistory: patient.medicalHistory,
                      })
                    }
                    className="w-full text-left p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors duration-200 text-gray-700 font-medium"
                  >
                    ✏️ Edit Medical History
                  </button>
                  <button
                    onClick={() => navigate("/patients")}
                    className="w-full text-left p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors duration-200 text-gray-700 font-medium"
                  >
                    ← Back to Patients
                  </button>
                </div>
              </InfoCard>
            </div>
          </div>
        ) : (
          /* Medical History Tab */
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <InfoCard
              title="Medical History"
              icon={<FiFileText />}
              onEdit={() =>
                handleEdit("history", {
                  history,
                  medicalHistory: patient.medicalHistory,
                })
              }
            >
              <div className="space-y-5">
                <HistoryTagList
                  title="Present History"
                  items={history.presentHistory}
                  icon={
                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  }
                />
                <HistoryTagList
                  title="Past History"
                  items={history.pastHistory}
                  icon={
                    <span className="w-2 h-2 bg-amber-500 rounded-full"></span>
                  }
                />
                <HistoryTagList
                  title="Family History"
                  items={history.familyHistory}
                  icon={
                    <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                  }
                />
                <HistoryTagList
                  title="Medical History"
                  items={medicalHistory}
                  icon={
                    <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                  }
                />
              </div>
            </InfoCard>

            <InfoCard title="Patient Summary" icon={<FiUser />}>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <p className="text-xs text-gray-500">Total Visits</p>
                    <p className="text-2xl font-bold text-blue-600">
                      {visits.length}
                    </p>
                  </div>
                  <div className="p-3 bg-green-50 rounded-lg">
                    <p className="text-xs text-gray-500">Last Visit</p>
                    <p className="font-bold text-green-600">
                      {visits.length > 0
                        ? new Date(
                            visits[visits.length - 1].date
                          ).toLocaleDateString()
                        : "Never"}
                    </p>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-700 mb-2">
                    Patient Notes
                  </p>
                  <p className="text-gray-600 text-sm">
                    {patient.notes || "No additional notes for this patient."}
                  </p>
                </div>
              </div>
            </InfoCard>
          </div>
        )}
      </div>

      {/* Hidden Prescription for Printing */}
      {selectedVisit && (
        <div style={{ display: "none" }}>
          <Prescription
            ref={componentRef}
            patient={patient}
            visit={selectedVisit}
            doctor={doctor}
          />
        </div>
      )}

      {/* Modals */}
      <AddVisitModal
        isOpen={isVisitModalOpen}
        onClose={() => setVisitModalOpen(false)}
        onSave={handleAddVisit}
      />
      <EditPatientModal
        isOpen={isEditModalOpen}
        onClose={() => setEditModalOpen(false)}
        onSave={handleSave}
        section={editingSection}
        defaultValues={defaultValues}
      />
      <EditSymptomsModal
        isOpen={isSymptomsModalOpen}
        onClose={() => setSymptomsModalOpen(false)}
        onSave={handleSave}
        defaultValues={defaultValues}
      />
      <EditPrescriptionsModal
        isOpen={isPrescriptionsModalOpen}
        onClose={() => setPrescriptionsModalOpen(false)}
        onSave={handleSave}
        defaultValues={defaultValues}
      />

      <ToastContainer
        position="bottom-right"
        autoClose={3000}
        theme="colored"
        toastClassName="rounded-lg shadow-lg"
      />
    </div>
  );
};

export default Serial;
