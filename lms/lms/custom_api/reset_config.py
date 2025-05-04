import frappe
from lms.lms.custom_enum.enum import DefaultLMSRole
from frappe.custom.doctype.custom_field.custom_field import create_custom_fields

@frappe.whitelist()
def init_all_lms_setup():
    results = {}
    try:
        results["purge_roles_except_admin_guest"] = purge_roles_except_admin_guest()
    except Exception as e:
        results["purge_roles_except_admin_guest"] = f"Error: {str(e)}"
    try:
        results["init_default_lms_roles"] = init_default_lms_roles()
    except Exception as e:
        results["init_default_lms_roles"] = f"Error: {str(e)}"
    try:
        results["add_academic_level_field_to_doctypes"] = add_academic_level_field_to_doctypes()
    except Exception as e:
        results["add_academic_level_field_to_doctypes"] = f"Errot: {str(e)}"
    try:
        results["create_lms_department"] = create_lms_department()
    except Exception as e:
        results["create_lms_department"] = f"Errot: {str(e)}"
    try:
        results["create_lms_subject"] = create_lms_subject()
    except Exception as e:
        results["create_lms_subject"] = f"Error: {str(e)}"
    try:
        results["mapping_lms_subject_course"] = mapping_lms_subject_course()
    except Exception as e:
        results["mapping_lms_subject_course"] = f"Error: {str(e)}"
    try:
        results["create_program_enrollment_request_doctype"] = create_program_enrollment_request_doctype()
    except Exception as e:
        results["create_program_enrollment_request_doctype"] = f"Error: {str(e)}"
    try:
        results["create_assignment_submission_grader_doctype"] = create_assignment_submission_grader_doctype()
    except Exception as e:
        results["create_assignment_submission_grader_doctype"] = f"Error: {str(e)}"
    try:
        results["add_score_fields_to_assignment_submission"] = add_score_fields_to_assignment_submission()
    except Exception as e:
        results["add_score_fields_to_assignment_submission"] = f"Error: {str(e)}"
    try:
        results["assign_lms_permissions"] = assign_lms_permissions()
    except Exception as e:
        results["assign_lms_permissions"] = f"Error: {str(e)}"
    return results

@frappe.whitelist()
def init_default_lms_roles():
    for role in DefaultLMSRole:
        if not frappe.db.exists("Role", role.value):
            frappe.get_doc({
                "doctype": "Role",
                "role_name": role.value,
                "desk_access": 0
            }).insert(ignore_permissions=True)
    return {
        "status": "ok",
        "message": "init default role sucess"
    }

def create_academic_level_doctype():
    if not frappe.db.exists("DocType", "LMS Academic Level"):
        frappe.get_doc({
            "doctype": "DocType",
            "name": "LMS Academic Level",
            "module": "LMS",
            "custom": 1,
            "fields": [
                {
                    "fieldname": "code",
                    "fieldtype": "Data",
                    "label": "Mã cấp học",
                    "reqd": 1
                },
                {
                    "fieldname": "decription",
                    "fieldtype": "Data",
                    "label": "Tên cấp học",
                    "reqd": 1
                }
            ],
            "permissions": [
                {"role": "System Manager", "read": 1, "write": 1, "create": 1, "delete": 1},
                {"role": DefaultLMSRole.PRINCIPAL.value, "read": 1, "write": 1, "create": 1, "delete": 1}
            ]
        }).insert()

def create_child_table_academic_level_table():
    if not frappe.db.exists("DocType", "LMS Child Table Academic Level"):
        frappe.get_doc({
            "doctype": "DocType",
            "name": "LMS Child Table Academic Level",
            "module": "LMS",
            "custom": 1,
            "istable": 1,
            "fields": [
                {
                    "fieldname": "academic_level",
                    "fieldtype": "Link",
                    "label": "Cấp học",
                    "options": "LMS Academic Level",
                    "reqd": 1
                }
            ],
            "permissions": [
                {"role": "Administrator", "read": 1, "write": 1, "create": 1, "delete": 1},
                {"role": DefaultLMSRole.PRINCIPAL.value, "read": 1, "write": 1, "create": 1, "delete": 1}
            ]
        }).insert()

