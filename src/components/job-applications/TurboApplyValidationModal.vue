<script setup lang="ts">
import { ref, computed } from 'vue';
import type { Job } from '../../types/job';

interface ValidationQuestion {
  id: string;
  question: string;
  type: 'text' | 'textarea' | 'select' | 'radio' | 'checkbox' | 'number' | 'date';
  required: boolean;
  options?: string[];
  placeholder?: string;
  maxLength?: number;
}

interface Props {
  show: boolean;
  job: Job;
  questions: ValidationQuestion[];
  loading: boolean;
}

interface Emits {
  close: [];
  submit: [answers: Record<string, any>];
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const answers = ref<Record<string, any>>({});
const errors = ref<Record<string, string>>({});

const canSubmit = computed(() => {
  // Check if all required questions are answered
  const requiredQuestions = props.questions.filter((q) => q.required);
  return requiredQuestions.every((q) => {
    const answer = answers.value[q.id];
    return answer !== undefined && answer !== null && answer !== '';
  });
});

const validateField = (question: ValidationQuestion, value: any) => {
  if (question.required && (!value || value === '')) {
    errors.value[question.id] = 'This field is required';
    return false;
  }

  if (question.type === 'textarea' && question.maxLength && value && value.length > question.maxLength) {
    errors.value[question.id] = `Maximum ${question.maxLength} characters allowed`;
    return false;
  }

  delete errors.value[question.id];
  return true;
};

const handleInputChange = (question: ValidationQuestion, value: any) => {
  answers.value[question.id] = value;
  validateField(question, value);
};

const submitAnswers = () => {
  // Validate all fields
  let hasErrors = false;
  props.questions.forEach((question) => {
    if (!validateField(question, answers.value[question.id])) {
      hasErrors = true;
    }
  });

  if (!hasErrors) {
    emit('submit', answers.value);
  }
};

const closeModal = () => {
  emit('close');
};
</script>

<template>
  <!-- Modal Backdrop -->
  <div v-if="show" class="fixed inset-0 z-50 flex items-center justify-center bg-gray-600/75">
    <div class="mx-4 max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-lg bg-white shadow-xl">
      <!-- Modal Header -->
      <div class="border-b border-gray-200 px-6 py-4">
        <div class="flex items-center justify-between">
          <h3 class="text-lg font-medium text-gray-900">Complete Your Application</h3>
          <button class="text-gray-400 hover:text-gray-600" @click="closeModal">
            <svg class="size-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      <!-- Modal Body -->
      <div class="px-6 py-4">
        <!-- Job Info -->
        <div class="mb-6 rounded-md bg-gray-50 p-4">
          <h4 class="font-medium text-gray-900">
            {{ job.title }}
          </h4>
          <p class="text-sm text-gray-600">{{ job.company }} • {{ job.location }}</p>
        </div>

        <!-- Instructions -->
        <div class="mb-6 rounded-md border border-blue-200 bg-blue-50 p-4">
          <div class="flex">
            <svg class="mr-2 mt-0.5 size-5 shrink-0 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <h4 class="mb-1 text-sm font-medium text-blue-800">Additional Information Required</h4>
              <p class="text-sm text-blue-700">Please answer the following questions to complete your application.</p>
            </div>
          </div>
        </div>

        <!-- Validation Questions -->
        <div class="space-y-6">
          <div v-for="question in questions" :key="question.id" class="space-y-2">
            <label class="block text-sm font-medium text-gray-700">
              {{ question.question }}
              <span v-if="question.required" class="text-red-500">*</span>
            </label>

            <!-- Text Input -->
            <input
              v-if="question.type === 'text'"
              type="text"
              :value="answers[question.id] || ''"
              :placeholder="question.placeholder"
              :class="['w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500', errors[question.id] ? 'border-red-300 focus:border-red-500' : 'border-gray-300 focus:border-transparent']"
              @input="handleInputChange(question, ($event.target as HTMLInputElement).value)"
            />

