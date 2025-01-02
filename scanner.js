const feedback = document.getElementById('feedback');
const animalImage = document.getElementById('animal-image');
const animalText = document.getElementById('animal-text');
const animalSound = document.getElementById('animal-sound');

let currentAnimal = null;
let soundTimeout = null;
let lastError = null;

const animalData = {
    "123": { text: "Lion", image: "lion.jpg", sound: "lion.mp3" },
    "456": { text: "Elephant", image: "elephant.jpg", sound: "elephant.mp3" },
};

const qrCodeScanner = new Html5Qrcode("camera");

qrCodeScanner.start(
    { facingMode: "environment" },
    {
        fps: 10,
        qrbox: { width: 250, height: 250 },
    },
    (decodedText) => handleScan(decodedText),
    (error) => {
        feedback.textContent = `Scanning...`;
        if (error !== lastError) {
            console.log(`(Last error: ${error})`)
            lastError = error;
        }
    }
).catch(err => {
    feedback.textContent = "Camera initialization failed!";
    console.error(err);
});

function handleScan(code) {
    if (!code) return;

    if (animalData[code]) {
        if (currentAnimal === code) {
            feedback.textContent = "Same animal detected!";
            return;
        }
        displayAnimal(animalData[code], code);
    } else {
        feedback.textContent = "Animal not found!";
        clearAnimalInfo();
        currentAnimal = null;
    }
}

function displayAnimal({ text, image, sound }, code) {
    feedback.textContent = "";
    animalImage.src = image;
    animalText.textContent = text;
    animalSound.src = sound;
    animalImage.classList.remove('d-none');
    animalText.classList.remove('d-none');
    animalSound.classList.remove('d-none');
    animalSound.play();

    currentAnimal = code;

    if (soundTimeout) clearTimeout(soundTimeout);

    animalSound.onloadedmetadata = () => {
        soundTimeout = setTimeout(() => {
            animalSound.pause();
            animalSound.currentTime = 0;
        }, animalSound.duration * 1000);
    };
}

function clearAnimalInfo() {
    animalImage.classList.add('d-none');
    animalText.classList.add('d-none');
    animalSound.classList.add('d-none');
    animalSound.pause();
    animalSound.currentTime = 0;
}
