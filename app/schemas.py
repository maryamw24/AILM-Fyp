from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List, Dict, Any
from datetime import datetime


class UserCreate(BaseModel):
    email: EmailStr
    password: str
    full_name: Optional[str] = None
    display_name: Optional[str] = None


class UserSignup(BaseModel):
    email: EmailStr
    password: str
    full_name: Optional[str] = None
    display_name: Optional[str] = None
    role: Optional[str] = "student"  # student|teacher|ta|admin


class UserOut(BaseModel):
    id: str
    email: EmailStr
    full_name: Optional[str]
    display_name: Optional[str]
    role: str
    created_at: Optional[datetime]

    class Config:
        from_attributes = True


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class ClassCreate(BaseModel):
    title: str
    description: Optional[str] = None
    is_public: Optional[bool] = False
    code: Optional[str] = None


class ClassOut(BaseModel):
    id: str
    title: str
    description: Optional[str]
    code: Optional[str]
    owner_id: str
    owner: Optional[Dict[str, Any]] = None
    member_count: Optional[int] = None

    class Config:
        from_attributes = True


class QuestionTestcaseCreate(BaseModel):
    input: Optional[str] = None
    expected_output: Optional[str] = None
    is_hidden: Optional[bool] = False


class QuestionCreate(BaseModel):
    title: Optional[str] = None
    prompt: Optional[str] = None
    points: Optional[int] = 0
    position: Optional[int] = 0
    testcases: Optional[List[QuestionTestcaseCreate]] = []


class AssignmentCreate(BaseModel):
    class_id: str
    title: str
    description: Optional[str] = None
    allowed_languages: Optional[List[str]] = None
    max_score: Optional[int] = 100
    open_at: Optional[datetime] = None
    due_at: Optional[datetime] = None
    allow_multiple_submissions: Optional[bool] = True


class AssignmentOut(BaseModel):
    id: str
    title: str
    class_id: str
    created_at: Optional[datetime]

    class Config:
        from_attributes = True

# new added schamas
class QuestionTestcaseOut(BaseModel):
    id: str
    input: Optional[str]
    expected_output: Optional[str]
    is_hidden: Optional[bool]
    weight: Optional[int]
    timeout_ms: Optional[int]

    class Config:
        from_attributes = True


class QuestionOut(BaseModel):
    id: str
    title: Optional[str]
    prompt: Optional[str]
    points: Optional[int]
    position: Optional[int]
    testcases: List[QuestionTestcaseOut] = []

    class Config:
        from_attributes = True


class AssignmentPreviewOut(BaseModel):
    id: str
    title: str
    description: Optional[str]
    max_score: int
    class_id: str
    open_at: Optional[datetime]
    due_at: Optional[datetime]
    allow_multiple_submissions: Optional[bool]
    allowed_languages: Optional[List[str]] = None
    questions: List[QuestionOut] = []

    class Config:
        from_attributes = True

##


class LabCreate(BaseModel):
    class_id: str
    title: str
    assignment_id: Optional[str] = None
    start_time: Optional[datetime] = None
    end_time: Optional[datetime] = None
    duration_seconds: Optional[int] = None


class LabOut(BaseModel):
    id: str
    title: str
    class_id: str

    class Config:
        from_attributes = True


class AddStudentToClass(BaseModel):
    class_id: str
    user_email: EmailStr


class JoinClassByCode(BaseModel):
    code: str
    user_id: str


class SubmissionCreate(BaseModel):
    question_id: str
    user_id: str
    code: str
    language: Optional[str] = None
    lab_session_id: Optional[str] = None


class SubmissionOut(BaseModel):
    id: str
    question_id: str
    user_id: str
    score: Optional[int]
    status: Optional[str]
    submitted_at: Optional[datetime]

    class Config:
        from_attributes = True


class GradeRequest(BaseModel):
    submission_id: str
    score: int
    passed_test_count: Optional[int] = None
    total_test_count: Optional[int] = None
    result_details: Optional[Dict[str, Any]] = None


class ResourceCreate(BaseModel):
    class_id: str
    title: str
    description: Optional[str] = None
    file_url: str
    file_type: Optional[str] = None


class ResourceOut(BaseModel):
    id: str
    class_id: str
    title: Optional[str]
    description: Optional[str]
    file_url: Optional[str]
    file_type: Optional[str]
    uploaded_at: Optional[datetime]
    uploader_id: str

    class Config:
        from_attributes = True


class MessageCreate(BaseModel):
    class_id: str
    content: str
    message_type: Optional[str] = "chat"


class MessageOut(BaseModel):
    id: str
    class_id: Optional[str]
    sender_id: str
    content: Optional[str]
    message_type: Optional[str]
    created_at: Optional[datetime]
    sender: Optional[Dict[str, Any]] = None

    class Config:
        from_attributes = True
