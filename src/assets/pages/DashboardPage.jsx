import "./Dashboard.css";
import { useEffect } from "react";
import { useState } from "react";
import { USERNAME } from "../../constants";
import { Button, Flex } from "antd";

const DashboardPage = () => {
  const [date, setDate] = useState("");
  useEffect(() => {
    const date = new Date();
    let currentDay = date.toDateString();
    setDate(currentDay);
  }, []);
  return (
    <section className="dashboard">
      <div className="main-card">
        <p className="current-date">{date}</p>
        <div className="dashboard-greeting">
          <h3 className="dashboard-username">Welcome back, {USERNAME}</h3>
          <p className="dashboard-reminder">
            Always stay updated in your admin portal
          </p>
        </div>
      </div>
      <div className="wrapper">
        <div className="statistics">
          <h2 className="statistics-title">Statistics</h2>
          <div className="stats-row">
            <div className="stats-card">
              <h3>+10</h3>
              <p>Teachers</p>
            </div>
            <div className="stats-card">
              <h3>+70</h3>
              <p>Students</p>
            </div>
            <div className="stats-card">
              <h3>$900</h3>
              <p>Average salary</p>
            </div>
            <div className="stats-card">
              <h3>+60</h3>
              <p>Average mark</p>
            </div>
            <div className="stats-card">
              <h3>+70%</h3>
              <p>Attendance rate</p>
            </div>
            <div className="stats-card">
              <h3>+25%</h3>
              <p>Employed</p>
            </div>
          </div>
        </div>
      </div>
      <div className="dashboard-message">
        <h2 className="courses-title">Courses</h2>
        <Flex className="courses-row" align="center" gap={30}>
          <div className="course-card">
            <p className="course-name">Frontend | Web Security</p>
            <Button type="dashed">View</Button>
          </div>
          <div className="course-card">
            <p className="course-name">Backend | Data Structures</p>
            <Button type="dashed">View</Button>
          </div>
          <div className="course-card">
            <p className="course-name">Algorith | Machine Learning</p>
            <Button type="dashed">View</Button>
          </div>
          <div className="course-card">
            <p className="course-name">Artificial Intelligence</p>
            <Button type="dashed">View</Button>
          </div>
        </Flex>
      </div>
    </section>
  );
};

export default DashboardPage;
