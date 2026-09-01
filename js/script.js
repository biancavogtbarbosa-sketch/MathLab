// ============================================
// MATHLAB - Funções Polinomiais Interativas
// ============================================

// ===== 1. ANIMAÇÃO DE FUNDO (HERO) =====
const bgCanvas = document.getElementById('bgCanvas');
const bgCtx = bgCanvas.getContext('2d');

function resizeBgCanvas() {
    bgCanvas.width = window.innerWidth;
    bgCanvas.height = window.innerHeight;
}
resizeBgCanvas();
window.addEventListener('resize', resizeBgCanvas);

// Partículas matemáticas flutuantes
const particles = [];
const symbols = ['∫', 'Σ', 'π', '∞', 'Δ', '√', 'f(x)', 'x²', '+', '−', '=', 'α', 'β'];

for (let i = 0; i < 40; i++) {
    particles.push({
        x: Math.random() * bgCanvas.width,
        y: Math.random() * bgCanvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        symbol: symbols[Math.floor(Math.random() * symbols.length)],
        size: Math.random() * 18 + 12,
        opacity: Math.random() * 0.4 + 0.1,
        color: ['#00e5ff', '#ff00aa', '#ffd700'][Math.floor(Math.random() * 3)]
    });
}

function animateBg() {
    bgCtx.clearRect(0, 0, bgCanvas.width, bgCanvas.height);

    // Grade sutil
    bgCtx.strokeStyle = 'rgba(0, 229, 255, 0.05)';
    bgCtx.lineWidth = 1;
    const gridSize = 50;
    for (let x = 0; x < bgCanvas.width; x += gridSize) {
        bgCtx.beginPath();
        bgCtx.moveTo(x, 0);
        bgCtx.lineTo(x, bgCanvas.height);
        bgCtx.stroke();
    }
    for (let y = 0; y < bgCanvas.height; y += gridSize) {
        bgCtx.beginPath();
        bgCtx.moveTo(0, y);
        bgCtx.lineTo(bgCanvas.width, y);
        bgCtx.stroke();
    }

    // Partículas
    particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > bgCanvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > bgCanvas.height) p.vy *= -1;

        bgCtx.fillStyle = p.color;
        bgCtx.globalAlpha = p.opacity;
        bgCtx.font = `${p.size}px 'JetBrains Mono', monospace`;
        bgCtx.fillText(p.symbol, p.x, p.y);
    });

    bgCtx.globalAlpha = 1;
    requestAnimationFrame(animateBg);
}
animateBg();

// ===== 2. LABORATÓRIO INTERATIVO =====
const graphCanvas = document.getElementById('graphCanvas');
const gCtx = graphCanvas.getContext('2d');

const sliderA = document.getElementById('sliderA');
const sliderB = document.getElementById('sliderB');
const sliderC = document.getElementById('sliderC');
const valA = document.getElementById('valA');
const valB = document.getElementById('valB');
const valC = document.getElementById('valC');
const functionLabel = document.getElementById('functionLabel');

function resizeGraphCanvas() {
    const rect = graphCanvas.getBoundingClientRect();
    graphCanvas.width = rect.width * window.devicePixelRatio;
    graphCanvas.height = rect.height * window.devicePixelRatio;
    gCtx.scale(window.devicePixelRatio, window.devicePixelRatio);
}
resizeGraphCanvas();
window.addEventListener('resize', () => {
    resizeGraphCanvas();
    drawGraph();
});

// Escala do gráfico
const SCALE = {
    xMin: -10, xMax: 10,
    yMin: -10, yMax: 10
};

function mathToCanvas(x, y) {
    const rect = graphCanvas.getBoundingClientRect();
    const w = rect.width;
    const h = rect.height;
    const cx = ((x - SCALE.xMin) / (SCALE.xMax - SCALE.xMin)) * w;
    const cy = h - ((y - SCALE.yMin) / (SCALE.yMax - SCALE.yMin)) * h;
    return { x: cx, y: cy };
}

