import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { TodoItem, TodoFilter, TodoSort } from '@/types/todo';

// 生成唯一任务ID —— 时间戳 + 随机数
const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};


// 定义Todo store —— 使用Pinia Composition API实现，包含任务管理、筛选、排序等功能
export const useTodoStore = defineStore('todo', () => {
  // 状态定义

  // 任务列表数组，存储所有待办任务
  const todos = ref<TodoItem[]>([]);
  
  // 筛选条件状态，用于任务列表的筛选
  const filter = ref<TodoFilter>({
    category: 'all',
    status: 'all',
    priority: 'all'
  });
  
  // 排序条件状态，用于任务列表的排序
  const sort = ref<TodoSort>({
    field: 'createdAt',
    direction: 'desc'
  });
  
  // 搜索关键词状态，用于任务列表的搜索过滤
  const searchQuery = ref('');

  // 计算属性
  // 按搜索关键词、筛选条件和排序规则动态计算显示的任务列表
  const filteredTodos = computed(() => {
    // 第一步：应用筛选条件
    let result = todos.value.filter(todo => {
      // 搜索过滤：匹配标题或描述中的关键词（不区分大小写）
      if (searchQuery.value && !todo.title.toLowerCase().includes(searchQuery.value.toLowerCase()) && 
          !todo.description?.toLowerCase().includes(searchQuery.value.toLowerCase())) {
        return false;
      }
      
      // 分类过滤：排除不匹配分类的任务
      if (filter.value.category !== 'all' && todo.category !== filter.value.category) {
        return false;
      }
      
      // 状态过滤：根据任务完成状态筛选
      if (filter.value.status === 'active' && todo.completed) {
        return false;
      }
      if (filter.value.status === 'completed' && !todo.completed) {
        return false;
      }
      
      // 优先级过滤：筛选指定优先级的任务
      if (filter.value.priority !== 'all' && todo.priority !== filter.value.priority) {
        return false;
      }
      
      return true;
    });

    // 第二步：应用排序规则
    result.sort((a, b) => {
      let aValue: any, bValue: any;
      
      // 根据排序字段获取比较值
      switch (sort.value.field) {
        case 'priority':
          // 优先级排序：高(3) > 中(2) > 低(1)
          const priorityOrder = { high: 3, medium: 2, low: 1 };
          aValue = priorityOrder[a.priority];
          bValue = priorityOrder[b.priority];
          break;
        case 'title':
          // 标题排序：按字母顺序（不区分大小写）
          aValue = a.title.toLowerCase();
          bValue = b.title.toLowerCase();
          break;
        default:
          // 默认按创建时间排序
          aValue = a.createdAt;
          bValue = b.createdAt;
      }
      
      // 根据排序方向进行排序
      if (sort.value.direction === 'asc') {
        return aValue > bValue ? 1 : -1; // 升序
      } else {
        return aValue < bValue ? 1 : -1; // 降序
      }
    });

    return result;
  });


  // 计算所有分类列表，包含'全部'选项 ，用于任务筛选
  const categories = computed(() => {
    const cats = new Set(todos.value.map(todo => todo.category));
    return ['all', ...Array.from(cats)];
  });

  // 计算任务统计信息，包括总任务数、已完成数和进行中数
  const stats = computed(() => {
    const total = todos.value.length;
    const completed = todos.value.filter(todo => todo.completed).length;
    const active = total - completed;
    
    return { total, completed, active };
  });

  // 方法
  // 添加新任务到任务列表
  const addTodo = (title: string, description?: string, category: string = '默认', priority: 'low' | 'medium' | 'high' = 'medium') => {
    // 创建新任务对象
    const newTodo: TodoItem = {
      id: generateId(),
      title,
      description,
      completed: false,
      category,
      priority,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    // 添加到任务列表并保存到本地存储
    todos.value.push(newTodo);
    saveToLocalStorage();
    return newTodo;
  };

  // 删除指定任务ID的任务
  const removeTodo = (id: string) => {
    const index = todos.value.findIndex(todo => todo.id === id);
    if (index !== -1) {
      // 从数组中移除任务并保存到本地存储
      todos.value.splice(index, 1);
      saveToLocalStorage();
    }
  };

  // 切换指定任务ID的完成状态
  const toggleTodo = (id: string) => {
    const todo = todos.value.find(todo => todo.id === id);
    if (todo) {
      // 切换完成状态并更新修改时间
      todo.completed = !todo.completed;
      todo.updatedAt = new Date();
      saveToLocalStorage();
    }
  };

  // 更新指定任务ID的任务信息
  const updateTodo = (id: string, updates: Partial<TodoItem>) => {
    const todo = todos.value.find(todo => todo.id === id);
    if (todo) {
      // 合并更新内容并更新修改时间
      Object.assign(todo, updates);
      todo.updatedAt = new Date();
      saveToLocalStorage();
    }
  };

  // 设置新的筛选条件
  const setFilter = (newFilter: Partial<TodoFilter>) => {
    Object.assign(filter.value, newFilter);
  };

  // 设置新的排序规则
  const setSort = (newSort: Partial<TodoSort>) => {
    Object.assign(sort.value, newSort);
  };

  // 设置新的搜索关键词
  const setSearchQuery = (query: string) => {
    searchQuery.value = query;
  };

  // 数据持久化方法
  // 保存任务数据到本地存储 —— 将当前任务列表序列化为JSON并存储到localStorage
  const saveToLocalStorage = () => {
    localStorage.setItem('vue-todos', JSON.stringify(todos.value));
  };

  // 从本地存储加载任务数据 —— 从localStorage读取数据并反序列化，同时转换日期对象
  const loadFromLocalStorage = () => {
    const stored = localStorage.getItem('vue-todos');
    if (stored) {
      const parsed = JSON.parse(stored);
      // 转换日期字符串为Date对象
      todos.value = parsed.map((todo: any) => ({
        ...todo,
        createdAt: new Date(todo.createdAt),
        updatedAt: new Date(todo.updatedAt)
      }));
    }
  };

  // 初始化时加载数据
  loadFromLocalStorage();

  return {
    // 状态
    todos,
    filter,
    sort,
    searchQuery,
    
    // 计算属性
    filteredTodos,
    categories,
    stats,
    
    // 方法
    addTodo,
    removeTodo,
    toggleTodo,
    updateTodo,
    setFilter,
    setSort,
    setSearchQuery,
    loadFromLocalStorage,
    saveToLocalStorage
  };
});