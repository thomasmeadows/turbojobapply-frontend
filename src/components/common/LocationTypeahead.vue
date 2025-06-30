<script setup lang="ts">
import { ref, computed, watch, nextTick } from 'vue';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

interface LocationSuggestion {
  display: string;
  city?: string;
  state?: string;
  stateCode?: string;
  zip?: string;
  country: string;
  countryCode: string;
  type: 'city' | 'state' | 'zip';
}

interface Props {
  modelValue?: LocationSuggestion | null;
  country?: string;
  placeholder?: string;
  disabled?: boolean;
}

interface Emits {
  (e: 'update:modelValue', value: LocationSuggestion | null): void;
  (e: 'clear'): void;
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: null,
  country: 'US',
  placeholder: 'ZIP code preferred or City, State combo',
  disabled: false
});

const emit = defineEmits<Emits>();

const inputRef = ref<HTMLInputElement>();
const inputValue = ref('');
const suggestions = ref<LocationSuggestion[]>([]);
const loading = ref(false);
const showSuggestions = ref(false);
const selectedIndex = ref(-1);
const debounceTimer = ref<number>();

const selectedLocation = computed({
  get: () => props.modelValue,
  set: (value: LocationSuggestion | null) => emit('update:modelValue', value)
});

const isDisabled = computed(() => props.disabled || !!selectedLocation.value);

// Initialize input value when modelValue changes
watch(() => props.modelValue, (newValue) => {
  if (newValue) {
    inputValue.value = newValue.display;
  } else {
    inputValue.value = '';
  }
}, { immediate: true });

// Watch for input changes and trigger search
watch(inputValue, (newValue) => {
  if (!newValue || newValue.length < 2 || selectedLocation.value) {
    suggestions.value = [];
    showSuggestions.value = false;
    return;
  }

  // Clear existing timer
  if (debounceTimer.value) {
    clearTimeout(debounceTimer.value);
  }

  // Set up new debounced search
  debounceTimer.value = setTimeout(() => {
    searchLocations(newValue);
  }, 500);
});

const searchLocations = async (query: string) => {
  if (query.length < 2) return;

  loading.value = true;
  try {
    const response = await axios.get(`${API_URL}/api/location/search`, {
      params: {
        q: query,
        country: props.country
      }
    });

    suggestions.value = response.data.data;
    showSuggestions.value = suggestions.value.length > 0;
    selectedIndex.value = -1;

    // If only one result, auto-select it
    if (suggestions.value.length === 1) {
      selectSuggestion(suggestions.value[0]);
    }
  } catch (error) {
    console.error('Location search error:', error);
    suggestions.value = [];
    showSuggestions.value = false;
  } finally {
    loading.value = false;
  }
};

const selectSuggestion = (suggestion: LocationSuggestion) => {
  selectedLocation.value = suggestion;
  inputValue.value = suggestion.display;
  suggestions.value = [];
  showSuggestions.value = false;
  selectedIndex.value = -1;
};

const clearLocation = () => {
  selectedLocation.value = null;
  inputValue.value = '';
  suggestions.value = [];
  showSuggestions.value = false;
  selectedIndex.value = -1;
  emit('clear');
  
  nextTick(() => {
    inputRef.value?.focus();
  });
};

const handleKeydown = (event: KeyboardEvent) => {
  if (!showSuggestions.value || suggestions.value.length === 0) return;

  switch (event.key) {
    case 'ArrowDown':
      event.preventDefault();
      selectedIndex.value = Math.min(selectedIndex.value + 1, suggestions.value.length - 1);
      break;
    case 'ArrowUp':
      event.preventDefault();
      selectedIndex.value = Math.max(selectedIndex.value - 1, -1);
      break;
    case 'Enter':
      event.preventDefault();
      if (selectedIndex.value >= 0) {
        selectSuggestion(suggestions.value[selectedIndex.value]);
      }
      break;
    case 'Escape':
      showSuggestions.value = false;
      selectedIndex.value = -1;
      break;
  }
};

const handleFocus = () => {
  if (suggestions.value.length > 0 && !selectedLocation.value) {
    showSuggestions.value = true;
  }
};

const handleBlur = () => {
  // Delay hiding suggestions to allow for clicks
  setTimeout(() => {
    showSuggestions.value = false;
    selectedIndex.value = -1;
  }, 150);
};
</script>

<template>
  <div class="relative">
    <div class="relative">
      <input
        ref="inputRef"
        v-model="inputValue"
        type="text"
        class="form-input pr-8"
        :class="{ 'bg-gray-100 cursor-not-allowed': isDisabled }"
        :placeholder="placeholder"
        :disabled="isDisabled"
        @keydown="handleKeydown"
        @focus="handleFocus"
        @blur="handleBlur"
      />
      
      <!-- Clear button -->
      <button
        v-if="selectedLocation"
        type="button"
        class="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
        @click="clearLocation"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
      
      <!-- Loading indicator -->
      <div
        v-else-if="loading"
        class="absolute right-2 top-1/2 -translate-y-1/2"
      >
        <svg class="w-4 h-4 animate-spin text-gray-400" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      </div>
    </div>

    <!-- Suggestions dropdown -->
    <div
      v-if="showSuggestions && suggestions.length > 0"
      class="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto"
    >
      <ul class="py-1">
        <li
          v-for="(suggestion, index) in suggestions"
          :key="`${suggestion.type}-${suggestion.display}`"
          class="px-3 py-2 cursor-pointer hover:bg-gray-100 text-sm"
          :class="{ 'bg-blue-100': index === selectedIndex }"
          @click="selectSuggestion(suggestion)"
        >
          <div class="flex items-center justify-between">
            <span>{{ suggestion.display }}</span>
            <span class="text-xs text-gray-500 capitalize">{{ suggestion.type }}</span>
          </div>
        </li>
      </ul>
    </div>

    <!-- No results message -->
    <div
      v-if="showSuggestions && suggestions.length === 0 && !loading && inputValue.length >= 2"
      class="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg"
    >
      <div class="px-3 py-2 text-sm text-gray-500">
        No locations found for "{{ inputValue }}"
      </div>
    </div>
  </div>
</template>

<style scoped>
.form-input {
  @apply block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm;
}
</style>