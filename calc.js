let currentValue = '0';
let previousValue = '';
let operation = null;
let shouldResetDisplay = false;
let expression = '';
const display = document.getElementById('display');
const expressionDisplay = document.getElementById('expression');
const buttons = document.querySelectorAll('button');
let audioContext;
function initAudio() {
    if (!audioContext) {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }
}

function playBeep() {
    initAudio();
    
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.value = 800;
    oscillator.type = 'sine';
    
    gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.1);
}

function updateDisplay() {
    display.textContent = currentValue;
    expressionDisplay.textContent = expression;
}

function handleNumber(num) {
    if (shouldResetDisplay) {
        currentValue = num;
        shouldResetDisplay = false;
    } else {
        currentValue = currentValue === '0' ? num : currentValue + num;
    }
    updateDisplay();
}

function handleOperator(op) {
    if (operation !== null && !shouldResetDisplay) {
        calculate();
    }
    
    previousValue = currentValue;
    operation = op;
    expression = `${currentValue} ${getOperatorSymbol(op)}`;
    shouldResetDisplay = true;
    updateDisplay();
}

function getOperatorSymbol(op) {
    const symbols = {
        '+': '+',
        '-': '−',
        '*': '×',
        '/': '÷',
        '%': '%'
    };
    return symbols[op] || op;
}

function calculate() {
    if (operation === null || shouldResetDisplay) return;
    
    const prev = parseFloat(previousValue);
    const current = parseFloat(currentValue);
    
    if (isNaN(prev) || isNaN(current)) return;
    
    let result;
    
    switch (operation) {
        case '+':
            result = prev + current;
            break;
        case '-':
            result = prev - current;
            break;
        case '*':
            result = prev * current;
            break;
        case '/':
            if (current === 0) {
                alert('Cannot divide by zero');
                clear();
                return;
            }
            result = prev / current;
            break;
        case '%':
            result = prev % current;
            break;
    }
    result = Math.round(result * 100000000) / 100000000;
    
    expression = `${previousValue} ${getOperatorSymbol(operation)} ${currentValue} =`;
    currentValue = result.toString();
    operation = null;
    shouldResetDisplay = true;
    updateDisplay();
}

function clear() {
    currentValue = '0';
    previousValue = '';
    operation = null;
    expression = '';
    shouldResetDisplay = false;
    updateDisplay();
}

function backspace() {
    if (shouldResetDisplay) {
        clear();
        return;
    }
    
    currentValue = currentValue.length > 1 ? currentValue.slice(0, -1) : '0';
    updateDisplay();
}

function handleDecimal() {
    if (shouldResetDisplay) {
        currentValue = '0.';
        shouldResetDisplay = false;
    } else if (!currentValue.includes('.')) {
        currentValue += '.';
    }
    updateDisplay();
}

function negate() {
    currentValue = (parseFloat(currentValue) * -1).toString();
    updateDisplay();
}

function applyHoverEffect(button) {
    const originalBg = button.style.background;
    button.style.background = button.classList.contains('btn-equals') ? '#ffc5c5' : '#4a4a4a';
    button.style.transform = 'scale(1.05)';
    
    button.addEventListener('mouseleave', function resetHover() {
        button.style.background = originalBg;
        button.style.transform = 'scale(1)';
        button.removeEventListener('mouseleave', resetHover);
    });
}

function applyClickEffect(button) {
    button.style.transform = 'scale(0.95)';
    const originalBg = button.style.background;
    button.style.background = button.classList.contains('btn-equals') ? '#ffa5a5' : '#5a5a5a';
    
    setTimeout(() => {
        button.style.transform = 'scale(1)';
        button.style.background = originalBg;
    }, 100);
}
buttons.forEach(button => {
    button.addEventListener('mouseenter', () => {
        applyHoverEffect(button);
    });
    button.addEventListener('click', (e) => {
        playBeep();
        applyClickEffect(e.target);
        
        const { number, operator, action } = button.dataset;
        
        if (number !== undefined) {
            handleNumber(number);
        } else if (operator !== undefined) {
            handleOperator(operator);
        } else if (action !== undefined) {
            switch (action) {
                case 'clear':
                    clear();
                    break;
                case 'backspace':
                    backspace();
                    break;
                case 'decimal':
                    handleDecimal();
                    break;
                case 'equals':
                    calculate();
                    break;
                case 'negate':
                    negate();
                    break;
            }
        }
    });
});
document.addEventListener('keydown', (e) => {
    e.preventDefault();
    
    if (e.key >= '0' && e.key <= '9') {
        const btn = document.querySelector(`[data-number="${e.key}"]`);
        if (btn) btn.click();
    } else if (e.key === '.') {
        document.querySelector('[data-action="decimal"]').click();
    } else if (e.key === '+' || e.key === '-' || e.key === '*' || e.key === '/') {
        const btn = document.querySelector(`[data-operator="${e.key}"]`);
        if (btn) btn.click();
    } else if (e.key === 'Enter' || e.key === '=') {
        document.querySelector('[data-action="equals"]').click();
    } else if (e.key === 'Escape' || e.key === 'c' || e.key === 'C') {
        document.querySelector('[data-action="clear"]').click();
    } else if (e.key === 'Backspace') {
        document.querySelector('[data-action="backspace"]').click();
    }
});
updateDisplay();