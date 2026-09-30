(function() {
  var container = document.getElementById('mockTestApp');
  if (!container) return;

  var examId = container.dataset.examId;
  var examName = container.dataset.examName;
  var pathPrefix = window.location.pathname.startsWith('/ai-certification-preparation') ? '/ai-certification-preparation' : '';
  var fetchUrl = pathPrefix + '/data/exams/' + encodeURIComponent(examId) + '/mock-pool.json';

  var STORAGE_KEY = examId + '_mock_attempt_v2';
  var TOTAL_TEST_QUESTIONS = Number(container.dataset.questionCount) || 60;
  var TEST_DURATION_MINUTES = Number(container.dataset.durationMinutes) || 120;
  var PASS_PERCENT = Number(container.dataset.practicePassPercent) || 70;

  var domainQuotas = examId === 'cca-f' ? {
    'D1 Agentic Architecture & Orchestration': 16,
    'D2 Tool Design & MCP Integration': 11,
    'D3 Claude Code Configuration & Workflows': 12,
    'D4 Prompt Engineering & Structured Output': 12,
    'D5 Context Management & Reliability': 9
  } : {};

  var allQuestions = [];
  var activeAttempt = null;
  var timerInterval = null;
  var exitWarningDismissed = false;
  var activeResultFilter = 'all';

  function isFullscreen() {
    return !!(document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement || document.msFullscreenElement);
  }

  function requestExamFullscreen() {
    var el = container;
    if (el.requestFullscreen) {
      el.requestFullscreen().catch(function() {});
    } else if (el.webkitRequestFullscreen) {
      el.webkitRequestFullscreen();
    } else if (el.mozRequestFullScreen) {
      el.mozRequestFullScreen();
    } else if (el.msRequestFullscreen) {
      el.msRequestFullscreen();
    }
  }

  function exitExamFullscreen() {
    if (document.exitFullscreen) {
      document.exitFullscreen().catch(function() {});
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
    } else if (document.mozCancelFullScreen) {
      document.mozCancelFullScreen();
    } else if (document.msExitFullscreen) {
      document.msExitFullscreen();
    }
  }

  function toggleExamFullscreen() {
    if (isFullscreen()) {
      exitExamFullscreen();
    } else {
      requestExamFullscreen();
    }
  }

  function setupFullscreenEvents() {
    ['fullscreenchange', 'webkitfullscreenchange', 'mozfullscreenchange', 'MSFullscreenChange'].forEach(function(evt) {
      document.addEventListener(evt, function() {
        var fsBtns = container.querySelectorAll('.btn-fs-toggle');
        fsBtns.forEach(function(b) {
          b.textContent = isFullscreen() ? '⛶ Exit Fullscreen' : '⛶ Fullscreen';
        });

        var banner = document.getElementById('fullscreenWarningBanner');
        if (banner) {
          if (isFullscreen() || exitWarningDismissed) {
            banner.style.display = 'none';
          } else if (activeAttempt && !activeAttempt.submitted) {
            banner.style.display = 'flex';
          }
        }
      });
    });
  }

  function setupKeyboardShortcuts() {
    window.addEventListener('keydown', function(e) {
      var modal = document.getElementById('mockSubmitModal');
      if (modal) {
        if (e.key === 'Escape') {
          closeSubmissionModal();
          e.preventDefault();
        }
        return;
      }

      if (!activeAttempt || activeAttempt.submitted || activeAttempt.reviewMode) return;

      var tag = e.target && e.target.tagName ? e.target.tagName.toLowerCase() : '';
      if (tag === 'input' && e.target.type === 'text') return;
      if (tag === 'textarea') return;

      // Alt+N or ArrowRight -> Next
      if ((e.altKey && (e.key === 'n' || e.key === 'N')) || (!e.altKey && !e.ctrlKey && !e.metaKey && e.key === 'ArrowRight')) {
        var btnNext = document.getElementById('btnNext');
        if (btnNext) {
          btnNext.click();
          e.preventDefault();
        }
      }
      // Alt+P or ArrowLeft -> Previous
      else if ((e.altKey && (e.key === 'p' || e.key === 'P')) || (!e.altKey && !e.ctrlKey && !e.metaKey && e.key === 'ArrowLeft')) {
        var btnPrev = document.getElementById('btnPrev');
        if (btnPrev) {
          btnPrev.click();
          e.preventDefault();
        }
      }
      // Alt+F -> Toggle Flag
      else if (e.altKey && (e.key === 'f' || e.key === 'F')) {
        var btnFlag = document.getElementById('btnToggleFlag');
        if (btnFlag) {
          btnFlag.click();
          e.preventDefault();
        }
      }
      // A, B, C, D or 1, 2, 3, 4 -> Select option
      else if (!e.altKey && !e.ctrlKey && !e.metaKey) {
        var key = e.key.toUpperCase();
        var map = { '1': 'A', '2': 'B', '3': 'C', '4': 'D', 'A': 'A', 'B': 'B', 'C': 'C', 'D': 'D' };
        var optLetter = map[key];
        if (optLetter) {
          var targetRadio = container.querySelector('input[name="mockRadio"][value="' + optLetter + '"]');
          if (targetRadio && !targetRadio.checked) {
            targetRadio.checked = true;
            targetRadio.dispatchEvent(new Event('change'));
          }
        }
      }
    });
  }

  function loadQuestions(url) {
    return fetch(url).then(function(res) {
      if (!res.ok) throw new Error('HTTP ' + res.status);
      return res.json();
    });
  }

  loadQuestions(fetchUrl).then(function(data) {
      if (!Array.isArray(data) || data.length < TOTAL_TEST_QUESTIONS) {
        throw new Error('The published question pool is below the practice-test minimum');
      }
      allQuestions = data;
      setupFullscreenEvents();
      setupKeyboardShortcuts();
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
        if (parsed && parsed.examId === examId && parsed.questions && parsed.questions.length === TOTAL_TEST_QUESTIONS) {
          parsed.flags = parsed.flags || {};
          parsed.reviewMode = !!parsed.reviewMode;
          activeAttempt = parsed;
        }
      } catch (e) {
        sessionStorage.removeItem(STORAGE_KEY);
      }
    }

    if (activeAttempt) {
      if (activeAttempt.submitted) {
        renderResultsView(false);
      } else if (Date.now() >= activeAttempt.deadlineTimestamp) {
        autoSubmitExam();
      } else if (activeAttempt.reviewMode) {
        renderReviewMatrixView(false);
        startTimer();
      } else {
        renderExamView(false);
        startTimer();
      }
    } else {
      renderStartView(false);
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
      examId: examId,
      startedAt: now,
      deadlineTimestamp: now + (TEST_DURATION_MINUTES * 60 * 1000),
      questions: selected,
      answers: {},
      flags: {},
      currentIndex: 0,
      submitted: false,
      submittedAt: null,
      reviewMode: false
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
    var timerEls = container.querySelectorAll('.mockTimer');
    if (!timerEls.length) return;
    var totalSec = Math.max(0, Math.floor(remainingMs / 1000));
    var hrs = Math.floor(totalSec / 3600);
    var mins = Math.floor((totalSec % 3600) / 60);
    var secs = totalSec % 60;

    var formatted = (hrs < 10 ? '0' + hrs : hrs) + ':' +
                    (mins < 10 ? '0' + mins : mins) + ':' +
                    (secs < 10 ? '0' + secs : secs);

    timerEls.forEach(function(el) {
      el.textContent = '⏱ ' + formatted;
      if (totalSec < 300) {
        el.style.color = 'var(--wrong-fg)';
        el.style.fontWeight = 'bold';
      }
    });
  }

  function renderStartView(moveFocus) {
    var html = '';
    html += '<div class="question-card" style="text-align: center; padding: 2.5rem;">';
    html += '  <h2 id="mockViewHeading" tabindex="-1" style="margin-top: 0;">' + escapeHtml(examName) + ' practice test</h2>';
    html += '  <p style="max-width: 680px; margin: 1rem auto; color: var(--muted);">';
    html += '    Experience a realistic, Pearson VUE-style timed proctored exam. Answers, explanations, category domains, and difficulty indicators are concealed during the test.';
    html += '  </p>';
    html += '  <div style="display: flex; justify-content: center; gap: 1.5rem; flex-wrap: wrap; margin: 1.5rem 0;">';
    html += '    <div style="border: 2px solid var(--border); padding: 1rem; border-radius: 4px; min-width: 140px; background: var(--bg);">';
    html += '      <div style="font-size: 1.8rem; font-family: var(--font-heading); font-weight: bold; color: var(--accent);">' + TOTAL_TEST_QUESTIONS + '</div>';
    html += '      <div style="font-size: 0.85rem; color: var(--muted);">Questions</div>';
    html += '    </div>';
    html += '    <div style="border: 2px solid var(--border); padding: 1rem; border-radius: 4px; min-width: 140px; background: var(--bg);">';
    html += '      <div style="font-size: 1.8rem; font-family: var(--font-heading); font-weight: bold; color: var(--accent);">' + TEST_DURATION_MINUTES + 'm</div>';
    html += '      <div style="font-size: 0.85rem; color: var(--muted);">Time Limit</div>';
    html += '    </div>';
    html += '    <div style="border: 2px solid var(--border); padding: 1rem; border-radius: 4px; min-width: 140px; background: var(--bg);">';
    html += '      <div style="font-size: 1.8rem; font-family: var(--font-heading); font-weight: bold; color: var(--accent);">' + PASS_PERCENT + '%</div>';
    html += '      <div style="font-size: 0.85rem; color: var(--muted);">Practice Target</div>';
    html += '    </div>';
    html += '  </div>';

    html += '  <div style="max-width: 580px; margin: 1.25rem auto 1.75rem; text-align: left; background: var(--code-bg); border: 1px solid var(--border); padding: 1rem 1.25rem; border-radius: 3px; font-size: 0.88rem;">';
    html += '    <strong>Proctored Simulation Features:</strong>';
    html += '    <ul style="margin: 0.5rem 0 0 1.2rem; padding: 0;">';
    html += '      <li>Fullscreen proctored view with exit detection banner.</li>';
    html += '      <li>Flag for review button (<code>Alt+F</code>) to mark questions for later review.</li>';
    html += '      <li>Dedicated Pearson VUE Question Review Screen matrix (1–' + TOTAL_TEST_QUESTIONS + ').</li>';
    html += '      <li>Keyboard shortcuts: <code>Alt+N</code> (Next), <code>Alt+P</code> (Previous), <code>A</code>–<code>D</code> (Select option).</li>';
    html += '      <li>Post-exam interactive filters to isolate incorrect and correct answers.</li>';
    html += '    </ul>';
    html += '  </div>';

    html += '  <button id="btnStartExam" class="reveal-btn" style="font-size: 1.1rem; padding: 0.75rem 2.25rem;">Start Proctored Exam ►</button>';
    html += '</div>';

    container.innerHTML = html;
    if (moveFocus) document.getElementById('mockViewHeading').focus();

    document.getElementById('btnStartExam').addEventListener('click', function() {
      createNewAttempt();
      requestExamFullscreen();
      renderExamView(true);
      startTimer();
    });
  }

  function renderExamView(moveFocus) {
    if (activeAttempt.reviewMode) {
      renderReviewMatrixView(moveFocus);
      return;
    }

    var idx = activeAttempt.currentIndex;
    var q = activeAttempt.questions[idx];
    var total = TOTAL_TEST_QUESTIONS;
    var answeredCount = Object.keys(activeAttempt.answers).length;
    var isFlagged = !!(activeAttempt.flags && activeAttempt.flags[q.id]);

    var html = '';

    // Fullscreen Warning Banner
    var showWarning = !isFullscreen() && !exitWarningDismissed;
    html += '<div id="fullscreenWarningBanner" class="fullscreen-warning-banner" style="display: ' + (showWarning ? 'flex' : 'none') + ';">';
    html += '  <div>⚠️ <strong>Exam Notice:</strong> Fullscreen mode is not active. Real certification exams require proctored fullscreen simulation.</div>';
    html += '  <div style="display: flex; gap: 0.5rem; align-items: center;">';
    html += '    <button id="btnBannerReEnterFs" class="btn-fs-toggle" style="background: var(--card);">Re-enter Fullscreen</button>';
    html += '    <button id="btnBannerDismiss" style="background: none; border: none; cursor: pointer; color: var(--wrong-fg); font-weight: bold; font-size: 1.1rem;" title="Dismiss warning">✕</button>';
    html += '  </div>';
    html += '</div>';

    // Sticky Top Proctor Bar
    html += '<div class="proctor-bar">';
    html += '  <div class="proctor-meta">';
    html += '    <strong>Question ' + (idx + 1) + '</strong> of ' + total;
    html += '    <span style="color: var(--muted);">·</span>';
    html += '    <span style="color: var(--muted);">' + answeredCount + ' answered</span>';
    html += '  </div>';

    html += '  <div class="proctor-actions">';
    html += '    <button id="btnToggleFlag" class="btn-flag ' + (isFlagged ? 'flagged' : '') + '" title="Flag question for review (Alt+F)">';
    html += '      <span>' + (isFlagged ? '⚑ Flagged for Review' : '⚐ Flag for Review') + '</span>';
    html += '    </button>';
    html += '    <button id="btnToggleFs" class="btn-fs-toggle" title="Toggle Fullscreen">' + (isFullscreen() ? '⛶ Exit Fullscreen' : '⛶ Fullscreen') + '</button>';
    html += '    <div class="mockTimer" role="timer" aria-live="off" style="font-family: var(--font-heading); font-size: 1.05rem; color: var(--accent); font-weight: bold; min-width: 90px; text-align: center;">⏱ --:--</div>';
    html += '    <button id="btnReviewScreenTop" class="reveal-btn" style="background: var(--code-bg); color: var(--fg); border: 2px solid var(--border); padding: 0.35rem 0.8rem; font-size: 0.85rem;">Review Screen ▤</button>';
    html += '    <button id="btnEndExam" class="reveal-btn" style="background: var(--wrong-border); padding: 0.35rem 0.8rem; font-size: 0.85rem;">End Exam</button>';
    html += '  </div>';
    html += '</div>';

    // Question Card - Strictly ZERO SPOILERS (No domain, no difficulty!)
    html += '<div class="question-card">';
    html += '  <h2 id="mockViewHeading" tabindex="-1" class="question-prompt" style="font-size: 1.1rem; line-height: 1.5; margin-bottom: 1.5rem;">';
    html += '    Question ' + (idx + 1) + '. ' + escapeHtml(q.prompt);
    html += '  </h2>';

    html += '  <div class="options-list">';
    var currentAnswer = activeAttempt.answers[q.id];
    q.options.forEach(function(opt) {
      var optKey = opt.id || opt.key;
      var isChecked = currentAnswer === optKey ? 'checked' : '';
      html += '    <label class="option-label">';
      html += '      <input type="radio" name="mockRadio" value="' + optKey + '" ' + isChecked + '>';
      html += '      <span class="option-letter">' + optKey + '.</span>';
      html += '      <span>' + escapeHtml(opt.text) + '</span>';
      html += '    </label>';
    });
    html += '  </div>';

    // Bottom Navigation Bar
    html += '  <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem; margin-top: 1.75rem; border-top: 1px dashed var(--border); padding-top: 1.25rem;">';
    if (idx > 0) {
      html += '    <button id="btnPrev" class="reveal-btn">◄ Previous [Alt+P]</button>';
    } else {
      html += '    <div></div>';
    }

    html += '    <div style="font-family: var(--font-heading); font-size: 0.85rem; color: var(--muted);">';
    html += '      Progress: ' + Math.round(((idx + 1) / total) * 100) + '% &nbsp;(' + answeredCount + '/' + total + ')';
    html += '    </div>';

    if (idx < total - 1) {
      html += '    <button id="btnNext" class="reveal-btn">Next ► [Alt+N]</button>';
    } else {
      html += '    <button id="btnFinish" class="reveal-btn" style="background: var(--accent); color: var(--accent-contrast);">Review &amp; Submit ▤</button>';
    }

    html += '  </div>';
    html += '</div>';

    container.innerHTML = html;
    if (moveFocus) document.getElementById('mockViewHeading').focus();

    // Re-trigger timer update immediately so timer doesn't display --:--
    var remainingMs = activeAttempt.deadlineTimestamp - Date.now();
    updateTimerDisplay(remainingMs);

    // Banner handlers
    var btnBannerReEnterFs = document.getElementById('btnBannerReEnterFs');
    if (btnBannerReEnterFs) {
      btnBannerReEnterFs.addEventListener('click', function() {
        requestExamFullscreen();
      });
    }
    var btnBannerDismiss = document.getElementById('btnBannerDismiss');
    if (btnBannerDismiss) {
      btnBannerDismiss.addEventListener('click', function() {
        exitWarningDismissed = true;
        var b = document.getElementById('fullscreenWarningBanner');
        if (b) b.style.display = 'none';
      });
    }

    // Toggle Flag
    var btnToggleFlag = document.getElementById('btnToggleFlag');
    if (btnToggleFlag) {
      btnToggleFlag.addEventListener('click', function() {
        activeAttempt.flags = activeAttempt.flags || {};
        activeAttempt.flags[q.id] = !activeAttempt.flags[q.id];
        saveState();
        var flaggedNow = activeAttempt.flags[q.id];
        if (flaggedNow) {
          btnToggleFlag.classList.add('flagged');
          btnToggleFlag.querySelector('span').textContent = '⚑ Flagged for Review';
        } else {
          btnToggleFlag.classList.remove('flagged');
          btnToggleFlag.querySelector('span').textContent = '⚐ Flag for Review';
        }
      });
    }

    // Toggle Fullscreen
    var btnToggleFs = document.getElementById('btnToggleFs');
    if (btnToggleFs) {
      btnToggleFs.addEventListener('click', function() {
        toggleExamFullscreen();
      });
    }

    // Radio change
    container.querySelectorAll('input[name="mockRadio"]').forEach(function(radio) {
      radio.addEventListener('change', function() {
        activeAttempt.answers[q.id] = this.value;
        saveState();
        var answeredNow = Object.keys(activeAttempt.answers).length;
        var metaEl = container.querySelector('.proctor-meta span:last-child');
        if (metaEl) metaEl.textContent = answeredNow + ' answered';
      });
    });

    // Navigation buttons
    var btnPrev = document.getElementById('btnPrev');
    if (btnPrev) {
      btnPrev.addEventListener('click', function() {
        if (activeAttempt.currentIndex > 0) {
          activeAttempt.currentIndex--;
          saveState();
          renderExamView(true);
        }
      });
    }

    var btnNext = document.getElementById('btnNext');
    if (btnNext) {
      btnNext.addEventListener('click', function() {
        if (activeAttempt.currentIndex < total - 1) {
          activeAttempt.currentIndex++;
          saveState();
          renderExamView(true);
        }
      });
    }

    var btnFinish = document.getElementById('btnFinish');
    if (btnFinish) {
      btnFinish.addEventListener('click', function() {
        activeAttempt.reviewMode = true;
        saveState();
        renderReviewMatrixView(true);
      });
    }

    var btnReviewScreenTop = document.getElementById('btnReviewScreenTop');
    if (btnReviewScreenTop) {
      btnReviewScreenTop.addEventListener('click', function() {
        activeAttempt.reviewMode = true;
        saveState();
        renderReviewMatrixView(true);
      });
    }

    document.getElementById('btnEndExam').addEventListener('click', function() {
      showSubmissionModal();
    });
  }

  function renderReviewMatrixView(moveFocus) {
    activeAttempt.reviewMode = true;
    saveState();

    var total = TOTAL_TEST_QUESTIONS;
    var answeredCount = Object.keys(activeAttempt.answers).length;
    var unansweredCount = total - answeredCount;
    var flaggedCount = 0;
    activeAttempt.questions.forEach(function(q) {
      if (activeAttempt.flags && activeAttempt.flags[q.id]) flaggedCount++;
    });

    var html = '';

    // Sticky Top Proctor Bar
    html += '<div class="proctor-bar">';
    html += '  <div class="proctor-meta">';
    html += '    <strong>Exam Review Screen</strong>';
    html += '    <span style="color: var(--muted);">·</span>';
    html += '    <span style="color: var(--muted);">' + answeredCount + ' / ' + total + ' Answered</span>';
    html += '  </div>';

    html += '  <div class="proctor-actions">';
    html += '    <button id="btnToggleFsReview" class="btn-fs-toggle" title="Toggle Fullscreen">' + (isFullscreen() ? '⛶ Exit Fullscreen' : '⛶ Fullscreen') + '</button>';
    html += '    <div class="mockTimer" role="timer" aria-live="off" style="font-family: var(--font-heading); font-size: 1.05rem; color: var(--accent); font-weight: bold; min-width: 90px; text-align: center;">⏱ --:--</div>';
    html += '    <button id="btnReturnToQuestionTop" class="reveal-btn" style="background: var(--code-bg); color: var(--fg); border: 2px solid var(--border); padding: 0.35rem 0.8rem; font-size: 0.85rem;">Return to Question ' + (activeAttempt.currentIndex + 1) + ' ◄</button>';
    html += '    <button id="btnEndExamReview" class="reveal-btn" style="background: var(--wrong-border); padding: 0.35rem 0.8rem; font-size: 0.85rem;">End Exam</button>';
    html += '  </div>';
    html += '</div>';

    // Review Container
    html += '<div class="question-card">';
    html += '  <div class="review-matrix-header">';
    html += '    <div>';
    html += '      <h2 id="mockViewHeading" tabindex="-1" style="margin: 0 0 0.25rem 0;">Question Review Matrix</h2>';
    html += '      <p class="muted" style="margin: 0; font-size: 0.88rem;">Review your answers or flagged questions before final submission. Click any question to open it.</p>';
    html += '    </div>';
    html += '    <div class="review-stats-pills">';
    html += '      <span class="review-pill"><strong>' + answeredCount + '</strong> Answered</span>';
    html += '      <span class="review-pill ' + (unansweredCount > 0 ? 'highlight-unanswered' : '') + '"><strong>' + unansweredCount + '</strong> Unanswered</span>';
    html += '      <span class="review-pill ' + (flaggedCount > 0 ? 'highlight-flagged' : '') + '"><strong>' + flaggedCount + '</strong> Flagged ⚑</span>';
    html += '    </div>';
    html += '  </div>';

    // Review Actions Toolbar
    html += '  <div class="review-actions-bar">';
    html += '    <button id="btnReviewAll" class="filter-btn">Review All Questions (Q1)</button>';
    html += '    <button id="btnReviewIncomplete" class="filter-btn ' + (unansweredCount > 0 ? 'filter-incorrect' : '') + '">Review Incomplete (' + unansweredCount + ')</button>';
    html += '    <button id="btnReviewFlagged" class="filter-btn">Review Flagged (' + flaggedCount + ' ⚑)</button>';
    html += '    <button id="btnReturnToCurrent" class="filter-btn">Return to Question ' + (activeAttempt.currentIndex + 1) + '</button>';
    html += '    <button id="btnSubmitFromReview" class="reveal-btn" style="margin-left: auto; background: var(--correct-border);">Submit Final Exam ✓</button>';
    html += '  </div>';

    // Matrix Quick Chips Grid (1..60)
    html += '  <h3 style="font-size: 0.95rem; margin: 1.5rem 0 0.5rem; color: var(--muted); text-transform: uppercase; letter-spacing: 0.05em;">Quick Jump Matrix:</h3>';
    html += '  <div class="review-matrix-grid">';
    activeAttempt.questions.forEach(function(q, i) {
      var isAns = activeAttempt.answers && !!activeAttempt.answers[q.id];
      var isFlg = activeAttempt.flags && !!activeAttempt.flags[q.id];
      var cls = isAns ? 'answered' : 'unanswered';
      if (isFlg) cls += ' flagged';
      var title = 'Question ' + (i + 1) + ': ' + (isAns ? 'Answered' : 'Unanswered') + (isFlg ? ' (Flagged)' : '');
      html += '    <div class="matrix-chip ' + cls + '" data-index="' + i + '" title="' + title + '" tabindex="0" role="button">';
      html += '      ' + (i + 1);
      html += '    </div>';
    });
    html += '  </div>';

    // Full Detailed Table
    html += '  <h3 style="font-size: 0.95rem; margin: 1.75rem 0 0.5rem; color: var(--muted); text-transform: uppercase; letter-spacing: 0.05em;">Detailed Question List:</h3>';
    html += '  <div class="review-table-wrapper">';
    html += '    <table class="review-table">';
    html += '      <thead><tr><th style="width: 70px;">#</th><th>Status</th><th style="width: 120px;">Flagged</th><th style="width: 140px; text-align: center;">Action</th></tr></thead>';
    html += '      <tbody>';
    activeAttempt.questions.forEach(function(q, i) {
      var userAns = activeAttempt.answers && activeAttempt.answers[q.id];
      var isFlg = activeAttempt.flags && !!activeAttempt.flags[q.id];
      html += '        <tr>';
      html += '          <td><strong>Question ' + (i + 1) + '</strong></td>';
      if (userAns) {
        html += '          <td><span style="color: var(--correct-fg); font-weight: bold;">✓ Answered (' + userAns + ')</span></td>';
      } else {
        html += '          <td><span style="color: var(--wrong-fg); font-weight: bold;">⚠️ Incomplete / Unanswered</span></td>';
      }
      html += '          <td>' + (isFlg ? '<span style="color: #ca8a04; font-weight: bold;">⚑ Flagged</span>' : '<span style="color: var(--muted);">-</span>') + '</td>';
      html += '          <td style="text-align: center;"><button class="filter-btn btn-jump" data-index="' + i + '" style="padding: 0.25rem 0.6rem; min-height: 32px; font-size: 0.8rem;">Open Question</button></td>';
      html += '        </tr>';
    });
    html += '      </tbody>';
    html += '    </table>';
    html += '  </div>';

    html += '</div>';

    container.innerHTML = html;
    if (moveFocus) document.getElementById('mockViewHeading').focus();

    var remainingMs = activeAttempt.deadlineTimestamp - Date.now();
    updateTimerDisplay(remainingMs);

    // Event listeners
    var btnToggleFsReview = document.getElementById('btnToggleFsReview');
    if (btnToggleFsReview) {
      btnToggleFsReview.addEventListener('click', function() {
        toggleExamFullscreen();
      });
    }

    function jumpTo(idx) {
      activeAttempt.reviewMode = false;
      activeAttempt.currentIndex = idx;
      saveState();
      renderExamView(true);
    }

    container.querySelectorAll('.matrix-chip').forEach(function(chip) {
      chip.addEventListener('click', function() {
        var idx = Number(this.dataset.index);
        jumpTo(idx);
      });
      chip.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          var idx = Number(this.dataset.index);
          jumpTo(idx);
        }
      });
    });

    container.querySelectorAll('.btn-jump').forEach(function(btn) {
      btn.addEventListener('click', function() {
        var idx = Number(this.dataset.index);
        jumpTo(idx);
      });
    });

    var btnReturnToQuestionTop = document.getElementById('btnReturnToQuestionTop');
    if (btnReturnToQuestionTop) {
      btnReturnToQuestionTop.addEventListener('click', function() {
        jumpTo(activeAttempt.currentIndex);
      });
    }

    var btnReturnToCurrent = document.getElementById('btnReturnToCurrent');
    if (btnReturnToCurrent) {
      btnReturnToCurrent.addEventListener('click', function() {
        jumpTo(activeAttempt.currentIndex);
      });
    }

    var btnReviewAll = document.getElementById('btnReviewAll');
    if (btnReviewAll) {
      btnReviewAll.addEventListener('click', function() {
        jumpTo(0);
      });
    }

    var btnReviewIncomplete = document.getElementById('btnReviewIncomplete');
    if (btnReviewIncomplete) {
      btnReviewIncomplete.addEventListener('click', function() {
        var firstUnans = -1;
        for (var i = 0; i < total; i++) {
          var q = activeAttempt.questions[i];
          if (!activeAttempt.answers || !activeAttempt.answers[q.id]) {
            firstUnans = i;
            break;
          }
        }
        if (firstUnans >= 0) {
          jumpTo(firstUnans);
        } else {
          alert('All questions have been answered!');
        }
      });
    }

    var btnReviewFlagged = document.getElementById('btnReviewFlagged');
    if (btnReviewFlagged) {
      btnReviewFlagged.addEventListener('click', function() {
        var firstFlagged = -1;
        for (var i = 0; i < total; i++) {
          var q = activeAttempt.questions[i];
          if (activeAttempt.flags && activeAttempt.flags[q.id]) {
            firstFlagged = i;
            break;
          }
        }
        if (firstFlagged >= 0) {
          jumpTo(firstFlagged);
        } else {
          alert('No questions are currently flagged for review.');
        }
      });
    }

    var btnSubmitFromReview = document.getElementById('btnSubmitFromReview');
    if (btnSubmitFromReview) {
      btnSubmitFromReview.addEventListener('click', function() {
        showSubmissionModal();
      });
    }

    var btnEndExamReview = document.getElementById('btnEndExamReview');
    if (btnEndExamReview) {
      btnEndExamReview.addEventListener('click', function() {
        showSubmissionModal();
      });
    }
  }

  function showSubmissionModal() {
    closeSubmissionModal();

    var total = TOTAL_TEST_QUESTIONS;
    var answeredCount = Object.keys(activeAttempt.answers).length;
    var unansweredCount = total - answeredCount;
    var flaggedCount = 0;
    activeAttempt.questions.forEach(function(q) {
      if (activeAttempt.flags && activeAttempt.flags[q.id]) flaggedCount++;
    });

    var modal = document.createElement('div');
    modal.id = 'mockSubmitModal';
    modal.className = 'mock-modal-overlay';
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-modal', 'true');
    modal.setAttribute('aria-labelledby', 'modalTitle');

    var html = '';
    html += '<div class="mock-modal-dialog">';
    html += '  <h3 id="modalTitle" style="margin-top: 0; font-family: var(--font-heading); font-size: 1.25rem;">Confirm Exam Submission</h3>';
    html += '  <p style="color: var(--muted); font-size: 0.9rem; margin-bottom: 1rem;">Are you sure you want to finalize and submit your practice exam?</p>';

    html += '  <div style="background: var(--code-bg); border: 1px solid var(--border); padding: 0.85rem 1rem; border-radius: 3px; font-family: var(--font-heading); font-size: 0.88rem; margin-bottom: 1rem;">';
    html += '    <div>Total Questions: <strong>' + total + '</strong></div>';
    html += '    <div style="color: var(--correct-fg);">Answered: <strong>' + answeredCount + '</strong></div>';
    html += '    <div style="color: ' + (unansweredCount > 0 ? 'var(--wrong-fg)' : 'inherit') + ';">Unanswered: <strong>' + unansweredCount + '</strong></div>';
    html += '    <div style="color: ' + (flaggedCount > 0 ? '#ca8a04' : 'inherit') + ';">Flagged for Review: <strong>' + flaggedCount + '</strong></div>';
    html += '  </div>';

    if (unansweredCount > 0) {
      html += '  <div style="background: var(--wrong-bg); color: var(--wrong-fg); border-left: 4px solid var(--wrong-border); padding: 0.65rem 0.85rem; font-size: 0.85rem; margin-bottom: 1rem;">';
      html += '    ⚠️ <strong>Warning:</strong> You have ' + unansweredCount + ' unanswered question(s). Unanswered questions will receive zero points.';
      html += '  </div>';
    }

    if (flaggedCount > 0) {
      html += '  <div style="background: #fef08a; color: #854d0e; border-left: 4px solid #ca8a04; padding: 0.65rem 0.85rem; font-size: 0.85rem; margin-bottom: 1rem;">';
      html += '    ⚑ <strong>Notice:</strong> You still have ' + flaggedCount + ' question(s) flagged for review.';
      html += '  </div>';
    }

    html += '  <p style="font-size: 0.85rem; color: var(--muted);">Once submitted, answers cannot be altered and your full performance report will be generated.</p>';

    html += '  <div class="mock-modal-actions">';
    html += '    <button id="btnModalCancel" class="reveal-btn" style="background: var(--code-bg); color: var(--fg); border: 2px solid var(--border);">Return to Exam</button>';
    html += '    <button id="btnModalConfirm" class="reveal-btn" style="background: var(--correct-border);">Submit Final Exam ✓</button>';
    html += '  </div>';
    html += '</div>';

    modal.innerHTML = html;
    document.body.appendChild(modal);

    document.getElementById('btnModalCancel').focus();

    document.getElementById('btnModalCancel').addEventListener('click', function() {
      closeSubmissionModal();
    });

    document.getElementById('btnModalConfirm').addEventListener('click', function() {
      closeSubmissionModal();
      submitExam();
    });
  }

  function closeSubmissionModal() {
    var modal = document.getElementById('mockSubmitModal');
    if (modal && modal.parentNode) {
      modal.parentNode.removeChild(modal);
    }
  }

  function autoSubmitExam() {
    closeSubmissionModal();
    if (!activeAttempt.submitted) {
      submitExam();
    }
  }

  function submitExam() {
    if (timerInterval) clearInterval(timerInterval);
    activeAttempt.submitted = true;
    activeAttempt.submittedAt = Date.now();
    activeAttempt.reviewMode = false;
    saveState();
    if (isFullscreen()) {
      exitExamFullscreen();
    }
    renderResultsView(true);
  }

  function renderResultsView(moveFocus) {
    var correctCount = 0;
    var domainStats = {};

    activeAttempt.questions.forEach(function(q) {
      var dom = q.domain || 'Other';
      if (!domainStats[dom]) {
        domainStats[dom] = { total: 0, correct: 0 };
      }
      domainStats[dom].total++;

      var userAns = activeAttempt.answers && activeAttempt.answers[q.id];
      if (userAns === q.correct) {
        correctCount++;
        domainStats[dom].correct++;
      }
    });

    var incorrectCount = TOTAL_TEST_QUESTIONS - correctCount;
    var scorePercent = Math.round((correctCount / TOTAL_TEST_QUESTIONS) * 100);
    var isPassed = scorePercent >= PASS_PERCENT;

    var html = '';
    html += '<div class="question-card" style="border-left: 6px solid ' + (isPassed ? 'var(--correct-border)' : 'var(--wrong-border)') + ';">';
    html += '  <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem;">';
    html += '    <div>';
    html += '      <span class="tag" style="background: ' + (isPassed ? 'var(--correct-border)' : 'var(--wrong-border)') + '; color: #fff;">';
    html += '        ' + (isPassed ? 'PRACTICE PASS' : 'PRACTICE FAIL') + ' (Threshold: ' + PASS_PERCENT + '%)';
    html += '      </span>';
    html += '      <h2 id="mockViewHeading" tabindex="-1" style="margin-top: 0.5rem; margin-bottom: 0.25rem;">Practice score: ' + correctCount + ' / ' + TOTAL_TEST_QUESTIONS + ' (' + scorePercent + '%)</h2>';
    html += '      <p class="muted">Proctored practice simulation result. Official exams may require 720/1000 scaled score.</p>';
    html += '    </div>';
    html += '    <div style="display: flex; gap: 0.75rem; flex-wrap: wrap;">';
    html += '      <button id="btnRetake" class="reveal-btn">Retake Exam ↻</button>';
    html += '      <button id="btnShare" class="reveal-btn" style="background: var(--code-bg); color: var(--fg); border: 2px solid var(--border);">Share Result 📋</button>';
    html += '    </div>';
    html += '  </div>';

    // Domain Breakdown
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

    // Interactive Question Filter Toolbar
    html += '  <h3>Question Review &amp; Analysis</h3>';
    html += '  <p class="muted" style="margin-top: -0.25rem; font-size: 0.9rem;">Filter questions below to review your errors, isolate weak spots, and examine detailed explanations.</p>';
    html += '  <div class="results-filter-toolbar" role="toolbar" aria-label="Question review filter">';
    html += '    <button id="filterAll" class="filter-btn ' + (activeResultFilter === 'all' ? 'active' : '') + '" aria-pressed="' + (activeResultFilter === 'all') + '">';
    html += '      All Questions <span class="filter-badge" style="background: var(--border); color: #fff;">' + TOTAL_TEST_QUESTIONS + '</span>';
    html += '    </button>';
    html += '    <button id="filterIncorrect" class="filter-btn filter-incorrect ' + (activeResultFilter === 'incorrect' ? 'active' : '') + '" aria-pressed="' + (activeResultFilter === 'incorrect') + '">';
    html += '      ✗ Incorrect Only <span class="filter-badge" style="background: var(--wrong-border); color: #fff;">' + incorrectCount + '</span>';
    html += '    </button>';
    html += '    <button id="filterCorrect" class="filter-btn filter-correct ' + (activeResultFilter === 'correct' ? 'active' : '') + '" aria-pressed="' + (activeResultFilter === 'correct') + '">';
    html += '      ✓ Correct Only <span class="filter-badge" style="background: var(--correct-border); color: #fff;">' + correctCount + '</span>';
    html += '    </button>';
    html += '  </div>';

    // Container for dynamic question cards
    html += '  <div id="resultsQuestionsContainer" style="display: flex; flex-direction: column; gap: 1rem;"></div>';
    html += '</div>';

    container.innerHTML = html;
    if (moveFocus) document.getElementById('mockViewHeading').focus();

    renderFilteredResults();

    document.getElementById('filterAll').addEventListener('click', function() {
      activeResultFilter = 'all';
      updateFilterButtons();
      renderFilteredResults();
    });

    document.getElementById('filterIncorrect').addEventListener('click', function() {
      activeResultFilter = 'incorrect';
      updateFilterButtons();
      renderFilteredResults();
    });

    document.getElementById('filterCorrect').addEventListener('click', function() {
      activeResultFilter = 'correct';
      updateFilterButtons();
      renderFilteredResults();
    });

    document.getElementById('btnRetake').addEventListener('click', function() {
      sessionStorage.removeItem(STORAGE_KEY);
      activeAttempt = null;
      renderStartView(true);
    });

    document.getElementById('btnShare').addEventListener('click', function() {
      var text = examName + ' practice test result: ' + correctCount + '/' + TOTAL_TEST_QUESTIONS + ' (' + scorePercent + '%). ' + (isPassed ? 'PASSED' : 'NOT YET PASSED') + '. AI Certification Preparation.';
      if (navigator.clipboard) {
        navigator.clipboard.writeText(text).then(function() {
          alert('Result copied to clipboard:\n\n' + text);
        });
      } else {
        alert(text);
      }
    });
  }

  function updateFilterButtons() {
    var allBtn = document.getElementById('filterAll');
    var incBtn = document.getElementById('filterIncorrect');
    var corBtn = document.getElementById('filterCorrect');
    if (!allBtn || !incBtn || !corBtn) return;

    allBtn.classList.toggle('active', activeResultFilter === 'all');
    allBtn.setAttribute('aria-pressed', activeResultFilter === 'all');

    incBtn.classList.toggle('active', activeResultFilter === 'incorrect');
    incBtn.setAttribute('aria-pressed', activeResultFilter === 'incorrect');

    corBtn.classList.toggle('active', activeResultFilter === 'correct');
    corBtn.setAttribute('aria-pressed', activeResultFilter === 'correct');
  }

  function renderFilteredResults() {
    var listContainer = document.getElementById('resultsQuestionsContainer');
    if (!listContainer) return;

    var filtered = [];
    activeAttempt.questions.forEach(function(q, i) {
      var userAns = activeAttempt.answers && activeAttempt.answers[q.id];
      var isRight = userAns === q.correct;
      if (activeResultFilter === 'all' ||
         (activeResultFilter === 'incorrect' && !isRight) ||
         (activeResultFilter === 'correct' && isRight)) {
        filtered.push({ question: q, index: i, userAns: userAns, isRight: isRight });
      }
    });

    if (filtered.length === 0) {
      if (activeResultFilter === 'incorrect') {
        listContainer.innerHTML = '<div style="padding: 1.5rem; text-align: center; background: var(--code-bg); border: 2px dashed var(--correct-border); border-radius: 4px;">🎉 <strong>Outstanding!</strong> You answered every question correctly in this test.</div>';
      } else {
        listContainer.innerHTML = '<div style="padding: 1.5rem; text-align: center; background: var(--code-bg); border: 1px dashed var(--border); border-radius: 4px;">No questions match this filter.</div>';
      }
      return;
    }

    var html = '';
    filtered.forEach(function(item) {
      var q = item.question;
      var i = item.index;
      var userAns = item.userAns || 'None';
      var isRight = item.isRight;
      var isFlg = activeAttempt.flags && !!activeAttempt.flags[q.id];

      html += '<div style="border: 2px solid ' + (isRight ? 'var(--border)' : 'var(--wrong-border)') + '; padding: 1.25rem; border-radius: 4px; background: var(--bg);">';
      html += '  <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.5rem; font-size: 0.85rem; color: var(--muted); margin-bottom: 0.75rem;">';
      html += '    <span><strong>Q' + (i + 1) + '</strong> of ' + TOTAL_TEST_QUESTIONS + ' &nbsp;·&nbsp; ' + escapeHtml(q.domain) + ' &nbsp;·&nbsp; [' + (q.difficulty || 'intermediate') + ']</span>';
      html += '    <div style="display: flex; gap: 0.5rem; align-items: center;">';
      if (isFlg) {
        html += '      <span style="background: #fef08a; color: #854d0e; padding: 0.1rem 0.4rem; border-radius: 2px; font-weight: bold; font-size: 0.78rem;">⚑ Flagged during test</span>';
      }
      html += '      <span style="font-weight: bold; padding: 0.15rem 0.5rem; border-radius: 2px; color: #fff; background: ' + (isRight ? 'var(--correct-border)' : 'var(--wrong-border)') + ';">' + (isRight ? '✓ Correct' : '✗ Incorrect') + '</span>';
      html += '    </div>';
      html += '  </div>';

      html += '  <div style="font-weight: 600; font-size: 1.02rem; margin-bottom: 0.75rem; line-height: 1.5;">' + escapeHtml(q.prompt) + '</div>';

      html += '  <div style="font-size: 0.92rem; margin-bottom: 0.75rem; padding: 0.6rem 0.8rem; background: var(--code-bg); border-radius: 3px;">';
      html += '    Your answer: <strong style="color: ' + (isRight ? 'var(--correct-fg)' : 'var(--wrong-fg)') + ';">' + userAns + '</strong>';
      html += '    &nbsp;|&nbsp; Correct answer: <strong style="color: var(--correct-fg);">' + q.correct + '</strong>';
      html += '  </div>';

      html += '  <div style="font-size: 0.88rem; color: var(--fg); background: var(--code-bg); border-left: 4px solid var(--accent); padding: 0.75rem 1rem; border-radius: 2px; line-height: 1.55;">';
      html += '    <strong>Explanation:</strong> ' + escapeHtml(q.explanation);
      html += '  </div>';
      html += '</div>';
    });

    listContainer.innerHTML = html;
  }

  function escapeHtml(str) {
    if (!str) return '';
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }
})();
