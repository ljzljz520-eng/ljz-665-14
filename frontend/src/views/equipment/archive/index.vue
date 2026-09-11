<template>
  <PageWrapper contentBackground class="equipment-archive">
    <!-- ========== 顶部：搜索条件 ========== -->
    <div class="archive-search">
      <a-form
        :model="queryForm"
        :label-col="{ xs: { span: 6 }, sm: { span: 8 }, md: { span: 24 } }"
        :wrapper-col="{ xs: { span: 18 }, sm: { span: 16 }, md: { span: 24 } }"
      >
        <a-row :gutter="[16, 4]">
          <a-col :xs="24" :sm="12" :lg="6">
            <a-form-item label="设备编码" class="archive-search__item">
              <a-input
                v-model:value="queryForm.code"
                placeholder="请输入设备编码"
                allow-clear
                @press-enter="handleSearch"
              />
            </a-form-item>
          </a-col>
          <a-col :xs="24" :sm="12" :lg="6">
            <a-form-item label="设备名称" class="archive-search__item">
              <a-input
                v-model:value="queryForm.name"
                placeholder="请输入设备名称"
                allow-clear
                @press-enter="handleSearch"
              />
            </a-form-item>
          </a-col>
          <a-col :xs="24" :sm="12" :lg="6">
            <a-form-item label="设备类型" class="archive-search__item">
              <a-select
                v-model:value="queryForm.category"
                placeholder="请选择设备类型"
                :options="categoryOptions"
                allow-clear
              />
            </a-form-item>
          </a-col>
          <a-col :xs="24" :sm="12" :lg="6">
            <a-form-item label="运行状态" class="archive-search__item">
              <a-select
                v-model:value="queryForm.status"
                placeholder="请选择运行状态"
                :options="statusOptions"
                allow-clear
              />
            </a-form-item>
          </a-col>
          <a-col :span="24" class="archive-search__actions">
            <a-space :size="8">
              <a-button type="primary" @click="handleSearch">
                <template #icon><Icon icon="ant-design:search-outlined" /></template>查询
              </a-button>
              <a-button @click="handleReset">
                <template #icon><Icon icon="ant-design:reload-outlined" /></template>重置
              </a-button>
            </a-space>
          </a-col>
        </a-row>
      </a-form>
    </div>

    <!-- ========== 中部：操作按钮 + 表格 ========== -->
    <div class="archive-panel">
      <div class="archive-toolbar">
        <div class="archive-toolbar__left">
          <a-space :size="8" :wrap="isMobile">
            <a-button type="primary" @click="handleAdd">
              <template #icon><Icon icon="ant-design:plus-outlined" /></template>新增
            </a-button>
            <a-button :loading="exportLoading" @click="handleExport">
              <template #icon><Icon icon="ant-design:export-outlined" /></template>导出
            </a-button>
            <a-button @click="loadData">
              <template #icon><Icon icon="ant-design:reload-outlined" /></template>刷新
            </a-button>
            <a-popconfirm
              v-if="selectedRowKeys.length"
              title="确认删除选中的设备档案？"
              ok-text="确认"
              cancel-text="取消"
              @confirm="handleBatchDelete"
            >
              <a-button danger>
                <template #icon><Icon icon="ant-design:delete-outlined" /></template>
                批量删除<template v-if="!isMobile">（{{ selectedRowKeys.length }}）</template>
              </a-button>
            </a-popconfirm>
          </a-space>
        </div>
        <div v-if="!isMobile" class="archive-toolbar__right">
          <span class="archive-toolbar__total">共 {{ total }} 条</span>
        </div>
      </div>

      <!-- 桌面端：数据表格 -->
      <a-table
        v-if="!isMobile"
        :columns="columns"
        :data-source="tableData"
        :loading="loading"
        :pagination="false"
        :scroll="{ x: 1460 }"
        :row-selection="rowSelection"
        row-key="id"
        size="middle"
        :custom-row="customRow"
        class="archive-table"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.dataIndex === 'status'">
            <a-tag :color="getStatusColor(record.status)" class="archive-table__tag">
              {{ getStatusLabel(record.status) }}
            </a-tag>
          </template>
          <template v-else-if="column.dataIndex === 'action'">
            <a-space :size="4" class="archive-table__actions">
              <a-button type="link" size="small" @click.stop="handleDetail(record)">详情</a-button>
              <a-divider type="vertical" />
              <a-button type="link" size="small" @click.stop="handleEdit(record)">编辑</a-button>
              <a-divider type="vertical" />
              <a-popconfirm title="确认删除该设备档案？" ok-text="确认" cancel-text="取消" @confirm="handleDelete(record)">
                <a-button type="link" size="small" danger @click.stop>删除</a-button>
              </a-popconfirm>
            </a-space>
          </template>
        </template>
      </a-table>

      <!-- 窄屏：卡片列表（保证查询 / 查看详情可用） -->
      <div v-else class="archive-cards">
        <a-spin :spinning="loading">
          <template v-if="tableData.length">
            <div v-for="record in tableData" :key="record.id" class="archive-card" @click="handleDetail(record)">
              <div class="archive-card__header">
                <span class="archive-card__name">{{ record.name }}</span>
                <a-tag :color="getStatusColor(record.status)">{{ getStatusLabel(record.status) }}</a-tag>
              </div>
              <div class="archive-card__code">{{ record.code }}</div>
              <div class="archive-card__meta">
                <span>{{ record.category }}</span>
                <span class="archive-card__dot">·</span>
                <span>{{ record.dept }}</span>
                <span class="archive-card__dot">·</span>
                <span>{{ record.keeper }}</span>
              </div>
              <div class="archive-card__footer">
                <span class="archive-card__location">{{ record.location }}</span>
                <a-button type="link" size="small" @click.stop="handleDetail(record)">详情</a-button>
              </div>
            </div>
          </template>
          <a-empty v-else description="暂无设备档案" class="archive-cards__empty" />
        </a-spin>
      </div>

      <!-- 分页 -->
      <div class="archive-pagination">
        <a-pagination
          :current="pageNo"
          :page-size="pageSize"
          :total="total"
          :show-total="isMobile ? undefined : (t: number) => `共 ${t} 条`"
          :show-size-changer="!isMobile"
          :show-quick-jumper="!isMobile"
          :page-size-options="['10', '20', '50']"
          :simple="isMobile"
          size="small"
          @change="onPageChange"
          @show-size-change="onSizeChange"
        />
      </div>
    </div>

    <!-- ========== 右侧：详情抽屉（窄屏全屏） ========== -->
    <DetailDrawer
      :open="detailOpen"
      :detail="currentRecord"
      :is-mobile="isMobile"
      @close="detailOpen = false"
      @edit="handleEditFromDetail"
    />

    <!-- ========== 新增 / 编辑弹窗 ========== -->
    <EquipmentModal
      :open="modalOpen"
      :record="modalRecord"
      :is-mobile="isMobile"
      :category-options="categoryOptions"
      :dept-options="deptOptions"
      @cancel="modalOpen = false"
      @success="handleModalSuccess"
    />
  </PageWrapper>
