---
layout: page
title: News Around the World
permalink: /news/
---

Daily, thesis-style roundup of what the sources in
resources.md published. One page per day, newest first.

{% assign days = site.news | sort: "date" | reverse %}
{% if days.size > 0 %}
<ul>
  {% for day in days %}
  <li>
    <a href="{{ day.url | relative_url }}">{{ day.title }}</a>
    <span>({{ day.date | date: "%Y-%m-%d" }})</span>
  </li>
  {% endfor %}
</ul>
{% else %}
<p>No news yet.</p>
{% endif %}
