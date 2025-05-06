import frappe;

@frappe.whitelist(allow_guest=True)
def get_program_list(code=None, academic_level=None):
    filters = {}
    if code:
        filters["code"] = code
    if academic_level:
        filters["academic_level"] = academic_level
        
    # programs = frappe.get_all("LMS Program", fields=["name", "code", "description", "academic_level", "title"], filters=filters)
    programs = frappe.get_all("LMS Program", fields=["name", "code", "description", "title"], filters=filters)
    return programs
    
@frappe.whitelist(allow_guest=False)
def add_program(code, description, academic_level=None, title=None):
    # Kiểm tra nếu code đã tồn tại
    # existing_program = frappe.db.exists("LMS Program", {"code": code})
    # if existing_program:
        # frappe.throw(_("Program with this code already exists."))

    program = frappe.get_doc({
        "doctype": "LMS Program",
        "code": code,
        "description": description,
        "academic_level": academic_level,
        "title": title
    })

    program.insert(ignore_permissions=True)
    frappe.db.commit()

    return program.as_dict()

