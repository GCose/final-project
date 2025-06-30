const defaultRoles = [
  {
    name: "Admin",
    permissions: [
      "create",
      "read",
      "update",
      "delete",
      "manage_users",
      "manage_roles",
    ],
    description:
      "Full system access with user and role management capabilities",
  },
  {
    name: "Editor",
    permissions: ["create", "read", "update"],
    description:
      "Can create, view, and edit content but cannot delete or manage users",
  },
  {
    name: "Viewer",
    permissions: ["read"],
    description: "Read-only access to view content",
  },
];

module.exports = defaultRoles;
