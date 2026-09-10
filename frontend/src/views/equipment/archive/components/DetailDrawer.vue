<template>
  <a-drawer
    :open="open"
    :width="drawerWidth"
    :title="detail ? `设备详情 · ${detail.code}` : '设备详情'"
    placement="right"
    :destroy-on-close="true"
    @close="handleClose"
  >
    <template v-if="detail">
      <!-- 状态概要 -->
      <div class="archive-detail__summary">
        <div class="archive-detail__name">{{ detail.name }}</div>
        <a-tag :color="getStatusColor(detail.status)" class="archive-detail__status">
          {{ getStatusLabel(detail.status) }}
        </a-tag>
      </div>

      <a-divider class="archive-detail__divider" />

      <!-- 分组描述 -->
      <div v-for="group in descGroups" :key="group.title" class="archive-detail__group">
        <div class="archive-detail__group-title">{{ group.title }}</div>
        <a-descriptions :column="descColumn" size="small" :label-style="labelStyle" :content-style="contentStyle">
          <a-descriptions-item v-for="f in group.fields" :key="f.key" :label="f.label">
            <a-tag v-if="f.type === 'status'" :color="getStatusColor(detail[f.key] as string)">
              {{ getStatusLabel(detail[f.key] as string) }}
            </a-tag>
            <span v-else-if="detail[f.key]">{{ detail[f.key] }}</span>
            <span v-else class="archive-detail__empty">—</span>
          </a-descriptions-item>
        </a-descriptions>
      </div>
    </template>

    <template #footer>
      <div class="archive-detail__footer">
        <a-space :size="8">
          <a-button @click="handleClose">关闭</a-button>
          <a-button type="primary" @click="handleEdit">编辑</a-button>
        </a-space>
      </div>
    </template>
  </a-drawer>
</template>

<script lang="ts" name="equipment-detail-drawer" setup>
  import { computed } from 'vue';
  import { Drawer as ADrawer, Tag as ATag, Button as AButton, Space as ASpace, Divider as ADivider, Descriptions } from 'ant-design-vue';
  import type { EquipmentRecord } from '/@/api/equipment/archive';
  import { descGroups, getStatusColor, getStatusLabel } from '../archive.data';

  const ADescriptions = Descriptions;
  const ADescriptionsItem = Descriptions.Item;

  const props = defineProps<{
    open: boolean;
    detail: EquipmentRecord | null;
    isMobile: boolean;
  }>();

  const emit = defineEmits<{
    (e: 'close'): void;
    (e: 'edit', record: EquipmentRecord): void;
  }>();

  /** 窄屏抽屉占满宽度，桌面固定宽度，贴近参考图右侧详情面板 */
  const drawerWidth = computed(() => (props.isMobile ? '100%' : 560));
  const descColumn = computed(() => (props.isMobile ? 1 : 2));

  const labelStyle = { width: '96px', color: 'rgba(0,0,0,0.45)' };
  const contentStyle = { color: 'rgba(0,0,0,0.88)' };

  function handleClose() {
    emit('close');
  }

  function handleEdit() {
    if (props.detail) emit('edit', props.detail);
  }
</script>

<style lang="less" scoped>
  .archive-detail {
    &__summary {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
    }

    &__name {
      font-size: 16px;
      font-weight: 600;
      color: rgba(0, 0, 0, 0.88);
      line-height: 1.4;
    }

    &__status {
      margin-inline-end: 0;
      border-radius: 4px;
    }

    &__divider {
      margin: 16px 0;
    }

    &__group {
      margin-bottom: 8px;
    }

    &__group-title {
      position: relative;
      padding-left: 8px;
      margin-bottom: 12px;
      font-size: 14px;
      font-weight: 600;
      color: rgba(0, 0, 0, 0.88);

      &::before {
        position: absolute;
        top: 2px;
        left: 0;
        width: 3px;
        height: 14px;
        background: #1677ff;
        border-radius: 2px;
        content: '';
      }
    }

    &__empty {
      color: rgba(0, 0, 0, 0.25);
    }

    &__footer {
      display: flex;
      justify-content: flex-end;
    }
  }
</style>
