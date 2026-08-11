import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import './ClassesDetails.css';
import { Plus, Bookmark, FileText, Users } from 'lucide-react';

const ClassesDetails = () => {
  const { classid } = useParams();
  const [classroom, setClassroom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [showResourcePopup, setShowResourcePopup] = useState(false);
  const [resourceTitle, setResourceTitle] = useState('');
  const [resourceDescription, setResourceDescription] = useState('');

  const [showJoinPopup, setShowJoinPopup] = useState(false);
  const [otp, setOtp] = useState('');
  const [showOtpPopup, setShowOtpPopup] = useState(false);
  const [otpError, setOtpError] = useState('');


  const fetchClassDetails = async () => {
    try {
      setLoading(true)
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/classrooms/getclassbyid/${classid}`, {
        method: 'GET',
        credentials: 'include',
      });

      const data = await response.json();

      if (response.ok) {
        setClassroom(data.data);
      } else {
        toast.error(data.message || 'Failed to fetch class details');
      }
    } catch (error) {
      toast.error('Error fetching class details');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchClassDetails();
  }, [classid]);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/auth/getuser`, {
          method: 'GET',
          credentials: 'include',
        });

        const data = await response.json();

        if (response.ok) {
          setUser(data.data);
        } else {
          toast.error(data.message || 'Failed to fetch user data');
        }
      } catch (error) {
        toast.error('An error occurred while fetching user data');
      }
    };

    fetchUser();
  }, []);


  const handleAddResource = () => {
    setShowResourcePopup(true);  // Show the popup

  }
  const handleSubmitResource = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/classrooms/addpost`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: resourceTitle,
          description: resourceDescription,
          classId: classid
        }),
        credentials: 'include',
      });

      const data = await response.json();

      if (response.ok) {
        toast.success('Resource created successfully');
        setResourceTitle('');  // Clear the input fields
        setResourceDescription('');
        setShowResourcePopup(false);  // Close the popup
        fetchClassDetails(); // Optionally refresh resources here
      } else {
        toast.error(data.message || 'Failed to create resource');
      }
    }
    catch (error) {
      toast.error('An error occurred while creating the resource');
    }

  }
  const handleCloseResourcePopup = () => {
    setShowResourcePopup(false);  // Show the popup

  }
  const handleJoinRequest = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/classrooms/request-to-join`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          classroomId: classid,
          studentEmail: user?.email,
        }),
        credentials: 'include',
      });

      const data = await response.json();

      if (response.ok) {
        setShowJoinPopup(false);
        setShowOtpPopup(true);
        toast.success('OTP sent to the class owner');
      } else {
        toast.error(data.message || 'Failed to send join request');
      }

    }
    catch (error) {
      toast.error('An error occurred while sending join request');
    }
  }

  const handleSubmitOtp = async () => {

    try {
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/classrooms/verify-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          classroomId: classid,
          studentEmail: user?.email,
          otp
        }),
        credentials: 'include',
      });

      const data = await response.json();

      if (response.ok) {
        setOtp('');
        setShowOtpPopup(false);
        toast.success('Successfully joined the class');
        fetchClassDetails(); // Refresh the classroom details
      } else {
        setOtpError(data.message || 'Failed to verify OTP');
      }
    } catch (error) {
      console.log(error)
      toast.error('An error occurred while verifying OTP');
    }
  }
  const handleCloseOtpPopup = () => {
    setShowOtpPopup(false);
    setOtpError('');
  }


  if (loading) {
    return <div className="loading">Loading...</div>;
  }
  const isStudent = classroom?.students?.includes(user?.email);
  const isOwner = classroom?.owner === user?._id


  return (
    <div className="class-details">
      <div className="class-header">
        <img
          src="https://placehold.co/200x200"
          alt="Classroom"
          className="classroom-image"
        />
        <div className="class-info">
          <h1>{classroom?.name}</h1>
          <p>{classroom?.description}</p>
          <div className="class-stats">
            <div className="stat-item">
              <Users size={18} />
              <span>
                {classroom?.students?.length || 0} Students
              </span>
            </div>
            <div className="stat-item">
              <FileText size={18} />
              <span>
                {classroom?.posts?.length || 0} Resources
              </span>
            </div>
          </div>
        </div>

        <div className="class-actions">
          {isOwner && (
            <button
              className="add-resource-btn"
              onClick={handleAddResource}
            >
              + Add Resource
            </button>

          )}

          {!isStudent && !isOwner && (

            <button
              className="join-btn"
              onClick={() => setShowJoinPopup(true)}
            >
              Join Classroom
            </button>

          )}

        </div>

      </div>

      <div className='post-grid'>
        {
          (isStudent || isOwner) && classroom?.posts?.length > 0 ? (
            classroom.posts.map((post, index) => (
              <div key={index} className="post-card">
                <h3>{post.title}</h3>
                <p>{post.description}</p>
                <small>{new Date(post.createdAt).toLocaleDateString()}</small>
              </div>

            ))
          ) : (
            <p>No posts available</p>
          )

        }
      </div>

      {showResourcePopup && (
        <div className="popup-overlay">
          <div className="popup-content">
            <h3>Add Resource</h3>
            <input
              type="text"
              placeholder="Title"
              value={resourceTitle}
              onChange={(e) => setResourceTitle(e.target.value)}
            />
            <textarea
              placeholder="Description"
              value={resourceDescription}
              onChange={(e) => setResourceDescription(e.target.value)}
            />
            <div className="popup-buttons">
              <button onClick={handleSubmitResource}>Submit</button>
              <button onClick={handleCloseResourcePopup}>Close</button>
            </div>
          </div>
        </div>
      )}


      {showJoinPopup && (
        <div className="popup-overlay">
          <div className="popup-content">
            <h3>Join Request</h3>
            <p>Do you want to join this class? An OTP will be sent to the class owner for approval.</p>

            <div className="popup-buttons">

              <button onClick={handleJoinRequest}>Send Join Request</button>
              <button onClick={() => setShowJoinPopup(false)}>Close</button>
            </div>
          </div>

        </div>

      )}

      {showOtpPopup && (
        <div className="popup-overlay">
          <div className="popup-content">
            <h3>Enter OTP</h3>
            <input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />
            {otpError && <p className="otp-error">{otpError}</p>}

            <div className="popup-buttons">
              <button onClick={handleSubmitOtp}>Submit</button>
              <button onClick={handleCloseOtpPopup}>Close</button>
            </div>
          </div></div>
      )}
    </div>
  )
}

export default ClassesDetails