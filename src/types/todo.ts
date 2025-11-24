// TODO 应用的数据类型定义
export interface TodoItem {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  category: string;
  priority: 'low' | 'medium' | 'high';
  createdAt: Date;
  updatedAt: Date;
}

export interface TodoFilter {
  category: string;
  status: 'all' | 'active' | 'completed';
  priority: 'all' | 'low' | 'medium' | 'high';
}

export interface TodoSort {
  field: 'createdAt' | 'priority' | 'title';
  direction: 'asc' | 'desc';
}