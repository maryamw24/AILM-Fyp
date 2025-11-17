import uuid
from sqlalchemy import (
    Column,
    String,
    DateTime,
    Boolean,
    Integer,
    Text,
    ForeignKey,
    Numeric,
    func,
    UniqueConstraint,
)
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.orm import relationship
from .database import Base


def gen_uuid():
    return str(uuid.uuid4())


class User(Base):
    __tablename__ = "users"
    id = Column(UUID(as_uuid=False), primary_key=True, default=gen_uuid)
    email = Column(String(255), unique=True, nullable=False)
    password_hash = Column(Text, nullable=True)
    full_name = Column(String(255), nullable=True)
    display_name = Column(String(255), nullable=True)
    role = Column(
        String(32), nullable=False, default="student"
    )  # student|teacher|ta|admin
    profile_pic_url = Column(Text, nullable=True)
    meta = Column(JSONB, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(
        DateTime(timezone=True), server_default=func.now(), onupdate=func.now()
    )
    deleted_at = Column(DateTime(timezone=True), nullable=True)

    class_members = relationship("ClassMember", back_populates="user")
    submissions = relationship("Submission", back_populates="user")
    ai_interactions = relationship("AIInteraction", back_populates="user")


class Class(Base):
    __tablename__ = "classes"
    id = Column(UUID(as_uuid=False), primary_key=True, default=gen_uuid)
    code = Column(String(64), unique=True, nullable=True)
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    owner_id = Column(UUID(as_uuid=False), ForeignKey("users.id"), nullable=False)
    is_public = Column(Boolean, default=False)
    enrollment_key = Column(String(64), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(
        DateTime(timezone=True), server_default=func.now(), onupdate=func.now()
    )
    deleted_at = Column(DateTime(timezone=True), nullable=True)

    owner = relationship("User", foreign_keys=[owner_id])
    members = relationship("ClassMember", back_populates="class_")
    assignments = relationship("Assignment", back_populates="class_")
    labs = relationship("Lab", back_populates="class_")


class ClassMember(Base):
    __tablename__ = "class_members"
    id = Column(UUID(as_uuid=False), primary_key=True, default=gen_uuid)
    class_id = Column(UUID(as_uuid=False), ForeignKey("classes.id"), nullable=False)
    user_id = Column(UUID(as_uuid=False), ForeignKey("users.id"), nullable=False)
    role = Column(String(32), nullable=False, default="student")  # student|ta
    joined_at = Column(DateTime(timezone=True), server_default=func.now())
    is_active = Column(Boolean, default=True)
    permissions = Column(JSONB, nullable=True)

    class_ = relationship("Class", back_populates="members")
    user = relationship("User", back_populates="class_members")

    __table_args__ = (UniqueConstraint("class_id", "user_id", name="_class_user_uc"),)


class Assignment(Base):
    __tablename__ = "assignments"
    id = Column(UUID(as_uuid=False), primary_key=True, default=gen_uuid)
    class_id = Column(UUID(as_uuid=False), ForeignKey("classes.id"), nullable=False)
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    allowed_languages = Column(JSONB, nullable=True)
    max_score = Column(Integer, nullable=True)
    open_at = Column(DateTime(timezone=True), nullable=True)
    due_at = Column(DateTime(timezone=True), nullable=True)
    allow_multiple_submissions = Column(Boolean, default=True)
    created_by = Column(UUID(as_uuid=False), ForeignKey("users.id"), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    class_ = relationship("Class", back_populates="assignments")
    questions = relationship("Question", back_populates="assignment")
    versions = relationship("AssignmentVersion", back_populates="assignment")


class AssignmentVersion(Base):
    __tablename__ = "assignment_versions"
    id = Column(UUID(as_uuid=False), primary_key=True, default=gen_uuid)
    assignment_id = Column(
        UUID(as_uuid=False), ForeignKey("assignments.id"), nullable=False
    )
    version_number = Column(Integer, nullable=False, default=1)
    snapshot = Column(JSONB, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    assignment = relationship("Assignment", back_populates="versions")


class Question(Base):
    __tablename__ = "questions"
    id = Column(UUID(as_uuid=False), primary_key=True, default=gen_uuid)
    assignment_id = Column(
        UUID(as_uuid=False), ForeignKey("assignments.id"), nullable=False
    )
    title = Column(String(255), nullable=True)
    prompt = Column(Text, nullable=True)
    starter_codes = Column(JSONB, nullable=True)  # map language -> starter code
    points = Column(Integer, nullable=True)
    position = Column(Integer, nullable=True)
    constraints = Column(JSONB, nullable=True)

    assignment = relationship("Assignment", back_populates="questions")
    testcases = relationship("QuestionTestcase", back_populates="question")
    submissions = relationship("Submission", back_populates="question")


class QuestionTestcase(Base):
    __tablename__ = "question_testcases"
    id = Column(UUID(as_uuid=False), primary_key=True, default=gen_uuid)
    question_id = Column(
        UUID(as_uuid=False), ForeignKey("questions.id"), nullable=False
    )
    input = Column(Text, nullable=True)
    expected_output = Column(Text, nullable=True)
    is_hidden = Column(Boolean, default=False)
    weight = Column(Integer, default=1)
    timeout_ms = Column(Integer, nullable=True)

    question = relationship("Question", back_populates="testcases")


class Lab(Base):
    __tablename__ = "labs"
    id = Column(UUID(as_uuid=False), primary_key=True, default=gen_uuid)
    class_id = Column(UUID(as_uuid=False), ForeignKey("classes.id"), nullable=False)
    assignment_id = Column(
        UUID(as_uuid=False), ForeignKey("assignments.id"), nullable=True
    )
    title = Column(String(255), nullable=False)
    start_time = Column(DateTime(timezone=True), nullable=True)
    end_time = Column(DateTime(timezone=True), nullable=True)
    duration_seconds = Column(Integer, nullable=True)
    is_active = Column(Boolean, default=True)
    created_by = Column(UUID(as_uuid=False), ForeignKey("users.id"), nullable=True)

    class_ = relationship("Class", back_populates="labs")
    lab_sessions = relationship("LabSession", back_populates="lab")
    assignment = relationship("Assignment")


class LabSession(Base):
    __tablename__ = "lab_sessions"
    id = Column(UUID(as_uuid=False), primary_key=True, default=gen_uuid)
    lab_id = Column(UUID(as_uuid=False), ForeignKey("labs.id"), nullable=False)
    user_id = Column(UUID(as_uuid=False), ForeignKey("users.id"), nullable=False)
    start_time = Column(DateTime(timezone=True), server_default=func.now())
    end_time = Column(DateTime(timezone=True), nullable=True)
    status = Column(
        String(64), nullable=True
    )  # in_progress|submitted|left|timed_out|kicked
    last_active_at = Column(DateTime(timezone=True), nullable=True)
    session_metadata = Column(JSONB, nullable=True)

    lab = relationship("Lab", back_populates="lab_sessions")
    user = relationship("User")
    submissions = relationship("Submission", back_populates="lab_session")
    emotion_logs = relationship("EmotionLog", back_populates="lab_session")


class Submission(Base):
    __tablename__ = "submissions"
    id = Column(UUID(as_uuid=False), primary_key=True, default=gen_uuid)
    question_id = Column(
        UUID(as_uuid=False), ForeignKey("questions.id"), nullable=False
    )
    user_id = Column(UUID(as_uuid=False), ForeignKey("users.id"), nullable=False)
    lab_session_id = Column(
        UUID(as_uuid=False), ForeignKey("lab_sessions.id"), nullable=True
    )
    code = Column(Text, nullable=True)
    language = Column(String(64), nullable=True)
    submitted_at = Column(DateTime(timezone=True), server_default=func.now())
    status = Column(String(64), nullable=True)  # pending|running|scored|failed
    score = Column(Integer, nullable=True)
    passed_test_count = Column(Integer, nullable=True)
    total_test_count = Column(Integer, nullable=True)
    result_details = Column(JSONB, nullable=True)
    plagiarism_score = Column(Numeric, nullable=True)
    is_flagged = Column(Boolean, default=False)

    question = relationship("Question", back_populates="submissions")
    user = relationship("User", back_populates="submissions")
    lab_session = relationship("LabSession", back_populates="submissions")
    runs = relationship("SubmissionRun", back_populates="submission")
    plagiarism_reports = relationship("PlagiarismReport", back_populates="submission")


class SubmissionRun(Base):
    __tablename__ = "submission_runs"
    id = Column(UUID(as_uuid=False), primary_key=True, default=gen_uuid)
    submission_id = Column(
        UUID(as_uuid=False), ForeignKey("submissions.id"), nullable=False
    )
    started_at = Column(DateTime(timezone=True), server_default=func.now())
    finished_at = Column(DateTime(timezone=True), nullable=True)
    execution_result = Column(JSONB, nullable=True)
    worker_id = Column(String(255), nullable=True)

    submission = relationship("Submission", back_populates="runs")


class PlagiarismReport(Base):
    __tablename__ = "plagiarism_reports"
    id = Column(UUID(as_uuid=False), primary_key=True, default=gen_uuid)
    submission_id = Column(
        UUID(as_uuid=False), ForeignKey("submissions.id"), nullable=False
    )
    similarity_score = Column(Numeric, nullable=True)
    details = Column(JSONB, nullable=True)
    compared_with_submission_id = Column(UUID(as_uuid=False), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    flagged_by = Column(String(64), nullable=True)

    submission = relationship("Submission", back_populates="plagiarism_reports")


class AIInteraction(Base):
    __tablename__ = "ai_interactions"
    id = Column(UUID(as_uuid=False), primary_key=True, default=gen_uuid)
    user_id = Column(UUID(as_uuid=False), ForeignKey("users.id"), nullable=False)
    lab_id = Column(UUID(as_uuid=False), ForeignKey("labs.id"), nullable=True)
    question_id = Column(UUID(as_uuid=False), ForeignKey("questions.id"), nullable=True)
    prompt = Column(Text, nullable=True)
    response = Column(Text, nullable=True)
    hint_level = Column(String(32), nullable=True)  # low|medium|high
    context_snapshot = Column(JSONB, nullable=True)
    was_helpful = Column(Boolean, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    user = relationship("User", back_populates="ai_interactions")


class EmotionLog(Base):
    __tablename__ = "emotion_logs"
    id = Column(UUID(as_uuid=False), primary_key=True, default=gen_uuid)
    user_id = Column(UUID(as_uuid=False), ForeignKey("users.id"), nullable=False)
    lab_session_id = Column(
        UUID(as_uuid=False), ForeignKey("lab_sessions.id"), nullable=True
    )
    timestamp = Column(DateTime(timezone=True), server_default=func.now())
    emotion_label = Column(String(64), nullable=True)
    confidence = Column(Numeric, nullable=True)
    face_present = Column(Boolean, nullable=True)
    raw_metrics = Column(JSONB, nullable=True)

    lab_session = relationship("LabSession", back_populates="emotion_logs")


class Message(Base):
    __tablename__ = "messages"
    id = Column(UUID(as_uuid=False), primary_key=True, default=gen_uuid)
    lab_id = Column(UUID(as_uuid=False), ForeignKey("labs.id"), nullable=True)
    class_id = Column(UUID(as_uuid=False), ForeignKey("classes.id"), nullable=True)
    sender_id = Column(UUID(as_uuid=False), ForeignKey("users.id"), nullable=False)
    content = Column(Text, nullable=True)
    message_type = Column(String(32), nullable=True)  # chat|broadcast|system
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    is_private = Column(Boolean, default=False)


class CourseMaterial(Base):
    __tablename__ = "course_materials"
    id = Column(UUID(as_uuid=False), primary_key=True, default=gen_uuid)
    class_id = Column(UUID(as_uuid=False), ForeignKey("classes.id"), nullable=False)
    uploader_id = Column(UUID(as_uuid=False), ForeignKey("users.id"), nullable=False)
    title = Column(String(255), nullable=True)
    description = Column(Text, nullable=True)
    file_url = Column(String(1024), nullable=True)
    file_type = Column(String(64), nullable=True)
    meta = Column(JSONB, nullable=True)
    uploaded_at = Column(DateTime(timezone=True), server_default=func.now())


class TAAssignment(Base):
    __tablename__ = "ta_assignments"
    id = Column(UUID(as_uuid=False), primary_key=True, default=gen_uuid)
    class_id = Column(UUID(as_uuid=False), ForeignKey("classes.id"), nullable=False)
    user_id = Column(UUID(as_uuid=False), ForeignKey("users.id"), nullable=False)
    assigned_at = Column(DateTime(timezone=True), server_default=func.now())


class Grade(Base):
    __tablename__ = "grades"
    id = Column(UUID(as_uuid=False), primary_key=True, default=gen_uuid)
    assignment_id = Column(
        UUID(as_uuid=False), ForeignKey("assignments.id"), nullable=False
    )
    user_id = Column(UUID(as_uuid=False), ForeignKey("users.id"), nullable=False)
    score = Column(Integer, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class AuditLog(Base):
    __tablename__ = "audit_logs"
    id = Column(UUID(as_uuid=False), primary_key=True, default=gen_uuid)
    actor_id = Column(UUID(as_uuid=False), ForeignKey("users.id"), nullable=True)
    action = Column(String(255), nullable=False)
    details = Column(JSONB, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())


# Auxiliary simple tables
class Worker(Base):
    __tablename__ = "workers"
    id = Column(UUID(as_uuid=False), primary_key=True, default=gen_uuid)
    name = Column(String(255), nullable=True)
    meta = Column(JSONB, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class Notification(Base):
    __tablename__ = "notifications"
    id = Column(UUID(as_uuid=False), primary_key=True, default=gen_uuid)
    user_id = Column(UUID(as_uuid=False), ForeignKey("users.id"), nullable=True)
    payload = Column(JSONB, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    read = Column(Boolean, default=False)


class Topic(Base):
    __tablename__ = "topics"
    id = Column(UUID(as_uuid=False), primary_key=True, default=gen_uuid)
    name = Column(String(255), nullable=False)


class QuestionTopic(Base):
    __tablename__ = "question_topics"
    id = Column(UUID(as_uuid=False), primary_key=True, default=gen_uuid)
    question_id = Column(
        UUID(as_uuid=False), ForeignKey("questions.id"), nullable=False
    )
    topic_id = Column(UUID(as_uuid=False), ForeignKey("topics.id"), nullable=False)


class Embedding(Base):
    __tablename__ = "embeddings"
    id = Column(UUID(as_uuid=False), primary_key=True, default=gen_uuid)
    object_id = Column(UUID(as_uuid=False), nullable=True)
    vector = Column(JSONB, nullable=True)
    meta = Column(JSONB, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
