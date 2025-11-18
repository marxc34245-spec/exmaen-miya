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
const examData = {
    title: "スペイン語初級テスト", // Examen Básico de Español
    questions: [
        {
            id: 1,
            type: "multiple",
            text: "スペイン語で『私は食べます』は何と言いますか？", // ¿Cómo se dice "Yo como" en español?
            options: [
                "Yo como",
                "Yo bebo", 
                "Yo hablo",
                "Yo duermo"
            ],
            correctAnswer: 0
        },
        {
            id: 2,
            type: "multiple",
            text: "『Ella habla』の意味はどれですか？", // ¿Qué significa "Ella habla"?
            options: [
                "彼女は話します",
                "彼女は食べます", 
                "彼女は寝ます",
                "彼女は遊びます"
            ],
            correctAnswer: 0
        },
        {
            id: 3,
            type: "truefalse",
            text: "『Nosotros jugamos』は『私たちは遊びます』という意味です。", // "Nosotros jugamos" significa "Watashitachi wa asobimasu"
            correctAnswer: 0
        },
        {
            id: 4,
            type: "fillblank",
            text: "スペイン語で『水』は________です。", // La palabra para "agua" en español es ________
            correctAnswer: "agua"
        },
        {
            id: 5,
            type: "dragdrop",
            text: "スペイン語の動詞を正しい意味にドラッグしてください: ________ は『食べる』、________ は『飲む』、________ は『話す』",
            parts: [
                { text: "comer", correctPosition: 0 },
                { text: "beber", correctPosition: 1 },
                { text: "hablar", correctPosition: 2 }
            ],
            options: ["comer", "beber", "hablar", "dormir", "jugar"]
        },
        {
            id: 6,
            type: "multiple",
            text: "『Yo bebo agua』の正しい日本語訳はどれですか？", // ¿Cuál es la traducción correcta al japonés de "Yo bebo agua"?
            options: [
                "私は水を飲みます",
                "私は水を食べます", 
                "私は水を見ます",
                "私は水を聞きます"
            ],
            correctAnswer: 0
        },
        {
            id: 7,
            type: "truefalse",
            text: "スペイン語の『ser』と『estar』は両方とも『です』という意味です。", // "ser" y "estar" en español ambos significan "desu"
            correctAnswer: 1 // Falso - tienen usos diferentes
        },
        {
            id: 8,
            type: "fillblank",
            text: "スペイン語で『寝る』は________です。", // "Dormir" en español es ________
            correctAnswer: "dormir"
        },
        {
            id: 9,
            type: "dragdrop",
            text: "代名詞を正しいスペイン語にドラッグしてください: ________ は『私』、________ は『あなた』、________ は『彼』",
            parts: [
                { text: "yo", correctPosition: 0 },
                { text: "tú", correctPosition: 1 },
                { text: "él", correctPosition: 2 }
            ],
            options: ["yo", "tú", "él", "ella", "nosotros"]
        },
        {
            id: 10,
            type: "multiple",
            text: "『Ellos ven la televisión』の意味は何ですか？", // ¿Qué significa "Ellos ven la televisión"?
            options: [
                "彼らはテレビを見ます",
                "彼らはテレビを聞きます", 
                "彼らはテレビを食べます",
                "彼らはテレビで遊びます"
            ],
            correctAnswer: 0
        },
        {
            id: 11,
            type: "fillblank",
            text: "スペイン語で『聞く』は________です。", // "Escuchar" en español es ________
            correctAnswer: "escuchar"
        },
        {
            id: 12,
            type: "multiple",
            text: "『Gracias』の正しい返事はどれですか？", // ¿Cuál es la respuesta correcta para "Gracias"?
            options: [
                "De nada",
                "Por favor", 
                "Lo siento",
                "Buenos días"
            ],
            correctAnswer: 0
        },
        {
            id: 13,
            type: "truefalse",
            text: "『Buenos días』は夜にも使えます。", // "Buenos días" se puede usar por la noche también
            correctAnswer: 1 // Falso - solo por la mañana
        },
        {
            id: 14,
            type: "dragdrop",
            text: "あいさつを正しいスペイン語にドラッグしてください: ________ は『おはよう』、________ は『こんにちは』、________ は『こんばんは』",
            parts: [
                { text: "Buenos días", correctPosition: 0 },
                { text: "Buenas tardes", correctPosition: 1 },
                { text: "Buenas noches", correctPosition: 2 }
            ],
            options: ["Buenos días", "Buenas tardes", "Buenas noches", "Hola", "Adiós"]
        },
        {
            id: 15,
            type: "multiple",
            text: "スペイン語で『私は日本語を話します』は何と言いますか？", // ¿Cómo se dice "Yo hablo japonés" en español?
            options: [
                "Yo hablo japonés",
                "Yo como japonés", 
                "Yo bebo japonés",
                "Yo veo japonés"
            ],
            correctAnswer: 0
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
        <div class="question-number">Pregunta ${currentQuestionIndex + 1} de ${examData.questions.length}</div>
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

// Renderizar pregunta verdadero/falso
function renderTrueFalse(question) {
    const userAnswer = userAnswers[currentQuestionIndex];
    return `
        <div class="truefalse-container">
            <div class="truefalse-option true-option ${userAnswer === 0 ? 'selected' : ''}" data-value="0">
                Verdadero
            </div>
            <div class="truefalse-option false-option ${userAnswer === 1 ? 'selected' : ''}" data-value="1">
                Falso
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
    input.addEventListener('input', () => {
        if (examSubmitted) return;
        userAnswers[currentQuestionIndex] = input.value;
    });
}

// Event listeners para arrastrar y soltar
function addDragDropListeners(question) {
    const dragItems = document.querySelectorAll('.drag-item');
    const dropZones = document.querySelectorAll('.drop-zone');
    
    // Configurar elementos arrastrables
    dragItems.forEach(item => {
        item.addEventListener('dragstart', dragStart);
        item.addEventListener('dragend', dragEnd);
    });
    
    // Configurar zonas de destino
    dropZones.forEach(zone => {
        zone.addEventListener('dragover', dragOver);
        zone.addEventListener('dragenter', dragEnter);
        zone.addEventListener('dragleave', dragLeave);
        zone.addEventListener('drop', (e) => drop(e, question));
    });
    
    function dragStart(e) {
        if (examSubmitted) return;
        e.dataTransfer.setData('text/plain', e.target.getAttribute('data-index'));
        setTimeout(() => {
            e.target.classList.add('dragging');
        }, 0);
    }
    
    function dragEnd(e) {
        e.target.classList.remove('dragging');
    }
    
    function dragOver(e) {
        e.preventDefault();
    }
    
    function dragEnter(e) {
        e.preventDefault();
        e.target.classList.add('hover');
    }
    
    function dragLeave(e) {
        e.target.classList.remove('hover');
    }
    
    function drop(e, question) {
        e.preventDefault();
        e.target.classList.remove('hover');
        
        const itemIndex = e.dataTransfer.getData('text/plain');
        const zoneIndex = parseInt(e.target.getAttribute('data-index'));
        
        // Actualizar respuesta del usuario
        if (!userAnswers[currentQuestionIndex]) {
            userAnswers[currentQuestionIndex] = Array(question.parts.length).fill(null);
        }
        userAnswers[currentQuestionIndex][zoneIndex] = parseInt(itemIndex);
        
        // Actualizar la vista
        displayQuestion();
    }
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
        alert('Por favor, responde todas las preguntas antes de enviar el examen.');
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
        submitBtn.textContent = 'Examen Enviado';
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
                isCorrect = userAnswer.toLowerCase().trim() === question.correctAnswer.toLowerCase().trim();
                break;
            case "dragdrop":
                isCorrect = question.parts.every((part, partIndex) => {
                    return userAnswer[partIndex] === part.correctPosition;
                });
                break;
        }
        
        if (isCorrect) {
            correctAnswers++;
        } else {
            let userAnswerText = "";
            let correctAnswerText = "";
            
            switch(question.type) {
                case "multiple":
                    userAnswerText = question.options[userAnswer];
                    correctAnswerText = question.options[question.correctAnswer];
                    break;
                case "truefalse":
                    userAnswerText = userAnswer === 0 ? "Verdadero" : "Falso";
                    correctAnswerText = question.correctAnswer === 0 ? "Verdadero" : "Falso";
                    break;
                case "fillblank":
                    userAnswerText = userAnswer;
                    correctAnswerText = question.correctAnswer;
                    break;
                case "dragdrop":
                    userAnswerText = question.parts.map((part, partIndex) => 
                        question.options[userAnswer[partIndex]]).join(", ");
                    correctAnswerText = question.parts.map(part => 
                        question.options[part.correctPosition]).join(", ");
                    break;
            }
            
            incorrectQuestions.push({
                question: question.text,
                userAnswer: userAnswerText,
                correctAnswer: correctAnswerText
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
    scoreElement.textContent = `Puntuación: ${results.score}% (${results.correctAnswers} de ${results.totalQuestions} correctas)`;
    
    if (results.incorrectQuestions.length > 0) {
        incorrectQuestionsContainer.innerHTML = `
            <h3>Preguntas incorrectas:</h3>
            ${results.incorrectQuestions.map(question => `
                <div class="incorrect-question">
                    <p><strong>Pregunta:</strong> ${question.question}</p>
                    <p><span class="user-answer">Tu respuesta:</span> ${question.userAnswer}</p>
                    <p><span class="correct-answer">Respuesta correcta:</span> ${question.correctAnswer}</p>
                </div>
            `).join('')}
        `;
    } else {
        incorrectQuestionsContainer.innerHTML = '<p>¡Felicidades! Has respondido correctamente a todas las preguntas.</p>';
    }
    
    resultsContainer.style.display = 'block';
    resultsContainer.scrollIntoView({ behavior: 'smooth' });
}

// Guardar resultados en Firebase
async function saveResultsToFirestore(results) {
    try {
        // Mostrar indicador de carga
        questionContainer.innerHTML = `
            <div class="loading">
                <div class="spinner"></div>
                <p>Enviando resultados a la base de datos...</p>
            </div>
        `;
        
        const docRef = await addDoc(collection(db, "examResults"), {
            examTitle: examData.title,
            score: results.score,
            correctAnswers: results.correctAnswers,
            totalQuestions: examData.questions.length,
            incorrectQuestions: results.incorrectQuestions,
            userAnswers: userAnswers,
            timestamp: serverTimestamp()
        });
        
        console.log("Resultados guardados con ID: ", docRef.id);
        
        // Ocultar indicador de carga
        displayQuestion();
        return true;
    } catch (e) {
        console.error("Error al guardar los resultados: ", e);
        
        let errorMessage = "Hubo un error al guardar los resultados. ";
        
        if (e.code === 'permission-denied') {
            errorMessage += "Error de permisos. Verifica las reglas de Firestore.";
        } else {
            errorMessage += "Por favor, inténtalo de nuevo.";
        }
        
        alert(errorMessage);
        
        // Ocultar indicador de carga
        displayQuestion();
        return false;
    }
}

// Inicializar la aplicación
displayQuestion();

// Silenciar el error de MediaSession (no afecta la funcionalidad)
if ('mediaSession' in navigator) {
    try {
        navigator.mediaSession.setActionHandler('enterpictureinpicture', null);
    } catch (e) {
        // Ignorar el error
    }
}

