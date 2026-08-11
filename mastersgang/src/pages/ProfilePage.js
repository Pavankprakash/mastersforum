import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import './ProfilePage.css';
import { useNavigate } from 'react-router-dom';
import { BookOpen, FileText, GraduationCap, Plus } from "lucide-react";

const ProfilePage = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showPopup, setShowPopup] = useState(false);
    const [classroomName, setClassroomName] = useState('');
    const [description, setDescription] = useState('');
    const [classroomsCreatedByMe, setClassroomsCreatedByMe] = useState([]);
    const [classroomsJoinedByMe, setClassroomsJoinedByMe] = useState([]);

    const [dashboardStats, setDashboardStats] = useState({
        classrooms: 0,
        resources: 0,
        students: 0
    });

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/auth/getuser`, {
                    method: 'GET',
                    credentials: 'include',
                });
                const data = await response.json();
                console.log(data)


                if (response.ok) {
                    setUser(data.data);
                } else {
                    toast.error(data.message || 'Failed to fetch user data');
                }
            }
            catch (error) {
                toast.error('An error occurred while fetching user data');
            } finally {
                setLoading(false);
            }
        }
        fetchUser();

    }, [])


    const fetchClassrooms = async () => {
        try {
            const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/classrooms/classroomscreatedbyme`, {
                method: 'GET',
                credentials: 'include',
            });

            const data = await response.json();

            if (response.ok) {
                setClassroomsCreatedByMe(data.data);
            } else {
                toast.error(data.message || 'Failed to fetch classrooms');
            }
        } catch (error) {
            toast.error('An error occurred while fetching classrooms');
        }
    }
    const fetchClassroomsJoinedByMe = async () => {
        try {
            const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/classrooms/classroomsforstudent`, {
                method: 'GET',
                credentials: 'include',
            });

            const data = await response.json();
            console.log(data)
            if (response.ok) {
                setClassroomsJoinedByMe(data.data);
            }
        }
        catch (error) {
            toast.error('An error occurred while fetching joined classrooms');
        }
    }
    useEffect(() => {
        if (user) {
            fetchDashboardStats();
            fetchClassrooms();
            fetchClassroomsJoinedByMe();
        }
    }, [user]);

    const handleCreateClassroom = async () => {
        try {
            const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/classrooms/create`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: classroomName,
                    description,
                }),
                credentials: 'include',
            });

            const data = await response.json();
            if (response.ok) {
                toast.success('Classroom created successfully');
                setClassroomName('');
                setDescription('');
                setShowPopup(false);
                fetchClassrooms();
            } else {
                toast.error(data.message || 'Failed to create classroom');
            }
        }
        catch (error) {
            toast.error('An error occurred while creating classroom');
        }
    }
    const fetchDashboardStats = async () => {
        try {
            const response = await fetch(
                `${process.env.REACT_APP_API_BASE_URL}/classrooms/dashboardstats`,
                {
                    credentials: "include"
                }
            );
            const data = await response.json();
            if (response.ok) {
                setDashboardStats(data.data);
            }
        }
        catch (err) {
            console.log(err);
        }
    }

    const navigate = useNavigate();
    const handleRowClick = (classroomId) => {
        navigate(`/classes/${classroomId}`);  // Navigate to the class details page
    };
    return (
        <div className="profile-page">
            {loading ? (
                <div className="loading">Loading...</div>
            ) : user ? (
                <>
                    <h1 className="page-title">My Profile</h1>
                    <div className="profile-header">
                        <div className="profile-left">
                            <img
                                src="https://ui-avatars.com/api/?name=Pavan+Kumar&background=1f2a42&color=fff&size=200"
                                alt="profile"
                                className="profile-picture"
                            />
                            <div>
                                <h2>{user.name}</h2>
                                <p>{user.email}</p>

                                <span className="role-badge">
                                    {user.role}
                                </span>
                            </div>
                        </div>

                        {user.role === "teacher" && (
                            <button
                                className="create-classroom-btn"
                                onClick={() => setShowPopup(true)}
                            >
                                <Plus size={13} />
                                Create Classroom
                            </button>
                        )}

                    </div>

                    {showPopup && (
                        <div className="popup-overlay">

                            <div className="popup-content">

                                <h2>Create Classroom</h2>

                                <input
                                    type="text"
                                    placeholder="Classroom Name"
                                    value={classroomName}
                                    onChange={(e) => setClassroomName(e.target.value)}
                                />

                                <textarea
                                    placeholder="Description"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                />

                                <div className="popup-buttons">

                                    <button onClick={handleCreateClassroom}>
                                        Create
                                    </button>

                                    <button
                                        className="cancel-btn"
                                        onClick={() => setShowPopup(false)}
                                    >
                                        Cancel
                                    </button>

                                </div>

                            </div>

                        </div>
                    )}

                    {/* Dashboard Statistics */}
                    <div className="dashboard-cards">
                        <div className="dashboard-card">
                            <BookOpen
                                size={40}
                                color="#2563eb"
                                strokeWidth={2}
                            />
                            <h3>{dashboardStats.classrooms}</h3>
                            <p>My Classrooms</p>
                        </div>

                        <div className="dashboard-card">
                            <FileText
                                size={40}
                                color="#10b981"
                                strokeWidth={2}
                            />
                            <h3>{dashboardStats.resources}</h3>
                            <p>Resources</p>
                        </div>

                        <div className="dashboard-card">
                            <GraduationCap
                                size={40}
                                color="#f59e0b"
                                strokeWidth={2}
                            />
                            <h3>{dashboardStats.students}</h3>
                            <p>Students</p>
                        </div>
                    </div>

                    {/* Teacher Section */}
                    {user.role === "teacher" && (
                        <div className="classroom-list">
                            <h3>My Classrooms</h3>
                            
                            <div className="teacher-grid">
                                {classroomsCreatedByMe.map((classroom) => (
                                    <div
                                        key={classroom._id}
                                        className="teacher-card"
                                    >
                                        <h3>{classroom.name}</h3>

                                        <p>{classroom.description}</p>

                                        <button
                                            onClick={() => handleRowClick(classroom._id)}
                                        >
                                            Open Classroom
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Student Section */}
                    <div className="classroom-list">
                        <h3>Joined Classrooms</h3>

                        <div className="joined-grid">
                            {classroomsJoinedByMe.map((classroom) => (
                                <div
                                    key={classroom._id}
                                    className="joined-card"
                                >
                                    <h4>{classroom.name}</h4>

                                    <p>{classroom.description}</p>

                                    <span className="classroom-role">
                                        Student Access
                                    </span>

                                    <button
                                        onClick={() => handleRowClick(classroom._id)}
                                    >
                                        Open Classroom →
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                </>
            ) : (
                <p>No user data found.</p>
            )
            }
        </div>
    )
};
export default ProfilePage;