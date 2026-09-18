/* ═══════════════════════════════════════════════════════════
   Testing Playground — Main Application JavaScript
   ═══════════════════════════════════════════════════════════ */

/* ── Auth Credentials (PRESERVED) ── */
const validEmail = 'user@test.com';
const validPassword = 'Password123';

/* ── Utilities ── */
function simulateDelay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function copyToClipboard(text) {
  navigator.clipboard.writeText(text).then(() => showToast('📋 Copied to clipboard!', 'success'));
}

/* Toast Notification System */
function showToast(message, type) {
  type = type || 'info';
  var container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    container.setAttribute('aria-live', 'polite');
    document.body.appendChild(container);
  }
  var toast = document.createElement('div');
  toast.className = 'toast toast-' + type;
  toast.setAttribute('role', 'alert');
  toast.setAttribute('data-testid', 'toast-notification');
  toast.innerHTML = '<span>' + message + '</span><button class="toast-close" aria-label="Close notification">\u2715</button>';
  container.appendChild(toast);
  requestAnimationFrame(function() { toast.classList.add('toast-visible'); });
  var dismiss = function() {
    toast.classList.remove('toast-visible');
    setTimeout(function() { if (toast.parentNode) toast.remove(); }, 300);
  };
  toast.querySelector('.toast-close').addEventListener('click', dismiss);
  setTimeout(dismiss, 3000);
}
window.showToast = showToast;

/* Confirmation Dialog for Reset Actions */
function showResetConfirmation(onConfirm) {
  var dialog = document.getElementById('reset-confirm-dialog');
  if (!dialog) {
    dialog = document.createElement('dialog');
    dialog.id = 'reset-confirm-dialog';
    dialog.setAttribute('role', 'dialog');
    dialog.className = 'confirm-dialog';
    dialog.innerHTML =
      '<p>Are you sure you want to reset? Your progress will be lost.</p>' +
      '<div class="confirm-dialog-actions">' +
      '<button class="confirm-yes">Yes, Reset</button>' +
      '<button class="confirm-cancel btn-secondary">Cancel</button>' +
      '</div>';
    document.body.appendChild(dialog);
  }
  var yesBtn = dialog.querySelector('.confirm-yes');
  var cancelBtn = dialog.querySelector('.confirm-cancel');
  var newYes = yesBtn.cloneNode(true);
  var newCancel = cancelBtn.cloneNode(true);
  yesBtn.parentNode.replaceChild(newYes, yesBtn);
  cancelBtn.parentNode.replaceChild(newCancel, cancelBtn);
  newYes.addEventListener('click', function() { dialog.close(); onConfirm(); });
  newCancel.addEventListener('click', function() { dialog.close(); });
  dialog.showModal();
}
window.showResetConfirmation = showResetConfirmation;

/* ── Mock API ── */
async function fetchTopics() {
  var response = await fetch('../data/topics.json');
  return response.json();
}
async function fetchTopicByTitle(title) {
  var topics = await fetchTopics();
  return topics.find(function(t) { return t.title === title; }) || null;
}
window.fetchTopics = fetchTopics;
window.fetchTopicByTitle = fetchTopicByTitle;

/* ── Gamification ── */
var GameState = {
  getScore: function() { return parseInt(localStorage.getItem('tp_score') || '0'); },
  setScore: function(v) { localStorage.setItem('tp_score', String(v)); this.updateUI(); },
  addPoints: function(p) { this.setScore(this.getScore() + p); showToast('\uD83C\uDFC6 +' + p + ' points!', 'success'); },
  getExplored: function() { return JSON.parse(localStorage.getItem('tp_explored') || '[]'); },
  markExplored: function(title) {
    var e = this.getExplored();
    if (e.indexOf(title) === -1) { e.push(title); localStorage.setItem('tp_explored', JSON.stringify(e)); }
  },
  isExplored: function(t) { return this.getExplored().indexOf(t) !== -1; },
  getStreak: function() {
    var dates = JSON.parse(localStorage.getItem('tp_streak_dates') || '[]').sort();
    if (!dates.length) return 0;
    var today = new Date().toISOString().split('T')[0];
    if (dates[dates.length - 1] !== today) return 0;
    var streak = 1;
    for (var i = dates.length - 1; i > 0; i--) {
      var diff = (new Date(dates[i]) - new Date(dates[i-1])) / 86400000;
      if (diff === 1) streak++; else break;
    }
    return streak;
  },
  recordVisit: function() {
    var today = new Date().toISOString().split('T')[0];
    var dates = JSON.parse(localStorage.getItem('tp_streak_dates') || '[]');
    if (dates.indexOf(today) === -1) { dates.push(today); localStorage.setItem('tp_streak_dates', JSON.stringify(dates)); }
    this.checkAchievements();
  },
  getAchievements: function() { return JSON.parse(localStorage.getItem('tp_achievements') || '[]'); },
  addAchievement: function(msg) {
    var a = this.getAchievements();
    if (a.indexOf(msg) === -1) { a.push(msg); localStorage.setItem('tp_achievements', JSON.stringify(a)); this.updateUI(); }
  },
  checkAchievements: function() {
    var n = this.getExplored().length, s = this.getStreak();
    if (n >= 1) this.addAchievement('\uD83C\uDF89 Explorer: Visited your first topic!');
    if (n >= 5) this.addAchievement('\uD83C\uDF89 Curious Mind: Explored 5 topics!');
    if (n >= 10) this.addAchievement('\uD83C\uDF89 Master Explorer: All 10 topics!');
    if (s >= 3) this.addAchievement('\uD83D\uDD25 3-day streak!');
    if (s >= 7) this.addAchievement('\uD83D\uDD25 7-day streak!');
  },
  updateUI: function() {
    var el = document.getElementById('score-value');
    if (el) el.textContent = this.getScore() + '/300';
    var badge = document.getElementById('notif-count');
    if (badge) { var c = this.getAchievements().length; badge.textContent = c; badge.hidden = c === 0; }
    var streakEl = document.getElementById('streak-value');
    if (streakEl) streakEl.textContent = this.getStreak();
  }
};

/* ── Dark Mode ── */
function initDarkMode() {
  if (localStorage.getItem('tp_dark_mode') === 'true') document.documentElement.classList.add('dark-mode');
}
function toggleDarkMode() {
  var isDark = document.documentElement.classList.toggle('dark-mode');
  localStorage.setItem('tp_dark_mode', String(isDark));
  var btn = document.getElementById('dark-mode-toggle');
  if (btn) btn.textContent = isDark ? '\u2600\uFE0F' : '\uD83C\uDF19';
}
initDarkMode();

/* ══════════════════════════════════════════
   COMPONENT RENDERERS
   ══════════════════════════════════════════ */

function renderComponent(topic, container) {
  var fn = {
    'form': renderFormComponent, 'table': renderTableComponent,
    'accordion': renderAccordionComponent, 'card-list': renderCardListComponent,
    'tabs': renderTabsComponent, 'checklist': renderChecklistComponent,
    'slider': renderSliderComponent, 'dropdown-menu': renderDropdownComponent,
    'toggle-panel': renderToggleComponent, 'search-filter': renderSearchComponent
  };
  if (fn[topic.componentType]) fn[topic.componentType](topic, container);
}

