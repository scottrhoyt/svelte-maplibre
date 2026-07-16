<script lang="ts">
  import { getMapContext } from './context.svelte.js';
  import * as maplibregl from 'maplibre-gl';
  import { flush } from './flush.js';
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
      // flush() the options: MapLibre merges them over its own defaults with a
      // `for...in` copy, which enumerates explicitly-undefined keys, so an unset
      // `positionOptions`/`fitBoundsOptions` would OVERWRITE the default rather
      // than fall back to it — dropping fitBoundsOptions' `maxZoom: 15` (the
      // accuracy-circle fit then runs uncapped and slams to the map's maxZoom)
      // and positionOptions' `timeout: 6000` (a stuck fix waits forever).
      // Same guard MapLibre.svelte and DefaultMarker.svelte already apply.
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
