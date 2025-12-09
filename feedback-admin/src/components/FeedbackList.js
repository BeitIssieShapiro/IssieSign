import React, { useState, useEffect } from 'react';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { signOut } from 'firebase/auth';
import { db, auth } from '../firebaseConfig';

function FeedbackList() {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    // Query feedbacks ordered by createdAt descending (newest first)
    const q = query(
      collection(db, 'userFeedback'),
      orderBy('createdAt', 'desc')
    );

    // Real-time listener
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const feedbackData = [];
        snapshot.forEach((doc) => {
          feedbackData.push({
            id: doc.id,
            ...doc.data()
          });
        });
        setFeedbacks(feedbackData);
        setLoading(false);
      },
      (err) => {
        setError(err.message);
        setLoading(false);
      }
    );

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return 'N/A';
    const date = timestamp.toDate();
    return date.toLocaleString();
  };

  if (loading) {
    return (
      <div className="feedback-container">
        <div className="loading">Loading feedbacks...</div>
      </div>
    );
  }

  return (
    <div className="feedback-container">
      <div className="header">
        <h1>User Feedback</h1>
        <button onClick={handleLogout} className="logout-btn">
          Logout
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="feedback-stats">
        <p>Total Feedbacks: <strong>{feedbacks.length}</strong></p>
      </div>

      <div className="feedback-list">
        {feedbacks.length === 0 ? (
          <div className="no-feedback">No feedback available yet.</div>
        ) : (
          feedbacks.map((feedback) => (
            <div key={feedback.id} className="feedback-item">
              <div className="feedback-header">
                <span className="app-name">{feedback.appName}</span>
                <span className="feedback-date">
                  {formatDate(feedback.createdAt)}
                </span>
              </div>
              <div className="feedback-text">{feedback.feedbackText}</div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default FeedbackList;
