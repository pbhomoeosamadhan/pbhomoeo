import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { fetchDoctorsById } from "../store/slice/doctorSlice";

const Header = () => {
  const { chamId } = useParams();

  const { doctor } = useSelector((state) => state.doctor);
  const dispatch = useDispatch();
  useEffect(() => {
    if (!chamId) return;
    dispatch(fetchDoctorsById(chamId));
  }, [dispatch, chamId]);
  return (
    <div className="flex flex-col  items-center justify-between">
      <h1 className="text-3xl md:text-4xl font-bold text-gray-800">
        {doctor?.medicalName}
      </h1>
      <p className="text-gray-600 mt-2">
        হোমিও চিকিৎসা নিন-আস্থা রাখুন-সুস্থ থাকুন
      </p>
    </div>
  );
};

export default Header;