function drawGrid() {
    const rect = graphCanvas.getBoundingClientRect();
    const w = rect.width;
    const h = rect.height;

    gCtx.clearRect(0, 0, w, h);

    // Fundo
    gCtx.fillStyle = 'rgba(10, 14, 39, 0.5)';
    gCtx.fillRect(0, 0, w, h);

    // Grade
    gCtx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
    gCtx.lineWidth = 1;

    for (let x = Math.ceil(SCALE.xMin); x <= SCALE.xMax; x++) {
        const p = mathToCanvas(x, 0);
        gCtx.beginPath();
        gCtx.moveTo(p.x, 0);
        gCtx.lineTo(p.x, h);
        gCtx.stroke();
    }
    for (let y = Math.ceil(SCALE.yMin); y <= SCALE.yMax; y++) {
        const p = mathToCanvas(0, y);
        gCtx.beginPath();
        gCtx.moveTo(0, p.y);
        gCtx.lineTo(w, p.y);
        gCtx.stroke();
    }

    // Eixos
    gCtx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
    gCtx.lineWidth = 2;

    // Eixo X
    const xAxis = mathToCanvas(0, 0);
    gCtx.beginPath();
    gCtx.moveTo(0, xAxis.y);
    gCtx.lineTo(w, xAxis.y);
    gCtx.stroke();

    // Eixo Y
    gCtx.beginPath();
    gCtx.moveTo(xAxis.x, 0);
    gCtx.lineTo(xAxis.x, h);
    gCtx.stroke();

    // Números nos eixos
    gCtx.fillStyle = 'rgba(255, 255, 255, 0.5)';
    gCtx.font = '11px JetBrains Mono, monospace';
    gCtx.textAlign = 'center';
    for (let x = Math.ceil(SCALE.xMin); x <= SCALE.xMax; x++) {
        if (x === 0) continue;
        const p = mathToCanvas(x, 0);
        gCtx.fillText(x, p.x, xAxis.y + 15);
    }
    gCtx.textAlign = 'right';
    for (let y = Math.ceil(SCALE.yMin); y <= SCALE.yMax; y++) {
        if (y === 0) continue;
        const p = mathToCanvas(0, y);
        gCtx.fillText(y, xAxis.x - 5, p.y + 4);
    }
}

function evaluate(a, b, c, x) {
    return a * x * x + b * x + c;
}

function drawFunction(a, b, c) {
    const rect = graphCanvas.getBoundingClientRect();
    const w = rect.width;

    // Traça a função
    gCtx.strokeStyle = '#00e5ff';
    gCtx.lineWidth = 3;
    gCtx.shadowColor = '#00e5ff';
    gCtx.shadowBlur = 10;
    gCtx.beginPath();

    let started = false;
    const step = (SCALE.xMax - SCALE.xMin) / (w * 2);

    for (let x = SCALE.xMin; x <= SCALE.xMax; x += step) {
        const y = evaluate(a, b, c, x);
        const p = mathToCanvas(x, y);

        if (p.y < -100 || p.y > rect.height + 100) {
            started = false;
            continue;
        }

        if (!started) {
            gCtx.moveTo(p.x, p.y);
            started = true;
        } else {
            gCtx.lineTo(p.x, p.y);
        }
    }
    gCtx.stroke();
    gCtx.shadowBlur = 0;
}

function drawRoots(a, b, c) {
    const roots = calculateRoots(a, b, c);
    roots.forEach(r => {
        if (r >= SCALE.xMin && r <= SCALE.xMax) {
            const p = mathToCanvas(r, 0);
            gCtx.fillStyle = '#ff00aa';
            gCtx.shadowColor = '#ff00aa';
            gCtx.shadowBlur = 15;
            gCtx.beginPath();
            gCtx.arc(p.x, p.y, 6, 0, Math.PI * 2);
            gCtx.fill();
            gCtx.shadowBlur = 0;
        }
    });
}

function drawVertex(a, b, c) {
    if (a === 0) return;
    const xv = -b / (2 * a);
    const yv = evaluate(a, b, c, xv);

    if (xv >= SCALE.xMin && xv <= SCALE.xMax && yv >= SCALE.yMin && yv <= SCALE.yMax) {
        const p = mathToCanvas(xv, yv);
        gCtx.fillStyle = '#ffd700';
        gCtx.shadowColor = '#ffd700';
        gCtx.shadowBlur = 15;
        gCtx.beginPath();
        gCtx.arc(p.x, p.y, 7, 0, Math.PI * 2);
        gCtx.fill();
        gCtx.shadowBlur = 0;

        // Label
        gCtx.fillStyle = '#ffd700';
        gCtx.font = 'bold 12px JetBrains Mono';
        gCtx.textAlign = 'left';
        gCtx.fillText(`V(${xv.toFixed(2)}, ${yv.toFixed(2)})`, p.x + 10, p.y - 10);
    }
}

