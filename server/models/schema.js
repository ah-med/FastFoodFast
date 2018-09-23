import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import db from './db';


dotenv.config();

const adminPassword = bcrypt.hashSync(process.env.ADMIN_PASSWORD, 10);

const tableSchema = `
    DROP TABLE IF EXISTS users CASCADE;

    DROP TABLE IF EXISTS orders CASCADE;

    DROP TABLE IF EXISTS menu CASCADE;

    CREATE TABLE "users" (
      "user_id" serial NOT NULL,
      "first_name" TEXT,
      "last_name" TEXT,
      "email" TEXT NOT NULL UNIQUE,
      "password" TEXT NOT NULL,
      "role" TEXT NOT NULL,
      CONSTRAINT users_pk PRIMARY KEY ("user_id")
    ) WITH (
      OIDS=FALSE
    );
    
    CREATE TABLE "orders" (
      "order_id" serial NOT NULL,
      "status" TEXT NOT NULL,
      "user_id" int NOT NULL,
      "address" TEXT NOT NULL,
      "phone_number" TEXT NOT NULL,
      "total_amount" int NOT NULL,
      "date_created" TIMESTAMP NOT NULL,
      "last_updated" TIMESTAMP NOT NULL,
      "order_items" json NOT NULL,
      CONSTRAINT orders_pk PRIMARY KEY ("order_id")
    ) WITH (
      OIDS=FALSE
    );
    
    CREATE TABLE "menu" (
      "food_id" serial NOT NULL,
      "food_name" TEXT NOT NULL,
      "price" int NOT NULL,
      "image_url" TEXT NOT NULL,
      "category" TEXT NOT NULL,
      CONSTRAINT menu_pk PRIMARY KEY ("food_id")
    ) WITH (
      OIDS=FALSE
    );
    
    ALTER TABLE "orders" ADD CONSTRAINT "orders_fk0" FOREIGN KEY ("user_id") REFERENCES "users"("user_id");
    
    INSERT INTO users ( 
        first_name, last_name, 
        email, 
        password, 
        role
      ) 
    VALUES (
        'Admin', 
        'Admin', 
        'admin@mail.com', 
        '${adminPassword}', 
        'admin'
    );
`;
db.query(tableSchema, (err) => {
  if (err) {
    throw (err);
  }
});
