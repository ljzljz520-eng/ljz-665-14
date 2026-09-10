-- =============================================================
-- 设备档案页面 - 菜单注册（可选）
-- 适用：JeecgBoot 后台菜单模式（permissionMode = BACK）
-- 不执行本 SQL 也可直接访问地址：/equipment/archive
-- 执行前请确认 ID 未与现有 sys_permission 主键冲突
-- =============================================================

-- 一级目录：设备管理
INSERT INTO `sys_permission`
(`id`, `parent_id`, `name`, `url`, `component`, `is_route`, `component_name`, `redirect`,
 `menu_type`, `perms`, `perms_type`, `sort_no`, `always_show`, `icon`, `is_leaf`,
 `keep_alive`, `hidden`, `hide_tab`, `description`, `create_by`, `create_time`,
 `update_by`, `update_time`, `del_flag`, `rule_flag`, `status`, `internal_or_external`)
VALUES
('9000000000000000001', NULL, '设备管理', '/equipment', 'layouts/default/index', 1, '', NULL,
 0, NULL, '1', 5.00, 0, 'ant-design:hdd-outlined', 0,
 0, 0, 0, '设备管理目录', 'admin', NOW(),
 NULL, NULL, 0, 0, '1', 0);

-- 二级菜单：设备档案
INSERT INTO `sys_permission`
(`id`, `parent_id`, `name`, `url`, `component`, `is_route`, `component_name`, `redirect`,
 `menu_type`, `perms`, `perms_type`, `sort_no`, `always_show`, `icon`, `is_leaf`,
 `keep_alive`, `hidden`, `hide_tab`, `description`, `create_by`, `create_time`,
 `update_by`, `update_time`, `del_flag`, `rule_flag`, `status`, `internal_or_external`)
VALUES
('9000000000000000002', '9000000000000000001', '设备档案', '/equipment/archive', 'equipment/archive/index', 1, 'EquipmentArchive', NULL,
 1, NULL, '1', 1.00, 0, 'ant-design:profile-outlined', 1,
 1, 0, 0, '设备档案管理', 'admin', NOW(),
 NULL, NULL, 0, 0, '1', 0);

-- 授权给管理员角色（角色 ID 以实际库中 admin 角色为准，JeecgBoot 默认管理员通常可见全部菜单）
INSERT INTO `sys_role_permission` (`id`, `role_id`, `permission_id`) VALUES
('9000000000000000003', 'f6817f48af4fb92546a37a7d471e80cb', '9000000000000000001'),
('9000000000000000004', 'f6817f48af4fb92546a37a7d471e80cb', '9000000000000000002');
