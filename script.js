document.addEventListener('DOMContentLoaded', () => {
    const gameBoard = document.getElementById('game-board');
    const message = document.getElementById('message');
    const keyboard = document.getElementById('keyboard');
    const restartButton = document.getElementById('restart-button');

    const slovnik = ["jablko", "domino", "rybník", "lavice", "tradic, aaaaaa, hledám"]; // Předem definovaný seznam
    let slovo = slovnik[Math.floor(Math.random() * slovnik.length)]; // Náhodný výběr slova
    let slovoZadano = "";
    let pokus = 0;
    const maxPokusy = 6;

    // Vytvoření herní mřížky
    function vytvoritHerniMrizku(delkaSlova) {
        gameBoard.style.gridTemplateColumns = `repeat(${delkaSlova}, 50px)`;
        gameBoard.innerHTML = ""; // Vymazání staré mřížky
        for (let i = 0; i < maxPokusy * delkaSlova; i++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            gameBoard.appendChild(cell);
        }
    }

    // Aktualizace herní mřížky
    function aktualizovatHerniMrizku(slovoZadano, stavy) {
        const cells = document.querySelectorAll('.cell');
        const startIndex = pokus * slovo.length;
        for (let i = 0; i < slovoZadano.length; i++) {
            if (cells[startIndex + i]) {
                cells[startIndex + i].textContent = slovoZadano[i];
                cells[startIndex + i].classList.add(stavy[i]);
            }
        }
    }

    // Kontrola zadání a zpětná vazba
    function kontrolaSlova(slovoZadano) {
        const stavy = Array(slovo.length).fill('absent');
        for (let i = 0; i < slovo.length; i++) {
            if (slovoZadano[i] === slovo[i]) {
                stavy[i] = 'correct';
            } else if (slovo.includes(slovoZadano[i])) {
                stavy[i] = 'present';
            }
        }
        aktualizovatHerniMrizku(slovoZadano, stavy);

        if (slovoZadano === slovo) {
            message.textContent = "Gratulace! Uhádli jste slovo!";
            konecHry();
        } else if (pokus >= maxPokusy - 1) {
            message.textContent = `Prohra! Tajné slovo bylo: ${slovo}`;
            konecHry();
        }

        pokus++;
        slovoZadano = ""; // Resetování pro další pokus
    }

    // Obsluha vstupu
    function handleKeyInput(pismeno) {
        if (pismeno === "backspace") {
            slovoZadano = slovoZadano.slice(0, -1); // Smazání posledního znaku
        } else if (pismeno === "enter") {
            if (slovoZadano.length === slovo.length) {
                kontrolaSlova(slovoZadano);
                slovoZadano = "";  // Resetování po stisku enter
            }
        } else if (/^[a-záčďéěíňóřšťůúýž]$/.test(pismeno) && slovoZadano.length < slovo.length) {
            slovoZadano += pismeno;
        }

        // Vymazání textu v buňkách pro aktuální pokus (po zadání textu)
        const cells = document.querySelectorAll('.cell');
        const startIndex = pokus * slovo.length;

        // Pokud je zadáno slovo, zaktualizuj herní mřížku
        if (slovoZadano.length === slovo.length) {
            for (let i = 0; i < slovo.length; i++) {
                if (cells[startIndex + i]) {
                    cells[startIndex + i].textContent = ''; // Vymaže předchozí hodnotu
                }
            }
        }

        // Zobrazení aktuálního zadání
        for (let i = 0; i < slovoZadano.length; i++) {
            if (cells[startIndex + i]) {
                cells[startIndex + i].textContent = slovoZadano[i];
            }
        }
    }

    // Funkce pro ukončení hry
    function konecHry() {
        restartButton.style.display = 'block'; // Zobrazí tlačítko pro restart
        keyboard.style.display = 'none'; // Skryje virtuální klávesnici po skončení hry
        document.removeEventListener('keydown', zpracujKlavesnici);
    }

    // Funkce pro spuštění nové hry
    function spustitNovouHru() {
        slovo = slovnik[Math.floor(Math.random() * slovnik.length)]; // Nové náhodné slovo
        pokus = 0;
        slovoZadano = "";
        message.textContent = "";
        vytvoritHerniMrizku(slovo.length);
        restartButton.style.display = 'none';
        keyboard.style.display = 'grid';
        document.addEventListener('keydown', zpracujKlavesnici);
    }

    // Naslouchání vstupu z fyzické klávesnice
    function zpracujKlavesnici(event) {
        const key = event.key.toLowerCase();
        if (key === "backspace" || key === "enter" || /^[a-záčďéěíňóřšťůúýž]$/.test(key)) {
            handleKeyInput(key);
        }
    }

    document.addEventListener('keydown', zpracujKlavesnici);

    // Naslouchání kliknutí na tlačítko "Spustit znovu"
    restartButton.addEventListener('click', spustitNovouHru);

    // Vytvoření virtuální klávesnice
    const pismena = 'ABCDEFGHIJKLMNOPQRSTUVWXYZČĎÉĚÍŇÓŘŠŤŮÚÝŽ'.split('');
    pismena.forEach(pismeno => {
        const tlacitko = document.createElement('button');
        tlacitko.textContent = pismeno;
        tlacitko.addEventListener('click', () => {
            handleKeyInput(pismeno.toLowerCase());
        });
        keyboard.appendChild(tlacitko);
    });

    vytvoritHerniMrizku(slovo.length);
});
