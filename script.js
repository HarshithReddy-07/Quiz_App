  document.addEventListener('DOMContentLoaded', () => {
        let currentQuestionIndex = 0;
        let checkAlert = 0;
        let timerInterval;
        const answers = {};  // Object to store user's answers
        const questions = [
          {
            question: "Which company developed JavaScript?",
            options: ["Microsoft", "Netscape", "Google", "IBM"],
            answer: "Netscape",
          },
          {
            question: "What does HTML stand for?",
            options: [
              "Hyper Text Markup Language",
              "Home Tool Markup Language",
              "Hyperlinks and Text Markup Language",
              "Hyperlinking Text Marking Language",
            ],
            answer: "Hyper Text Markup Language",
          },
          {
            question: "What does CSS stand for?",
            options: [
              "Control Style Sheets",
              "Cascading Style Sheets",
              "Control Style Script",
              "Cascading Style Script"
            ],
            answer: "Cascading Style Sheets",
          },
        ];
    
        function startTimer(duration, display) {
          let timer = duration, minutes, seconds;
          timerInterval = setInterval(function () {
            minutes = parseInt(timer / 60, 10);
            seconds = parseInt(timer % 60, 10);
    
            minutes = minutes < 10 ? "0" + minutes : minutes;
            seconds = seconds < 10 ? "0" + seconds : seconds;
    
            display.textContent = "Time left: " + minutes + ":" + seconds;
    
            if (--timer < 0) {
              clearInterval(timerInterval);
              alert("Time is up!");
              // Submit the exam
              submitExam();
            }
          }, 1000);
        }
    
        function loadQuestion(index) {
          const question = questions[index];
          document.getElementById('question-text').textContent = question.question;
          const optionsContainer = document.getElementById('options');
          optionsContainer.innerHTML = '';
          question.options.forEach((option, i) => {
            const optionButton = document.createElement('button');
            optionButton.className = 'list-group-item list-group-item-action option-item';
            optionButton.textContent = option;
            optionButton.addEventListener('click', () => {
              answers[index] = option;  // Store the user's answer
              document.querySelectorAll('.option-item').forEach(btn => btn.classList.remove('active'));
              optionButton.classList.add('active');
            });
            optionsContainer.appendChild(optionButton);
          });
    
          // Highlight the selected answer if any
          if (answers[index]) {
            document.querySelectorAll('.option-item').forEach(btn => {
              if (btn.textContent === answers[index]) {
                btn.classList.add('active');
              }
            });
          }
        }
    
        function setupQuestionGrid() {
          const gridContainer = document.getElementById('question-grid');
          questions.forEach((_, i) => {
            const questionButton = document.createElement('button');
            questionButton.className = 'btn btn-outline-primary question-btn';
            questionButton.textContent = i + 1;
            questionButton.addEventListener('click', () => {
              currentQuestionIndex = i;
              loadQuestion(i);
            });
            gridContainer.appendChild(questionButton);
          });
        }
    
        document.getElementById('prev-btn').addEventListener('click', () => {
          if (currentQuestionIndex > 0) {
            currentQuestionIndex--;
            loadQuestion(currentQuestionIndex);
          }
        });
    
        document.getElementById('next-btn').addEventListener('click', () => {
          if (currentQuestionIndex < questions.length - 1) {
            currentQuestionIndex++;
            loadQuestion(currentQuestionIndex);
          }
        });
    
        document.getElementById('mark-btn').addEventListener('click', () => {
          document.querySelectorAll('.question-btn')[currentQuestionIndex].classList.add('btn-warning');
        });
    
        document.getElementById('clear-btn').addEventListener('click', () => {
          delete answers[currentQuestionIndex];
          document.querySelectorAll('.option-item').forEach(btn => btn.classList.remove('active'));
        });
    
        document.getElementById('submit-btn').addEventListener('click', () => {
          if (checkAlert === 0 && confirm("Are you sure you want to submit the exam?")) {
            clearInterval(timerInterval);
            submitExam();
          }
        });
    
        function setProgress(correctPercent) {
          const correctCircle = document.querySelectorAll('.progress-ring__circle')[1];
          const incorrectCircle = document.querySelectorAll('.progress-ring__circle')[0];
          const radius = correctCircle.r.baseVal.value;
          const circumference = 2 * Math.PI * radius;
    
          // Incorrect circle (always full)
          incorrectCircle.style.strokeDasharray = `${circumference}`;
          incorrectCircle.style.strokeDashoffset = `0`;
    
          // Correct circle
          correctCircle.style.strokeDasharray = `${circumference}`;
          correctCircle.style.strokeDashoffset = `${circumference - (correctPercent / 100) * circumference}`;
        }
       
        
          
    
        function submitExam() {
          let score = 0;
          questions.forEach((question, index) => {
            if (answers[index] === question.answer) {
              score++;
            }
          });
          const correctPercent = (score / questions.length) * 100;
          
          document.getElementById('question-area').classList.add('d-none');
          document.getElementById('result-area').classList.remove('d-none');
          document.getElementById('score').textContent = `You scored ${score} out of ${questions.length}`;
          setProgress(correctPercent);
        }
    
        setupQuestionGrid();
        startTimer(600, document.getElementById('timer'));
        loadQuestion(currentQuestionIndex);
      });
