/* =========================================
   VARIABLES
========================================= */

const recordButton = document.getElementById("recordButton");
const recordingStatus = document.getElementById("recordingStatus");
const micStatus = document.getElementById("micStatus");
const speechText = document.getElementById("speechText");
const timerDisplay = document.getElementById("timer");
const waveform = document.getElementById("waveform");
const wordCount = document.getElementById("wordCount");

let recognition;
let isRecording = false;
let timerInterval;
let seconds = 0;


/* =========================================
   SPEECH RECOGNITION
========================================= */

const SpeechRecognition =
    window.SpeechRecognition ||
    window.webkitSpeechRecognition;


if (SpeechRecognition) {

    recognition = new SpeechRecognition();

    recognition.continuous = true;

    recognition.interimResults = true;

    recognition.lang = "en-US";


    recognition.onstart = function () {

        isRecording = true;

        recordButton.classList.add("recording");

        recordButton.innerHTML = "⏹";

        recordingStatus.innerText =
            "Listening... Speak clearly";

        micStatus.innerText = "Recording";

        waveform.classList.add("active");

        startTimer();

    };


    recognition.onresult = function (event) {

        let finalTranscript = "";
        let interimTranscript = "";

        for (
            let i = event.resultIndex;
            i < event.results.length;
            i++
        ) {

            const transcript =
                event.results[i][0].transcript;

            if (event.results[i].isFinal) {

                finalTranscript += transcript + " ";

            } else {

                interimTranscript += transcript;

            }

        }

        if (finalTranscript) {

            speechText.value += finalTranscript;

            updateWordCount();

        }

    };


    recognition.onerror = function (event) {

        console.log("Speech recognition error:", event.error);

        recordingStatus.innerText =
            "Unable to recognize speech. Try again.";

        stopRecording();

    };


    recognition.onend = function () {

        if (isRecording) {

            try {

                recognition.start();

            } catch (error) {

                console.log(error);

            }

        }

    };

} else {

    alert(
        "Speech recognition is not supported in this browser. Please use Google Chrome or Microsoft Edge."
    );

}


/* =========================================
   START / STOP RECORDING
========================================= */

function toggleRecording() {

    if (!recognition) {

        alert(
            "Speech recognition is not supported. Please use Chrome or Edge."
        );

        return;

    }

    if (isRecording) {

        stopRecording();

    } else {

        startRecording();

    }

}


function startRecording() {

    try {

        recognition.start();

    } catch (error) {

        console.log(error);

    }

}


function stopRecording() {

    isRecording = false;

    if (recognition) {

        recognition.stop();

    }

    recordButton.classList.remove("recording");

    recordButton.innerHTML = "🎙";

    recordingStatus.innerText =
        "Recording stopped";

    micStatus.innerText =
        "Ready";

    waveform.classList.remove("active");

    stopTimer();

}


/* =========================================
   TIMER
========================================= */

function startTimer() {

    seconds = 0;

    timerDisplay.innerText = "00:00";

    clearInterval(timerInterval);

    timerInterval = setInterval(() => {

        seconds++;

        const minutes =
            Math.floor(seconds / 60)
                .toString()
                .padStart(2, "0");

        const secs =
            (seconds % 60)
                .toString()
                .padStart(2, "0");

        timerDisplay.innerText =
            `${minutes}:${secs}`;

    }, 1000);

}


function stopTimer() {

    clearInterval(timerInterval);

}


/* =========================================
   WORD COUNT
========================================= */

speechText.addEventListener(
    "input",
    updateWordCount
);


function updateWordCount() {

    const text =
        speechText.value.trim();

    if (!text) {

        wordCount.innerText =
            "0 words";

        return;

    }

    const words =
        text.split(/\s+/).length;

    wordCount.innerText =
        `${words} ${words === 1 ? "word" : "words"}`;

}


/* =========================================
   SENTIMENT ANALYSIS
========================================= */

