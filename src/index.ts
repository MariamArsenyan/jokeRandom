interface Joke {
    id: string;
    joke: string;
}

interface ReportJoke {
    joke: string;
    score: number;
    date: string;
}


const reportAcudits: ReportJoke[] = []; 
let currentJoke: Joke | null = null;

const getWeather = async () => {
    const apiKey = 'f1e33698508736b647aaf4c3badad160';
    const city = 'Barcelona';
    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`);
    console.log("responseURL!!", response)
    const data = await response.json(); 
    console.log("Weather data:", data);
    if (response.ok) {
        const temperatura = data.main.temp;
        const icono = data.weather[0].icon;
        const iconUrl = `http://openweathermap.org/img/w/${icono}.png`; 
        console.log("Icon URL:", iconUrl);
        displayWeather(temperatura, iconUrl);
    } else { 
        console.error('Error getting weather')
    }
}
getWeather()
const displayWeather = (temperatura: number, iconUrl: string): void => {
    const weatherContainer = document.querySelector('#weather');
    if (weatherContainer) {
    weatherContainer.innerHTML = `
        <img src="${iconUrl}" alt="Weather icon" class="weather-icon" /> 
        <span class="temperature">${temperatura}°C</span>
    `
     
    }
}

const getJoke = async (): Promise<Joke> => {
    const response = await fetch("https://icanhazdadjoke.com/", {
        headers: {
            'Accept': 'application/json'
        }
    });
    if (!response.ok) {
        throw new Error('Error getting joke');
    }
    const data: Joke = await response.json();
    currentJoke = data;
    return data;
}

const displayJoke = (joke: string): void => {
    const jokeContainer = document.getElementById('joke-text');
    if (jokeContainer) {
        jokeContainer.innerText = joke;
    }
    console.log('Joke', joke);
}

const handleNewJoke = async (): Promise<void> => {
    try {
        const joke = await getJoke();
        displayJoke(joke.joke);
        resetScore(); 
    } catch (error) {
        console.error('Error getting new joke', error);
    }
}

const resetScore = (): void => {
    const scoreButtons = document.querySelectorAll('.score-btn');
    scoreButtons.forEach(button => button.classList.remove('selected')); 
}

const addReport = (score: number): void => {
    if (currentJoke) {
        const report: ReportJoke = {
            joke: currentJoke.joke,
            score,
            date: new Date().toISOString()
        };
        const existingReportIndex = reportAcudits.findIndex(ReportJoke => ReportJoke.joke === report.joke);
        if (existingReportIndex !== -1) {
            reportAcudits[existingReportIndex] = report; 
        } else {
            reportAcudits.push(report);
        }

        console.log('Joke with report', JSON.stringify(reportAcudits, null, 2));
    }
}

const handleScoreButtonClick = (event: Event): void => {
    const target = event.target as HTMLElement;
    const score = Number(target.getAttribute('data'));

    if (score >= 1 && score <= 3) {
        resetScore();
        target.classList.add('selected');
        addReport(score);
    }
}

const initializeApp = (): void => {
    const newJokeButton = document.getElementById('new-joke-button');
    if (newJokeButton) {
        newJokeButton.addEventListener('click', handleNewJoke);
    }

    const scoreButtons = document.querySelectorAll('.score-btn');
    scoreButtons.forEach(button => {
        button.addEventListener('click', handleScoreButtonClick);
    });
    handleNewJoke()
}

document.addEventListener('DOMContentLoaded', initializeApp);
