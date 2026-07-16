<script lang="ts">
  import { getMapContext } from './context.svelte.js';
  import * as maplibregl from 'maplibre-gl';
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
      control = new maplibregl.GeolocateControl({
        // MapLibre merges these over its own defaults with a `for...in` copy,
        // which enumerates explicitly-undefined keys. Passing `key: undefined`
        // therefore OVERWRITES the default rather than falling back to it —
        // dropping fitBoundsOptions' `maxZoom: 15` (geolocate then fits the
        // accuracy circle uncapped, slamming to the map's maxZoom) and
        // positionOptions' `timeout: 6000` (a stuck fix waits forever). Only
        // forward the optional keys the consumer actually set.
        ...(positionOptions !== undefined && { positionOptions }),
        ...(fitBoundsOptions !== undefined && { fitBoundsOptions }),
        trackUserLocation,
        showAccuracyCircle,
        showUserLocation,
      });
      map.addControl(control, position);
    }
  });

  onDestroy(() => {
    if (loaded && control) {
      map?.removeControl(control);
    }
  });
</script>
