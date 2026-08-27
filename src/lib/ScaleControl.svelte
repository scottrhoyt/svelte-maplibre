<script lang="ts">
  import { getMapContext } from './context.svelte.js';
  import * as maplibregl from 'maplibre-gl';
  import { flush } from '$lib/flush.js';
  import { onDestroy } from 'svelte';

  const { map, loaded } = $derived(getMapContext());

  interface Props {
    position?: maplibregl.ControlPosition;
    maxWidth?: number | undefined;
    unit?: 'imperial' | 'metric' | 'nautical';
  }

  let { position = 'bottom-left', maxWidth = undefined, unit = 'metric' }: Props = $props();

  let control: maplibregl.ScaleControl | undefined = $state();
  $effect(() => {
    if (map && !control) {
      // An unset `maxWidth` would otherwise overwrite MapLibre's `100` default
      // with `undefined`. That is currently harmless, because the scale is
      // computed as `options?.maxWidth || 100`, but it only holds as long as
      // that fallback stays in place.
      control = new maplibregl.ScaleControl(
        flush({
          maxWidth,
          unit,
        })
      );
      map.addControl(control, position);
    }
  });

  onDestroy(() => {
    if (loaded && control) {
      map?.removeControl(control);
    }
  });
</script>
