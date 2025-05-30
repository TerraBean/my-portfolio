# Dependencies Installation

## Core Dependencies

```bash
# Install core packages
npm install exa-js @google/generative-ai node-cron

# Install type definitions
npm install --save-dev @types/node-cron

# Install UI components (if not present)
npm install @radix-ui/react-alert-dialog lucide-react sonner
```

## Dependency Breakdown

### API Integration
- `exa-js`: Web scraping and content discovery
- `@google/generative-ai`: Google Gemini AI integration

### Automation
- `node-cron`: Scheduled task execution
- `@types/node-cron`: TypeScript definitions

### UI Components
- `@radix-ui/react-alert-dialog`: Dialog components
- `lucide-react`: Icons
- `sonner`: Toast notifications

## Verification

After installation:
1. Check package.json for correct versions
2. Verify no peer dependency warnings
3. Test import statements in a new component
4. Run the development server to check for any issues
