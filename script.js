window.addEventListener("DOMContentLoaded", () => {
    // 📌 Массив с эмодзи (пары)
    const emojis = ["🍎", "🍌", "🍇", "🍉", "🍒", "🍍", "🥝", "🍑"];
    let cards = [];

    let firstCard = null;
    let secondCard = null;
    let isBoardLocked = true;
    let startTime;
    let timerInterval;

    const board = document.getElementById("game-board");
    const startButton = document.getElementById("start-btn");
    const timerDisplay = document.getElementById("timer");

    // 📌 Создаем модальное окно
    function createModal() {
        const modal = document.createElement("div");
        modal.id = "win-modal";
        modal.innerHTML = `
            <div class="modal-content">
                <h2>🎉 You Win! 🎉</h2>
                <p id="win-message"></p>
                <button id="close-modal">OK</button>
            </div>
        `;
        document.body.appendChild(modal);

        document.getElementById("close-modal").addEventListener("click", closeModal);
        modal.addEventListener("click", (event) => {
            if (event.target === modal) closeModal();
        });
        document.addEventListener("keydown", (event) => {
            if (event.key === "Escape") closeModal();
        });
    }

    function closeModal() {
        document.getElementById("win-modal").style.display = "none";
    }

    // 📌 Перемешивание массива
    function shuffle(array) {
        let shuffled = [];
        let original = [...array];
        while (original.length > 0) {
            let randomIndex = Math.floor(Math.random() * original.length);
            shuffled.push(original.splice(randomIndex, 1)[0]);
        }
        return shuffled;
    }

    // 📌 Создание игрового поля
    function createBoard() {
        board.innerHTML = "";
        cards = shuffle([...emojis, ...emojis]);
        cards.forEach((emoji) => {
            const card = document.createElement("div");
            card.classList.add("card");
            card.textContent = "❓";
            board.appendChild(card);
        });
    }

    // 📌 Запуск игры
    function startGame() {
        startButton.textContent = "Reset";
        startButton.removeEventListener("click", startGame);
        startButton.addEventListener("click", () => location.reload());
        timerDisplay.style.visibility = "visible";
        isBoardLocked = true;

        document.querySelectorAll(".card").forEach((card, index) => {
            card.classList.add("flipped");
            setTimeout(() => { card.textContent = cards[index]; }, 250);
        });

        setTimeout(() => {
            document.querySelectorAll(".card").forEach((card, index) => {
                card.classList.remove("flipped");
                setTimeout(() => { card.textContent = "❓"; }, 250);
                card.addEventListener("click", () => flipCard(card, index));
            });
            isBoardLocked = false;
            startTimer();
        }, 3000);
    }

    // 📌 Запуск таймера
    function startTimer() {
        startTime = Date.now();
        timerInterval = setInterval(updateTimer, 1000);
    }

    // 📌 Обновление таймера
    function updateTimer() {
        let elapsedTime = Math.floor((Date.now() - startTime) / 1000);
        timerDisplay.textContent = `Time: ${elapsedTime} sec`;
    }

    // 📌 Переворачивание карточек
    function flipCard(card, index) {
        if (isBoardLocked || card === firstCard || card.textContent !== "❓") return;
        card.classList.add("flipped");
        setTimeout(() => { card.textContent = cards[index]; }, 250);

        if (!firstCard) {
            firstCard = card;
        } else {
            secondCard = card;
            isBoardLocked = true;
            setTimeout(checkMatch, 1000);
        }
    }

    // 📌 Проверяем совпадение
    function checkMatch() {
        if (firstCard.textContent === secondCard.textContent) {
            resetSelection();
            checkWin();
        } else {
            setTimeout(() => {
                firstCard.classList.remove("flipped");
                secondCard.classList.remove("flipped");
                setTimeout(() => {
                    firstCard.textContent = "❓";
                    secondCard.textContent = "❓";
                    resetSelection();
                }, 250);
            }, 500);
        }
    }

    // 📌 Сброс выделенных карточек
    function resetSelection() {
        firstCard = secondCard = null;
        isBoardLocked = false;
    }

    // 📌 Проверка победы
    function checkWin() {
        if (document.querySelectorAll(".flipped").length === cards.length) {
            clearInterval(timerInterval);
            showWinModal();
        }
    }

    function showWinModal() {
        const elapsedTime = Math.floor((Date.now() - startTime) / 1000);
        document.getElementById("win-message").textContent = `You finished in ${elapsedTime} seconds! 🎯`;
        document.getElementById("win-modal").style.display = "flex";
    }

    // 📌 Запуск
    createModal();
    startButton.addEventListener("click", startGame);
    createBoard();
});
