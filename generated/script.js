import confetti from 'canvas-confetti';

class SquirrelGame {
    constructor() {
        this.nutCount = 0;
        this.baseNutsPerClick = 1;
        this.bonusNutsPerClick = 0; // From upgrades
        this.baseNutsPerSecond = 0;
        this.bonusNutsPerSecond = 0; // From upgrades
        this.passiveIncomeInterval = null;

        this.isSpeedupActive = false;
        this.speedupMultiplier = 5; // Nuts per second during speedup (this is an absolute value, not added to passive)
        this.speedupDuration = 30 * 1000;
        this.speedupCost = 50;
        this.speedupInterval = null;
        this.speedupTimerInterval = null;

        this.dailyBonusClaimed = false;
        this.dailyBonusAmount = 50;
        this.dailyBonusCooldown = 24 * 60 * 60 * 1000;
        this.nextBonusTime = 0;
        this.dailyBonusTimerInterval = null;

        this.upgrades = this.getInitialUpgrades();
        this.tasks = this.getInitialTasks();

        this.loadGameState(); // Loads nutCount, nextBonusTime, upgrade levels, task progress
        this.initDOM();
        this.applyLoadedUpgrades(); // Recalculates bonuses based on loaded levels
        this.attachEventListeners();
        this.updateNutDisplay();
        this.updateSpeedUpButtonState();
        this.updateDailyBonusButtonState();
        this.startDailyBonusTimer();
        this.renderUpgrades(); // Initial render for upgrades
        this.updatePassiveIncome();
        this.renderTasks(); // Initial render for tasks

        this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        this.soundBuffers = {};
        this.loadSounds();
    }

    get currentNutsPerClick() {
        return this.baseNutsPerClick + this.bonusNutsPerClick;
    }

    get currentNutsPerSecond() {
        return this.baseNutsPerSecond + this.bonusNutsPerSecond;
    }

    initDOM() {
        this.nutCountElement = document.getElementById('nut-count');
        this.squirrelElement = document.getElementById('squirrel');
        this.clickEffectContainer = document.getElementById('click-effect-container');

        this.rulesButton = document.getElementById('rules-button');
        this.rulesModal = document.getElementById('rules-modal');
        this.closeRulesButton = document.getElementById('close-rules-button');

        this.speedUpButton = document.getElementById('speed-up-button');
        this.speedUpButtonText = this.speedUpButton.querySelector('.button-text');
        this.speedUpCostDisplay = this.speedUpButton.querySelector('.cost');
        this.speedUpTimerDisplay = document.getElementById('speed-up-timer');
        this.speedUpCostDisplay.innerHTML = `-${this.speedupCost} <img src="nut_regular.png" alt="Nut" class="inline-nut-icon">`;

        this.dailyBonusButton = document.getElementById('daily-bonus-button');
        this.dailyBonusButtonText = this.dailyBonusButton.querySelector('.button-text');
        this.dailyBonusTimerDisplay = document.getElementById('daily-bonus-timer');
        
        this.navItems = document.querySelectorAll('.nav-item');
        this.gameScreens = document.querySelectorAll('.game-screen');
        this.homeScreen = document.getElementById('home-screen');
        this.upgradesScreen = document.getElementById('upgrades-screen');
        this.upgradesListElement = document.getElementById('upgrades-list');

        this.tasksScreen = document.getElementById('tasks-screen');
        this.tasksListElement = document.getElementById('tasks-list');
    }

    attachEventListeners() {
        this.squirrelElement.addEventListener('click', () => this.handleSquirrelClick());

        this.rulesButton.addEventListener('click', () => this.rulesModal.classList.remove('hidden'));
        this.closeRulesButton.addEventListener('click', () => this.rulesModal.classList.add('hidden'));
        this.rulesModal.addEventListener('click', (event) => {
            if (event.target === this.rulesModal) {
                this.rulesModal.classList.add('hidden');
            }
        });

        this.speedUpButton.addEventListener('click', () => this.activateSpeedUp());
        this.dailyBonusButton.addEventListener('click', () => this.claimDailyBonus());

        this.navItems.forEach(item => {
            item.addEventListener('click', () => {
                this.navItems.forEach(nav => nav.classList.remove('active'));
                item.classList.add('active');
                const targetScreenId = item.dataset.screen + '-screen'; // e.g. 'home-screen', 'upgrades-screen'
                this.gameScreens.forEach(screen => {
                    screen.classList.add('hidden');
                });
                const activeScreen = document.getElementById(targetScreenId);
                if (activeScreen) {
                    activeScreen.classList.remove('hidden');
                } else if (item.dataset.screen === "home") { // Fallback for home if ID is just 'home-screen'
                    this.homeScreen.classList.remove('hidden');
                }
            });
        });
    }

