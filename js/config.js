/**
 * 江苏省丹阳高级中学 · 智慧校园 Demo 共享配置
 * 三端共用校名、导航与入口清单；业务页后续再接。
 */
window.DY = window.DY || {};

DY.SCHOOL = {
  name: '江苏省丹阳高级中学',
  nameEn: 'Danyang High School Of Jiangsu Province',
  short: '丹中',
  websiteLabel: '丹中官网',
  websiteUrl: '#',
  motto: '一训三风',
  mottoItems: [
    { label: '校训', value: '正谊明道，成德达材' },
    { label: '校风', value: '爱国 勤奋 创新' },
    { label: '教风', value: '爱生 博学 善教' },
    { label: '学风', value: '勤学 善思 进取' },
  ],
};

DY.USER = {
  teacher: { name: '苏诚', role: '教师', avatar: 'assets/teacher-avatar.svg' },
  admin: { name: '陈秀娟', role: '学校管理员', avatar: '管' },
  parentChild: { name: '陈思远', className: '高二(3)班', avatar: 'assets/student-avatar.svg' },
};

/** PC 顶栏一级导航（对齐现网截图） */
DY.PC_NAV = [
  { key: 'home', label: '首页', path: '#/home' },
  { key: 'family', label: '家校互动', path: '#/family/notice/inbox' },
  { key: 'office', label: '校园办公', path: '#/office/venue/today' },
  { key: 'av', label: '电教管理', path: '#/av/sms' },
  { key: 'logistics', label: '后勤管理', path: '#/logistics/asset' },
  { key: 'evaluation', label: '学生评价', path: '#/evaluation/class-eval/date' },
  { key: 'student', label: '学生管理', path: '#/student/leave-stats' },
  { key: 'safety', label: '安全管理', path: '#/safety/visit/stats' },
  { key: 'data', label: '数据平台', path: '#/data/users' },
  { key: 'system', label: '系统管理', path: '#/system/users' },
];

/**
 * 各一级栏目侧栏（对齐现网截图）
 * 物品领用 / 报修管理 现网有展开箭头但子项未截到 → 暂作一级入口，子菜单【待确认】
 */
