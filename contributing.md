## 🚀 Initial Setup

1. **Install Docker**

2. **Clone the repository**
```bash
    git clone <repository-url>
    cd <repository-name>
```

3. **Create a `.env` file in the root directory**
    - Refer to the `.env.example` file
    - Set your own username and password

4. **Build and start the containers**
```bash
    docker compose up --build
```

5. **Access the application**

    | Service  | URL                   |
    |----------|-----------------------|
    | Frontend | http://localhost:80   |
    | Backend  | http://localhost:8080 |

---

## 🔄 Subsequent Runs

### `docker compose down -v` then `docker compose up --build`
> Use when you change anything database-related
- Changing database credentials (`DB_USERNAME`, `DB_PASSWORD`, `POSTGRES_DB`)
- Changing database initialization scripts
- You want a completely fresh database

### `docker compose up --build`
> Use when you change application code or config
- Changing Java/Spring Boot code
- Changing React frontend code
- Changing `application.properties` (non-DB settings)
- Changing ports or environment variables (non-DB)

### `docker compose up`
> Use when nothing changed — just restarting the containers

---

## 🗂️ Basic Git Commands

### Daily Workflow
```bash
git pull                        # Get latest changes from remote
git status                      # Check what files have changed
git add .                       # Stage all changes
git add <file>                  # Stage a specific file
git commit -m "your message"    # Commit staged changes
git push                        # Push commits to remote
```

### Branching
```bash
git branch                      # List all local branches
git branch <branch-name>        # Create a new branch
git checkout <branch-name>      # Switch to a branch
git checkout -b <branch-name>   # Create and switch to a new branch
git merge <branch-name>         # Merge a branch into current branch
```

### Undoing Changes
```bash
git restore <file>              # Discard changes in a file
git restore .                   # Discard all uncommitted changes
git reset --soft HEAD~1         # Undo last commit (keep changes)
git reset --hard HEAD~1         # Undo last commit (discard changes)
```

### Useful Commands
```bash
git log --oneline               # View commit history
git diff                        # See uncommitted changes
git stash                       # Temporarily save uncommitted changes
git stash pop                   # Restore stashed changes
```