/* ── FORM: Contribute a Fact ── */
function renderFormComponent(topic, container) {
  container.innerHTML =
    '<h2>\uD83D\uDCDA Known Facts</h2><ul class="known-facts-list">' +
    topic.funFacts.map(function(f) { return '<li class="card">' + f + '</li>'; }).join('') +
    '</ul>' +
    '<h2>\u270D\uFE0F Contribute a Fact</h2>' +
    '<form id="contribute-form" novalidate>' +
    '<div class="form-group"><label for="c-name">Name</label>' +
    '<input type="text" id="c-name" placeholder="Your name" required />' +
    '<span class="field-error" role="alert"></span></div>' +
    '<div class="form-group"><label for="c-email">Email</label>' +
    '<input type="email" id="c-email" placeholder="your@email.com" required />' +
    '<span class="field-error" role="alert"></span></div>' +
    '<div class="form-group"><label for="c-fact">Your Amazing Fact</label>' +
    '<textarea id="c-fact" placeholder="Share something fascinating about ' + topic.title + '..." rows="4"></textarea>' +
    '<span class="field-error" role="alert"></span></div>' +
    '<div class="form-group"><label for="c-date">When did you learn this?</label>' +
    '<input type="date" id="c-date" /></div>' +
    '<div class="form-group"><label for="c-image" class="file-upload-label">\uD83D\uDCF8 Upload Supporting Image</label>' +
    '<input type="file" id="c-image" accept="image/*" />' +
    '<div id="image-preview"></div></div>' +
    '<button type="submit">Submit</button></form>' +
    '<section id="community-facts"><h2>\uD83C\uDF1F Community Facts</h2>' +
    '<p class="empty-state">No community facts yet. Be the first to contribute!</p></section>';
  var fileIn = container.querySelector('#c-image');
  var preview = container.querySelector('#image-preview');
  fileIn.addEventListener('change', function() {
    if (fileIn.files[0]) {
      preview.innerHTML = '<p>\uD83D\uDCCE ' + fileIn.files[0].name + '</p>';
      var reader = new FileReader();
      reader.onload = function(e) { preview.innerHTML += '<img src="' + e.target.result + '" alt="Uploaded image preview" class="upload-preview" />'; };
      reader.readAsDataURL(fileIn.files[0]);
    }
  });
  container.querySelector('#contribute-form').addEventListener('submit', function(e) {
    e.preventDefault();
    var valid = true;
    this.querySelectorAll('.field-error').forEach(function(el) { el.textContent = ''; });
    var name = container.querySelector('#c-name');
    var email = container.querySelector('#c-email');
    if (!name.value.trim()) { name.nextElementSibling.textContent = 'Name is required'; valid = false; }
    if (!email.value.trim() || !email.value.includes('@')) { email.nextElementSibling.textContent = 'Valid email is required'; valid = false; }
    if (!valid) { showToast('Please fix the errors above.', 'error'); return; }
    var sec = container.querySelector('#community-facts');
    var empty = sec.querySelector('.empty-state'); if (empty) empty.remove();
    var d = document.createElement('div'); d.className = 'community-fact card';
    d.innerHTML = '<strong>' + name.value + '</strong> <span class="text-secondary">\u00B7 Just now</span><p>' +
      (container.querySelector('#c-fact').value || 'Shared a fact about ' + topic.title) + '</p>';
    sec.appendChild(d);
    showToast('Thank you for your contribution! \uD83C\uDF89', 'success');
    GameState.addPoints(topic.points);
    this.reset(); preview.innerHTML = '';
  });
}

