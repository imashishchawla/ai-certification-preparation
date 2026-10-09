(function() {
  var container = document.getElementById('questionsContainer');
  var filterContainer = document.getElementById('domainFilters');
  var paginationContainer = document.getElementById('paginationContainer');
  if (!container) return;
  var statusEl = document.getElementById('practiceStatus');
  var examId = container.dataset.examId || 'cca-f';
  var customDataUrl = container.dataset.src;
  var hideFilters = container.dataset.hideFilters === 'true';

  var allQuestions = [];
  var activeDomain = 'All';
  var activeDifficulty = 'All';
  var activeSort = 'oldest'; // 'oldest' (Old to New) | 'newest' (New to Old)
  var currentPage = 1;
  var pageSize = Number(container.dataset.pageSize) || 50;

  var pathPrefix = window.location.pathname.startsWith('/ai-certification-preparation') ? '/ai-certification-preparation' : '';
  var primaryUrl = customDataUrl ? (pathPrefix + customDataUrl) : (pathPrefix + '/data/exams/' + encodeURIComponent(examId) + '/questions.json');

  // Read initial query params from window.location
  function readParamsFromUrl() {
    var params = new URLSearchParams(window.location.search);
    var pDomain = params.get('domain');
    if (pDomain) activeDomain = pDomain;
    var pDiff = params.get('difficulty');
    if (pDiff) activeDifficulty = pDiff;
    var pSort = params.get('sort');
    if (pSort === 'newest' || pSort === 'oldest') activeSort = pSort;
    var pPage = parseInt(params.get('page'), 10);
    if (!isNaN(pPage) && pPage >= 1) currentPage = pPage;
  }

  // Update browser URL query string without reloading
  function updateUrlParams(targetQuestionId) {
    var params = new URLSearchParams(window.location.search);

    if (activeDomain && activeDomain !== 'All') {
      params.set('domain', activeDomain);
    } else {
      params.delete('domain');
    }

    if (activeDifficulty && activeDifficulty !== 'All') {
      params.set('difficulty', activeDifficulty);
    } else {
      params.delete('difficulty');
    }

    if (activeSort && activeSort !== 'oldest') {
      params.set('sort', activeSort);
    } else {
      params.delete('sort');
    }

    if (currentPage > 1) {
      params.set('page', currentPage);
    } else {
      params.delete('page');
    }

    if (targetQuestionId) {
      params.set('question', targetQuestionId);
    } else {
      params.delete('question');
    }

    var newQuery = params.toString();
    var newUrl = window.location.pathname + (newQuery ? '?' + newQuery : '') + window.location.hash;
    window.history.replaceState({ path: newUrl }, '', newUrl);
  }

  function loadData(url) {
    return fetch(url).then(function(res) {
      if (!res.ok) throw new Error('HTTP ' + res.status);
      return res.json();
    });
  }

  // Graceful fallback chain across GitHub Pages, subpaths, and local dev
  loadData(primaryUrl)
    .catch(function() {
      if (customDataUrl) return loadData(customDataUrl);
      return loadData('/ai-certification-preparation/data/exams/' + encodeURIComponent(examId) + '/questions.json');
    })
    .catch(function() {
      if (customDataUrl) return loadData('/data' + customDataUrl);
      return loadData('/data/exams/' + encodeURIComponent(examId) + '/questions.json');
    })
    .catch(function() {
      if (customDataUrl) return loadData('../..' + customDataUrl);
      return loadData('../../data/exams/' + encodeURIComponent(examId) + '/questions.json');
    })
    .then(function(data) {
      if (!Array.isArray(data) || data.length === 0) throw new Error('No published questions are available');
      allQuestions = data;

      readParamsFromUrl();

      var countEl = document.getElementById('totalQuestionsCount');
      if (countEl) {
        countEl.textContent = data.length.toLocaleString();
      }

      // Check if a specific question was requested via URL ?question=<id>
      var requestedQuestion = new URLSearchParams(window.location.search).get('question');
      if (requestedQuestion) {
        var filteredList = getFilteredQuestions();
        var qIdx = filteredList.findIndex(function(item) { return item.id === requestedQuestion; });
        if (qIdx === -1) {
          // If question not found in active filter, reset filters to All to find it
          activeDomain = 'All';
          activeDifficulty = 'All';
          filteredList = getFilteredQuestions();
          qIdx = filteredList.findIndex(function(item) { return item.id === requestedQuestion; });
        }
        if (qIdx !== -1) {
          currentPage = Math.floor(qIdx / pageSize) + 1;
        }
      }

      if (!hideFilters) {
        renderFilters();
      }
      renderQuestions();

      if (requestedQuestion) {
        scrollToQuestion(requestedQuestion);
      }
    })
    .catch(function(err) {
      container.innerHTML = '<p style="color: var(--wrong-fg); padding: 1rem; border: 2px solid var(--wrong-border);">Failed to load questions (' + err.message + '). Check static data path.</p>';
    });

  function scrollToQuestion(qid) {
    setTimeout(function() {
      var el = document.getElementById('q-card-' + qid);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        el.style.outline = '3px solid var(--accent)';
        el.style.boxShadow = '0 0 15px rgba(234, 88, 12, 0.4)';
        setTimeout(function() {
          el.style.outline = '';
          el.style.boxShadow = '';
        }, 3000);
      }
    }, 250);
  }

  function renderFilters() {
    if (!filterContainer) return;
    var domains = ['All'].concat(Array.from(new Set(allQuestions.map(function(q) {
      var match = (q.domain || '').match(/^D\d+/);
      return match ? match[0] : null;
    }).filter(Boolean))).sort());

    var difficulties = [
      { id: 'All', label: 'All' },
      { id: 'quick-drills', label: 'Quick Drills' },
      { id: 'intermediate', label: 'Intermediate' },
      { id: 'difficult', label: 'Difficult' }
    ];

    var html = '<div style="display: flex; flex-direction: column; gap: 0.75rem; background: var(--card); border: 2px solid var(--border); padding: 1rem; border-radius: 2px; margin-bottom: 1.5rem; box-shadow: 3px 3px 0 var(--border);">';
    
    // Row 1: Domains
    html += '<div style="display: flex; align-items: center; flex-wrap: wrap; gap: 0.5rem;">';
    html += '<span style="font-family: var(--font-heading); font-size: 0.85rem; font-weight: bold; min-width: 90px; color: var(--muted);">Domain:</span>';
    domains.forEach(function(d) {
      var label = d === 'All' ? 'All Domains (' + allQuestions.length + ')' : d;
      var activeStyle = d === activeDomain ? 'style="background: var(--accent); color: var(--accent-contrast);"' : '';
      html += '<button class="reveal-btn domain-btn" data-domain="' + d + '" aria-pressed="' + (d === activeDomain) + '" ' + activeStyle + '>' + label + '</button>';
    });
    html += '</div>';

    // Row 2: Difficulty & Sorting
    html += '<div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 1rem; border-top: 1px dashed var(--border); padding-top: 0.75rem;">';
    
    // Difficulty
    html += '<div style="display: flex; align-items: center; flex-wrap: wrap; gap: 0.5rem;">';
    html += '<span style="font-family: var(--font-heading); font-size: 0.85rem; font-weight: bold; min-width: 90px; color: var(--muted);">Difficulty:</span>';
    difficulties.forEach(function(diff) {
      var activeStyle = diff.id === activeDifficulty ? 'style="background: var(--accent); color: var(--accent-contrast);"' : 'style="background: var(--code-bg); color: var(--fg); border: 1px solid var(--border);"';
      html += '<button class="reveal-btn diff-btn" data-diff="' + diff.id + '" aria-pressed="' + (diff.id === activeDifficulty) + '" ' + activeStyle + '>[' + diff.label + ']</button>';
    });
    html += '</div>';

    // Sorting
    html += '<div style="display: flex; align-items: center; gap: 0.5rem;">';
    html += '<span style="font-family: var(--font-heading); font-size: 0.85rem; font-weight: bold; color: var(--muted);">Sort:</span>';
    var oldestActive = activeSort === 'oldest' ? 'style="background: var(--accent); color: var(--accent-contrast);"' : 'style="background: var(--code-bg); color: var(--fg); border: 1px solid var(--border);"';
    var newestActive = activeSort === 'newest' ? 'style="background: var(--accent); color: var(--accent-contrast);"' : 'style="background: var(--code-bg); color: var(--fg); border: 1px solid var(--border);"';
    html += '<button class="reveal-btn sort-btn" data-sort="oldest" aria-pressed="' + (activeSort === 'oldest') + '" ' + oldestActive + '>Old to New</button>';
    html += '<button class="reveal-btn sort-btn" data-sort="newest" aria-pressed="' + (activeSort === 'newest') + '" ' + newestActive + '>New to Old</button>';
    html += '</div>';

    html += '</div></div>';
    filterContainer.innerHTML = html;

    filterContainer.querySelectorAll('.domain-btn').forEach(function(btn) {
      btn.addEventListener('click', function() {
        activeDomain = this.getAttribute('data-domain');
        currentPage = 1;
        updateUrlParams();
        renderFilters();
        renderQuestions();
        requestAnimationFrame(function() { filterContainer.querySelector('.domain-btn[data-domain="' + activeDomain + '"]').focus(); });
      });
    });

    filterContainer.querySelectorAll('.diff-btn').forEach(function(btn) {
      btn.addEventListener('click', function() {
        activeDifficulty = this.getAttribute('data-diff');
        currentPage = 1;
        updateUrlParams();
        renderFilters();
        renderQuestions();
        requestAnimationFrame(function() { filterContainer.querySelector('.diff-btn[data-diff="' + activeDifficulty + '"]').focus(); });
      });
    });

    filterContainer.querySelectorAll('.sort-btn').forEach(function(btn) {
      btn.addEventListener('click', function() {
        activeSort = this.getAttribute('data-sort');
        currentPage = 1;
        updateUrlParams();
        renderFilters();
        renderQuestions();
        requestAnimationFrame(function() { filterContainer.querySelector('.sort-btn[data-sort="' + activeSort + '"]').focus(); });
      });
    });
  }

  function getFilteredQuestions() {
    var filtered = allQuestions.slice();

    if (activeDomain !== 'All') {
      filtered = filtered.filter(function(q) {
        return q.domain && q.domain.startsWith(activeDomain);
      });
    }

    if (activeDifficulty !== 'All') {
      filtered = filtered.filter(function(q) {
        var diff = (q.difficulty || 'intermediate').toLowerCase();
        var isShort = (q.prompt || '').length < 140;

        if (activeDifficulty === 'quick-drills') {
          return diff === 'basic' || isShort || q.type === 'quick-drill';
        }
        if (activeDifficulty === 'difficult') {
          return diff === 'advanced' || diff === 'hard' || diff === 'exam';
        }
        if (activeDifficulty === 'intermediate') {
          return (diff === 'intermediate' || !q.difficulty) && !isShort && diff !== 'advanced' && diff !== 'hard' && diff !== 'exam';
        }
        return true;
      });
    }

    if (activeSort === 'newest') {
      filtered.reverse();
    }

    return filtered;
  }

  function renderQuestions() {
    var filtered = getFilteredQuestions();
    var totalQuestions = filtered.length;
    var totalPages = Math.max(1, Math.ceil(totalQuestions / pageSize));

    if (currentPage > totalPages) currentPage = totalPages;
    if (currentPage < 1) currentPage = 1;

    var startIndex = (currentPage - 1) * pageSize;
    var endIndex = Math.min(startIndex + pageSize, totalQuestions);
    var pageItems = filtered.slice(startIndex, endIndex);

    if (statusEl) {
      statusEl.textContent = 'Showing page ' + currentPage + ' of ' + totalPages + ' (' + totalQuestions + ' questions total)';
    }

    if (totalQuestions === 0) {
      container.innerHTML = '<div class="notice-panel" style="margin-top: 1rem;">No questions match the selected filter criteria. Try choosing a different domain or difficulty.</div>';
      if (paginationContainer) paginationContainer.innerHTML = '';
      return;
    }

    var html = '';
    pageItems.forEach(function(q, idx) {
      var globalIndex = startIndex + idx + 1;
      html += '<div class="question-card" id="q-card-' + q.id + '">';
      html += '  <div class="question-header">';
      html += '    <span class="question-domain">' + escapeHtml(q.domain || 'Claude Architecture') + '</span>';
      html += '    <div style="display: flex; gap: 0.5rem; align-items: center;">';
      html += '      <a href="?question=' + encodeURIComponent(q.id) + '" class="question-permalink" style="font-size: 0.75rem; color: var(--muted); text-decoration: none;" title="Copy direct link to this question">#' + escapeHtml(q.id) + ' 🔗</a>';
      html += '      <span>[' + (q.difficulty || 'intermediate') + ']</span>';
      html += '    </div>';
      html += '  </div>';
      
      if (q.title) {
        html += '  <div style="font-weight: bold; font-family: var(--font-heading); font-size: 1.05rem; margin-bottom: 0.6rem; color: var(--accent); border-left: 3px solid var(--accent); padding-left: 0.5rem;">' + escapeHtml(q.title) + '</div>';
      }

      html += '  <div class="question-prompt">' + globalIndex + '. ' + escapeHtml(q.prompt) + '</div>';
      html += '  <div class="options-list">';
      
      q.options.forEach(function(opt) {
        html += '    <label class="option-label" id="opt-' + q.id + '-' + opt.id + '">';
        html += '      <input type="radio" name="input-' + q.id + '" value="' + opt.id + '">';
        html += '      <span class="option-letter">' + opt.id + '.</span>';
        html += '      <span>' + escapeHtml(opt.text) + '</span>';
        html += '    </label>';
      });

      html += '  </div>';
      html += '  <button class="reveal-btn toggle-reveal" data-qid="' + q.id + '" aria-expanded="false" aria-controls="exp-' + q.id + '">Reveal answer</button>';
      html += '  <div class="explanation-box" id="exp-' + q.id + '" hidden>';
      html += '    <strong>Rationale:</strong> ' + escapeHtml(q.explanation);
      html += '  </div>';
      html += '</div>';
    });

    container.innerHTML = html;
    renderPagination(totalQuestions, totalPages, startIndex + 1, endIndex);

    container.querySelectorAll('.toggle-reveal').forEach(function(btn) {
      btn.addEventListener('click', function() {
        var qid = this.getAttribute('data-qid');
        var qObj = allQuestions.find(function(item) { return item.id === qid; });
        var expBox = document.getElementById('exp-' + qid);
        var isRevealed = !expBox.hidden;

        if (isRevealed) {
          expBox.hidden = true;
          this.setAttribute('aria-expanded', 'false');
          this.textContent = 'Reveal answer';
          qObj.options.forEach(function(opt) {
            var lbl = document.getElementById('opt-' + qid + '-' + opt.id);
            if (lbl) {
              lbl.classList.remove('correct', 'incorrect');
              var badge = lbl.querySelector('.badge-correct, .badge-incorrect');
              if (badge) badge.remove();
            }
          });
        } else {
          expBox.hidden = false;
          this.setAttribute('aria-expanded', 'true');
          this.textContent = 'Unreveal answer';
          qObj.options.forEach(function(opt) {
            var lbl = document.getElementById('opt-' + qid + '-' + opt.id);
            if (lbl) {
              var isCorrect = opt.id === qObj.correct;
              lbl.classList.add(isCorrect ? 'correct' : 'incorrect');
              if (!lbl.querySelector('.badge-correct, .badge-incorrect')) {
                var badge = document.createElement('span');
                badge.className = isCorrect ? 'badge-correct' : 'badge-incorrect';
                badge.textContent = isCorrect ? '✓ Correct' : '✗ Incorrect';
                lbl.appendChild(badge);
              }
            }
          });
        }
      });
    });

    // Permalink click handlers to copy URL and update address bar
    container.querySelectorAll('.question-permalink').forEach(function(a) {
      a.addEventListener('click', function(e) {
        e.preventDefault();
        var href = this.getAttribute('href');
        var qidMatch = href.match(/question=([^&]+)/);
        if (qidMatch) {
          updateUrlParams(qidMatch[1]);
          scrollToQuestion(qidMatch[1]);
        }
      });
    });
  }

  function renderPagination(totalQuestions, totalPages, start, end) {
    if (!paginationContainer) return;
    if (totalPages <= 1) {
      paginationContainer.innerHTML = '';
      return;
    }

    var html = '<div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem; background: var(--card); border: 2px solid var(--border); padding: 1rem; border-radius: 2px; margin-top: 1.5rem; box-shadow: 3px 3px 0 var(--border);">';
    html += '<div style="font-family: var(--font-heading); font-size: 0.85rem; color: var(--muted);">';
    html += 'Showing ' + start + '–' + end + ' of ' + totalQuestions + ' questions (Page ' + currentPage + ' of ' + totalPages + ')';
    html += '</div>';

    html += '<div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">';

    if (currentPage > 1) {
      html += '<button class="reveal-btn page-btn" data-page="' + (currentPage - 1) + '">◄ Prev</button>';
    } else {
      html += '<button class="reveal-btn" disabled style="opacity: 0.5; cursor: not-allowed;">◄ Prev</button>';
    }

    for (var p = 1; p <= totalPages; p++) {
      var activeAttr = p === currentPage ? 'style="background: var(--accent); color: var(--accent-contrast);" aria-current="page"' : '';
      html += '<button class="reveal-btn page-btn" data-page="' + p + '" ' + activeAttr + '>' + p + '</button>';
    }

    if (currentPage < totalPages) {
      html += '<button class="reveal-btn page-btn" data-page="' + (currentPage + 1) + '">Next ►</button>';
    } else {
      html += '<button class="reveal-btn" disabled style="opacity: 0.5; cursor: not-allowed;">Next ►</button>';
    }

    html += '</div></div>';
    paginationContainer.innerHTML = html;

    paginationContainer.querySelectorAll('.page-btn').forEach(function(btn) {
      btn.addEventListener('click', function() {
        currentPage = parseInt(this.getAttribute('data-page'), 10);
        updateUrlParams();
        renderQuestions();
        container.setAttribute('tabindex', '-1');
        container.focus();
        window.scrollTo({ top: container.offsetTop - 80, behavior: 'smooth' });
      });
    });
  }

  function escapeHtml(str) {
    if (!str) return '';
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }
})();
