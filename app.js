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

// Datos del examen (modulares - fácil de cambiar)
const examData = {
    title: "Examen de Conocimientos Generales",
    questions: [
        {
            id: 1,
            text: "¿Cuál es la capital de Francia?",
            options: ["Londres", "Berlín", "París", "Madrid"],
            correctAnswer: 2 // Índice de la respuesta correcta (0-based)
        },
        {
            id: 2,
            text: "¿En qué año llegó el hombre a la luna?",
            options: ["1965", "1969", "1972", "1975"],
            correctAnswer: 1
        },
        {
            id: 3,
            text: "¿Cuál es el río más largo del mundo?",
            options: ["Nilo", "Amazonas", "Misisipi", "Yangtsé"],
            correctAnswer: 1
        },
        {
            id: 4,
            text: "¿Quién escribió 'Cien años de soledad'?",
            options: ["Pablo Neruda", "Gabriel García Márquez", "Mario Vargas Llosa", "Julio Cortázar"],
            correctAnswer: 1
        },
        {
            id: 5,
            text: "¿Cuál es el elemento químico con símbolo 'O'?",
            options: ["Oro", "Osmio", "Oxígeno", "Oganesón"],
            correctAnswer: 2
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
    
    questionContainer.innerHTML = `
        <div class="question-number">Pregunta ${currentQuestionIndex + 1} de ${examData.questions.length}</div>
        <div class="question-text">${question.text}</div>
        <div class="options-container">
            ${question.options.map((option, index) => `
                <div class="option ${userAnswers[currentQuestionIndex] === index ? 'selected' : ''}" data-index="${index}">
                    ${option}
                </div>
            `).join('')}
        </div>
    `;
    
    // Actualizar barra de progreso
    const progressPercentage = ((currentQuestionIndex + 1) / examData.questions.length) * 100;
    progressBar.style.width = `${progressPercentage}%`;
    
    // Actualizar estado de los botones de navegación
    prevBtn.disabled = currentQuestionIndex === 0;
    nextBtn.disabled = currentQuestionIndex === examData.questions.length - 1;
    
    // Agregar event listeners a las opciones
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
    const unanswered = userAnswers.some(answer => answer === null);
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
        if (userAnswers[index] === question.correctAnswer) {
            correctAnswers++;
        } else {
            incorrectQuestions.push({
                question: question.text,
                userAnswer: question.options[userAnswers[index]],
                correctAnswer: question.options[question.correctAnswer]
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
            totalQuestions: results.totalQuestions,
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
        
        // Mostrar mensaje de error más específico
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
