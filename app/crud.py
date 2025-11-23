from sqlalchemy.orm import Session
from . import models, schemas
from passlib.context import CryptContext
from sqlalchemy import select
from typing import Optional

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


def create_class(db: Session, owner_id: str, cls: schemas.ClassCreate) -> models.Class:
    db_cls = models.Class(
        title=cls.title,
        description=cls.description,
        owner_id=owner_id,
        is_public=cls.is_public,
        code=cls.code,
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
            weight=tc.weight,
            timeout_ms=tc.timeout_ms,
        )
        db.add(db_tc)
    db.commit()
    db.refresh(db_q)
    return db_q


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
