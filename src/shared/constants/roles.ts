// Define the constant values for user roles in the Inventory Management and Fulfillment Application
// These roles are used for role-based access control throughout the system

export const ROLES = {
    ADMIN: 'admin',
    WAREHOUSE_MANAGER: 'warehouse_manager',
    WAREHOUSE_STAFF: 'warehouse_staff',
    READONLY_USER: 'readonly_user'
};

// Human tasks:
// TODO: Review and confirm if additional roles are needed for the application
// TODO: Ensure that these role definitions align with the backend authentication and authorization implementation
// TODO: Consider adding descriptions or comments for each role to clarify their responsibilities and access levels