const loadNext = async (currentIndex, files, setImageUrl, labels, setSelectedButton, setLabels) => {
    setImageUrl(`http://localhost:3001/files/${files[currentIndex + 1]}`);
    console.log('Current file:', files[currentIndex + 1]);
    
    // if image is not labelled, get prediction
    if (currentIndex >= (labels.length - 1) ) {
        console.log('Entered');
        const image_response = await fetch(`http://localhost:3001/files/${files[currentIndex + 1]}`);
        if (!image_response.ok) {
            throw new Error('Failed to retrieve image');
        }
        const blob = await image_response.blob(); // get blob data
        const base64StrWithPrefix = await new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result); // resolve promise with base64 string on load end
            reader.onerror = reject; // reject promise on error
            reader.readAsDataURL(blob); // read blob data as base64
        });
        // Remove prefix "data:image/png;base64,"
        const base64Str = base64StrWithPrefix.split(",")[1];
        // const data = JSON.stringify(base64Str);
        const data = JSON.stringify({ base_64_str: base64Str });
        const pred_response = await fetch("http://localhost:8000/predict", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: data
        });
        if (!pred_response.ok) {
            throw new Error('Failed to retrieve prediction');
        }
        const prediction = await pred_response.json();
        console.log('Model prediction:', prediction.animal);

        // set prediction as labelled
        setSelectedButton(prediction.animal);
        setLabels(prevLabels => {
            const newLabels = [...prevLabels];
            newLabels[currentIndex+1] = prediction.animal;
            console.log('Updated labels:', newLabels);
            return newLabels;
        });
    }
}

// Event handlers for your buttons can be defined here
export const handleBack = (currentIndex, setCurrentIndex, setSelectedButton, labels, files, setImageUrl) => {
    if (currentIndex === 0) {
        alert("This is the first element to review");
    } else if (currentIndex > 0) {
        setSelectedButton(labels[currentIndex - 1]);
        setImageUrl(`http://localhost:3001/files/${files[currentIndex - 1]}`);    
        console.log('Current file:', files[currentIndex - 1]);
        setCurrentIndex(currentIndex - 1);
    }
};

export const handleDog = (currentIndex, setSelectedButton, setLabels) => {
    console.log('Dog button clicked');
    if (currentIndex >= 0) {
        setSelectedButton('DOG');
        setLabels(prevLabels => {
            const newLabels = [...prevLabels];
            newLabels[currentIndex] = 'DOG';
            console.log('Updated labels:', newLabels);
            return newLabels;
        });
    }
};

export const handleCat = (currentIndex, setSelectedButton, setLabels) => {
    console.log('Cat button clicked');
    if (currentIndex >= 0) {
        setSelectedButton('CAT');
        setLabels(prevLabels => {
            const newLabels = [...prevLabels];
            newLabels[currentIndex] = 'CAT';
            console.log('Updated labels:', newLabels);
            return newLabels;
        });
    }
};

export const handleReject = (currentIndex, setSelectedButton, setLabels) => {
    console.log('Reject button clicked');
    if (currentIndex >= 0) {
        setSelectedButton('REJECT');
        setLabels(prevLabels => {
            const newLabels = [...prevLabels];
            newLabels[currentIndex] = 'REJECT';
            console.log('Updated labels:', newLabels);
            return newLabels;
        });
    }
};

export const handleCheck = async (currentIndex, setCurrentIndex, setSelectedButton, labels, files, setImageUrl, setLabels, setFiles) => {
    // After welcome message, simply move to the first image
    if (currentIndex === -1) {
        loadNext(currentIndex, files, setImageUrl, labels, setSelectedButton, setLabels);
        setCurrentIndex(currentIndex + 1);
    }
    // 
    else if (currentIndex < labels.length && labels[currentIndex]) {
        // If the label is REJECT, ask for confirmation before deleting the image
        if (labels[currentIndex] === 'REJECT') {
            const confirmDelete = window.confirm('You are about to delete this image. Are you sure?');
            if (!confirmDelete) {
                return;
            }
        }
        // submit the label to the backend
        const response = await fetch('http://localhost:3001/label', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ label: labels[currentIndex], filename: files[currentIndex] }),
        });
        const data = await response.json();
        console.log('Submit label response:', data);
        
        // Move to next image if not at the end yet
        if (currentIndex < files.length - 1) {
            loadNext(currentIndex, files, setImageUrl, labels, setSelectedButton, setLabels);   

            // Update index if label is not REJECT. Otherwise, delete label and file
            if (labels[currentIndex] !== 'REJECT') {
                setSelectedButton(labels[currentIndex + 1]);
                setCurrentIndex(currentIndex + 1);
            } 
            else {
                // Remove the label and file from their respective lists
                const newLabels = labels.filter((_, index) => index !== currentIndex);
                const newFiles = files.filter((_, index) => index !== currentIndex);

                // Update the state
                setLabels(newLabels);
                setFiles(newFiles);
            }
        }
        // Show alert if at the end
        else {
            // For REJECT, delete label and file, and decrease index since we are at the end
            if (labels[currentIndex] === 'REJECT') {
                // Remove the label and file from their respective lists
                const newLabels = labels.filter((_, index) => index !== currentIndex);
                const newFiles = files.filter((_, index) => index !== currentIndex);

                // Update the state
                setLabels(newLabels);
                setFiles(newFiles);
                setCurrentIndex(currentIndex - 1);
            }
            alert("You've reviewed all files, congratulations! Add more files to continue reviewing.");
        }
    } else if (currentIndex >= 0) {
        setSelectedButton('');
        alert('Please label the current image before moving forward');
    }
};