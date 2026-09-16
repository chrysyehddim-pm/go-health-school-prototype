(() => {
  const service = window.HealthSchoolService;
  const result = service.getResult();
  const resultContent = document.getElementById("result-content");
  const emptyState = document.getElementById("empty-state");
  const reviewList = document.getElementById("review-list");
  const topicList = document.getElementById("topic-list");
  const retryBtn = document.getElementById("retry-btn");
  const homeBtn = document.getElementById("home-btn");
  const emptyHomeBtn = document.getElementById("empty-home-btn");

  if (!result || !Array.isArray(result.questions) || result.questions.length === 0) {
    resultContent.hidden = true;
    emptyState.hidden = false;
  } else {
    result.questions.forEach((item, index) => {
      const article = document.createElement("article");
      article.className = "review-item";
      article.innerHTML = `
        <div class="review-index">${String(index + 1).padStart(2, "0")}</div>
        <h3>${item.question}</h3>
        <div class="correct-answer">✓ 正確答案：${item.correct_answer_text}</div>
        <p class="review-takeaway">${item.takeaway}</p>
        <details>
          <summary>查看完整解題</summary>
          <p>${item.explanation}</p>
        </details>
      `;
      reviewList.appendChild(article);
    });

    [...new Set(result.questions.map(q => q.category))].forEach(category => {
      const chip = document.createElement("span");
      chip.className = "topic-chip";
      chip.textContent = category;
      topicList.appendChild(chip);
    });
  }

  retryBtn?.addEventListener("click", () => {
    service.clearActiveSession();
    service.createSession();
    window.location.href = "index.html?resume=1";
  });

  homeBtn?.addEventListener("click", () => {
    service.clearActiveSession();
    window.location.href = "index.html";
  });

  emptyHomeBtn?.addEventListener("click", () => {
    service.clearActiveSession();
    window.location.href = "index.html";
  });
})();
