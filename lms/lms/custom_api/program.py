import frappe;

@frappe.whitelist(allow_guest=True)
def get_public_programs():
    # if frappe.session.user == "Guest":
    return frappe.get_all("LMS Program", filters={"is_whitelist": 0})
    
@frappe.whitelist(allow_guest=True)
def get_program_meta():
    return frappe.get_meta("Program").as_dict()
