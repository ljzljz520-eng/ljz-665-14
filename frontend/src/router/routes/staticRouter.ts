import type { AppRouteRecordRaw } from '/@/router/types';
import { LAYOUT } from '/@/router/constant';

export const AI_ROUTE: AppRouteRecordRaw = {
  path: '',
  name: 'ai-parent',
  component: LAYOUT,
  meta: {
    title: 'ai',
  },
  children: [
    {
      path: '/ai',
      name: 'ai',
      component: () => import('/@/views/dashboard/ai/index.vue'),
      meta: {
        title: 'AI助手',
      },
    },
  ],
};


export const EQUIPMENT_ARCHIVE_ROUTE: AppRouteRecordRaw = {
  path: '',
  name: 'equipment-parent',
  component: LAYOUT,
  meta: {
    title: '设备管理',
  },
  children: [
    {
      path: '/equipment/archive',
      name: 'EquipmentArchive',
      component: () => import('/@/views/equipment/archive/index.vue'),
      meta: {
        title: '设备档案',
        icon: 'ant-design:hdd-outlined',
      },
    },
  ],
};

export const staticRoutesList = [AI_ROUTE, EQUIPMENT_ARCHIVE_ROUTE];

