(function() {
  var container = document.getElementById('questionsContainer');
  var filterContainer = document.getElementById('domainFilters');
  var paginationContainer = document.getElementById('paginationContainer');
  if (!container) return;

  var allQuestions = [];
  var activeDomain = 'All';
  var activeDifficulty = 'All';
  var activeSort = 'oldest'; // 'oldest' (Old to New) | 'newest' (New to Old)
  var currentPage = 1;
  var pageSize = 50;

  var pathPrefix = window.location.pathname.startsWith('/ai-certification-preparation')
    ? '/ai-certification-preparation'
    : (window.location.pathname.startsWith('/ccaf-exam') ? '/ccaf-exam' : '');
  var fetchUrl = pathPrefix + '/data/questions/cca-f/questions.json';

  function loadData(url) {
    return fetch(url).then(function(res) {
      if (!res.ok) throw new Error('HTTP ' + res.status);
      return res.json();
    });
  }

  loadData(fetchUrl)
    .catch(function() {
      return loadData('/data/questions/cca-f/questions.json');
    })
    .catch(function() {
      return loadData('../../data/questions/cca-f/questions.json');
    })
    .then(function(data) {
      allQuestions = data;
      var countEl = document.getElementById('totalQuestionsCount');
      if (countEl) {
        countEl.textContent = data.length.toLocaleString();
      }
      renderFilters();
      renderQuestions();
    })
    .catch(function(err) {
      container.innerHTML = '<p style="color: var(--wrong-fg); padding: 1rem; border: 2px solid var(--wrong-border);">Failed to load questions (' + err.message + '). Check static data path.</p>';
    });

  function renderFilters() {
    if (!filterContainer) return;
    var domains = ['All', 'D1', 'D2', 'D3', 'D4', 'D5'];
    var difficulties = ['All', 'basic', 'intermediate', 'advanced'];

    var html = '<div style="display: flex; flex-direction: column; gap: 0.75rem; background: var(--card); border: 2px solid var(--border); padding: 1rem; border-radius: 2px; margin-bottom: 1.5rem; box-shadow: 3px 3px 0 var(--border);">';
    
    // Row 1: Domains
    html += '<div style="display: flex; align-items: center; flex-wrap: wrap; gap: 0.5rem;">';
    html += '<span style="font-family: var(--font-heading); font-size: 0.85rem; font-weight: bold; min-width: 90px; color: var(--muted);">Domain:</span>';
    domains.forEach(function(d) {
      var label = d === 'All' ? 'All Domains (' + allQuestions.length + ')' : d;
      var activeStyle = d === activeDomain ? 'style="background: var(--accent); color: #fff;"' : '';
      html += '<button class="reveal-btn domain-btn" data-domain="' + d + '" ' + activeStyle + '>' + label + '</button>';
    });
    html += '</div>';

    // Row 2: Difficulty & Sorting
    html += '<div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 1rem; border-top: 1px dashed var(--border); padding-top: 0.75rem;">';
    
    // Difficulty
    html += '<div style="display: flex; align-items: center; flex-wrap: wrap; gap: 0.5rem;">';
    html += '<span style="font-family: var(--font-heading); font-size: 0.85rem; font-weight: bold; min-width: 90px; color: var(--muted);">Difficulty:</span>';
    difficulties.forEach(function(diff) {
      var label = diff === 'All' ? '[All]' : '[' + diff + ']';
      var activeStyle = diff === activeDifficulty ? 'style="background: var(--accent); color: #fff;"' : 'style="background: var(--code-bg); color: var(--fg); border: 1px solid var(--border);"';
      html += '<button class="reveal-btn diff-btn" data-diff="' + diff + '" ' + activeStyle + '>' + label + '</button>';
    });
    html += '</div>';

    // Sorting
    html += '<div style="display: flex; align-items: center; gap: 0.5rem;">';
    html += '<span style="font-family: var(--font-heading); font-size: 0.85rem; font-weight: bold; color: var(--muted);">Sort:</span>';
    var oldestActive = activeSort === 'oldest' ? 'style="background: var(--accent); color: #fff;"' : 'style="background: var(--code-bg); color: var(--fg); border: 1px solid var(--border);"';
    var newestActive = activeSort === 'newest' ? 'style="background: var(--accent); color: #fff;"' : 'style="background: var(--code-bg); color: var(--fg); border: 1px solid var(--border);"';
    html += '<button class="reveal-btn sort-btn" data-sort="oldest" ' + oldestActive + '>Old to New</button>';
    html += '<button class="reveal-btn sort-btn" data-sort="newest" ' + newestActive + '>New to Old</button>';
    html += '</div>';

    html += '</div></div>';
    filterContainer.innerHTML = html;

    filterContainer.querySelectorAll('.domain-btn').forEach(function(btn) {
      btn.addEventListener('click', function() {
        activeDomain = this.getAttribute('data-domain');
        currentPage = 1;
        renderFilters();
        renderQuestions();
      });
    });

    filterContainer.querySelectorAll('.diff-btn').forEach(function(btn) {
      btn.addEventListener('click', function() {
        activeDifficulty = this.getAttribute('data-diff');
        currentPage = 1;
        renderFilters();
        renderQuestions();
      });
    });

    filterContainer.querySelectorAll('.sort-btn').forEach(function(btn) {
      btn.addEventListener('click', function() {
        activeSort = this.getAttribute('data-sort');
        currentPage = 1;
        renderFilters();
        renderQuestions();
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
        return (q.difficulty || 'intermediate').toLowerCase() === activeDifficulty.toLowerCase();
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

    if (totalQuestions === 0) {
      container.innerHTML = '<div class="card" style="padding: 2rem; text-align: center;"><p class="muted">No questions found matching your filter criteria.</p></div>';
      if (paginationContainer) paginationContainer.innerHTML = '';
      return;
    }

    var totalPages = Math.ceil(totalQuestions / pageSize);
    if (currentPage > totalPages) currentPage = totalPages;
    if (currentPage < 1) currentPage = 1;

    var startIndex = (currentPage - 1) * pageSize;
    var endIndex = Math.min(startIndex + pageSize, totalQuestions);
    var pageItems = filtered.slice(startIndex, endIndex);

    var html = '';
    pageItems.forEach(function(q, idx) {
      var globalIndex = startIndex + idx + 1;
      html += '<div class="question-card" id="q-card-' + q.id + '">';
      html += '  <div class="question-header">';
      html += '    <span class="question-domain">' + escapeHtml(q.domain) + '</span>';
      html += '    <span>[' + (q.difficulty || 'intermediate') + ']</span>';
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
      html += '  <button class="reveal-btn toggle-reveal" data-qid="' + q.id + '">Reveal answer</button>';
      html += '  <div class="explanation-box" id="exp-' + q.id + '" style="display: none;">';
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
        var isRevealed = expBox.style.display !== 'none';

        if (isRevealed) {
          expBox.style.display = 'none';
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
          expBox.style.display = 'block';
          this.textContent = 'Unreveal answer';
          qObj.options.forEach(function(opt) {
            var lbl = document.getElementById('opt-' + qid + '-' + opt.id);
            if (lbl) {
              var isCorrect = opt.id === qObj.correct;
              lbl.classList.remove('correct', 'incorrect');
              var oldBadge = lbl.querySelector('.badge-correct, .badge-incorrect');
              if (oldBadge) oldBadge.remove();

              if (isCorrect) {
                lbl.classList.add('correct');
                lbl.insertAdjacentHTML('beforeend', '<span class="badge-correct">[Correct]</span>');
              } else {
                lbl.classList.add('incorrect');
                lbl.insertAdjacentHTML('beforeend', '<span class="badge-incorrect">[Incorrect]</span>');
              }
            }
          });
        }
      });
    });
  }

  function renderPagination(totalQuestions, totalPages, fromItem, toItem) {
    if (!paginationContainer) return;
    if (totalPages <= 1) {
      paginationContainer.innerHTML = '<div style="font-family: var(--font-heading); font-size: 0.9rem; color: var(--muted);">Showing all ' + totalQuestions + ' questions</div>';
      return;
    }

    var html = '<div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 1rem; font-family: var(--font-heading); font-size: 0.9rem; border-top: 2px dashed var(--border); padding-top: 1rem;">';
    html += '<span class="muted">Showing ' + fromItem + '–' + toItem + ' of ' + totalQuestions + ' questions (Page ' + currentPage + ' of ' + totalPages + ')</span>';
    html += '<div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">';

    if (currentPage > 1) {
      html += '<button class="reveal-btn page-btn" data-page="' + (currentPage - 1) + '">◄ Prev</button>';
    } else {
      html += '<button class="reveal-btn" disabled style="opacity: 0.5; cursor: not-allowed;">◄ Prev</button>';
    }

    for (var p = 1; p <= totalPages; p++) {
      var activeAttr = p === currentPage ? 'style="background: var(--accent); color: #fff;"' : '';
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
        renderQuestions();
        window.scrollTo({ top: container.offsetTop - 100, behavior: 'smooth' });
      });
    });
  }

  function escapeHtml(str) {
    if (!str) return '';
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }
})();
