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
    {%- comment -%} Rubrics = the day's h2 section headings (docs render before pages, so content is HTML). {%- endcomment -%}
    {%- assign rubrics = "" -%}
    {%- assign parts = day.content | split: "<h2" -%}
    {%- for part in parts offset: 1 -%}
      {%- assign name = part | split: "</h2>" | first | split: ">" | last | remove: ":" | strip -%}
      {%- assign rubrics = rubrics | append: name | append: "|" -%}
    {%- endfor -%}
    {%- assign rubrics = rubrics | split: "|" %}
    {% if rubrics.size > 0 %}<span class="news-rubrics">{{ rubrics | join: " · " }}</span>{% endif %}
  </li>
  {% endfor %}
</ul>
<style>.news-rubrics { margin-left: 1.5em; color: #828282; font-size: 0.9em; }</style>
{% else %}
<p>No news yet.</p>
{% endif %}
