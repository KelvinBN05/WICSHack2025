// "use client";
// import React, { useEffect, useState } from "react";
// import Modal from "react-modal";
// import ChallengeCard from "../components/ChallengeCard"; // ✅ Import ChallengeCard component
// import "./feed.css"; // ✅ Import styles

// export default function FeedPage() {
//   const [challenges, setChallenges] = useState([]);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [formData, setFormData] = useState({
//     title: "",
//     weight: "",
//     reps: "",
//     username: "",
//   });

//   // ✅ Fix React Modal Warning
//   useEffect(() => {
//     if (typeof window !== "undefined") {
//       Modal.setAppElement(document.body);
//     }
//   }, []);

//   // ✅ Fetch challenges from backend
//   useEffect(() => {
//     const fetchChallenges = async () => {
//       try {
//         const response = await fetch("http://localhost:5001/api/challenges");
//         if (!response.ok) throw new Error("Failed to fetch challenges");
//         const data = await response.json();
//         setChallenges(data);
//       } catch (error) {
//         console.error("Error fetching challenges:", error);
//       }
//     };

//     fetchChallenges();
//   }, []);

//   // ✅ Handle input changes in modal
//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   // ✅ Handle challenge creation
//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     const response = await fetch("http://localhost:5001/api/challenges", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify(formData),
//     });

//     if (response.ok) {
//       const newChallenge = await response.json();
//       setChallenges((prevChallenges) => [newChallenge, ...prevChallenges]); // Add to feed
//       setIsModalOpen(false); // Close modal
//       setFormData({ title: "", weight: "", reps: "", username: "" }); // Reset form
//     } else {
//       console.error("Error creating challenge");
//     }
//   };

//   return (
//     <div className="feed-container">
//       {/* ✅ Header (Unchanged) */}
//       <header className="header">
//         <div className="header-container">
//           <img src="/Rectangle.png" alt="Background" className="header-bg" />
//           <img src="/dbL.png" alt="Left Dumbbell" className="dumbbell" />
//           <img src="/gainsville.png" alt="GainsVille Logo" className="gainsville-text" />
//           <img src="/dbR.png" alt="Right Dumbbell" className="dumbbell" />
//         </div>
//       </header>

//       {/* ✅ Floating Button to Open Modal (Bottom Left) */}
//       <button className="create-btn" onClick={() => setIsModalOpen(true)}>
//         + Create Challenge
//       </button>

//       {/* ✅ Modal for Creating Challenges */}
//       <Modal
//         isOpen={isModalOpen}
//         onRequestClose={() => setIsModalOpen(false)}
//         className="modal"
//       >
//         <h2>Create a Challenge</h2>
//         <form onSubmit={handleSubmit}>
//           <input type="text" name="title" value={formData.title} onChange={handleInputChange} placeholder="Challenge Title" required />
//           <input type="number" name="weight" value={formData.weight} onChange={handleInputChange} placeholder="Weight (lbs)" required />
//           <input type="number" name="reps" value={formData.reps} onChange={handleInputChange} placeholder="Reps" required />
//           <input type="text" name="username" value={formData.username} onChange={handleInputChange} placeholder="Username" required />
//           <button type="submit">Submit</button>
//         </form>
//         <button className="close-btn" onClick={() => setIsModalOpen(false)}>Close</button>
//       </Modal>

//       {/* ✅ Display Challenges Using `ChallengeCard` */}
//       <div className="challenge-list">
//         {challenges.length === 0 && <p>No challenges yet.</p>}
//         {challenges.map((challenge) => (
//           <ChallengeCard key={challenge._id} challenge={challenge} />
//         ))}
//       </div>
//     </div>
//   );
// }
"use client";
import React, { useEffect, useState } from "react";
import Modal from "react-modal";
import ChallengeCard from "../components/ChallengeCard";
import "./feed.css";
import ProtectedRoute from "../components/ProtectedRoute"; // ✅ Import ProtectedRoute

export default function FeedPage() {
  const [challenges, setChallenges] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    weight: "",
    reps: "",
    username: "",
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      Modal.setAppElement(document.body);
    }
  }, []);

  useEffect(() => {
    const fetchChallenges = async () => {
      try {
        const response = await fetch("http://localhost:5001/api/challenges");
        if (!response.ok) throw new Error("Failed to fetch challenges");
        const data = await response.json();
        setChallenges(data);
      } catch (error) {
        console.error("Error fetching challenges:", error);
      }
    };

    fetchChallenges();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await fetch("http://localhost:5001/api/challenges", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    if (response.ok) {
      const newChallenge = await response.json();
      setChallenges((prevChallenges) => [newChallenge, ...prevChallenges]);
      setIsModalOpen(false);
      setFormData({ title: "", weight: "", reps: "", username: "" });
    } else {
      console.error("Error creating challenge");
    }
  };

  return (
    <ProtectedRoute> {/* ✅ Wrap in ProtectedRoute */}
      <div className="feed-container">
        <header className="header">
          <div className="header-container">
            <img src="/Rectangle.png" alt="Background" className="header-bg" />
            <img src="/dbL.png" alt="Left Dumbbell" className="dumbbell" />
            <img src="/gainsville.png" alt="GainsVille Logo" className="gainsville-text" />
            <img src="/dbR.png" alt="Right Dumbbell" className="dumbbell" />
          </div>
        </header>

        <button className="create-btn" onClick={() => setIsModalOpen(true)}>
          + Create Challenge
        </button>

        <Modal
          isOpen={isModalOpen}
          onRequestClose={() => setIsModalOpen(false)}
          className="modal"
        >
          <h2>Create a Challenge</h2>
          <form onSubmit={handleSubmit}>
            <input type="text" name="title" value={formData.title} onChange={handleInputChange} placeholder="Challenge Title" required />
            <input type="number" name="weight" value={formData.weight} onChange={handleInputChange} placeholder="Weight (lbs)" required />
            <input type="number" name="reps" value={formData.reps} onChange={handleInputChange} placeholder="Reps" required />
            <input type="text" name="username" value={formData.username} onChange={handleInputChange} placeholder="Username" required />
            <button type="submit">Submit</button>
          </form>
          <button className="close-btn" onClick={() => setIsModalOpen(false)}>Close</button>
        </Modal>

        <div className="challenge-list">
          {challenges.length === 0 && <p>No challenges yet.</p>}
          {challenges.map((challenge) => (
            <ChallengeCard key={challenge._id} challenge={challenge} />
          ))}
        </div>
      </div>
    </ProtectedRoute>
  );
}
