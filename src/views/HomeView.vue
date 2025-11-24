<script setup lang="ts">
import TodoForm from '@/components/TodoForm.vue'
import TodoList from '@/components/TodoList.vue'
import TodoFilter from '@/components/TodoFilter.vue'
</script>

<template>
  <main class="todo-app">
    <div class="app-header">
      <h1>📝 我的TODO列表</h1>
      <p class="app-description">一个简单而强大的任务管理应用</p>
    </div>

    <div class="app-content">
      <div class="main-grid">
        <!-- 左侧：添加任务 -->
        <div class="left-panel">
          <div class="card">
            <h3 class="card-title">➕ 添加新任务</h3>
            <TodoForm />
          </div>
        </div>

        <!-- 右侧：筛选和任务列表 -->
        <div class="right-panel">
          <div class="card">
            <h3 class="card-title">🔍 筛选任务</h3>
            <TodoFilter />
          </div>

          <div class="card">
            <h3 class="card-title">📋 任务列表</h3>
            <TodoList />
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<style scoped>
.todo-app {
  width: 100%;
  min-height: 100vh;
  padding: 2rem;
  box-sizing: border-box;
}

.app-header {
  text-align: center;
  margin-bottom: 3rem;
}

.app-header h1 {
  margin: 0 0 0.5rem 0;
  color: white;
  font-size: 3rem;
  font-weight: 700;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.app-description {
  margin: 0;
  color: rgba(255, 255, 255, 0.9);
  font-size: 1.2rem;
  font-weight: 400;
}

.app-content {
  width: 100%;
  max-width: none;
}

.main-grid {
  display: flex;
  gap: 2rem;
  align-items: flex-start;
}

.left-panel {
  flex: 0 0 400px;
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.right-panel {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.app-content .card {
  margin-bottom: 0;
}

.card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
}

.card-title {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  margin: 0;
  padding: 1.25rem 1.5rem;
  font-size: 1.1rem;
  font-weight: 600;
}

/* 为TodoForm组件内部调整样式 */
:deep(.todo-form) {
  background: transparent;
  padding: 2rem;
  /* 增加内边距 */
  box-shadow: none;
  margin-bottom: 0;
  min-height: 450px;
  /* 增加最小高度 */
}

:deep(.todo-form .form-group) {
  margin-bottom: 1.5rem;
  /* 进一步增加表单元素间距 */
}

:deep(.todo-form .form-input),
:deep(.todo-form .form-textarea),
:deep(.todo-form .form-select) {
  font-size: 1.05rem;
  padding: 1rem;
  /* 进一步增加输入框内边距 */
  width: 100%;
  /* 确保输入框充分利用宽度 */
}

:deep(.todo-form h3) {
  display: none;
  /* 隐藏重复的标题 */
}

:deep(.todo-filter) {
  background: transparent;
  padding: 1.5rem;
  box-shadow: none;
  margin-bottom: 0;
}

:deep(.todo-filter h4) {
  display: none;
  /* 隐藏重复的标题 */
}

:deep(.todo-list) {
  background: transparent;
  box-shadow: none;
  border-radius: 0;
}

:deep(.list-header) {
  display: none;
  /* 隐藏重复的标题 */
}

@media (max-width: 1024px) {
  .main-grid {
    flex-direction: column;
    gap: 1.5rem;
  }

  .left-panel {
    flex: none;
    width: 100%;
  }

  .right-panel {
    flex: none;
    width: 100%;
  }

  .app-content {
    padding: 1.5rem;
  }

  .app-content .card {
    margin-bottom: 1.5rem;
  }
}

@media (max-width: 768px) {
  .todo-app {
    padding: 1rem;
  }

  .main-grid {
    gap: 1rem;
  }

  .left-panel {
    gap: 1rem;
  }

  .app-header h1 {
    font-size: 2.2rem;
  }

  .app-description {
    font-size: 1rem;
  }

  .app-content {
    padding: 1rem;
  }

  .app-content .card {
    margin-bottom: 1rem;
  }

  .card-title {
    padding: 1rem 1.25rem;
    font-size: 1rem;
  }

  :deep(.todo-form),
  :deep(.todo-filter) {
    padding: 1rem;
  }
}
</style>
