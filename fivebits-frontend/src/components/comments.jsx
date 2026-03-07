// React hooks - useState stores data, useEffect runs code on page load
import { useState, useEffect } from "react";

import './comments.css';

// The URL of our Spring Boot backend
// Using relative path - requests go through Nginx proxy
const API_URL = "/api/comments";

export default function Comments() {

  // comments = the array of comments displayed on screen
  // setComments = the function to update that array
  const [comments, setComments] = useState([]);

  // title = what the user is currently typing in the input box
  // setTitle = updates the input box value
  const [title, setTitle] = useState("");

  // useEffect runs ONCE when the page first loads
  // It fetches all existing comments from the backend
  useEffect(() => {
    fetch(API_URL)                          // GET request to Spring Boot
      .then((res) => res.json())            // Convert response to JavaScript object
      .then((data) => setComments(data));   // Store the comments in state
  }, []); // The [] means "only run this once on page load"

  // This function runs when user clicks "Add" button
  const addComment = async () => {

    // Don't add if the input is empty or just spaces
    if (!title.trim()) return;

    // Send a POST request to Spring Boot with the new comment data
    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" }, // Tell backend we're sending JSON
      body: JSON.stringify({ title: title}), // The new comment data
    });

    // Spring Boot returns the saved comment (now with an ID from the database)
    const newComment = await res.json();

    // Add the new comment to our list and clear the input box
    setComments([...comments, newComment]);
    setTitle("");
  };

  // This function runs when user clicks the ✕ button next to a comment
  const deleteComment = async (id) => {

    // Send a DELETE request to Spring Boot
    await fetch(`${API_URL}/${id}`, { method: "DELETE" });

    // Remove the deleted comment from our list
    // filter() keeps every comment EXCEPT the one with the matching id
    setComments(comments.filter((comment) => comment.id !== id));
  };

  // This is what gets displayed on screen
  return (
    <div className="container">
      <h1>x COMMENTS x</h1>

      {/* Input area */}
      <div className="input-area">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}       // Update title as user types
          onKeyDown={(e) => e.key === "Enter" && addComment()} // Also add on Enter key
        />
        <button onClick={addComment}>ADD</button>
      </div>

      {/* Show message if no todos yet */}
      {comments.length === 0 && (
        <p className="empty-message">No comments yet. Add one above!</p>
      )}

      {/* List of todos */}
      <ul className="todo-list">
        {comments.map((comment) => (
          // Each comment item. key={comment.id} is required by React for list items
          <li key={comment.id} className="todo-item">
            <span>{comment.title}</span>
            <button
              className="delete-btn"
              onClick={() => deleteComment(comment.id)}
            >
              ✕
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}