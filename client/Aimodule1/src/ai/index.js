import * as tmImage from '@teachablemachine/image';
const URL = process.env.PUBLIC_URL + "/model/";

let model, webcam, labelContainer, maxPredictions;
const studentsData = [
    {
        enrollmentNumber: 'E001',
        name: 'omi',
        roll: 'R001',
        date: '',
        time: '',
    },
    {
        enrollmentNumber: 'E002',
        name: 'soham',
        roll: 'R002',
        date: '',
        time: '',
    },
    {
        enrollmentNumber: 'E003',
        name: 'ljbkklbl',
        roll: 'R003',
        date: '',
        time: '',
    },

    // Add more student objects
];

const presentStudents = {}; // Initialize an empty object

function viewAttendanceData() {
    // View present students for all days
    console.log(presentStudents);

    // View present students for a specific day (e.g., '2023-08-28')
    const specificDate = '2023-08-28';
    console.log(presentStudents[specificDate]);
}
// Load the image model and setup the webcam
// JavaScript
const stop = () => {
    var buttonst = document.getElementById("refreshButton");
    buttonst.style.display = "none";
}
// document.getElementById("refreshButton").addEventListener("click", function () {
//     // Reload the page when the button is clicked
//     location.reload(); // or window.location.reload();
// });
async function init() {
    const btn = () => {
        var button = document.getElementById("startButton");
        button.style.display = "none";

        var buttonst = document.getElementById("refreshButton");
        buttonst.style.display = "block";
    }
    btn();

    const modelURL = URL + "model.json";
    const metadataURL = URL + "metadata.json";
    // const classLabels = ["omi", "soham", "ljbkklbl"];

    // load the model and metadata
    // Refer to tmImage.loadFromFiles() in the API to support files from a file picker
    // or files from your local hard drive
    // Note: the pose library adds "tmImage" object to your window (window.tmImage)
    model = await tmImage.load(modelURL, metadataURL);
    maxPredictions = model.getTotalClasses();

    // Convenience function to setup a webcam
    const flip = true; // whether to flip the webcam
    webcam = new tmImage.Webcam(300, 400, flip); // width, height, flip
    await webcam.setup(); // request access to the webcam
    await webcam.play();
    window.requestAnimationFrame(loop);

    // append elements to the DOM
    document.getElementById("webcam-container").appendChild(webcam.canvas);
    labelContainer = document.getElementById("label-container");
    for (let i = 0; i < maxPredictions; i++) { // and class labels
        labelContainer.appendChild(document.createElement("div"));
    }
}
function getCurrentDate() {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    const day = String(currentDate.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

function getCurrentTime() {
    const currentTime = new Date();
    const hours = String(currentTime.getHours()).padStart(2, '0');
    const minutes = String(currentTime.getMinutes()).padStart(2, '0');
    const seconds = String(currentTime.getSeconds()).padStart(2, '0');
    return `${hours}:${minutes}:${seconds}`;
}


async function loop() {
    webcam.update(); // update the webcam frame
    await predict();
    window.requestAnimationFrame(loop);
}

// run the webcam image through the image model
let bool = "";
async function predict() {
    const currentDate = getCurrentDate(); // Get the current date
    if (!presentStudents[currentDate]) {
        presentStudents[currentDate] = []; // Initialize an array for the current date if it doesn't exist
    }
    // predict can take in an image, video, or canvas HTML element
    const prediction = await model.predict(webcam.canvas);
    for (let i = 0; i < maxPredictions; i++) {
        const classPrediction =
            prediction[i].className + ": " + prediction[i].probability.toFixed(2);
        labelContainer.childNodes[i].innerHTML = classPrediction;
        if (prediction[i].probability.toFixed(2) > 0.75) {

            if (prediction[i].className !== bool) {
                bool = prediction[i].className;
                console.log(bool);

                // Check if the enrollment number exists in the student data
                const student = studentsData.find(
                    (student) => student.name === bool
                );

                if (student) {
                    const makepresent = document.getElementById("present");
                    const isStudentPresent = presentStudents[currentDate].some(
                        (presentStudent) => presentStudent.name === student.name
                    );

                    if (isStudentPresent) {
                        makepresent.innerHTML = `${student.name==='soham'?'Background':student.name} is already present for today.`;
                    } else {
                        makepresent.innerHTML = `${student.name} is Present.`;
                        if (!student.date) {
                            // Update the date only if it's not already set
                            student.date = currentDate;
                        }
                        student.time = getCurrentTime();

                        // Add the student to the presentStudents object for the current date
                        presentStudents[currentDate].push(student);
                    }
                } else {
                    const makepresent = document.getElementById("present");
                    makepresent.innerHTML = `${bool} is not in the system.`;
                }
            }
        }
    }
}




export { viewAttendanceData, init, stop };