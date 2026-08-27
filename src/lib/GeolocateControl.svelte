<script lang="ts">
  import { getMapContext } from './context.svelte.js';
  import * as maplibregl from 'maplibre-gl';
  import { flush } from '$lib/flush.js';
  import { onDestroy } from 'svelte';

  const { map, loaded } = $derived(getMapContext());

  interface Props {
    position?: maplibregl.ControlPosition;
    positionOptions?: PositionOptions | undefined;
    fitBoundsOptions?: maplibregl.FitBoundsOptions | undefined;
    trackUserLocation?: boolean;
    showAccuracyCircle?: boolean;
    showUserLocation?: boolean;
    control?: maplibregl.GeolocateControl;
  }

  let {
    position = 'top-left',
    positionOptions = undefined,
    fitBoundsOptions = undefined,
    trackUserLocation = false,
    showAccuracyCircle = true,
    showUserLocation = true,
    control = $bindable(),
  }: Props = $props();
  $effect(() => {
    if (map && !control) {
      // MapLibre merges these over its own defaults with a `for...in` copy,
      // which enumerates keys that are explicitly `undefined`. Passing an unset
      // `positionOptions`/`fitBoundsOptions` through would overwrite the
      // default instead of falling back to it, losing `fitBoundsOptions`'
      // `maxZoom: 15` and `positionOptions`' `timeout: 6000`.
      control = new maplibregl.GeolocateControl(
        flush({
          positionOptions,
          fitBoundsOptions,
          trackUserLocation,
          showAccuracyCircle,
          showUserLocation,
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