/* ── TABLE: Fact Sorter Challenge ── */
function renderTableComponent(topic, container) {
  var rows = topic.funFacts.map(function(f, i) {
    return { num: i + 1, fact: f, cat: topic.category, diff: topic.difficulty, pts: topic.points, learned: false };
  });
  var page = 0, perPage = 3, sortCol = null, sortAsc = true;
  function renderTable() {
    var sorted = sortCol ? rows.slice().sort(function(a, b) {
      var va = a[sortCol], vb = b[sortCol];
      if (typeof va === 'string') return sortAsc ? va.localeCompare(vb) : vb.localeCompare(va);
      return sortAsc ? va - vb : vb - va;
    }) : rows.slice();
    var start = page * perPage, pageRows = sorted.slice(start, start + perPage);
    var totalPages = Math.ceil(sorted.length / perPage);
    var html = '<table><thead><tr>' +
      '<th class="sortable" role="columnheader" data-col="num" aria-sort="' + (sortCol === 'num' ? (sortAsc ? 'ascending' : 'descending') : 'none') + '"># ' + (sortCol === 'num' ? (sortAsc ? '\u25B2' : '\u25BC') : '') + '</th>' +
      '<th class="sortable" role="columnheader" data-col="fact" aria-sort="' + (sortCol === 'fact' ? (sortAsc ? 'ascending' : 'descending') : 'none') + '">Fact ' + (sortCol === 'fact' ? (sortAsc ? '\u25B2' : '\u25BC') : '') + '</th>' +
      '<th role="columnheader">Category</th><th role="columnheader">Difficulty</th><th role="columnheader">Points</th><th role="columnheader">Learned \u2713</th><th role="columnheader">Action</th>' +
      '</tr></thead><tbody>';
    pageRows.forEach(function(r) {
      html += '<tr><td>' + r.num + '</td><td>' + r.fact.substring(0, 80) + '...</td>' +
        '<td><span class="badge badge-category">' + r.cat + '</span></td>' +
        '<td><span class="badge badge-' + r.diff.toLowerCase() + '">' + r.diff + '</span></td>' +
        '<td>' + r.pts + '</td>' +
        '<td><label><input type="checkbox" class="learn-check" data-num="' + r.num + '"' + (r.learned ? ' checked' : '') + ' /> Learned</label></td>' +
        '<td><button class="btn-sm copy-btn" data-fact="' + r.fact.replace(/"/g, '&quot;') + '">Copy</button></td></tr>';
    });
    html += '</tbody></table>';
    html += '<div class="pagination"><button class="btn-sm" id="prev-page"' + (page === 0 ? ' disabled' : '') + '>Previous</button>' +
      '<span>Page ' + (page + 1) + ' of ' + totalPages + '</span>' +
      '<button class="btn-sm" id="next-page"' + (page >= totalPages - 1 ? ' disabled' : '') + '>Next</button></div>';
    container.querySelector('#table-section').innerHTML = html;
    container.querySelectorAll('.sortable').forEach(function(th) {
      th.style.cursor = 'pointer';
      th.addEventListener('click', function() {
        var col = this.getAttribute('data-col');
        if (sortCol === col) sortAsc = !sortAsc; else { sortCol = col; sortAsc = true; }
        renderTable();
      });
    });
    container.querySelectorAll('.learn-check').forEach(function(cb) {
      cb.addEventListener('change', function() {
        var n = parseInt(this.getAttribute('data-num'));
        rows[n - 1].learned = this.checked;
      });
    });
    container.querySelectorAll('.copy-btn').forEach(function(btn) {
      btn.addEventListener('click', function() { copyToClipboard(this.getAttribute('data-fact')); });
    });
    var prev = container.querySelector('#prev-page'), next = container.querySelector('#next-page');
    if (prev) prev.addEventListener('click', function() { if (page > 0) { page--; renderTable(); } });
    if (next) next.addEventListener('click', function() { if (page < totalPages - 1) { page++; renderTable(); } });
  }
  container.innerHTML = '<div id="table-section"></div><section id="fact-match"><h2>\uD83C\uDFAF Fact Match Challenge</h2><p>Match each scrambled fact to its correct version!</p><div id="match-area"></div><p id="match-score"></p></section>';
  renderTable();
  var matchFacts = topic.funFacts.slice(0, 3);
  var scrambled = matchFacts.map(function(f) {
    var words = f.split(' ');
    for (var i = words.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var tmp = words[i]; words[i] = words[j]; words[j] = tmp; }
    return words.join(' ');
  });
  var matchState = [null, null, null], matched = 0;
  function renderMatch() {
    var html = '';
    scrambled.forEach(function(s, i) {
      html += '<div class="match-row"><div class="match-scrambled card"><strong>Scrambled ' + (i+1) + ':</strong> ' + s.substring(0, 60) + '...</div>';
      if (matchState[i] === true) html += '<span class="match-result">\u2705 Correct!</span>';
      else if (matchState[i] === false) html += '<span class="match-result match-wrong">\u274C Try again</span>';
      else {
        html += '<div class="match-options">';
        matchFacts.forEach(function(f, j) {
          html += '<button class="btn-sm match-opt" data-q="' + i + '" data-a="' + j + '">' + f.substring(0, 50) + '...</button>';
        });
        html += '</div>';
      }
      html += '</div>';
    });
    container.querySelector('#match-area').innerHTML = html;
    container.querySelector('#match-score').textContent = matched + ' of 3 matched!';
    container.querySelectorAll('.match-opt').forEach(function(btn) {
      btn.addEventListener('click', function() {
        var q = parseInt(this.getAttribute('data-q')), a = parseInt(this.getAttribute('data-a'));
        matchState[q] = (q === a);
        if (q === a) { matched++; if (matched === 3) { showToast('\uD83C\uDF89 All facts matched! Great job!', 'success'); GameState.addPoints(topic.points); } }
        renderMatch();
      });
    });
  }
  renderMatch();
}

/* ── ACCORDION: Deep Dive Explorer ── */
function renderAccordionComponent(topic, container) {
  var eggIdx = Math.floor(Math.random() * topic.funFacts.length);
  var foundEgg = false;
  container.innerHTML = '<div class="callout">\uD83D\uDD0D Can you find the hidden Easter Egg? It\'s hiding in one of the sections below!</div><div id="accordion-sections"></div>';
  var html = '';
  topic.funFacts.forEach(function(f, i) {
    var isEgg = i === eggIdx;
    html += '<details class="accordion-item"><summary>' + f.substring(0, 60) + '... <span class="read-time">\u23F1 ' + (i + 1) + ' min read</span></summary>' +
      '<div class="accordion-content">' +
      (isEgg ? '<div class="easter-egg">\uD83E\uDD5A Easter Egg Found! ' + topic.coreFact + '</div>' : '') +
      '<p>' + f + '</p></div></details>';
  });
  container.querySelector('#accordion-sections').innerHTML = html;
  container.querySelectorAll('.accordion-item').forEach(function(det) {
    det.addEventListener('toggle', function() {
      if (this.open) {
        container.querySelectorAll('.accordion-item').forEach(function(d) { if (d !== det) d.open = false; });
        if (this.querySelector('.easter-egg') && !foundEgg) {
          foundEgg = true;
          showToast('\uD83C\uDF89 You found the Easter Egg! +10 bonus points!', 'success');
          GameState.addPoints(10);
        }
      }
    });
  });
}

/* ── CARD-LIST: Memory Match ── */
function renderCardListComponent(topic, container) {
  var snippets = topic.funFacts.slice(0, 4).map(function(f) { return f.substring(0, 55) + '...'; });
  var cards = [];
  snippets.forEach(function(s, i) {
    cards.push({ id: i * 2, pairId: i, text: s, flipped: false, matched: false });
    cards.push({ id: i * 2 + 1, pairId: i, text: s, flipped: false, matched: false });
  });
  for (var i = cards.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var t = cards[i]; cards[i] = cards[j]; cards[j] = t; }
  var first = null, moves = 0, pairs = 0, lock = false;
  container.innerHTML = '<div class="memory-stats"><span id="mem-moves">Moves: 0</span> <span id="mem-pairs">Pairs Found: 0 of 4</span></div><div id="memory-grid" class="memory-grid"></div>' +
    '<dialog id="win-dialog" class="win-dialog"><h2>\uD83C\uDF89 You Win!</h2><p id="win-moves"></p><p id="win-stars"></p><button id="play-again">Play Again</button><button id="close-dialog" aria-label="Close">Close</button></dialog>';
  function render() {
    var html = '';
    cards.forEach(function(c, idx) {
      var cls = 'memory-card' + (c.flipped || c.matched ? ' flipped' : '') + (c.matched ? ' matched' : '');
      html += '<div class="' + cls + '" data-idx="' + idx + '"><div class="card-inner"><div class="card-front">\u2753 ' + topic.emoji + '</div><div class="card-back">' + c.text + (c.matched ? ' \u2705' : '') + '</div></div></div>';
    });
    container.querySelector('#memory-grid').innerHTML = html;
    container.querySelector('#mem-moves').textContent = 'Moves: ' + moves;
    container.querySelector('#mem-pairs').textContent = 'Pairs Found: ' + pairs + ' of 4';
    container.querySelectorAll('.memory-card:not(.matched)').forEach(function(el) {
      el.addEventListener('click', function() { flipCard(parseInt(this.getAttribute('data-idx'))); });
    });
  }
  function flipCard(idx) {
    if (lock || cards[idx].flipped || cards[idx].matched) return;
    cards[idx].flipped = true; render();
    if (first === null) { first = idx; }
    else {
      moves++;
      lock = true;
      if (cards[first].pairId === cards[idx].pairId) {
        cards[first].matched = true; cards[idx].matched = true;
        pairs++; first = null; lock = false; render();
        if (pairs === 4) {
          var stars = moves <= 8 ? '\u2B50\u2B50\u2B50' : moves <= 12 ? '\u2B50\u2B50' : '\u2B50';
          var dlg = container.querySelector('#win-dialog');
          dlg.querySelector('#win-moves').textContent = 'Total moves: ' + moves;
          dlg.querySelector('#win-stars').textContent = 'Rating: ' + stars;
          dlg.showModal();
          GameState.addPoints(topic.points);
        }
      } else {
        setTimeout(function() { cards[first].flipped = false; cards[idx].flipped = false; first = null; lock = false; render(); }, 1000);
      }
    }
  }
  render();
  container.querySelector('#play-again').addEventListener('click', function() {
    container.querySelector('#win-dialog').close();
    cards.forEach(function(c) { c.flipped = false; c.matched = false; });
    for (var i = cards.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var t = cards[i]; cards[i] = cards[j]; cards[j] = t; }
    first = null; moves = 0; pairs = 0; lock = false; render();
  });
  container.querySelector('#close-dialog').addEventListener('click', function() { container.querySelector('#win-dialog').close(); });
}

/* ── TABS: Knowledge Explorer with Quiz ── */
function renderTabsComponent(topic, container) {
  var quizQuestions = [
    { q: 'Which of the following is a verified fact about ' + topic.title + '?',
      opts: [topic.funFacts[0].substring(0, 90) + '...', topic.title + ' was first studied in 2005.', 'There are exactly 42 known types of ' + topic.title.toLowerCase() + '.', topic.title + ' only exists in the Southern Hemisphere.'], correct: 0 },
    { q: 'Based on what you\'ve learned, which statement is accurate?',
      opts: [topic.title + ' has no practical modern applications.', topic.funFacts[2].substring(0, 90) + '...', 'Experts say ' + topic.title.toLowerCase() + ' will be obsolete by 2030.', 'The study of ' + topic.title.toLowerCase() + ' began in the 1990s.'], correct: 1 },
    { q: 'Which fact would you find in a ' + topic.title + ' encyclopedia?',
      opts: ['Most people encounter ' + topic.title.toLowerCase() + ' exactly once per year.', topic.title + ' has been banned in academic research.', 'Only 3 people worldwide are certified experts.', topic.funFacts[4].substring(0, 90) + '...'], correct: 3 }
  ];
  var reactions = [0, 0, 0, 0, 0];
  container.innerHTML =
    '<div role="tablist" aria-label="' + topic.title + ' tabs">' +
    '<button role="tab" aria-selected="true" aria-controls="tp-overview" id="t-overview">\uD83D\uDCD6 Overview</button>' +
    '<button role="tab" aria-selected="false" aria-controls="tp-facts" id="t-facts">\uD83E\uDD2F Fun Facts</button>' +
    '<button role="tab" aria-selected="false" aria-controls="tp-quiz" id="t-quiz">\uD83E\uDDE0 Quiz</button>' +
    '<button role="tab" aria-selected="false" aria-controls="tp-resources" id="t-resources">\uD83D\uDD17 Resources</button>' +
    '</div>' +
    '<section role="tabpanel" id="tp-overview" aria-labelledby="t-overview">' +
    '<div class="callout">\uD83D\uDCA1 ' + topic.coreFact + '</div>' +
    '<p><em>\uD83D\uDCAC Discussion prompt: ' + topic.hook + '</em></p>' +
    '<button id="share-fact" class="btn-secondary">Share this fact</button></section>' +
    '<section role="tabpanel" id="tp-facts" aria-labelledby="t-facts" hidden>' +
    '<ol class="fun-facts-list">' + topic.funFacts.map(function(f, i) {
      return '<li class="card"><p>' + f + '</p><button class="btn-sm reaction-btn" data-idx="' + i + '">\uD83D\uDC4D Mind-blown! (<span class="r-count">' + reactions[i] + '</span>)</button></li>';
    }).join('') + '</ol></section>' +
    '<section role="tabpanel" id="tp-quiz" aria-labelledby="t-quiz" hidden>' +
    '<form id="quiz-form">' + quizQuestions.map(function(qq, qi) {
      return '<fieldset class="quiz-question"><legend>Question ' + (qi + 1) + ': ' + qq.q + '</legend>' +
        qq.opts.map(function(o, oi) {
          return '<label class="quiz-option"><input type="radio" name="q' + qi + '" value="' + oi + '" /> ' + o + '</label>';
        }).join('') + '</fieldset>';
    }).join('') + '<button type="submit">Check Answers</button></form><div id="quiz-result"></div></section>' +
    '<section role="tabpanel" id="tp-resources" aria-labelledby="t-resources" hidden>' +
    '<ul class="resources-list"><li><a href="https://en.wikipedia.org/wiki/' + encodeURIComponent(topic.title) + '" target="_blank" rel="noopener">\uD83C\uDF10 Wikipedia: ' + topic.title + '</a><p>Comprehensive overview and history.</p></li>' +
    '<li><a href="https://www.youtube.com/results?search_query=' + encodeURIComponent(topic.title) + '" target="_blank" rel="noopener">\uD83C\uDFA5 YouTube: ' + topic.title + ' documentaries</a><p>Visual learning resources and documentaries.</p></li>' +
    '<li><a href="https://scholar.google.com/scholar?q=' + encodeURIComponent(topic.title) + '" target="_blank" rel="noopener">\uD83D\uDCDA Google Scholar: Research papers</a><p>Academic research and publications.</p></li></ul></section>';
  /* Tab switching */
  var tabs = container.querySelectorAll('[role="tab"]');
  var panels = container.querySelectorAll('[role="tabpanel"]');
  function activateTab(tab) {
    tabs.forEach(function(t) { t.setAttribute('aria-selected', 'false'); });
    panels.forEach(function(p) { p.hidden = true; });
    tab.setAttribute('aria-selected', 'true');
    document.getElementById(tab.getAttribute('aria-controls')).hidden = false;
  }
  tabs.forEach(function(tab) {
    tab.addEventListener('click', function() { activateTab(this); });
    tab.addEventListener('keydown', function(e) {
      var idx = Array.from(tabs).indexOf(this);
      if (e.key === 'ArrowRight') { e.preventDefault(); activateTab(tabs[(idx + 1) % tabs.length]); tabs[(idx + 1) % tabs.length].focus(); }
      if (e.key === 'ArrowLeft') { e.preventDefault(); activateTab(tabs[(idx - 1 + tabs.length) % tabs.length]); tabs[(idx - 1 + tabs.length) % tabs.length].focus(); }
    });
  });
  container.querySelector('#share-fact').addEventListener('click', function() { copyToClipboard(topic.coreFact); });
  container.querySelectorAll('.reaction-btn').forEach(function(btn) {
    btn.addEventListener('click', function() {
      var idx = parseInt(this.getAttribute('data-idx'));
      reactions[idx]++;
      this.querySelector('.r-count').textContent = reactions[idx];
    });
  });
  container.querySelector('#quiz-form').addEventListener('submit', function(e) {
    e.preventDefault();
    var score = 0;
    quizQuestions.forEach(function(qq, qi) {
      var sel = container.querySelector('input[name="q' + qi + '"]:checked');
      var opts = container.querySelectorAll('input[name="q' + qi + '"]');
      opts.forEach(function(o) {
        var lbl = o.parentElement;
        lbl.classList.remove('quiz-correct', 'quiz-wrong');
        if (parseInt(o.value) === qq.correct) lbl.classList.add('quiz-correct');
        if (sel && o === sel && parseInt(o.value) !== qq.correct) lbl.classList.add('quiz-wrong');
      });
      if (sel && parseInt(sel.value) === qq.correct) score++;
    });
    var msgs = ['\uD83E\uDD14 Try again!', '\uD83D\uDCDA Keep learning!', '\uD83D\uDCAA Almost!', '\uD83C\uDFC6 Perfect!'];
    container.querySelector('#quiz-result').innerHTML = '<div class="callout">You scored ' + score + ' out of 3! \uD83C\uDFAF ' + msgs[score] + '</div><button id="quiz-try-again" class="btn-secondary">\uD83D\uDD04 Try Again</button>';
    showToast('\uD83C\uDF89 Quiz finished!', 'success');
    if (score === 3) GameState.addPoints(topic.points);
    container.querySelector('#quiz-try-again').addEventListener('click', function() {
      showResetConfirmation(function() {
        container.querySelectorAll('#quiz-form input[type="radio"]').forEach(function(r) { r.checked = false; });
        container.querySelectorAll('.quiz-option').forEach(function(lbl) { lbl.classList.remove('quiz-correct', 'quiz-wrong'); });
        container.querySelector('#quiz-result').innerHTML = '';
      });
    });
  });
}

/* ── CHECKLIST: Learning Checklist ── */
function renderChecklistComponent(topic, container) {
  var storageKey = 'tp_checklist_' + topic.title;
  var saved = JSON.parse(localStorage.getItem(storageKey) || '[]');
  var items = topic.funFacts.map(function(f, i) {
    return { text: 'Learn about: ' + f.substring(0, 70) + '...', checked: saved.indexOf(i) !== -1 };
  });
  items.push({ text: 'Share a fact with a friend', checked: saved.indexOf(5) !== -1 });
  var startTime = Date.now();
  function render() {
    var checked = items.filter(function(it) { return it.checked; }).length;
    var total = items.length;
    var pct = Math.round((checked / total) * 100);
    var html = '<div class="checklist-header"><button id="toggle-all">' + (checked === total ? 'Deselect All' : 'Select All') + '</button>' +
      '<span id="time-spent">\uD83D\uDCCA Time Spent: 0s</span></div>' +
      '<div class="progress-container"><div class="progress-bar" role="progressbar" aria-valuenow="' + pct + '" aria-valuemin="0" aria-valuemax="100" style="width:' + pct + '%">' + checked + ' of ' + total + ' completed</div></div>' +
      '<fieldset><legend>' + topic.title + ' Learning Goals</legend>';
    items.forEach(function(it, i) {
      html += '<label><input type="checkbox" name="cl-' + i + '"' + (it.checked ? ' checked' : '') + ' /> ' + it.text + '</label>';
    });
    html += '</fieldset>';
    if (checked === total) html += '<div class="celebration" role="status">\uD83C\uDFC6 Topic Mastered! You earned ' + topic.points + ' points!</div>';
    container.innerHTML = html;
    container.querySelectorAll('input[type="checkbox"]').forEach(function(cb, i) {
      cb.addEventListener('change', function() {
        items[i].checked = this.checked;
        var idxs = []; items.forEach(function(it, idx) { if (it.checked) idxs.push(idx); });
        localStorage.setItem(storageKey, JSON.stringify(idxs));
        render();
        if (items.every(function(it) { return it.checked; })) {
          showToast('\uD83C\uDF89 All items completed! Topic mastered!', 'success');
          GameState.addPoints(topic.points);
        }
      });
    });
    container.querySelector('#toggle-all').addEventListener('click', function() {
      var allChecked = items.every(function(it) { return it.checked; });
      items.forEach(function(it) { it.checked = !allChecked; });
      var idxs = []; items.forEach(function(it, idx) { if (it.checked) idxs.push(idx); });
      localStorage.setItem(storageKey, JSON.stringify(idxs));
      render();
    });
  }
  render();
  setInterval(function() {
    var el = container.querySelector('#time-spent');
    if (el) el.textContent = '\uD83D\uDCCA Time Spent: ' + Math.round((Date.now() - startTime) / 1000) + 's';
  }, 1000);
}

/* ── SLIDER: Guess the Number ── */
function renderSliderComponent(topic, container) {
  var target = Math.floor(Math.random() * 100) + 1;
  var attempts = 0, maxAttempts = 5, won = false;
  container.innerHTML =
    '<div class="slider-game"><h2>\uD83C\uDFAF Guess the Number!</h2>' +
    '<p>I\'m thinking of a number between 1 and 100. Can you guess it?</p>' +
    '<label for="guess-slider">' + topic.title + ' value</label>' +
    '<input type="range" id="guess-slider" min="1" max="100" value="50" aria-describedby="slider-tooltip" />' +
    '<output id="slider-tooltip" for="guess-slider">50</output>' +
    '<button id="lock-guess">Lock In Guess</button>' +
    '<p id="attempt-counter">Attempt 0 of ' + maxAttempts + '</p>' +
    '<div id="guess-feedback" role="alert"></div>' +
    '<div id="reveal-section" hidden></div></div>';
  var slider = container.querySelector('#guess-slider');
  var output = container.querySelector('#slider-tooltip');
  slider.addEventListener('input', function() { output.textContent = this.value; });
  container.querySelector('#lock-guess').addEventListener('click', function() {
    if (won || attempts >= maxAttempts) return;
    attempts++;
    var guess = parseInt(slider.value);
    var diff = Math.abs(guess - target);
    var fb = container.querySelector('#guess-feedback');
    container.querySelector('#attempt-counter').textContent = 'Attempt ' + attempts + ' of ' + maxAttempts;
    if (diff === 0) {
      fb.innerHTML = '<div class="callout">\uD83C\uDF89 Correct! The number was ' + target + '!</div>';
      won = true; GameState.addPoints(topic.points);
      revealFact();
    } else if (diff <= 5) { fb.innerHTML = '<p class="feedback-hot">\uD83D\uDD25 Hot! Very close!</p>'; }
    else if (diff <= 15) { fb.innerHTML = '<p class="feedback-warm">\uD83C\uDF21\uFE0F Warm, getting closer!</p>'; }
    else { fb.innerHTML = '<p class="feedback-cold">\u2744\uFE0F Cold! Try again!</p>'; }
    if (attempts >= maxAttempts && !won) { fb.innerHTML += '<p>The number was <strong>' + target + '</strong>.</p>'; revealFact(); }
  });
  function revealFact() {
    var sec = container.querySelector('#reveal-section');
    sec.hidden = false;
    sec.innerHTML = '<div class="callout">\uD83C\uDF1F Reward: ' + topic.funFacts[Math.floor(Math.random() * topic.funFacts.length)] + '</div>';
  }
}

/* ── DROPDOWN-MENU: Build Your Expedition ── */
function renderDropdownComponent(topic, container) {
  var usedFacts = [];
  var supplyOptions = [
    { value: 'books', label: '\uD83D\uDCDA Research Books' },
    { value: 'telescope', label: '\uD83D\uDD2D Telescope' },
    { value: 'compass', label: '\uD83E\uDDED Compass' },
    { value: 'camera', label: '\uD83D\uDCF7 Camera' },
    { value: 'map', label: '\uD83D\uDDFA\uFE0F Ancient Map' },
    { value: 'water', label: '\uD83D\uDCA7 Water Supply' },
    { value: 'flashlight', label: '\uD83D\uDD26 Flashlight' },
    { value: 'journal', label: '\uD83D\uDCDD Journal' }
  ];
  var MAX_SUPPLIES = 3;

  container.innerHTML =
    '<div class="expedition"><h2>\uD83D\uDDFA\uFE0F Build Your Expedition</h2>' +
    '<p>You\'re planning an expedition to explore ' + topic.title + '. Choose your gear wisely!</p>' +
    '<div class="form-group"><label for="transport">Choose your transport</label>' +
    '<select id="transport"><option value="">-- Select transport --</option>' +
    '<option value="time-machine">' + topic.emoji + ' Time Machine</option>' +
    '<option value="steam-train">\uD83D\uDE82 Steam Engine</option>' +
    '<option value="rocket">\uD83D\uDE80 Rocket Ship</option>' +
    '<option value="horse">\uD83D\uDC0E Horse & Carriage</option>' +
    '<option value="foot">\uD83D\uDEB6 On Foot</option></select></div>' +
    '<div class="form-group"><label>Select your supplies (pick 3)</label>' +
    '<p class="supply-counter" id="supply-counter">Selected: 0 of ' + MAX_SUPPLIES + '</p>' +
    '<div class="supply-checklist" id="supply-checklist">' +
    supplyOptions.map(function(s) {
      return '<label class="supply-option" data-value="' + s.value + '">' +
        '<input type="checkbox" name="supplies" value="' + s.value + '">' +
        '<span class="supply-label">' + s.label + '</span></label>';
    }).join('') +
    '</div>' +
    '<div class="supply-pills" id="supply-pills"></div></div>' +
    '<button id="launch-expedition">\uD83D\uDE80 Launch Expedition</button>' +
    '<div id="expedition-report" hidden></div></div>';

  var checklist = container.querySelector('#supply-checklist');
  var pillsContainer = container.querySelector('#supply-pills');
  var counterEl = container.querySelector('#supply-counter');

  function getChecked() {
    return Array.from(checklist.querySelectorAll('input[name="supplies"]:checked'));
  }

  function syncSupplyUI() {
    var checked = getChecked();
    var count = checked.length;
    counterEl.textContent = 'Selected: ' + count + ' of ' + MAX_SUPPLIES;
    // Disable/enable unchecked checkboxes
    checklist.querySelectorAll('input[name="supplies"]').forEach(function(cb) {
      var row = cb.closest('.supply-option');
      if (cb.checked) {
        cb.disabled = false;
        row.classList.add('selected');
        row.classList.remove('disabled');
      } else if (count >= MAX_SUPPLIES) {
        cb.disabled = true;
        row.classList.add('disabled');
        row.classList.remove('selected');
      } else {
        cb.disabled = false;
        row.classList.remove('disabled');
        row.classList.remove('selected');
      }
    });
    // Render pills
    pillsContainer.innerHTML = checked.map(function(cb) {
      var opt = supplyOptions.find(function(s) { return s.value === cb.value; });
      return '<span class="supply-pill" data-value="' + cb.value + '">' +
        opt.label + ' <button type="button" class="pill-remove" aria-label="Remove ' + opt.label + '">\u2715</button></span>';
    }).join('');
  }

  checklist.addEventListener('change', function() { syncSupplyUI(); });

  pillsContainer.addEventListener('click', function(e) {
    var btn = e.target.closest('.pill-remove');
    if (!btn) return;
    var pill = btn.closest('.supply-pill');
    var val = pill.getAttribute('data-value');
    var cb = checklist.querySelector('input[value="' + val + '"]');
    if (cb) { cb.checked = false; }
    syncSupplyUI();
  });

  container.querySelector('#launch-expedition').addEventListener('click', function() {
    var transport = container.querySelector('#transport').value;
    var supplies = getChecked().map(function(cb) { return cb.value; });
    var report = container.querySelector('#expedition-report');
    if (!transport) { showToast('Please select a transport!', 'error'); return; }
    var factIdx = usedFacts.length % topic.funFacts.length;
    var fact = topic.funFacts[factIdx];
    usedFacts.push(factIdx);
    var outcome, cls;
    if (transport === 'time-machine' && supplies.length >= 3) {
      outcome = '\uD83C\uDFC6 Perfect expedition! You discovered: ' + fact;
      cls = 'report-perfect';
    } else if (supplies.length >= 2) {
      outcome = '\u26A0\uFE0F You forgot essential supplies! But you still learned: ' + fact;
      cls = 'report-ok';
    } else {
      outcome = '\uD83D\uDE05 Rough journey, but you survived! Fun fact: ' + fact;
      cls = 'report-rough';
    }
    report.hidden = false;
    report.className = 'expedition-report card ' + cls;
    report.innerHTML = '<h3>Expedition Report</h3><p>' + outcome + '</p><button id="try-again">\uD83D\uDD04 Try Again</button>';
    report.querySelector('#try-again').addEventListener('click', function() {
      showResetConfirmation(function() {
        container.querySelector('#transport').value = '';
        checklist.querySelectorAll('input[name="supplies"]').forEach(function(cb) { cb.checked = false; });
        syncSupplyUI();
        report.hidden = true;
      });
    });
    GameState.addPoints(topic.points);
    showToast('\uD83C\uDF89 Expedition complete!', 'success');
  });
}

/* ── TOGGLE-PANEL: Mystery Reveal ── */
function renderToggleComponent(topic, container) {
  var riddle = { text: 'I can make straight lines seem curved, identical colors look different, and still images appear to move. What am I?', answer: 'illusion' };
  var unlocked = false;
  container.innerHTML =
    '<div class="mystery-section"><h2>\uD83D\uDD13 Mystery Reveal</h2>' +
    '<div class="riddle-box card"><h3>\uD83E\uDDE9 Solve the Riddle to Unlock</h3><p><em>' + riddle.text + '</em></p>' +
    '<div class="form-group"><label for="riddle-answer">Your answer</label>' +
    '<input type="text" id="riddle-answer" placeholder="Type your answer..." /></div>' +
    '<button id="check-riddle">Check Answer</button></div>' +
    '<div id="reveal-panel" hidden><h3>\uD83C\uDF1F Unlocked Content</h3><iframe src="embed.html" title="Bonus content about ' + topic.title + '" width="100%" height="300" style="border:1px solid var(--color-border);border-radius:var(--radius);"></iframe></div>' +
    '<hr />' +
    '<button id="reset-progress">\uD83D\uDDD1\uFE0F Reset Progress</button></div>';
  container.querySelector('#check-riddle').addEventListener('click', function() {
    var ans = container.querySelector('#riddle-answer').value.toLowerCase().trim();
    if (ans.includes(riddle.answer)) {
      unlocked = true;
      container.querySelector('#reveal-panel').hidden = false;
      showToast('\uD83C\uDF89 Correct! Content unlocked!', 'success');
      GameState.addPoints(topic.points);
    } else {
      showToast('\u274C Not quite. Try again!', 'error');
    }
  });
  container.querySelector('#reset-progress').addEventListener('click', function() {
    if (confirm('Are you sure you want to reset your progress for this topic?')) {
      container.querySelector('#reveal-panel').hidden = true;
      container.querySelector('#riddle-answer').value = '';
      unlocked = false;
      showToast('Progress reset.', 'info');
    }
  });
  /* Double-click title to copy */
  var h1 = document.querySelector('h1');
  if (h1) h1.addEventListener('dblclick', function() { copyToClipboard(topic.title); });
}

/* ── SEARCH-FILTER: Scavenger Hunt ── */
function renderSearchComponent(topic, container) {
  var allFacts = topic.funFacts.slice();
  fetchTopics().then(function(topics) {
    topics.forEach(function(t) {
      if (t.title !== topic.title) allFacts.push.apply(allFacts, t.funFacts.slice(0, 2));
    });
    /* Build specific, unique clues from the first 3 funFacts */
    var clueHints = [
      { hint: '\uD83D\uDD0D Find the fact about a whistled language on an island', idx: 1 },
      { hint: '\uD83D\uDD0D Find the fact about a language discovered in 2010', idx: 3 },
      { hint: '\uD83D\uDD0D Find the fact about Australian languages learned by children', idx: 2 }
    ];
    var clues = clueHints.map(function(ch) {
      return { hint: ch.hint, fact: topic.funFacts[ch.idx], found: false };
    });
    var found = 0;

    /* ── Build static shell (never re-rendered) ── */
    container.innerHTML =
      '<h2>\uD83D\uDD0E Scavenger Hunt</h2>' +
      '<div class="scavenger-panel card">' +
      '<p>Find these facts hidden in the list below! Click a fact to check if it matches a clue.</p>' +
      '<div id="clue-list"></div>' +
      '<p id="hunt-progress">' + found + ' of 3 clues discovered!</p></div>' +
      '<div id="search-controls" class="search-controls">' +
      '<label for="fact-search">Search</label>' +
      '<input type="search" id="fact-search" placeholder="Search facts..." />' +
      '<button id="clear-search" class="btn-secondary">Clear</button>' +
      '<a id="download-results" href="#" target="_blank" class="btn-secondary">Download Results</a></div>' +
      '<p id="results-count" class="results-count"></p>' +
      '<div id="results-feedback" role="alert" aria-live="polite"></div>' +
      '<ul id="results-list" class="search-results" aria-label="Filtered results"></ul>';

    var searchInput = container.querySelector('#fact-search');
    var clearBtn = container.querySelector('#clear-search');
    var downloadLink = container.querySelector('#download-results');
    var resultsCount = container.querySelector('#results-count');
    var resultsList = container.querySelector('#results-list');
    var resultsFeedback = container.querySelector('#results-feedback');
    var clueListEl = container.querySelector('#clue-list');
    var huntProgress = container.querySelector('#hunt-progress');

    function renderClues() {
      var html = '';
      clues.forEach(function(c) {
        html += '<div class="clue-item' + (c.found ? ' clue-found' : '') + '"><span>' + (c.found ? '\u2705' : '\u2B1C') + ' ' + c.hint + '</span></div>';
      });
      clueListEl.innerHTML = html;
      huntProgress.textContent = found + ' of 3 clues discovered!';
    }

    function renderResults(filter) {
      filter = (filter || '').toLowerCase();
      var filtered = filter ? allFacts.filter(function(f) { return f.toLowerCase().includes(filter); }) : allFacts;
      resultsCount.textContent = 'Showing ' + filtered.length + ' of ' + allFacts.length + ' facts';
      resultsList.innerHTML = '';
      if (filtered.length === 0) {
        resultsList.innerHTML = '<li class="empty-state">No results found \uD83D\uDD0D</li>';
      } else {
        filtered.forEach(function(f) {
          var isClue = clues.some(function(c) { return c.fact === f; });
          var isFound = clues.some(function(c) { return c.fact === f && c.found; });
          var li = document.createElement('li');
          li.className = 'search-result-item' + (isClue ? ' clue-target' : '') + (isFound ? ' clue-matched' : '');
          li.setAttribute('data-fact', f);
          li.textContent = f;
          /* Click to check clue match */
          li.addEventListener('click', function() {
            var factText = this.getAttribute('data-fact');
            var matched = false;
            clues.forEach(function(c) {
              if (!c.found && c.fact === factText) {
                c.found = true; found++; matched = true;
                showToast('\u2705 Found! ' + found + ' of 3 clues discovered!', 'success');
                if (found === 3) { showToast('\uD83C\uDF89 Scavenger hunt complete!', 'success'); GameState.addPoints(20); }
              }
            });
            if (matched) {
              this.classList.add('clue-matched');
              renderClues();
              if (found === 3 && !container.querySelector('#hunt-try-again')) {
                var tryAgainBtn = document.createElement('button');
                tryAgainBtn.id = 'hunt-try-again';
                tryAgainBtn.className = 'btn-secondary';
                tryAgainBtn.textContent = '\uD83D\uDD04 Try Again';
                tryAgainBtn.addEventListener('click', function() {
                  showResetConfirmation(function() {
                    found = 0;
                    clues.forEach(function(c) { c.found = false; });
                    renderClues();
                    renderResults(searchInput.value);
                    var btn = container.querySelector('#hunt-try-again');
                    if (btn) btn.remove();
                  });
                });
                huntProgress.parentNode.appendChild(tryAgainBtn);
              }
            } else {
              resultsFeedback.textContent = '\u274C That\u2019s not one of the clues \u2014 keep looking!';
              setTimeout(function() { resultsFeedback.textContent = ''; }, 2000);
            }
          });
          /* Right-click context menu */
          li.addEventListener('contextmenu', function(e) {
            e.preventDefault();
            var factText = this.getAttribute('data-fact');
            var existing = document.querySelector('.context-menu');
            if (existing) existing.remove();
            var menu = document.createElement('div');
            menu.className = 'context-menu';
            menu.style.top = e.pageY + 'px'; menu.style.left = e.pageX + 'px';
            menu.innerHTML = '<button class="ctx-copy">\uD83D\uDCCB Copy Fact</button><button class="ctx-share">\uD83D\uDCE4 Share</button>';
            document.body.appendChild(menu);
            menu.querySelector('.ctx-copy').addEventListener('click', function() { copyToClipboard(factText); menu.remove(); });
            menu.querySelector('.ctx-share').addEventListener('click', function() { copyToClipboard('Did you know? ' + factText + ' \u2014 from Testing Playground'); menu.remove(); });
            document.addEventListener('click', function handler() { menu.remove(); document.removeEventListener('click', handler); }, { once: true });
          });
          resultsList.appendChild(li);
        });
      }
      /* Update download link */
      var blob = new Blob([filtered.join('\n\n')], { type: 'text/plain' });
      downloadLink.href = URL.createObjectURL(blob);
      downloadLink.download = 'facts.txt';
    }

    /* Event listeners on stable elements — never destroyed */
    searchInput.addEventListener('input', function() { renderResults(this.value); });
    clearBtn.addEventListener('click', function() { searchInput.value = ''; renderResults(''); searchInput.focus(); });

    /* Initial render */
    renderClues();
    renderResults('');
  });
}

/* ══════════════════════════════════════════
   DASHBOARD INITIALIZATION
   ══════════════════════════════════════════ */
async function initDashboard() {
  var params = new URLSearchParams(window.location.search);
  var topicTitle = params.get('topic');
  var main = document.querySelector('main');
  if (!main) return;
  if (!topicTitle) {
    /* Auth guard — dashboard view requires authentication */
    if (!localStorage.getItem('authToken')) {
      showToast('\u26A0\uFE0F Please log in to access the dashboard.', 'error');
      window.location.href = 'signin.html?redirect=dashboard';
      return;
    }
    /* No topic selected — show topic grid with search & pagination */
    main.className = 'container';
    main.innerHTML = '<h1>\uD83E\uDDEA Choose a Topic</h1><p>Select a topic to begin exploring. Each one features a unique interactive component!</p>' +
      '<div class="dash-search-bar"><div class="dash-search-input-wrap">' +
      '<input type="search" id="dash-search" placeholder="Search topics..." aria-label="Search topics" />' +
      '<button id="dash-search-clear" class="dash-search-clear" aria-label="Clear search" hidden>\u2715</button></div></div>' +
      '<div id="dash-topic-grid" class="topic-grid"></div>' +
      '<div id="dash-no-results" class="empty-state" hidden></div>' +
      '<nav aria-label="Topic pagination" id="dash-pagination" class="dash-pagination"></nav>';
    var topics = await fetchTopics();
    var dashPage = 0, perPage = 4;
    var searchInput = main.querySelector('#dash-search');
    var clearBtn = main.querySelector('#dash-search-clear');
    var grid = main.querySelector('#dash-topic-grid');
    var noResults = main.querySelector('#dash-no-results');
    var paginationEl = main.querySelector('#dash-pagination');
    function getFilteredTopics() {
      var term = (searchInput.value || '').toLowerCase().trim();
      if (!term) return topics;
      return topics.filter(function(t) { return t.title.toLowerCase().indexOf(term) !== -1; });
    }
    function renderDashGrid() {
      var filtered = getFilteredTopics();
      var totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
      if (dashPage >= totalPages) dashPage = Math.max(0, totalPages - 1);
      var start = dashPage * perPage;
      var pageTopics = filtered.slice(start, start + perPage);
      grid.classList.add('dash-grid-fade-out');
      setTimeout(function() {
        grid.innerHTML = '';
        if (filtered.length === 0) {
          grid.hidden = true;
          noResults.hidden = false;
          noResults.textContent = 'No topics found for \u201C' + searchInput.value + '\u201D.';
          paginationEl.innerHTML = '';
        } else {
          grid.hidden = false;
          noResults.hidden = true;
          pageTopics.forEach(function(t) {
            var explored = GameState.isExplored(t.title);
            var d = document.createElement('a');
            d.href = 'dashboard.html?topic=' + encodeURIComponent(t.title);
            d.className = 'topic-card card';
            d.innerHTML = '<div class="topic-card-emoji">' + t.emoji + '</div>' +
              '<h3>' + t.title + '</h3>' +
              '<div class="topic-badges"><span class="badge badge-category">' + t.category + '</span>' +
              '<span class="badge badge-' + t.difficulty.toLowerCase() + '">' + t.difficulty + '</span>' +
              '<span class="badge badge-points">\uD83C\uDFC6 ' + t.points + 'pts</span></div>' +
              '<p>' + t.hook + '</p>' +
              '<span class="badge ' + (explored ? 'badge-explored' : 'badge-new') + '">' + (explored ? '\u2705 Explored' : '\uD83C\uDD95 New') + '</span>';
            grid.appendChild(d);
          });
          if (totalPages > 1) {
            paginationEl.innerHTML =
              '<button id="dash-prev"' + (dashPage === 0 ? ' disabled' : '') + '>\u2190 Previous</button>' +
              '<span>Page ' + (dashPage + 1) + ' of ' + totalPages + '</span>' +
              '<button id="dash-next"' + (dashPage >= totalPages - 1 ? ' disabled' : '') + '>Next \u2192</button>';
            paginationEl.querySelector('#dash-prev').addEventListener('click', function() {
              if (dashPage > 0) { dashPage--; renderDashGrid(); }
            });
            paginationEl.querySelector('#dash-next').addEventListener('click', function() {
              if (dashPage < totalPages - 1) { dashPage++; renderDashGrid(); }
            });
          } else {
            paginationEl.innerHTML = '';
          }
        }
        grid.classList.remove('dash-grid-fade-out');
      }, 150);
    }
    searchInput.addEventListener('input', function() {
      clearBtn.hidden = !this.value;
      dashPage = 0;
      renderDashGrid();
    });
    clearBtn.addEventListener('click', function() {
      searchInput.value = '';
      clearBtn.hidden = true;
      dashPage = 0;
      renderDashGrid();
      searchInput.focus();
    });
    renderDashGrid();
    return;
  }
  /* Update breadcrumb */
  var bc = document.querySelector('.breadcrumb [aria-current="page"]');
  if (bc) bc.textContent = topicTitle;
  /* Show loader */
  main.innerHTML = '<div class="loading-spinner" role="status"><div class="spinner"></div><p>Loading...</p></div>';
  await simulateDelay(1200);
  var topic = await fetchTopicByTitle(topicTitle);
  if (!topic) {
    main.innerHTML = '<div class="container"><h1>Topic Not Found</h1><p>Sorry, we couldn\'t find that topic.</p></div>';
    return;
  }
  GameState.markExplored(topic.title);
  GameState.recordVisit();
  main.className = 'container';
  main.innerHTML =
    '<div class="topic-header"><span class="topic-emoji-lg">' + topic.emoji + '</span>' +
    '<h1>' + topic.title + '</h1>' +
    '<div class="topic-badges"><span class="badge badge-category">' + topic.category + '</span>' +
    '<span class="badge badge-' + topic.difficulty.toLowerCase() + '">' + topic.difficulty + '</span>' +
    '<span class="badge badge-points">\uD83C\uDFC6 ' + topic.points + ' points</span></div></div>' +
    '<div class="callout">\uD83D\uDCA1 <strong>Did you know?</strong> ' + topic.coreFact + '</div>' +
    '<p class="topic-hook"><em>' + topic.hook + '</em></p>' +
    '<section class="topic-component" aria-label="' + topic.title + ' interactive component">' +
    '<div class="component-loading" aria-label="Loading content"><div class="spinner"></div><p>Loading content...</p></div></section>';
  await simulateDelay(1500);
  var componentSection = main.querySelector('.topic-component');
  componentSection.innerHTML = '';
  renderComponent(topic, componentSection);
}

/* ══════════════════════════════════════════
   LANDING PAGE (index.html)
   ══════════════════════════════════════════ */
async function initLandingPage() {
  var grid = document.getElementById('topic-grid');
  var stats = document.getElementById('stats-section');
  if (!grid) return;
  var topics = await fetchTopics();
  topics.forEach(function(t) {
    var explored = GameState.isExplored(t.title);
    var a = document.createElement('a');
    a.href = 'dashboard.html?topic=' + encodeURIComponent(t.title);
    a.className = 'topic-card card';
    a.innerHTML = '<div class="topic-card-emoji">' + t.emoji + '</div>' +
      '<h3>' + t.title + '</h3>' +
      '<div class="topic-badges"><span class="badge badge-category">' + t.category + '</span>' +
      '<span class="badge badge-' + t.difficulty.toLowerCase() + '">' + t.difficulty + '</span>' +
      '<span class="badge badge-points">\uD83C\uDFC6 ' + t.points + 'pts</span></div>' +
      '<p>' + t.hook + '</p>' +
      '<span class="badge ' + (explored ? 'badge-explored' : 'badge-new') + '">' + (explored ? '\u2705 Explored' : '\uD83C\uDD95 New') + '</span>' +
      '<span class="try-link">Try it \u2192</span>';
    grid.appendChild(a);
  });
  /* Animate stat counters */
  if (stats) {
    var observer = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          entry.target.querySelectorAll('.stat-number').forEach(function(el) {
            var end = parseInt(el.getAttribute('data-target'));
            var duration = 1500, start = 0, startTime = null;
            function step(ts) {
              if (!startTime) startTime = ts;
              var progress = Math.min((ts - startTime) / duration, 1);
              el.textContent = Math.floor(progress * end) + (el.getAttribute('data-suffix') || '');
              if (progress < 1) requestAnimationFrame(step);
            }
            requestAnimationFrame(step);
          });
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });
    observer.observe(stats);
  }
}

