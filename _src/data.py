"""Content for the Xubitar redesign prototype.

Service copy comes from files/docs.txt. Anything marked `sample` is
illustrative placeholder content that must be replaced with approved,
real client data before launch (see the service plan: "Avoid promising
results unless Xubitar has evidence to support the claim").
"""

SITE = {
    "name": "Xubitar",
    "legal": "Xubitar Soft",
    "email": "support@xubitar.com",
    "xpreorder_url": "https://apps.shopify.com/xpreorder",
    "xocialai_url": "https://xocialai.com/",
    "version": "Prototype v1",
    "date": "14 Nov 2026",
}

# ---------------------------------------------------------------------------
# Pages (used by the review toolbar + start-here hub)
# ---------------------------------------------------------------------------
PAGES = [
    {"file": "index.html", "title": "Home", "group": "Core", "desc": "Landing page focused on trust: audiences, services, proof, store renovation & care, process, reviews, products, FAQ."},
    {"file": "services.html", "title": "Services overview", "group": "Services", "desc": "All five services, engagement models and how to choose."},
    {"file": "service-shopify-development.html", "title": "Shopify Custom Development & Integrations", "group": "Services", "desc": "Service detail template (custom apps, APIs, ERP/CRM, themes)."},
    {"file": "service-shopify-support.html", "title": "Shopify Technical Support & Maintenance", "group": "Services", "desc": "Service detail with monthly support plans and response targets."},
    {"file": "service-ai-automation.html", "title": "AI Automation & Workflow Integration", "group": "Services", "desc": "Service detail with automation examples (n8n, CRM, support)."},
    {"file": "service-seo-ai-search.html", "title": "SEO, AEO, GEO, LLMO & AI SEO", "group": "Services", "desc": "Service detail explaining search + AI discovery, honest approach."},
    {"file": "service-custom-web.html", "title": "Custom Web Solutions", "group": "Services", "desc": "Service detail: professional websites that win clients."},
    {"file": "work.html", "title": "Work / Case studies", "group": "Proof", "desc": "Filterable case-study library."},
    {"file": "case-study.html", "title": "Case study detail", "group": "Proof", "desc": "Problem, approach, result template with before/after and quote."},
    {"file": "agencies.html", "title": "For agencies", "group": "Core", "desc": "White-label development partner page for agencies."},
    {"file": "products.html", "title": "Products", "group": "Company", "desc": "XPreOrder and XocialAI."},
    {"file": "about.html", "title": "About", "group": "Company", "desc": "Story, values, team, how we work."},
    {"file": "careers.html", "title": "Careers", "group": "Company", "desc": "Culture, open roles, hiring process."},
    {"file": "contact.html", "title": "Start a project / Contact", "group": "Conversion", "desc": "Three-step qualifying enquiry form + booking + direct contact."},
    {"file": "style-guide.html", "title": "Style guide", "group": "System", "desc": "Colours, type, components for developer hand-off."},
]

