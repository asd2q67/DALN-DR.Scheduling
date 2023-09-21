import React from "react";
import "./style.css";

import menu from "../../assets/icons/menu.svg";
import logo1 from "../../assets/icons/logo1.svg";
import calendar from "../../assets/icons/calendar.svg";
import doctor1 from "../../assets/icons/doctor1.svg";
import doctor2 from "../../assets/icons/doctor2.svg";
import home from "../../assets/icons/home.svg";
import patient from "../../assets/icons/patient.svg";
import person from "../../assets/icons/person.svg";
import room from "../../assets/icons/room.svg";
import logout from "../../assets/icons/logout.svg";
import avatar from "../../assets/icons/avatar.svg";

export const LandingPage = () => {
  return (
    <div className="landing-page">
      <div className="div">
        <div className="sidebar">
          <img className="logo" alt="Logo" src={logo1} />
          <div className="home">
            <img className="img" alt="Frame" src={home} />
            <div className="text-wrapper">Trang chủ</div>
          </div>
          <div className="doctor">
            <img className="frame-4" alt="Frame" src={person} />
            <div className="text-wrapper-2">Bác sĩ</div>
          </div>
          <div className="room">
            <div className="text-wrapper-2">Phòng</div>
            <img className="frame-4" alt="Frame" src={room} />
          </div>
          <div className="calendar">
            <div className="text-wrapper-3">Lịch làm việc</div>
            <img className="frame-4" alt="Frame" src={calendar} />
          </div>
          <div className="avatar">
            <div className="group">
              <img className="vector" alt="Avatar" src={avatar} />
              <div className="info">
                <div className="text-wrapper-4">Hao Do</div>
                <div className="text-wrapper-5">Admin</div>
              </div>
            </div>
            <div className="group-2">
              <img className="logout" alt="logout" src={logout} />
              <div className="text-wrapper-6">LOGOUT</div>
            </div>
          </div>
          <img className="menu" alt="Frame" src={menu} />
        </div>
        <div className="cardbox">
          <div className="card1">
            <div className="text-wrapper-7">Tổng số bác sĩ</div>
            <div className="text-wrapper-8">50</div>
            <img className="img-2" alt="Doctor" src={doctor1} />
          </div>
          <div className="card2">
            <div className="s-b-c-s-ang-tr-c">Số bác sĩ đang trực</div>
            <div className="text-wrapper-9">24</div>
            <img className="img-2" alt="Doctor" src={doctor2} />
          </div>
          <div className="card3">
            <div className="text-wrapper-10">Số bệnh nhân</div>
            <div className="text-wrapper-11">1122</div>
            <img className="img-2" alt="Patient" src={patient} />
          </div>
        </div>
      </div>
    </div>
  );
};