/* ══════════════════════════════════════════
   TASKBOARD (drag and drop)
   ══════════════════════════════════════════ */
function initTaskboard() {
  var board = document.getElementById('taskboard');
  if (!board) return;
  var storageKey = 'tp_taskboard';
  var defaultTasks = [
    { id: 1, name: 'Explore Deep Ocean', emoji: '\uD83C\uDF0A', time: '5 min', diff: 'Intermediate', col: 'todo' },
    { id: 2, name: 'Study Ancient Civilizations', emoji: '\uD83C\uDFDB\uFE0F', time: '10 min', diff: 'Beginner', col: 'todo' },
    { id: 3, name: 'Discover Human Body', emoji: '\uD83E\uDDEC', time: '8 min', diff: 'Beginner', col: 'todo' },
    { id: 4, name: 'Space Exploration Quiz', emoji: '\uD83D\uDE80', time: '15 min', diff: 'Advanced', col: 'todo' },
    { id: 5, name: 'Crack Codes', emoji: '\uD83D\uDD10', time: '12 min', diff: 'Advanced', col: 'todo' },
    { id: 6, name: 'Optical Illusions Mystery', emoji: '\uD83C\uDFAD', time: '7 min', diff: 'Beginner', col: 'todo' }
  ];
  var tasks = JSON.parse(localStorage.getItem(storageKey)) || defaultTasks;
  function save() { localStorage.setItem(storageKey, JSON.stringify(tasks)); }
  function render() {
    ['todo', 'progress', 'done'].forEach(function(col) {
      var el = board.querySelector('#col-' + col);
      if (!el) return;
      var body = el.querySelector('.col-body');
      body.innerHTML = '';
      tasks.filter(function(t) { return t.col === col; }).forEach(function(t) {
        var card = document.createElement('div');
        card.className = 'task-card card';
        card.draggable = true;
        card.setAttribute('data-id', t.id);
        card.innerHTML = '<span class="task-emoji">' + t.emoji + '</span> <strong>' + t.name + '</strong>' +
          '<div class="task-meta"><span>\u23F1 ' + t.time + '</span> <span class="badge badge-' + t.diff.toLowerCase() + '">' + t.diff + '</span></div>';
        card.addEventListener('dragstart', function(e) {
          e.dataTransfer.setData('text/plain', t.id);
          this.classList.add('dragging');
        });
        card.addEventListener('dragend', function() { this.classList.remove('dragging'); });
        body.appendChild(card);
      });
    });
  }
  board.querySelectorAll('.task-column').forEach(function(col) {
    col.addEventListener('dragover', function(e) { e.preventDefault(); this.classList.add('drag-over'); });
    col.addEventListener('dragleave', function() { this.classList.remove('drag-over'); });
    col.addEventListener('drop', function(e) {
      e.preventDefault();
      this.classList.remove('drag-over');
      var id = parseInt(e.dataTransfer.getData('text/plain'));
      var colName = this.id.replace('col-', '');
      tasks.forEach(function(t) { if (t.id === id) t.col = colName; });
      save(); render();
    });
  });
  render();
}

