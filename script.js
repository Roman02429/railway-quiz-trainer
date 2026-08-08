// БАЗА ДАННЫХ ДЛЯ ВСЕХ ЯЗЫКОВ
import { gameQuestions } from 'questions.js';


//ГЛОБАЛЬНЫЕ ПЕРЕМЕННЫЕ
const container = document.querySelector('.game-root');
const menuContainer = document.createElement('div');
container.append(menuContainer);
menuContainer.classList.add('menu-container');

let isClickable = true;
let selectedLanguage = 'ru';
let currentQuestionIndex = 0; 
let currentScore = 0; 
let countStudy = localStorage.getItem('countStudy') ? parseInt(localStorage.getItem('countStudy')) : 0;

let shuffledQuestions = [];

const languages = {
    ru: {
        name: 'Русский',
        play: 'Викторина',
        study: 'Обучение',
        about: 'Добро пожаловать в обучающий тренажер! Это отличная возможность в интерактивной форме проверить свои знания и подтянуть инструкции ИДП, ПТЭ и ИСИ. Выберите удобный режим:',

        question: 'Вопрос',
        next: 'Следующий',
        previous: 'Предыдущий',
        menu: 'В меню',

        newGame: 'Новая игра',
        gameOver: 'Игра окончена!',
        victory: 'Поздравляю с победой!',
        winnings: 'Ваш выигрыш'
    },

    ua: {
        name: 'Українська',
        play: 'Вікторина',
        study: 'Навчання',
        about: 'Ласкаво просимо до навчального тренажеру! Це чудова можливість в інтерактивній формі перевірити свої знання та підтягнути інструкції ІДП, ПТЕ та ІСІ. Виберіть зручний режим:',

        question: 'Питання',
        next: 'Наступний',
        previous: 'Попередній',
        menu: 'В меню',

        newGame: 'Нова гра',
    },

    en: {
        name: 'English',
        play: 'Quiz',
        study: 'Training',
        about: 'Welcome to the training simulator! This is a great opportunity to test your knowledge in an interactive way and brush up on railway safety instructions, rules, and regulations. Choose your mode:',

        question: 'Question',
        next: 'Next',
        previous: 'Previous',
        menu: 'To menu',

        newGame: 'New game',
        gameOver: 'Game over!',
        victory: 'You win!',
        winnings: 'Your winnings'
    }
};

//function secondary

function clearScreen() {
    menuContainer.replaceChildren();
}

function createElem(tag, text, className) {
    let element  = document.createElement(tag);
    element.textContent = text;
    element.classList.add(className);
    return element ;
}

// ГЛАВНЫЙ ЭКРАН

function renderLanguageMenu() {
    clearScreen();

    for (let key in languages) {
        const button = createElem('button', languages[key].name, 'btm-game');

        button.addEventListener('click', () => {
            selectedLanguage = key
            renderMainMenu();
        })
        menuContainer.append(button);
    }
}


function renderMainMenu() {
    clearScreen();
    currentQuestionIndex = 0;
    currentScore = 0;

    const aboutBox = createElem('p', languages[selectedLanguage].about, 'question-box');
    const playButton = createElem('button', languages[selectedLanguage].play, 'btm-game');
    const studyButton = createElem('button', languages[selectedLanguage].study, 'btm-game');

    menuContainer.append(aboutBox, playButton, studyButton);

    playButton.addEventListener('click', () => {
        shuffledQuestions = shuffle([...gameQuestions[selectedLanguage]]).slice(0, 15);
        startGame();

    });

    studyButton.addEventListener('click', () => {
        startStudy();
    });
}

