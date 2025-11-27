from sqlalchemy.orm import Session
from . import models, schemas
from passlib.context import CryptContext
from sqlalchemy import select
from typing import Optional
import random
import string

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def get_user_by_email(db: Session, email: str) -> Optional[models.User]:
    return db.query(models.User).filter(models.User.email == email).first()


def create_user(db: Session, user_create: schemas.UserCreate, role: str) -> models.User:
    hashed = pwd_context.hash(user_create.password)
    db_user = models.User(
        email=user_create.email,
        password_hash=hashed,
        full_name=user_create.full_name,
        display_name=user_create.display_name,
        role=role,
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user


def verify_password(plain: str, hashed: str) -> bool:
    return pwd_context.verify(plain, hashed)


def generate_class_code(db: Session) -> str:
    """Generate a unique class code in format: abc-123-xyz (lowercase alphanumeric)"""
    max_attempts = 10
    for _ in range(max_attempts):
        # Generate 3 groups of 3 alphanumeric characters (lowercase)
        code_parts = []
        for _ in range(3):
            # Use lowercase letters and numbers
            part = ''.join(random.choices(string.ascii_lowercase + string.digits, k=3))
            code_parts.append(part)
        code = '-'.join(code_parts)
        
        # Check if code already exists
        existing = db.query(models.Class).filter(models.Class.code == code).first()
        if not existing:
            return code
    
    # Fallback: if all attempts fail, use timestamp-based code
    import time
    timestamp = str(int(time.time()))[-9:]  # Last 9 digits
    return f"{timestamp[:3]}-{timestamp[3:6]}-{timestamp[6:9]}"


def create_class(db: Session, owner_id: str, cls: schemas.ClassCreate) -> models.Class:
    # Auto-generate code if not provided
    code = cls.code
    if not code or not code.strip():
        code = generate_class_code(db)
    
    db_cls = models.Class(
        title=cls.title,
        description=cls.description,
        owner_id=owner_id,
        is_public=cls.is_public,
        code=code,
    )
    db.add(db_cls)
    db.commit()
    db.refresh(db_cls)
    return db_cls


def get_classes_by_owner(db: Session, owner_id: str):
    return db.query(models.Class).filter(models.Class.owner_id == owner_id).all()


def get_class(db: Session, class_id: str):
    return db.query(models.Class).filter(models.Class.id == class_id).first()


def get_assignment_by_class(db: Session, class_id: str):
    return db.query(models.Assignment).filter(models.Assignment.class_id == class_id).all()


def create_assignment(
    db: Session, assignment_in: schemas.AssignmentCreate, created_by: str
) -> models.Assignment:
    db_assign = models.Assignment(
        class_id=assignment_in.class_id,
        title=assignment_in.title,
        description=assignment_in.description,
        allowed_languages=assignment_in.allowed_languages,
        max_score=assignment_in.max_score,
        open_at=assignment_in.open_at,
        due_at=assignment_in.due_at,
        allow_multiple_submissions=assignment_in.allow_multiple_submissions,
        created_by=created_by,
    )
    db.add(db_assign)
    db.commit()
    db.refresh(db_assign)
    return db_assign


def create_question_with_testcases(
    db: Session, assignment_id: str, q_in: schemas.QuestionCreate
) -> models.Question:
    db_q = models.Question(
        assignment_id=assignment_id,
        title=q_in.title,
        prompt=q_in.prompt,
        points=q_in.points,
        position=q_in.position,
    )
    db.add(db_q)
    db.commit()     
    db.refresh(db_q)
    for tc in q_in.testcases or []:
        db_tc = models.QuestionTestcase(
            question_id=db_q.id,
            input=tc.input,
            expected_output=tc.expected_output,
            is_hidden=tc.is_hidden,
        )
        db.add(db_tc)
    db.commit()
    db.refresh(db_q)
    return db_q


# new crud function

def get_assignment_preview(db: Session, assignment_id: str):
    assignment = (
        db.query(models.Assignment)
        .filter(models.Assignment.id == assignment_id)
        .first()
    )

    if not assignment:
        return None

    # force load questions + testcases
    questions = (
        db.query(models.Question)
        .filter(models.Question.assignment_id == assignment_id)
        .order_by(models.Question.position.asc())
        .all()
    )

    for q in questions:
        q.testcases  # trigger lazy load

    assignment.questions = questions
    return assignment

###

def create_lab(db: Session, lab_in: schemas.LabCreate, created_by: str) -> models.Lab:
    db_lab = models.Lab(
        class_id=lab_in.class_id,
        assignment_id=lab_in.assignment_id,
        title=lab_in.title,
        start_time=lab_in.start_time,
        end_time=lab_in.end_time,
        duration_seconds=lab_in.duration_seconds,
        created_by=created_by,
    )
    db.add(db_lab)
    db.commit()
    db.refresh(db_lab)
    return db_lab


def add_student_to_class(
    db: Session, class_id: str, user: models.User, role: str = "student"
) -> models.ClassMember:
    already_member = (
        db.query(models.ClassMember)
        .filter(
            models.ClassMember.class_id == class_id,
            models.ClassMember.user_id == user.id,
        )
        .first()
    )
    if already_member:
        return already_member
    member = models.ClassMember(class_id=class_id, user_id=user.id, role=role)
    db.add(member)
    db.commit()
    db.refresh(member)
    return member


def get_user_by_email_or_create(db: Session, email: str) -> models.User:
    user = get_user_by_email(db, email)
    if user:
        if user.role == "student":
            return user
        else:
            return None

    user = models.User(email=email, role="student")
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


def join_class_by_code(db: Session, code: str, user_id: str) -> models.Class:
    # Find class by code
    class_ = db.query(models.Class).filter(models.Class.code == code).first()
    if not class_:
        return None
    
    # Get user
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user:
        return None
    
    # Check if already a member
    existing_member = (
        db.query(models.ClassMember)
        .filter(
            models.ClassMember.class_id == class_.id,
            models.ClassMember.user_id == user_id,
        )
        .first()
    )
    
    if existing_member:
        return class_  # Already enrolled, return class
    
    # Add user as member
    member = models.ClassMember(class_id=class_.id, user_id=user_id, role="student")
    db.add(member)
    db.commit()
    db.refresh(class_)
    return class_


def get_classes_by_student(db: Session, user_id: str):
    # Get all class memberships for this user
    memberships = (
        db.query(models.ClassMember)
        .filter(models.ClassMember.user_id == user_id)
        .all()
    )
    
    # Get the classes
    class_ids = [m.class_id for m in memberships]
    classes = db.query(models.Class).filter(models.Class.id.in_(class_ids)).all()
    return classes


def create_submission(
    db: Session, sub_in: schemas.SubmissionCreate
) -> models.Submission:
    s = models.Submission(
        question_id=sub_in.question_id,
        user_id=sub_in.user_id,
        code=sub_in.code,
        language=sub_in.language,
        lab_session_id=sub_in.lab_session_id,
        status="pending",
    )
    db.add(s)
    db.commit()
    db.refresh(s)
    return s


def grade_submission(db: Session, grade_req: schemas.GradeRequest):
    s = (
        db.query(models.Submission)
        .filter(models.Submission.id == grade_req.submission_id)
        .first()
    )
    if not s:
        return None
    s.score = grade_req.score
    s.passed_test_count = grade_req.passed_test_count
    s.total_test_count = grade_req.total_test_count
    s.result_details = grade_req.result_details
    s.status = "scored"
    db.add(s)
    db.commit()
    db.refresh(s)
    return s


def create_resource(db: Session, resource_in: schemas.ResourceCreate, uploader_id: str) -> models.CourseMaterial:
    db_resource = models.CourseMaterial(
        class_id=resource_in.class_id,
        uploader_id=uploader_id,
        title=resource_in.title,
        description=resource_in.description,
        file_url=resource_in.file_url,
        file_type=resource_in.file_type,
    )
    db.add(db_resource)
    db.commit()
    db.refresh(db_resource)
    return db_resource


def get_resources_by_class(db: Session, class_id: str):
    return db.query(models.CourseMaterial).filter(models.CourseMaterial.class_id == class_id).order_by(models.CourseMaterial.uploaded_at.desc()).all()


def delete_resource(db: Session, resource_id: str) -> bool:
    resource = db.query(models.CourseMaterial).filter(models.CourseMaterial.id == resource_id).first()
    if not resource:
        return False
    db.delete(resource)
    db.commit()
    return True


def get_leaderboard_by_class(db: Session, class_id: str):
    """Get leaderboard for a class based on assignment completion count"""
    # Get all class members (students)
    members = (
        db.query(models.ClassMember)
        .filter(models.ClassMember.class_id == class_id, models.ClassMember.role == "student")
        .all()
    )
    
    # Get all assignments for this class
    assignments = db.query(models.Assignment).filter(models.Assignment.class_id == class_id).all()
    assignment_ids = [a.id for a in assignments]
    
    # Get all questions for these assignments
    questions = (
        db.query(models.Question)
        .filter(models.Question.assignment_id.in_(assignment_ids))
        .all()
    )
    question_ids = [q.id for q in questions]
    
    # Calculate completion stats for each student
    leaderboard = []
    for member in members:
        # Count unique assignments the student has submitted to
        submissions = (
            db.query(models.Submission)
            .filter(
                models.Submission.user_id == member.user_id,
                models.Submission.question_id.in_(question_ids)
            )
            .all()
        )
        
        # Count unique assignments
        submitted_assignments = set()
        for sub in submissions:
            # Find which assignment this question belongs to
            question = next((q for q in questions if q.id == sub.question_id), None)
            if question:
                submitted_assignments.add(question.assignment_id)
        
        completion_count = len(submitted_assignments)
        total_assignments = len(assignments)
        
        # Get user info
        user = db.query(models.User).filter(models.User.id == member.user_id).first()
        
        leaderboard.append({
            "user_id": member.user_id,
            "name": user.display_name or user.full_name or user.email if user else "Unknown",
            "email": user.email if user else "",
            "completion_count": completion_count,
            "total_assignments": total_assignments,
            "completion_percentage": (completion_count / total_assignments * 100) if total_assignments > 0 else 0,
        })
    
    # Sort by completion count (descending)
    leaderboard.sort(key=lambda x: (x["completion_count"], x["completion_percentage"]), reverse=True)
    
    # Add rank
    for i, entry in enumerate(leaderboard):
        entry["rank"] = i + 1
    
    return leaderboard


def create_message(db: Session, class_id: str, sender_id: str, content: str, message_type: str = "chat") -> models.Message:
    db_message = models.Message(
        class_id=class_id,
        sender_id=sender_id,
        content=content,
        message_type=message_type,
        is_private=False,
    )
    db.add(db_message)
    db.commit()
    db.refresh(db_message)
    return db_message


def get_messages_by_class(db: Session, class_id: str, limit: int = 100):
    return (
        db.query(models.Message)
        .filter(models.Message.class_id == class_id, models.Message.is_private == False)
        .order_by(models.Message.created_at.desc())
        .limit(limit)
        .all()
    )


def get_class_members(db: Session, class_id: str):
    """Get all members of a class with user information"""
    members = (
        db.query(models.ClassMember)
        .filter(models.ClassMember.class_id == class_id)
        .order_by(models.ClassMember.joined_at.asc())
        .all()
    )
    
    result = []
    for member in members:
        user = db.query(models.User).filter(models.User.id == member.user_id).first()
        result.append({
            "id": member.id,
            "user_id": member.user_id,
            "role": member.role,
            "joined_at": member.joined_at,
            "is_active": member.is_active,
            "user": {
                "id": user.id if user else None,
                "email": user.email if user else None,
                "full_name": user.full_name if user else None,
                "display_name": user.display_name if user else None,
                "role": user.role if user else None,
            } if user else None,
        })
    return result
