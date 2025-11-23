from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List, Dict, Any
from datetime import datetime


class UserCreate(BaseModel):
    email: EmailStr
    password: str
    full_name: Optional[str] = None
    display_name: Optional[str] = None


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