DY.SIDEBARS = {
  family: [
    {
      key: 'notice',
      label: '通知公告',
      icon: 'notice',
      defaultOpen: true,
      children: [
        { key: 'inbox', label: '收通知', path: '#/family/notice/inbox' },
        { key: 'send', label: '发通知', path: '#/family/notice/send' },
        { key: 'all', label: '全部通知', path: '#/family/notice/all' },
        { key: 'class', label: '班级通知', path: '#/family/notice/class' },
        { key: 'send-stats', label: '发送统计', path: '#/family/notice/send-stats' },
        { key: 'read-stats', label: '阅读率统计', path: '#/family/notice/read-stats' },
        { key: 'archive', label: '归档数据', path: '#/family/notice/archive' },
        { key: 'parent-read-stats', label: '家长阅读率统计', path: '#/family/notice/parent-read-stats' },
      ],
    },
    { key: 'meal', label: '食谱订餐', icon: 'menu', path: '#/family/meal' },
    { key: 'leave-stats', label: '学生请假统计', icon: 'leave', path: '#/family/leave-stats' },
    { key: 'leave-board', label: '学生请假接离看板', icon: 'board', path: '#/family/leave-board' },
    { key: 'groups', label: '常用组', icon: 'meeting', path: '#/family/groups' },
  ],
  office: [
    {
      key: 'venue',
      label: '场馆预约',
      icon: 'venue',
      defaultOpen: true,
      children: [
        { key: 'today', label: '当日预约', path: '#/office/venue/today' },
        { key: 'mine', label: '我的预约', path: '#/office/venue/mine' },
        { key: 'audit', label: '资源审核', path: '#/office/venue/audit' },
        { key: 'stats', label: '资源预约统计', path: '#/office/venue/stats' },
      ],
    },
    { key: 'attendance', label: '教师出勤统计', icon: 'leaveOk', path: '#/office/attendance' },
    { key: 'docflow', label: '公文流转', icon: 'docflow', path: '#/office/docflow' },
    { key: 'patrol', label: '校园巡查', icon: 'inspect', path: '#/office/patrol' },
    { key: 'inspect-stats', label: '综合检查统计', icon: 'board', path: '#/office/inspect-stats' },
    { key: 'suggest', label: '建议箱处理', icon: 'suggest', path: '#/office/suggest' },
    { key: 'print', label: '印制管理', icon: 'print', path: '#/office/print' },
  ],
  av: [
    { key: 'sms', label: '短信管理', icon: 'sms', path: '#/av/sms' },
    { key: 'supply', label: '物品领用', icon: 'supply', path: '#/av/supply', pendingChildren: true },
    { key: 'repair', label: '报修管理', icon: 'repair', path: '#/av/repair', pendingChildren: true },
    { key: 'dorm', label: '宿舍管理', icon: 'dorm', path: '#/av/dorm' },
  ],
  logistics: [
    { key: 'asset', label: '小额资产管理', icon: 'supply', path: '#/logistics/asset' },
    { key: 'repair', label: '报修管理', icon: 'repair', path: '#/logistics/repair' },
  ],
  evaluation: [
    {
      key: 'class-eval',
      label: '班级评价统计',
      icon: 'eval',
      defaultOpen: true,
      children: [
        { key: 'date', label: '日期统计', path: '#/evaluation/class-eval/date' },
        { key: 'period', label: '时段统计', path: '#/evaluation/class-eval/period' },
      ],
    },
  ],
  student: [
    { key: 'leave-stats', label: '学生请假统计', icon: 'student', path: '#/student/leave-stats' },
    { key: 'leave-board', label: '学生请假接离看板', icon: 'board', path: '#/student/leave-board' },
  ],
  safety: [
    {
      key: 'visit',
      label: '访客预约统计',
      icon: 'visit',
      defaultOpen: true,
      children: [
        { key: 'stats', label: '预约统计', path: '#/safety/visit/stats' },
        { key: 'settings', label: '预约设置', path: '#/safety/visit/settings' },
      ],
    },
  ],
  data: [
    { key: 'users', label: '用户管理', icon: 'users', path: '#/data/users' },
    { key: 'course', label: '课程管理', icon: 'timetable', path: '#/data/course' },
    { key: 'dept', label: '部门管理', icon: 'org', path: '#/data/dept' },
    { key: 'subject', label: '学科管理', icon: 'dict', path: '#/data/subject' },
    { key: 'venue', label: '场地管理', icon: 'venue', path: '#/data/venue' },
    { key: 'school', label: '学校管理', icon: 'dorm', path: '#/data/school' },
    { key: 'seal', label: '公章管理', icon: 'audit', path: '#/data/seal' },
    { key: 'post', label: '岗位管理', icon: 'teacher', path: '#/data/post' },
    { key: 'assign-class', label: '分班管理', icon: 'student', path: '#/data/assign-class' },
    { key: 'curriculum', label: '课程体系', icon: 'menu', path: '#/data/curriculum' },
    { key: 'grade-class', label: '年级班级', icon: 'apps', path: '#/data/grade-class' },
    { key: 'enrollment', label: '学籍管理', icon: 'idcard', path: '#/data/enrollment' },
    { key: 'semester', label: '学期管理', icon: 'leave', path: '#/data/semester' },
    { key: 'alumni', label: '校友管理', icon: 'meeting', path: '#/data/alumni' },
    { key: 'temp-staff', label: '临时人员管理', icon: 'visit', path: '#/data/temp-staff' },
  ],
  system: [
    { key: 'users', label: '用户管理', icon: 'users', path: '#/system/users' },
    { key: 'teach', label: '教师任教设置', icon: 'teacher', path: '#/system/teach' },
    { key: 'dept-head', label: '部门主任', icon: 'org', path: '#/system/dept-head' },
    { key: 'hierarchy', label: '上下级管理', icon: 'org', path: '#/system/hierarchy' },
    { key: 'dict', label: '学校字典', icon: 'dict', path: '#/system/dict' },
    { key: 'settings', label: '系统设置', icon: 'settings', path: '#/system/settings' },
    { key: 'apps', label: '应用管理', icon: 'apps', path: '#/system/apps' },
    { key: 'module-analytics', label: '模块使用分析', icon: 'analytics', path: '#/system/module-analytics' },
    { key: 'user-analytics', label: '用户分析', icon: 'analytics', path: '#/system/user-analytics' },
    { key: 'invite', label: '邀请函', icon: 'invite', path: '#/system/invite' },
    { key: 'hardware', label: '硬件设备', icon: 'hardware', path: '#/system/hardware' },
    { key: 'face', label: '人脸库管理', icon: 'face', path: '#/system/face' },
    { key: 'logs', label: '日志管理', icon: 'log', path: '#/system/logs' },
    { key: 'export', label: '数据导出', icon: 'export', path: '#/system/export' },
  ],
};

