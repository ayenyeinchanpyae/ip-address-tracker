<template>
    <div id="map-container"></div>
  </template>

  <script setup>
  import { onMounted, ref, watch, nextTick } from 'vue';
  import L from 'leaflet';
  
  const props = defineProps({
    coords: {
      type: Object,
      required: true,
    },
  });
  
  const map = ref(null);
  const marker = ref(null);
  
  const customIcon = L.icon({
    iconUrl: '/icon-location.svg',
    iconSize: [46, 56],
  });
  
  onMounted(() => {
    map.value = L.map('map-container').setView([props.coords.lat, props.coords.lng], 13);
  
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(map.value);
  
    marker.value = L.marker([props.coords.lat, props.coords.lng], { icon: customIcon }).addTo(map.value);
  
    // 2. THE JAVASCRIPT FIX
    // After the DOM has updated, tell Leaflet to re-check its size.
    nextTick(() => {
      map.value.invalidateSize();
    });
  });
  
  watch(() => props.coords, (newCoords) => {
    if (map.value && newCoords.lat && newCoords.lng) {
      map.value.setView([newCoords.lat, newCoords.lng], 13);
      if (marker.value) {
        marker.value.setLatLng([newCoords.lat, newCoords.lng]);
      }
    }
  });
  </script>
  
  <style>
  #map-container {
    height: 100%;
    width: 100%;
    z-index: 1; /* Ensure map is behind the info box */
  }
  </style>