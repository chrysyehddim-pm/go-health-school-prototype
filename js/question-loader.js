(() => {
  const QUESTION_BANK_URL = "data/健康小學堂_題庫_v0.1.xlsx";
  const REQUIRED_COLUMNS = [
    "question_id", "category", "knowledge_point_id", "question",
    "option_a", "option_b", "option_c", "option_d",
    "answer", "hint", "explanation", "takeaway", "source", "review_required"
  ];

  function normalize(value) {
    return String(value ?? "").trim();
  }

  function parseQuestions(rows) {
    if (!rows.length) throw new Error("Excel 題庫沒有資料");

    const columns = Object.keys(rows[0]);
    const missing = REQUIRED_COLUMNS.filter(column => !columns.includes(column));
    if (missing.length) throw new Error(`Excel 缺少欄位：${missing.join(", ")}`);

    const seen = new Set();
    const questions = rows
      .filter(row => normalize(row.question_id))
      .map((row, index) => {
        const id = normalize(row.question_id);
        if (seen.has(id)) throw new Error(`question_id 重複：${id}`);
        seen.add(id);

        const answer = normalize(row.answer).toUpperCase();
        const correctIndex = ["A", "B", "C", "D"].indexOf(answer);
        if (correctIndex < 0) throw new Error(`第 ${index + 2} 列 answer 必須是 A/B/C/D`);

        const options = ["option_a", "option_b", "option_c", "option_d"].map(key => normalize(row[key]));
        if (!normalize(row.question) || options.some(option => !option)) {
          throw new Error(`第 ${index + 2} 列題目或選項不完整`);
        }

        return {
          question_id: id,
          category: normalize(row.category),
          knowledge_point_id: normalize(row.knowledge_point_id),
          question: normalize(row.question),
          options,
          correct_index: correctIndex,
          hint: normalize(row.hint),
          explanation: normalize(row.explanation),
          takeaway: normalize(row.takeaway),
          source: normalize(row.source),
          review_required: normalize(row.review_required).toUpperCase() === "Y"
        };
      });

    if (questions.length < 5) throw new Error("可用題目不足 5 題");
    return questions;
  }

  window.HealthSchoolDataReady = (async () => {
    if (!window.XLSX) throw new Error("Excel 讀取元件載入失敗");

    const response = await fetch(QUESTION_BANK_URL, { cache: "no-store" });
    if (!response.ok) throw new Error(`題庫下載失敗（${response.status}）`);

    const buffer = await response.arrayBuffer();
    const workbook = XLSX.read(buffer, { type: "array" });
    const sheetName = workbook.SheetNames.includes("questions") ? "questions" : workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const rows = XLSX.utils.sheet_to_json(worksheet, { defval: "" });

    window.HEALTH_SCHOOL_QUESTIONS = parseQuestions(rows);
    return window.HEALTH_SCHOOL_QUESTIONS;
  })();
})();
