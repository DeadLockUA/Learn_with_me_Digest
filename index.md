---
layout: home
title: Learn with me Digest
---

<section class="home-hero">
  <img class="home-hero__avatar" src="{{ '/assets/images/profile.jpg' | relative_url }}" alt="Yevhen Prodan">
  <div>
    <p class="home-hero__tagline">Short entries on Development, Testing, AI, and Processes — real problems from real work, written up as I work through them.</p>
    <p class="home-hero__bio">I'm Yevhen (Eugene) Prodan, AI Quality Lead / AI Agent Architect for Quality Engineering at Luxoft, with 18+ years in test and project management for automotive software. This blog is where I think in public: I write up what I'm running into so I understand it better, and so others working on the same problems have something to compare notes against. <a href="{{ '/about/' | relative_url }}">More about me</a>.</p>
  </div>
</section>

{% assign dev_posts  = site.posts | where_exp: "p", "p.topics contains 'development'" %}
{% assign test_posts = site.posts | where_exp: "p", "p.topics contains 'testing'" %}
{% assign ai_posts   = site.posts | where_exp: "p", "p.topics contains 'ai'" %}
{% assign proc_posts = site.posts | where_exp: "p", "p.topics contains 'processes'" %}

<h2 class="home-section-title">Browse by topic</h2>

<div class="topic-grid">
  <a class="topic-card topic-card--development" href="{{ '/development/' | relative_url }}">
    <span class="topic-card__title">Development <span class="topic-card__count">{{ dev_posts.size }}</span></span>
    <p class="topic-card__desc">Building software and the tooling around it — what actually holds up in practice.</p>
  </a>
  <a class="topic-card topic-card--testing" href="{{ '/testing/' | relative_url }}">
    <span class="topic-card__title">Testing <span class="topic-card__count">{{ test_posts.size }}</span></span>
    <p class="topic-card__desc">Test strategy, validation, and the hidden work of proving something works.</p>
  </a>
  <a class="topic-card topic-card--ai" href="{{ '/ai/' | relative_url }}">
    <span class="topic-card__title">AI <span class="topic-card__count">{{ ai_posts.size }}</span></span>
    <p class="topic-card__desc">AI agents and assistants in engineering work — where they help, where they add load.</p>
  </a>
  <a class="topic-card topic-card--processes" href="{{ '/processes/' | relative_url }}">
    <span class="topic-card__title">Processes <span class="topic-card__count">{{ proc_posts.size }}</span></span>
    <p class="topic-card__desc">Estimation, planning, and the team-level habits that make delivery predictable.</p>
  </a>
</div>

<h2 class="home-section-title">Latest entries</h2>

<ul class="entry-list">
  {% for post in site.posts limit: 5 %}
  <li class="entry-card">
    {% if post.image %}
    <a href="{{ post.url | relative_url }}"><img class="entry-card__thumb" src="{{ post.image | relative_url }}" alt="" loading="lazy"></a>
    {% else %}
    <div></div>
    {% endif %}
    <div>
      <p class="entry-card__meta">
        <time datetime="{{ post.date | date_to_xmlschema }}">{{ post.date | date: "%B %-d, %Y" }}</time>
        {% for t in post.topics %}<a class="topic-tag topic-tag--{{ t }}" href="{{ '/' | append: t | append: '/' | relative_url }}">{{ t }}</a>{% endfor %}
      </p>
      <h3 class="entry-card__title"><a href="{{ post.url | relative_url }}">{{ post.title }}</a></h3>
      <p class="entry-card__excerpt">{{ post.content | strip_html | truncatewords: 32 }}</p>
    </div>
  </li>
  {% endfor %}
</ul>
