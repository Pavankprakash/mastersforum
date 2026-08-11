import "./HomePage.css";
import React, { useEffect, useState } from "react";
import axios from "axios";


const HomePage = () => {
  const [stats, setStats] = useState({
    classrooms: 0,
    posts: 0,
    resources: 0,
  });

    const [recentClassrooms, setRecentClassrooms] = useState([]);
    const fetchStats = async () => {
      try {
        const res = await axios.get("http://localhost:5000/classrooms/stats");
        setStats(res.data.data);
      } catch (err) {
        console.log(err);
      }
    };

    const fetchRecentClassrooms = async () => {
      try {
        const res = await axios.get("http://localhost:5000/classrooms/recent");
        setRecentClassrooms(res.data.data);
      } catch (err) {
        console.log(err);
      }
    };
    
  useEffect(() => {
    fetchStats();
    fetchRecentClassrooms();
  }, []);

  return (
    <div className="home">

      <section className="hero">
        <div className="hero-text">
          <h1>Welcome to Masters Forum 👋</h1>
          <p>
            A secure platform where teachers create classrooms,
            share notes and resources, and collaborate with students.
          </p>

          <button className="browse-btn">
            Browse Classrooms
          </button>

        </div>

      </section>

      <section className="stats">

        <div className="stat-card">
          <h2>{stats.classrooms}</h2>
          <p>Classrooms</p>
        </div>

        <div className="stat-card">
          <h2>{stats.posts}</h2>
          <p>Posts</p>
        </div>

        <div className="stat-card">
          <h2>{stats.resources}</h2>
          <p>Resources</p>
        </div>

      </section>

      <section className="recent">

        <h2>Recent Classrooms</h2>

        <div className="class-grid">

          {recentClassrooms.map((classroom) => (
            <div className="class-card" key={classroom._id}>

              <h3>{classroom.name}</h3>

              <p>{classroom.description}</p>

              <button>Open</button>
            </div>
          ))}

        </div>

      </section>

    </div>
  );
};

export default HomePage;