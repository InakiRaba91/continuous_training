import React, { useState, useEffect, useCallback } from 'react';
import './App.css'; // Assume this contains the necessary CSS
import { handleDog, handleCat, handleReject, handleCheck, handleBack } from './handlers';

// Assuming you have these icons as SVGs or other image files in your project
import backIcon from './icons/back.png';
import rejectIcon from './icons/reject.svg';
import dogIcon from './icons/dog.png';
import catIcon from './icons/cat.png';
import checkIcon from './icons/check.svg';
import startIcon from './icons/start.png';
import welcomeImage from './data/welcome.jpg';

function App() {
  const [files, setFiles] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [selectedButton, setSelectedButton] = useState('');
  const [labels, setLabels] = useState([]);
  const [imageUrl, setImageUrl] = useState(welcomeImage);

  useEffect(() => {
    fetch('http://localhost:3001/filelist')
      .then(response => response.json())
      .then(fetchedFiles => setFiles(fetchedFiles))
      .catch(error => console.error('Error:', error));
  }, []);

  const backClickHandler = useCallback(() => handleBack(currentIndex, setCurrentIndex, setSelectedButton, labels, files, setImageUrl), [currentIndex, setCurrentIndex, setSelectedButton, labels, files, setImageUrl]);
  const dogClickHandler = useCallback(() => handleDog(currentIndex, setSelectedButton, setLabels), [currentIndex, setSelectedButton, setLabels]);
  const catClickHandler = useCallback(() => handleCat(currentIndex, setSelectedButton, setLabels), [currentIndex, setSelectedButton, setLabels]);
  const rejectClickHandler = useCallback(() => handleReject(currentIndex, setSelectedButton, setLabels), [currentIndex, setSelectedButton, setLabels]);
  const checkClickHandler = useCallback(() => handleCheck(currentIndex, setCurrentIndex, setSelectedButton, labels, files, setImageUrl, setLabels, setFiles), [currentIndex, setCurrentIndex, setSelectedButton, labels, files, setImageUrl, setLabels, setFiles]);
  
  useEffect(() => {
    const handleKeyDown = (event) => {
      switch (event.key) {
        case 'r':
        case 'R':
          rejectClickHandler();
          break;
        case 'c':
        case 'C':
          catClickHandler();
          break;
        case 'd':
        case 'D':
          dogClickHandler();
          break;
        case 'ArrowLeft':
          backClickHandler();
          break;
        case 'ArrowRight':
          checkClickHandler();
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    // Cleanup function to remove the event listener when the component unmounts
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [rejectClickHandler, catClickHandler, dogClickHandler, backClickHandler, checkClickHandler]);

  return (
    <div className="App">
      <div className="content">
        {/* Image display area */}
        <img src={imageUrl} alt="Displayed Content" className="fixed-resolution" />
      </div>
      <div className="navigation">
        {/* Navigation buttons */}{currentIndex !== -1 && (
          <button onClick={backClickHandler}>
            <img src={backIcon} alt="Back" />
          </button>
        )}
        {currentIndex !== -1 && (
          <button 
            style={{ backgroundColor: selectedButton === 'DOG' ? 'orange' : '' }} 
            onClick={dogClickHandler}
          >
            <img src={dogIcon} alt="Dog" />
          </button>
        )}
        {currentIndex !== -1 && (
          <button 
            style={{ backgroundColor: selectedButton === 'CAT' ? 'orange' : '' }} 
            onClick={catClickHandler}
          >
            <img src={catIcon} alt="Cat" />
          </button>
        )}
        {currentIndex !== -1 && (
          <button 
            style={{ backgroundColor: selectedButton === 'REJECT' ? 'orange' : '' }} 
            onClick={rejectClickHandler}
          >
            <img src={rejectIcon} alt="Reject" />
          </button>
        )}
        <button onClick={checkClickHandler}>
          <img src={currentIndex === -1 ? startIcon : checkIcon} alt="Check" />
        </button>
      </div>
    </div>
  );
}

export default App;