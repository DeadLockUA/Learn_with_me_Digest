---
layout: home
title: Learn with me Digest
---

<style>
.category-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
  margin: 2rem 0;
}
@media (max-width: 600px) {
  .category-grid { grid-template-columns: 1fr; }
}
.category-button {
  display: block;
  text-align: center;
  padding: 2.5rem 1rem;
  font-size: 1.5rem;
  font-weight: 600;
  border: 2px solid #2a7ae2;
  border-radius: 8px;
  color: #2a7ae2;
  text-decoration: none;
  transition: background-color 0.15s ease, color 0.15s ease;
}
.category-button:hover {
  background-color: #2a7ae2;
  color: #fff;
}
</style>

<div class="category-grid">
  <a class="category-button" href="{{ '/development/' | relative_url }}">Development</a>
  <a class="category-button" href="{{ '/testing/' | relative_url }}">Testing</a>
  <a class="category-button" href="{{ '/ai/' | relative_url }}">AI</a>
  <a class="category-button" href="{{ '/processes/' | relative_url }}">Processes</a>
</div>