/* ══════════════════════════════════════════
   GLOBAL UI FEATURES
   ══════════════════════════════════════════ */
function initGlobalUI() {
  var header = document.querySelector('.site-header');
  var nav = document.querySelector('.primary-nav');
  if (!nav) return;
  /* Nav extras container */
  var extras = document.createElement('div');
  extras.className = 'nav-extras';
  extras.innerHTML =
    '<span id="score-display" title="Your total score">\uD83C\uDFC6 <span id="score-value">0/300</span></span>' +
    '<span id="streak-display" title="Daily streak">\uD83D\uDD25 <span id="streak-value">0</span></span>' +
    '<span id="countdown-display" role="timer" title="Daily challenge countdown">\u23F1\uFE0F <span id="countdown-value"></span></span>' +
    '<button id="notif-bell" aria-label="Notifications" class="nav-icon-btn">\uD83D\uDD14 <span id="notif-count" class="notif-badge" hidden>0</span></button>' +
    '<button id="dark-mode-toggle" aria-label="Toggle dark mode" class="nav-icon-btn">' + (document.documentElement.classList.contains('dark-mode') ? '\u2600\uFE0F' : '\uD83C\uDF19') + '</button>';
  nav.appendChild(extras);
  /* Hamburger */
  var hamburger = document.createElement('button');
  hamburger.className = 'hamburger-btn';
  hamburger.setAttribute('aria-expanded', 'false');
  hamburger.setAttribute('aria-label', 'Toggle navigation menu');
  hamburger.textContent = '\u2630';
  var ul = nav.querySelector('.primary-nav-links');
  if (ul) { nav.insertBefore(hamburger, ul); }
  hamburger.addEventListener('click', function() {
    var expanded = this.getAttribute('aria-expanded') === 'true';
    this.setAttribute('aria-expanded', String(!expanded));
    if (header) header.classList.toggle('nav-open');
    this.textContent = expanded ? '\u2630' : '\u2715';
  });
  /* Adjust body padding to match actual header height */
  if (header) {
    document.body.style.paddingTop = header.offsetHeight + 'px';
    window.addEventListener('resize', function() {
      document.body.style.paddingTop = header.offsetHeight + 'px';
    });
  }
  /* Dark mode */
  document.getElementById('dark-mode-toggle').addEventListener('click', toggleDarkMode);
  /* Notification bell */
  var bellBtn = document.getElementById('notif-bell');
  var dropdown = document.createElement('div');
  dropdown.className = 'notification-dropdown';
  dropdown.hidden = true;
  bellBtn.parentElement.appendChild(dropdown);
  bellBtn.addEventListener('click', function(e) {
    e.stopPropagation();
    dropdown.hidden = !dropdown.hidden;
    if (!dropdown.hidden) {
      var achievements = GameState.getAchievements();
      dropdown.innerHTML = achievements.length
        ? achievements.map(function(a) { return '<div class="notif-item">' + a + '</div>'; }).join('')
        : '<div class="notif-item">No achievements yet. Start exploring!</div>';
    }
  });
  document.addEventListener('click', function() { dropdown.hidden = true; });
  /* Update auth UI */
  var username = sessionStorage.getItem('tp_username');
  if (username && ul) {
    var loginItem = ul.querySelector('a[href="signin.html"]');
    var signupItem = ul.querySelector('a[href="create-account.html"]');
    if (loginItem) {
      loginItem.textContent = 'Logout';
      loginItem.href = '#';
      loginItem.addEventListener('click', function(e) {
        e.preventDefault();
        sessionStorage.removeItem('tp_username');
        localStorage.removeItem('authToken');
        showToast('You\'ve been logged out.', 'info');
        setTimeout(function() { window.location.href = 'signin.html'; }, 500);
      });
    }
    if (signupItem) signupItem.parentElement.remove();
    var welcomeEl = document.createElement('span');
    welcomeEl.className = 'welcome-user';
    welcomeEl.textContent = 'Welcome, ' + username + ' \uD83D\uDC4B';
    extras.insertBefore(welcomeEl, extras.firstChild);
  }
  /* Countdown to midnight */
  function updateCountdown() {
    var now = new Date();
    var midnight = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
    var diff = midnight - now;
    var h = Math.floor(diff / 3600000);
    var m = Math.floor((diff % 3600000) / 60000);
    var s = Math.floor((diff % 60000) / 1000);
    var el = document.getElementById('countdown-value');
    if (el) el.textContent = String(h).padStart(2, '0') + ':' + String(m).padStart(2, '0') + ':' + String(s).padStart(2, '0');
    if (h === 0 && m === 0 && s === 0) showToast('\uD83C\uDF89 New daily challenge available!', 'success');
  }
  updateCountdown();
  setInterval(updateCountdown, 1000);
  /* Back to top */
  var btt = document.createElement('button');
  btt.className = 'back-to-top';
  btt.setAttribute('aria-label', 'Back to top');
  btt.textContent = '\u2191';
  btt.hidden = true;
  document.body.appendChild(btt);
  window.addEventListener('scroll', function() { btt.hidden = window.scrollY < 200; });
  btt.addEventListener('click', function() { window.scrollTo({ top: 0, behavior: 'smooth' }); });
  /* Footer */
  if (!document.querySelector('.site-footer')) {
    var footer = document.createElement('footer');
    footer.className = 'site-footer';
    footer.innerHTML =
      '<div class="footer-content">' +
      '<img src="data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'32\' height=\'32\'%3E%3Ctext y=\'28\' font-size=\'28\'%3E\uD83E\uDDEA%3C/text%3E%3C/svg%3E" alt="Testing Playground logo" class="footer-logo" />' +
      '<p>\u00A9 2025 Testing Playground \u2014 Learn, Explore, Test</p>' +
      '<p>Made with \u2764\uFE0F for the testing community</p>' +
      '<div class="footer-links">' +
      '<a href="https://github.com" target="_blank" rel="noopener" aria-label="Visit our GitHub repository">GitHub</a>' +
      '<a href="https://twitter.com" target="_blank" rel="noopener" aria-label="Follow us on Twitter">Twitter</a>' +
      '<a href="https://discord.com" target="_blank" rel="noopener" aria-label="Join our Discord community">Discord</a>' +
      '</div></div>';
    document.body.appendChild(footer);
  }
  /* Update gamification display */
  GameState.recordVisit();
  GameState.updateUI();
}

