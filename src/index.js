"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const reportAcudits = [];
let currentJoke = null;
const getWeather = () => __awaiter(void 0, void 0, void 0, function* () {
    const apiKey = 'f1e33698508736b647aaf4c3badad160';
    const city = 'Barcelona';
    const response = yield fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`);
    console.log("responseURL!!", response);
    const data = yield response.json();
    console.log("Weather data:", data);
    if (response.ok) {
        const temperatura = data.main.temp;
        const icono = data.weather[0].icon;
        const iconUrl = `http://openweathermap.org/img/w/${icono}.png`;
        console.log("Icon URL:", iconUrl);
        displayWeather(temperatura, iconUrl);
    }
    else {
        console.error('Error getting weather');
    }
});
getWeather();
const displayWeather = (temperatura, iconUrl) => {
    const weatherContainer = document.querySelector('#weather');
    if (weatherContainer) {
        weatherContainer.innerHTML = `
        <img src="${iconUrl}" alt="Weather icon" class="weather-icon" /> 
        <span class="temperature">${temperatura}°C</span>
    `;
    }
};
const getJoke = () => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield fetch("https://icanhazdadjoke.com/", {
        headers: {
            'Accept': 'application/json'
        }
    });
    if (!response.ok) {
        throw new Error('Error getting joke');
    }
    const data = yield response.json();
    currentJoke = data;
    return data;
});
const displayJoke = (joke) => {
    const jokeContainer = document.getElementById('joke-text');
    if (jokeContainer) {
        jokeContainer.innerText = joke;
    }
    console.log('Joke', joke);
};
const handleNewJoke = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const joke = yield getJoke();
        displayJoke(joke.joke);
        resetScore();
    }
    catch (error) {
        console.error('Error getting new joke', error);
    }
});
const resetScore = () => {
    const scoreButtons = document.querySelectorAll('.score-btn');
    scoreButtons.forEach(button => button.classList.remove('selected'));
};
const addReport = (score) => {
    if (currentJoke) {
        const report = {
            joke: currentJoke.joke,
            score,
            date: new Date().toISOString()
        };
        const existingReportIndex = reportAcudits.findIndex(ReportJoke => ReportJoke.joke === report.joke);
        if (existingReportIndex !== -1) {
            reportAcudits[existingReportIndex] = report;
        }
        else {
            reportAcudits.push(report);
        }
        console.log('Joke with report', JSON.stringify(reportAcudits, null, 2));
    }
};
const handleScoreButtonClick = (event) => {
    const target = event.target;
    const score = Number(target.getAttribute('data'));
    if (score >= 1 && score <= 3) {
        resetScore();
        target.classList.add('selected');
        addReport(score);
    }
};
const initializeApp = () => {
    const newJokeButton = document.getElementById('new-joke-button');
    if (newJokeButton) {
        newJokeButton.addEventListener('click', handleNewJoke);
    }
    const scoreButtons = document.querySelectorAll('.score-btn');
    scoreButtons.forEach(button => {
        button.addEventListener('click', handleScoreButtonClick);
    });
    handleNewJoke();
};
document.addEventListener('DOMContentLoaded', initializeApp);
