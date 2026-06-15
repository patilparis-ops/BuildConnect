
[+] Added Schemas
  - public

[+] Added tables
  - users
  - customers
  - contractors
  - admins
  - projects
  - quotations
  - reviews
  - portfolio_items
  - certifications
  - password_reset_tokens
  - notifications

[*] Changed the `admins` table
  [+] Added unique index on columns (userId)
  [+] Added foreign key on columns (userId)

[*] Changed the `certifications` table
  [+] Added foreign key on columns (contractorId)

[*] Changed the `contractors` table
  [+] Added unique index on columns (userId)
  [+] Added foreign key on columns (userId)

[*] Changed the `customers` table
  [+] Added unique index on columns (userId)
  [+] Added foreign key on columns (userId)

[*] Changed the `notifications` table
  [+] Added foreign key on columns (userId)

[*] Changed the `password_reset_tokens` table
  [+] Added unique index on columns (tokenHash)
  [+] Added index on columns (tokenHash)
  [+] Added foreign key on columns (userId)

[*] Changed the `portfolio_items` table
  [+] Added foreign key on columns (contractorId)

[*] Changed the `projects` table
  [+] Added foreign key on columns (customerId)

[*] Changed the `quotations` table
  [+] Added unique index on columns (projectId, contractorId)
  [+] Added foreign key on columns (projectId)
  [+] Added foreign key on columns (contractorId)

[*] Changed the `reviews` table
  [+] Added unique index on columns (projectId, customerId)
  [+] Added foreign key on columns (projectId)
  [+] Added foreign key on columns (customerId)
  [+] Added foreign key on columns (contractorId)

[*] Changed the `users` table
  [+] Added unique index on columns (email)

