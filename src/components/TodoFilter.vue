<template>
  <div class="todo-filter">
    <div class="filter-section">
      <h4>筛选与排序</h4>

      <div class="filter-row">
        <div class="filter-group">
          <label>搜索</label>
          <input v-model="searchQuery" type="text" placeholder="搜索任务标题或描述..." class="search-input" />
        </div>

        <div class="filter-group">
          <label>状态</label>
          <select v-model="filter.status" class="filter-select">
            <option value="all">全部</option>
            <option value="active">进行中</option>
            <option value="completed">已完成</option>
          </select>
        </div>

        <div class="filter-group">
          <label>分类</label>
          <select v-model="filter.category" class="filter-select">
            <option value="all">全部分类</option>
            <option v-for="cat in categories" :key="cat" :value="cat">
              {{ cat === 'all' ? '全部分类' : cat }}
            </option>
          </select>
        </div>

        <div class="filter-group">
          <label>优先级</label>
          <select v-model="filter.priority" class="filter-select">
            <option value="all">全部</option>
            <option value="high">高</option>
            <option value="medium">中</option>
            <option value="low">低</option>
          </select>
        </div>
      </div>

      <div class="sort-row">
        <div class="sort-group">
          <label>排序方式</label>
          <select v-model="sort.field" class="sort-select">
            <option value="createdAt">创建时间</option>
            <option value="priority">优先级</option>
            <option value="title">标题</option>
          </select>
        </div>

        <div class="sort-group">
          <label>排序方向</label>
          <div class="sort-direction">
            <button @click="sort.direction = 'desc'" :class="['direction-btn', { active: sort.direction === 'desc' }]"
              title="降序">
              ↓
            </button>
            <button @click="sort.direction = 'asc'" :class="['direction-btn', { active: sort.direction === 'asc' }]"
              title="升序">
              ↑
            </button>
          </div>
        </div>

        <button @click="clearFilters" class="clear-btn">
          清除筛选
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, watch } from 'vue';
import { useTodoStore } from '@/stores/todo';

const todoStore = useTodoStore();

const searchQuery = computed({
  get: () => todoStore.searchQuery,
  set: (value) => todoStore.setSearchQuery(value)
});

const filter = computed(() => todoStore.filter);
const sort = computed(() => todoStore.sort);

// 获取所有可用的分类选项，包括默认分类和实际存在的分类
const categories = computed(() => {
  // 默认分类选项
  const defaultCategories = ['默认', '工作', '学习', '生活', '购物'];
  // 从store中获取实际存在的分类（排除'all'选项）
  const existingCategories = todoStore.categories.filter(cat => cat !== 'all');

  // 合并默认分类和实际存在的分类，并去重
  const allCategories = [...new Set([...defaultCategories, ...existingCategories])];
  return allCategories;
});

// 监听筛选条件变化，实时更新store
watch([filter, sort], () => {
  todoStore.setFilter(filter.value);
  todoStore.setSort(sort.value);
}, { deep: true });

const clearFilters = () => {
  todoStore.setFilter({
    category: 'all',
    status: 'all',
    priority: 'all'
  });
  todoStore.setSearchQuery('');
  todoStore.setSort({
    field: 'createdAt',
    direction: 'desc'
  });
};
</script>

<style scoped>
.todo-filter {
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  margin-bottom: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.filter-section h4 {
  margin: 0 0 1rem 0;
  color: #2c3e50;
  font-size: 1.1rem;
}

.filter-row {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr;
  gap: 1rem;
  margin-bottom: 1rem;
}

.sort-row {
  display: flex;
  align-items: end;
  gap: 1rem;
}

.filter-group,
.sort-group {
  display: flex;
  flex-direction: column;
}

label {
  margin-bottom: 0.5rem;
  font-weight: 600;
  color: #495057;
  font-size: 0.9rem;
}

.search-input,
.filter-select,
.sort-select {
  padding: 0.5rem;
  border: 1px solid #ced4da;
  border-radius: 4px;
  font-size: 0.9rem;
  transition: border-color 0.15s ease-in-out;
}

.search-input:focus,
.filter-select:focus,
.sort-select:focus {
  outline: none;
  border-color: #007bff;
  box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
}

.sort-direction {
  display: flex;
  gap: 0.25rem;
}

.direction-btn {
  padding: 0.5rem;
  border: 1px solid #ced4da;
  background: white;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: all 0.15s ease-in-out;
}

.direction-btn.active {
  background: #007bff;
  color: white;
  border-color: #007bff;
}

.direction-btn:hover:not(.active) {
  background: #f8f9fa;
}

.clear-btn {
  padding: 0.5rem 1rem;
  border: 1px solid #dc3545;
  background: white;
  color: #dc3545;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: all 0.15s ease-in-out;
  margin-left: auto;
}

.clear-btn:hover {
  background: #dc3545;
  color: white;
}

@media (max-width: 1024px) {
  .filter-row {
    grid-template-columns: 1fr 1fr;
    gap: 0.75rem;
  }
}

@media (max-width: 768px) {
  .todo-filter {
    padding: 1rem;
  }

  .filter-row {
    grid-template-columns: 1fr;
    gap: 0.75rem;
  }

  .sort-row {
    flex-direction: column;
    gap: 0.75rem;
  }

  .clear-btn {
    margin-left: 0;
    align-self: flex-start;
  }
}
</style>