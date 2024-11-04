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
    return data;
});
const displayJoke = (joke) => {
    const jokeContainer = document.getElementById('joke-text');
    if (jokeContainer) {
        jokeContainer.innerText = joke;
    }
    console.log(joke);
};
const handleNewJoke = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const joke = yield getJoke();
        displayJoke(joke.joke);
    }
    catch (error) {
        console.error('Error getting new joke', error);
    }
});
const initializeApp = () => {
    const newJokeButton = document.getElementById('new-joke-button');
    if (newJokeButton) {
        newJokeButton.addEventListener('click', handleNewJoke);
    }
    handleNewJoke();
};
document.addEventListener('DOMContentLoaded', initializeApp);
