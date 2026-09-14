---
layout: home
title: Learn with me Digest
---

Short entries on Development, Testing, AI, and Processes — real problems
from real work, written up as I work through them.

I'm Yevhen (Eugene) Prodan, AI Quality Lead at Luxoft. This blog is where I
think in public: I write up what I'm running into so I understand it
better, and so others working on the same problems have something to
compare notes against. More about me: [About Me]({{ '/about/' | relative_url }}).

Browse by topic:

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