/* ══════════════════════════════════════════
   MAIN INITIALIZATION
   ══════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', function() {
  /* ── Auth: Sign-in form (PRESERVED + enhancements) ── */
  var signinForm = document.getElementById('signin-form');
  if (signinForm) {
    signinForm.addEventListener('submit', function(event) {
      event.preventDefault();
      var email = document.getElementById('email').value;
      var password = document.getElementById('password').value;
      var error = document.getElementById('signin-error');
      if (email === validEmail && password === validPassword) {
        sessionStorage.setItem('tp_username', email.split('@')[0]);
        sessionStorage.setItem('tp_show_login_toast', 'true');
        localStorage.setItem('authToken', 'mock-jwt-token-12345');
        var redirectParam = new URLSearchParams(window.location.search).get('redirect');
        var safeRedirects = ['dashboard'];
        window.location.href = (redirectParam && safeRedirects.indexOf(redirectParam) !== -1) ? redirectParam + '.html' : 'dashboard.html';
      } else {
        error.textContent = 'Invalid email or password.';
        showToast('Invalid email or password.', 'error');
      }
    });
  }

  /* ── Auth: Create-account form (PRESERVED + enhancements) ── */
  var createForm = document.getElementById('create-account-form');
  if (createForm) {
    createForm.addEventListener('submit', function(event) {
      event.preventDefault();
      var message = document.getElementById('create-account-message');
      message.textContent = 'Account created successfully!';
      showToast('\u2705 Account created successfully!', 'success');
    });
  }

  /* ── Global UI ── */
  initGlobalUI();

  /* ── Login Welcome Toast ── */
  if (sessionStorage.getItem('tp_show_login_toast') === 'true') {
    sessionStorage.removeItem('tp_show_login_toast');
    showToast('\u2705 Welcome back!', 'success');
  }

  /* ── Page-specific initialization ── */
  if (document.getElementById('topic-grid')) initLandingPage();
  if (document.querySelector('main') && window.location.pathname.includes('dashboard')) initDashboard();
  if (document.getElementById('taskboard')) initTaskboard();
});
