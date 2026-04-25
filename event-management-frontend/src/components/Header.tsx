import React from "react";
import Menu from "./Menu";
import { useNavigate, Link } from "react-router-dom";

function Header() {


   const navigate=useNavigate();
    function SelectOption(e:React.ChangeEvent<HTMLSelectElement>){
       navigate(e.target.value)

    }
  return (
    <div className="flex justify-between items-center p-3 bg-blue-500 text-white h-[50px]">
      <div className="flex items-center space-x-4">
        <div className="flex flex-col justify-center items-center w-[40px] h-[40px] p-2 bg-white shadow-md rounded-lg">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="91"
            height="91"
            viewBox="0 0 91 91"
            fill="none"
            className="w-6 h-6 md:w-16 md:h-16"
          >
            <path
              d="M45.0321 52.5372L78.8061 33.7738L45.0321 15.0105L11.2581 33.7738L45.0321 52.5372Z"
              stroke="#155DFC"
              stroke-width="7.50533"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M45.0321 52.5374L68.1486 39.6958C71.1902 47.4191 72.0534 55.8292 70.6441 64.0093C61.1257 64.9332 52.1517 68.8751 45.0321 75.2598C37.9135 68.8758 28.941 64.9339 19.4239 64.0093C18.0137 55.8292 18.8769 47.4189 21.9195 39.6958L45.0321 52.5374Z"
              stroke="#155DFC"
              stroke-width="7.50533"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-white font-Inter">
          University Events
        </h3>
      </div>
      <div className="flex items-center gap-5 ">
        <Menu to="/" label="Home" />
        <Menu to="/about" label="About" />
        <select
          className="bg-transparent hover:bg-white/20 transition text-white px-3 py-1 font-bold border-white rounded-md "
          value="dsdds" onChange={SelectOption}
        >
          <option value="" className="text-black">
            Manage
          </option>
          <option value="/events" className="text-black">
            Events
          </option>
          <option value="/catogory" className="text-black">
           Catogory
          </option>
          <option value="/viewstudents" className="text-black">
            View Students
          </option>
          <option value="/registration" className="text-black">
            Registrations
          </option>
           <option value="/announcement" className="text-black">
            annoucements
          </option>
          
        </select>
      </div>
      <div className="flex items-center gap-3">
        <Link to="/profile" className="flex items-center gap-2 hover:opacity-80 transition cursor-pointer">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="76"
            height="76"
            viewBox="0 0 76 76"
            fill="none"
            className="w-2 h-2 md:w-6 md:h-6 "
          >
            <path
              d="M59.4173 65.6718V59.4173C59.4173 56.0998 58.0994 52.9181 55.7536 50.5722C53.4077 48.2263 50.226 46.9084 46.9084 46.9084H28.1451C24.8276 46.9084 21.6459 48.2263 19.3 50.5722C16.9541 52.9181 15.6362 56.0998 15.6362 59.4173V65.6718"
              stroke="white"
              stroke-width="6.25444"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M37.5268 34.3996C44.4353 34.3996 50.0357 28.7992 50.0357 21.8907C50.0357 14.9823 44.4353 9.38184 37.5268 9.38184C30.6184 9.38184 25.0179 14.9823 25.0179 21.8907C25.0179 28.7992 30.6184 34.3996 37.5268 34.3996Z"
              stroke="white"
              stroke-width="6.25444"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
          <h3 className="font-bold">Admin Profile</h3>
        </Link>
        <div className="flex items-center hover:bg-white/20 transition p-1 rounded  ml-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="61"
            height="61"
            viewBox="0 0 61 61"
            fill="none"
            className="w-2 h-2 md:w-6 md:h-6 "
          >
            <path
              d="M22.516 52.5374H12.5089C11.1819 52.5374 9.90923 52.0102 8.97088 51.0719C8.03253 50.1335 7.50537 48.8608 7.50537 47.5338V12.5089C7.50537 11.1819 8.03253 9.90923 8.97088 8.97088C9.90923 8.03253 11.1819 7.50537 12.5089 7.50537H22.516"
              stroke="white"
              stroke-width="5.00356"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M40.0286 42.5305L52.5375 30.0216L40.0286 17.5127"
              stroke="white"
              stroke-width="5.00356"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M52.5373 30.0215H22.516"
              stroke="white"
              stroke-width="5.00356"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
          <button className="text-white px-3 py-1 rounded  font-bold">
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}

export default Header;