@frappe.whitelist()
def add_academic_level_field_to_doctypes():
    create_academic_level_doctype()
    create_child_table_academic_level_table()
    target_doctypes = ["LMS Course", "LMS Program", "LMS Quiz", "LMS Assignment"]
    for dt in target_doctypes:
        if not frappe.db.exists("Custom Field", f"{dt.lower()}-academic_level"):
            frappe.get_doc({
                "doctype": "Custom Field",
                "dt": dt,
                "fieldname": "academic_level",
                "label": "Cấp học",
                "fieldtype": "Table",
                "options": "LMS Child Table Academic Level",
                "reqd": 0
            }).insert()
    return {
        "status": "ok",
        "message": "created academic level doctype, child table doctype, added academic level field to doctypes"
    }

@frappe.whitelist()
def create_lms_department():
    if not frappe.db.exists("DocType", "LMS Department"):
        department_doc = frappe.get_doc({
            "doctype": "DocType",
            "name": "LMS Department",
            "module": "LMS",
            "custom": 1,
            "fields": [
                {
                    "fieldname": "department_name",
                    "label": "Department Name",
                    "fieldtype": "Data",
                    "reqd": 1
                },
                {
                    "fieldname": "description",
                    "label": "Description",
                    "fieldtype": "Small Text"
                }
            ],
            "permissions": [
                {"role": "Administrator", "read": 1, "write": 1, "create": 1, "delete": 1},
                {"role": DefaultLMSRole.PRINCIPAL.value, "read": 1, "write": 1, "create": 1, "delete": 1}
            ]
        })
        department_doc.insert()
        return {
            "status": "ok",
            "message": "Đã tạo Doctype: LMS Department."
        }
    else:
        return {
            "status": "ok",
            "message": "Doctype LMS Department đã tồn tại."
        }

@frappe.whitelist()
def create_lms_subject():
    # LMS Subject
    if not frappe.db.exists("DocType", "LMS Subject"):
        subject_doc = frappe.get_doc({
            "doctype": "DocType",
            "name": "LMS Subject",
            "module": "LMS",
            "custom": 1,
            "fields": [
                {
                    "fieldname": "subject_name",
                    "label": "Subject Name",
                    "fieldtype": "Data",
                    "reqd": 1
                },
                {
                    "fieldname": "department",
                    "label": "Department",
                    "fieldtype": "Link",
                    "options": "LMS Department",
                    "reqd": 1
                }
            ],
            "permissions": [
                {"role": "Administrator", "read": 1, "write": 1, "create": 1, "delete": 1},
                {"role": DefaultLMSRole.PRINCIPAL.value, "read": 1, "write": 1, "create": 1, "delete": 1},
                {"role": DefaultLMSRole.VICE_PRINCIPAL.value, "read": 1, "write": 1, "create": 1, "delete": 1},
                {"role": DefaultLMSRole.DEPARTMENT_HEAD.value, "read": 1, "create": 1}
            ]
        })
        subject_doc.insert()
    return {
        "status": "ok",
        "message": "Đã tạo Doctype: LMS Subject."
    }

@frappe.whitelist()
def mapping_lms_subject_course():
    # LMS Subject Course Mapping
    if not frappe.db.exists("DocType", "LMS Subject Course Mapping"):
        mapping_doc = frappe.get_doc({
            "doctype": "DocType",
            "name": "LMS Subject Course Mapping",
            "module": "LMS",
            "custom": 1,
            "fields": [
                {
                    "fieldname": "course",
                    "label": "Course",
                    "fieldtype": "Link",
                    "options": "Course",
                    "reqd": 1
                },
                {
                    "fieldname": "subject",
                    "label": "Subject",
                    "fieldtype": "Link",
                    "options": "LMS Subject",
                    "reqd": 1
                }
            ],
            "permissions": [
                {"role": "Administrator", "read": 1, "write": 1, "create": 1, "delete": 1},
                {"role": DefaultLMSRole.PRINCIPAL.value, "read": 1, "write": 1, "create": 1, "delete": 1},
                {"role": DefaultLMSRole.VICE_PRINCIPAL.value, "read": 1, "write": 1, "create": 1, "delete": 1},
                {"role": DefaultLMSRole.DEPARTMENT_HEAD.value, "read": 1, "create": 1}
            ]
        })
        mapping_doc.insert()
    return {
        "status": "ok",
        "message": "Đã tạo Doctype: LMS Subject Course Mapping."
    }

