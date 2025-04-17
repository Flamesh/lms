import frappe

@frappe.whitelist(allow_guest=True)
def test_sign_up():
    return {
        "message": "hello"
    }

@frappe.whitelist(allow_guest=True)
def signup_student(username, password, gmail, program_name):
    if frappe.db.exists("User", gmail):
        frappe.throw("Email đã được đăng ký!")

    # Tạo User chưa kích hoạt
    user = frappe.get_doc({
        "doctype": "User",
        "email": gmail,
        "first_name": username,
        "enabled": 0,
        "new_password": password,
        "send_welcome_email": 0,
        "roles": [{"role": "LMS Student"}]
    })
    user.insert(ignore_permissions=True)
    user.save()

    registration = frappe.get_doc({
        "doctype": "Program Enrollment Request",
        "user": gmail,
        "program": program_name,
        "status": "Pending"
    })
    registration.insert()

    return {
        "message": "Tạo tài khoản thành công, đang chờ giáo viên phê duyệt!",
        "user_id": user.name
    }

@frappe.whitelist()
def approve_student(email, program_name):
    current_user = frappe.session.user

    # Check nếu user hiện tại có quản lý chương trình đó
    if not has_permission_to_approve(current_user, program_name):
        frappe.throw("Bạn không có quyền phê duyệt chương trình này.")

    # Lấy và kích hoạt user
    user = frappe.get_doc("User", email)
    if user.enabled:
        frappe.throw("Tài khoản đã được kích hoạt.")

    user.enabled = 1
    user.save()

    # Cập nhật yêu cầu duyệt
    request = frappe.get_value("Program Enrollment Request", {
        "user": email,
        "program": program_name,
        "status": "Pending"
    }, "name")

    if not request:
        frappe.throw("Không tìm thấy yêu cầu phê duyệt.")

    # Enroll vào các Course thuộc chương trình
    courses = frappe.get_all("Program Course", filters={"parent": program_name}, fields=["course"])
    for course in courses:
        frappe.get_doc({
            "doctype": "Course Enrollment",
            "course": course.course,
            "student": email,
            "program": program_name
        }).insert(ignore_permissions=True)

    frappe.db.set_value("Program Enrollment Request", request, "status", "Approved")

    return {
        "message": f"{email} đã được duyệt {program_name}"
    }


def has_permission_to_approve(user, program_name):
    program = frappe.get_doc("Program", program_name)

    if program.owner == user:
        return True

    return False