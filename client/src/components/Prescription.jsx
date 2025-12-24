// export default Prescription;
import React from "react";
import PropTypes from "prop-types";
import LOGO from "../assets/logo.png";

const Prescription = React.forwardRef(({ patient, visit, doctor }, ref) => {
  return (
    <div
      ref={ref}
      className="bg-white p-3 print:p-2 text-[13px] print:text-[12px]"
    >
      {/* A4 Container */}
      <div className="max-w-[794px] mx-auto border border-gray-300 rounded-xl print:rounded-none print:border-gray-400">
        {/* ================= Header ================= */}
        <div className="flex justify-between items-center p-4 border-b">
          <img src={LOGO} alt="LOGO" className="w-24" />

          <div className="text-center flex-1">
            <h1 className="text-xl font-bold">{doctor.doctorName}</h1>
            <p className="text-sm text-blue-600">{doctor.medicalName}</p>
            <p className="text-xs text-gray-600">
              {doctor.specialization || "General Physician"}
            </p>
          </div>

          <div className="text-xs text-gray-600 space-y-1 text-right">
            <p>📞 {doctor.phone || "N/A"}</p>
            <p>✉ {doctor.email || "N/A"}</p>
            <p>📍 {doctor.address || "N/A"}</p>
          </div>
        </div>

        {/* ================= Patient Info ================= */}
        <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 border-b">
          <div>
            <p className="text-gray-500 text-xs">রোগীর নাম</p>
            <p className="font-semibold">{patient.patientName}</p>

            <p className="text-gray-500 text-xs mt-2">রোগীর বয়স</p>
            <p className="font-semibold">{patient.patientAge} বছর</p>
          </div>

          <div>
            <p className="text-gray-500 text-xs">তারিখ</p>
            <p className="font-semibold">
              {new Date(visit.date).toLocaleDateString("en-GB")}
            </p>

            <p className="text-gray-500 text-xs mt-2">সিরিয়াল</p>
            <p className="font-semibold">{patient.patientSerial || "AUTO"}</p>
          </div>
        </div>

        {/* ================= History ================= */}
        <div className="p-4 border-b">
          <h2 className="font-bold mb-2 text-sm">রোগীর ইতিহাস</h2>

          <div className="grid grid-cols-3 gap-3">
            <div className="bg-indigo-50 border p-2 rounded">
              <p className="font-semibold text-xs text-indigo-700">
                বর্তমান সমস্যা
              </p>
              <p>{patient.history?.presentHistory || "নেই"}</p>
            </div>

            <div className="bg-blue-50 border p-2 rounded">
              <p className="font-semibold text-xs text-blue-700">
                পূর্বের ইতিহাস
              </p>
              <p>{patient.history?.pastHistory || "নেই"}</p>
            </div>

            <div className="bg-teal-50 border p-2 rounded">
              <p className="font-semibold text-xs text-teal-700">
                পারিবারিক ইতিহাস
              </p>
              <p>{patient.history?.familyHistory || "নেই"}</p>
            </div>
          </div>
        </div>

        {/* ================= Problem ================= */}
        <div className="p-4 border-b">
          <h2 className="font-bold mb-1 text-sm">প্রধান সমস্যা</h2>
          <p className="bg-red-50 border p-2 rounded">
            {visit.problem || "উল্লেখ নেই"}
          </p>
        </div>

        {/* ================= Symptoms ================= */}
        <div className="p-4 border-b">
          <h2 className="font-bold mb-2 text-sm">লক্ষণ</h2>

          {visit.symtoms?.subSymtoms?.length ? (
            <div className="grid grid-cols-2 gap-2">
              {visit.symtoms.subSymtoms.map((s, i) => (
                <div
                  key={i}
                  className="border bg-yellow-50 p-1 rounded text-xs"
                >
                  {i + 1}. {s.subSymtomsName}
                </div>
              ))}
            </div>
          ) : (
            <p className="italic text-gray-500">কোনো লক্ষণ নেই</p>
          )}
        </div>

        {/* ================= Prescription ================= */}
        <div className="p-4">
          <h2 className="font-bold mb-2 text-sm">ঔষধ ও নির্দেশনা</h2>

          {visit.prescriptions?.length ? (
            <table className="w-full border text-xs">
              <thead className="bg-gray-100">
                <tr>
                  <th className="border p-1">ঔষধ</th>
                  <th className="border p-1">ডোজ</th>
                  <th className="border p-1">সময়</th>
                  <th className="border p-1">সময়কাল</th>
                </tr>
              </thead>
              <tbody>
                {visit.prescriptions.map((m, i) => (
                  <tr key={i}>
                    <td className="border p-1">{m.name}</td>
                    <td className="border p-1">{m.dose}</td>
                    <td className="border p-1">{m.frequency || "-"}</td>
                    <td className="border p-1">{m.duration || "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="italic text-gray-500">কোনো ঔষধ নেই</p>
          )}
        </div>

        {/* ================= Footer ================= */}
        <div className="p-4 border-t flex justify-end">
          <div className="text-right">
            <p className="font-bold">{doctor.doctorName}</p>
            <p className="text-xs">{doctor.qualification}</p>
            <p className="text-xs text-gray-500 mt-1">Signature</p>
          </div>
        </div>
      </div>
    </div>
  );
});

Prescription.propTypes = {
  patient: PropTypes.object.isRequired,
  visit: PropTypes.object.isRequired,
  doctor: PropTypes.object.isRequired,
};

Prescription.displayName = "Prescription";

export default Prescription;