# ---------------------------------------------------------------------------
# Services
# ---------------------------------------------------------------------------
SERVICES = [
    {
        "slug": "shopify-development",
        "file": "service-shopify-development.html",
        "icon": "code",
        "name": "Shopify Custom Development & Integrations",
        "short": "Shopify Development & Integrations",
        "nav_desc": "Custom apps, APIs, ERP/CRM integrations, themes",
        "tagline": "When standard features and existing apps aren't enough.",
        "hero_title": "Custom Shopify solutions built around how your business works",
        "hero_sub": "Xubitar Soft builds custom Shopify solutions tailored to your business needs. When standard Shopify features and existing apps aren't enough, we develop custom apps, customise storefronts, integrate third-party systems and improve complex ecommerce workflows.",
        "audience": "Shopify merchants, Plus brands and agencies",
        "problems": [
            "No app in the App Store does exactly what your business needs",
            "Inventory, orders and customers live in disconnected systems",
            "Your theme is slow, fragile or hard to change",
            "Complex shipping, bundling, preorder or subscription rules",
            "A previous developer left bugs nobody can trace",
        ],
        "included": [
            ("code", "Custom Shopify app development", "Private and custom apps built for one business's exact workflow."),
            ("plug", "Admin API, GraphQL & webhooks", "Reliable, rate-limit-aware integrations with retries and logging."),
            ("database", "ERP, CRM, inventory & fulfilment", "NetSuite, Odoo, HubSpot, 3PLs and warehouse systems kept in sync."),
            ("layers", "Shopify Functions & app extensions", "Discounts, checkout, delivery and payment customisations."),
            ("package", "Shipping, bundles, preorders & subscriptions", "Custom logic for how you actually sell and ship."),
            ("layout", "Custom theme development", "Online Store 2.0 themes and sections your team can edit safely."),
            ("refresh", "Theme bug fixes & updates", "Fix, upgrade and clean up existing themes without a rebuild."),
            ("git-branch", "Third-party app integrations", "Make the apps you already pay for work together."),
            ("settings", "Complex bug fixes & workflow improvements", "Untangle and document what's slowing your team down."),
        ],
        "promise": "We focus on reliable integrations, maintainable code, and solutions that fit your business processes.",
        "cta": "Need functionality that existing apps can't provide? Let's build the right solution for your Shopify store.",
        "stack": ["Shopify Admin API", "GraphQL", "Webhooks", "Shopify Functions", "Checkout Extensibility", "Liquid", "Remix / React", "Node.js", "Polaris", "NetSuite", "Odoo", "HubSpot"],
        "case": "northwind",
        "visual": "sync",
        "faq": [
            ("Do we own the custom app and code?", "Yes. On final payment you own the code, repository and app credentials. We document everything so another developer could pick it up."),
            ("Can you work on a store another developer built?", "Yes. We start with a short technical review so we understand the existing code before changing it, and we tell you what we find."),
            ("Will this slow down my store?", "Performance is part of the scope. We test on a staging or development store and check speed before anything goes live."),
            ("How do you price custom development?", "After a discovery call we send a written scope with a fixed price, timeline and responsibilities. No open-ended hourly surprises."),
        ],
    },
    {
        "slug": "shopify-support",
        "file": "service-shopify-support.html",
        "icon": "life-buoy",
        "name": "Shopify Technical Support & Maintenance",
        "short": "Support & Maintenance",
        "nav_desc": "Monthly plans, bug fixes, app & integration care",
        "tagline": "A development partner on call — without a full-time hire.",
        "hero_title": "Keep your Shopify store and custom apps running smoothly",
        "hero_sub": "Ongoing technical support from Xubitar Soft. We help merchants and agencies resolve technical issues, maintain integrations and continuously improve their ecommerce systems without hiring a full-time developer.",
        "audience": "Growing merchants and agencies with live stores",
        "problems": [
            "Small bugs pile up because there's no developer on hand",
            "An integration fails silently and orders go missing",
            "App updates or theme changes break something on checkout",
            "Freelancers disappear when you need them most",
            "You need improvements every month, not a one-off project",
        ],
        "included": [
            ("alert", "Bug fixing & troubleshooting", "Diagnose and fix store issues, with a short note on the root cause."),
            ("code", "Custom app maintenance & improvements", "Keep private apps up to date with Shopify API versions."),
            ("plug", "API & webhook error resolution", "Find failed syncs, replay events and stop them recurring."),
            ("git-branch", "Third-party integration support", "Work with app vendors so you don't have to."),
            ("trending-up", "Store functionality enhancements", "Small features and UX improvements, shipped monthly."),
            ("gauge", "Technical reviews & performance", "Regular health checks on speed, apps and code quality."),
            ("users", "Ongoing development assistance", "A consistent team that knows your store."),
        ],
        "promise": "Choose a monthly support plan based on your workload, with agreed development hours and response targets.",
        "cta": "Whether you need occasional fixes or a long-term development partner, we're here to support your business as it grows.",
        "stack": ["Shopify", "Shopify Plus", "Liquid", "Admin API", "Webhooks", "Shopify Functions", "Klaviyo", "Recharge", "Gorgias", "Slack", "Linear / Jira"],
        "case": "monohome",
        "visual": "tickets",
        "faq": [
            ("What happens to unused hours?", "To be confirmed by Xubitar — options are roll-over for one month or no roll-over with a lower price. (Open question for review.)"),
            ("How do we request work?", "Through a shared board or Slack channel. Every request gets an owner, an estimate and a status you can see."),
            ("Do you offer emergency support?", "Higher plans include faster response targets for critical issues such as checkout or order sync failures."),
            ("Can agencies use a support plan for their clients?", "Yes. Many agencies use a plan as white-label capacity across several client stores."),
        ],
    },
    {
        "slug": "ai-automation",
        "file": "service-ai-automation.html",
        "icon": "sparkles",
        "name": "AI Automation & Business Workflow Integration",
        "short": "AI Automation & Workflows",
        "nav_desc": "n8n workflows, CRM, support & reporting automation",
        "tagline": "Less copy-paste. More time for the work that matters.",
        "hero_title": "Automate the repetitive work that slows your team down",
        "hero_sub": "Xubitar Soft helps businesses save time and reduce repetitive work through AI-powered automation and custom integrations. We connect your existing tools, automate manual processes and build intelligent workflows tailored to your operations.",
        "audience": "Operations teams, startups and ecommerce brands",
        "problems": [
            "Your team copies data between tools every day",
            "Leads sit in inboxes before anyone follows up",
            "Support answers the same questions again and again",
            "Reports take hours to put together every week",
            "Content and social posting is always behind schedule",
        ],
        "included": [
            ("workflow", "AI-powered workflow automation", "Combine AI with clear business rules and human approval steps."),
            ("git-branch", "n8n workflow development", "Self-hosted or cloud n8n workflows, documented and monitored."),
            ("users", "Lead management & CRM automation", "Capture, score, route and follow up on leads automatically."),
            ("mail", "Customer support & email workflows", "Triage, tag and draft replies for your team to approve."),
            ("shopping-bag", "Shopify order & inventory automation", "Order routing, stock alerts, tagging and fulfilment flows."),
            ("pen", "AI content & social scheduling", "Drafts and schedules on-brand posts — or use our product XocialAI."),
            ("trending-up", "Automated reporting & data processing", "Daily and weekly reports delivered where your team works."),
            ("plug", "Custom API & webhook integrations", "When there's no ready-made connector, we build one."),
        ],
        "promise": "We combine AI, business rules and reliable integrations to create practical solutions that improve efficiency without unnecessary complexity.",
        "cta": "Tell us which tasks consume your team's time, and we'll help you automate them.",
        "stack": ["n8n", "OpenAI", "Claude", "Make", "Zapier", "HubSpot", "Pipedrive", "Google Workspace", "Slack", "Shopify", "Airtable", "Webhooks"],
        "case": "brightside",
        "visual": "flow",
        "faq": [
            ("Is it safe to let AI handle customer messages?", "We design workflows with approval steps. AI drafts and sorts; your team approves anything customer-facing until you're confident."),
            ("Do we need n8n?", "No. We pick the simplest reliable tool for the job — n8n, Make, Zapier or custom code — and explain the trade-offs."),
            ("Who maintains the workflows?", "We document every workflow and can maintain them under a monthly support plan, or hand them over to your team."),
            ("How do you measure success?", "We agree on a baseline before we start, such as hours spent or response time, and report against it."),
        ],
    },
    {
        "slug": "seo-ai-search",
        "file": "service-seo-ai-search.html",
        "icon": "search",
        "name": "SEO, AEO, GEO, LLMO & AI SEO",
        "short": "SEO & AI Search Visibility",
        "nav_desc": "Be found on Google and in AI answers",
        "tagline": "Be easy to find, understand and reference.",
        "hero_title": "Be found in search engines and AI answers",
        "hero_sub": "Xubitar Soft helps businesses improve their online visibility across traditional search engines, answer engines and AI-powered discovery platforms. We combine practical SEO foundations with emerging optimisation approaches to help your content become easier to find, understand and reference.",
        "audience": "Ecommerce brands, startups and service businesses",
        "problems": [
            "Your products don't show up for the searches that matter",
            "AI assistants describe competitors but not you",
            "Technical issues quietly block pages from being indexed",
            "Product and collection content is thin or duplicated",
            "You can't tell which SEO work is actually paying off",
        ],
        "included": [
            ("search", "Search Engine Optimisation (SEO)", "Rank for the searches your customers actually make."),
            ("message-square", "Answer Engine Optimisation (AEO)", "Clear answers for featured snippets and voice search."),
            ("sparkles", "Generative Engine Optimisation (GEO)", "Content structured for AI Overviews, ChatGPT and Perplexity."),
            ("bot", "Large Language Model Optimisation (LLMO)", "Help language models understand and describe your brand accurately."),
            ("pen", "AI SEO strategy & content optimisation", "Briefs, rewrites and on-page improvements that read well to people first."),
            ("settings", "Technical SEO audits & on-page fixes", "Crawlability, speed, internal linking, metadata and Shopify-specific issues."),
            ("layers", "Structured data & content organisation", "Schema markup and site structure that machines can parse."),
            ("trending-up", "Visibility & performance reporting", "Clear recommendations and progress you can follow month to month."),
        ],
        "promise": "Our approach focuses on useful content, sound technical foundations and measurable improvements — not guaranteed rankings or AI citations.",
        "cta": "Let's identify opportunities to strengthen your visibility across search and AI discovery.",
        "stack": ["Google Search Console", "GA4", "Ahrefs", "Screaming Frog", "Schema.org", "Shopify SEO", "Core Web Vitals", "Bing Webmaster", "Perplexity", "ChatGPT", "Google AI Overviews"],
        "case": "peak",
        "visual": "answer",
        "faq": [
            ("Can you guarantee first-page rankings or AI citations?", "No, and you should be careful of anyone who does. We focus on the work that makes you easier to find and report honestly on what changes."),
            ("What is the difference between SEO, AEO, GEO and LLMO?", "SEO targets search results; AEO targets direct answers; GEO targets AI-generated answers; LLMO helps language models understand your brand. They share the same foundation: useful, well-structured content."),
            ("Do you write content?", "Yes. We plan, brief and optimise content, and can write or rewrite product, collection and guide pages in your brand voice."),
            ("How long until we see results?", "Technical fixes can show impact within weeks; content and authority work usually takes several months. We'll set realistic expectations after the audit."),
        ],
    },
    {
        "slug": "custom-web",
        "file": "service-custom-web.html",
        "icon": "monitor",
        "name": "Custom Web Solutions",
        "short": "Custom Web Solutions",
        "nav_desc": "Professional websites & web apps that win clients",
        "tagline": "A website that earns trust before the first call.",
        "hero_title": "Professional websites that help you win clients",
        "hero_sub": "We design and build fast, credible websites and web apps for startups, agencies and service businesses — with clear messaging, strong proof and lead capture built in, so your website works as hard as your sales team.",
        "audience": "Startups, agencies and service businesses",
        "problems": [
            "Your website doesn't reflect the quality of your work",
            "Visitors leave without understanding what you do",
            "You have no case studies or proof on the site",
            "Leads arrive through a basic form with no context",
            "Every small change needs a developer",
        ],
        "included": [
            ("layout", "Marketing websites", "Strategy, design and build for company and product websites."),
            ("target", "Landing pages for campaigns", "Focused pages built to convert paid and outbound traffic."),
            ("pen", "Messaging & conversion copywriting", "Clear positioning and page copy that speaks to your buyers."),
            ("award", "Case studies & proof sections", "Turn past projects into credible stories that sell."),
            ("users", "Lead capture & CRM integration", "Qualifying forms, booking and automatic CRM handoff."),
            ("code", "Web apps & client portals", "Dashboards, portals and internal tools on modern stacks."),
            ("gauge", "Speed, accessibility & SEO built in", "Fast pages that meet accessibility and SEO best practice."),
            ("settings", "Editable CMS", "Update pages, posts and case studies without a developer."),
        ],
        "promise": "Every site we build is designed to do one job well: turn the right visitors into qualified conversations.",
        "cta": "Tell us about your business and who you want to reach — we'll show you what a website that wins clients looks like.",
        "stack": ["Next.js", "React", "TypeScript", "Tailwind CSS", "Sanity", "WordPress", "Webflow", "Vercel", "HubSpot", "Cal.com", "Google Analytics"],
        "case": "fieldnote",
        "visual": "browser",
        "faq": [
            ("How long does a website take?", "A focused marketing site typically takes 4–8 weeks from approved scope, depending on content readiness and pages. (Timing to be confirmed by Xubitar.)"),
            ("Do you write the content?", "We can. Many clients give us raw material — calls, notes, past proposals — and we shape it into clear page copy."),
            ("Can we edit the site ourselves?", "Yes. We set up a CMS so your team can update pages, posts and case studies."),
            ("Do you build web apps too?", "Yes — client portals, dashboards and internal tools. We scope these separately after a discovery call."),
        ],
    },
]
SERVICES_BY_SLUG = {s["slug"]: s for s in SERVICES}

