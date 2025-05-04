from enum import Enum

class DefaultLMSRole(str, Enum):
    PRINCIPAL = "Principal"
    VICE_PRINCIPAL = "Vice Principal"
    HOMEROOM_TEACHER = "Homeroom Teacher"
    SUBJECT_TEACHER = "Subject Teacher"
    DEPARTMENT_HEAD = "Department Head"
    STUDENT = "Student"