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
    title: "スペイン語初級テスト",
    questions: [
        {
            id: 1,
            type: "multiple",
            text: "スペイン語で『私は食べます』は何と言いますか？",
            options: [
                "Yo como",
                "Yo bebo", 
                "Yo hablo",
                "Yo duermo"
            ],
            correctAnswer: 0,
            explanation: "『Yo como』は『私は食べます』という意味です。『comer』は『食べる』という動詞です。"
        },
        {
            id: 2,
            type: "multiple",
            text: "『Ella habla』の意味はどれですか？",
            options: [
                "彼女は話します",
                "彼女は食べます", 
                "彼女は寝ます",
                "彼女は遊びます"
            ],
            correctAnswer: 0,
            explanation: "『hablar』は『話す』という動詞です。『Ella』は『彼女』を意味します。"
        },
        {
            id: 3,
            type: "truefalse",
            text: "『Nosotros jugamos』は『私たちは遊びます』という意味です。",
            correctAnswer: 0,
            explanation: "正解です！『jugar』は『遊ぶ』、『Nosotros』は『私たち』という意味です。"
        },
        {
            id: 4,
            type: "fillblank",
            text: "スペイン語で『水』は________です。",
            correctAnswer: "agua",
            explanation: "『agua』はスペイン語で『水』を意味します。女性名詞ですが、定冠詞は『el agua』のように男性形を使います。"
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
            options: ["comer", "beber", "hablar", "dormir", "jugar"],
            explanation: "基本動詞の確認: comer(食べる), beber(飲む), hablar(話す), dormir(寝る), jugar(遊ぶ)"
        },
        {
            id: 6,
            type: "multiple",
            text: "『Yo bebo agua』の正しい日本語訳はどれですか？",
            options: [
                "私は水を飲みます",
                "私は水を食べます", 
                "私は水を見ます",
                "私は水を聞きます"
            ],
            correctAnswer: 0,
            explanation: "『beber』は『飲む』、『agua』は『水』を意味します。英語の『drink』に相当します。"
        },
        {
            id: 7,
            type: "truefalse",
            text: "スペイン語の『ser』と『estar』は両方とも『です』という意味です。",
            correctAnswer: 1,
            explanation: "『ser』は永続的な特性（国籍、職業など）、『estar』は一時的な状態（場所、感情など）に使います。日本語の『です』とは使い方が異なります。"
        },
        {
            id: 8,
            type: "fillblank",
            text: "スペイン語で『寝る』は________です。",
            correctAnswer: "dormir",
            explanation: "『dormir』は『寝る』という意味の動詞です。不規則動詞で、『yo duermo』（私は寝ます）のように変化します。"
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
            options: ["yo", "tú", "él", "ella", "nosotros"],
            explanation: "主語代名詞: yo(私), tú(君/あなた), él(彼), ella(彼女), nosotros(私たち)"
        },
        {
            id: 10,
            type: "multiple",
            text: "『Ellos ven la televisión』の意味は何ですか？",
            options: [
                "彼らはテレビを見ます",
                "彼らはテレビを聞きます", 
                "彼らはテレビを食べます",
                "彼らはテレビで遊びます"
            ],
            correctAnswer: 0,
            explanation: "『ver』は『見る』、『la televisión』は『テレビ』を意味します。『Ellos』は『彼ら』（男性）です。"
        },
        {
            id: 11,
            type: "fillblank",
            text: "スペイン語で『聞く』は________です。",
            correctAnswer: "escuchar",
            explanation: "『escuchar』は『聞く、聴く』という意味です。『oír』も『聞く』ですが、『escuchar』は注意して聞くニュアンスがあります。"
        },
        {
            id: 12,
            type: "multiple",
            text: "『Gracias』の正しい返事はどれですか？",
            options: [
                "De nada",
                "Por favor", 
                "Lo siento",
                "Buenos días"
            ],
            correctAnswer: 0,
            explanation: "『Gracias』（ありがとう）に対する返事は『De nada』（どういたしまして）です。"
        },
        {
            id: 13,
            type: "truefalse",
            text: "『Buenos días』は夜にも使えます。",
            correctAnswer: 1,
            explanation: "『Buenos días』は朝（〜正午頃まで）に使う挨拶です。昼は『Buenas tardes』、夜は『Buenas noches』を使います。"
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
            options: ["Buenos días", "Buenas tardes", "Buenas noches", "Hola", "Adiós"],
            explanation: "時間帯による挨拶: Buenos días(おはよう), Buenas tardes(こんにちは), Buenas noches(こんばんは)"
        },
        {
            id: 15,
            type: "multiple",
            text: "スペイン語で『私は日本語を話します』は何と言いますか？",
            options: [
                "Yo hablo japonés",
                "Yo como japonés", 
                "Yo bebo japonés",
                "Yo veo japonés"
            ],
            correctAnswer: 0,
            explanation: "『hablar』は『話す』、『japonés』は『日本語』を意味します。言語を話す場合は『hablar + 言語名』を使います。"
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
// Renderizar pregunta verdadero/falso en japonés
function renderTrueFalse(question) {
    const userAnswer = userAnswers[currentQuestionIndex];
    return `
        <div class="truefalse-container">
            <div class="truefalse-option true-option ${userAnswer === 0 ? 'selected' : ''}" data-value="0">
                真
            </div>
            <div class="truefalse-option false-option ${userAnswer === 1 ? 'selected' : ''}" data-value="1">
                偽
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
                correctAnswer: correctAnswerText,
                explanation: question.explanation // ← Agregamos la explicación aquí
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
                    <p><span class="explanation">Explicación:</span> ${question.explanation}</p>
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