# Global engagement models
ENGAGEMENTS = [
    {"icon": "file-text", "name": "Fixed-scope project", "best": "New builds, integrations, custom apps, websites", "points": ["Written scope, price and timeline", "Milestones with staging previews", "Documented handoff"]},
    {"icon": "life-buoy", "name": "Monthly support plan", "best": "Ongoing fixes, improvements and maintenance", "points": ["Agreed development hours", "Response-time targets", "Monthly report"]},
    {"icon": "handshake", "name": "Agency partnership", "best": "Agencies that need white-label dev capacity", "points": ["Under your brand, NDA by default", "Fits your PM tools and process", "Capacity you can plan around"]},
]

SUPPORT_PLANS = [
    {"name": "Care", "price": "$590", "hours": "10 hrs / month", "response": "2 business days", "for": "Stores that need occasional fixes and a safety net.", "popular": False,
     "features": ["Bug fixes & small changes", "Monthly store health check", "Email & shared board", "Monthly summary report"]},
    {"name": "Growth", "price": "$1,390", "hours": "25 hrs / month", "response": "1 business day", "for": "Growing brands shipping improvements every month.", "popular": True,
     "features": ["Everything in Care", "Priority queue", "Shared Slack channel", "Integration & API monitoring", "Monthly roadmap call"]},
    {"name": "Partner", "price": "$2,990", "hours": "60 hrs / month", "response": "Same day for critical issues", "for": "High-volume merchants and agencies with multiple stores.", "popular": False,
     "features": ["Everything in Growth", "Dedicated lead developer", "Critical-issue response target", "Quarterly technical review", "Multi-store / agency use"]},
]