    async loadSounds() {
        await this._loadSound('click', 'click.mp3');
        await this._loadSound('collect', 'collect.mp3');
        await this._loadSound('bonus', 'bonus.mp3');
        await this._loadSound('purchase', 'purchase.mp3');
    }

    async _loadSound(name, url) {
        if (!this.audioContext) return;
        try {
            const response = await fetch(url);
            const arrayBuffer = await response.arrayBuffer();
            const audioBuffer = await this.audioContext.decodeAudioData(arrayBuffer);
            this.soundBuffers[name] = audioBuffer;
        } catch (error) {
            console.error(`Error loading sound ${name}:`, error);
        }
    }

    playSound(name) {
        if (!this.audioContext || !this.soundBuffers[name]) return;
        const source = this.audioContext.createBufferSource();
        source.buffer = this.soundBuffers[name];
        source.connect(this.audioContext.destination);
        source.start(0);
    }

    handleSquirrelClick() {
        this.updateTaskProgress('clicks', 1); // Update click-specific tasks
        
        // Add nuts, which will trigger 'earnNuts' task progress via addNuts method
        this.addNuts(this.currentNutsPerClick);
        this.playSound('click');

        this.squirrelElement.classList.add('clicked');
        setTimeout(() => this.squirrelElement.classList.remove('clicked'), 150);

        this.createClickParticles(this.currentNutsPerClick);
    }
    
