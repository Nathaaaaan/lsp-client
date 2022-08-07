import React, { useContext } from "react";
import { AppContext } from "../context/appContext";
import { AiOutlineCloseCircle } from "react-icons/ai";



import "./ProfileInfo.css";

function ProfileInfo({ profileRef, showProfileInfo, setShowProfileInfo, profileIndex}) {
  const { privateMemberMsg } = useContext(AppContext);

  console.log("FROM PROFILE INFO", privateMemberMsg);

  const calculateAge = (year, month, day) => {
    var today_date = new Date();
    var today_day = today_date.getDate();
    var today_month = today_date.getMonth();
    var today_year = today_date.getFullYear();

    var calculated_age = 0;

    if (today_month > month) calculated_age = today_year - year;
    else if (today_month == month) {
      if (today_day >= day) calculated_age = today_year - year;
      else calculated_age = today_year - year - 1;
    } else calculated_age = today_year - year - 1;

    return calculated_age;
  };

  const capitalizeFirstLetter = (language) => {
    return (
      language.charAt(0).toUpperCase() + language.substring(1).toLowerCase()
    );
  };

  const handleClick = () => {
    setShowProfileInfo(false);
  };

  const setInfoSize = () => {
    const element = document.getElementById('profileInfoSize')
    console.log("ELEMENT", element?.offsetHeight)
    if(element?.offsetHeight > 280 || profileIndex < 5) {
      return 'large'
    } else {
      return 'small'
    }
    
  };
 
 

  return (
   
    <div id="profileInfoSize" className={`profile-inner-${setInfoSize()}`} ref={profileRef}>
      <button className="close-icon" onClick={handleClick}>
        <AiOutlineCloseCircle />
      </button>
      <div className="d-flex align-items-center mb-3">
        <img src={privateMemberMsg?.picture} className="profile-img" />
        <p className="profile-detail">
          {privateMemberMsg.name},{" "}
          {privateMemberMsg?.dob_year
            ? calculateAge(
                privateMemberMsg.dob_year,
                privateMemberMsg.dob_month,
                privateMemberMsg.dob_date
              )
            : " "}
        </p>
      </div>
      <h6>NATIVE LANGUAGE</h6>
      <p className="profile-mt">
        {privateMemberMsg?.mother_tongue
          ? capitalizeFirstLetter(privateMemberMsg?.mother_tongue)
          : " "}
      </p>
      <h6>LEARNING</h6>
      {privateMemberMsg.learning_languages?.map((language) => (
        <p className="profile-ll">
          {" "}
          {language ? capitalizeFirstLetter(language) : " "}
        </p>
      ))}
      <h6>ABOUT ME</h6>
      <p className="profile-about">{privateMemberMsg?.about}</p>
    </div>
  );
}

export default ProfileInfo;
