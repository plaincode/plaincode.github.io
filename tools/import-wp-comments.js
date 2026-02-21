#!/usr/bin/env node
/**
 * WordPress → Cusdis comment importer
 *
 * Usage:
 *   node tools/import-wp-comments.js <wordpress-export.xml> <postgres-connection-string>
 *
 * Example:
 *   node tools/import-wp-comments.js ~/Downloads/plaincode.wordpress.com-export.xml \
 *     "postgresql://postgres:PASSWORD@HOST:PORT/railway"
 *
 * The script maps WordPress post slugs → Cusdis page IDs.
 * Edit SLUG_MAP below if any WP slug differs from your Cusdis page ID.
 *
 * All imported comments are set to approved=true and preserve their original dates.
 */

'use strict';

const fs   = require('fs');
const path = require('path');
const { Client } = require('pg');

// ------------------------------------------------------------
// Map WordPress post slugs to Cusdis page IDs.
// Key   = WordPress post slug (from <link> or <wp:post_name>)
// Value = Cusdis page ID (what you set in data-cusdis-page-id)
// Add / edit entries if your WP slugs differ.
// ------------------------------------------------------------
const SLUG_MAP = {
  'clinometer':        'clinometer',
  'magnetmeter':       'magnetmeter',
  'accelmeter':        'accelmeter',
  'accel-meter':       'accelmeter',
  'isetsquare':        'isetsquare',
  'iset-square':       'isetsquare',
  'contactsbynumber':  'contactsbynumber',
  'contacts-by-number':'contactsbynumber',
  'magichue':          'magichue',
  'magic-hue':         'magichue',
  'scale':             'scale',
};

const CUSDIS_APP_ID = 'e5e9acdd-5e70-4ca7-9de6-c02c8441f730';
const BASE_URL      = 'https://www.plaincode.com/products';

// ------------------------------------------------------------

function usage() {
  console.error('Usage: node tools/import-wp-comments.js <export.xml> <postgres-url>');
  process.exit(1);
}

const [,, xmlFile, dbUrl] = process.argv;
if (!xmlFile || !dbUrl) usage();

const xml = fs.readFileSync(path.resolve(xmlFile), 'utf8');

// Simple XML parser for WXR — no external deps
function allMatches(str, re) {
  const results = [];
  let m;
  const g = new RegExp(re.source, re.flags.includes('g') ? re.flags : re.flags + 'g');
  while ((m = g.exec(str)) !== null) results.push(m);
  return results;
}

function getTag(str, tag) {
  const m = str.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, 'i'));
  return m ? m[1].replace(/<!\[CDATA\[([\s\S]*?)]]>/g, '$1').trim() : '';
}

function cuid() {
  // simple unique ID generator (no external dep)
  const ts  = Date.now().toString(36);
  const rnd = Math.random().toString(36).slice(2, 10) + Math.random().toString(36).slice(2, 10);
  return 'c' + ts + rnd;
}

// Parse items (posts)
const items = allMatches(xml, /<item>([\s\S]*?)<\/item>/);
console.log(`Found ${items.length} post(s) in export.`);

const toInsert = [];

for (const item of items) {
  const content = item[1];
  const postSlugRaw = getTag(content, 'wp:post_name');
  const postLink    = getTag(content, 'link');
  const postTitle   = getTag(content, 'title');

  // Derive slug from link if wp:post_name is empty
  let postSlug = postSlugRaw ||
    postLink.replace(/\/$/, '').split('/').pop() || '';

  const pageId = SLUG_MAP[postSlug];
  if (!pageId) {
    // Only warn if the post has comments
    const commentBlocks = allMatches(content, /<wp:comment>([\s\S]*?)<\/wp:comment>/);
    if (commentBlocks.length > 0) {
      console.warn(`  ⚠  Skipping "${postSlug}" (${commentBlocks.length} comment(s)) — not in SLUG_MAP. Add it if needed.`);
    }
    continue;
  }

  const pageUrl   = `${BASE_URL}/${pageId}/`;
  const comments  = allMatches(content, /<wp:comment>([\s\S]*?)<\/wp:comment>/);

  for (const cm of comments) {
    const c = cm[1];
    const approved = getTag(c, 'wp:comment_approved');
    if (approved !== '1') continue; // skip spam / unapproved

    const wpId      = getTag(c, 'wp:comment_id');
    const wpParent  = getTag(c, 'wp:comment_parent');
    const nickname  = getTag(c, 'wp:comment_author')      || 'Anonymous';
    const email     = getTag(c, 'wp:comment_author_email') || '';
    const dateStr   = getTag(c, 'wp:comment_date_gmt')    || getTag(c, 'wp:comment_date');
    const body      = getTag(c, 'wp:comment_content');
    const createdAt = dateStr ? new Date(dateStr + (dateStr.endsWith('Z') ? '' : 'Z')) : new Date();

    toInsert.push({ wpId, wpParent, pageId, pageUrl, pageTitle: postTitle, nickname, email, body, createdAt });
  }
}

if (toInsert.length === 0) {
  console.log('No approved comments found to import.');
  process.exit(0);
}

console.log(`\n${toInsert.length} approved comment(s) to import across pages:`);
const byPage = {};
for (const r of toInsert) byPage[r.pageId] = (byPage[r.pageId] || 0) + 1;
for (const [k, v] of Object.entries(byPage)) console.log(`  ${k}: ${v}`);

// Assign cuid IDs, resolve parent references
const wpIdToCuid = {};
for (const r of toInsert) {
  r.id = cuid();
  wpIdToCuid[r.wpId] = r.id;
}

(async () => {
  const client = new Client({ connectionString: dbUrl });
  await client.connect();
  console.log('\nConnected to PostgreSQL. Inserting…');

  let inserted = 0, skipped = 0;

  for (const r of toInsert) {
    const parentId = (r.wpParent && r.wpParent !== '0')
      ? (wpIdToCuid[r.wpParent] || null)
      : null;

    try {
      await client.query(
        `INSERT INTO "Comment"
           (id, content, by_nickname, by_email, approved,
            site_id, page_id, page_title, page_url,
            "createdAt", "updatedAt", parent_id, "deletedAt")
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,NULL)
         ON CONFLICT DO NOTHING`,
        [
          r.id, r.body, r.nickname, r.email, true,
          CUSDIS_APP_ID, r.pageId, r.pageTitle, r.pageUrl,
          r.createdAt, r.createdAt, parentId
        ]
      );
      console.log(`  ✓  [${r.pageId}] ${r.nickname}: "${r.body.slice(0, 60).replace(/\n/g,' ')}…"`);
      inserted++;
    } catch (err) {
      console.error(`  ✗  Failed for wpId=${r.wpId}: ${err.message}`);
      skipped++;
    }
  }

  await client.end();
  console.log(`\nDone. ${inserted} inserted, ${skipped} failed.`);
})();
