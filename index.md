---
layout: home
title: Learn with me Digest
---

Short entries on Development, Testing, AI, and Processes — real problems
from real work, written up as I work through them.

<img src="{{ '/assets/images/profile.jpg' | relative_url }}" alt="Yevhen Prodan" style="width:140px; height:140px; border-radius:50%; object-fit:cover; float:left; margin:0 1.5rem 1rem 0;">

I'm Yevhen (Eugene) Prodan, AI Quality Lead / AI Agent Architect for Quality
Engineering at Luxoft, with 18+ years in test and project management for
automotive software. This blog is where I think in public: I write up what
I'm running into so I understand it better, and so others working on the
same problems have something to compare notes against. More about me:
[About Me]({{ '/about/' | relative_url }}).

<div style="clear:both;"></div>

Browse by topic:

<style>
.category-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 0.75rem;
  margin: 1.5rem 0;
}
@media (max-width: 600px) {
  .category-grid { grid-template-columns: repeat(2, 1fr); }
}
@media (min-width: 1300px) {
  .category-grid { grid-template-columns: repeat(5, 1fr); }
}
.category-button {
  display: block;
  text-align: center;
  padding: 0.75rem 0.5rem;
  font-size: 1rem;
  font-weight: 600;
  border: 2px solid #2a7ae2;
  border-radius: 6px;
  color: #2a7ae2;
  text-decoration: none;
  transition: background-color 0.15s ease, color 0.15s ease;
}
.category-button:hover {
  background-color: #2a7ae2;
  color: #fff;
}
.category-button--news {
  border-color: #e2622a;
  color: #e2622a;
  font-weight: 700;
}
.category-button.is-active { background-color: #2a7ae2; color: #fff; }
.category-button--news.is-active { background-color: #e2622a; color: #fff; }
.category-button--news:hover {
  background-color: #e2622a;
  color: #fff;
}
</style>

<div class="category-grid">
  <a class="category-button" data-filter="development" href="{{ '/development/' | relative_url }}">Development</a>
  <a class="category-button" data-filter="testing" href="{{ '/testing/' | relative_url }}">Testing</a>
  <a class="category-button" data-filter="ai" href="{{ '/ai/' | relative_url }}">AI</a>
  <a class="category-button" data-filter="processes" href="{{ '/processes/' | relative_url }}">Processes</a>
  <a class="category-button category-button--news" data-filter="news" href="{{ '/news/' | relative_url }}">News Around the World</a>
</div>

{% if site.posts.size > 0 %}
<ul class="post-list-home">
  {% for post in site.posts %}
  <li data-topics="{{ post.topics | join: ' ' }}">
    <a class="home-post-title" href="{{ post.url | relative_url }}">{{ post.title }}</a>
    {%- assign labels = "" -%}
    {%- for t in post.topics -%}
      {%- if t == "ai" -%}{%- assign label = "AI" -%}{%- else -%}{%- assign label = t | capitalize -%}{%- endif -%}
      {%- assign labels = labels | append: label | append: "|" -%}
    {%- endfor -%}
    {%- assign labels = labels | split: "|" %}
    <span class="post-topics">{{ labels | join: " · " }}</span>
  </li>
  {% endfor %}
</ul>
{%- assign news_days = site.news | sort: "date" | reverse %}
<ul class="post-list-home" id="home-news-days" hidden>
  {% for day in news_days %}
  <li>
    <a class="home-post-title" href="{{ day.url | relative_url }}">{{ day.date | date: "%A, %-d %B %Y" }}</a>
    {%- assign rubrics = "" -%}
    {%- assign parts = day.content | split: "<h2" -%}
    {%- for part in parts offset: 1 -%}
      {%- assign name = part | split: "</h2>" | first | split: ">" | last | remove: ":" | strip -%}
      {%- assign rubrics = rubrics | append: name | append: "|" -%}
    {%- endfor -%}
    {%- assign rubrics = rubrics | split: "|" %}
    <span class="post-topics">{{ rubrics | join: " · " }}</span>
  </li>
  {% endfor %}
</ul>
<p id="home-list-empty" class="post-topics" hidden>No entries on this topic yet.</p>
<script>
(function () {
  var buttons = document.querySelectorAll('.category-button[data-filter]');
  var posts = document.querySelector('.post-list-home:not(#home-news-days)');
  var news = document.getElementById('home-news-days');
  var empty = document.getElementById('home-list-empty');
  function apply(filter) {
    buttons.forEach(function (b) { b.classList.toggle('is-active', b.dataset.filter === filter); b.setAttribute('aria-pressed', b.dataset.filter === filter); });
    news.hidden = filter !== 'news';
    posts.hidden = filter === 'news';
    var shown = 0;
    posts.querySelectorAll('li').forEach(function (li) {
      var on = !filter || (' ' + li.dataset.topics + ' ').indexOf(' ' + filter + ' ') >= 0;
      li.hidden = !on; if (on) shown++;
    });
    empty.hidden = filter === 'news' || shown > 0;
  }
  buttons.forEach(function (b) {
    b.addEventListener('click', function (e) {
      e.preventDefault();
      var next = b.classList.contains('is-active') ? '' : b.dataset.filter;
      history.replaceState(null, '', next ? '#' + next : location.pathname + location.search);
      apply(next);
    });
  });
  var start = location.hash.slice(1);
  apply(document.querySelector('.category-button[data-filter="' + start + '"]') ? start : '');
})();
</script>
<style>
.post-list-home { display: grid; justify-content: start; grid-template-columns: auto minmax(0, max-content) max-content; column-gap: 0.6em; align-items: baseline; list-style: none; }
.post-list-home li { display: contents; }
.post-list-home[hidden], .post-list-home li[hidden] { display: none; }
.post-list-home li::before { content: "•"; }
.post-list-home .home-post-title { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.post-list-home .post-topics { margin-left: 0.9em; white-space: nowrap; }
.post-topics { color: #828282; font-size: 0.9em; }
/* Phones: full width, no bullets; full title wraps, tags on their own line below. */
@media (max-width: 800px) {
  .post-list-home { display: block; margin-left: 0; }
  .post-list-home li { display: block; padding: 7px 0; }
  .post-list-home li::before { content: none; }
  .post-list-home .home-post-title { display: block; white-space: normal; line-height: 1.3; }
  .post-list-home .post-topics { display: block; margin: 2px 0 0; }
}
</style>
{% else %}
<p>No entries yet.</p>
{% endif %}
