interface Joke {
  id: number;
  joke: string;
}

interface ChuckJoke {
  id: string;
  joke: string;
}

interface ReportJoke {
  joke: string;
  score: number;
  date: string;
}

const reportAcudits: ReportJoke[] = [];
let currentJoke: Joke | ChuckJoke | null = null;

const getWeather = async () => {
  const apiKey = 'f1e33698508736b647aaf4c3badad160';
  const city = 'Barcelona';
  const response = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`,
  );
  console.log('responseURL!!', response);
  const data = await response.json();
  console.log('Weather data:', data);
  if (response.ok) {
    const temperatura = data.main.temp;
    const icono = data.weather[0].icon;
    const iconUrl = `http://openweathermap.org/img/w/${icono}.png`;
    console.log('Icon URL:', iconUrl);
    displayWeather(temperatura, iconUrl);
  } else {
    console.error('Error getting weather');
  }
};
getWeather();
const displayWeather = (temperatura: number, iconUrl: string): void => {
  const weatherContainer = document.querySelector('#weather');
  if (weatherContainer) {
    weatherContainer.innerHTML = `
        <img src="${iconUrl}" alt="Weather icon" class="weather-icon" /> 
        <div class="separator"></div>
        <span class="temperature">${temperatura}°C</span>
    `;
  }
};

const getJoke = async (): Promise<Joke> => {
  const response = await fetch('https://icanhazdadjoke.com/', {
    headers: {
      Accept: 'application/json',
    },
  });
  if (!response.ok) {
    throw new Error('Error getting joke');
  }
  const data: Joke = await response.json();
  currentJoke = data;
  return data;
};

const getChuckJoke = async (): Promise<ChuckJoke> => {
  const response = await fetch('https://api.chucknorris.io/jokes/random', {
    headers: {
      Accept: 'application/json',
    },
  });
  if (!response.ok) {
    throw new Error('Error getting Chuck joke');
  }
  const data: any = await response.json();
  return { id: data.id, joke: data.value };
};

console.log(getChuckJoke());

const displayJoke = (jokeData: ChuckJoke | Joke): void => {
  const jokeContainer = document.getElementById('joke-text');
  if (jokeContainer) {
    console.log('Joke:', jokeData.joke);
    jokeContainer.innerText = jokeData.joke;
  } else {
    console.error('Error getting joke-text');
  }
};

const handleNewJoke = async () => {
  try {
    let newJoke: Joke | ChuckJoke;
    const randomJoke = Math.random();
    if (randomJoke < 0.5) {
      newJoke = await getJoke();
    } else {
      newJoke = await getChuckJoke();
    }
    currentJoke = newJoke;
    displayJoke(newJoke);
  } catch (err) {
    console.error('Error getting new joke', err);
  }
};

const resetScore = (): void => {
  const scoreButtons = document.querySelectorAll('.score-btn');
  scoreButtons.forEach(button => button.classList.remove('selected'));
};

const addReport = (score: number): void => {
  if (currentJoke) {
    const report: ReportJoke = {
      joke: currentJoke.joke,
      score,
      date: new Date().toISOString(),
    };
    const existingReportIndex = reportAcudits.findIndex(
      ReportJoke => ReportJoke.joke === report.joke,
    );
    if (existingReportIndex !== -1) {
      reportAcudits[existingReportIndex] = report;
    } else {
      reportAcudits.push(report);
    }

    console.log('Joke with report', JSON.stringify(reportAcudits, null, 2));
  }
};

const handleScoreButtonClick = (event: Event): void => {
  const target = event.target as HTMLElement;
  const score = Number(target.getAttribute('data'));

  if (score >= 1 && score <= 3) {
    resetScore();
    target.classList.add('selected');
    addReport(score);
  }
};

const initializeApp = (): void => {
  getWeather();
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
initializeApp();