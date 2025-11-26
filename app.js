// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-app.js";
import { getFirestore, collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-firestore.js";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDHTXUL3A3MQAsvCjoZ6zwJzj6LCudNfKw",
    authDomain: "examen-f53a9.firebaseapp.com",
    projectId: "examen-f53a9",
    storageBucket: "examen-f53a9.firebasestorage.app",
    messagingSenderId: "189548436998",
    appId: "1:189548436998:web:ef64eee38ba6d7987eed87"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Datos del examen con diferentes tipos de preguntas
// Datos del examen para practicar japonés - Verbos y Pronombres
const examData = {
    title: "スペイン語動詞マスター試験 - 活用と用法",
    questions: [
        {
            id: 1,
            type: "multiple",
            text: "『私は毎日水を飲みます』の正しいスペイン語は？",
            options: [
                "Yo bebo agua todos los días",
                "Tú bebes agua todos los días", 
                "Él bebe agua todos los días",
                "Nosotros bebemos agua todos los días"
            ],
            correctAnswer: 0,
            explanation: "『Yo bebo』 - 主語『Yo』に合わせた動詞『beber』の活用形です"
        },
        {
            id: 2,
            type: "truefalse",
            text: "『Ella come pan』は『彼女はパンを食べます』という意味です。",
            correctAnswer: 0,
            explanation: "正解です。『come』は『ella』の動詞『comer』の活用形です"
        },
        {
            id: 3,
            type: "fillblank",
            text: "Mis amigos ________ al cine los viernes. (ir/行く)",
            correctAnswer: "van",
            explanation: "『van』 - 『ellos』（彼ら）の動詞『ir』の活用形です"
        },
        {
            id: 4,
            type: "dragdrop",
            text: "動詞を正しく活用させてください: Yo ________, Tú ________, Nosotros ________ (hablar/話す)",
            parts: [
                { text: "hablo" },
                { text: "hablas" },
                { text: "hablamos" }
            ],
            options: ["hablo", "hablas", "habla", "hablamos", "hablan"],
            explanation: "hablarの活用: yo hablo, tú hablas, él/ella habla, nosotros hablamos, ellos hablan"
        },
        {
            id: 5,
            type: "multiple",
            text: "『私たちは公園で遊びます』の正しいスペイン語は？",
            options: [
                "Nosotros jugamos en el parque",
                "Yo juego en el parque", 
                "Ellos juegan en el parque",
                "Tú juegas en el parque"
            ],
            correctAnswer: 0,
            explanation: "『Nosotros jugamos』 - 主語『nosotros』に合わせた動詞『jugar』の活用形です"
        },
        {
            id: 6,
            type: "truefalse",
            text: "『Vosotros bebéis leche』は『君たちは牛乳を飲みます』という意味です。",
            correctAnswer: 0,
            explanation: "正解です。『bebéis』は『vosotros』の動詞『beber』の活用形です"
        },
        {
            id: 7,
            type: "fillblank",
            text: "Mi hermana ________ temprano todos los días. (dormir/寝る)",
            correctAnswer: "duerme",
            explanation: "『duerme』 - 『ella』の動詞『dormir』の活用形（不規則変化: o→ue）"
        },
        {
            id: 8,
            type: "dragdrop",
            text: "前置詞を入れて完成させてください: ________ la mañana voy ________ escuela ________ autobús.",
            parts: [
                { text: "Por" },
                { text: "a la" },
                { text: "en" }
            ],
            options: ["a", "a la", "de", "en", "Por", "para"],
            explanation: "前置詞: Por (時間帯), a la (方向), en (手段)。『朝、バスで学校へ行く』"
        },
        {
            id: 9,
            type: "multiple",
            text: "『彼らは音楽を聴きます』の正しいスペイン語は？",
            options: [
                "Ellos escuchan música",
                "Ellas escuchan música", 
                "Nosotros escuchamos música",
                "Vosotros escucháis música"
            ],
            correctAnswer: 0,
            explanation: "『Ellos escuchan』 - 男性グループの『ellos』に合わせた動詞『escuchar』の活用形です"
        },
        {
            id: 10,
            type: "truefalse",
            text: "『Tú haces ejercicio』は『君は運動します』という意味です。",
            correctAnswer: 0,
            explanation: "正解です。『haces』は『tú』の動詞『hacer』の活用形です"
        },
        {
            id: 11,
            type: "fillblank",
            text: "________ vienen de México. (they feminine/彼女たち)",
            correctAnswer: "Ellas",
            explanation: "『Ellas』は女性だけのグループを指す代名詞です"
        },
        {
            id: 12,
            type: "dragdrop",
            text: "動詞『ver』を活用させてください: Yo ________, Él ________, Ustedes ________",
            parts: [
                { text: "veo" },
                { text: "ve" },
                { text: "ven" }
            ],
            options: ["veo", "ves", "ve", "vemos", "ven"],
            explanation: "verの活用: yo veo, tú ves, él/ella ve, nosotros vemos, ellos ven"
        },
        {
            id: 13,
            type: "multiple",
            text: "『私は日本語を話します』の正しいスペイン語は？",
            options: [
                "Yo hablo japonés",
                "Tú hablas japonés", 
                "Ella habla japonés",
                "Nosotros hablamos japonés"
            ],
            correctAnswer: 0,
            explanation: "『Yo hablo』 - 主語『yo』に合わせた動詞『hablar』の活用形です"
        },
        {
            id: 14,
            type: "truefalse",
            text: "『Nosotras comemos pizza』は『私たち（女性）はピザを食べます』という意味です。",
            correctAnswer: 0,
            explanation: "正解です。『comemos』は『nosotras』の動詞『comer』の活用形です"
        },
        {
            id: 15,
            type: "fillblank",
            text: "¿________ estudias español conmigo? (you informal/君)",
            correctAnswer: "Tú",
            explanation: "『Tú』は親しい相手への『あなた』を指す代名詞です"
        },
        {
            id: 16,
            type: "dragdrop",
            text: "代名詞と動詞を組み合わせてください: ________ (私/話す), ________ (君/食べる), ________ (彼女/寝る)",
            parts: [
                { text: "Yo hablo" },
                { text: "Tú comes" },
                { text: "Ella duerme" }
            ],
            options: ["Yo hablo", "Tú comes", "Él bebe", "Ella duerme", "Nosotros vamos"],
            explanation: "基本の組み合わせ: Yo hablo, Tú comes, Ella duerme"
        },
        {
            id: 17,
            type: "multiple",
            text: "『あなた（丁寧）はテレビを見ます』の正しいスペイン語は？",
            options: [
                "Usted ve la televisión",
                "Tú ves la televisión", 
                "Él ve la televisión",
                "Ustedes ven la televisión"
            ],
            correctAnswer: 0,
            explanation: "『Usted ve』 - 丁寧な『あなた』に合わせた動詞『ver』の活用形です"
        },
        {
            id: 18,
            type: "truefalse",
            text: "『Vosotras bebéis agua』は女性グループに対して正しい表現です。",
            correctAnswer: 0,
            explanation: "正解です。『bebéis』は『vosotras』の動詞『beber』の活用形です"
        },
        {
            id: 19,
            type: "fillblank",
            text: "Los estudiantes ________ deporte en la escuela. (hacer/する)",
            correctAnswer: "hacen",
            explanation: "『hacen』 - 『ellos』（彼ら）の動詞『hacer』の活用形です"
        },
        {
            id: 20,
            type: "dragdrop",
            text: "前置詞を入れて完成させてください: Este regalo es ________ ti. Lo compré ________ mi madre ________ el dinero.",
            parts: [
                { text: "para" },
                { text: "con" },
                { text: "de" }
            ],
            options: ["a", "de", "en", "por", "para", "con"],
            explanation: "前置詞: para (目的/受け取り手), con (手段), de (起源)。『君への贈り物。母のお金で買った』"
        },
        {
            id: 21,
            type: "multiple",
            text: "『君たち（スペイン）はここに住んでいます』の正しいスペイン語は？",
            options: [
                "Vosotros vivís aquí",
                "Ustedes viven aquí", 
                "Nosotros vivimos aquí",
                "Ellos viven aquí"
            ],
            correctAnswer: 0,
            explanation: "『Vosotros vivís』 - スペインで使われる『君たち』に合わせた動詞『vivir』の活用形です"
        },
        {
            id: 22,
            type: "truefalse",
            text: "『Yo voy a la playa』は『私はビーチへ行きます』という意味です。",
            correctAnswer: 0,
            explanation: "正解です。『voy』は『yo』の動詞『ir』の活用形です"
        },
        {
            id: 23,
            type: "fillblank",
            text: "Mi padre ________ el periódico cada mañana. (leer/読む)",
            correctAnswer: "lee",
            explanation: "『lee』 - 『él』（彼）の動詞『leer』の活用形です"
        },
        {
            id: 24,
            type: "dragdrop",
            text: "動詞『jugar』を活用させてください: Yo ________, Ella ________, Nosotros ________",
            parts: [
                { text: "juego" },
                { text: "juega" },
                { text: "jugamos" }
            ],
            options: ["juego", "juegas", "juega", "jugamos", "juegan"],
            explanation: "jugarの活用（不規則）: yo juego, tú juegas, él/ella juega, nosotros jugamos, ellos juegan"
        },
        {
            id: 25,
            type: "multiple",
            text: "『私たち（女性のみ）は勉強します』の正しいスペイン語は？",
            options: [
                "Nosotras estudiamos",
                "Nosotros estudiamos", 
                "Ellas estudian",
                "Vosotras estudiáis"
            ],
            correctAnswer: 0,
            explanation: "『Nosotras estudiamos』 - 女性グループの『nosotras』に合わせた動詞『estudiar』の活用形です"
        },
        {
            id: 26,
            type: "truefalse",
            text: "『Él viene de Argentina』は『彼はアルゼンチンから来ます』という意味です。",
            correctAnswer: 0,
            explanation: "正解です。『viene』は『él』の動詞『venir』の活用形です"
        },
        {
            id: 27,
            type: "fillblank",
            text: "¿A qué hora ________ ustedes a casa? (volver/戻る)",
            correctAnswer: "vuelven",
            explanation: "『vuelven』 - 『ustedes』の動詞『volver』の活用形（不規則変化: o→ue）"
        },
        {
            id: 28,
            type: "dragdrop",
            text: "文を完成させてください: ________ (私) ________ (行く) ________ (〜へ) cine ________ (〜と) amigos.",
            parts: [
                { text: "Yo" },
                { text: "voy" },
                { text: "al" },
                { text: "con" }
            ],
            options: ["Yo", "Tú", "voy", "vas", "a", "al", "con", "de"],
            explanation: "『Yo voy al cine con amigos.』 - 主語、動詞、前置詞の組み合わせ"
        },
        {
            id: 29,
            type: "multiple",
            text: "『彼女たちはフランス語を話します』の正しいスペイン語は？",
            options: [
                "Ellas hablan francés",
                "Ellos hablan francés", 
                "Nosotras hablamos francés",
                "Ustedes hablan francés"
            ],
            correctAnswer: 0,
            explanation: "『Ellas hablan』 - 女性グループの『ellas』に合わせた動詞『hablar』の活用形です"
        },
        {
            id: 30,
            type: "truefalse",
            text: "『Tú duermes ocho horas』は『君は8時間寝ます』という意味です。",
            correctAnswer: 0,
            explanation: "正解です。『duermes』は『tú』の動詞『dormir』の活用形（不規則変化: o→ue）"
        },
        {
            id: 31,
            type: "multiple",
            text: "『¿Me ves?』の正しい意味はどれですか？",
            options: [
                "私が見えますか？",
                "君が見えますか？", 
                "彼が見えますか？",
                "私たちが見えますか？"
            ],
            correctAnswer: 0,
            explanation: "『Me ves』 - 動詞『ver』（見る）の活用と代名詞の組み合わせ。『ves』は『tú』（君）の活用形で、『me』は『私を』を意味します"
        }
    ]
};

// Variables de estado
let currentQuestionIndex = 0;
let userAnswers = Array(examData.questions.length).fill(null);
let examSubmitted = false;

// Elementos del DOM
const questionContainer = document.getElementById('question-container');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const submitBtn = document.getElementById('submit-btn');
const progressBar = document.getElementById('progress');
const resultsContainer = document.getElementById('results-container');
const scoreElement = document.getElementById('score');
const incorrectQuestionsContainer = document.getElementById('incorrect-questions');

// Función para mostrar la pregunta actual
function displayQuestion() {
    const question = examData.questions[currentQuestionIndex];
    
    let questionHTML = `
        <div class="question-number">問題 ${currentQuestionIndex + 1} / ${examData.questions.length}</div>
        <div class="question-text">${question.text}</div>
    `;
    
    // Renderizar según el tipo de pregunta
    switch(question.type) {
        case "multiple":
            questionHTML += renderMultipleChoice(question);
            break;
        case "truefalse":
            questionHTML += renderTrueFalse(question);
            break;
        case "fillblank":
            questionHTML += renderFillBlank(question);
            break;
        case "dragdrop":
            questionHTML += renderDragDrop(question);
            break;
    }
    
    questionContainer.innerHTML = questionHTML;
    
    // Actualizar barra de progreso
    const progressPercentage = ((currentQuestionIndex + 1) / examData.questions.length) * 100;
    progressBar.style.width = `${progressPercentage}%`;
    
    // Actualizar estado de los botones de navegación
    prevBtn.disabled = currentQuestionIndex === 0;
    nextBtn.disabled = currentQuestionIndex === examData.questions.length - 1;
    
    // Agregar event listeners según el tipo de pregunta
    addEventListeners(question);
}

// Renderizar pregunta de opción múltiple
function renderMultipleChoice(question) {
    return `
        <div class="options-container">
            ${question.options.map((option, index) => `
                <div class="option ${userAnswers[currentQuestionIndex] === index ? 'selected' : ''}" data-index="${index}">
                    ${option}
                </div>
            `).join('')}
        </div>
    `;
}

// Renderizar pregunta verdadero/falso en japonés
function renderTrueFalse(question) {
    const userAnswer = userAnswers[currentQuestionIndex];
    return `
        <div class="truefalse-container">
            <div class="truefalse-option true-option ${userAnswer === 0 ? 'selected' : ''}" data-value="0">
                真 (Verdadero)
            </div>
            <div class="truefalse-option false-option ${userAnswer === 1 ? 'selected' : ''}" data-value="1">
                偽 (Falso)
            </div>
        </div>
    `;
}

// Renderizar pregunta de autocompletar
function renderFillBlank(question) {
    const userAnswer = userAnswers[currentQuestionIndex] || '';
    return `
        <div class="fill-blank-container">
            <div class="fill-blank-text">${question.text.replace('________', '<input type="text" class="blank-input" value="' + userAnswer + '">')}</div>
        </div>
    `;
}

// Renderizar pregunta de arrastrar y soltar
function renderDragDrop(question) {
    const userAnswer = userAnswers[currentQuestionIndex] || Array(question.parts.length).fill(null);
    
    // Crear texto con zonas de drop
    let textWithDropZones = question.text;
    question.parts.forEach((part, index) => {
        const droppedItem = userAnswer[index] !== null ? 
            `<span class="dropped-item" data-index="${index}">${question.options[userAnswer[index]]}</span>` : 
            '';
        textWithDropZones = textWithDropZones.replace('________', 
            `<span class="drop-zone ${userAnswer[index] !== null ? 'filled' : ''}" data-index="${index}">${droppedItem}</span>`);
    });
    
    // Crear elementos arrastrables
    const availableItems = question.options.map((option, index) => {
        const isUsed = userAnswer.includes(index);
        return `<div class="drag-item ${isUsed ? 'used' : ''}" data-index="${index}" draggable="true">${option}</div>`;
    }).join('');
    
    return `
        <div class="drag-drop-container">
            <div class="drag-drop-text">${textWithDropZones}</div>
            <div class="drag-items-container">
                ${availableItems}
            </div>
        </div>
    `;
}

// Agregar event listeners según el tipo de pregunta
function addEventListeners(question) {
    switch(question.type) {
        case "multiple":
            addMultipleChoiceListeners();
            break;
        case "truefalse":
            addTrueFalseListeners();
            break;
        case "fillblank":
            addFillBlankListeners();
            break;
        case "dragdrop":
            addDragDropListeners(question);
            break;
    }
}

// Event listeners para opción múltiple
function addMultipleChoiceListeners() {
    document.querySelectorAll('.option').forEach(option => {
        option.addEventListener('click', () => {
            if (examSubmitted) return;
            
            // Deseleccionar todas las opciones
            document.querySelectorAll('.option').forEach(opt => opt.classList.remove('selected'));
            
            // Seleccionar la opción clickeada
            option.classList.add('selected');
            
            // Guardar la respuesta del usuario
            userAnswers[currentQuestionIndex] = parseInt(option.getAttribute('data-index'));
        });
    });
}

// Event listeners para verdadero/falso
function addTrueFalseListeners() {
    document.querySelectorAll('.truefalse-option').forEach(option => {
        option.addEventListener('click', () => {
            if (examSubmitted) return;
            
            // Deseleccionar todas las opciones
            document.querySelectorAll('.truefalse-option').forEach(opt => opt.classList.remove('selected'));
            
            // Seleccionar la opción clickeada
            option.classList.add('selected');
            
            // Guardar la respuesta del usuario
            userAnswers[currentQuestionIndex] = parseInt(option.getAttribute('data-value'));
        });
    });
}

// Event listeners para autocompletar
function addFillBlankListeners() {
    const input = document.querySelector('.blank-input');
    if (input) {
        input.addEventListener('input', () => {
            if (examSubmitted) return;
            userAnswers[currentQuestionIndex] = input.value;
        });
    }
}

// Event listeners para arrastrar y soltar - CORREGIDO
function addDragDropListeners(question) {
    const dragItems = document.querySelectorAll('.drag-item');
    const dropZones = document.querySelectorAll('.drop-zone');
    
    // Configurar elementos arrastrables
    dragItems.forEach(item => {
        item.addEventListener('dragstart', (e) => dragStart(e, question));
        item.addEventListener('dragend', dragEnd);
    });
    
    // Configurar zonas de destino
    dropZones.forEach(zone => {
        zone.addEventListener('dragover', dragOver);
        zone.addEventListener('dragenter', dragEnter);
        zone.addEventListener('dragleave', dragLeave);
        zone.addEventListener('drop', (e) => drop(e, question));
    });
}

function dragStart(e, question) {
    if (examSubmitted) return;
    
    // Verificar que el target sea un elemento válido
    const target = e.target.closest('.drag-item');
    if (!target) return;
    
    e.dataTransfer.setData('text/plain', target.getAttribute('data-index'));
    setTimeout(() => {
        target.classList.add('dragging');
    }, 0);
}

function dragEnd(e) {
    const target = e.target.closest('.drag-item');
    if (target) {
        target.classList.remove('dragging');
    }
}

function dragOver(e) {
    e.preventDefault();
}

function dragEnter(e) {
    e.preventDefault();
    const target = e.target.closest('.drop-zone');
    if (target) {
        target.classList.add('hover');
    }
}

function dragLeave(e) {
    const target = e.target.closest('.drop-zone');
    if (target) {
        target.classList.remove('hover');
    }
}

function drop(e, question) {
    e.preventDefault();
    const zone = e.target.closest('.drop-zone');
    if (!zone) return;
    
    zone.classList.remove('hover');
    
    const itemIndex = e.dataTransfer.getData('text/plain');
    const zoneIndex = parseInt(zone.getAttribute('data-index'));
    
    // Actualizar respuesta del usuario
    if (!userAnswers[currentQuestionIndex]) {
        userAnswers[currentQuestionIndex] = Array(question.parts.length).fill(null);
    }
    userAnswers[currentQuestionIndex][zoneIndex] = parseInt(itemIndex);
    
    // Actualizar la vista
    displayQuestion();
}

// Navegación entre preguntas
prevBtn.addEventListener('click', () => {
    if (currentQuestionIndex > 0) {
        currentQuestionIndex--;
        displayQuestion();
    }
});

nextBtn.addEventListener('click', () => {
    if (currentQuestionIndex < examData.questions.length - 1) {
        currentQuestionIndex++;
        displayQuestion();
    }
});

// Enviar examen
submitBtn.addEventListener('click', async () => {
    // Verificar que todas las preguntas estén respondidas
    const unanswered = userAnswers.some((answer, index) => {
        const question = examData.questions[index];
        
        if (answer === null) return true;
        
        // Para drag & drop, verificar que todas las partes estén completas
        if (question.type === "dragdrop") {
            return answer.some(part => part === null);
        }
        
        return false;
    });
    
    if (unanswered) {
        alert('すべての質問に答えてから試験を送信してください。'); // Por favor, responde todas las preguntas
        return;
    }
    
    // Calcular resultados
    const results = calculateResults();
    
    // Mostrar resultados
    displayResults(results);
    
    // Enviar a Firebase
    const saveSuccess = await saveResultsToFirestore(results);
    
    if (saveSuccess) {
        examSubmitted = true;
        submitBtn.disabled = true;
        submitBtn.textContent = '試験送信済み';
    }
});

// Calcular resultados
function calculateResults() {
    let correctAnswers = 0;
    const incorrectQuestions = [];
    
    examData.questions.forEach((question, index) => {
        let isCorrect = false;
        const userAnswer = userAnswers[index];
        
        switch(question.type) {
            case "multiple":
            case "truefalse":
                isCorrect = userAnswer === question.correctAnswer;
                break;
            case "fillblank":
                isCorrect = userAnswer && userAnswer.toLowerCase().trim() === question.correctAnswer.toLowerCase().trim();
                break;
            case "dragdrop":
                // NUEVA LÓGICA: Comparar textos directamente
                if (userAnswer && Array.isArray(userAnswer)) {
                    isCorrect = question.parts.every((part, partIndex) => {
                        const userSelectedIndex = userAnswer[partIndex];
                        const userSelectedText = question.options[userSelectedIndex];
                        return userSelectedText === part.text;
                    });
                }
                break;
        }
        
        if (isCorrect) {
            correctAnswers++;
        } else {
            let userAnswerText = "";
            let correctAnswerText = "";
            
            switch(question.type) {
                case "multiple":
                    userAnswerText = question.options[userAnswer] || "No respondida";
                    correctAnswerText = question.options[question.correctAnswer];
                    break;
                case "truefalse":
                    userAnswerText = userAnswer === 0 ? "真 (Verdadero)" : userAnswer === 1 ? "偽 (Falso)" : "No respondida";
                    correctAnswerText = question.correctAnswer === 0 ? "真 (Verdadero)" : "偽 (Falso)";
                    break;
                case "fillblank":
                    userAnswerText = userAnswer || "No respondida";
                    correctAnswerText = question.correctAnswer;
                    break;
                case "dragdrop":
                    // CORREGIDO: Usar la misma lógica que en calculateResults
                    userAnswerText = userAnswer ? userAnswer.map(index => 
                        question.options[index]).join(", ") : "No respondida";
                    correctAnswerText = question.parts.map(part => part.text).join(", ");
                    break;
            }
            
            incorrectQuestions.push({
                question: question.text,
                userAnswer: userAnswerText,
                correctAnswer: correctAnswerText,
                explanation: question.explanation
            });
        }
    });
    
    const score = (correctAnswers / examData.questions.length) * 100;
    
    return {
        score: score.toFixed(2),
        correctAnswers,
        totalQuestions: examData.questions.length,
        incorrectQuestions
    };
}

// Mostrar resultados
function displayResults(results) {
    scoreElement.textContent = `得点: ${results.score}% (${results.correctAnswers} / ${results.totalQuestions} 正解)`;
    
    if (results.incorrectQuestions.length > 0) {
        incorrectQuestionsContainer.innerHTML = `
            <h3>間違えた問題:</h3>
            ${results.incorrectQuestions.map(question => `
                <div class="incorrect-question">
                    <p><strong>問題:</strong> ${question.question}</p>
                    <p><span class="user-answer">あなたの答え:</span> ${question.userAnswer}</p>
                    <p><span class="correct-answer">正解:</span> ${question.correctAnswer}</p>
                    <p><span class="explanation">説明:</span> ${question.explanation}</p>
                </div>
            `).join('')}
        `;
    } else {
        incorrectQuestionsContainer.innerHTML = '<p>おめでとうございます！すべての問題に正解しました。</p>';
    }
    
    resultsContainer.style.display = 'block';
    resultsContainer.scrollIntoView({ behavior: 'smooth' });
}

// Guardar resultados en Firebase - CORREGIDO
async function saveResultsToFirestore(results) {
    try {
        // Mostrar indicador de carga
        questionContainer.innerHTML = `
            <div class="loading">
                <div class="spinner"></div>
                <p>データベースに結果を送信中...</p>
            </div>
        `;
        
        // Preparar datos para Firebase (evitar arrays anidados)
        const firestoreData = {
            examTitle: examData.title,
            score: results.score,
            correctAnswers: results.correctAnswers,
            totalQuestions: examData.questions.length,
            timestamp: serverTimestamp(),
            userAnswers: userAnswers, // Ahora es más simple
            incorrectQuestions: results.incorrectQuestions
        };
        
        // Convertir userAnswers a formato compatible con Firestore
        const formattedUserAnswers = userAnswers.map((answer, index) => {
            const question = examData.questions[index];
            
            if (question.type === "dragdrop" && Array.isArray(answer)) {
                // Para dragdrop, convertir array a objeto
                const dragDropAnswer = {};
                answer.forEach((item, posIndex) => {
                    dragDropAnswer[`pos_${posIndex}`] = item;
                });
                return {
                    type: "dragdrop",
                    value: dragDropAnswer
                };
            } else {
                return {
                    type: question.type,
                    value: answer
                };
            }
        });
        
        firestoreData.userAnswers = formattedUserAnswers;
        firestoreData.incorrectQuestions = results.incorrectQuestions;
        
        const docRef = await addDoc(collection(db, "examResults"), firestoreData);
        
        console.log("Resultados guardados con ID: ", docRef.id);
        
        // Ocultar indicador de carga
        displayQuestion();
        return true;
    } catch (e) {
        console.error("Error al guardar los resultados: ", e);
        
        let errorMessage = "結果の保存中にエラーが発生しました。 ";
        
        if (e.code === 'permission-denied') {
            errorMessage += "権限エラー。Firestoreのルールを確認してください。";
        } else if (e.message.includes('Nested arrays')) {
            errorMessage += "データ形式に問題があります。";
        } else {
            errorMessage += "もう一度お試しください。";
        }
        
        alert(errorMessage);
        
        // Ocultar indicador de carga
        displayQuestion();
        return false;
    }
}

// Inicializar la aplicación
displayQuestion();








