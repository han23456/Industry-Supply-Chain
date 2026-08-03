/**
 * 标签库管理权限控制（前端模拟）
 * 角色：admin > editor > viewer
 */
(function () {
  'use strict';

  const ROLE_KEY = 'tagLibraryRole';

  const PERMISSIONS = {
    admin: {
      createCategory: true,
      editCategory: true,
      deleteCategory: true,
      createTag: true,
      editTag: true,
      deleteTag: true,
      importLibrary: true,
      resetLibrary: true,
      viewLogs: true
    },
    editor: {
      createCategory: false,
      editCategory: true,
      deleteCategory: false,
      createTag: true,
      editTag: true,
      deleteTag: true,
      importLibrary: false,
      resetLibrary: false,
      viewLogs: true
    },
    viewer: {
      createCategory: false,
      editCategory: false,
      deleteCategory: false,
      createTag: false,
      editTag: false,
      deleteTag: false,
      importLibrary: false,
      resetLibrary: false,
      viewLogs: true
    }
  };

  class TagLibraryAuth {
    constructor() {
      this.role = this.load();
    }

    load() {
      const saved = typeof localStorage !== 'undefined' ? localStorage.getItem(ROLE_KEY) : null;
      return saved && PERMISSIONS[saved] ? saved : 'viewer';
    }

    setRole(role) {
      if (!PERMISSIONS[role]) return false;
      this.role = role;
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem(ROLE_KEY, role);
      }
      return true;
    }

    can(action) {
      const perms = PERMISSIONS[this.role] || PERMISSIONS.viewer;
      return !!perms[action];
    }

    getRole() {
      return this.role;
    }

    getRoles() {
      return Object.keys(PERMISSIONS);
    }
  }

  window.TagLibraryAuth = TagLibraryAuth;
})();