function drawGraph() {
    const a = parseFloat(sliderA.value);
    const b = parseFloat(sliderB.value);
    const c = parseFloat(sliderC.value);

    drawGrid();
    drawFunction(a, b, c);
    drawRoots(a, b, c);
    drawVertex(a, b, c);
    updateProperties(a, b, c);
    updateFunctionLabel(a, b, c);
}

function updateFunctionLabel(a, b, c) {
    let expr = 'f(x) = ';
    if (a !== 0) {
        if (a === 1) expr += 'x²';
        else if (a === -1) expr += '-x²';
        else expr += `${a}x²`;
    }
    if (b !== 0) {
        if (a !== 0) expr += b > 0 ? ` + ${b === 1 ? '' : b}x` : ` − ${b === -1 ? '' : Math.abs(b)}x`;
        else {
            if (b === 1) expr += 'x';
            else if (b === -1) expr += '-x';
            else expr += `${b}x`;
        }
    }
    if (c !== 0) {
        if (a !== 0 || b !== 0) expr += c > 0 ? ` + ${c}` : ` − ${Math.abs(c)}`;
        else expr += `${c}`;
    }
    if (a === 0 && b === 0 && c === 0) expr += '0';
    functionLabel.textContent = expr;
}

function calculateRoots(a, b, c) {
    if (a === 0) {
        // Função do 1º grau: ax + b = 0 → x = -b/a (mas aqui a=0, então bx+c=0)
        if (b !== 0) return [-c / b];
        return [];
    }
    const delta = b * b - 4 * a * c;
    if (delta < 0) return [];
    if (delta === 0) return [-b / (2 * a)];
    const sqrtDelta = Math.sqrt(delta);
    return [(-b - sqrtDelta) / (2 * a), (-b + sqrtDelta) / (2 * a)];
}

function updateProperties(a, b, c) {
    const propType = document.getElementById('propType');
    const propConcavity = document.getElementById('propConcavity');
    const propVertex = document.getElementById('propVertex');
    const propDelta = document.getElementById('propDelta');
    const propRoots = document.getElementById('propRoots');

    if (a === 0) {
        propType.textContent = '1º Grau (Reta)';
        propConcavity.textContent = '—';
        propVertex.textContent = '—';
        propDelta.textContent = '—';
        const roots = calculateRoots(a, b, c);
        propRoots.textContent = roots.length > 0 ? `x = ${roots[0].toFixed(2)}` : 'Nenhuma';
    } else {
        propType.textContent = '2º Grau (Parábola)';
        propConcavity.textContent = a > 0 ? 'Para cima ↑ (mínimo)' : 'Para baixo ↓ (máximo)';
        const xv = -b / (2 * a);
        const yv = evaluate(a, b, c, xv);
        propVertex.textContent = `(${xv.toFixed(2)}, ${yv.toFixed(2)})`;
        const delta = b * b - 4 * a * c;
        propDelta.textContent = delta.toFixed(2);
        const roots = calculateRoots(a, b, c);
        if (roots.length === 0) propRoots.textContent = 'Nenhuma raiz real';
        else if (roots.length === 1) propRoots.textContent = `x = ${roots[0].toFixed(2)} (dupla)`;
        else propRoots.textContent = `x₁ = ${roots[0].toFixed(2)}, x₂ = ${roots[1].toFixed(2)}`;
    }
}

[sliderA, sliderB, sliderC].forEach(slider => {
    slider.addEventListener('input', () => {
        valA.textContent = parseFloat(sliderA.value).toFixed(1);
        valB.textContent = parseFloat(sliderB.value).toFixed(1);
        valC.textContent = parseFloat(sliderC.value).toFixed(1);
        drawGraph();
    });
});

document.getElementById('resetBtn').addEventListener('click', () => {
    sliderA.value = 1;
    sliderB.value = 0;
    sliderC.value = 0;
    valA.textContent = '1.0';
    valB.textContent = '0.0';
    valC.textContent = '0.0';
    drawGraph();
});

// Inicializa
drawGraph();

// ===== 3. ABAS DE CONTEXTOS =====
const tabBtns = document.querySelectorAll('.tab-btn');
const tabPanes = document.querySelectorAll('.tab-pane');

tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const target = btn.dataset.tab;
        tabBtns.forEach(b => b.classList.remove('active'));
        tabPanes.forEach(p => p.classList.remove('active'));
        btn.classList.add('active');
        document.getElementById(target).classList.add('active');
    });
});

// ===== 4. BOTÕES "REVELAR SOLUÇÃO" =====
document.querySelectorAll('.reveal-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const targetId = btn.dataset.target;
        const solution = document.getElementById(targetId);
        solution.classList.toggle('hidden');
        btn.textContent = solution.classList.contains('hidden')
            ? '💡 Revelar Solução'
            : '🙈 Ocultar Solução';
    });
});

// ===== 5. DESAFIO DINÂMICO =====
const miniCanvas = document.getElementById('miniCanvas');
const mCtx = miniCanvas.getContext('2d');

function resizeMiniCanvas() {
    const rect = miniCanvas.getBoundingClientRect();
    miniCanvas.width = rect.width * window.devicePixelRatio;
    miniCanvas.height = rect.height * window.devicePixelRatio;
    mCtx.scale(window.devicePixelRatio, window.devicePixelRatio);
}
resizeMiniCanvas();
window.addEventListener('resize', () => {
    resizeMiniCanvas();
    analyzeChallenge();
});

function drawMiniGraph(a, b, c) {
    const rect = miniCanvas.getBoundingClientRect();
    const w = rect.width;
    const h = rect.height;

    mCtx.clearRect(0, 0, w, h);
    mCtx.fillStyle = 'rgba(10, 14, 39, 0.5)';
    mCtx.fillRect(0, 0, w, h);

    // Auto-escala
    let xMin = -10, xMax = 10;
    let yMin = -10, yMax = 10;

    // Ajusta escala baseada no vértice e raízes
    if (a !== 0) {
        const xv = -b / (2 * a);
        const yv = evaluate(a, b, c, xv);
        const roots = calculateRoots(a, b, c);

        const points = [xv, ...roots];
        const minX = Math.min(...points);
        const maxX = Math.max(...points);
        const range = Math.max(maxX - minX, 4);
        xMin = Math.min(-10, minX - range / 2);
        xMax = Math.max(10, maxX + range / 2);

        const yAtBounds = [evaluate(a, b, c, xMin), evaluate(a, b, c, xMax), yv, 0, c];
        yMin = Math.min(...yAtBounds) - 2;
        yMax = Math.max(...yAtBounds) + 2;

        // Garante proporção razoável
        if (yMax - yMin > 50) {
            yMin = yv - 15;
            yMax = yv + 15;
        }
    }

    function toCanvas(x, y) {
        const cx = ((x - xMin) / (xMax - xMin)) * w;
        const cy = h - ((y - yMin) / (yMax - yMin)) * h;
        return { x: cx, y: cy };
    }

    // Grade
    mCtx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
    mCtx.lineWidth = 1;
    for (let i = 0; i <= 10; i++) {
        const x = (w / 10) * i;
        mCtx.beginPath();
        mCtx.moveTo(x, 0);
        mCtx.lineTo(x, h);
        mCtx.stroke();
        const y = (h / 10) * i;
        mCtx.beginPath();
        mCtx.moveTo(0, y);
        mCtx.lineTo(w, y);
        mCtx.stroke();
    }

    // Eixos
    mCtx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
    mCtx.lineWidth = 2;
    const xAxis = toCanvas(0, 0);
    if (xAxis.y >= 0 && xAxis.y <= h) {
        mCtx.beginPath();
        mCtx.moveTo(0, xAxis.y);
        mCtx.lineTo(w, xAxis.y);
        mCtx.stroke();
    }
    const yAxis = toCanvas(0, 0);
    if (yAxis.x >= 0 && yAxis.x <= w) {
        mCtx.beginPath();
        mCtx.moveTo(yAxis.x, 0);
        mCtx.lineTo(yAxis.x, h);
        mCtx.stroke();
    }

    // Função
    mCtx.strokeStyle = '#00e5ff';
    mCtx.lineWidth = 3;
    mCtx.shadowColor = '#00e5ff';
    mCtx.shadowBlur = 10;
    mCtx.beginPath();
    let started = false;
    const step = (xMax - xMin) / (w * 2);
    for (let x = xMin; x <= xMax; x += step) {
        const y = evaluate(a, b, c, x);
        const p = toCanvas(x, y);
        if (p.y < -50 || p.y > h + 50) {
            started = false;
            continue;
        }
        if (!started) {
            mCtx.moveTo(p.x, p.y);
            started = true;
        } else {
            mCtx.lineTo(p.x, p.y);
        }
    }
    mCtx.stroke();
    mCtx.shadowBlur = 0;

    // Raízes
    const roots = calculateRoots(a, b, c);
    roots.forEach(r => {
        if (r >= xMin && r <= xMax) {
            const p = toCanvas(r, 0);
            mCtx.fillStyle = '#ff00aa';
            mCtx.shadowColor = '#ff00aa';
            mCtx.shadowBlur = 10;
            mCtx.beginPath();
            mCtx.arc(p.x, p.y, 5, 0, Math.PI * 2);
            mCtx.fill();
            mCtx.shadowBlur = 0;
        }
    });

    // Vértice
    if (a !== 0) {
        const xv = -b / (2 * a);
        const yv = evaluate(a, b, c, xv);
        if (xv >= xMin && xv <= xMax && yv >= yMin && yv <= yMax) {
            const p = toCanvas(xv, yv);
            mCtx.fillStyle = '#ffd700';
            mCtx.shadowColor = '#ffd700';
            mCtx.shadowBlur = 10;
            mCtx.beginPath();
            mCtx.arc(p.x, p.y, 6, 0, Math.PI * 2);
            mCtx.fill();
            mCtx.shadowBlur = 0;
        }
    }
}

