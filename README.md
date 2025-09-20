## 🛡️ Svelte Permit Core

> Svelte component wrappers for enterprise-grade access control  
> Role-based permissions, group inheritance, and extensible validation powered by `permit-core`

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
![Svelte](https://img.shields.io/badge/Svelte-5.0+-ff3e00)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6)

A robust Svelte integration for `permit-core` that provides:

- **Svelte-native components** for guarding routes, components, menus, and dropdowns
- **Hierarchical permissions** with role/group inheritance
- **Type-safe API** with full TypeScript support
- **Reactive contexts** via Svelte stores

## Live Demo

Try the full feature demo: [svelte-permit-core.pages.dev](https://svelte-permit-core.pages.dev)

## Core Engine

This library wraps the core authorization engine: [permit-core](https://github.com/ricky-fn/permit-core)

### Features ✨

- **Role & Group Management**
  - Define roles and groups (with inheritance) using `permit-core`
  - Provide active account via a Svelte store

- **Permission Types**
  - 🚦 Route access control
  - 🧩 Component-level permission granularity (view/edit)
  - 📋 Menu visibility management
  - 🔽 Dropdown options visibility

- **Developer Experience**
  - Works with Svelte 5 snippets and runes
  - Clear contexts for access control
  - TypeScript-friendly

## Installation 💻

```bash
npm install svelte-permit-core
```

Requirements:
- Node >= 18.20.4
- Svelte 5

## Quick Start 🚀

### 1) Import modules

```svelte
<script lang="ts">
	import AccessControlProvider from 'svelte-permit-core';
	import { ComponentAccessControl, DropdownAccessControl, MenuAccessControl, RouteAccessControl } from 'svelte-permit-core';

	import { createRole, createGroup, createRoutePermission, createComponentPermission, createMenuPermission, createDropdownPermission } from 'permit-core';
	import { readable } from 'svelte/store';
</script>
```

### 2) Create roles and groups

```ts
const admin = createRole('admin');
const editor = createRole('editor');
const viewer = createRole('viewer');

const adminGroup = createGroup('admin-group');
const contentGroup = createGroup('content-group', adminGroup); // inherits from adminGroup

const roles = [admin, editor, viewer];
const groups = [adminGroup, contentGroup];
```

### 3) Define permissions

```ts
// Group-level permissions (inheritance)
const groupPermissions = {
  [adminGroup.getCode()]: {
    navigation: createRoutePermission(adminGroup, [{ route: /.*/ }]),
    component:  createComponentPermission(adminGroup, [{ identifier: /.*/, actions: ['view', 'edit'] }]),
    dropdown:   createDropdownPermission(adminGroup, [{ identifier: /.*/, list: /.*/ }]),
    menu:       createMenuPermission(adminGroup, [{ identifier: 'main-menu', list: /.*/ }]),
  },
  [contentGroup.getCode()]: {
    navigation: createRoutePermission(contentGroup, [{ route: '/admin', exclude: true }]),
    component:  createComponentPermission(contentGroup, [
      { identifier: 'admin-panel', actions: ['edit'], exclude: true },
      { identifier: 'content-panel', actions: ['view', 'edit'] }
    ]),
    dropdown:   createDropdownPermission(contentGroup, [
      { identifier: 'actions-dropdown', list: ['delete-user', 'change-role', 'reset-password'], exclude: true }
    ]),
    menu:       createMenuPermission(contentGroup, [
      { identifier: 'main-menu', list: ['analytics', 'admin'], exclude: true }
    ]),
  }
};

// Role-level permissions
const rolePermissions = {
  [admin.getCode()]: {
    navigation: createRoutePermission(admin, [{ route: /.*/ }]),
    component:  createComponentPermission(admin, [{ identifier: /.*/, actions: ['view', 'edit'] }]),
    dropdown:   createDropdownPermission(admin, [{ identifier: /.*/, list: /.*/ }]),
    menu:       createMenuPermission(admin, [{ identifier: 'main-menu', list: /.*/ }]),
  },
  [editor.getCode()]: {
    navigation: createRoutePermission(editor, [{ route: '/content' }]),
    component:  createComponentPermission(editor, [
      { identifier: 'admin-panel', actions: ['view'] },
      { identifier: 'content-panel', actions: ['view', 'edit'] }
    ]),
    dropdown:   createDropdownPermission(editor, [
      { identifier: 'actions-dropdown', list: ['edit-user', 'reset-password'] }
    ]),
    menu:       createMenuPermission(editor, [
      { identifier: 'main-menu', list: ['dashboard', 'content', 'settings'] }
    ]),
  },
  [viewer.getCode()]: {
    navigation: createRoutePermission(viewer, []),
    component:  createComponentPermission(viewer, [{ identifier: 'content-panel', actions: ['view'] }]),
    menu:       createMenuPermission(viewer, [{ identifier: 'main-menu', list: ['dashboard'] }]),
  }
};
```

### 4) Provide the active account

```ts
type Account = { role: string; groupFlag?: string } | null;

// Example: replace with your auth/user store
const account = readable<Account>({ role: 'admin', groupFlag: 'content-group' });
```

### 5) Wrap your app with the provider

```svelte
<AccessControlProvider {roles} {groups} account={account}>
	<!-- your app -->
</AccessControlProvider>
```

### 6) Guard UI with access control components

- Route guard:

```svelte
<RouteAccessControl route="/admin">
  {#snippet children({ role, route })}
    <p>Access granted to {route}</p>
  {/snippet}
  {#snippet fallback({ role, route })}
    <p>Access denied to {route}</p>
  {/snippet}
</RouteAccessControl>
```

- Component guard:

```svelte
<ComponentAccessControl identifier="content-panel">
  {#snippet children({ isEditable, role })}
    <button disabled={!isEditable}>Edit content</button>
  {/snippet}
  {#snippet fallback({ role })}
    <p>You do not have access to this component.</p>
  {/snippet}
</ComponentAccessControl>
```

- Menu guard:

```svelte
<script lang="ts">
  const menuItems = ['dashboard', 'content', 'analytics', 'admin', 'settings'] as const;
</script>

<ul>
  <MenuAccessControl identifier="main-menu" menuList={menuItems}>
    {#snippet children({ isEditable, menu })}
      <li class={!isEditable ? 'hidden' : ''}>{menu}</li>
    {/snippet}
  </MenuAccessControl>
</ul>
```

- Dropdown guard:

```svelte
<script lang="ts">
  const actions = ['edit-user', 'delete-user', 'reset-password', 'change-role'] as const;
</script>

<ul>
  <DropdownAccessControl identifier="actions-dropdown" list={actions}>
    {#snippet children({ isEditable, item })}
      <li>
        <span class={isEditable ? 'text-green-600' : 'text-red-600'}>
          {item}
        </span>
      </li>
    {/snippet}
  </DropdownAccessControl>
</ul>
```

## Documentation 📚

### Core Concepts

| Concept        | Description                                      |
| -------------- | ------------------------------------------------ |
| **Role**       | Defines user permissions and privileges          |
| **Group**      | Organizes roles; supports hierarchical inheritance |
| **Permission** | Rule set for a specific resource type            |
| **Action**     | Operation to be validated (route, component, etc.) |
| **Validator**  | Applies permission rules to the action           |

### Components

| Component                      | Purpose                                           |
| ----------------------------- | ------------------------------------------------- |
| `AccessControlProvider`       | Initializes access control and exposes contexts   |
| `RouteAccessControl`          | Conditionally renders based on route access       |
| `ComponentAccessControl`      | Guards a UI fragment (view/edit)                  |
| `MenuAccessControl`           | Filters a menu list for the active role/group     |
| `DropdownAccessControl`       | Filters a dropdown list for the active role/group |

### AccessControlProvider

- Props:
  - **roles**: `Role[]` — registered roles
  - **groups**: `Group[]` — registered groups (with optional inheritance)
  - **account**: `Readable<{ role: string; groupFlag?: string } | null>` — current account state
  - **children**: `Snippet` — subtree to render with provided contexts

- Contexts exposed to descendants:
  - `AccessControl`: initialized access control instance
  - `CurrentAccessRole`: `Writable<Role | null>`
  - `CurrentAccessRoleGroup`: `Writable<Group | null>`

### Route Permissions

```svelte
<RouteAccessControl route="/admin">
  {#snippet children({ role, route })}
    <p>Welcome to {route}</p>
  {/snippet}
  {#snippet fallback()}
    <p>Not authorized</p>
  {/snippet}
</RouteAccessControl>
```

### Component Permissions

```svelte
<ComponentAccessControl identifier="admin-panel">
  {#snippet children({ isEditable })}
    <button disabled={!isEditable}>Edit</button>
  {/snippet}
</ComponentAccessControl>
```

### Menu Permissions

```svelte
<MenuAccessControl identifier="main-menu" menuList={['dashboard', 'settings']}>
  {#snippet children({ isEditable, menu })}
    <li class:hidden={!isEditable}>{menu}</li>
  {/snippet}
</MenuAccessControl>
```

### Dropdown Permissions

```svelte
<DropdownAccessControl identifier="actions-dropdown" list={['edit-user', 'delete-user']}>
  {#snippet children({ isEditable, item })}
    <button disabled={!isEditable}>{item}</button>
  {/snippet}
</DropdownAccessControl>
```

### How Roles and Groups Work

- **Roles** hold permissions for route, component, menu, and dropdown checks.
- **Groups** can be assigned to roles and may inherit from other groups, enabling hierarchical policies.
- If a **group** includes a permission, roles assigned to that group inherit it without duplicating the rule at the role level.

## Contributing 🤝

1. Fork the repository
2. Create your feature branch: `git checkout -b feat/your-feature`
3. Commit your changes: `git commit -m "feat(scope): add something"`
4. Push to the branch: `git push origin feat/your-feature`
5. Open a pull request

### Commit Message Guidelines

```text
<type>(<scope>): <subject>

<body>

<footer>
```

Example:

```text
feat(permissions): add dropdown guard

- Implement DropdownAccessControl
- Add examples to README
- Wire to AccessControlProvider

Resolves: #123
```

## License 📄

This project is licensed under the MIT License - see the `LICENSE` file for details.

## Changelog 📜

### v1.0.0
- Initial Svelte integration for `permit-core`
- `AccessControlProvider`, `RouteAccessControl`, `ComponentAccessControl`, `MenuAccessControl`, `DropdownAccessControl`
- Svelte 5 snippets and TypeScript support