@frappe.whitelist()
def create_program_enrollment_request_doctype():
    if not frappe.db.exists("DocType", "LMS Program Enrollment Request"):
        doc = frappe.get_doc({
            "doctype": "DocType",
            "name": "LMS Program Enrollment Request",
            "module": "LMS",
            "custom": 1,
            "fields": [
                {"label": "Full Name", "fieldname": "full_name", "fieldtype": "Data", "reqd": 1},
                {"label": "Email", "fieldname": "email", "fieldtype": "Data", "reqd": 1},
                {"label": "Program", "fieldname": "program", "fieldtype": "Link", "options": "LMS Program", "reqd": 1},
                {"label": "Status", "fieldname": "status", "fieldtype": "Select", "options": "Pending\nApproved\nRejected", "default": "Pending"},
                {"label": "Note", "fieldname": "note", "fieldtype": "Small Text"}
            ],
            "permissions": [{"role": "Administrator", "read": 1}]
        })
        doc.insert()
        return {
            "status": "ok",
            "message": "Đã tạo Doctype LMS Program Enrollment Request"
        } 
    return {
                "status": "ok",
        "message": "Doctype LMS Program Enrollment Request đã tồn tại"
    }

@frappe.whitelist()
def create_assignment_submission_grader_doctype():
    if frappe.db.exists("DocType", "LMS Assignment Submission Grader"):
        return {
            "status": "ok",
            "message": "Doctype 'LMS Assignment Submission Grader' đã tồn tại."
        }

    doc = frappe.get_doc({
        "doctype": "DocType",
        "name": "LMS Assignment Submission Grader",
        "module": "LMS",  
        "custom": 1,
        "fields": [
            {
                "fieldname": "submission",
                "fieldtype": "Link",
                "label": "Submission",
                "options": "LMS Assignment Submission",
                "reqd": 1
            },
            {
                "fieldname": "grader",
                "fieldtype": "Link",
                "label": "Grader",
                "options": "User",
                "reqd": 1
            },
            {
                "fieldname": "note",
                "fieldtype": "Small Text",
                "label": "Note"
            }
        ],
        "permissions": [],
        "is_submittable": 0,
        "istable": 0,
        "editable_grid": 0,
        "track_changes": 1,
        "track_views": 0,
        "allow_rename": 0,
        "search_fields": "submission, grader",
        "title_field": "submission"
    })

    doc.insert()
    return {
        "status": "ok",
        "message": f"Đã tạo Doctype LMS Assignment Submission Grader.",
    }

@frappe.whitelist()
def add_score_fields_to_assignment_submission():
    doctype = "LMS Assignment Submission"

    def create_field_if_not_exists(fieldname, label, insert_after):
        if not frappe.db.exists("Custom Field", f"{doctype}-{fieldname}"):
            frappe.get_doc({
                "doctype": "Custom Field",
                "dt": doctype,
                "fieldname": fieldname,
                "label": label,
                "fieldtype": "Float",
                "insert_after": insert_after,
                "precision": 2
            }).insert()
            return {
                "status": "ok",
                "message": f"Đã tạo {fieldname}."
            }
        frappe.db.commit()

    create_field_if_not_exists("max_score", "Điểm tối đa", "assignment")
    create_field_if_not_exists("score", "Điểm", "max_score")
    return {
        "status": "ok",
        "message": "Thêm thành công hai field max_score và score vào LMS Assignment Submission"
    }

# delete unnecessory roles
@frappe.whitelist()
def purge_roles_except_admin_guest():
    roles_to_keep = ["Administrator", "Guest", "System Manager"]
    deleted_roles = frappe.get_all('DocPerm', filters={"role": ["not in", roles_to_keep]}, pluck="role")
    roles_to_delete = frappe.get_all(
        "Role",
        filters={"name": ["not in", roles_to_keep]},
        pluck="name"
    )

    for role in roles_to_delete:
        frappe.db.delete("Has Role", {"role": role})
        frappe.db.delete("DefaultValue", {"defvalue": role})
        frappe.db.delete("Custom DocPerm", {"role": role})  
        frappe.db.delete("DocPerm", {"role": role})
        frappe.delete_doc("Role", role, force=1, ignore_permissions=True)
    for role in deleted_roles:
        frappe.db.delete("Has Role", {"role": role})
        frappe.db.delete("DefaultValue", {"defvalue": role})
        frappe.db.delete("Custom DocPerm", {"role": role})  
        frappe.db.delete("DocPerm", {"role": role})
    frappe.db.commit()

    return {
        "status": "ok",
        "message": f"Đã xoá {len(roles_to_delete)} role.",
        "deleted_roles": roles_to_delete    
    }

