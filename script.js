let retakebtn=document.querySelector('#retake')
retakebtn.addEventListener('click',()=>{
  location.href='index.html';
})

document.addEventListener('DOMContentLoaded', () => {
  const spinner = document.getElementById('spinner');
  let currentQuestionIndex = 0;
  let previousQuestionIndex =-1;
  let prev_btn=document.getElementById('prev-btn');
  let next_btn=document.getElementById('next-btn');
  let timerInterval;
  let answers = {};
  let questions=[];
  let category=localStorage.getItem('quiz-topic');
  let difficulty=localStorage.getItem('quiz-level-difficulty');
  prev_btn.style.display='none';
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
        submitQuiz();
      }
    }, 1000);
  }

  function loader(){
    spinner.style.display = 'block';
    setTimeout(()=>{
      spinner.style.display = 'none';
    }
    ,2000);
  }
  
  function loadQuestion(index) {
      const question = questions[index];
      try{
        document.getElementById('question-text').innerHTML = question.question;
        document.querySelectorAll('.question-btn')[index].style.borderRadius = '50%';
        if(previousQuestionIndex>=0){
          document.querySelectorAll('.question-btn')[previousQuestionIndex].style.borderRadius = '0px';  
        }
        previousQuestionIndex=index;
      }catch{
        location.reload();
      }
      let b=document.getElementById('time-end').classList.contains('d-none');
      const optionsContainer = document.getElementById('options');
      optionsContainer.innerHTML = '';
      question.options.forEach((option) => {
        const optionButton = document.createElement('button');
        optionButton.className = 'list-group-item list-group-item-action option-item';
        optionButton.innerHTML = option;
        optionButton.disabled = b;
        if(b && option==question.answer){
          optionButton.classList.add('answer');
          optionButton.classList.add('fw-bold');
        }
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
        if (btn.innerHTML === answers[index]) {
          btn.classList.add('active');
          if (b && answers[index]!=question.answer){
            btn.classList.add('wrong');
            btn.classList.add('fw-bold');
          }
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
        checkButtonNecessity();
        loadQuestion(i);
      });
      gridContainer.appendChild(questionButton);
    });
  }

  function checkButtonNecessity(){
    if (currentQuestionIndex==0) prev_btn.style.display='none';
    else prev_btn.style.display='inline-block';
    if (currentQuestionIndex==9) next_btn.style.display='none';
    else next_btn.style.display='inline-block';
  }

  document.getElementById('prev-btn').addEventListener('click', () => {
    if (currentQuestionIndex > 0) {
      currentQuestionIndex--;
      loadQuestion(currentQuestionIndex);
    }checkButtonNecessity();
  });

  document.getElementById('next-btn').addEventListener('click', () => {
    if (currentQuestionIndex < questions.length - 1) {
      currentQuestionIndex++;
      loadQuestion(currentQuestionIndex);
    }checkButtonNecessity();
  });

  // keyboard Events for previous,next
  document.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowRight') {
      document.getElementById('next-btn').dispatchEvent(new Event('click'));
    }
    if(event.key === 'ArrowLeft') {
      document.getElementById('prev-btn').dispatchEvent(new Event('click'));
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
    if (confirm("Are you sure you want to submit the Quiz?")) {
      clearInterval(timerInterval);
      submitQuiz();
    }
  });

  function submitQuiz() {
    document.getElementById('submit-btn').style.display = 'none';
    let correct = 0;
    let incorrect=0;
    let Unanswered =0;
    questions.forEach((question, index) => {
      let question_btn=document.querySelectorAll('.question-btn')[index];
      if (answers[index] === question.answer) {
        correct++;
        if (question_btn.classList.contains('btn-warning')){
          question_btn.classList.remove('btn-warning');
          question_btn.classList.add('btn-success');
        }
      }
      else if (answers[index] === undefined) Unanswered++;
      else {
        incorrect++;
        if(question_btn.classList.contains('btn-success') || question_btn.classList.contains('btn-warning')){ 
          question_btn.classList.remove('btn-success');
          question_btn.classList.remove('btn-warning');
          question_btn.classList.add('btn-danger');
        }
      }
    });

    document.getElementById('question-controls').classList.add('d-none');
    document.getElementById('web-title').classList.remove('text-sm-start');
    document.getElementById('time-end').classList.add('d-none');
    document.querySelectorAll('.question-btn')[0].dispatchEvent(new Event('click'));
    document.getElementById('result-area').classList.remove('d-none');
    createChart([correct,incorrect,Unanswered])
  }
  function createChart(results) {
    let resultChart = document.querySelector('.result-chart');
    resultData={
      lables:['Correct','Incorrect','Unanswered'],
      data:results
    }
    new Chart(resultChart,{
      type : "doughnut",
      lables:resultData.lables,
      data:{
        labels:resultData.lables,
        datasets:[{
          label:"count",
          data:resultData.data,
          backgroundColor: [ 'rgb(103, 225, 99)', 'rgb(255, 99, 132)','rgb(203, 201, 204)'],
        }]
      },
      options:{borderWidth:4, plugins:{ legend:{display:false},}}
    })
    ul=document.querySelector('.result-details ul');
    ['Correct','Incorrect','Unanswered'].forEach((l,i)=>{
      li=document.createElement('li');
      li.classList.add('lead');
      li.innerText=`${l} : ${results[i]}`
      ul.appendChild(li);
    })
  }

  loader();
  getQuestions();
  setTimeout(()=>{
    setupQuestionGrid();
    startTimer(600, document.getElementById('timer'));
    loadQuestion(currentQuestionIndex);
  },2000);

});

