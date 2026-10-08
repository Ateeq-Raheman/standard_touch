import frappe

def create_doctype():
    frappe.flags.in_import = True
    if not frappe.db.exists("DocType", "Standard Touch Message"):
        doc = frappe.get_doc({
            "doctype": "DocType",
            "module": "Custom",
            "custom": 1,
            "name": "Standard Touch Message",
            "is_submittable": 0,
            "autoname": "field:title",
            "fields": [
                {"fieldname": "title", "label": "Title", "fieldtype": "Data", "reqd": 1, "unique": 1},
                {"fieldname": "enabled", "label": "Enabled", "fieldtype": "Check", "default": "1"},
                {"fieldname": "col_break_1", "fieldtype": "Column Break"},
                {"fieldname": "display_type", "label": "Display Type", "fieldtype": "Select", "options": "Static Banner\nRiding Text (Marquee)", "default": "Static Banner"},
                {"fieldname": "sec_break_1", "fieldtype": "Section Break", "label": "Message Content"},
                {"fieldname": "message", "label": "Message", "fieldtype": "TextEditor", "reqd": 1},
                {"fieldname": "background_color", "label": "Background Color", "fieldtype": "Color", "default": "#f8f9fa"},
                {"fieldname": "text_color", "label": "Text Color", "fieldtype": "Color", "default": "#1f272e"},
                {"fieldname": "sec_break_2", "fieldtype": "Section Break", "label": "Placement Settings"},
                {"fieldname": "route", "label": "Route", "fieldtype": "Data", "description": "e.g., Form/Sales Invoice (Leave blank for all pages)"},
                {"fieldname": "placement", "label": "Placement", "fieldtype": "Select", "options": "Inside - Start\nInside - End\nBefore\nAfter", "default": "Inside - Start"},
                {"fieldname": "col_break_2", "fieldtype": "Column Break"},
                {"fieldname": "pick_element_button", "label": "Pick Element", "fieldtype": "HTML", "options": "<button class='btn btn-xs btn-default' id='btn-pick-element' style='margin-bottom:10px;'>Click here to Pick Element on Screen</button><br><small class='text-muted'>Click this button, then hover over the space you want and click it.</small>"},
                {"fieldname": "css_selector", "label": "Target CSS Selector", "fieldtype": "Data", "reqd": 1, "description": "Auto-filled when you use the Picker, or you can type it."},
            ],
            "permissions": [
                {"role": "Administrator", "read": 1, "write": 1, "create": 1, "delete": 1}
            ]
        })
        doc.insert()
        frappe.db.commit()
        print("DocType 'Standard Touch Message' created successfully.")
    else:
        print("DocType 'Standard Touch Message' already exists.")
