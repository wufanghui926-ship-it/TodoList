<template>
    <!-- 任务列表组件容器 -->
    <div class="todo-list">
        <!-- 列表头部：标题和统计信息 -->
        <div class="list-header">
            <h3>任务列表</h3>
            <!-- 任务统计信息 -->
            <div class="stats">
                <span class="stat-item">总计: {{ todoStore.stats.total }}</span>
                <span class="stat-item">已完成: {{ todoStore.stats.completed }}</span>
                <span class="stat-item">进行中: {{ todoStore.stats.active }}</span>
            </div>
        </div>

        <!-- 空状态：当没有任务时显示 -->
        <div v-if="todoStore.filteredTodos.length === 0" class="empty-state">
            <p>暂无任务</p>
            <p class="empty-hint">添加一些任务开始吧！</p>
        </div>

        <!-- 任务列表容器 -->
        <div v-else class="todos-container">
            <!-- 遍历过滤后的任务列表 -->
            <div v-for="todo in todoStore.filteredTodos" :key="todo.id"
                :class="['todo-item', { completed: todo.completed }]">
                <!-- 单个任务项内容 -->
                <div class="todo-content">
                    <!-- 复选框区域 -->
                    <div class="todo-checkbox">
                        <input type="checkbox" :checked="todo.completed" @change="todoStore.toggleTodo(todo.id)"
                            class="checkbox" />
                    </div>

                    <!-- 任务详细信息区域 -->
                    <div class="todo-details">
                        <!-- 任务标题行 -->
                        <div class="todo-title">
                            <span :class="{ 'completed-text': todo.completed }">{{ todo.title }}</span>
                            <!-- 任务状态徽章 -->
                            <span :class="['status-badge', todo.completed ? 'completed' : 'active']">
                                {{ todo.completed ? '已完成' : '进行中' }}
                            </span>
                            <!-- 优先级徽章 -->
                            <span :class="['priority-badge', todo.priority]">
                                {{ priorityLabels[todo.priority] }}
                            </span>
                            <!-- 分类徽章 -->
                            <span class="category-badge">{{ todo.category }}</span>
                        </div>

                        <!-- 任务描述（可选） -->
                        <div v-if="todo.description" class="todo-description">
                            {{ todo.description }}
                        </div>

                        <!-- 任务元信息：创建和更新时间 -->
                        <div class="todo-meta">
                            <span class="created-time">创建: {{ formatDate(todo.createdAt) }}</span>
                            <!-- 只在有更新时显示更新时间 -->
                            <span v-if="todo.updatedAt.getTime() !== todo.createdAt.getTime()" class="updated-time">
                                更新: {{ formatDate(todo.updatedAt) }}
                            </span>
                        </div>
                    </div>

                    <!-- 任务操作按钮区域 -->
                    <div class="todo-actions">
                        <!-- 完成/撤销完成按钮 -->
                        <button @click="todoStore.toggleTodo(todo.id)"
                            :class="['action-btn', todo.completed ? 'undo' : 'complete']"
                            :title="todo.completed ? '标记为未完成' : '标记为完成'">
                            {{ todo.completed ? '↶' : '✓' }}
                        </button>

                        <!-- 删除按钮 -->
                        <button @click="todoStore.removeTodo(todo.id)" class="action-btn delete" title="删除任务">
                            ×
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">

import { useTodoStore } from '@/stores/todo'; // 导入Todo状态管理store

const todoStore = useTodoStore(); // 使用Todo store

// 优先级标签映射：将英文优先级转换为中文显示
const priorityLabels = {
    low: '低',
    medium: '中',
    high: '高'
};

//格式化日期显示
const formatDate = (date: Date) => {
    return date.toLocaleString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
    });
};
</script>

<style scoped>
/* 任务列表主容器样式 */
.todo-list {
    background: white;
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

/* 列表头部样式 */
.list-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem 1.5rem;
    background: #f8f9fa;
    border-bottom: 1px solid #e9ecef;
}

.list-header h3 {
    margin: 0;
    color: #2c3e50;
}

/* 统计信息样式 */
.stats {
    display: flex;
    gap: 1rem;
}

.stat-item {
    font-size: 0.9rem;
    color: #6c757d;
    font-weight: 500;
}

/* 空状态样式 */
.empty-state {
    padding: 3rem 2rem;
    text-align: center;
    color: #6c757d;
}

.empty-state p {
    margin: 0;
}

