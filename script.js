window.addEventListener("DOMContentLoaded", ()=> {
    // 📌 Массив с эмодзи (пары)
    const emojis = ["🍎", "🍌", "🍇", "🍉", "🍒", "🍍", "🥝", "🍑"];
    let cards = [];

    let firstCard = null;
    let secondCard = null;
    let isBoardLocked = true; // Блокируем клики до старта
    let startTime;
    let timerInterval;

    const board = document.getElementById("game-board");
    const startButton = document.getElementById("start-btn");
    const timerDisplay = document.getElementById("timer");

     // Создаем модальное окно
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
 
      // Close modal on "OK" button click
      document.getElementById("close-modal").addEventListener("click", closeModal);

      // Close modal on background click
      modal.addEventListener("click", (event) => {
          if (event.target === modal) closeModal();
      });
  
      // Close modal on "Esc" key press
      document.addEventListener("keydown", (event) => {
          if (event.key === "Escape") closeModal();
      });
  
      function closeModal() {
          modal.style.display = "none";
      }

    // 📌 Перемешивание массива (понятный метод)
    function shuffle(array) {
        let shuffled = [];
        let original = [...array];

        while (original.length > 0) {
            // Тасуем карты
            let randomIndex = Math.floor(Math.random() * original.length);
            let item = original.splice(randomIndex, 1);
            shuffled.push(item);
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
            card.textContent = "❓"; // Изначально скрыт
            board.appendChild(card);
        });
    }

    // 📌 Запуск игры
    function startGame() {
        startButton.textContent = "Reset";
        startButton.removeEventListener("click", startGame);
        startButton.addEventListener("click", () => location.reload()); // Перезагружает страницу
        timerDisplay.style.visibility = "visible"; // Показываем таймер
        isBoardLocked = true; // Блокируем клики

        // Открываем все карточки на 1 секунду
        document.querySelectorAll(".card").forEach((card, index) => {
            card.classList.add("flipped");
            setTimeout(() => {
                card.textContent = cards[index];
            }, 250); // Показываем эмодзи
        });

        setTimeout(() => {
            document.querySelectorAll(".card").forEach((card, index) => {
                card.classList.remove("flipped");
                setTimeout(()=> {
                    card.textContent = "❓"; // Прячем обратно
                }, 250);
                board.addEventListener("click", (event) => {
                    const target = event.target;
                    if(target && target == card) {
                        flipCard(card, index)
                    }
                });
            });
            isBoardLocked = false; // Разблокируем клики
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
        let minutes = Math.floor(elapsedTime / 60);
        let seconds = elapsedTime % 60;
        if (minutes > 0) {
            timerDisplay.textContent = `Time: ${minutes}m ${seconds}s`;
        } else {
            timerDisplay.textContent = `Time: ${seconds} sec`;
        }
    }

    // 📌 Проверка карточек
    function flipCard(card, index) {
        if (isBoardLocked || card === firstCard || card.textContent !== "❓") return;

        card.classList.add("flipped");
        setTimeout(() => {
            card.textContent = cards[index];
        }, 250);

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
            firstCard.classList.remove("flipped");
            secondCard.classList.remove("flipped");
            setTimeout(() => {
                firstCard.textContent = "❓";
                secondCard.textContent = "❓";
                resetSelection();
            }, 250);
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
        modal.style.display = "flex";
    }

    // 📌 Запуск
    startButton.addEventListener("click", startGame);
    createBoard();

});