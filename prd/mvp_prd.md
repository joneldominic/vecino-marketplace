# Vecino Marketplace – Product Requirements Document (MVP‑focused)

<context>

## Overview

Vecino Marketplace is a lightweight web platform that connects local **Sellers** with **Buyers** in the Philippines. It solves the problem of fragmented neighborhood commerce by providing an online storefront where micro‑sellers can list products and buyers can discover, chat, and purchase using **cash‑on‑delivery (COD)**. The MVP targets fast time‑to‑value: minimal onboarding, single‑seller checkout, and basic order tracking.

## Core Features

| Feature                              | What it does                                                                                                         | Why it matters                                    | How it works (high level)                                                  |
| ------------------------------------ | -------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------- | -------------------------------------------------------------------------- |
| Account & Authentication             | Email / password sign‑up / login for Buyers and Sellers                                                              | Establishes identity & saves history              | Bcrypt‑hashed credentials, JWT session cookies                             |
| Product Listing                      | Sellers post items (title, description, price, ≤ 3 images, stock)                                                    | Gives Sellers an instant online shelf             | REST endpoints; images stored in S3‑compatible bucket                      |
| Product Discovery                    | Buyers browse & **search by keyword or category**                                                                    | Enables easy finding of items                     | Paginated feed + text index query                                          |
| Cart & Checkout (single Seller, COD) | Buyer adds items, places COD order                                                                                   | Simplest path to purchase, avoids payment gateway | One active cart per Buyer; transactional “order” doc written on checkout   |
| Order Management                     | Status flow **received → preparing → prepared → shipped → delivered → closed**, Buyer can cancel before **prepared** | Tracks fulfillment and sets expectations          | Seller dashboard buttons update order state; backend validates transitions |
| Buyer‑Seller Messaging               | 1‑to‑1 thread per product (30 s polling)                                                                             | Clarify product questions                         | Messages stored in `messages` collection; frontend polls                   |
| Ratings & Reviews                    | Post‑delivery 1‑5 ★ review + comment                                                                                 | Builds trust & quality signals                    | One review per order; product aggregates avg stars                         |
| Seller Analytics (basic)             | Sales totals & top products                                                                                          | Empowers Sellers with insights                    | Aggregation pipeline summarises orders                                     |
| In‑App Notifications                 | Order events & chat pings                                                                                            | Keeps users informed without email complexity     | WebSocket or SSE channel (lightweight)                                     |

## User Experience

### Personas

- **Maria (Buyer, 25)** – hunts for affordable local goods, values reviews and clear pricing.
- **Juan (Seller, 30)** – side‑hustle entrepreneur; wants frictionless listing & fast order alerts.

### Key Flows

1. **Buyer Journey**: browse → view product → add to cart → checkout (COD) → receive → review.
2. **Seller Journey**: sign‑up → list product → receive order notification → update status → view analytics.

### UI/UX Considerations

- Mobile‑first responsive design (60 % traffic expected on phones).
- Clear status badges and progress tracker in Buyer order history.
- Dark‑mode friendly color palette.
- Minimal forms; drag‑and‑drop image upload for Sellers.

</context>

<PRD>

## Technical Architecture

- **System Components**
  - Frontend SPA (React + Vite + Zustand + TanStack Query).
  - Backend API (NestJS).
  - MongoDB Atlas (single‑region, ap‑southeast‑1) with Mongoose ODM.
  - Redis for session store & ephemeral locks.
- **Data Models (core collections)**
  - `users` (Buyer/Seller flag, auth fields)
  - `products` (sellerId, title, price, images[], stock, isDeleted)
  - `orders` (buyerId, sellerId, items[], status, history[], cancelRequested)
  - `messages` (orderId or productId, fromUserId, text, ts)
  - `reviews` (orderId, productId, buyerId, rating, comment)
- **APIs & Integrations**
  - REST/JSON endpoints grouped by service (auth, product, cart, order, review, message).
  - AWS S3 for image storage; presigned‑URL upload flow.
  - SMS/email integrations postponed—only push via in‑app channel.
- **Infrastructure Requirements**
  - Deployed on AWS Elastic Beanstalk (Node) + S3 + CloudFront.
  - Automatic HTTPS via ACM; daily backups via MongoDB Atlas.
  - **Architectural Practices**
    - Domain‑Driven Design (DDD): bounded contexts (Catalog, Ordering, Messaging), entities/aggregates, repository interfaces.
    - Test‑Driven Development (TDD): write failing tests first with Jest; CI blocks merges when coverage < 80 %.

## Development Roadmap

### Phase 0 – Foundation (Tech Skeleton)

- Repo setup, CI lint/test pipeline.
- Environment configs & Docker files.
- Establish base domain model (DDD) and folder structure.
- Set up Jest test harness (TDD).

### Phase 1 – MVP Core

- Auth & Account Service
- Product CRUD + image upload
- Product discovery (browse, search)
- Cart & single‑seller COD checkout
- Order state machine + Buyer cancel
- Buyer‑Seller messaging (polling)
- Basic Seller dashboard (orders list)

### Phase 2 – Enhanced Engagement

- Ratings & Reviews
- Seller analytics totals
- In‑app notification center

### Phase 3 – Operational Hardening

- Admin console (user/product moderation)
- Automated tests & load tests
- Optional payment gateway spike

## Logical Dependency Chain

1. **Auth** → prerequisite for everything.
2. **Product CRUD** before discovery UI.
3. **Cart & Order service** depends on Product; minimal UI shipped ASAP for smoke testing.
4. **Messaging** can layer on existing Auth + Product ids.
5. **Reviews & Analytics** rely on Order completion events.
6. Notifications tie into orders & messaging after they exist.

## Risks and Mitigations

| Risk                                      | Challenge                           | Mitigation                                                                                          |
| ----------------------------------------- | ----------------------------------- | --------------------------------------------------------------------------------------------------- |
| Data integrity without RDBMS foreign keys | Orphaned refs / inconsistent status | Use Mongoose population tests + integration tests; consider MongoDB transactions on critical writes |
| Scope creep (payment, multi‑seller cart)  | Delays MVP                          | Explicit phased roadmap; backlog gating                                                             |
| Resource constraints (small team)         | Parallel feature overload           | Logical dependency chain ensures single focus per sprint                                            |
| Spam registrations                        | Bot abuse                           | CAPTCHA at sign‑up, rate‑limit auth APIs                                                            |

## Appendix

- **Research**: Local COD adoption rates, logistics partner costs.
- **Non‑functional**: OWASP Top‑10, 99 % uptime, P95 page load < 2 s.
- **Glossary**: COD, PWA, TTL, etc.

</PRD>
