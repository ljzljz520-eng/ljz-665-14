<template>
  <a-modal
    :open="open"
    :title="isUpdate ? '编辑设备档案' : '新增设备档案'"
    :width="isMobile ? '92%' : 640"
    :confirm-loading="confirmLoading"
    :destroy-on-close="true"
    :mask-closable="false"
    @ok="handleSubmit"
    @cancel="handleCancel"
  >
    <a-form
      ref="formRef"
      :model="formModel"
      :rules="rules"
      :label-col="{ span: 8 }"
      :wrapper-col="{ span: 16 }"
      layout="horizontal"
    >
      <a-row :gutter="isMobile ? 0 : 16">
        <a-col :span="isMobile ? 24 : 12">
          <a-form-item label="设备编码" name="code">
            <a-input v-model:value="formModel.code" placeholder="如 EQ-2024-0001" :maxlength="30" allow-clear />
          </a-form-item>
        </a-col>
        <a-col :span="isMobile ? 24 : 12">
          <a-form-item label="设备名称" name="name">
            <a-input v-model:value="formModel.name" placeholder="请输入设备名称" :maxlength="30" allow-clear />
          </a-form-item>
        </a-col>
        <a-col :span="isMobile ? 24 : 12">
          <a-form-item label="设备类型" name="category">
            <a-select v-model:value="formModel.category" placeholder="请选择设备类型" :options="categoryOptions" allow-clear />
          </a-form-item>
        </a-col>
        <a-col :span="isMobile ? 24 : 12">
          <a-form-item label="运行状态" name="status">
            <a-select v-model:value="formModel.status" placeholder="请选择运行状态" :options="statusOptions" />
          </a-form-item>
        </a-col>
        <a-col :span="isMobile ? 24 : 12">
          <a-form-item label="规格型号" name="specModel">
            <a-input v-model:value="formModel.specModel" placeholder="请输入规格型号" :maxlength="40" allow-clear />
          </a-form-item>
        </a-col>
        <a-col :span="isMobile ? 24 : 12">
          <a-form-item label="生产厂商" name="manufacturer">
            <a-input v-model:value="formModel.manufacturer" placeholder="请输入生产厂商" :maxlength="30" allow-clear />
          </a-form-item>
        </a-col>
        <a-col :span="isMobile ? 24 : 12">
          <a-form-item label="出厂序列号" name="serialNo">
            <a-input v-model:value="formModel.serialNo" placeholder="请输入序列号" :maxlength="30" allow-clear />
          </a-form-item>
        </a-col>
        <a-col :span="isMobile ? 24 : 12">
          <a-form-item label="所属部门" name="dept">
            <a-select
              v-model:value="formModel.dept"
              placeholder="请选择所属部门"
              :options="deptOptions"
              show-search
              allow-clear
            />
          </a-form-item>
        </a-col>
        <a-col :span="isMobile ? 24 : 12">
          <a-form-item label="存放位置" name="location">
            <a-input v-model:value="formModel.location" placeholder="请输入存放位置" :maxlength="30" allow-clear />
          </a-form-item>
        </a-col>
        <a-col :span="isMobile ? 24 : 12">
          <a-form-item label="责任人" name="keeper">
            <a-input v-model:value="formModel.keeper" placeholder="请输入责任人" :maxlength="10" allow-clear />
          </a-form-item>
        </a-col>
        <a-col :span="isMobile ? 24 : 12">
          <a-form-item label="购置日期" name="purchaseDate">
            <a-date-picker v-model:value="purchaseDate" value-format="YYYY-MM-DD" style="width: 100%" />
          </a-form-item>
        </a-col>
        <a-col :span="isMobile ? 24 : 12">
          <a-form-item label="投运日期" name="runDate">
            <a-date-picker v-model:value="runDate" value-format="YYYY-MM-DD" style="width: 100%" />
          </a-form-item>
        </a-col>
        <a-col :span="isMobile ? 24 : 12">
          <a-form-item label="质保到期" name="warrantyDate">
            <a-date-picker v-model:value="warrantyDate" value-format="YYYY-MM-DD" style="width: 100%" />
          </a-form-item>
        </a-col>
        <a-col :span="24">
          <a-form-item
            label="备注"
            name="remark"
            :label-col="{ span: isMobile ? 8 : 4 }"
            :wrapper-col="{ span: isMobile ? 16 : 19 }"
          >
            <a-textarea v-model:value="formModel.remark" placeholder="请输入备注信息" :rows="2" :maxlength="200" show-count />
          </a-form-item>
        </a-col>
      </a-row>
    </a-form>
  </a-modal>
</template>

<script lang="ts" name="equipment-archive-modal" setup>
  import { ref, reactive, watch } from 'vue';
  import {
    Modal as AModal,
    Form as AForm,
    Input as AInput,
    Select as ASelect,
    DatePicker,
    Row as ARow,
    Col as ACol,
    Textarea,
  } from 'ant-design-vue';
  import type { Rule } from 'ant-design-vue/es/form';
  import { saveEquipment, type EquipmentRecord } from '/@/api/equipment/archive';
  import { statusOptions, emptyRecord } from '../archive.data';
  import { useMessage } from '/@/hooks/web/useMessage';

  const ADatePicker = DatePicker;
  const ATextarea = Textarea;
  const { createMessage } = useMessage();

  const props = defineProps<{
    open: boolean;
    record: EquipmentRecord | null;
    isMobile: boolean;
    categoryOptions: { value: string; label: string }[];
    deptOptions: { value: string; label: string }[];
  }>();

  const emit = defineEmits<{
    (e: 'cancel'): void;
    (e: 'success'): void;
  }>();

  const formRef = ref();
  const confirmLoading = ref(false);
  const isUpdate = ref(false);
  const formModel = reactive<EquipmentRecord>(emptyRecord());
  const purchaseDate = ref('');
  const runDate = ref('');
  const warrantyDate = ref('');

  const rules: Record<string, Rule[]> = {
    code: [{ required: true, message: '请输入设备编码', trigger: 'blur' }],
    name: [{ required: true, message: '请输入设备名称', trigger: 'blur' }],
    category: [{ required: true, message: '请选择设备类型', trigger: 'change' }],
    status: [{ required: true, message: '请选择运行状态', trigger: 'change' }],
    dept: [{ required: true, message: '请选择所属部门', trigger: 'change' }],
  };

  watch(
    () => props.open,
    (open) => {
      if (!open) return;
      const source = props.record ?? emptyRecord();
      isUpdate.value = !!props.record;
      Object.assign(formModel, emptyRecord(), source);
      // 空字符串归为 undefined，确保下拉框显示 placeholder
      if (!formModel.category) formModel.category = undefined as unknown as string;
      if (!formModel.dept) formModel.dept = undefined as unknown as string;
      purchaseDate.value = source.purchaseDate;
      runDate.value = source.runDate;
      warrantyDate.value = source.warrantyDate;
    },
  );

  function handleCancel() {
    emit('cancel');
  }

  async function handleSubmit() {
    try {
      await formRef.value.validate();
    } catch {
      return;
    }
    confirmLoading.value = true;
    try {
      await saveEquipment({ ...formModel, purchaseDate: purchaseDate.value, runDate: runDate.value, warrantyDate: warrantyDate.value });
      createMessage.success(isUpdate.value ? '设备档案已更新' : '设备档案已新增');
      emit('success');
    } finally {
      confirmLoading.value = false;
    }
  }
</script>
