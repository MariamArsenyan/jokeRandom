interface Joke {
    id: string;
    joke: string;
}

const getJoke = async(): Promise<Joke> => {
    const response = await fetch("https://icanhazdadjoke.com/", {
        headers: {
            'Accept': 'application/json'
        }
    })
    if (!response.ok) {
        throw new Error('Error getting joke');
    }
    const data: Joke = await response.json();
    return data
}

const displayJoke = (joke: string): void => {
    const jokeContainer = document.getElementById('joke-text');
    if (jokeContainer) {
        jokeContainer.innerText = joke;
    }
    console.log(joke)
}

const handleNewJoke = async(): Promise<void> => {
    try {
        const joke = await getJoke();
        displayJoke(joke.joke);
    } catch(error) {
        console.error('Error getting new joke', error)
    }
}

const initializeApp = (): void => {
    const newJokeButton = document.getElementById('new-joke-button');
    if (newJokeButton) {
        newJokeButton.addEventListener('click', handleNewJoke)
    }
    handleNewJoke();
}

document.addEventListener('DOMContentLoaded', initializeApp)
