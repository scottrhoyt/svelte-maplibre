---
'svelte-maplibre': patch
---

Stop unset props from overwriting MapLibre's own option defaults. MapLibre merges the options it is given over its defaults with a `for...in` copy, which enumerates keys whose value is explicitly `undefined`, so forwarding an unset prop replaced the default instead of falling back to it.

- `Popup` no longer loses MapLibre's `maxWidth` default. The default `'240px'` cap was being shadowed by `undefined`, and because the cap is only applied when `options.maxWidth` is truthy, popups rendered with no width limit at all and stretched to fit their content.
- `GeolocateControl` no longer loses the `fitBoundsOptions` default of `{ maxZoom: 15 }` (the fit to the accuracy circle ran uncapped and zoomed to the map's `maxZoom`) or the `positionOptions` default of `{ timeout: 6000 }` (a geolocation request that never resolved was left without a timeout).
- `ScaleControl` and `Marker` flush their options for the same reason. Neither changes behavior today, since MapLibre happens to guard both with `||` fallbacks, but they were relying on that.
