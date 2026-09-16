window.HealthSchoolService = (() => {
  const STORAGE_KEY = "go_health_school_session_v1";
  const LAST_SET_KEY = "go_health_school_last_question_ids_v1";
  const RESULT_KEY = "go_health_school_result_v1";
  const SESSION_SIZE = 5;

  function shuffle(items) {
    const copy = [...items];
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  }

  function createSession() {
    const all = window.HEALTH_SCHOOL_QUESTIONS || [];
    if (all.length < SESSION_SIZE) throw new Error("題庫不足 5 題");

    const lastIds = JSON.parse(localStorage.getItem(LAST_SET_KEY) || "[]");
    const freshPool = all.filter(q => !lastIds.includes(q.question_id));
    const candidatePool = freshPool.length >= SESSION_SIZE ? freshPool : all;
    const questions = shuffle(candidatePool).slice(0, SESSION_SIZE);

    const session = {
      session_id: `demo-${Date.now()}`,
      current_index: 0,
      answers: {},
      question_ids: questions.map(q => q.question_id),
      started_at: new Date().toISOString(),
      completed_at: null,
      status: "in_progress"
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
    return session;
  }

  function getSession() {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  }

  function saveSession(session) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
  }

  function getQuestionById(id) {
    return (window.HEALTH_SCHOOL_QUESTIONS || []).find(q => q.question_id === id);
  }

  function getCurrentQuestion(session) {
    return getQuestionById(session.question_ids[session.current_index]);
  }

  function submitAnswer(session, questionId, selectedIndex) {
    const question = getQuestionById(questionId);
    if (!question) throw new Error("找不到題目");

    if (!session.answers[questionId]) {
      session.answers[questionId] = { attempts: [], completed: false };
    }
    session.answers[questionId].attempts.push(selectedIndex);

    const isCorrect = selectedIndex === question.correct_index;
    if (isCorrect) session.answers[questionId].completed = true;
    saveSession(session);

    return {
      is_correct: isCorrect,
      hint: isCorrect ? null : question.hint,
      question
    };
  }

  function advance(session) {
    if (session.current_index < session.question_ids.length - 1) {
      session.current_index += 1;
      saveSession(session);
      return { done: false };
    }

    session.status = "completed";
    session.completed_at = new Date().toISOString();
    saveSession(session);
    const result = buildResult(session);
    localStorage.setItem(RESULT_KEY, JSON.stringify(result));
    localStorage.setItem(LAST_SET_KEY, JSON.stringify(session.question_ids));
    return { done: true, result };
  }

  function buildResult(session) {
    return {
      session_id: session.session_id,
      completed_at: session.completed_at,
      questions: session.question_ids.map(id => {
        const q = getQuestionById(id);
        return {
          question_id: q.question_id,
          category: q.category,
          question: q.question,
          correct_answer_text: q.options[q.correct_index],
          takeaway: q.takeaway,
          explanation: q.explanation
        };
      })
    };
  }

  function getResult() {
    const raw = localStorage.getItem(RESULT_KEY);
    return raw ? JSON.parse(raw) : null;
  }

  function clearActiveSession() {
    localStorage.removeItem(STORAGE_KEY);
  }

  return {
    SESSION_SIZE,
    createSession,
    getSession,
    saveSession,
    getCurrentQuestion,
    submitAnswer,
    advance,
    getResult,
    clearActiveSession
  };
})();
