(function() {
  var container = document.getElementById('mockTestApp');
  if (!container) return;

  var pathPrefix = window.location.pathname.startsWith('/ai-certification-preparation')
    ? '/ai-certification-preparation'
    : (window.location.pathname.startsWith('/ccaf-exam') ? '/ccaf-exam' : '');
  var fetchUrl = pathPrefix + '/data/questions/cca-f/questions.json';

  var STORAGE_KEY = 'ccaf_mock_attempt_v1';
  var TOTAL_TEST_QUESTIONS = 60;
  var TEST_DURATION_MINUTES = 120;
  var PASS_PERCENT = 72;

  var domainQuotas = {
    'D1 Agentic Architecture & Orchestration': 16,
    'D2 Tool Design & MCP Integration': 11,
    'D3 Claude Code Configuration & Workflows': 12,
    'D4 Prompt Engineering & Structured Output': 12,
    'D5 Context Management & Reliability': 9
  };

  var allQuestions = [];
  var activeAttempt = null;
  var timerInterval = null;

  function loadQuestions(url) {
    return fetch(url).then(function(res) {
      if (!res.ok) throw new Error('HTTP ' + res.status);
      return res.json();
    });
  }

  loadQuestions(fetchUrl)
    .catch(function() {
      // Fallback relative url
      return loadQuestions('/data/questions/cca-f/questions.json');
    })
    .catch(function() {
      return loadQuestions('../../../data/questions/cca-f/questions.json');
    })
    .then(function(data) {
      allQuestions = data;
      initApp();
    })
    .catch(function(err) {
      container.innerHTML = '<p style="color: var(--wrong-fg); padding: 1rem; border: 2px solid var(--wrong-border);">Failed to load mock exam data (' + err.message + '). Check static path.</p>';
    });

  function initApp() {
    var saved = sessionStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        var parsed = JSON.parse(saved);
        if (parsed && parsed.examId === 'cca-f' && parsed.questions && parsed.questions.length === TOTAL_TEST_QUESTIONS) {
          activeAttempt = parsed;
        }
      } catch (e) {
        sessionStorage.removeItem(STORAGE_KEY);
      }
    }

    if (activeAttempt) {
      if (activeAttempt.submitted) {
        renderResultsView();
      } else if (Date.now() >= activeAttempt.deadlineTimestamp) {
        autoSubmitExam();
      } else {
        renderExamView();
        startTimer();
      }
    } else {
      renderStartView();
    }
  }

  function shuffle(array) {
    var arr = array.slice();
    for (var i = arr.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var temp = arr[i];
      arr[i] = arr[j];
      arr[j] = temp;
    }
    return arr;
  }

  function createNewAttempt() {
    var selected = [];

    Object.keys(domainQuotas).forEach(function(dom) {
      var quota = domainQuotas[dom];
      var pool = allQuestions.filter(function(q) {
        return q.domain && q.domain.startsWith(dom.slice(0, 2));
      });
      var shuffledPool = shuffle(pool);
      selected = selected.concat(shuffledPool.slice(0, quota));
    });

    if (selected.length < TOTAL_TEST_QUESTIONS) {
      var remaining = allQuestions.filter(function(q) {
        return !selected.some(function(s) { return s.id === q.id; });
      });
      var extraNeeded = TOTAL_TEST_QUESTIONS - selected.length;
      selected = selected.concat(shuffle(remaining).slice(0, extraNeeded));
    }

    selected = shuffle(selected);

    var now = Date.now();
    activeAttempt = {
      attemptId: 'att_' + now + '_' + Math.floor(Math.random() * 1000),
      examId: 'cca-f',
      startedAt: now,
      deadlineTimestamp: now + (TEST_DURATION_MINUTES * 60 * 1000),
      questions: selected,
      answers: {},
      currentIndex: 0,
      submitted: false,
      submittedAt: null
    };

    saveState();
  }

  function saveState() {
    if (activeAttempt) {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(activeAttempt));
    }
  }

  function startTimer() {
    if (timerInterval) clearInterval(timerInterval);
    timerInterval = setInterval(function() {
      if (!activeAttempt || activeAttempt.submitted) {
        clearInterval(timerInterval);
        return;
      }
      var remainingMs = activeAttempt.deadlineTimestamp - Date.now();
      if (remainingMs <= 0) {
        clearInterval(timerInterval);
        autoSubmitExam();
      } else {
        updateTimerDisplay(remainingMs);
      }
    }, 1000);
  }

  function updateTimerDisplay(remainingMs) {
    var timerEl = document.getElementById('mockTimer');
    if (!timerEl) return;
    var totalSec = Math.floor(remainingMs / 1000);
    var hrs = Math.floor(totalSec / 3600);
    var mins = Math.floor((totalSec % 3600) / 60);
    var secs = totalSec % 60;

    var formatted = (hrs < 10 ? '0' + hrs : hrs) + ':' +
                    (mins < 10 ? '0' + mins : mins) + ':' +
                    (secs < 10 ? '0' + secs : secs);

    timerEl.textContent = '⏱ TIME LEFT: ' + formatted;
    if (totalSec < 300) {
      timerEl.style.color = 'var(--wrong-fg)';
      timerEl.style.fontWeight = 'bold';
    }
  }

  function renderStartView() {
    var html = '';
    html += '<div class="question-card" style="text-align: center; padding: 2.5rem;">';
    html += '  <h2 style="margin-top: 0;">CCAF Practice Mock Exam (60Q / 120M)</h2>';
    html += '  <p style="max-width: 650px; margin: 1rem auto; color: var(--muted);">';
    html += '    This simulated practice exam draws 60 scenario-based questions balanced by official CCAF domain weights. Answers and explanations are hidden during the test.';
    html += '  </p>';
    html += '  <div style="display: flex; justify-content: center; gap: 1.5rem; flex-wrap: wrap; margin: 1.5rem 0;">';
    html += '    <div style="border: 2px solid var(--border); padding: 1rem; border-radius: 4px; min-width: 140px; background: var(--bg);">';
    html += '      <div style="font-size: 1.8rem; font-family: var(--font-heading); font-weight: bold; color: var(--accent);">60</div>';
    html += '      <div style="font-size: 0.85rem; color: var(--muted);">Questions</div>';
    html += '    </div>';
    html += '    <div style="border: 2px solid var(--border); padding: 1rem; border-radius: 4px; min-width: 140px; background: var(--bg);">';
    html += '      <div style="font-size: 1.8rem; font-family: var(--font-heading); font-weight: bold; color: var(--accent);">120m</div>';
    html += '      <div style="font-size: 0.85rem; color: var(--muted);">Time Limit</div>';
    html += '    </div>';
    html += '    <div style="border: 2px solid var(--border); padding: 1rem; border-radius: 4px; min-width: 140px; background: var(--bg);">';
    html += '      <div style="font-size: 1.8rem; font-family: var(--font-heading); font-weight: bold; color: var(--accent);">72%</div>';
    html += '      <div style="font-size: 0.85rem; color: var(--muted);">Pass Mark</div>';
    html += '    </div>';
    html += '  </div>';
    html += '  <button id="btnStartExam" class="reveal-btn" style="font-size: 1.1rem; padding: 0.75rem 2rem;">Start Mock Exam ►</button>';
    html += '</div>';

    container.innerHTML = html;

    document.getElementById('btnStartExam').addEventListener('click', function() {
      createNewAttempt();
      renderExamView();
      startTimer();
    });
  }

  function renderExamView() {
    var idx = activeAttempt.currentIndex;
    var q = activeAttempt.questions[idx];
    var total = TOTAL_TEST_QUESTIONS;
    var answeredCount = Object.keys(activeAttempt.answers).length;

    var html = '';
    html += '<div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem; background: var(--card); border: 2px solid var(--border); padding: 0.75rem 1.25rem; border-radius: 4px; margin-bottom: 1.5rem;">';
    html += '  <div style="font-family: var(--font-heading); font-size: 0.9rem;">';
    html += '    <strong>Question ' + (idx + 1) + '</strong> of ' + total + ' &nbsp;·&nbsp; <span class="muted">' + answeredCount + ' answered</span>';
    html += '  </div>';
    html += '  <div id="mockTimer" style="font-family: var(--font-heading); font-size: 1.05rem; color: var(--accent); font-weight: bold;">⏱ TIME LEFT: 120:00</div>';
    html += '  <button id="btnEndExam" class="reveal-btn" style="background: var(--wrong-border); padding: 0.35rem 0.8rem; font-size: 0.85rem;">End Exam</button>';
    html += '</div>';

    html += '<div class="question-card">';
    html += '  <div class="question-header">';
    html += '    <span class="question-domain">' + escapeHtml(q.domain) + '</span>';
    html += '    <span>[' + (q.difficulty || 'intermediate') + ']</span>';
    html += '  </div>';
    html += '  <div class="question-prompt">' + (idx + 1) + '. ' + escapeHtml(q.prompt) + '</div>';
    html += '  <div class="options-list">';

    var currentAnswer = activeAttempt.answers[q.id];
    q.options.forEach(function(opt) {
      var isChecked = currentAnswer === opt.id ? 'checked' : '';
      html += '    <label class="option-label">';
      html += '      <input type="radio" name="mockRadio" value="' + opt.id + '" ' + isChecked + '>';
      html += '      <span class="option-letter">' + opt.id + '.</span>';
      html += '      <span>' + escapeHtml(opt.text) + '</span>';
      html += '    </label>';
    });

    html += '  </div>';

    html += '  <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem; margin-top: 1.5rem; border-top: 1px dashed var(--border); padding-top: 1rem;">';
    if (idx > 0) {
      html += '    <button id="btnPrev" class="reveal-btn">◄ Previous</button>';
    } else {
      html += '    <div></div>';
    }

    html += '    <div style="font-family: var(--font-heading); font-size: 0.85rem; color: var(--muted);">';
    html += '      Progress: ' + Math.round(((idx + 1) / total) * 100) + '%';
    html += '    </div>';

    if (idx < total - 1) {
      html += '    <button id="btnNext" class="reveal-btn">Next ►</button>';
    } else {
      html += '    <button id="btnFinish" class="reveal-btn" style="background: var(--correct-border);">Submit Exam ✓</button>';
    }

    html += '  </div>';
    html += '</div>';

    container.innerHTML = html;

    container.querySelectorAll('input[name="mockRadio"]').forEach(function(radio) {
      radio.addEventListener('change', function() {
        activeAttempt.answers[q.id] = this.value;
        saveState();
      });
    });

    var btnPrev = document.getElementById('btnPrev');
    if (btnPrev) {
      btnPrev.addEventListener('click', function() {
        if (activeAttempt.currentIndex > 0) {
          activeAttempt.currentIndex--;
          saveState();
          renderExamView();
        }
      });
    }

    var btnNext = document.getElementById('btnNext');
    if (btnNext) {
      btnNext.addEventListener('click', function() {
        if (activeAttempt.currentIndex < total - 1) {
          activeAttempt.currentIndex++;
          saveState();
          renderExamView();
        }
      });
    }

    var btnFinish = document.getElementById('btnFinish');
    if (btnFinish) {
      btnFinish.addEventListener('click', function() {
        confirmAndSubmit();
      });
    }

    document.getElementById('btnEndExam').addEventListener('click', function() {
      confirmAndSubmit();
    });
  }

  function confirmAndSubmit() {
    var answeredCount = Object.keys(activeAttempt.answers).length;
    var unanswered = TOTAL_TEST_QUESTIONS - answeredCount;
    var msg = 'Submit Mock Exam now?';
    if (unanswered > 0) {
      msg = 'You have ' + unanswered + ' unanswered question(s). Submit Mock Exam now?';
    }

    if (confirm(msg)) {
      submitExam();
    }
  }

  function autoSubmitExam() {
    if (!activeAttempt.submitted) {
      submitExam();
    }
  }

  function submitExam() {
    if (timerInterval) clearInterval(timerInterval);
    activeAttempt.submitted = true;
    activeAttempt.submittedAt = Date.now();
    saveState();
    renderResultsView();
  }

  function renderResultsView() {
    var correctCount = 0;
    var domainStats = {};

    activeAttempt.questions.forEach(function(q) {
      var dom = q.domain || 'Other';
      if (!domainStats[dom]) {
        domainStats[dom] = { total: 0, correct: 0 };
      }
      domainStats[dom].total++;

      var userAns = activeAttempt.answers[q.id];
      if (userAns === q.correct) {
        correctCount++;
        domainStats[dom].correct++;
      }
    });

    var scorePercent = Math.round((correctCount / TOTAL_TEST_QUESTIONS) * 100);
    var isPassed = scorePercent >= PASS_PERCENT;

    var html = '';
    html += '<div class="question-card" style="border-left: 6px solid ' + (isPassed ? 'var(--correct-border)' : 'var(--wrong-border)') + ';">';
    html += '  <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem;">';
    html += '    <div>';
    html += '      <span class="tag" style="background: ' + (isPassed ? 'var(--correct-border)' : 'var(--wrong-border)') + '; color: #fff;">';
    html += '        ' + (isPassed ? 'PRACTICE PASS' : 'PRACTICE FAIL') + ' (Threshold: ' + PASS_PERCENT + '%)';
    html += '      </span>';
    html += '      <h2 style="margin-top: 0.5rem; margin-bottom: 0.25rem;">Exam Score: ' + correctCount + ' / ' + TOTAL_TEST_QUESTIONS + ' (' + scorePercent + '%)</h2>';
    html += '      <p class="muted">Practice estimate. Scaled score passing mark is 720/1000.</p>';
    html += '    </div>';
    html += '    <div style="display: flex; gap: 0.75rem;">';
    html += '      <button id="btnRetake" class="reveal-btn">Retake Exam ↻</button>';
    html += '      <button id="btnShare" class="reveal-btn" style="background: var(--code-bg); color: var(--fg); border: 2px solid var(--border);">Share Result 📋</button>';
    html += '    </div>';
    html += '  </div>';

    html += '  <h3>Domain Breakdown</h3>';
    html += '  <table>';
    html += '    <thead><tr><th>Domain</th><th>Questions</th><th>Correct</th><th>Score</th></tr></thead>';
    html += '    <tbody>';
    Object.keys(domainStats).forEach(function(dom) {
      var st = domainStats[dom];
      var pct = Math.round((st.correct / st.total) * 100);
      html += '      <tr>';
      html += '        <td>' + escapeHtml(dom) + '</td>';
      html += '        <td>' + st.total + '</td>';
      html += '        <td>' + st.correct + '</td>';
      html += '        <td><strong style="color: ' + (pct >= 70 ? 'var(--correct-fg)' : 'var(--wrong-fg)') + ';">' + pct + '%</strong></td>';
      html += '      </tr>';
    });
    html += '    </tbody>';
    html += '  </table>';

    html += '  <h3>Question Review</h3>';
    html += '  <div style="display: flex; flex-direction: column; gap: 1rem;">';
    activeAttempt.questions.forEach(function(q, i) {
      var userAns = activeAttempt.answers[q.id] || 'None';
      var isRight = userAns === q.correct;
      html += '    <div style="border: 1px solid var(--border); padding: 1rem; border-radius: 4px; background: var(--bg);">';
      html += '      <div style="display: flex; justify-content: space-between; font-size: 0.85rem; color: var(--muted); margin-bottom: 0.5rem;">';
      html += '        <span>Q' + (i + 1) + ' · ' + escapeHtml(q.domain) + '</span>';
      html += '        <span style="font-weight: bold; color: ' + (isRight ? 'var(--correct-fg)' : 'var(--wrong-fg)') + ';">' + (isRight ? '[Correct]' : '[Incorrect]') + '</span>';
      html += '      </div>';
      html += '      <div style="font-weight: 600; margin-bottom: 0.5rem;">' + escapeHtml(q.prompt) + '</div>';
      html += '      <div style="font-size: 0.9rem; margin-bottom: 0.5rem;">';
      html += '        Your answer: <strong>' + userAns + '</strong> &nbsp;|&nbsp; Correct answer: <strong style="color: var(--correct-fg);">' + q.correct + '</strong>';
      html += '      </div>';
      html += '      <div style="font-size: 0.85rem; color: var(--muted); background: var(--code-bg); padding: 0.5rem; border-radius: 3px;">';
      html += '        <strong>Rationale:</strong> ' + escapeHtml(q.explanation);
      html += '      </div>';
      html += '    </div>';
    });
    html += '  </div>';

    html += '</div>';

    container.innerHTML = html;

    document.getElementById('btnRetake').addEventListener('click', function() {
      sessionStorage.removeItem(STORAGE_KEY);
      activeAttempt = null;
      renderStartView();
    });

    document.getElementById('btnShare').addEventListener('click', function() {
      var text = 'CCAF Practice Mock Test Result: ' + correctCount + '/60 (' + scorePercent + '%) - ' + (isPassed ? 'PASSED' : 'FAILED') + '. Practice offline at AI Cert Prep.';
      if (navigator.clipboard) {
        navigator.clipboard.writeText(text).then(function() {
          alert('Result copied to clipboard:\n\n' + text);
        });
      } else {
        alert(text);
      }
    });
  }

  function escapeHtml(str) {
    if (!str) return '';
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }
})();