.empty-hint {
    font-size: 0.9rem;
    margin-top: 0.5rem !important;
}

/* 任务列表容器样式 */
.todos-container {
    max-height: 500px;
    overflow-y: auto;
}

/* 单个任务项样式 */
.todo-item {
    border-bottom: 1px solid #e9ecef;
    transition: background-color 0.15s ease-in-out;
}

.todo-item:last-child {
    border-bottom: none;
}

.todo-item:hover {
    background: #f8f9fa;
}

/* 已完成任务的样式 */
.todo-item.completed {
    opacity: 0.7;
    background: #f8f9fa;
}

/* 任务内容布局 */
.todo-content {
    display: flex;
    align-items: flex-start;
    padding: 1rem 1.5rem;
    gap: 1rem;
}

/* 复选框区域样式 */
.todo-checkbox {
    flex-shrink: 0;
    margin-top: 0.25rem;
}

.checkbox {
    width: 18px;
    height: 18px;
    cursor: pointer;
}

/* 任务详细信息区域样式 */
.todo-details {
    flex: 1;
    min-width: 0;
}

/* 任务标题行样式 */
.todo-title {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-bottom: 0.5rem;
    font-weight: 600;
    font-size: 1.1rem;
}

/* 已完成任务的文字样式 */
.completed-text {
    text-decoration: line-through;
    color: #6c757d;
}

/* 优先级徽章基础样式 */
.priority-badge {
    padding: 0.2rem 0.5rem;
    border-radius: 12px;
    font-size: 0.75rem;
    font-weight: 600;
    text-transform: uppercase;
}

/* 不同优先级的颜色样式 */
.priority-badge.low {
    background: #d4edda;
    color: #155724;
}

.priority-badge.medium {
    background: #fff3cd;
    color: #856404;
}

.priority-badge.high {
    background: #f8d7da;
    color: #721c24;
}

/* 任务状态徽章样式 */
.status-badge {
    padding: 0.2rem 0.5rem;
    border-radius: 12px;
    font-size: 0.75rem;
    font-weight: 600;
    text-transform: uppercase;
}

/* 进行中状态样式 */
.status-badge.active {
    background: #d1ecf1;
    color: #0c5460;
}

/* 已完成状态样式 */
.status-badge.completed {
    background: #d4edda;
    color: #155724;
}

/* 分类徽章样式 */
.category-badge {
    padding: 0.2rem 0.5rem;
    background: #e9ecef;
    color: #495057;
    border-radius: 12px;
    font-size: 0.75rem;
}

/* 任务描述样式 */
.todo-description {
    color: #6c757d;
    font-size: 0.9rem;
    line-height: 1.4;
    margin-bottom: 0.5rem;
}

/* 任务元信息样式 */
.todo-meta {
    display: flex;
    gap: 1rem;
    font-size: 0.8rem;
    color: #adb5bd;
}

/* 任务操作按钮区域样式 */
.todo-actions {
    display: flex;
    gap: 0.5rem;
    flex-shrink: 0;
}

/* 操作按钮基础样式 */
.action-btn {
    width: 32px;
    height: 32px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 1.2rem;
    font-weight: bold;
    transition: all 0.15s ease-in-out;
    display: flex;
    align-items: center;
    justify-content: center;
}

/* 完成按钮样式 */
.action-btn.complete {
    background: #28a745;
    color: white;
}

.action-btn.complete:hover {
    background: #218838;
}

/* 撤销完成按钮样式 */
.action-btn.undo {
    background: #ffc107;
    color: #212529;
}

.action-btn.undo:hover {
    background: #e0a800;
}

/* 删除按钮样式 */
.action-btn.delete {
    background: #dc3545;
    color: white;
}

.action-btn.delete:hover {
    background: #c82333;
}

/* 移动端响应式样式 */
@media (max-width: 768px) {
    .todo-content {
        padding: 1rem;
        flex-direction: column;
        gap: 0.75rem;
    }

    .todo-checkbox {
        align-self: flex-start;
    }

    .todo-actions {
        align-self: flex-end;
    }

    .list-header {
        flex-direction: column;
        gap: 0.5rem;
        align-items: flex-start;
    }

    .stats {
        gap: 0.75rem;
    }

    .todo-title {
        flex-wrap: wrap;
    }

    .todo-meta {
        flex-direction: column;
        gap: 0.25rem;
    }
}
</style>