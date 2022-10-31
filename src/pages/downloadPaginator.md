---
pagination:
  data: releasesByTag
  size: 1
  alias: release
  resolve: values
layout: layouts/release.njk
permalink: "/downloads/{{ release.version }}/"
---
{{ release.changes }}