PROCESS = [
    ("01", "Discovery call", "A free 30-minute call to understand the problem, the result you want, timing and budget."),
    ("02", "Written scope", "A clear proposal with deliverables, price, timeline and who is responsible for what."),
    ("03", "Build & preview", "We build on a development or staging store and share progress every week."),
    ("04", "Test & launch", "QA on real devices and data, a launch checklist, and a calm go-live."),
    ("05", "Support & improve", "Documentation, handoff and optional monthly support to keep things running."),
]

COMMITMENTS = [
    ("clock", "Reply within one business day", "Every enquiry and support request gets a response from a real engineer."),
    ("file-text", "Scope in writing first", "Work, price, timing and responsibilities are agreed before we start."),
    ("eye", "Weekly previews", "See progress on a staging store — no surprises at the end."),
    ("lock", "You own everything", "Code, repositories, accounts and credentials belong to you."),
    ("book", "Documented handoff", "Clear notes so your team, or any developer, can maintain the work."),
    ("shield-check", "NDA & white-label ready", "Confidential by default, and invisible to your clients if you're an agency."),
]

# ---------------------------------------------------------------------------
# Case studies (ALL SAMPLE — replace with approved client work)
# ---------------------------------------------------------------------------
CASES = [
    {"slug": "northwind", "client": "Northwind Outdoor", "industry": "Outdoor gear · Shopify Plus", "cat": "integrations", "service": "Shopify Development & Integrations",
     "title": "Real-time NetSuite inventory sync that ended overselling", "summary": "Replaced a nightly CSV import with an event-driven Shopify ↔ NetSuite integration across 3 warehouses.",
     "metrics": [("0", "oversold orders in 90 days"), ("12 hrs", "saved per week"), ("< 2 min", "stock update time")], "color": "#1F3B2D", "tone": "dark", "mock": "sync"},
    {"slug": "luma", "client": "Luma Skincare", "industry": "Beauty · DTC", "cat": "store", "service": "Store renovation",
     "title": "A full store renovation that made mobile shopping fast", "summary": "Rebuilt an outdated theme on Online Store 2.0 with editable sections and a faster product page.",
     "metrics": [("+38%", "mobile conversion"), ("4.1s → 1.8s", "largest content load"), ("100%", "pages editable by the team")], "color": "#F1E4DA", "tone": "light", "mock": "store"},
    {"slug": "brightside", "client": "Brightside Coffee", "industry": "Food & beverage · Subscriptions", "cat": "ai", "service": "AI Automation",
     "title": "AI support triage that cut first-response time from hours to minutes", "summary": "n8n + AI workflow that sorts, tags and drafts replies for the support team to approve.",
     "metrics": [("62%", "tickets auto-drafted"), ("9h → 40m", "first response time"), ("100%", "replies human-approved")], "color": "#2B2118", "tone": "dark", "mock": "chat"},
    {"slug": "atlas", "client": "Atlas & Co. Agency", "industry": "Shopify agency · White-label", "cat": "agency", "service": "Agency partnership",
     "title": "White-label bundle app deployed across six agency clients", "summary": "A configurable bundling app with Shopify Functions, delivered under the agency's brand.",
     "metrics": [("6", "client stores launched"), ("3 weeks", "from scope to first launch"), ("0", "client-facing escalations")], "color": "#E7E9F5", "tone": "light", "mock": "app"},
    {"slug": "monohome", "client": "Mono Home", "industry": "Homeware · Shopify", "cat": "support", "service": "Support & Maintenance",
     "title": "Two years of calm: ongoing maintenance for a growing homeware brand", "summary": "A monthly support plan covering fixes, app updates, integrations and steady improvements.",
     "metrics": [("140+", "requests resolved"), ("3.1h", "average first response"), ("0", "checkout outages")], "color": "#ECE7DF", "tone": "light", "mock": "tickets"},
    {"slug": "fieldnote", "client": "Fieldnote Studio", "industry": "Startup · B2B SaaS", "cat": "web", "service": "Custom Web Solutions",
     "title": "A credible new website that tripled demo requests", "summary": "New positioning, case studies and a qualifying demo form on a fast Next.js site.",
     "metrics": [("3×", "demo requests"), ("98", "mobile performance score"), ("5 weeks", "from kickoff to launch")], "color": "#141821", "tone": "dark", "mock": "browser"},
    {"slug": "peak", "client": "Peak Supply Co.", "industry": "Workwear · Shopify", "cat": "seo", "service": "SEO & AI Search",
     "title": "Technical SEO and content structure for search and AI answers", "summary": "Fixed indexing issues, added structured data and rewrote key collection pages.",
     "metrics": [("+71%", "organic sessions"), ("14", "tracked queries citing the brand in AI answers"), ("2.3×", "indexed product pages")], "color": "#EAF0E6", "tone": "light", "mock": "answer"},
    {"slug": "kestrel", "client": "Kestrel Bikes", "industry": "Cycling · Pre-orders", "cat": "integrations", "service": "Shopify Development",
     "title": "Pre-order and deposit flow for limited bike launches", "summary": "Custom pre-order logic with partial payments and automated customer updates.",
     "metrics": [("$410k", "pre-sold before stock arrived"), ("0", "manual order edits"), ("2 weeks", "build time")], "color": "#1B2A3A", "tone": "dark", "mock": "store"},
]
CASES_BY_SLUG = {c["slug"]: c for c in CASES}

