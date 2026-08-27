---
'svelte-maplibre': patch
---

Re-add user sources and layers idempotently after a style change. If a tracked source was still on the map when `style.load` fired, `addSource` threw "Source ... already exists" and aborted the handler before it reached the layer loop, so the map kept its sources but lost every user layer until the page was reloaded.