function analyzeChallenge() {
    const a = parseFloat(document.getElementById('inputA').value) || 0;
    const b = parseFloat(document.getElementById('inputB').value) || 0;
    const c = parseFloat(document.getElementById('inputC').value) || 0;

    const resType = document.getElementById('resType');
    const resExpr = document.getElementById('resExpr');
    const resRoots = document.getElementById('resRoots');
    const resVertex = document.getElementById('resVertex');

    if (a === 0 && b === 0) {
        resType.textContent = 'Função Constante';
        resExpr.textContent = `f(x) = ${c}`;
        resRoots.textContent = c === 0 ? 'Todos os reais' : 'Nenhuma';
        resVertex.textContent = '—';
    } else if (a === 0) {
        resType.textContent = 'Função do 1º Grau (Reta)';
        resExpr.textContent = `f(x) = ${b}x + ${c}`;
        const roots = calculateRoots(a, b, c);
        resRoots.textContent = roots.length > 0 ? `x = ${roots[0].toFixed(2)}` : 'Nenhuma';
        resVertex.textContent = '—';
    } else {
        resType.textContent = 'Função do 2º Grau (Parábola)';
        resExpr.textContent = `f(x) = ${a}x² + ${b}x + ${c}`;
        const roots = calculateRoots(a, b, c);
        if (roots.length === 0) resRoots.textContent = 'Nenhuma raiz real (Δ < 0)';
        else if (roots.length === 1) resRoots.textContent = `x = ${roots[0].toFixed(2)} (raiz dupla)`;
        else resRoots.textContent = `x₁ = ${roots[0].toFixed(2)}, x₂ = ${roots[1].toFixed(2)}`;
        const xv = -b / (2 * a);
        const yv = evaluate(a, b, c, xv);
        resVertex.textContent = `(${xv.toFixed(2)}, ${yv.toFixed(2)}) — ${a > 0 ? 'mínimo' : 'máximo'}`;
    }

    drawMiniGraph(a, b, c);
}

document.getElementById('analyzeBtn').addEventListener('click', () => {
    document.getElementById('challengeResult').classList.remove('hidden');
    analyzeChallenge();
});

// ===== 6. ANIMAÇÕES DE SCROLL =====
const fadeElements = document.querySelectorAll('.fade-in');
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, { threshold: 0.1 });

fadeElements.forEach(el => observer.observe(el));

// ===== 7. MENU MOBILE =====
const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');

menuToggle.addEventListener('click', () => {
    navLinks.classList.toggle('active');
});

document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('active');
    });
});

// ===== 8. INICIALIZAÇÃO DO DESAFIO =====
analyzeChallenge();

console.log('%c🎓 MathLab carregado com sucesso!', 'color: #00e5ff; font-size: 16px; font-weight: bold;');
console.log('%cExplore as funções polinomiais de forma interativa!', 'color: #ff00aa; font-size: 12px;');
