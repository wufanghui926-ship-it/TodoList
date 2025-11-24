<template>
  <div class="todo-form">
    <h3>添加新任务</h3>
    <form @submit.prevent="handleSubmit">
      <div class="form-group">
        <label for="title">任务标题 <span class="required-asterisk">*</span></label>
        <input id="title" v-model="form.title" type="text" placeholder="请输入任务标题" required class="form-input" />
      </div>

      <div class="form-group">
        <label for="description">任务描述</label>
        <textarea id="description" v-model="form.description" placeholder="请输入任务描述（可选）" class="form-textarea"
          rows="3" />
      </div>

      <div class="form-row">
        <div class="form-group">
          <label for="category">分类</label>
          <select id="category" v-model="form.category" class="form-select">
            <option value="默认">默认</option>
            <option value="工作">工作</option>
            <option value="学习">学习</option>
            <option value="生活">生活</option>
            <option value="购物">购物</option>
          </select>
        </div>

        <div class="form-group">
          <label for="priority">优先级</label>
          <select id="priority" v-model="form.priority" class="form-select">
            <option value="low">低</option>
            <option value="medium">中</option>
            <option value="high">高</option>
          </select>
        </div>
      </div>

      <button type="submit" class="submit-btn" :disabled="!form.title.trim()">
        添加任务
      </button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useTodoStore } from '@/stores/todo';

const todoStore = useTodoStore();

const form = ref({
  title: '',
  description: '',
  category: '默认',
  priority: 'medium' as 'low' | 'medium' | 'high'
});

const handleSubmit = () => {
  if (form.value.title.trim()) {
    todoStore.addTodo(
      form.value.title.trim(),
      form.value.description.trim(),
      form.value.category,
      form.value.priority
    );

    // 重置表单
    form.value = {
      title: '',
      description: '',
      category: '默认',
      priority: 'medium'
    };
  }
};
</script>

<style scoped>
.todo-form {
  background: #f8f9fa;
  padding: 1.5rem;
  border-radius: 8px;
  margin-bottom: 2rem;
}

.todo-form h3 {
  margin: 0 0 1rem 0;
  color: #2c3e50;
  font-size: 1.2rem;
}

.form-group {
  margin-bottom: 1rem;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
  color: #495057;
}

.required-asterisk {
  color: #dc3545;
}

.form-input,
.form-textarea,
.form-select {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ced4da;
  border-radius: 4px;
  font-size: 1rem;
  transition: border-color 0.15s ease-in-out;
}

.form-input:focus,
.form-textarea:focus,
.form-select:focus {
  outline: none;
  border-color: #007bff;
  box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
}

.form-textarea {
  resize: vertical;
  min-height: 80px;
}

.submit-btn {
  width: 100%;
  padding: 0.75rem;
  background: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.15s ease-in-out;
}

.submit-btn:hover:not(:disabled) {
  background: #0056b3;
}

.submit-btn:disabled {
  background: #6c757d;
  cursor: not-allowed;
}

@media (max-width: 768px) {
  .form-row {
    grid-template-columns: 1fr;
  }

  .todo-form {
    padding: 1rem;
  }
}
</style>