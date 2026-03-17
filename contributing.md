## INITIAL SETUP

1. Install Docker
2. Clone the repository
    git clone <repository-url>
    cd <repository-name>
3. Create a .env file in the root directory
    - refer .env.example file
    - set your own username and password
4. Run the following command to build and start the containers:
    docker compose up --build
5. Access the application:
    - Frontend: http://localhost:80
    - Backend:  http://localhost:8080

---

## SUBSEQUENT RUNS

Run docker compose down -v when:
    + Changing database credentials (DB_USERNAME, DB_PASSWORD, POSTGRES_DB)
    + Changing database initialization scripts
    + You want a completely fresh database

Just docker compose up --build is enough when:
    + Changing Java/Spring Boot code
    + Changing React frontend code
    + Changing application.properties (non-DB settings)
    + Changing ports, environment variables (non-DB)

Just docker compose up (no --build) when:
    + Nothing in the code changed, just restarting the containers

---------------------------------------------------------------------------

## BASIC GIT COMMANDS

### DAILY WORKFLOW
    git pull                        # Get latest changes from remote
    git status                      # Check what files have changed
    git add .                       # Stage all changes
    git add <file>                  # Stage a specific file
    git commit -m "your message"    # Commit staged changes
    git push                        # Push commits to remote

### BRANCHING
    git branch                      # List all local branches
    git branch <branch-name>        # Create a new branch
    git checkout <branch-name>      # Switch to a branch
    git checkout -b <branch-name>   # Create and switch to a new branch
    git merge <branch-name>         # Merge a branch into current branch

### UNDOING CHANGES
    git restore <file>              # Discard changes in a file
    git restore .                   # Discard all uncommitted changes
    git reset --soft HEAD~1         # Undo last commit (keep changes)
    git reset --hard HEAD~1         # Undo last commit (discard changes)

### USEFUL 
    git log --oneline               # View commit history
    git diff                        # See uncommitted changes
    git stash                       # Temporarily save uncommitted changes
    git stash pop                   # Restore stashed changes