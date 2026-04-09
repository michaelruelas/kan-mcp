# kan-mcp

A Model Context Protocol (MCP) server that exposes the [Kan.bn](https://kan.bn) REST API as tools for AI assistants.

Built with Bun + TypeScript.

![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![Bun](https://img.shields.io/badge/Bun-%23000000.svg?style=for-the-badge&logo=bun&logoColor=white)
![Test Coverage](https://img.shields.io/badge/coverage-97%25-brightgreen?style=for-the-badge)

## Overview

kan-mcp exposes 40 tools across 6 domains for managing Kan.bn workspaces:

| Domain | Tools | Description |
|--------|-------|-------------|
| workspace | 8 | List, create, get, update, delete, search workspaces |
| board | 7 | Manage boards with slug availability checking |
| list | 3 | Create, update, delete lists |
| card | 9 | Full card management with labels, members, activities |
| label | 4 | Create and manage colored labels |
| checklist | 6 | Checklist management with items |
| comment | 3 | Card comments |

## Quick Start

```bash
# Install dependencies
bun install

# Run tests
bun test

# Build standalone binary
bun run build
```

## Configuration

kan-mcp requires a Kan.bn API key:

```bash
export KAN_API_KEY=kan_your_api_key_here
bun run src/index.ts
```

## MCP Server Integration

### Claude Desktop (macOS)

Add to `~/Library/Application Support/Claude/claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "kan": {
      "command": "bun",
      "args": ["run", "/path/to/kan-mcp/src/index.ts"],
      "env": {
        "KAN_API_KEY": "kan_your_api_key_here"
      }
    }
  }
}
```

### Claude Desktop (Windows)

Add to `%APPDATA%\Claude\claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "kan": {
      "command": "bun",
      "args": ["run", "C:\\path\\to\\kan-mcp\\src\\index.ts"],
      "env": {
        "KAN_API_KEY": "kan_your_api_key_here"
      }
    }
  }
}
```

### Cursor

Add to Cursor settings (Settings → MCP → Add new server):

```json
{
  "mcpServers": {
    "kan": {
      "command": "bun",
      "args": ["/path/to/kan-mcp/src/index.ts"],
      "env": {
        "KAN_API_KEY": "kan_your_api_key_here"
      }
    }
  }
}
```

### VS Code with Copilot

Add to `.vscode/mcp.json`:

```json
{
  "servers": {
    "kan": {
      "command": "bun",
      "args": ["/absolute/path/to/kan-mcp/src/index.ts"],
      "env": {
        "KAN_API_KEY": "kan_your_api_key_here"
      }
    }
  }
}
```

### Roo (CLINE)

Add to your global MCP settings:

```json
{
  "mcpServers": {
    "kan": {
      "command": "bun",
      "args": ["/path/to/kan-mcp/src/index.ts"],
      "env": {
        "KAN_API_KEY": "kan_your_api_key_here"
      }
    }
  }
}
```

## Available Tools

### Workspace Tools

```
workspace.list                    # List all workspaces
workspace.create                  # Create a new workspace
workspace.getById                 # Get workspace by ID
workspace.getBySlug              # Get workspace by slug
workspace.update                  # Update workspace properties
workspace.delete                  # Delete a workspace
workspace.search                  # Search boards and cards
workspace.checkSlugAvailability   # Check if slug is available
```

### Board Tools

```
board.list                       # List boards (with filters)
board.create                     # Create a new board
board.getById                    # Get board by ID
board.getBySlug                  # Get board by slug
board.update                     # Update board properties
board.delete                     # Delete a board
board.checkSlugAvailability      # Check if slug is available
```

### List Tools

```
list.create                      # Create a new list
list.update                      # Update list properties
list.delete                      # Delete a list
```

### Card Tools

```
card.create                      # Create a new card
card.getById                     # Get card by ID
card.update                      # Update card properties
card.delete                      # Delete a card
card.addLabel                    # Add label to card
card.removeLabel                 # Remove label from card
card.addMember                   # Add member to card
card.removeMember                # Remove member from card
card.listActivities              # List card activities
```

### Label Tools

```
label.create                     # Create a new label
label.getById                    # Get label by ID
label.update                     # Update label properties
label.delete                     # Delete a label
```

### Checklist Tools

```
checklist.create                 # Create checklist on card
checklist.update                 # Update checklist properties
checklist.delete                 # Delete a checklist
checklist.addItem                # Add item to checklist
checklist.updateItem             # Update checklist item
checklist.deleteItem             # Delete checklist item
```

### Comment Tools

```
comment.add                      # Add comment to card
comment.update                   # Update comment
comment.delete                   # Delete a comment
```

## Usage Examples

### Create a workspace and board

```
AI: Create a workspace called "Project Alpha" with slug "project-alpha"

Tool: workspace.create
Input: { "name": "Project Alpha", "slug": "project-alpha" }
Output: { "publicId": "ws_xxx", "name": "Project Alpha", "slug": "project-alpha", ... }

AI: Now create a board called "Sprint 1" in that workspace

Tool: board.create
Input: { "workspacePublicId": "ws_xxx", "name": "Sprint 1", "slug": "sprint-1", "visibility": "private" }
Output: { "publicId": "brd_xxx", "name": "Sprint 1", ... }
```

### Manage cards with labels and checklists

```
AI: Add a card called "Implement login" to the Sprint 1 board, add the "backend" label, and create a checklist with "Design DB schema" and "Write auth middleware"

Tool: card.create
Input: { "listPublicId": "lst_xxx", "title": "Implement login" }

Tool: card.addLabel
Input: { "cardPublicId": "card_xxx", "labelPublicId": "lbl_backend" }

Tool: checklist.create
Input: { "cardPublicId": "card_xxx", "name": "Tasks" }

Tool: checklist.addItem
Input: { "checklistPublicId": "chk_xxx", "title": "Design DB schema" }

Tool: checklist.addItem
Input: { "checklistPublicId": "chk_xxx", "title": "Write auth middleware" }
```

### Search and update

```
AI: Find all cards with "login" in the title and update their priority to high

Tool: workspace.search
Input: { "query": "login" }
Output: { "boards": [...], "cards": [{ "publicId": "card_xxx", "title": "Implement login", ... }] }

Tool: card.update
Input: { "publicId": "card_xxx", "priority": "high" }
```

## Test Coverage

```
------------------------|---------|---------|-------------------
File                    | % Funcs | % Lines | Uncovered Line #s
------------------------|---------|---------|-------------------
All files               |   95.83 |   96.89 |
 src/client.ts          |  100.00 |  100.00 |
 src/errors.ts          |  100.00 |  100.00 |
 src/tools/board.ts     |  100.00 |  100.00 |
 src/tools/card.ts      |  100.00 |  100.00 |
 src/tools/checklist.ts |  100.00 |   99.38 |
 src/tools/comment.ts   |  100.00 |  100.00 |
 src/tools/label.ts     |  100.00 |  100.00 |
 src/tools/list.ts      |  100.00 |  100.00 |
 src/tools/workspace.ts  |  100.00 |  100.00 |
 src/types.ts           |  100.00 |  100.00 |
------------------------|---------|---------|-------------------
```

## Architecture

```
kan-mcp/
├── src/
│   ├── index.ts           # MCP server entry, tool registration
│   ├── client.ts          # Kan API client with error mapping
│   ├── types.ts           # Branded IDs, discriminated unions
│   ├── errors.ts          # KanApiError, McpError, error mapping
│   ├── utils.ts           # Type guards, builders
│   └── tools/
│       ├── mod.ts         # Aggregates all 40 tools
│       ├── workspace.ts   # 8 workspace tools
│       ├── board.ts      # 7 board tools
│       ├── list.ts       # 3 list tools
│       ├── card.ts       # 9 card tools
│       ├── label.ts      # 4 label tools
│       ├── checklist.ts  # 6 checklist tools
│       └── comment.ts    # 3 comment tools
└── tests/
    ├── setup.ts
    └── tools/            # Unit tests per domain
```

## Type Safety

kan-mcp uses TypeScript strict mode with:

- **Branded types** for IDs (WorkspaceId, BoardId, CardId, etc.) to prevent mixing
- **Discriminated unions** for API responses and tool results
- **Const assertions** for routes and enums

## License

MIT