/** @deprecated 兼容旧引用，等同 DY.SIDEBARS.family */
DY.FAMILY_SIDEBAR = DY.SIDEBARS.family;

/** 场馆当日预约演示资源名（对齐现网列表） */
DY.VENUE_RESOURCES = [
  '102报告厅', '103报告厅', '105报告厅',
  '8104公开课教室', '7104公开课教室', '6104公开课教室',
  '5401集备室 (1)', '319行政会议室', '中讲堂', '科技报告厅',
  '8202会议室', '7204会议室',
];

/** 访客预约演示行 */
DY.VISIT_DEMO_ROWS = [
  { name: '苏诚1', phone: '13082552952', time: '2026-10-28 06:00', reason: '测试' },
  { name: '左', phone: '13905293918', time: '2026-10-27 06:00', reason: '找高老师' },
  { name: '苏诚', phone: '13082552952', time: '2026-10-27 06:02', reason: '测试' },
];

/** 用户管理演示行 */
DY.USER_DEMO_ROWS = [
  { name: '潘国良', dept: '校长室、化学', username: '10001' },
  { name: '顾伟山', dept: '副校长室、物理', username: '10002' },
  { name: '陈秀娟', dept: '办公室、语文', username: '10003' },
  { name: '苏诚', dept: '教务处、数学', username: '10004' },
];

