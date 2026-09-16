(() => {
  const service = window.HealthSchoolService;
  const introScreen = document.getElementById("intro-screen");
  const quizScreen = document.getElementById("quiz-screen");
  const startBtn = document.getElementById("start-btn");
  const quitBtn = document.getElementById("quit-btn");
  const nextBtn = document.getElementById("next-btn");
  const optionsEl = document.getElementById("options");
  const hintBox = document.getElementById("hint-box");
  const hintText = document.getElementById("hint-text");
  const answerCard = document.getElementById("answer-card");
  const questionText = document.getElementById("question-text");
  const questionNumber = document.getElementById("question-number");
  const progressText = document.getElementById("progress-text");
  const progressBar = document.getElementById("progress-bar");
  const categoryText = document.getElementById("category-text");
  const explanationBody = document.getElementById("explanation-body");
  const takeawayText = document.getElementById("takeaway-text");

  let session = null;
  let locked = false;

  function showQuiz() {
    introScreen.classList.remove("active");
    quizScreen.classList.add("active");
  }

  function showIntro() {
    quizScreen.classList.remove("active");
    introScreen.classList.add("active");
  }

  function beginOrResume() {
    const existing = service.getSession();
    if (existing && existing.status === "in_progress" && existing.question_ids?.length === service.SESSION_SIZE) {
      session = existing;
    } else {
      session = service.createSession();
    }
    showQuiz();
    renderQuestion();
  }

  function renderQuestion() {
    locked = false;
    hintBox.hidden = true;
    answerCard.hidden = true;
    optionsEl.innerHTML = "";

    const q = service.getCurrentQuestion(session);
    const index = session.current_index;
    questionText.textContent = q.question;
    questionNumber.textContent = `第 ${index + 1} 題`;
    progressText.textContent = `${index + 1} / ${service.SESSION_SIZE}`;
    progressBar.style.width = `${((index + 1) / service.SESSION_SIZE) * 100}%`;
    categoryText.textContent = q.category;

    const answerState = session.answers[q.question_id] || { attempts: [] };
    q.options.forEach((label, optionIndex) => {
      const btn = document.createElement("button");
      btn.className = "option-btn";
      btn.type = "button";
      const prefix = String.fromCharCode(65 + optionIndex);
      btn.innerHTML = `<span class="option-prefix">${prefix}</span>${label}`;

      if (answerState.attempts.includes(optionIndex) && optionIndex !== q.correct_index) {
        btn.classList.add("wrong");
        btn.disabled = true;
      }

      btn.addEventListener("click", () => handleAnswer(btn, optionIndex));
      optionsEl.appendChild(btn);
    });

    if (answerState.attempts.some(i => i !== q.correct_index)) {
      hintText.textContent = q.hint;
      hintBox.hidden = false;
    }
  }

  function handleAnswer(button, selectedIndex) {
    if (locked) return;
    const q = service.getCurrentQuestion(session);
    const result = service.submitAnswer(session, q.question_id, selectedIndex);

    if (!result.is_correct) {
      button.classList.add("wrong");
      button.disabled = true;
      hintText.textContent = result.hint;
      hintBox.hidden = false;
      return;
    }

    locked = true;
    button.classList.add("correct");
    Array.from(optionsEl.querySelectorAll("button")).forEach(btn => { btn.disabled = true; });
    hintBox.hidden = true;
    explanationBody.textContent = q.explanation;
    takeawayText.textContent = q.takeaway;
    nextBtn.textContent = session.current_index === service.SESSION_SIZE - 1 ? "查看今日回顧" : "下一題";
    answerCard.hidden = false;
    answerCard.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }

  function goNext() {
    const outcome = service.advance(session);
    if (outcome.done) {
      window.location.href = "result.html";
      return;
    }
    renderQuestion();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  startBtn.addEventListener("click", beginOrResume);
  nextBtn.addEventListener("click", goNext);
  quitBtn.addEventListener("click", () => {
    if (confirm("要先回到開始頁嗎？這次作答進度會保留在這台裝置。")) showIntro();
  });

  const existing = service.getSession();
  const query = new URLSearchParams(window.location.search);
  if (existing && existing.status === "in_progress" && existing.question_ids?.length === service.SESSION_SIZE) {
    session = existing;
    startBtn.textContent = "繼續上次挑戰";
    if (query.get("resume") === "1") beginOrResume();
  }
})();
