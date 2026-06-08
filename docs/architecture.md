# KnowledgeBase Architecture

## Design Position

KnowledgeBase is local-first and Markdown-first. Obsidian can be used as the
personal vault and editor, while the Next.js app provides ingestion, courseware,
study flows, and a richer web graph over the same files.

## Obsidian Integration

The default mode is to use `content/` in this repository as its own Obsidian
vault. Obsidian can open local folders as separate vaults, so the user can add
this folder whenever they want to browse or edit the notes with Obsidian's
native graph.

That means this repo stays self-contained:

- Git tracks the app, importers, generated notes, and courseware together.
- Obsidian remains optional instead of becoming a required dependency.
- There is no need for Obsidian Sync or a paid account for local vault usage.

If the user later wants to merge this with an older vault, we can add an export
or sync workflow. For now, keeping the project-local vault is cleaner.

In both modes, the graph is not a separate database. It is derived from:

- `[[wikilinks]]`
- Markdown links
- frontmatter tags
- source references
- generated concept relationships

That means Obsidian and the Next.js app can each render a graph from the same
knowledge files.

## Current Storage Model

KnowledgeBase is now hybrid:

- Markdown and JSON files remain the canonical source for imported sources,
  generated courses, wiki pages, graph indexes, transcripts, and Obsidian export.
- PostgreSQL is used for mutable app state such as learning progress, reading
  sessions, daily streaks, pipeline run records, token usage sync, and course
  index queries.
- Generated audio, hero images, exported vault files, token usage JSON, and
  runtime logs are local artifacts and are ignored by Git.

This keeps the learning content portable while allowing the app to track
progress and operational history without rewriting Markdown on every click.

## Why Not Make The Database Canonical?

A hosted database as the canonical content store adds cost, schema pressure,
auth concerns, backups, and deployment complexity. Markdown plus Git is still
the better source of truth for personal learning content and Obsidian
compatibility.

SQLite or embeddings can be added later as local indexes if search needs grow.
They should be treated as caches over the Markdown source of truth, not the
canonical knowledge base.

## First Workflows

1. Import raw likes from a Twitter/X archive.
2. Extract links and source metadata.
3. Save one source note per item.
4. Compile durable wiki notes from source notes.
5. Generate course modules and review questions.
6. Build a graph index for the app UI.

## Proposed Environment Variables

```bash
KNOWLEDGEBASE_CONTENT_DIR=./content
OBSIDIAN_VAULT_DIR=
```

If `OBSIDIAN_VAULT_DIR` is empty, the app uses this repo's `content/` folder.
If it is set, import and compile tools can write into the existing vault path.