    createClickParticles(amount) {
        // More particles for more nuts per click, up to a limit
        const particleCount = Math.min(5 + Math.floor(amount / 2), 15); 
        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.classList.add('click-particle');
            // Randomize starting position slightly around the center of the squirrel area
            const offsetX = (Math.random() - 0.5) * 60; // +/- 30px horizontally
            const offsetY = (Math.random() - 0.5) * 40; // +/- 20px vertically
            particle.style.left = `calc(50% + ${offsetX}px)`;
            particle.style.top = `calc(50% + ${offsetY}px)`;
            
            this.clickEffectContainer.appendChild(particle);
            setTimeout(() => particle.remove(), 700); // Remove after animation
        }
    }

    addNuts(amount) {
        if (amount > 0) { // Only track positive additions for earning tasks
            this.updateTaskProgress('earnNuts', amount);
        }
        this.nutCount += amount;
        this.updateNutDisplay();
        this.updateSpeedUpButtonState();
        this.renderUpgrades(); // Re-render to update button states if cost met
        // renderTasks() is called by updateTaskProgress if needed
    }

    updateNutDisplay() {
        this.nutCountElement.textContent = this.formatNumber(this.nutCount);
    }

    formatNumber(num) {
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
    }

    activateSpeedUp() {
        if (this.isSpeedupActive || this.nutCount < this.speedupCost) {
            if (this.nutCount < this.speedupCost && !this.isSpeedupActive) {
                this.speedUpButton.classList.add('shake');
                setTimeout(() => this.speedUpButton.classList.remove('shake'), 500);
            }
            return;
        }

        this.nutCount -= this.speedupCost;
        this.isSpeedupActive = true;
        this.updateNutDisplay();
        this.updateSpeedUpButtonState();
        this.playSound('bonus');

        let timeLeft = this.speedupDuration;
        this.speedUpTimerDisplay.textContent = `${Math.ceil(timeLeft / 1000)}s`;

        this.speedupInterval = setInterval(() => {
            this.addNuts(this.speedupMultiplier); // Speedup gives fixed amount
            confetti({
                particleCount: 5, angle: 90, spread: 55, origin: { y: 0.6 },
                ticks: 100, gravity: 0.5, scalar: 0.6, colors: ['#F4A261', '#FFC107', '#A1C181']
            });
        }, 1000);

        this.speedupTimerInterval = setInterval(() => {
            timeLeft -= 1000;
            this.speedUpTimerDisplay.textContent = `${Math.ceil(timeLeft / 1000)}s`;
            if (timeLeft <= 0) {
                this.deactivateSpeedUp();
            }
        }, 1000);
    }

    deactivateSpeedUp() {
        clearInterval(this.speedupInterval);
        clearInterval(this.speedupTimerInterval);
        this.speedupInterval = null;
        this.speedupTimerInterval = null;
        this.isSpeedupActive = false;
        this.speedUpTimerDisplay.textContent = '';
        this.updateSpeedUpButtonState();
    }

    updateSpeedUpButtonState() {
        if (this.isSpeedupActive) {
            this.speedUpButton.classList.add('disabled');
            this.speedUpButtonText.textContent = 'Активно!';
        } else {
            this.speedUpButtonText.textContent = 'Ускорить!';
            if (this.nutCount < this.speedupCost) {
                this.speedUpButton.classList.add('disabled');
                this.speedUpCostDisplay.classList.add('unaffordable');
            } else {
                this.speedUpButton.classList.remove('disabled');
                this.speedUpCostDisplay.classList.remove('unaffordable');
            }
        }
    }

    claimDailyBonus() {
        const now = Date.now();
        if (this.nextBonusTime > now) { // Bonus not yet available
             // Maybe a small visual cue "not available yet"
            this.dailyBonusButton.classList.add('shake');
            setTimeout(() => this.dailyBonusButton.classList.remove('shake'), 500);
            return;
        }

        this.addNuts(this.dailyBonusAmount); // This will also trigger earnNuts tasks for the bonus amount
        this.playSound('bonus');
        confetti({ // Confetti for bonus
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#F4A261', '#FFC107', '#A1C181', '#3A7CA5']
        });

        this.dailyBonusClaimed = true;
        this.nextBonusTime = now + this.dailyBonusCooldown;
        this.saveGameState(); // Save the new nextBonusTime
        this.updateDailyBonusButtonState();
        this.startDailyBonusTimer();
        this.updateTaskProgress('claimDailyBonus', 1); // Track daily bonus claim for tasks
    }

    updateDailyBonusButtonState() {
        const now = Date.now();
        if (this.nextBonusTime > now) { // Cooldown active
            this.dailyBonusButton.classList.add('disabled');
            const timeLeft = this.nextBonusTime - now;
            this.dailyBonusTimerDisplay.textContent = this.formatTime(timeLeft);
            this.dailyBonusButtonText.textContent = 'Бонус скоро...';
        } else { // Bonus available
            this.dailyBonusButton.classList.remove('disabled');
            this.dailyBonusTimerDisplay.textContent = `+${this.dailyBonusAmount}`;
            this.dailyBonusButtonText.textContent = 'Забрать бонус!';
        }
    }
    
    startDailyBonusTimer() {
        if (this.dailyBonusTimerInterval) {
            clearInterval(this.dailyBonusTimerInterval);
        }
        this.dailyBonusTimerInterval = setInterval(() => {
            this.updateDailyBonusButtonState();
            if (this.nextBonusTime <= Date.now()) {
                 clearInterval(this.dailyBonusTimerInterval); // Stop timer when bonus is available
            }
        }, 1000);
    }

    formatTime(ms) {
        let seconds = Math.floor((ms / 1000) % 60);
        let minutes = Math.floor((ms / (1000 * 60)) % 60);
        let hours = Math.floor((ms / (1000 * 60 * 60)) % 24);

        hours = (hours < 10) ? "0" + hours : hours;
        minutes = (minutes < 10) ? "0" + minutes : minutes;
        seconds = (seconds < 10) ? "0" + seconds : seconds;

        return `${hours}:${minutes}:${seconds}`;
    }
    
    getInitialUpgrades() {
        return [
            {
                id: 'strongNut', name: 'Крепкий Орешек', icon: 'icon_upgrades.png',
                descriptionLine1: "+1 <img src='nut_regular.png' class='inline-nut-icon'> за клик",
                descriptionLine2: 'Белка бьет сильнее!',
                currentLevel: 0, maxLevel: 10, baseCost: 20, costMultiplier: 1.8,
                bonusPerClick: 1, bonusPerSecond: 0
            },
            {
                id: 'forestBank', name: 'Лесная Копилка', icon: 'icon_upgrade_passive.png',
                descriptionLine1: "+1 <img src='nut_regular.png' class='inline-nut-icon'> в секунду",
                descriptionLine2: 'Орешки капают сами!',
                currentLevel: 0, maxLevel: 10, baseCost: 100, costMultiplier: 2.2,
                bonusPerClick: 0, bonusPerSecond: 1
            },
            {
                id: 'travelPolicy', name: 'Полис Путешественника', icon: 'icon_upgrade_travel.png',
                descriptionLine1: "+5 <img src='nut_regular.png' class='inline-nut-icon'> за клик",
                descriptionLine2: 'Для беззаботного отпуска!',
                currentLevel: 0, maxLevel: 5, baseCost: 250, costMultiplier: 2.5,
                bonusPerClick: 5, bonusPerSecond: 0
            },
            {
                id: 'tickShield', name: 'Щит от Клеща', icon: 'icon_upgrade_tick.png',
                descriptionLine1: "+3 <img src='nut_regular.png' class='inline-nut-icon'> в секунду",
                descriptionLine2: 'Лето без укусов!',
                currentLevel: 0, maxLevel: 5, baseCost: 500, costMultiplier: 3,
                bonusPerClick: 0, bonusPerSecond: 3
            },
        ];
    }

    getInitialTasks() {
        return [
            {
                id: 'click100', type: 'clicks', description: 'Сделай 100 кликов', icon: 'icon_tasks.png',
                target: 100, reward: 50, progress: 0, completed: false, claimed: false
            },
            {
                id: 'earn250nuts', type: 'earnNuts', description: 'Собери 250 орешков', icon: 'nut_regular.png',
                target: 250, reward: 75, progress: 0, completed: false, claimed: false
            },
            {
                id: 'buyStrongNutLvl1', type: 'buyUpgrade', upgradeId: 'strongNut',
                description: 'Купи улучшение "Крепкий Орешек"', icon: 'icon_upgrades.png',
                target: 1, reward: 100, progress: 0, completed: false, claimed: false // Target 1 means buy it once
            },
            {
                id: 'claimDailyBonusOnce', type: 'claimDailyBonus', description: 'Забери ежедневный бонус', icon: 'icon_gift.png',
                target: 1, reward: 30, progress: 0, completed: false, claimed: false
            },
            {
                id: 'click500', type: 'clicks', description: 'Сделай 500 кликов', icon: 'icon_tasks.png',
                target: 500, reward: 150, progress: 0, completed: false, claimed: false
            },
        ];
    }

    calculateUpgradeCost(upgrade) {
        return Math.floor(upgrade.baseCost * Math.pow(upgrade.costMultiplier, upgrade.currentLevel));
    }

    renderUpgrades() {
        this.upgradesListElement.innerHTML = ''; // Clear existing upgrades

        this.upgrades.forEach(upgrade => {
            const card = document.createElement('div');
            card.classList.add('upgrade-card');

            const cost = this.calculateUpgradeCost(upgrade);
            const canAfford = this.nutCount >= cost;
            const isMaxLevel = upgrade.currentLevel >= upgrade.maxLevel;

            let buttonHTML;
            let buttonClasses = 'upgrade-buy-button';

            if (isMaxLevel) {
                buttonHTML = `<span class="max-level-text">Макс. ур. ✔</span>`;
                buttonClasses += ' disabled';
            } else {
                const costFormatted = this.formatNumber(cost);
                let costClass = 'cost-value';
                if (!canAfford) {
                    buttonClasses += ' disabled';
                    costClass += ' unaffordable';
                }
                buttonHTML = `Улучшить <br><span class="${costClass}">${costFormatted} <img src="nut_regular.png" class="inline-nut-icon"></span>`;
            }
            
            card.innerHTML = `
                <div class="upgrade-icon"><img src="${upgrade.icon}" alt="${upgrade.name}"></div>
                <div class="upgrade-info">
                    <div class="upgrade-name">${upgrade.name}</div>
                    <div class="upgrade-description">
                        <span class="game-effect">${upgrade.descriptionLine1}</span><br>
                        <span class="slogan">${upgrade.descriptionLine2}</span>
                    </div>
                    <div class="upgrade-level">Уровень: ${upgrade.currentLevel}/${upgrade.maxLevel}</div>
                </div>
                <div class="upgrade-action">
                    <button class="${buttonClasses}" data-upgrade-id="${upgrade.id}" ${isMaxLevel || (!canAfford && !isMaxLevel) ? 'disabled' : ''}>
                        ${buttonHTML}
                    </button>
                </div>
            `;
            this.upgradesListElement.appendChild(card);

            if (!isMaxLevel) {
                card.querySelector('.upgrade-buy-button').addEventListener('click', () => this.handleUpgradePurchase(upgrade.id));
            }
        });
    }

    handleUpgradePurchase(upgradeId) {
        const upgrade = this.upgrades.find(u => u.id === upgradeId);
        if (!upgrade || upgrade.currentLevel >= upgrade.maxLevel) return;

        const cost = this.calculateUpgradeCost(upgrade);
        if (this.nutCount < cost) {
            const button = this.upgradesListElement.querySelector(`.upgrade-buy-button[data-upgrade-id="${upgradeId}"]`);
            if(button) {
                button.classList.add('shake');
                setTimeout(() => button.classList.remove('shake'), 300);
            }
            return;
        }

        this.nutCount -= cost;
        upgrade.currentLevel++;
        this.playSound('purchase');

        // Recalculate bonuses
        this.bonusNutsPerClick = 0;
        this.bonusNutsPerSecond = 0;
        this.upgrades.forEach(upg => {
            this.bonusNutsPerClick += upg.bonusPerClick * upg.currentLevel;
            this.bonusNutsPerSecond += upg.bonusPerSecond * upg.currentLevel;
        });

        this.updateNutDisplay();
        this.renderUpgrades(); // Re-render all to reflect changes
        this.updateSpeedUpButtonState(); // Cost might now be affordable for speedup
        this.updatePassiveIncome();
        this.saveGameState();
        this.updateTaskProgress('buyUpgrade', 1, upgrade.id); // Track upgrade purchase for tasks
    }

    applyLoadedUpgrades() {
        this.bonusNutsPerClick = 0;
        this.bonusNutsPerSecond = 0;
        this.upgrades.forEach(loadedUpgrade => {
            // Find the corresponding definition to ensure all properties are there
            const definition = this.getInitialUpgrades().find(def => def.id === loadedUpgrade.id);
            if (definition) {
                // Merge saved level into the main upgrade object
                const gameUpgrade = this.upgrades.find(u => u.id === loadedUpgrade.id);
                if (gameUpgrade && loadedUpgrade.currentLevel !== undefined) {
                     gameUpgrade.currentLevel = loadedUpgrade.currentLevel;
                }
            }
        });

        // After levels are set, calculate bonuses
         this.upgrades.forEach(upg => {
            this.bonusNutsPerClick += upg.bonusPerClick * upg.currentLevel;
            this.bonusNutsPerSecond += upg.bonusPerSecond * upg.currentLevel;
        });
    }
    
    updatePassiveIncome() {
        if (this.passiveIncomeInterval) {
            clearInterval(this.passiveIncomeInterval);
            this.passiveIncomeInterval = null;
        }
        if (this.currentNutsPerSecond > 0) {
            this.passiveIncomeInterval = setInterval(() => {
                this.addNuts(this.currentNutsPerSecond);
                 // No confetti for passive income, to avoid being too busy
            }, 1000);
        }
    }

    updateTaskProgress(taskType, value, detail = null) {
        let tasksUpdated = false;
        this.tasks.forEach(task => {
            if (task.claimed) return; // Skip already claimed tasks

            let taskMatchesCriteria = false;
            if (task.type === taskType) {
                if (taskType === 'buyUpgrade') {
                    if (task.upgradeId === detail) {
                        taskMatchesCriteria = true;
                    }
                } else {
                    taskMatchesCriteria = true;
                }
            }

            if (taskMatchesCriteria && task.progress < task.target) {
                task.progress = Math.min(task.progress + value, task.target);
                if (task.progress >= task.target) {
                    task.completed = true;
                }
                tasksUpdated = true;
            }
        });

        if (tasksUpdated) {
            this.renderTasks();
            // No need to save game state here, as actions triggering progress should save state
        }
    }

    renderTasks() {
        if (!this.tasksListElement) return; // Guard if DOM not ready
        this.tasksListElement.innerHTML = '';

        this.tasks.forEach(task => {
            const card = document.createElement('div');
            card.classList.add('task-card');
            if (task.claimed) {
                card.classList.add('claimed');
            } else if (task.completed) {
                card.classList.add('completed');
            }

            const progressPercent = task.target > 0 ? (task.progress / task.target) * 100 : 0;

            let buttonHTML;
            let buttonClasses = 'task-claim-button';
            let buttonDisabled = false;

            if (task.claimed) {
                buttonHTML = `<span>Получено ✔</span>`;
                buttonClasses += ' disabled';
                buttonDisabled = true;
            } else if (task.completed) {
                buttonHTML = `Забрать!`;
                // active state, no 'disabled' class
            } else {
                buttonHTML = `В процессе`;
                buttonClasses += ' disabled'; // Visually disabled if not completable yet
                buttonDisabled = true;
            }
            
            card.innerHTML = `
                <div class="task-icon"><img src="${task.icon}" alt="${task.type}"></div>
                <div class="task-details">
                    <div class="task-description">${task.description}</div>
                    <div class="task-progress-container">
                        <div class="task-progress-bar" style="width: ${progressPercent}%"></div>
                        <div class="task-progress-text">${this.formatNumber(task.progress)} / ${this.formatNumber(task.target)}</div>
                    </div>
                </div>
                <div class="task-reward-action">
                    <div class="task-reward-info">
                        +${this.formatNumber(task.reward)} <img src="nut_regular.png" class="inline-nut-icon">
                    </div>
                    <button class="${buttonClasses}" data-task-id="${task.id}" ${buttonDisabled ? 'disabled' : ''}>
                        ${buttonHTML}
                    </button>
                </div>
            `;
            this.tasksListElement.appendChild(card);

            if (!buttonDisabled) {
                card.querySelector('.task-claim-button').addEventListener('click', () => this.claimTaskReward(task.id));
            }
        });
    }

    claimTaskReward(taskId) {
        const task = this.tasks.find(t => t.id === taskId);
        if (task && task.completed && !task.claimed) {
            // Directly add nuts without triggering 'earnNuts' task progress from this reward
            this.nutCount += task.reward;
            this.updateNutDisplay();
            this.updateSpeedUpButtonState();
            this.renderUpgrades(); // Update affordibility of upgrades

            task.claimed = true;
            this.playSound('bonus'); // Or a specific 'task_complete' sound
            confetti({
                particleCount: 80,
                spread: 60,
                origin: { y: 0.7 },
                colors: ['#F4A261', '#FFC107', '#8CB369']
            });

            this.renderTasks(); // Update the tasks UI
            this.saveGameState(); // Save state after claiming
        }
    }

    saveGameState() {
        const gameState = {
            nutCount: this.nutCount,
            nextBonusTime: this.nextBonusTime,
            upgrades: this.upgrades.map(u => ({ id: u.id, currentLevel: u.currentLevel })),
            tasks: this.tasks.map(t => ({ 
                id: t.id, 
                progress: t.progress, 
                completed: t.completed, 
                claimed: t.claimed 
            })),
        };
        localStorage.setItem('squirrelGameState', JSON.stringify(gameState));
    }

    loadGameState() {
        const savedState = localStorage.getItem('squirrelGameState');
        if (savedState) {
            const gameState = JSON.parse(savedState);
            this.nutCount = gameState.nutCount || 0;
            this.nextBonusTime = gameState.nextBonusTime || 0;
            if (gameState.upgrades) {
                this.upgrades.forEach(upgrade => {
                    const savedUpgrade = gameState.upgrades.find(su => su.id === upgrade.id);
                    if (savedUpgrade) {
                        upgrade.currentLevel = savedUpgrade.currentLevel;
                    }
                });
            }
            if (gameState.tasks) {
                this.tasks.forEach(taskDef => {
                    const savedTask = gameState.tasks.find(st => st.id === taskDef.id);
                    if (savedTask) {
                        taskDef.progress = savedTask.progress || 0;
                        taskDef.completed = savedTask.completed || false;
                        taskDef.claimed = savedTask.claimed || false;
                    }
                });
            }
        }
        if (this.nextBonusTime < Date.now() - this.dailyBonusCooldown) {
            this.nextBonusTime = 0;
        }
    }
}

window.addEventListener('load', () => {
    new SquirrelGame();
});

const styleSheet = document.styleSheets[0];
if (styleSheet) { // Ensure stylesheet is loaded
    try {
        const shakeKeyframes = 
        `@keyframes shake {
          0%, 100% { transform: translateX(0); }
          20%, 60% { transform: translateX(-5px); }
          40%, 80% { transform: translateX(5px); }
        }`;
        styleSheet.insertRule(shakeKeyframes, styleSheet.cssRules.length);

        const shakeRule = `.shake { animation: shake 0.3s ease-in-out; }`;
        styleSheet.insertRule(shakeRule, styleSheet.cssRules.length);
    } catch (e) {
        console.warn("Could not insert shake animation rules:", e);
    }
} else {
    console.warn("Stylesheet not found for inserting animation rules.");
}