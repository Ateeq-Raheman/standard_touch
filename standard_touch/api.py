import frappe

@frappe.whitelist()
def get_active_messages():
    # Fetch active messages bypassing role permissions 
    # so normal users don't get 'Not permitted' errors
    return frappe.get_all(
        'Standard Touch Message',
        filters={'enabled': 1},
        fields=['name', 'title', 'display_type', 'message', 'background_color', 'text_color', 'route', 'placement', 'css_selector'],
        ignore_permissions=True
    )
