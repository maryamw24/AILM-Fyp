import os
from fastapi import FastAPI
from .database import engine, Base
from fastapi.middleware.cors import CORSMiddleware
from .routers import teacher, classes, assignments, labs, submissions

app = FastAPI(title="AILM - Backend", version="1.0")


Base.metadata.create_all(bind=engine)

app.include_router(teacher.router, prefix="/teacher", tags=["Teacher"])
app.include_router(classes.router, prefix="/classes", tags=["Classes"])
app.include_router(assignments.router, prefix="/assignments", tags=["Assignments"])
app.include_router(labs.router, prefix="/labs", tags=["Labs"])
app.include_router(submissions.router, prefix="/submissions", tags=["Submissions"])

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)