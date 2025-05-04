import frappe
from lms.lms.custom_enum.enum import DefaultLMSRole

@frappe.whitelist(allow_guest=True)
def test_sign_up():
    return {
        "message": "hello"
    }

def split_full_name(full_name):
    parts = full_name.strip().split()
    if len(parts) == 0:
        return "", "", ""

    if len(parts) == 1:
        return parts[0], "", ""
    elif len(parts) == 2:
        return parts[0], "", parts[1]
    else:
        return parts[0], " ".join(parts[1:-1]), parts[-1]


@frappe.whitelist(allow_guest=True)
def signup_student(username, password, email, program_name, full_name):
    if frappe.db.exists("User", email):
        frappe.throw("Email đã được đăng ký!")

    first, middle, last = split_full_name(full_name)

    # Tạo User chưa kích hoạt
    user = frappe.get_doc({
        "doctype": "User",
        "username": username,
        "email": email,
        "first_name": first,
        "middle_name": middle,
        "last_name": last,
        "enabled": 0,
        "new_password": password,
        "send_welcome_email": 0,
        "roles": [{"role": DefaultLMSRole.STUDENT}]
    }).insert(ignore_permissions=True)

    # Gửi yêu cầu đăng ký lớp
    frappe.get_doc({
        "doctype": "LMS Program Enrollment Request",
        "email": email,
        "full_name": full_name,
        "program": program_name,
        "status": "Pending"
    }).insert(ignore_permissions=True)

    return {
        "status": "ok",
        "message": "Đăng ký thành công! Vui lòng đợi giáo viên duyệt.",
        "username": username
    }

@frappe.whitelist()
def approve_student(username, program_name):
    current_user = frappe.session.user

    # Check nếu user hiện tại có quản lý chương trình đó
    if not has_permission_to_approve(current_user, program_name):
        frappe.throw("Không có quyền phê duyệt.")

    # Lấy và kích hoạt user
    user = frappe.get_doc("User", username)
    if user.enabled:
        frappe.throw("Tài khoản đã được kích hoạt.")

    user.enabled = 1
    user.save()

    # Cập nhật yêu cầu duyệt
    request = frappe.get_value("Program Enrollment Request", {
        "username": username,
        "program": program_name,
        "status": "Pending"
    }, "name")

    if not request:
        frappe.throw("Không tìm thấy yêu cầu phê duyệt.")

    # Enroll vào các Course thuộc chương trình
    courses = frappe.get_all("LMS Program Course", filters={"parent": program_name}, fields=["course"])
    for course in courses:
        frappe.get_doc({
            "doctype": "Course Enrollment",
            "course": course.course,
            "student": username,
            "program": program_name
        }).insert(ignore_permissions=True)

    frappe.db.set_value("Program Enrollment Request", request, "status", "Approved")

    return {
        "message": f"{username} đã được duyệt {program_name}"
    }


def has_permission_to_approve(user, program_name):
    program = frappe.get_doc("LMS Program", program_name)

    if program.owner == user:
        return True

    return False