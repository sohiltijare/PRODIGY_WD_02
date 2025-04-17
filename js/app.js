document.addEventListener('DOMContentLoaded', function() {
    // Initialize particles.js
    particlesJS('particles-js', {
        particles: {
            number: { value: 80, density: { enable: true, value_area: 800 } },
            color: { value: "#00f5d4" },
            shape: { type: "circle" },
            opacity: { value: 0.5, random: true },
            size: { value: 3, random: true },
            line_linked: { 
                enable: true,
                distance: 150, 
                color: "#00bbf9", 
                opacity: 0.4, 
                width: 1 
            },
            move: { 
                enable: true, 
                speed: 2, 
                direction: "none", 
                random: true, 
                straight: false, 
                out_mode: "out" 
            }
        },
        interactivity: {
            detect_on: "canvas",
            events: {
                onhover: { enable: true, mode: "repulse" },
                onclick: { enable: true, mode: "push" }
            }
        }
    });

    // Stopwatch functionality
    let startTime;
    let elapsedTime = 0;
    let timerInterval;
    let isRunning = false;
    let lapCount = 0;
    let lastLapTime = 0;

    const display = document.getElementById('display');
    const lapCountDisplay = document.getElementById('lap-count');
    const lapsList = document.getElementById('laps');
    const startBtn = document.getElementById('start');
    const pauseBtn = document.getElementById('pause');
    const lapBtn = document.getElementById('lap');
    const resetBtn = document.getElementById('reset');
    const progressCircle = document.querySelector('.progress-ring__circle-fill');

    // Format time as HH:MM:SS.mm
    function formatTime(ms) {
        let date = new Date(ms);
        let hours = date.getUTCHours().toString().padStart(2, '0');
        let minutes = date.getUTCMinutes().toString().padStart(2, '0');
        let seconds = date.getUTCSeconds().toString().padStart(2, '0');
        let milliseconds = Math.floor(date.getUTCMilliseconds() / 10).toString().padStart(2, '0');
        
        return `${hours}:${minutes}:${seconds}.${milliseconds}`;
    }

    // Update the display
    function updateDisplay() {
        display.textContent = formatTime(elapsedTime);
        
        // Update progress ring (circle circumference is 942px)
        const progress = (elapsedTime % 10000) / 10000;
        const offset = 942 - (progress * 942);
        progressCircle.style.strokeDashoffset = offset;
    }

    // Start the stopwatch
    function startTimer() {
        if (!isRunning) {
            startTime = Date.now() - elapsedTime;
            timerInterval = setInterval(function() {
                elapsedTime = Date.now() - startTime;
                updateDisplay();
            }, 10);
            isRunning = true;
            
            // UI updates
            startBtn.classList.remove('pulse');
            startBtn.disabled = true;
            pauseBtn.disabled = false;
            lapBtn.disabled = false;
        }
    }

    // Pause the stopwatch
    function pauseTimer() {
        if (isRunning) {
            clearInterval(timerInterval);
            isRunning = false;
            
            // UI updates
            startBtn.classList.add('pulse');
            startBtn.disabled = false;
            pauseBtn.disabled = true;
        }
    }

    // Reset the stopwatch
    function resetTimer() {
        pauseTimer();
        elapsedTime = 0;
        lapCount = 0;
        lastLapTime = 0;
        updateDisplay();
        lapsList.innerHTML = '';
        lapCountDisplay.textContent = `Laps: ${lapCount}`;
        
        // Reset progress ring
        progressCircle.style.strokeDashoffset = 942;
    }

    // Record a lap time
    function recordLap() {
        if (isRunning || elapsedTime > 0) {
            lapCount++;
            const currentLapTime = elapsedTime;
            const lapDifference = currentLapTime - lastLapTime;
            
            const lapItem = document.createElement('div');
            lapItem.className = 'lap-item';
            lapItem.innerHTML = `
                <span class="lap-number">${lapCount}</span>
                <span class="lap-time">${formatTime(currentLapTime)}</span>
                <span class="lap-split">+${formatTime(lapDifference)}</span>
            `;
            
            lapsList.prepend(lapItem);
            lapCountDisplay.textContent = `Laps: ${lapCount}`;
            lastLapTime = currentLapTime;
            
            // Scroll to top of laps list
            lapsList.scrollTop = 0;
        }
    }

    // Event listeners
    startBtn.addEventListener('click', startTimer);
    pauseBtn.addEventListener('click', pauseTimer);
    resetBtn.addEventListener('click', resetTimer);
    lapBtn.addEventListener('click', recordLap);

    // Initialize
    updateDisplay();
    pauseBtn.disabled = true;
    lapBtn.disabled = true;
});