/** 线性图标（白描于色底圆上） */
DY.ICONS = {
  leave: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/><path d="M12 14v3M10.5 15.5h3"/></svg>',
  supply: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-4 9 4v10a1 1 0 01-1 1H4a1 1 0 01-1-1V9z"/><path d="M3 9l9 4 9-4M12 13v7"/></svg>',
  venue: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4M8 15h3M13 15h3M8 18h8"/></svg>',
  print: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M7 8V4h10v4"/><rect x="4" y="8" width="16" height="9" rx="2"/><path d="M7 17h10v4H7z"/><circle cx="17" cy="12.5" r=".8" fill="currentColor" stroke="none"/></svg>',
  docflow: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><path d="M14 2v6h6M8 13h8M8 17h5"/><path d="M9 9.5l1.5 1.5L13 8"/></svg>',
  dorm: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 21V8l9-5 9 5v13"/><path d="M9 21v-6h6v6M9 10h.01M15 10h.01"/></svg>',
  repair: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z"/></svg>',
  audit: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2"/><rect x="9" y="3" width="6" height="4" rx="1"/><path d="M8 13l2.5 2.5L16 10"/></svg>',
  classrank: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M8 21h8M12 17v4M7 4h10v5a5 5 0 01-10 0V4z"/><path d="M7 6H4.5a2 2 0 000 4H7M17 6h2.5a2 2 0 010 4H17"/></svg>',
  meal: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12h16a8 8 0 01-16 0z"/><path d="M8 7c.5 1.5 1.6 2.5 4 2.5S15.5 8.5 16 7"/><path d="M12 4v3"/><path d="M18 4l2 3"/></svg>',
  meeting: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg>',
  board: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="14" rx="2"/><path d="M8 21h8M12 18v3M8 14v-4M12 14V8M16 14v-2"/></svg>',
  purchase: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="20" r="1.5"/><circle cx="18" cy="20" r="1.5"/><path d="M3 4h2l2.4 11.2a2 2 0 002 1.6h8.4a2 2 0 001.9-1.4L22 8H7"/></svg>',
  av: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="6" width="14" height="12" rx="2"/><path d="M16 10l6-3v10l-6-3"/><circle cx="9" cy="12" r="2"/></svg>',
  website: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 010 18M12 3a14 14 0 000 18"/></svg>',
  contacts: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="3" width="14" height="18" rx="2"/><path d="M9 3v18"/><circle cx="14.2" cy="9" r="1.5"/><path d="M12.2 14.2c.4-1.2 1.1-1.8 2-1.8s1.6.6 2 1.8"/></svg>',
  notice: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 11v2a1 1 0 001 1h2l6 4V6L6 10H4a1 1 0 00-1 1z"/><path d="M16 8.5a5 5 0 010 7"/><path d="M18.5 6a8 8 0 010 12"/></svg>',
  menu: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5A2.5 2.5 0 016.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"/><path d="M9 7h7M9 11h5"/></svg>',
  leaveOk: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M16 11l2 2 4-4"/></svg>',
  venueStat: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-4 9 4v10H3z"/><path d="M3 9l9 4 9-4"/><path d="M9 14v4M12 13v5M15 14.5V18"/></svg>',
  inspect: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/><path d="M8 11h6M11 8v6"/></svg>',
  logistics: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 7h13v10H3z"/><path d="M16 10h4l2 3v4h-6"/><circle cx="7.5" cy="18.5" r="1.5"/><circle cx="18.5" cy="18.5" r="1.5"/></svg>',
  suggest: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16v12H8l-4 4V4z"/><path d="M8 9h8M8 12h5"/></svg>',
  student: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3l10 5-10 5L2 8l10-5z"/><path d="M6 10.5V16c0 1.5 2.7 3 6 3s6-1.5 6-3v-5.5"/></svg>',
  idcard: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="18" height="14" rx="2"/><circle cx="9" cy="12" r="2.2"/><path d="M14 10h5M14 14h4"/><path d="M5 17c.6-1.4 2-2.2 4-2.2s3.4.8 4 2.2"/></svg>',
  visit: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 10l9-7 9 7v10a2 2 0 01-2 2h-4v-6H9v6H5a2 2 0 01-2-2V10z"/></svg>',
  findTeacher: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="10" cy="8" r="3.2"/><path d="M4.5 19c.8-3.5 3-5.2 5.5-5.2S14.7 15.5 15.5 19"/><circle cx="17.5" cy="16.5" r="3.2"/><path d="M19.8 18.8L22 21"/></svg>',
  timetable: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="16" rx="2"/><path d="M3 9h18M9 9v11M15 9v11"/></svg>',
  score: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><path d="M14 2v6h6"/><path d="M9 13h.01M12 11.5c1.2 0 2 .7 2 1.7s-.8 1.5-2 1.8-2 .8-2 1.8.8 1.7 2 1.7h.5M12 11.5V10M12 18.5V17"/></svg>',
  eval: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3.2l2.2 4.6 5 .7-3.6 3.5.9 5.1L12 14.7 7.5 17.1l.9-5.1L4.8 8.5l5-.7L12 3.2z"/></svg>',
  sms: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/><path d="M8 9h8M8 13h5"/></svg>',
  users: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg>',
  teacher: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg>',
  org: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="2" width="6" height="4" rx="1"/><rect x="2" y="18" width="6" height="4" rx="1"/><rect x="16" y="18" width="6" height="4" rx="1"/><path d="M12 6v4M5 18v-4h14v4M12 10h0"/></svg>',
  dict: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5A2.5 2.5 0 016.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"/><path d="M9 7h7M9 11h5"/></svg>',
  settings: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>',
  apps: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>',
  analytics: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M18 20V10M12 20V4M6 20v-6"/></svg>',
  invite: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 8l9 6 9-6"/></svg>',
  hardware: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="4" width="16" height="12" rx="2"/><path d="M8 20h8M12 16v4"/></svg>',
  face: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="3.5"/><path d="M5 20c1.2-3.2 3.6-4.8 7-4.8s5.8 1.6 7 4.8"/><path d="M4 8V6a2 2 0 012-2h2M16 4h2a2 2 0 012 2v2M20 16v2a2 2 0 01-2 2h-2M8 20H6a2 2 0 01-2-2v-2"/></svg>',
  log: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><path d="M14 2v6h6M8 13h8M8 17h5"/></svg>',
  export: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v12"/><path d="M8 11l4 4 4-4"/><path d="M4 19h16"/></svg>',
};