CASE_FILTERS = [
    ("all", "All work"), ("integrations", "Development & integrations"), ("store", "Store renovation"),
    ("support", "Support & maintenance"), ("ai", "AI automation"), ("seo", "SEO & AI search"),
    ("web", "Custom web"), ("agency", "Agency partnerships"),
]

TESTIMONIALS = [
    {"quote": "Xubitar replaced a fragile nightly import with an integration we never have to think about. They explained every decision in plain language.", "name": "Daniel Reeves", "role": "Head of Operations", "company": "Northwind Outdoor", "initials": "DR"},
    {"quote": "We've worked with a lot of developers. Xubitar is the first team that replies the same day and tells us honestly what something will take.", "name": "Sara Lindqvist", "role": "Founder", "company": "Mono Home", "initials": "SL"},
    {"quote": "They work like part of our agency. Our clients only ever see our brand, and the code we get back is clean and documented.", "name": "Marcus Hale", "role": "Managing Director", "company": "Atlas & Co.", "initials": "MH"},
    {"quote": "The new site finally explains what we do. Demo requests are up and sales calls start further along.", "name": "Priya Nair", "role": "Co-founder & CEO", "company": "Fieldnote Studio", "initials": "PN"},
]

LOGOS = ["NORTHWIND", "luma", "Atlas&Co.", "BRIGHTSIDE", "mono/home", "Peak Supply", "fieldnote", "KESTREL"]

