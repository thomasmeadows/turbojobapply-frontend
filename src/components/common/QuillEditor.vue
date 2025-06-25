<template>
  <div class="quill-editor-wrapper">
    <div ref="quillContainer" class="quill-editor" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch, nextTick } from 'vue';
import Quill from 'quill';
import 'quill/dist/quill.snow.css';

const props = defineProps<{
  modelValue: string;
  placeholder?: string;
  readOnly?: boolean;
}>();

const emit = defineEmits<{
  'update:modelValue': [value: string];
}>();

const quillContainer = ref<HTMLDivElement | null>(null);
let quill: Quill | null = null;

onMounted(async () => {
  await nextTick();
  if (quillContainer.value) {
    // Custom toolbar configuration
    const toolbarOptions = [
      ['bold', 'italic'],
      [{ list: 'ordered' }, { list: 'bullet' }],
      ['clean']
    ];

    quill = new Quill(quillContainer.value, {
      theme: 'snow',
      placeholder: props.placeholder || 'Enter text here...',
      readOnly: props.readOnly || false,
      modules: {
        toolbar: toolbarOptions
      }
    });

    // Set initial content
    if (props.modelValue) {
      quill.root.innerHTML = props.modelValue;
    }

    // Listen for text changes
    quill.on('text-change', () => {
      if (quill) {
        const html = quill.root.innerHTML;
        emit('update:modelValue', html);
      }
    });
  }
});

// Watch for external changes
watch(
  () => props.modelValue,
  (newValue) => {
    if (quill && newValue !== quill.root.innerHTML) {
      quill.root.innerHTML = newValue || '';
    }
  }
);

// Watch for readonly changes
watch(
  () => props.readOnly,
  (newValue) => {
    if (quill) {
      quill.enable(!newValue);
    }
  }
);

onBeforeUnmount(() => {
  if (quill) {
    quill = null;
  }
});
</script>

<style>
.quill-editor-wrapper .ql-toolbar {
  border-top: 1px solid #e5e7eb;
  border-left: 1px solid #e5e7eb;
  border-right: 1px solid #e5e7eb;
  border-bottom: none;
  border-radius: 0.75rem 0.75rem 0 0;
  background: #f9fafb;
  padding: 0.75rem;
}

.quill-editor-wrapper .ql-container {
  border-left: 1px solid #e5e7eb;
  border-right: 1px solid #e5e7eb;
  border-bottom: 1px solid #e5e7eb;
  border-top: none;
  border-radius: 0 0 0.75rem 0.75rem;
  font-size: 1rem;
}

.quill-editor-wrapper .ql-editor {
  min-height: 120px;
  max-height: 200px;
  padding: 1rem;
  line-height: 1.6;
}

.quill-editor-wrapper .ql-editor.ql-blank::before {
  color: #9ca3af;
  font-style: normal;
}

.quill-editor-wrapper .ql-editor:focus {
  outline: none;
}

.quill-editor-wrapper .ql-container.ql-snow {
  border: none;
}

.quill-editor-wrapper .ql-toolbar.ql-snow {
  border: none;
}

/* Focus state */
.quill-editor-wrapper:focus-within .ql-toolbar,
.quill-editor-wrapper:focus-within .ql-container {
  border-color: #3b82f6;
  box-shadow: 0 0 0 1px #3b82f6;
}

/* Button styling */
.quill-editor-wrapper .ql-toolbar .ql-formats {
  margin-right: 1rem;
}

.quill-editor-wrapper .ql-toolbar button {
  padding: 0.375rem;
  margin: 0 0.125rem;
  border-radius: 0.375rem;
  transition: all 0.15s ease-in-out;
}

.quill-editor-wrapper .ql-toolbar button:hover {
  background-color: #e5e7eb;
}

.quill-editor-wrapper .ql-toolbar button.ql-active {
  background-color: #dbeafe;
  color: #1d4ed8;
}

/* List styling */
.quill-editor-wrapper .ql-editor ul {
  padding-left: 1.5rem;
}

.quill-editor-wrapper .ql-editor ol {
  padding-left: 1.5rem;
}

.quill-editor-wrapper .ql-editor li {
  margin-bottom: 0.25rem;
}
</style>
