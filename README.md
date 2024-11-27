# coney

## Known shit for PostgreSQL and Drizzle

If you run into any issues with PostgreSQL and Drizzle, while pushing the schema to the database, you can try the following:

```sql
ALTER TABLE "subcategory" ALTER COLUMN "id" SET DATA TYPE uuid USING id::uuid;
ALTER TABLE "category" ALTER COLUMN "id" SET DATA TYPE uuid USING id::uuid;
ALTER TABLE "recipient" ALTER COLUMN "id" SET DATA TYPE uuid USING id::uuid;
ALTER TABLE "payment_method" ALTER COLUMN "id" SET DATA TYPE uuid USING id::uuid;
```
