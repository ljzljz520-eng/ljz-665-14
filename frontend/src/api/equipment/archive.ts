import type { BasicResult } from '/@/api/model/baseModel';

/**
 * 设备档案接口层
 * 当前为前端内置模拟数据，便于在后端接口就绪前联调页面。
 * 后端就绪后只需将 getEquipmentPage / getEquipmentAll / saveEquipment / deleteEquipment
 * 内部替换为 defHttp 请求即可（入参/出参结构保持不变）。
 */

export interface EquipmentRecord {
  id: string;
  code: string; // 设备编码
  name: string; // 设备名称
  category: string; // 设备类型
  specModel: string; // 规格型号
  manufacturer: string; // 生产厂商
  serialNo: string; // 出厂序列号
  dept: string; // 所属部门
  location: string; // 存放位置
  keeper: string; // 责任人
  status: string; // 运行状态
  purchaseDate: string; // 购置日期
  runDate: string; // 投运日期
  warrantyDate: string; // 质保到期
  remark?: string; // 备注
}

export interface EquipmentQuery {
  code?: string;
  name?: string;
  category?: string;
  status?: string;
  pageNo?: number;
  pageSize?: number;
}

const categories = ['生产设备', '检测设备', '动力设备', '办公设备', '环保设备', '特种设备'];
const manufacturers = ['沈阳机床集团', '西门子（中国）', '华中数控股份', 'ABB（中国）', '施耐德电气', '海天精工', '北京时代之峰', '汇川技术'];
const depts = ['生产一车间', '生产二车间', '质量检测部', '设备动力部', '仓储物流部', '安环部'];
const keepers = ['张伟', '王芳', '李强', '刘洋', '陈静', '赵磊', '孙敏', '周杰'];
const locations = ['一号厂房 A 区', '一号厂房 B 区', '二号厂房', '质检中心 201', '动力站房', '成品仓库'];
const statuses = ['running', 'idle', 'maintenance', 'fault', 'scrapped'];
const specs = [
  'CK6140 × 1000mm', 'XK7136C / 7.5kW', 'S7-1500 CPU1516', 'ACS580-07-088A',
  'NSX400N 3P 400A', 'HTM-850G 三轴', 'TIME-TH1101', 'MD480T70B 70kW',
];

function pad(n: number, len = 3) {
  return String(n).padStart(len, '0');
}

function buildMockData(): EquipmentRecord[] {
  const list: EquipmentRecord[] = [];
  const total = 56;
  for (let i = 1; i <= total; i++) {
    const category = categories[i % categories.length];
    const status = statuses[i % statuses.length];
    const purchaseYear = 2018 + (i % 7);
    const purchaseDate = `${purchaseYear}-${pad((i % 12) + 1, 2)}-${pad((i % 27) + 1, 2)}`;
    const runDate = `${purchaseYear}-${pad(((i + 2) % 12) + 1, 2)}-15`;
    const warrantyDate = `${purchaseYear + 2}-${pad((i % 12) + 1, 2)}-${pad((i % 27) + 1, 2)}`;
    list.push({
      id: pad(i),
      code: `EQ-${purchaseYear}-${pad(i, 4)}`,
      name: `${category.slice(0, 2)}单元 ${['一号机', '二号机', '三号机', '四号机'][i % 4]}`,
      category,
      specModel: specs[i % specs.length],
      manufacturer: manufacturers[i % manufacturers.length],
      serialNo: `SN${purchaseYear}${pad(i, 4)}${(i * 7) % 100}`,
      dept: depts[i % depts.length],
      location: locations[i % locations.length],
      keeper: keepers[i % keepers.length],
      status,
      purchaseDate,
      runDate,
      warrantyDate,
      remark: i % 5 === 0 ? '年度预防性维护计划内设备' : '',
    });
  }
  return list;
}

const mockDb: EquipmentRecord[] = buildMockData();

function delay(ms = 220) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/** 按条件筛选设备档案（内部分页/导出共用） */
function filterRows(params: EquipmentQuery): EquipmentRecord[] {
  const { code, name, category, status } = params;
  let rows = [...mockDb];
  if (code) rows = rows.filter((r) => r.code.toLowerCase().includes(code.toLowerCase()));
  if (name) rows = rows.filter((r) => r.name.includes(name));
  if (category) rows = rows.filter((r) => r.category === category);
  if (status) rows = rows.filter((r) => r.status === status);
  return rows;
}

/** 分页查询设备档案 */
export async function getEquipmentPage(params: EquipmentQuery): Promise<BasicResult<EquipmentRecord>> {
  await delay();
  const { pageNo = 1, pageSize = 10 } = params;
  const rows = filterRows(params);
  const total = rows.length;
  const start = (pageNo - 1) * pageSize;
  return { records: rows.slice(start, start + pageSize), total };
}

/** 查询全部符合条件的设备档案（不分页，供导出使用） */
export async function getEquipmentAll(params: EquipmentQuery): Promise<EquipmentRecord[]> {
  await delay();
  return filterRows(params);
}

/** 查询设备类型字典（模拟） */
export async function getCategoryOptions(): Promise<string[]> {
  await delay(80);
  return [...categories];
}

/** 新增 / 编辑设备档案 */
export async function saveEquipment(data: EquipmentRecord): Promise<string> {
  await delay(180);
  const idx = mockDb.findIndex((r) => r.id === data.id);
  if (idx >= 0) {
    mockDb.splice(idx, 1, { ...mockDb[idx], ...data });
    return mockDb[idx].id;
  }
  const nextId = pad(mockDb.length + 1);
  mockDb.unshift({ ...data, id: nextId });
  return nextId;
}

/** 删除设备档案 */
export async function deleteEquipment(id: string): Promise<void> {
  await delay(150);
  const idx = mockDb.findIndex((r) => r.id === id);
  if (idx >= 0) mockDb.splice(idx, 1);
}
