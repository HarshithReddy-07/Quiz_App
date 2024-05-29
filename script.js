  let retakebtn=document.querySelector('#retake')
  retakebtn.addEventListener('click',()=>{
    location.href='index.html';
  })

  document.addEventListener('DOMContentLoaded', () => {
        let currentQuestionIndex = 0;
        let timerInterval;
        let answers = {};
        let questions=[];
        let category=localStorage.getItem('quiz-topic');
        let difficulty=localStorage.getItem('quiz-level-difficulty');

        async function getQuestions(){
            let URL=`https://opentdb.com/api.php?amount=10&category=${category}&difficulty=${difficulty}&type=multiple`;
            let respnse=await fetch(URL);
            let json=await respnse.json();
            let Q=json.results
            Q.forEach((element)=>{
              element.incorrect_answers.splice((element.incorrect_answers.length+1)*Math.random() | 0,0,element.correct_answer)
              questions.push({
                question:element.question,
                options:element.incorrect_answers,
                answer:element.correct_answer
              })
            })
        }
    
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
              submitExam();
            }
          }, 1000);
        }
    
        function loadQuestion(index) {
          const question = questions[index];
          try{
            document.getElementById('question-text').textContent = question.question;
          }catch{
            location.reload();
          }
          const optionsContainer = document.getElementById('options');
          optionsContainer.innerHTML = '';
          question.options.forEach((option) => {
            const optionButton = document.createElement('button');
            optionButton.className = 'list-group-item list-group-item-action option-item';
            optionButton.textContent = option;
            optionButton.addEventListener('click', () => {
              let Question_btn=document.querySelectorAll('.question-btn')[currentQuestionIndex];
              Question_btn.classList.remove('btn-secondary');
              Question_btn.classList.remove('btn-outline-primary');
              Question_btn.classList.add('btn-success');
              answers[index] = option;  
              document.querySelectorAll('.option-item').forEach(btn => btn.classList.remove('active'));
              optionButton.classList.add('active');
            });
            optionsContainer.appendChild(optionButton);
          });
    
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
          let question_btn=document.querySelectorAll('.question-btn')[currentQuestionIndex];
          question_btn.classList.remove('btn-outline-primary');
          question_btn.classList.add('btn-secondary');
          
          document.querySelectorAll('.option-item').forEach((btn) => {if(btn.classList.contains('active')){
            question_btn.classList.add('btn-warning');
          }});
        });
    
        document.getElementById('clear-btn').addEventListener('click', () => {
          delete answers[currentQuestionIndex];
          document.querySelectorAll('.option-item').forEach(btn => btn.classList.remove('active'));
          let question_btn=document.querySelectorAll('.question-btn')[currentQuestionIndex];
          question_btn.classList.remove('btn-success');
          question_btn.classList.remove('btn-warning');
          if(!question_btn.classList.contains('btn-secondary'))
            question_btn.classList.add('btn-outline-primary');

        });
    
        document.getElementById('submit-btn').addEventListener('click', () => {
          if (confirm("Are you sure you want to submit the exam?")) {
            clearInterval(timerInterval);
            submitExam();
          }
        });
    
        function setProgress(correctPercent) {
          const correctCircle = document.querySelectorAll('.progress-ring__circle')[1];
          const incorrectCircle = document.querySelectorAll('.progress-ring__circle')[0];
          const radius = correctCircle.r.baseVal.value;
          const circumference = 2 * Math.PI * radius;
    
          incorrectCircle.style.strokeDasharray = `${circumference}`;
          incorrectCircle.style.strokeDashoffset = `0`;
    
          correctCircle.style.strokeDasharray = `${circumference}`;
          correctCircle.style.strokeDashoffset = `${circumference - (correctPercent / 100) * circumference}`;
        }
    
        function submitExam() {
          document.getElementById('submit-btn').style.display = 'none';
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
        getQuestions();
        setTimeout(()=>{
          setupQuestionGrid();
          startTimer(600, document.getElementById('timer'));
          loadQuestion(currentQuestionIndex);
        },2000);
      });
