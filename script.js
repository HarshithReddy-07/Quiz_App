<script>
    document.addEventListener('DOMContentLoaded', () => {
      let currentQuestionIndex = 0;
      let checkAlert = 0;
      let timerInterval;
      const answers = {};  // Object to store user's answers
      const questions = {
        html: {
          easy: [
            {
              question: "What does HTML stand for?",
              options: ["Hyper Text Markup Language", "Home Tool Markup Language", "Hyperlinks and Text Markup Language", "Hyperlinking Text Marking Language"],
              answer: "Hyper Text Markup Language"
            },
            {
              question: "Which HTML tag is used to define an unordered list?",
              options: ["<ul>", "<ol>", "<li>", "<list>"],
              answer: "<ul>"
            },
            {
              question: "Which HTML tag is used to create a hyperlink?",
              options: ["<a>", "<link>", "<href>", "<hyperlink>"],
              answer: "<a>"
            }
          ],
          medium: [
            {
              question: "How do you create a table in HTML?",
              options: ["<table>", "<tbl>", "<tab>", "<tble>"],
              answer: "<table>"
            },
            {
              question: "Which attribute is used to provide an alternative text for an image, if the image cannot be displayed?",
              options: ["title", "alt", "src", "href"],
              answer: "alt"
            },
            {
              question: "What is the correct HTML element for playing video files?",
              options: ["<video>", "<media>", "<movie>", "<file>"],
              answer: "<video>"
            }
          ],
          hard: [
            {
              question: "How do you specify a header cell in an HTML table?",
              options: ["<td>", "<th>", "<header>", "<hcell>"],
              answer: "<th>"
            },
            {
              question: "What is the correct HTML element to define important text?",
              options: ["<strong>", "<important>", "<b>", "<em>"],
              answer: "<strong>"
            },
            {
              question: "Which HTML element is used to define navigation links?",
              options: ["<nav>", "<navigation>", "<navigate>", "<menu>"],
              answer: "<nav>"
            }
          ]
        },
        css: {
          easy: [
            {
              question: "What does CSS stand for?",
              options: ["Control Style Sheets", "Cascading Style Sheets", "Control Style Script", "Cascading Style Script"],
              answer: "Cascading Style Sheets"
            },
            {
              question: "Which HTML tag is used to define an internal style sheet?",
              options: ["<style>", "<css>", "<script>", "<link>"],
              answer: "<style>"
            },
            {
              question: "How do you change the text color of an element in CSS?",
              options: ["color", "text-color", "font-color", "background-color"],
              answer: "color"
            }
          ],
          medium: [
            {
              question: "Which CSS property controls the text size?",
              options: ["font-style", "text-size", "font-size", "text-style"],
              answer: "font-size"
            },
            {
              question: "How do you make each word in a text start with a capital letter?",
              options: ["text-transform:capitalize", "text-style:capitalize", "transform:capitalize", "text-capitalize"],
              answer: "text-transform:capitalize"
            },
            {
              question: "How do you select an element with id \"header\" in CSS?",
              options: ["#header", ".header", "header", "*header"],
              answer: "#header"
            }
          ],
          hard: [
            {
              question: "Which CSS property is used to change the background color?",
              options: ["color", "background-color", "bgcolor", "background"],
              answer: "background-color"
            },
            {
              question: "What is the correct syntax for a CSS comment?",
              options: ["// comment", "/* comment */", "<!-- comment -->", "/* comment -->"],
              answer: "/* comment */"
            },
            {
              question: "Which CSS property is used to change the font of an element?",
              options: ["font-style", "font-family", "font-weight", "font"],
              answer: "font-family"
            }
          ]
        },
        java: {
          easy: [
            {
              question: "Which company developed Java?",
              options: ["Sun Microsystems", "Microsoft", "Google", "IBM"],
              answer: "Sun Microsystems"
            },
            {
              question: "Which keyword is used to define a class in Java?",
              options: ["class", "Class", "define", "struct"],
              answer: "class"
            },
            {
              question: "Which method is the entry point of a Java program?",
              options: ["main", "start", "init", "run"],
              answer: "main"
            }
          ],
          medium: [
            {
              question: "Which keyword is used to inherit a class in Java?",
              options: ["extend", "extends", "inherit", "inherits"],
              answer: "extends"
            },
            {
              question: "How do you declare a constant variable in Java?",
              options: ["const", "final", "static", "constant"],
              answer: "final"
            },
            {
              question: "Which of the following is not a primitive data type in Java?",
              options: ["int", "float", "boolean", "string"],
              answer: "string"
            }
          ],
          hard: [
            {
              question: "What is the default value of a boolean variable in Java?",
              options: ["true", "false", "0", "null"],
              answer: "false"
            },
            {
              question: "Which exception is thrown when a division by zero occurs in Java?",
              options: ["NullPointerException", "ArithmeticException", "ArrayIndexOutOfBoundsException", "NumberFormatException"],
              answer: "ArithmeticException"
            },
            {
              question: "Which method in Java is used to get the length of a string?",
              options: ["length()", "size()", "getSize()", "getLength()"],
              answer: "length()"
            },
            {
              question: "What is the output of 10 + 20 + \"30\" in Java?",
              options: ["1030", "3030", "102030", "60"],
              answer: "3030"
            }
          ]
        }
      };
  
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
  
      function loadQuestion(index, selectedQuestions) {
        const question = selectedQuestions[index];
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
  
      function setupQuestionGrid(selectedQuestions) {
        const gridContainer = document.getElementById('question-grid');
        gridContainer.innerHTML = '';
        selectedQuestions.forEach((_, i) => {
          const questionButton = document.createElement('button');
          questionButton.className = 'btn btn-outline-primary question-btn';
          questionButton.textContent = i + 1;
          questionButton.addEventListener('click', () => {
            currentQuestionIndex = i;
            loadQuestion(i, selectedQuestions);
          });
          gridContainer.appendChild(questionButton);
        });
      }
  
      document.getElementById('prev-btn').addEventListener('click', () => {
        if (currentQuestionIndex > 0) {
          currentQuestionIndex--;
          loadQuestion(currentQuestionIndex, selectedQuestions);
        }
      });
  
      document.getElementById('next-btn').addEventListener('click', () => {
        if (currentQuestionIndex < selectedQuestions.length - 1) {
          currentQuestionIndex++;
          loadQuestion(currentQuestionIndex, selectedQuestions);
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
        selectedQuestions.forEach((question, index) => {
          if (answers[index] === question.answer) {
            score++;
          }
        });
        const correctPercent = (score / selectedQuestions.length) * 100;
        
        document.getElementById('question-area').classList.add('d-none');
        document.getElementById('result-area').classList.remove('d-none');
        document.getElementById('score').textContent = `You scored ${score} out of ${selectedQuestions.length}`;
        setProgress(correctPercent);
        document.getElementById('selection-area').classList.remove('d-none');
        document.getElementById('submit-btn').classList.add('d-none');
      }
  
      let selectedQuestions = [];
  
      document.getElementById('confirm-btn').addEventListener('click', () => {
        const selectedTopic = document.getElementById('topic').value;
        const selectedLevel = document.getElementById('level').value;
  
        selectedQuestions = questions[selectedTopic][selectedLevel];
  
        if (selectedQuestions.length > 0) {
          document.getElementById('selection-area').classList.add('d-none');
          document.getElementById('question-area').classList.remove('d-none');
          document.getElementById('submit-btn').classList.remove('d-none');
  
          setupQuestionGrid(selectedQuestions);
          loadQuestion(currentQuestionIndex, selectedQuestions);
          startTimer(600, document.getElementById('timer'));
        } else {
          alert("No questions available for the selected topic and level.");
        }
      });
  
    });
