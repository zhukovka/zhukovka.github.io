export interface Post {
  date: string
  tag: string
  read: string
  title: string
  dek: string
}

export const POSTS: Post[] = [
  { date: '2026-10-06', tag: 'Postgres', read: '14 min', title: 'The vacuum that ate our Tuesday', dek: 'A long-running transaction, a bloated index, and what autovacuum was quietly telling us for three weeks.' },
  { date: '2026-09-22', tag: 'Rust', read: '11 min', title: 'Lifetimes are a design review you can’t skip', dek: 'Why fighting the borrow checker usually means the ownership model of your code is unclear to humans too.' },
  { date: '2026-09-08', tag: 'Distributed', read: '18 min', title: 'Clocks lie: a field guide to ordering events', dek: 'Lamport timestamps, hybrid logical clocks, and the production incident that made us care.' },
  { date: '2026-08-25', tag: 'Compilers', read: '9 min', title: 'Writing a tiny register allocator in a weekend', dek: 'Linear scan, spill heuristics, and the one test case that broke everything.' },
  { date: '2026-08-11', tag: 'Kubernetes', read: '12 min', title: 'Readiness probes are a contract, not a health check', dek: 'How a single misconfigured probe cascaded into a fleet-wide rollout stall.' },
  { date: '2026-07-28', tag: 'Career', read: '7 min', title: 'What I look for in a design doc now', dek: 'Fewer diagrams, more stated non-goals, and a section titled “how this fails.”' },
  { date: '2026-07-14', tag: 'Distributed', read: '15 min', title: 'Idempotency keys, end to end', dek: 'From the client retry loop to the database constraint, and every place they get dropped.' },
  { date: '2026-06-30', tag: 'Rust', read: '10 min', title: 'Async cancellation is a footgun with a manual', dek: 'Dropping a future mid-await, and the invariants that silently stop holding.' },
]

export const ALL_TOPICS = 'All'

export const TOPICS = [ALL_TOPICS, 'Rust', 'Postgres', 'Distributed', 'Compilers', 'Kubernetes', 'Career']
