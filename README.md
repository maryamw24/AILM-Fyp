# AILM 
## Backend
### Instructions to run 
1. Clone 
2. ```bash
    python -m venv .venv
    .venv\Scripts\activate
    pip install -r requirements.txt
    ```
3. Create `backend/.env` and add database url like this:
```bash
DATABASE_URL=postgresql://user:password@localhost:5432/ailm
```
4. Run the app
```bash
uvicorn app.main:app --reload

```