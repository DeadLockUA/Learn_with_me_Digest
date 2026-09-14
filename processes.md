---
layout: page
title: Processes
permalink: /processes/
---

{% assign items = site.posts | where_exp: "post", "post.topics contains 'processes'" %}
{% if items.size > 0 %}
<ul>
  {% for post in items %}
  <li>
    <a href="{{ post.url | relative_url }}">{{ post.title }}</a>
    <span>({{ post.date | date: "%Y-%m-%d" }})</span>
  </li>
  {% endfor %}
</ul>
{% else %}
<p>No entries yet.</p>
{% endif %}