            <!-- Number Input -->
            <input
              v-else-if="question.type === 'number'"
              type="number"
              :value="answers[question.id] || ''"
              :placeholder="question.placeholder"
              :class="['w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500', errors[question.id] ? 'border-red-300 focus:border-red-500' : 'border-gray-300 focus:border-transparent']"
              @input="handleInputChange(question, ($event.target as HTMLInputElement).value)"
            />

            <!-- Date Input -->
            <input
              v-else-if="question.type === 'date'"
              type="date"
              :value="answers[question.id] || ''"
              :class="['w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500', errors[question.id] ? 'border-red-300 focus:border-red-500' : 'border-gray-300 focus:border-transparent']"
              @input="handleInputChange(question, ($event.target as HTMLInputElement).value)"
            />

            <!-- Textarea -->
            <textarea
              v-else-if="question.type === 'textarea'"
              :value="answers[question.id] || ''"
              :placeholder="question.placeholder"
              :maxlength="question.maxLength"
              rows="4"
              :class="['w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500', errors[question.id] ? 'border-red-300 focus:border-red-500' : 'border-gray-300 focus:border-transparent']"
              @input="handleInputChange(question, ($event.target as HTMLTextAreaElement).value)"
            />

            <!-- Select Dropdown -->
            <select
              v-else-if="question.type === 'select'"
              :value="answers[question.id] || ''"
              :class="['w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500', errors[question.id] ? 'border-red-300 focus:border-red-500' : 'border-gray-300 focus:border-transparent']"
              @change="handleInputChange(question, ($event.target as HTMLSelectElement).value)"
            >
              <option value="">Choose an option...</option>
              <option v-for="option in question.options" :key="option" :value="option">
                {{ option }}
              </option>
            </select>

            <!-- Radio Buttons -->
            <div v-else-if="question.type === 'radio'" class="space-y-2">
              <div v-for="option in question.options" :key="option" class="flex items-center">
                <input
                  :id="`${question.id}_${option}`"
                  :name="question.id"
                  type="radio"
                  :value="option"
                  :checked="answers[question.id] === option"
                  class="size-4 border-gray-300 text-primary-600 focus:ring-primary-500"
                  @change="handleInputChange(question, option)"
                />
                <label :for="`${question.id}_${option}`" class="ml-2 text-sm text-gray-700">
                  {{ option }}
                </label>
              </div>
            </div>

            <!-- Checkbox -->
            <div v-else-if="question.type === 'checkbox'" class="space-y-2">
              <div v-for="option in question.options" :key="option" class="flex items-center">
                <input
                  :id="`${question.id}_${option}`"
                  type="checkbox"
                  :value="option"
                  :checked="(answers[question.id] || []).includes(option)"
                  class="size-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  @change="
                    (e) => {
                      const checked = (e.target as HTMLInputElement).checked;
                      const currentValues = answers[question.id] || [];
                      const newValues = checked ? [...currentValues, option] : currentValues.filter((v: string) => v !== option);
                      handleInputChange(question, newValues);
                    }
                  "
                />
                <label :for="`${question.id}_${option}`" class="ml-2 text-sm text-gray-700">
                  {{ option }}
                </label>
              </div>
            </div>

            <!-- Character count for textarea -->
            <div v-if="question.type === 'textarea' && question.maxLength" class="text-right">
              <span class="text-xs text-gray-500"> {{ (answers[question.id] || '').length }} / {{ question.maxLength }} </span>
            </div>

            <!-- Error Message -->
            <p v-if="errors[question.id]" class="text-sm text-red-600">
              {{ errors[question.id] }}
            </p>
          </div>
        </div>
      </div>

      <!-- Modal Footer -->
      <div class="flex justify-end space-x-3 border-t border-gray-200 px-6 py-4">
        <button class="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50" :disabled="loading" @click="closeModal">Cancel</button>
        <button
          :disabled="!canSubmit || loading"
          class="flex items-center rounded-md border border-transparent bg-primary-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary-700 disabled:cursor-not-allowed disabled:opacity-50"
          @click="submitAnswers"
        >
          <svg v-if="loading" class="-ml-1 mr-2 size-4 animate-spin text-white" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          {{ loading ? 'Submitting...' : 'Submit Application' }}
        </button>
      </div>
    </div>
  </div>
</template>