function startStudy() {
    clearScreen();
    document.querySelector('.links').disabled = true

    const questions = gameQuestions[selectedLanguage];
    if (countStudy >= questions.length) {
        countStudy = questions.length - 1;
        localStorage.setItem('countStudy', countStudy);
    }

    if (countStudy < 0) {
        countStudy = 0;
        localStorage.setItem('countStudy', countStudy);
    }
    const currentQuestion = questions[countStudy];

    const questionBox = createElem('p', '', 'question-box');
    questionBox.innerHTML = `${languages[selectedLanguage].question} №${countStudy + 1} <br>${currentQuestion.q}`;

    const answerBox = createElem('p', currentQuestion.a[currentQuestion.c], 'question-box');

    const studyContainer = createElem('div', '','study-container');
    menuContainer.append(questionBox, answerBox, studyContainer);

    const nextButton = createElem('button', languages[selectedLanguage].next, 'btm-game');
    const menuButton = createElem('button', languages[selectedLanguage].menu, 'btm-game');
    const previousButton = createElem('button', languages[selectedLanguage].previous, 'btm-game');

    studyContainer.append(previousButton, menuButton, nextButton);

    previousButton.disabled = countStudy === 0;
    nextButton.disabled = countStudy === questions.length - 1;

    nextButton.addEventListener('click', () => {
        if (countStudy < questions.length - 1) {
            countStudy++;
            localStorage.setItem('countStudy', countStudy);
            startStudy();
        }
    });

    menuButton.addEventListener('click', () => {
       renderMainMenu();
    });

    previousButton.addEventListener('click', () => {
        if (countStudy > 0) {
            countStudy--;
            localStorage.setItem('countStudy', countStudy);
            startStudy();
        }
    });
}

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function startGame() {
    isClickable = true;
    menuContainer.textContent = '';

    const questionBox = createElem('p', '', 'question-box');
    questionBox.innerHTML = `${languages[selectedLanguage].question} №${currentQuestionIndex + 1} <br>${shuffledQuestions[currentQuestionIndex].q}`;
    menuContainer.append(questionBox);

    shuffledQuestions[currentQuestionIndex].a.forEach((answerText, index) => {
        const button = createElem('button', answerText, 'btn-answer');
        button.addEventListener('click', () => checkAnswer(index, button));
        menuContainer.append(button);
        console.log(shuffledQuestions[currentQuestionIndex].c);
        // console.log(currentQuestionIndex);
        // console.log(currentScore);
    });


}

function checkAnswer(index, button) {
    if (!isClickable) return;
    isClickable = false;

    const correctIndex = shuffledQuestions[currentQuestionIndex].c;

    if (index === correctIndex) {
        button.classList.add('btn-right-answer');
        currentQuestionIndex++;
        currentScore++;
        (currentScore === 15) ? setTimeout(newGame, 2000) : setTimeout(startGame, 2000);
    } else {
        button.classList.add('btn-wrong-answer');

        const answerButtons = menuContainer.querySelectorAll('.btn-answer');
        answerButtons[correctIndex].classList.add('btn-right-answer');

        setTimeout(newGame, 4000);
    }
}

function newGame() {
    clearScreen();

    const conclusionBox = createElem('p',getGameFinalMessage(currentScore, selectedLanguage), 'question-box');

    const button = createElem('button', languages[selectedLanguage].newGame, 'btm-game');
    menuContainer.append(conclusionBox, button);

    button.addEventListener('click', () => {
        currentQuestionIndex = 0;
        currentScore = 0;
        renderMainMenu();
    });


}

function getGameFinalMessage(count, lang) {
    let itemText = '';
    const prizes = [
        0, 100, 200, 300, 500, 1000, 2000, 4000, 8000, 16000, 32000, 64000, 125000, 250000, 500000, 1000000];

    let points = prizes[count];

    switch (lang) {
        case 'ua': {
            const mod10 = points % 10;
            const mod100 = points % 100;
            if (mod100 >= 11 && mod100 <= 14) {
                itemText = `${points} колійних костилів`;
            } else if (mod10 === 1) {
                itemText = `${points} колійний костиль`;
            } else if (mod10 >= 2 && mod10 <= 4) {
                itemText = `${points} колійні костилі`;
            } else {
                itemText = `${points} колійних костилів`;
            }
            return (points !== 1000000) ? `Гра закінчена! Ваш виграш: ${itemText}!` : `Вітаю з перемогою! Ваш виграш: ${itemText}!`;
        }
        case 'ru': {
            const mod10 = points % 10;
            const mod100 = points % 100;
            if (mod100 >= 11 && mod100 <= 14) {
                itemText = `${points} путевых костылей`;
            } else if (mod10 === 1) {
                itemText = `${points} путевой костыль`;
            } else if (mod10 >= 2 && mod10 <= 4) {
                itemText = `${points} путевых костыля`;
            } else {
                itemText = `${points} путевых костылей`;
            }
            return (points !== 1000000) ? `Игра окончена! Ваш выигрыш: ${itemText}!` : `Поздравляю с победой! Ваш выигрыш: ${itemText}!`;
        }
        case 'en':
        default: {
            itemText = points === 1 ? `${points} track spike` : `${points} track spikes`;
            return (points !== 1000000) ? `Game over! Your winnings: ${itemText}!` : `You win! Your winnings: ${itemText}!`;
        }
    }
}


renderLanguageMenu();