</template>

<script lang="ts" name="equipment-archive" setup>
  import { ref, reactive, computed, onMounted } from 'vue';
  import { useMediaQuery } from '@vueuse/core';
  import { PageWrapper } from '/@/components/Page';
  import { Icon } from '/@/components/Icon';
  import {
    Form as AForm,
    FormItem as AFormItem,
    Input as AInput,
    Select as ASelect,
    Button as AButton,
    Space as ASpace,
    Table as ATable,
    Tag as ATag,
    Pagination as APagination,
    Popconfirm as APopconfirm,
    Divider as ADivider,
    Spin as ASpin,
    Empty as AEmpty,
  } from 'ant-design-vue';
  import { getEquipmentPage, getEquipmentAll, getCategoryOptions, deleteEquipment, type EquipmentRecord } from '/@/api/equipment/archive';
  import { columns as baseColumns, exportColumns, statusOptions, getStatusColor, getStatusLabel } from './archive.data';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { downloadByData } from '/@/utils/file/download';
  import { formatToDateTime } from '/@/utils/dateUtil';
  import DetailDrawer from './components/DetailDrawer.vue';
  import EquipmentModal from './components/EquipmentModal.vue';

  const { createMessage } = useMessage();

  /** 窄屏（≤768px）切换卡片视图与全屏抽屉 */
  const isMobile = useMediaQuery('(max-width: 768px)');

  /* ---------------- 查询条件 ---------------- */
  const queryForm = reactive({ code: '', name: '', category: undefined as string | undefined, status: undefined as string | undefined });
  const appliedQuery = ref({ ...queryForm });

  /* ---------------- 列表数据 ---------------- */
  const loading = ref(false);
  const tableData = ref<EquipmentRecord[]>([]);
  const total = ref(0);
  const pageNo = ref(1);
  const pageSize = ref(10);
  const selectedRowKeys = ref<string[]>([]);

  const columns = computed(() => [
    ...baseColumns,
    { title: '操作', dataIndex: 'action', width: 160, fixed: 'right' as const, align: 'center' as const },
  ]);

  const rowSelection = computed(() => ({
    selectedRowKeys: selectedRowKeys.value,
    onChange: (keys: (string | number)[]) => {
      selectedRowKeys.value = keys as string[];
    },
  }));

  /** 点击整行打开详情（勾选框与操作按钮不触发） */
  function customRow(record: EquipmentRecord) {
    return {
      onClick: (e: MouseEvent) => {
        const target = e.target as HTMLElement;
        if (target.closest('.ant-checkbox-wrapper') || target.closest('.archive-table__actions')) return;
        handleDetail(record);
      },
      style: { cursor: 'pointer' },
    };
  }

  async function loadData() {
    loading.value = true;
    try {
      const res = await getEquipmentPage({
        ...appliedQuery.value,
        pageNo: pageNo.value,
        pageSize: pageSize.value,
      });
      tableData.value = res.records;
      total.value = res.total;
    } finally {
      loading.value = false;
    }
  }

  function handleSearch() {
    pageNo.value = 1;
    appliedQuery.value = { ...queryForm };
    selectedRowKeys.value = [];
    loadData();
  }

  function handleReset() {
    queryForm.code = '';
    queryForm.name = '';
    queryForm.category = undefined;
    queryForm.status = undefined;
    handleSearch();
  }

  function onPageChange(page: number, size: number) {
    pageNo.value = page;
    pageSize.value = size;
    loadData();
  }

  function onSizeChange(current: number, size: number) {
    pageNo.value = 1;
    pageSize.value = size;
    loadData();
  }

  /* ---------------- 详情抽屉 ---------------- */
  const detailOpen = ref(false);
  const currentRecord = ref<EquipmentRecord | null>(null);

  function handleDetail(record: EquipmentRecord) {
    currentRecord.value = record;
    detailOpen.value = true;
  }

  /* ---------------- 新增 / 编辑 ---------------- */
  const modalOpen = ref(false);
  const modalRecord = ref<EquipmentRecord | null>(null);

  function handleAdd() {
    modalRecord.value = null;
    modalOpen.value = true;
  }

  function handleEdit(record: EquipmentRecord) {
    modalRecord.value = record;
    detailOpen.value = false;
    modalOpen.value = true;
  }

  function handleEditFromDetail(record: EquipmentRecord) {
    handleEdit(record);
  }

  function handleModalSuccess() {
    modalOpen.value = false;
    loadData();
  }

  /* ---------------- 删除 ---------------- */
  async function handleDelete(record: EquipmentRecord) {
    await deleteEquipment(record.id);
    createMessage.success('删除成功');
    if (tableData.value.length === 1 && pageNo.value > 1) {
      pageNo.value -= 1;
    }
    loadData();
  }

  async function handleBatchDelete() {
    await Promise.all(selectedRowKeys.value.map((id) => deleteEquipment(id)));
    createMessage.success(`已删除 ${selectedRowKeys.value.length} 条档案`);
    selectedRowKeys.value = [];
    loadData();
  }

  /* ---------------- 导出（前端生成 CSV，后端就绪后可换为接口导出） ---------------- */
  const exportLoading = ref(false);

  /** CSV 字段转义：含逗号/引号/换行时用双引号包裹 */
  function csvEscape(value: unknown): string {
    const text = value == null ? '' : String(value);
    return /[",\r\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
  }

  async function handleExport() {
    exportLoading.value = true;
    try {
      // 勾选行优先导出选中项，否则按当前查询条件导出全部
      const all = await getEquipmentAll({ ...appliedQuery.value });
      const rows = selectedRowKeys.value.length ? all.filter((r) => selectedRowKeys.value.includes(r.id)) : all;
      if (!rows.length) {
        createMessage.warning('没有可导出的数据');
        return;
      }
      const header = exportColumns.map((c) => c.title).join(',');
      const lines = rows.map((r) =>
        exportColumns.map((c) => csvEscape(c.dataIndex === 'status' ? getStatusLabel(r.status) : r[c.dataIndex])).join(',')
      );
      // 加 BOM 保证 Excel 打开中文不乱码
      const csv = '\uFEFF' + [header, ...lines].join('\r\n');
      downloadByData(csv, `设备档案_${formatToDateTime(undefined, 'YYYYMMDDHHmmss')}.csv`, 'text/csv;charset=utf-8;');
      createMessage.success(`已导出 ${rows.length} 条设备档案`);
    } finally {
      exportLoading.value = false;
    }
  }

  /* ---------------- 字典 ---------------- */
  const categoryOptions = ref<{ value: string; label: string }[]>([]);
  const deptOptions = [
    '生产一车间',
    '生产二车间',
    '质量检测部',
    '设备动力部',
    '仓储物流部',
    '安环部',
  ].map((v) => ({ value: v, label: v }));

  onMounted(async () => {
    const cats = await getCategoryOptions();
    categoryOptions.value = cats.map((c) => ({ value: c, label: c }));
    loadData();
  });
</script>

<style lang="less" scoped>
  .equipment-archive {
    .archive-search {
      padding: 20px 20px 4px;
      margin-bottom: 16px;
      background: #fff;
      border-radius: 8px;

      &__actions {
        display: flex;
      }

      /* 窄屏下查询/重置右对齐并留底部间距 */
      :deep(.ant-form-item) {
        margin-bottom: 16px;
      }
    }

    .archive-panel {
      padding: 16px 20px 12px;
      background: #fff;
      border-radius: 8px;
    }

    .archive-toolbar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 16px;

      &__total {
        font-size: 13px;
        color: rgba(0, 0, 0, 0.45);
      }
    }

    .archive-table {
      :deep(.ant-table-cell) {
        white-space: nowrap;
      }

      &__tag {
        margin-inline-end: 0;
        border-radius: 4px;
      }

      &__actions {
        :deep(.ant-btn) {
          padding: 0 4px;
          height: auto;
        }

        :deep(.ant-divider-vertical) {
          margin: 0;
        }
      }
    }

    .archive-cards {
      &__empty {
        padding: 48px 0;
      }
    }

    .archive-card {
      padding: 12px 14px;
      margin-bottom: 10px;
      background: #fff;
      border: 1px solid #f0f0f0;
      border-radius: 8px;
      transition:
        border-color 0.2s,
        box-shadow 0.2s;

      &:active {
        border-color: #1677ff;
      }

      &__header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 8px;
      }

      &__name {
        font-size: 15px;
        font-weight: 600;
        color: rgba(0, 0, 0, 0.88);
      }

      &__code {
        margin-top: 4px;
        font-size: 13px;
        color: #1677ff;
      }

      &__meta {
        display: flex;
        flex-wrap: wrap;
        gap: 6px;
        align-items: center;
        margin-top: 6px;
        font-size: 13px;
        color: rgba(0, 0, 0, 0.65);
      }

      &__dot {
        color: rgba(0, 0, 0, 0.25);
      }

      &__footer {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-top: 4px;
      }

      &__location {
        font-size: 12px;
        color: rgba(0, 0, 0, 0.45);
      }
    }

    .archive-pagination {
      display: flex;
      justify-content: flex-end;
      padding-top: 16px;
    }
  }

  /* 窄屏：搜索按钮右对齐、面板更紧凑、分页居中 */
  @media (max-width: 768px) {
    .equipment-archive {
      .archive-search {
        padding: 16px 16px 0;

        .archive-search__actions {
          justify-content: flex-end;
          padding-bottom: 12px;
        }
      }

      .archive-panel {
        padding: 12px;
      }

      .archive-pagination {
        justify-content: center;

        :deep(.ant-pagination-options) {
          display: none;
        }
      }
    }
  }
</style>
