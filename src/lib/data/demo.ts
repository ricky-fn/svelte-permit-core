import { faBars, faCaretDown, faCube, faRoute } from "@fortawesome/free-solid-svg-icons";

export const DEMO_DATA = {
    roles: [{
        name: 'Admin',
        code: 'admin',
    }, {
        name: 'Editor',
        code: 'editor',
    }, {
        name: 'Viewer',
        code: 'viewer',
    }],
    groups: [{
        name: 'Admin Group',
        code: 'admin-group',
    }, {
        name: 'Content Group',
        code: 'content-group',
    }],
    tabs: [{
        title: 'Component Access',
        id: 'component',
        icon: faCube
    }, {
        title: 'Dropdown Access',
        id: 'dropdown',
        icon: faCaretDown
    }, {
        title: 'Menu Access',
        id: 'menu',
        icon: faBars
    }, {
        title: 'Route Access',
        id: 'route',
        icon: faRoute
    }],
    dropdownItems: [{
        name: 'Edit User',
        id: 'edit-user',
    }, {
        name: 'Delete User',
        id: 'delete-user',
    }, {
        name: 'Reset Password',
        id: 'reset-password',
    }, {
        name: 'Change Role',
        id: 'change-role',
    }],
    menuItems: [{
        name: 'Dashboard',
        id: 'dashboard',
    }, {
        name: 'Content',
        id: 'content',
    }, {
        name: 'Analytics',
        id: 'analytics',
    }, {
        name: 'Admin',
        id: 'admin',
    }, {
        name: 'Settings',
        id: 'settings',
    }]
}