# Daily Development Workflow

## Starting new work
```bash
git checkout develop
git pull origin develop
```

## Saving work in progress
```bash
git add .
git commit -m "wip: description of what I did"
git push origin develop
```

## When a feature is complete and I want to deploy to master
```bash
git checkout develop
git pull origin develop
git checkout master
git pull origin master
git merge develop
git push origin master
git checkout develop
```

## Commit message format
| Prefix | Usage |
|--------|-------|
| `feat:` | new feature |
| `fix:` | bug fix |
| `wip:` | work in progress |
| `chore:` | config, deps, cleanup |
| `docs:` | documentation changes |
| `style:` | styling only changes |