HOME_FAQ = [
    ("Who do you work with?", "Shopify merchants and brands, startups that need a website or automation, and agencies that need a reliable white-label development partner."),
    ("How much does a project cost?", "It depends on scope. After a short discovery call we send a written proposal with a fixed price and timeline. Ongoing work is covered by monthly support plans."),
    ("Do you work white-label with agencies?", "Yes. We sign an NDA, work in your tools and under your brand, and never contact your clients unless you ask us to."),
    ("Who owns the code?", "You do. On final payment you own the code, repositories and credentials, with documentation for future developers."),
    ("How quickly do you respond?", "We reply to new enquiries within one business day. Support plans include agreed response targets."),
    ("Can you guarantee SEO rankings or AI citations?", "No one honestly can. We focus on sound technical foundations and useful content, and we report clearly on what changes."),
]

JOBS = [
    {"title": "Senior Shopify Developer", "team": "Engineering", "type": "Full-time", "location": "Remote / Hybrid", "tags": ["Liquid", "Shopify Functions", "React"]},
    {"title": "Full-stack Developer (Next.js)", "team": "Engineering", "type": "Full-time", "location": "Remote / Hybrid", "tags": ["Next.js", "TypeScript", "PostgreSQL"]},
    {"title": "AI Automation Engineer", "team": "Automation", "type": "Full-time", "location": "Remote", "tags": ["n8n", "LLM APIs", "Integrations"]},
    {"title": "SEO & Content Specialist", "team": "Growth", "type": "Contract", "location": "Remote", "tags": ["Technical SEO", "Content", "AI search"]},
]

TEAM = [
    {"name": "Team member", "role": "Founder & CEO", "initials": "XS"},
    {"name": "Team member", "role": "Head of Engineering", "initials": "HE"},
    {"name": "Team member", "role": "Lead Shopify Developer", "initials": "SD"},
    {"name": "Team member", "role": "AI Automation Lead", "initials": "AI"},
    {"name": "Team member", "role": "SEO & Content Lead", "initials": "SC"},
    {"name": "Team member", "role": "Client Success", "initials": "CS"},
]