/** PC 常用入口（对齐现网首页宫格） */
DY.PC_SHORTCUTS = [
  { title: '大数据驾驶舱', icon: 'board', color: '#0d9488', href: 'kanban/index.html' },
  { title: '请假', icon: 'leave', color: '#3b82f6' },
  { title: '电教物品领用', icon: 'supply', color: '#0ea5e9' },
  { title: '会场预约', icon: 'venue', color: '#8b5cf6' },
  { title: '印刷申请', icon: 'print', color: '#ec4899' },
  { title: '公文流转', icon: 'docflow', color: '#6366f1' },
  { title: '宿舍检查', icon: 'dorm', color: '#14b8a6' },
  { title: '电教报修处理', icon: 'repair', color: '#f59e0b' },
  { title: '资源审核', icon: 'audit', color: '#10b981' },
  { title: '文明班级评比', icon: 'classrank', color: '#ef4444' },
  { title: '校园送餐', icon: 'meal', color: '#f97316' },
  { title: '会议管理', icon: 'meeting', color: '#64748b' },
  { title: '申购审批', icon: 'purchase', color: '#2563eb' },
  { title: '电教管理', icon: 'av', color: '#7c3aed' },
  { title: '网站管理', icon: 'website', color: '#0891b2' },
];

/** 老师移动端分类宫格（对齐现网截图） */
DY.TEACHER_GROUPS = [
  {
    title: '校内协作',
    color: '#1677ff',
    apps: [
      { title: '通讯录', icon: 'contacts', color: '#22c55e' },
      { title: '通知公告', icon: 'notice', color: '#f97316' },
      { title: '场馆预约', icon: 'venue', color: '#3b82f6' },
      { title: '食谱订餐', icon: 'menu', color: '#f59e0b' },
      { title: '请假', icon: 'leave', color: '#3b82f6' },
      { title: '老师请假处理', icon: 'leaveOk', color: '#22c55e' },
      { title: '宿舍检查', icon: 'dorm', color: '#3b82f6' },
      { title: '场馆预约统计', icon: 'venueStat', color: '#22c55e' },
      { title: '综合检查', icon: 'inspect', color: '#f97316' },
      { title: '公文流转', icon: 'docflow', color: '#3b82f6' },
      { title: '电教管理', icon: 'av', color: '#3b82f6' },
      { title: '后勤管理', icon: 'logistics', color: '#22c55e' },
      { title: '教师发展', icon: 'teacher', color: '#1a7f93' },
    ],
  },
  {
    title: '家校互动',
    color: '#e06b58',
    apps: [
      { title: '建议箱', icon: 'suggest', color: '#f97316' },
      { title: '学生管理', icon: 'student', color: '#3b82f6' },
      { title: '证照管理', icon: 'idcard', color: '#3b82f6' },
      { title: '访客预约', icon: 'visit', color: '#3b82f6' },
    ],
  },
];

/** 家长移动端分类宫格【待确认】入口清单 */
DY.PARENT_GROUPS = [
  {
    title: '生活服务',
    color: '#d97706',
    apps: [
      { title: '请假', icon: 'leave', color: '#3b82f6' },
      { title: '食谱订餐', icon: 'menu', color: '#f59e0b' },
      { title: '校园送餐', icon: 'meal', color: '#f97316' },
      { title: '证照管理', icon: 'idcard', color: '#3b82f6' },
    ],
  },
  {
    title: '家校互动',
    color: '#2f8f4e',
    apps: [
      { title: '通知公告', icon: 'notice', color: '#f97316' },
      { title: '建议箱', icon: 'suggest', color: '#f97316' },
      { title: '访客预约', icon: 'visit', color: '#3b82f6' },
      { title: '找老师', icon: 'findTeacher', color: '#22c55e' },
    ],
  },
  {
    title: '学业成长',
    color: '#1677ff',
    apps: [
      { title: '课程表', icon: 'timetable', color: '#3b82f6' },
      { title: '成绩查询', icon: 'score', color: '#8b5cf6' },
      { title: '学生评价', icon: 'eval', color: '#ef4444' },
      { title: '文明班级', icon: 'classrank', color: '#e11d48' },
    ],
  },
];

DY.escape = function (str) {
  return String(str ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
};

/** 色底圆 + 白色线性图标；icon 为 DY.ICONS 键名 */
DY.iconDisc = function (iconOrTitle, color) {
  const svg = DY.ICONS[iconOrTitle] || DY.ICONS.leave;
  return `<span class="dy-ico" style="--c:${DY.escape(color || '#1677ff')}" aria-hidden="true">${svg}</span>`;
};