function analyzeSentiment() {

    const text =
        speechText.value.trim();

    if (!text) {

        alert(
            "Please record or enter some speech first."
        );

        return;

    }


    const positiveWords = [

        "good",
        "great",
        "excellent",
        "amazing",
        "awesome",
        "happy",
        "love",
        "loved",
        "wonderful",
        "fantastic",
        "nice",
        "best",
        "enjoy",
        "enjoyed",
        "beautiful",
        "perfect",
        "success",
        "thank",
        "thanks",
        "excited",
        "fun",
        "helpful",
        "positive",
        "comfortable",
        "satisfied",
        "brilliant",
        "impressive"

    ];


    const negativeWords = [

        "bad",
        "terrible",
        "worst",
        "hate",
        "hated",
        "sad",
        "angry",
        "poor",
        "awful",
        "horrible",
        "disappointed",
        "problem",
        "problems",
        "fail",
        "failed",
        "failure",
        "difficult",
        "hard",
        "annoying",
        "annoyed",
        "negative",
        "unhappy",
        "boring",
        "boring",
        "pain",
        "wrong",
        "error",
        "frustrated",
        "frustrating"

    ];


    const words =
        text
            .toLowerCase()
            .replace(/[^\w\s]/g, "")
            .split(/\s+/);


    let positiveScore = 0;

    let negativeScore = 0;


    words.forEach(word => {

        if (positiveWords.includes(word)) {

            positiveScore++;

        }

        if (negativeWords.includes(word)) {

            negativeScore++;

        }

    });


    let sentiment;

    let confidence;


    if (
        positiveScore === 0 &&
        negativeScore === 0
    ) {

        sentiment = "Neutral";

        confidence = 70;

    }

    else if (
        positiveScore > negativeScore
    ) {

        sentiment = "Positive";

        confidence =
            Math.min(
                95,
                70 +
                positiveScore * 6
            );

    }

    else if (
        negativeScore > positiveScore
    ) {

        sentiment = "Negative";

        confidence =
            Math.min(
                95,
                70 +
                negativeScore * 6
            );

    }

    else {

        sentiment = "Neutral";

        confidence = 68;

    }


    displayResult(
        sentiment,
        confidence
    );

}


/* =========================================
   DISPLAY RESULT
========================================= */

function displayResult(
    sentiment,
    confidence
) {

    const resultSection =
        document.getElementById(
            "resultSection"
        );

    const sentimentText =
        document.getElementById(
            "sentimentText"
        );

    const sentimentIcon =
        document.getElementById(
            "sentimentIcon"
        );

    const sentimentDescription =
        document.getElementById(
            "sentimentDescription"
        );

    const confidenceValue =
        document.getElementById(
            "confidenceValue"
        );

    const progressFill =
        document.getElementById(
            "progressFill"
        );


    if (sentiment === "Positive") {

        sentimentIcon.innerText = "😊";

        sentimentText.innerText =
            "Positive";

        sentimentText.style.color =
            "#4ade80";

        sentimentDescription.innerText =
            "Your speech expresses positive emotions and a favorable tone.";

    }

    else if (sentiment === "Negative") {

        sentimentIcon.innerText = "😟";

        sentimentText.innerText =
            "Negative";

        sentimentText.style.color =
            "#f87171";

        sentimentDescription.innerText =
            "Your speech expresses negative emotions or an unfavorable tone.";

    }

    else {

        sentimentIcon.innerText = "😐";

        sentimentText.innerText =
            "Neutral";

        sentimentText.style.color =
            "#facc15";

        sentimentDescription.innerText =
            "Your speech appears emotionally balanced or neutral.";

    }


    confidenceValue.innerText =
        confidence + "%";


    resultSection.classList.add("show");


    setTimeout(() => {

        progressFill.style.width =
            confidence + "%";

    }, 100);


    resultSection.scrollIntoView({
        behavior: "smooth",
        block: "center"
    });

}


/* =========================================
   CLEAR TEXT
========================================= */

function clearText() {

    speechText.value = "";

    updateWordCount();

    document
        .getElementById("resultSection")
        .classList.remove("show");

}


/* =========================================
   SCROLL FUNCTIONS
========================================= */

function scrollToAnalyzer() {

    document
        .getElementById("analyzer")
        .scrollIntoView({
            behavior: "smooth"
        });

}


function showFeatures() {

    document
        .getElementById("features")
        .scrollIntoView({
            behavior: "smooth"
        });

}