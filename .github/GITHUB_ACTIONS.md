# GitHub Actions Setup Guide

This repository includes comprehensive GitHub Actions workflows for CI/CD automation.

## 🚀 Available Workflows

### 1. **Basic CI** (`basic-ci.yml`)
- ✅ **Automatic**: Works immediately after pushing to GitHub
- Runs on every push/PR to `main` and `develop`
- Tests frontend/backend builds
- Runs linting and security audits
- Tests Docker container builds

### 2. **Full CI/CD Pipeline** (`ci-cd.yml`)
- Comprehensive testing across Node.js versions
- Security scanning
- Docker builds and tests
- **Staging deployment** (develop branch)
- **Production deployment** (main branch)
- Slack notifications

### 3. **Dependency Updates** (`dependencies.yml`)
- Weekly automated dependency updates
- Security vulnerability fixes
- Automatic PR creation
- Build testing after updates

## 🔧 Setup Instructions

### Immediate Setup (Basic CI)
1. **Push to GitHub** - Basic CI works immediately!
2. **Update README badges** - Replace `YOUR_USERNAME` with your GitHub username

### Advanced Setup (Full CI/CD)

#### Required GitHub Secrets
Go to **Settings > Secrets and variables > Actions** and add:

**For Staging Deployment:**
```
STAGING_HOST=your-staging-server.com
STAGING_USER=deploy
STAGING_SSH_KEY=your-private-ssh-key
```

**For Production Deployment:**
```
PRODUCTION_HOST=your-production-server.com
PRODUCTION_USER=deploy
PRODUCTION_SSH_KEY=your-private-ssh-key
```

**For Docker Hub (Optional):**
```
DOCKER_USERNAME=your-dockerhub-username
DOCKER_PASSWORD=your-dockerhub-token
```

**For Slack Notifications (Optional):**
```
SLACK_WEBHOOK=your-slack-webhook-url
```

#### Server Setup
1. **Create deploy user on servers:**
   ```bash
   sudo adduser deploy
   sudo usermod -aG docker deploy
   ```

2. **Setup SSH keys:**
   ```bash
   ssh-keygen -t rsa -b 4096 -C "github-actions"
   # Add public key to server: ~/.ssh/authorized_keys
   # Add private key to GitHub secrets
   ```

3. **Prepare deployment directory:**
   ```bash
   sudo mkdir -p /path/to/staging/teamtask
   sudo mkdir -p /path/to/production/teamtask
   sudo chown deploy:deploy /path/to/*/teamtask
   ```

## 🎯 Workflow Triggers

### Basic CI
- ✅ Push to `main` or `develop`
- ✅ Pull requests to `main`

### Full CI/CD
- 🔍 **Testing**: All pushes and PRs
- 🚀 **Staging**: Push to `develop` branch
- 🎯 **Production**: Push to `main` branch

### Dependencies
- 📅 **Scheduled**: Every Monday 9 AM UTC
- 🔄 **Manual**: Can be triggered from Actions tab

## 🔍 Monitoring

### Status Badges
Add to your README:
```markdown
[![CI/CD Pipeline](https://github.com/YOUR_USERNAME/teamtask/actions/workflows/basic-ci.yml/badge.svg)](https://github.com/YOUR_USERNAME/teamtask/actions)
```

### View Workflow Runs
- Go to **Actions** tab in your GitHub repository
- Monitor build status, logs, and deployment status
- Get email notifications on failures

## 🛠️ Customization

### Modify Node.js Versions
Edit `.github/workflows/ci-cd.yml`:
```yaml
strategy:
  matrix:
    node-version: [18, 20, 22] # Add/remove versions
```

### Change Deployment Paths
Update server paths in workflow files:
```yaml
script: |
  cd /your/custom/path/teamtask  # Update this
```

### Add More Environments
Copy deployment job and create new environment:
```yaml
deploy-testing:
  environment: testing
  # ... deployment steps
```

## 🚨 Troubleshooting

### Common Issues

**"SSH Permission Denied"**
- Verify SSH key format (use `-----BEGIN OPENSSH PRIVATE KEY-----`)
- Ensure public key is in server's `~/.ssh/authorized_keys`
- Check server user has docker permissions

**"Docker Command Not Found"**
- Install Docker on deployment servers
- Add deploy user to docker group: `sudo usermod -aG docker deploy`

**"Build Failures"**
- Check Node.js version compatibility
- Verify package.json scripts exist
- Review workflow logs in GitHub Actions tab

### Testing Locally
Use [act](https://github.com/nektos/act) to test workflows locally:
```bash
# Install act
curl https://raw.githubusercontent.com/nektos/act/master/install.sh | sudo bash

# Test basic CI
act push

# Test with secrets
act -s GITHUB_TOKEN=your_token
```

## 📋 Best Practices

1. **Branch Protection**: Enable branch protection rules for `main`
2. **Required Reviews**: Require PR reviews before merging
3. **Status Checks**: Make CI checks required for merging
4. **Environment Protection**: Add approval requirements for production
5. **Secret Rotation**: Regularly rotate SSH keys and tokens

## 🎉 Next Steps

1. **Push your code** to GitHub
2. **Watch the Actions tab** - Basic CI should run automatically
3. **Set up secrets** for advanced deployment
4. **Configure branch protection** rules
5. **Add team members** as reviewers

Your TeamTask application now has enterprise-grade CI/CD automation! 🚀