def add_permission_if_not_exists(
    doctype,
    role,
    read=0, 
    write=0,
    create=0,
    delete=0,
    submit=0,
    cancel=0,
    amend=0,
    share=0,
    only_if_creator=0
):
    exists = frappe.db.exists("DocPerm", {
        "parent": doctype,
        "parenttype": "DocType",
        "role": role,
        "permlevel": 0,
        "read": read,
        "write": write,
        "create": create,
        "delete": delete,
        "submit": submit,
        "cancel": cancel,
        "amend": amend,
        "share": share,
        "if_owner": only_if_creator
    })
    if not exists:
        frappe.get_doc({
            "doctype": "DocPerm",
            "parent": doctype,
            "parenttype": "DocType",
            "role": role,
            "permlevel": 0,
            "read": read,
            "write": write,
            "create": create,
            "delete": delete,
            "submit": submit,
            "cancel": cancel,
            "amend": amend,
            "share": share,
            "if_owner": only_if_creator
        }).insert(ignore_permissions=True)
    
    doc = frappe.get_doc("DocType", doctype)
    updated = False

    for perm in doc.permissions:
        if perm.role == role and perm.permlevel == 0:
            perm.read = read
            perm.write = write
            perm.create = create
            perm.delete = delete
            perm.submit = submit
            perm.cancel = cancel
            perm.amend = amend
            perm.share = share
            perm.if_owner = only_if_creator
            updated = True
            break

    if not updated:
        # Nếu chưa có thì thêm mới
        doc.append("permissions", {
            "role": role,
            "permlevel": 0,
            "read": read,
            "write": write,
            "create": create,
            "delete": delete,
            "submit": submit,
            "cancel": cancel,
            "amend": amend,
            "share": share,
            "if_owner": only_if_creator,
        })

    doc.save(ignore_permissions=True)


@frappe.whitelist()
def assign_lms_permissions():
    all_doctypes = ["LMS Program", "LMS Course", "Course Chapter", "Course Lesson", "LMS Quiz", "LMS Assignment"]

    for dt in all_doctypes:
        add_permission_if_not_exists(dt, DefaultLMSRole.PRINCIPAL.value, read=1, write=1, create=1, delete=1, share=1)
        add_permission_if_not_exists(dt, DefaultLMSRole.VICE_PRINCIPAL.value, read=1, write=1, create=1, delete=1, share=1)
        add_permission_if_not_exists(dt, DefaultLMSRole.HOMEROOM_TEACHER.value, read=1, write=1, create=1, delete=1, share=1)

    add_permission_if_not_exists("LMS Assignment Submission", DefaultLMSRole.PRINCIPAL.value, read=1)
    add_permission_if_not_exists("LMS Assignment Submission", DefaultLMSRole.VICE_PRINCIPAL.value, read=1)
    add_permission_if_not_exists("LMS Assignment Submission", DefaultLMSRole.HOMEROOM_TEACHER.value, read=1)

    add_permission_if_not_exists("LMS Quiz Submission", DefaultLMSRole.PRINCIPAL.value, read=1)
    add_permission_if_not_exists("LMS Quiz Submission", DefaultLMSRole.VICE_PRINCIPAL.value, read=1)
    add_permission_if_not_exists("LMS Quiz Submission", DefaultLMSRole.HOMEROOM_TEACHER.value, read=1)

    add_permission_if_not_exists("LMS Program Enrollment Request", DefaultLMSRole.HOMEROOM_TEACHER.value, read=1, write=1, create=1, delete=1, share=1)
    

    add_permission_if_not_exists("LMS Program", DefaultLMSRole.SUBJECT_TEACHER.value, read=1)
    for dt in ["LMS Course", "Course Chapter", "Course Lesson", "LMS Quiz", "LMS Assignment"]:
        add_permission_if_not_exists(dt, DefaultLMSRole.SUBJECT_TEACHER.value, read=1, write=1, create=1, delete=1, share=1)
        add_permission_if_not_exists(dt, DefaultLMSRole.DEPARTMENT_HEAD.value, read=1, write=1, create=1, delete=1, share=1)

    for dt in all_doctypes:
        add_permission_if_not_exists(dt, DefaultLMSRole.STUDENT.value, read=1)
    add_permission_if_not_exists("LMS Assignment Submission", DefaultLMSRole.STUDENT.value, read=1, create=1)
    add_permission_if_not_exists("LMS Quiz Submission", DefaultLMSRole.STUDENT.value, read=1, create=1)

    return {
        "status": "ok",
        "message" : "success"
    }

