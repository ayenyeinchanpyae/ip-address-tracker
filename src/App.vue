<template>
  <div class="app-container">
    <!-- Header Section -->
    <header class="header">
      <h1>IP Address Tracker</h1>
      <div class="search-bar">
        <input
          type="text"
          v-model="searchQuery"
          placeholder="Search for any IP address or domain"
          @keypress.enter="handleSearch"
        />
        <button @click="handleSearch" aria-label="Search">
          <img :src="'/icon-arrow.svg'" alt="Search Icon" />
        </button>
      </div>
    </header>

    <!-- Info Box - Overlaps header and map -->
    <div class="info-box" v-if="locationData.ip">
      <div class="info-item">
        <span class="label">IP Address</span>
        <span class="value">{{ locationData.ip }}</span>
      </div>
      <div class="info-item">
        <span class="label">Location</span>
        <span class="value">{{ locationData.location.city }}, {{ locationData.location.region }} {{ locationData.location.postalCode }}</span>
      </div>
      <div class="info-item">
        <span class="label">Timezone</span>
        <span class="value">UTC {{ locationData.location.timezone }}</span>
      </div>
      <div class="info-item">
        <span class="label">ISP</span>
        <span class="value">{{ locationData.isp }}</span>
      </div>
    </div>
    <div class="info-box placeholder" v-else>
      <p>{{ loadingMessage }}</p>
    </div>


    <!-- Map View Component -->
    <MapView :coords="mapCoords" class="map-view" />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import MapView from './components/MapView.vue';
import { getLocationData } from './services/ipifyService.js';

// Reactive state
const searchQuery = ref('');
const locationData = ref({});
const mapCoords = ref({ lat: 51.505, lng: -0.09 }); // Default coords (London)
const loadingMessage = ref('Loading your location...');

// Function to fetch and update data
const fetchData = async (query) => {
  try {
    const data = await getLocationData(query);
    locationData.value = data;
    mapCoords.value = { lat: data.location.lat, lng: data.location.lng };
  } catch (error) {
    alert(error.message);
    loadingMessage.value = 'Failed to load data. Please try again.';
  }
};

// Handle search button click or enter
const handleSearch = () => {
  fetchData(searchQuery.value);
};

// Fetch user's own location on initial page load
onMounted(() => {
  fetchData();
});
</script>

<style>
/* --- Main App Container --- */
.app-container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  position: relative;
}

/* --- Header Section --- */
.header {
  width: 100%;
  height: 280px; /* This fixed height is crucial */
  background-image: url('/pattern-bg-desktop.png');
  background-size: cover;
  background-position: center;
  padding: 30px;
  text-align: center;
  z-index: 10;
}

.header h1 {
  color: white;
  font-weight: 500;
  margin-bottom: 30px;
  font-size: 32px;
}

.search-bar {
  display: flex;
  max-width: 550px;
  margin: 0 auto;
}

.search-bar input {
  flex-grow: 1;
  border: none;
  padding: 18px 24px;
  border-radius: 15px 0 0 15px;
  font-size: 18px;
  outline: none;
  cursor: pointer;
}

.search-bar button {
  border: none;
  background-color: black;
  padding: 18px 24px;
  border-radius: 0 15px 15px 0;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.search-bar button:hover {
  background-color: #3f3f3f;
}

/* --- Info Box --- */
.info-box {
  position: absolute;
  top: 170px;
  left: 50%;
  transform: translateX(-50%);
  width: 85%;
  max-width: 1100px;
  display: flex;
  background-color: white;
  border-radius: 15px;
  padding: 37px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
  z-index: 20;
}

.info-item {
  flex: 1;
  padding: 0 30px;
  border-right: 1px solid #ddd;
}

.info-item:last-child {
  border-right: none;
}

.info-item .label {
  display: block;
  color: #969696;
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1.75px;
  margin-bottom: 10px;
}

.info-item .value {
  font-size: 26px;
  font-weight: 500;
  color: #2b2b2b;
  overflow-wrap: break-word;
}

.info-box.placeholder {
  padding: 50px;
  justify-content: center;
}

/* --- Map View --- */
.map-view {
  flex-grow: 1;
  width: 100%;
  z-index: 5;
}

/* --- Responsive Styles for Mobile --- */
@media (max-width: 900px) {
  .header {
    height: 300px;
    background-image: url('/pattern-bg-mobile.png');
    
  }

  .info-box {
    flex-direction: column;
    text-align: center;
    gap: 24px;
    top: 180px;
    padding: 24px;
    width: 80%;
  }

  .info-item {
    border-right: none;
    padding: 0;
  }

  .info-item .value {
    font-size: 20px;
  }
  
  .search-bar input {
    padding: 15px; 
    font-size: 16px;
  }
  
  .search-bar button {
    padding: 15px 20px;
    margin-right: 40px;
  }

}
</style>