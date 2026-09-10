import type { BasicColumn } from '/@/components/Table';
import type { EquipmentRecord } from '/@/api/equipment/archive';

/** 设备运行状态字典：value / 文案 / 标签颜色 */
export const statusMap: Record<string, { label: string; color: string }> = {
  running: { label: '运行中', color: 'success' },
  idle: { label: '闲置', color: 'default' },
  maintenance: { label: '维护中', color: 'processing' },
  fault: { label: '故障', color: 'error' },
  scrapped: { label: '已报废', color: 'warning' },
};

export const statusOptions = Object.keys(statusMap).map((value) => ({
  value,
  label: statusMap[value].label,
}));

export function getStatusLabel(value: string) {
  return statusMap[value]?.label ?? value;
}

export function getStatusColor(value: string) {
  return statusMap[value]?.color ?? 'default';
}

/**
 * 桌面端表格列定义
 * width 为固定列宽，ellipsis 超长省略并悬浮提示，保证后台表格的整齐度
 */
export const columns: BasicColumn[] = [
  { title: '设备编码', dataIndex: 'code', width: 150, ellipsis: true },
  { title: '设备名称', dataIndex: 'name', width: 150, ellipsis: true },
  { title: '设备类型', dataIndex: 'category', width: 100, align: 'center' },
  { title: '规格型号', dataIndex: 'specModel', width: 180, ellipsis: true },
  { title: '生产厂商', dataIndex: 'manufacturer', width: 160, ellipsis: true },
  { title: '所属部门', dataIndex: 'dept', width: 120, ellipsis: true },
  { title: '存放位置', dataIndex: 'location', width: 140, ellipsis: true },
  { title: '责任人', dataIndex: 'keeper', width: 90, align: 'center' },
  { title: '运行状态', dataIndex: 'status', width: 100, align: 'center' },
  { title: '投运日期', dataIndex: 'runDate', width: 110, align: 'center' },
];

/** 详情抽屉中分组的字段 */
export interface DescGroup {
  title: string;
  fields: { label: string; key: keyof EquipmentRecord; type?: 'status' | 'date' }[];
}

export const descGroups: DescGroup[] = [
  {
    title: '基本信息',
    fields: [
      { label: '设备编码', key: 'code' },
      { label: '设备名称', key: 'name' },
      { label: '设备类型', key: 'category' },
      { label: '运行状态', key: 'status', type: 'status' },
      { label: '规格型号', key: 'specModel' },
      { label: '出厂序列号', key: 'serialNo' },
    ],
  },
  {
    title: '厂商与使用',
    fields: [
      { label: '生产厂商', key: 'manufacturer' },
      { label: '所属部门', key: 'dept' },
      { label: '存放位置', key: 'location' },
      { label: '责任人', key: 'keeper' },
    ],
  },
  {
    title: '生命周期',
    fields: [
      { label: '购置日期', key: 'purchaseDate', type: 'date' },
      { label: '投运日期', key: 'runDate', type: 'date' },
      { label: '质保到期', key: 'warrantyDate', type: 'date' },
      { label: '备注', key: 'remark' },
    ],
  },
];

/** 空档案对象，供新增使用 */
export function emptyRecord(): EquipmentRecord {
  return {
    id: '',
    code: '',
    name: '',
    category: '',
    specModel: '',
    manufacturer: '',
    serialNo: '',
    dept: '',
    location: '',
    keeper: '',
    status: 'running',
    purchaseDate: '',
    runDate: '',
    warrantyDate: '',
    remark: '',
  };
}
